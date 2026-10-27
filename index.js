/**
 * Host half of the `@local/exam-practice` bundle.
 *
 * Two responsibilities:
 *  1. Serve a read-only JSON endpoint the Web UI uses to load the question bank:
 *       GET /exam-practice/api/bank    -> { ok, papers, warnings, bankDir, updatedAt }
 *       GET /exam-practice/api/health  -> { ok, plugin }
 *     The bank directory is scanned on every request, so a bank the AI just wrote
 *     into `bank/*.json` shows up after a refresh without reinstalling anything.
 *  2. Expose the same bank store to the agent as the `exam_practice_bank` tool, so
 *     "帮我把这套四六级题导入" is one tool call instead of hand-written files.
 *
 * The bank directory defaults to `<package dir>/bank`. Every `*.json` file may
 * contain `{ "papers": [...] }`, a bare array of papers, or one paper object.
 */

import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const DEFAULT_BANK_DIR = path.join(HERE, 'bank')
const ROUTE_PREFIX = '/exam-practice'
const LEVEL_WEIGHT = { CET4: 4, CET6: 6 }
const SAFE_FILE_NAME = /^[a-z0-9][a-z0-9._-]*\.json$/i
const MAX_IMPORT_BYTES = 2 * 1024 * 1024

export const inject = ['webServer', 'tools']

export function apply(ctx, config) {
  const options = config && typeof config === 'object' ? config : {}
  const bankDir = stringOr(options.bankDir, DEFAULT_BANK_DIR)

  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix',
    path: ROUTE_PREFIX,
    handler: (req, res) => handleRequest(req, res, bankDir),
  }))

  ctx.effect(() => ctx.tools.register(createBankTool(bankDir)))
}

/* ------------------------------------------------------------------ HTTP --- */

async function handleRequest(req, res, bankDir) {
  try {
    if (!isTrustedRequest(req)) {
      req.resume()
      return sendJson(res, 403, { ok: false, error: 'forbidden' })
    }
    const method = String(req.method || 'GET').toUpperCase()
    if (method !== 'GET' && method !== 'HEAD') {
      req.resume()
      return sendJson(res, 405, { ok: false, error: 'method not allowed' })
    }

    const url = new URL(String(req.url || '/'), 'http://localhost')
    const pathname = trimTrailingSlash(url.pathname)

    if (pathname === ROUTE_PREFIX + '/api/health') {
      return sendJson(res, 200, { ok: true, plugin: '@local/exam-practice' })
    }
    if (pathname === ROUTE_PREFIX + '/api/bank') {
      const bank = await loadBank(bankDir)
      return sendJson(res, 200, {
        ok: true,
        papers: bank.papers,
        warnings: bank.warnings,
        bankDir,
        files: bank.files,
        updatedAt: new Date().toISOString(),
      })
    }
    return sendJson(res, 404, {
      ok: false,
      error: 'not found',
      routes: [ROUTE_PREFIX + '/api/bank', ROUTE_PREFIX + '/api/health'],
    })
  } catch (error) {
    return sendJson(res, 500, { ok: false, error: errorMessage(error) })
  }
}

/* ------------------------------------------------------------------ bank --- */

async function loadBank(bankDir) {
  const warnings = []
  const files = []
  let names = []
  try {
    names = await readdir(bankDir)
  } catch (error) {
    return {
      papers: [],
      files,
      warnings: ['题库目录不可读：' + bankDir + '（' + errorMessage(error) + '）'],
    }
  }

  const papers = []
  const seen = new Set()
  for (const name of names.filter(isJsonFile).sort()) {
    files.push(name)
    let parsed
    try {
      parsed = JSON.parse(await readFile(path.join(bankDir, name), 'utf8'))
    } catch (error) {
      warnings.push(name + '：JSON 解析失败（' + errorMessage(error) + '）')
      continue
    }
    const list = toPaperList(parsed)
    if (!list.length) {
      warnings.push(name + '：没有发现 papers 数组')
      continue
    }
    for (const raw of list) {
      const paper = normalizePaper(raw)
      if (!paper) {
        warnings.push(name + '：跳过缺少 id/title 的 paper')
        continue
      }
      if (seen.has(paper.id)) {
        warnings.push(name + '：paper id 重复，已跳过 ' + paper.id)
        continue
      }
      seen.add(paper.id)
      papers.push(paper)
    }
  }

  papers.sort(comparePapers)
  return { papers, files, warnings }
}

function toPaperList(parsed) {
  if (Array.isArray(parsed)) return parsed
  if (parsed && Array.isArray(parsed.papers)) return parsed.papers
  if (parsed && typeof parsed === 'object' && parsed.id) return [parsed]
  return []
}

function normalizePaper(raw) {
  if (!raw || typeof raw !== 'object') return undefined
  const id = stringOr(raw.id, '')
  const title = stringOr(raw.title, '')
  if (!id || !title) return undefined

  const level = String(stringOr(raw.level, 'CET4')).toUpperCase() === 'CET6' ? 'CET6' : 'CET4'
  const sections = []
  const rawSections = Array.isArray(raw.sections) ? raw.sections : []
  rawSections.forEach((rawSection, sectionIndex) => {
    if (!rawSection || typeof rawSection !== 'object') return
    const section = normalizeSection(rawSection, sectionIndex)
    if (section) sections.push(section)
  })

  const durationMinutes = Number(raw.durationMinutes)
  return {
    id,
    title,
    level,
    year: stringOr(raw.year, ''),
    durationMinutes: Number.isFinite(durationMinutes) && durationMinutes > 0 ? Math.round(durationMinutes) : 130,
    tags: Array.isArray(raw.tags) ? raw.tags.filter((tag) => typeof tag === 'string') : [],
    sections,
  }
}

function normalizeSection(raw, sectionIndex) {
  const id = stringOr(raw.id, 'section-' + (sectionIndex + 1))
  const title = stringOr(raw.title, id)
  const type = stringOr(raw.type, 'reading')
  const questions = []
  const rawQuestions = Array.isArray(raw.questions) ? raw.questions : []
  rawQuestions.forEach((rawQuestion, questionIndex) => {
    if (!rawQuestion || typeof rawQuestion !== 'object') return
    const question = normalizeQuestion(rawQuestion, id, questionIndex)
    if (question) questions.push(question)
  })
  const wordLimit = Number(raw.wordLimit)
  return {
    id,
    title,
    type,
    prompt: stringOr(raw.prompt, ''),
    promptZh: stringOr(raw.promptZh, ''),
    reference: stringOr(raw.reference, ''),
    wordLimit: Number.isFinite(wordLimit) && wordLimit > 0 ? wordLimit : undefined,
    note: stringOr(raw.note, ''),
    passage: stringOr(raw.passage, ''),
    audio: stringOr(raw.audio, ''),
    questions,
  }
}

function normalizeQuestion(raw, sectionId, questionIndex) {
  const options = Array.isArray(raw.options)
    ? raw.options.map((option) => String(option)).filter((option) => option.trim().length > 0)
    : []
  const kind = stringOr(raw.kind, options.length ? 'choice' : 'blank') === 'blank' ? 'blank' : 'choice'
  const answer = stringOr(raw.answer, '')
  if (!answer) return undefined
  const id = stringOr(raw.id, sectionId + '-q' + (questionIndex + 1))
  return {
    id,
    kind,
    stem: stringOr(raw.stem, ''),
    transcript: stringOr(raw.transcript, ''),
    options,
    answer,
    explanation: stringOr(raw.explanation, ''),
  }
}

function comparePapers(left, right) {
  const levelDelta = (LEVEL_WEIGHT[left.level] || 0) - (LEVEL_WEIGHT[right.level] || 0)
  if (levelDelta !== 0) return levelDelta
  if (left.year !== right.year) return String(right.year).localeCompare(String(left.year))
  return String(left.title).localeCompare(String(right.title), 'zh-Hans-CN')
}

/* ------------------------------------------------------------- agent tool --- */

function createBankTool(bankDir) {
  return {
    name: 'exam_practice_bank',
    description:
      'Manage the CET-4/6 (四六级) practice question bank used by the "四六级刷题" panel in the Web UI. '
      + 'Use action "list" to see imported papers, "import" to add or replace a bank file with papers you generated '
      + 'from user material (the panel picks it up on refresh), and "remove" to delete a bank file. '
      + 'A paper must contain id, title, level (CET4|CET6), year, sections[]; each section has id, title, '
      + 'type (writing|listening|reading|translation), optional prompt/promptZh/reference/note and questions[]; '
      + 'each question has id, kind (choice|blank), stem, options[] for choice, answer, explanation.',
    parameters: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['list', 'import', 'remove'],
          description: 'list the bank, import papers into a bank file, or remove a bank file.',
        },
        fileName: {
          type: 'string',
          description: 'Bank file name, e.g. "cet4-2024-12.json" (lowercase letters, digits, dot, dash, underscore).',
        },
        papers: {
          type: 'array',
          description: 'Papers to import; required for action "import".',
          items: { type: 'object', additionalProperties: true },
        },
      },
      required: ['action'],
      additionalProperties: false,
    },
    output: {
      schema: { type: 'object', additionalProperties: true },
      render(_args, value) {
        return [{ type: 'text', text: JSON.stringify(value, null, 2) }]
      },
    },
    async execute(args) {
      const input = args && typeof args === 'object' ? args : {}
      const action = stringOr(input.action, 'list')
      if (action === 'list') {
        const bank = await loadBank(bankDir)
        return {
          ok: true,
          bankDir,
          files: bank.files,
          warnings: bank.warnings,
          papers: bank.papers.map((paper) => ({
            id: paper.id,
            title: paper.title,
            level: paper.level,
            year: paper.year,
            sections: paper.sections.map((section) => ({
              id: section.id,
              type: section.type,
              title: section.title,
              questions: section.questions.length,
            })),
          })),
        }
      }

      if (action === 'import') {
        const papers = Array.isArray(input.papers) ? input.papers : []
        if (!papers.length) return { ok: false, error: 'papers 不能为空' }
        const invalid = papers.map((paper) => normalizePaper(paper)).filter((paper) => !paper)
        if (invalid.length) return { ok: false, error: '有 paper 缺少 id/title/sections' }
        const normalized = papers.map((paper) => normalizePaper(paper))
        const serialized = JSON.stringify({ papers: normalized }, null, 2)
        if (Buffer.byteLength(serialized) > MAX_IMPORT_BYTES) {
          return { ok: false, error: '题库文件过大（上限 2MB）' }
        }
        const fileName = resolveFileName(input.fileName, normalized[0].id)
        if (!fileName) return { ok: false, error: 'fileName 非法，只能使用字母数字点横线下划线' }
        await mkdir(bankDir, { recursive: true })
        await writeFile(path.join(bankDir, fileName), serialized, 'utf8')
        return {
          ok: true,
          bankDir,
          fileName,
          imported: normalized.map((paper) => ({
            id: paper.id,
            title: paper.title,
            level: paper.level,
            sections: paper.sections.length,
            questions: paper.sections.reduce((total, section) => total + section.questions.length, 0),
          })),
          note: '已写入题库。让用户在「四六级刷题」面板点一下刷新即可看到。',
        }
      }

      if (action === 'remove') {
        const fileName = resolveFileName(input.fileName, '')
        if (!fileName) return { ok: false, error: 'fileName 非法' }
        try {
          await rm(path.join(bankDir, fileName))
        } catch (error) {
          return { ok: false, error: errorMessage(error) }
        }
        return { ok: true, bankDir, removed: fileName }
      }

      return { ok: false, error: '未知 action：' + action }
    },
  }
}

function resolveFileName(fileName, fallbackId) {
  const raw = stringOr(fileName, '').trim()
  if (raw) return SAFE_FILE_NAME.test(raw) ? raw : undefined
  const id = stringOr(fallbackId, '').trim().toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '')
  if (!id) return undefined
  return (SAFE_FILE_NAME.test(id + '.json') ? id : 'bank') + '.json'
}

/* ----------------------------------------------------------------- utils --- */

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload)
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Content-Length', Buffer.byteLength(body))
  res.end(body)
}

function isJsonFile(name) {
  return /\.json$/i.test(name)
}

/**
 * These routes are plain HTTP and carry no Harness admission, so keep them to the
 * machine that serves the GUI: loopback sockets, or a same-host browser origin.
 */
function isTrustedRequest(req) {
  if (isLoopbackAddress(req && req.socket && req.socket.remoteAddress)) return true
  const headers = (req && req.headers) || {}
  const origin = typeof headers.origin === 'string' ? headers.origin : ''
  const host = typeof headers.host === 'string' ? headers.host : ''
  if (!origin || !host) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

function isLoopbackAddress(address) {
  if (typeof address !== 'string' || !address) return false
  const value = address.toLowerCase()
  return value === '::1' || value === '127.0.0.1' || value.startsWith('127.') || value.startsWith('::ffff:127.')
}

function trimTrailingSlash(value) {
  const trimmed = String(value || '/').replace(/\/+$/, '')
  return trimmed || '/'
}

function stringOr(value, fallback) {
  if (typeof value === 'string') return value
  return fallback === undefined ? '' : fallback
}

function errorMessage(error) {
  if (error && typeof error === 'object' && 'message' in error) return String(error.message)
  return String(error)
}
