window.__ModuleLoader__.load({
  id: '@local/exam-practice',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const NS = 'exam-practice';
    const STORAGE_KEY = 'exam-practice.progress.v1';
    const BANK_URL = '/exam-practice/api/bank';
    const DEFAULT_BANK_DIR = 'exam-practice-plugin/bank/';
    const SECTION_TYPES = ['writing', 'listening', 'reading', 'translation'];

    /* ------------------------------------------------------------------ */
    /* Dictionaries (Chinese is complete; English covers all key labels)   */
    /* ------------------------------------------------------------------ */

    const zh = {
      'panel.title': '四六级刷题',
      'panel.subtitle': '写作 / 听力 / 阅读 / 翻译在线练习，交卷后自动判分并回顾错题。',

      'bank.sourceHost': 'Host 题库',
      'bank.sourceDemo': '内置示例',
      'bank.updated': '更新于 {time}',
      'bank.refresh': '刷新',
      'bank.refreshing': '刷新中…',
      'bank.loading': '正在加载题库…',
      'bank.emptyTitle': '题库还是空的',
      'bank.emptyDesc': '让 AI 按下方模板把题目写入题库目录，然后点「刷新」。',
      'bank.emptyFilter': '该分级暂无试题',
      'bank.demoNotice': '未连接 Host 题库，当前展示内置示例题库（8 道客观题 + 写作/翻译参考）。',
      'bank.filterLabel': '按等级筛选',
      'bank.missingPaper': '这套题已不在题库中，可能刚被刷新移除。',
      'bank.warn': '题库提示：{text}',

      'filter.all': '全部',
      'filter.cet4': 'CET-4',
      'filter.cet6': 'CET-6',

      'paper.level4': 'CET-4',
      'paper.level6': 'CET-6',
      'paper.questions': '{count} 题',
      'paper.sections': '{count} 个部分',
      'paper.duration': '{minutes} 分钟',
      'paper.lastScore': '上次成绩 {correct}/{total}（{percent}%）',
      'paper.answeredOnly': '已答 {answered}/{total}',
      'paper.start': '开始做题',
      'paper.continue': '继续',
      'paper.viewResult': '查看结果',
      'paper.untitled': '未命名试卷',

      'section.writing': '写作 Writing',
      'section.listening': '听力 Listening',
      'section.reading': '阅读 Reading',
      'section.translation': '翻译 Translation',
      'section.questionsCount': '{count} 题',
      'section.uncounted': '不计分',

      'exam.back': '返回题库',
      'exam.timer': '用时 {time}',
      'exam.progress': '已答 {answered}/{total}',
      'exam.submit': '交卷',
      'exam.submitConfirm': '还有 {count} 题未作答，确定交卷吗？',
      'exam.submitConfirmOk': '确定交卷',
      'exam.cancel': '取消',
      'exam.modeWrong': '错题练习',
      'exam.mark': '标记',
      'exam.marked': '已标记',
      'exam.transcript': '听力文字稿',
      'exam.hideTranscript': '收起文字稿',
      'exam.showReference': '显示参考范文/译文',
      'exam.hideReference': '收起参考范文/译文',
      'exam.noReference': '暂无参考范文/译文。',
      'exam.blankPlaceholder': '输入答案',
      'exam.questionAria': '第 {number} 题',
      'exam.unanswered': '还有 {count} 题未作答',
      'exam.unsupportedKind': '暂不支持该题型。',
      'exam.wordLimit': '建议字数：{count} 词',

      'review.resultTitle': '本套结果',
      'review.score': '得分',
      'review.correctOfTotal': '客观题正确 {correct} / {total}',
      'review.percent': '正确率',
      'review.elapsed': '用时',
      'review.submittedAt': '交卷时间',
      'review.sectionStats': '各部分正确率',
      'review.uncounted': '主观题不计分',
      'review.reviewTitle': '逐题回顾',
      'review.wrongTitle': '错题列表',
      'review.noWrong': '没有错题，这套题做得不错。',
      'review.practiceWrong': '只练错题',
      'review.redo': '重做本套',
      'review.back': '返回题库',
      'review.yourAnswer': '你的答案',
      'review.correctAnswer': '正确答案',
      'review.unansweredAnswer': '未作答',
      'review.explanation': '解析',
      'review.marked': '已标记',
      'review.questionNo': '第 {number} 题',
      'review.subjectiveHint': '主观题，无客观答案。',
      'review.subjectiveNote': '写作与翻译不计分，请对照参考范文/译文自评。',
      'review.sectionScore': '{correct}/{total}',

      'import.title': '让 AI 帮你导入题型',
      'import.desc': '题库是普通 JSON 文件，AI 可以直接写入目录。题库目录：',
      'import.dirLabel': '题库目录',
      'import.promptLabel': '提示词模板',
      'import.copy': '复制提示词',
      'import.copied': '已复制',
      'import.copyFail': '复制失败，请在文本框里手动全选复制。',
      'import.hint': '在对话里让 AI 按模板导入后，回到本页点「刷新」即可看到新题。',
      'import.formatHint': '文件格式：{ "papers": [ ... ] }，每个 paper 含 id / title / level / year / durationMinutes / sections。',

      'audio.title': '听力音频',
      'audio.hint': '建议先听一遍再作答',
      'audio.play': '播放',
      'audio.pause': '暂停',
      'audio.resume': '继续',
      'audio.stop': '停止',
      'audio.playAll': '播放全部',
      'audio.rate': '语速',
      'audio.voice': '音色',
      'audio.voiceDefault': '默认',
      'audio.showTranscript': '显示文字稿',
      'audio.hideTranscript': '隐藏文字稿',
      'audio.statusReady': '就绪',
      'audio.statusPlaying': '播放中',
      'audio.statusPaused': '已暂停',
      'audio.statusStopped': '已停止',
      'audio.unsupported': '当前浏览器不支持语音合成，请展开文字稿阅读。',
      'audio.materialN': '听力材料 {n}',
      'audio.empty': '本部分暂无音频文字稿。',
      'audio.rateRestart': '修改语速或音色后会从头重播当前材料。',
      'audio.error': '播放失败，可展开文字稿阅读。',
      'audio.native': '原始音频',

      'error.title': '这个面板出了点问题',
      'error.retry': '重试',
    };

    const en = {
      'panel.title': 'CET Practice',
      'panel.subtitle': 'Practice CET-4/6 writing, listening, reading and translation with auto-marking and review.',

      'bank.sourceHost': 'Host bank',
      'bank.sourceDemo': 'Built-in demo',
      'bank.updated': 'Updated {time}',
      'bank.refresh': 'Refresh',
      'bank.refreshing': 'Refreshing…',
      'bank.loading': 'Loading question bank…',
      'bank.emptyTitle': 'The bank is empty',
      'bank.emptyDesc': 'Ask the AI to import papers with the template below, then hit Refresh.',
      'bank.emptyFilter': 'No papers for this level',
      'bank.demoNotice': 'Host bank is not reachable. Showing the built-in demo paper (8 objective questions plus writing/translation references).',
      'bank.filterLabel': 'Filter by level',
      'bank.missingPaper': 'This paper is no longer in the bank; it may have been removed by a refresh.',
      'bank.warn': 'Bank notice: {text}',

      'filter.all': 'All',
      'filter.cet4': 'CET-4',
      'filter.cet6': 'CET-6',

      'paper.level4': 'CET-4',
      'paper.level6': 'CET-6',
      'paper.questions': '{count} questions',
      'paper.sections': '{count} parts',
      'paper.duration': '{minutes} min',
      'paper.lastScore': 'Last score {correct}/{total} ({percent}%)',
      'paper.answeredOnly': 'Answered {answered}/{total}',
      'paper.start': 'Start',
      'paper.continue': 'Continue',
      'paper.viewResult': 'View result',
      'paper.untitled': 'Untitled paper',

      'section.writing': 'Writing',
      'section.listening': 'Listening',
      'section.reading': 'Reading',
      'section.translation': 'Translation',
      'section.questionsCount': '{count} questions',
      'section.uncounted': 'Not scored',

      'exam.back': 'Back to bank',
      'exam.timer': 'Time {time}',
      'exam.progress': 'Answered {answered}/{total}',
      'exam.submit': 'Submit',
      'exam.submitConfirm': '{count} questions are still unanswered. Submit anyway?',
      'exam.submitConfirmOk': 'Submit',
      'exam.cancel': 'Cancel',
      'exam.modeWrong': 'Wrong answers only',
      'exam.mark': 'Mark',
      'exam.marked': 'Marked',
      'exam.transcript': 'Transcript',
      'exam.hideTranscript': 'Hide transcript',
      'exam.showReference': 'Show reference',
      'exam.hideReference': 'Hide reference',
      'exam.noReference': 'No reference answer provided.',
      'exam.blankPlaceholder': 'Type your answer',
      'exam.questionAria': 'Question {number}',
      'exam.unanswered': '{count} unanswered',
      'exam.unsupportedKind': 'This question type is not supported yet.',
      'exam.wordLimit': 'Suggested length: {count} words',

      'review.resultTitle': 'Result',
      'review.score': 'Score',
      'review.correctOfTotal': 'Correct {correct} / {total} objective questions',
      'review.percent': 'Accuracy',
      'review.elapsed': 'Time spent',
      'review.submittedAt': 'Submitted',
      'review.sectionStats': 'Accuracy by part',
      'review.uncounted': 'Subjective, not scored',
      'review.reviewTitle': 'Question review',
      'review.wrongTitle': 'Wrong answers',
      'review.noWrong': 'No wrong answers. Good job.',
      'review.practiceWrong': 'Practice wrong',
      'review.redo': 'Redo this paper',
      'review.back': 'Back to bank',
      'review.yourAnswer': 'Your answer',
      'review.correctAnswer': 'Correct answer',
      'review.unansweredAnswer': 'Unanswered',
      'review.explanation': 'Explanation',
      'review.marked': 'Marked',
      'review.questionNo': 'Q{number}',
      'review.subjectiveHint': 'Subjective question, no objective answer.',
      'review.subjectiveNote': 'Writing and translation are not scored; compare your work with the reference.',
      'review.sectionScore': '{correct}/{total}',

      'import.title': 'Let the AI import papers',
      'import.desc': 'The bank is plain JSON, so the AI can write files into the directory. Bank directory:',
      'import.dirLabel': 'Bank directory',
      'import.promptLabel': 'Prompt template',
      'import.copy': 'Copy prompt',
      'import.copied': 'Copied',
      'import.copyFail': 'Copy failed. Select the text and copy it manually.',
      'import.hint': 'After the AI imports the paper, return here and press Refresh.',
      'import.formatHint': 'File format: { "papers": [ ... ] }; every paper has id / title / level / year / durationMinutes / sections.',

      'audio.title': 'Listening audio',
      'audio.hint': 'Listen once before you answer',
      'audio.play': 'Play',
      'audio.pause': 'Pause',
      'audio.resume': 'Resume',
      'audio.stop': 'Stop',
      'audio.playAll': 'Play all',
      'audio.rate': 'Speed',
      'audio.voice': 'Voice',
      'audio.voiceDefault': 'Default',
      'audio.showTranscript': 'Show transcript',
      'audio.hideTranscript': 'Hide transcript',
      'audio.statusReady': 'Ready',
      'audio.statusPlaying': 'Playing',
      'audio.statusPaused': 'Paused',
      'audio.statusStopped': 'Stopped',
      'audio.unsupported': 'Speech synthesis is not available in this browser. Please open the transcript.',
      'audio.materialN': 'Listening material {n}',
      'audio.empty': 'No audio transcript in this part.',
      'audio.rateRestart': 'Changing speed or voice restarts the current material.',
      'audio.error': 'Playback failed. You can open the transcript.',
      'audio.native': 'Original audio',

      'error.title': 'This panel hit a problem',
      'error.retry': 'Retry',
    };

    /* ------------------------------------------------------------------ */
    /* Small helpers                                                       */
    /* ------------------------------------------------------------------ */

    let activeTranslate = null;

    function fmt(template, vars) {
      if (typeof template !== 'string') return '';
      if (!vars) return template;
      return template.replace(/\{(\w+)\}/g, function (match, name) {
        return vars[name] === undefined || vars[name] === null ? match : String(vars[name]);
      });
    }

    function fallbackTranslate(key) {
      const value = zh[key];
      return typeof value === 'string' ? value : key;
    }

    function resolveTranslate(candidate) {
      const base = typeof candidate === 'function'
        ? candidate
        : (typeof activeTranslate === 'function' ? activeTranslate : null);
      return function translate(key, vars) {
        let text;
        if (base) {
          try { text = base(key); } catch (err) { text = undefined; }
        }
        if (typeof text !== 'string' || text === '' || text === key) text = fallbackTranslate(key);
        return fmt(text, vars);
      };
    }

    function asText(value) {
      return value === undefined || value === null ? '' : String(value);
    }

    function asArray(value) {
      return Array.isArray(value) ? value : [];
    }

    function isPlainObject(value) {
      return !!value && typeof value === 'object' && !Array.isArray(value);
    }

    function pad2(value) {
      return value < 10 ? '0' + value : String(value);
    }

    function formatDuration(ms) {
      const total = Math.max(0, Math.floor((Number(ms) || 0) / 1000));
      const hours = Math.floor(total / 3600);
      const minutes = Math.floor((total % 3600) / 60);
      const seconds = total % 60;
      if (hours > 0) return hours + ':' + pad2(minutes) + ':' + pad2(seconds);
      return minutes + ':' + pad2(seconds);
    }

    function formatDateTime(value) {
      if (!value) return '';
      try {
        const date = new Date(value);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleString();
      } catch (err) {
        return '';
      }
    }

    function readProgressMap() {
      try {
        if (typeof window === 'undefined' || !window.localStorage) return {};
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        return isPlainObject(parsed) ? parsed : {};
      } catch (err) {
        return {};
      }
    }

    function writeProgressMap(map) {
      try {
        if (typeof window === 'undefined' || !window.localStorage) return;
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
      } catch (err) {
        /* quota / disabled storage: progress simply is not persisted */
      }
    }

    function normalizeQuestion(raw, index) {
      const source = isPlainObject(raw) ? raw : {};
      return {
        id: asText(source.id) || 'q' + (index + 1),
        kind: source.kind === 'blank' ? 'blank' : 'choice',
        stem: asText(source.stem),
        transcript: asText(source.transcript),
        options: asArray(source.options).map(asText),
        answer: asText(source.answer),
        explanation: asText(source.explanation),
      };
    }

    const SECTION_FALLBACK_TITLES = {
      writing: 'Writing 写作',
      listening: 'Listening 听力',
      reading: 'Reading 阅读',
      translation: 'Translation 翻译',
    };

    const TYPE_LABEL_KEYS = {
      writing: 'section.writing',
      listening: 'section.listening',
      reading: 'section.reading',
      translation: 'section.translation',
    };

    function normalizeSection(raw, index) {
      const source = isPlainObject(raw) ? raw : {};
      const type = SECTION_TYPES.indexOf(source.type) >= 0 ? source.type : 'reading';
      const questions = asArray(source.questions).map(normalizeQuestion);
      return {
        id: asText(source.id) || 'section-' + (index + 1),
        title: asText(source.title) || SECTION_FALLBACK_TITLES[type],
        type: type,
        prompt: asText(source.prompt),
        promptZh: asText(source.promptZh),
        passage: asText(source.passage),
        audio: asText(source.audio),
        reference: asText(source.reference),
        wordLimit: Number(source.wordLimit) > 0 ? Number(source.wordLimit) : 0,
        note: asText(source.note),
        questions: questions,
      };
    }

    function normalizePaper(raw, index) {
      const source = isPlainObject(raw) ? raw : {};
      return {
        id: asText(source.id) || 'paper-' + (index + 1),
        title: asText(source.title),
        level: source.level === 'CET6' ? 'CET6' : 'CET4',
        year: asText(source.year),
        durationMinutes: Number(source.durationMinutes) > 0 ? Number(source.durationMinutes) : 0,
        tags: asArray(source.tags).map(asText),
        sections: asArray(source.sections).map(normalizeSection),
      };
    }

    function questionKey(section, question, index) {
      const sectionId = asText(section && section.id);
      const qid = asText(question && question.id);
      return qid ? sectionId + ':' + qid : sectionId + ':q' + (index + 1);
    }

    function normalizeText(value) {
      return asText(value).trim().toLowerCase().replace(/\s+/g, ' ');
    }

    function isAnswered(value) {
      return normalizeText(value) !== '';
    }

    function checkAnswer(question, userAnswer) {
      const user = asText(userAnswer).trim();
      if (!user) return false;
      const answer = asText(question && question.answer).trim();
      if (!answer) return false;
      if (question && question.kind === 'blank') {
        const accepted = answer.split('|').map(normalizeText).filter(Boolean);
        return accepted.indexOf(normalizeText(user)) >= 0;
      }
      return user.charAt(0).toUpperCase() === answer.charAt(0).toUpperCase();
    }

    function optionText(option) {
      const text = asText(option);
      const match = text.match(/^\s*[A-Za-z][.、)]\s*/);
      return match ? text.slice(match[0].length) : text;
    }

    function labelForType(t, type) {
      const key = TYPE_LABEL_KEYS[type] || TYPE_LABEL_KEYS.reading;
      return t(key);
    }

    function computeResult(paper, answers) {
      const answerMap = isPlainObject(answers) ? answers : {};
      const sections = asArray(paper && paper.sections);
      const result = { sections: [], correct: 0, total: 0, percent: 0, wrong: [] };
      for (let si = 0; si < sections.length; si += 1) {
        const section = sections[si];
        const items = [];
        const questions = asArray(section.questions);
        for (let qi = 0; qi < questions.length; qi += 1) {
          const question = questions[qi];
          const key = questionKey(section, question, qi);
          const userAnswer = asText(answerMap[key]);
          const objective = question.kind === 'choice' || question.kind === 'blank';
          const correct = objective ? checkAnswer(question, userAnswer) : null;
          const item = {
            key: key,
            section: section,
            question: question,
            number: qi + 1,
            userAnswer: userAnswer,
            objective: objective,
            correct: correct,
          };
          items.push(item);
          if (objective) {
            result.total += 1;
            if (correct) result.correct += 1;
            else result.wrong.push(item);
          }
        }
        let sectionTotal = 0;
        let sectionCorrect = 0;
        for (let ii = 0; ii < items.length; ii += 1) {
          if (items[ii].objective) {
            sectionTotal += 1;
            if (items[ii].correct) sectionCorrect += 1;
          }
        }
        result.sections.push({
          section: section,
          items: items,
          total: sectionTotal,
          correct: sectionCorrect,
        });
      }
      result.percent = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0;
      return result;
    }

    async function fetchBankData() {
      try {
        if (typeof fetch !== 'function') throw new Error('fetch unavailable');
        const response = await fetch(BANK_URL, {
          cache: 'no-store',
          headers: { accept: 'application/json' },
        });
        if (!response || !response.ok) {
          throw new Error('HTTP ' + (response && response.status ? response.status : 'error'));
        }
        const payload = await response.json();
        if (!payload || payload.ok === false || !Array.isArray(payload.papers)) {
          throw new Error(asText(payload && payload.error) || 'invalid bank payload');
        }
        return {
          status: 'ready',
          source: 'host',
          papers: asArray(payload.papers).map(normalizePaper),
          updatedAt: asText(payload.updatedAt),
          bankDir: asText(payload.bankDir),
          warnings: asArray(payload.warnings).map(asText).filter(Boolean),
          error: '',
        };
      } catch (err) {
        return {
          status: 'ready',
          source: 'demo',
          papers: DEMO_BANK.papers.map(normalizePaper),
          updatedAt: '',
          bankDir: '',
          warnings: [],
          error: asText(err && err.message ? err.message : err),
        };
      }
    }

    function buildImportPrompt(bankDir) {
      const dir = asText(bankDir) || DEFAULT_BANK_DIR;
      return [
        '请按 DeepSeek Harness「exam-practice」插件的题库 JSON 格式，把下面这套四/六级题目导入到题库目录：',
        dir,
        '',
        '要求：',
        '1. 写入一个 UTF-8 JSON 文件，顶层是 { "papers": [ ... ] }；',
        '2. Paper 字段：id（kebab-case、全局唯一）、title、level（CET4 或 CET6）、year（如 "2024-12"）、durationMinutes、tags、sections；',
        '3. Section 字段：id、title、type（writing / listening / reading / translation）、prompt（英文题干）、promptZh（中文提示）、reference（主观题参考范文/译文）、wordLimit、note、questions；',
        '4. Question 字段：id、kind（choice 或 blank）、stem、transcript（听力文字稿，可选）、options（2–6 个，长篇阅读匹配题常为 6 个 A–F，选项带 "A." "B." 等前缀）、answer（choice 填对应选项字母，多于 4 个也合法；blank 可用 "a|b" 表示多个可接受答案）、explanation（中文解析）；',
        '5. JSON 必须严格合法：不能有注释、不能有尾逗号；中文解析用中文，题干与选项保持英文原样；',
        '6. 写完后告诉我文件名和题量，方便我回刷题面板点「刷新」。',
        '',
        '下面是要导入的题目：',
        '（把题目内容粘贴到这里）',
      ].join('\n');
    }

    /* ------------------------------------------------------------------ */
    /* Listening audio helpers (Web Speech API, no dependencies)           */
    /* ------------------------------------------------------------------ */

    const AUDIO_PREFS_KEY = 'exam-practice.audio.v1';
    const AUDIO_LABEL_RE = /(Conversation|Passage)\s+(One|Two|Three|1|2|3)\s*[:：]/gi;

    function speechSupported() {
      try {
        return typeof window !== 'undefined'
          && !!window.speechSynthesis
          && typeof window.SpeechSynthesisUtterance === 'function';
      } catch (err) {
        return false;
      }
    }

    function cleanSpeechText(text) {
      return asText(text).replace(AUDIO_LABEL_RE, ' ').replace(/\s+/g, ' ').trim();
    }

    function splitListeningNote(note) {
      const text = asText(note);
      if (!text) return [];
      const pattern = new RegExp(AUDIO_LABEL_RE.source, 'gi');
      const marks = [];
      let match = pattern.exec(text);
      while (match !== null && marks.length < 12) {
        marks.push({
          title: asText(match[1]) + ' ' + asText(match[2]),
          start: match.index,
          bodyStart: pattern.lastIndex,
        });
        match = pattern.exec(text);
      }
      if (marks.length === 0) return [{ title: '', text: text.trim() }];
      const materials = [];
      for (let i = 0; i < marks.length; i += 1) {
        const end = i + 1 < marks.length ? marks[i + 1].start : text.length;
        const body = text.slice(marks[i].bodyStart, end).trim();
        if (body) materials.push({ title: marks[i].title, text: body });
      }
      return materials;
    }

    function listeningMaterials(section, questions) {
      const source = isPlainObject(section) ? section : {};
      const audioUrl = asText(source.audio);
      if (audioUrl) {
        return [{ title: '', text: '', audioUrl: audioUrl }];
      }
      const note = asText(source.note);
      const materials = splitListeningNote(note);
      const labelled = materials.length > 0 && materials[0].title !== '';
      if (labelled) return materials;
      const transcripts = [];
      const list = asArray(questions);
      for (let i = 0; i < list.length; i += 1) {
        const question = isPlainObject(list[i]) ? list[i] : {};
        const cleaned = cleanSpeechText(question.transcript);
        if (cleaned && transcripts.indexOf(cleaned) < 0) transcripts.push(cleaned);
      }
      if (transcripts.length > 0 && (note === '' || note.length < 160)) {
        return transcripts.map(function (text, index) {
          return { title: '', text: text, index: index };
        });
      }
      return materials.filter(function (material) { return material.text !== ''; });
    }

    function readAudioPrefs() {
      try {
        if (typeof window === 'undefined' || !window.localStorage) return { rate: '1', voiceURI: '' };
        const raw = window.localStorage.getItem(AUDIO_PREFS_KEY);
        if (!raw) return { rate: '1', voiceURI: '' };
        const parsed = JSON.parse(raw);
        if (!isPlainObject(parsed)) return { rate: '1', voiceURI: '' };
        const rate = ['0.8', '1', '1.25'].indexOf(asText(parsed.rate)) >= 0 ? asText(parsed.rate) : '1';
        return { rate: rate, voiceURI: asText(parsed.voiceURI) };
      } catch (err) {
        return { rate: '1', voiceURI: '' };
      }
    }

    function writeAudioPrefs(prefs) {
      try {
        if (typeof window === 'undefined' || !window.localStorage) return;
        const safe = isPlainObject(prefs) ? prefs : {};
        window.localStorage.setItem(AUDIO_PREFS_KEY, JSON.stringify({
          rate: asText(safe.rate) || '1',
          voiceURI: asText(safe.voiceURI),
        }));
      } catch (err) {
        /* storage unavailable: audio preferences are not persisted */
      }
    }

    /* ------------------------------------------------------------------ */
    /* Built-in demo bank (used when the Host bank is unreachable)          */
    /* ------------------------------------------------------------------ */

    const DEMO_BANK = {
      papers: [
        {
          id: 'demo-cet4-2024-12',
          title: '2024年12月大学英语四级（内置示例）',
          level: 'CET4',
          year: '2024-12',
          durationMinutes: 45,
          tags: ['内置示例', '真题改编'],
          sections: [
            {
              id: 'writing',
              title: 'Writing 写作',
              type: 'writing',
              prompt: 'Directions: For this part, you are allowed 30 minutes to write an essay on the importance of learning to work in a team. You should write at least 120 words but no more than 180 words.',
              promptZh: '中文提示：写一篇短文，论述团队合作能力的重要性，不少于 120 词。',
              reference: 'Learning to work in a team is one of the most useful skills a student can develop. In a group project, no single member can do everything well, so the team has to divide the work, exchange ideas and meet deadlines together. This process teaches us to listen, to explain our thinking clearly and to accept useful criticism. It also prepares us for the workplace, where almost every task is completed by a group rather than by one person. Of course, teamwork does not mean giving up independent judgement. A good team member speaks up when something seems wrong, and helps the group reach a better decision. For these reasons, schools should give students more chances to work with others. The earlier we learn to cooperate, the better we can contribute to any team we join.',
              wordLimit: 120,
              questions: [],
            },
            {
              id: 'listening',
              title: 'Listening 听力',
              type: 'listening',
              note: '音频以文字稿形式提供，可逐题展开查看。',
              questions: [
                {
                  id: 'l1',
                  kind: 'choice',
                  stem: 'What does the man suggest the woman do?',
                  transcript: 'Woman: I can never remember where I parked my car in this huge garage.\nMan: Why not take a photo of the parking space number with your phone?\nWoman: That is a great idea. I will do that next time.',
                  options: [
                    'A. Write the number down on paper.',
                    'B. Take a photo of the parking space number.',
                    'C. Ask the guard for help.',
                    'D. Park near the entrance next time.',
                  ],
                  answer: 'B',
                  explanation: '男士建议女士用手机把车位号拍下来（take a photo of the parking space number），所以选 B。',
                },
                {
                  id: 'l2',
                  kind: 'choice',
                  stem: 'What does the woman mean?',
                  transcript: 'Man: Did you finish the report for Professor Smith?\nWoman: Not yet. I still need two more days to check the figures.',
                  options: [
                    'A. She has already handed in the report.',
                    'B. She needs more time to check the figures.',
                    'C. She lost the report on the way.',
                    'D. She will finish it this afternoon.',
                  ],
                  answer: 'B',
                  explanation: '女士说还需要两天核对数据（still need two more days to check the figures），即她需要更多时间，选 B。',
                },
                {
                  id: 'l3',
                  kind: 'choice',
                  stem: 'When will the two speakers meet?',
                  transcript: 'Woman: The concert starts at seven. Shall we meet at the gate at six thirty?\nMan: Six thirty is a bit tight for me. Let us make it a quarter past six.',
                  options: [
                    'A. At 6:15.',
                    'B. At 6:30.',
                    'C. At 6:45.',
                    'D. At 7:00.',
                  ],
                  answer: 'A',
                  explanation: '男士把时间改到 a quarter past six，即 6:15，所以选 A。',
                },
              ],
            },
            {
              id: 'reading',
              title: 'Reading 阅读',
              type: 'reading',
              prompt: 'Passage\n\nRemote work has moved from a rare privilege to a routine arrangement in many companies. For employees, the most obvious benefit is not the freedom to wear comfortable clothes, but the time saved by not commuting. A forty-minute commute each way adds up to more than six hours a week, time that can be spent on family, exercise, or simply rest. Employers, meanwhile, report that the shift has forced them to clarify goals and measure output rather than hours at a desk. Still, most managers interviewed for this report favour a hybrid model, with two or three days in the office, because new employees learn far more quickly when they can watch colleagues work. The office, in other words, may be less about individual productivity than about training and trust.',
              questions: [
                {
                  id: 'r1',
                  kind: 'choice',
                  stem: 'According to the passage, what is the most obvious benefit of remote work for employees?',
                  options: [
                    'A. Freedom in choosing clothes.',
                    'B. Time saved from commuting.',
                    'C. Higher monthly salaries.',
                    'D. Fewer meetings with managers.',
                  ],
                  answer: 'B',
                  explanation: '文章明确指出，最明显的好处不是穿便装，而是免去通勤节省下来的时间（the time saved by not commuting），选 B。',
                },
                {
                  id: 'r2',
                  kind: 'choice',
                  stem: 'What has the shift to remote work forced employers to do?',
                  options: [
                    'A. Hire more managers.',
                    'B. Reduce office space quickly.',
                    'C. Focus on output rather than hours at a desk.',
                    'D. Offer free training courses to all staff.',
                  ],
                  answer: 'C',
                  explanation: '文中说雇主被迫明确目标、衡量产出而非在工位上的时长（measure output rather than hours at a desk），选 C。',
                },
                {
                  id: 'r3',
                  kind: 'choice',
                  stem: 'Why do most managers favour hybrid arrangements?',
                  options: [
                    'A. Offices improve individual productivity.',
                    'B. New employees learn faster near colleagues.',
                    'C. Hybrid models save printing costs.',
                    'D. The law requires employees to come back.',
                  ],
                  answer: 'B',
                  explanation: '多数管理者支持混合办公，是因为新员工在办公室看同事做事学得更快（learn far more quickly when they can watch colleagues work），选 B。',
                },
                {
                  id: 'r4',
                  kind: 'blank',
                  stem: 'Complete the sentence from the passage: The office may be less about individual productivity than about training and ____.',
                  answer: 'trust',
                  explanation: '原文结尾：may be less about individual productivity than about training and trust，故填 trust。',
                },
                {
                  id: 'r5',
                  kind: 'blank',
                  stem: 'Complete the phrase: Many companies now measure workers ____ rather than hours at a desk.',
                  answer: 'output|outputs',
                  explanation: '文章用 measure output rather than hours at a desk 表示“衡量产出”，故填 output。',
                },
              ],
            },
            {
              id: 'translation',
              title: 'Translation 翻译',
              type: 'translation',
              prompt: 'Directions: Translate the following passage into English. Write your answer on Answer Sheet 2.',
              promptZh: '中文原文：近年来，越来越多的年轻人选择在周末走进图书馆。他们不只是为了借书，也为了找一个安静的地方读书、写作或学习新技能。图书馆因此不再只是藏书的地方，而成为社区里重要的公共空间。',
              reference: 'In recent years, more and more young people have chosen to visit libraries at weekends. They go there not only to borrow books, but also to find a quiet place to read, write or learn new skills. Libraries, therefore, are no longer merely places that store books; they have become important public spaces in the community.',
              questions: [],
            },
          ],
        },
      ],
    };

    /* ------------------------------------------------------------------ */
    /* Icons (currentColor artwork; aria-hidden, decorative)                */
    /* ------------------------------------------------------------------ */

    function ExamIcon(props) {
      const size = props && props.size ? props.size : 20;
      return h('svg', {
        viewBox: '0 0 24 24',
        width: size,
        height: size,
        'aria-hidden': true,
        focusable: 'false',
        style: { display: 'block' },
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.7,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
        h('path', { d: 'M6.2 3.5h7.6L18.8 8.4v12.1H6.2z' }),
        h('path', { d: 'M13.8 3.5v4.9h5' }),
        h('path', { d: 'M9.4 13.4l1.9 1.9 3.4-3.6' }),
        h('path', { d: 'M9.4 17.6h4.6' })
      );
    }

    function IconRefresh(props) {
      const size = props && props.size ? props.size : 14;
      return h('svg', {
        viewBox: '0 0 16 16',
        width: size,
        height: size,
        'aria-hidden': true,
        focusable: 'false',
        className: props && props.spinning ? 'exam-spin' : undefined,
        style: { display: 'block', flexShrink: 0 },
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
        h('path', { d: 'M13.4 8a5.4 5.4 0 1 1-1.6-3.8' }),
        h('path', { d: 'M13.5 2.6v3.1h-3.1' })
      );
    }

    function IconBack(props) {
      const size = props && props.size ? props.size : 14;
      return h('svg', {
        viewBox: '0 0 16 16',
        width: size,
        height: size,
        'aria-hidden': true,
        focusable: 'false',
        style: { display: 'block', flexShrink: 0 },
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
        h('path', { d: 'M9.8 3.2 5 8l4.8 4.8' }),
        h('path', { d: 'M5.2 8h7.3' })
      );
    }

    function IconClock(props) {
      const size = props && props.size ? props.size : 13;
      return h('svg', {
        viewBox: '0 0 16 16',
        width: size,
        height: size,
        'aria-hidden': true,
        focusable: 'false',
        style: { display: 'block', flexShrink: 0 },
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
        h('circle', { cx: 8, cy: 8, r: 5.6 }),
        h('path', { d: 'M8 5.1V8l2.2 1.4' })
      );
    }

    function IconCopy(props) {
      const size = props && props.size ? props.size : 13;
      return h('svg', {
        viewBox: '0 0 16 16',
        width: size,
        height: size,
        'aria-hidden': true,
        focusable: 'false',
        style: { display: 'block', flexShrink: 0 },
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
        h('rect', { x: 5.4, y: 5.4, width: 7.8, height: 7.8, rx: 1.6 }),
        h('path', { d: 'M10.6 3.3H4.2c-.7 0-1.2.5-1.2 1.2v6.4' })
      );
    }

    function IconFlag(props) {
      const size = props && props.size ? props.size : 12;
      return h('svg', {
        viewBox: '0 0 16 16',
        width: size,
        height: size,
        'aria-hidden': true,
        focusable: 'false',
        style: { display: 'block', flexShrink: 0 },
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
        h('path', { d: 'M4 2.5v11' }),
        h('path', { d: 'M4 3.2h7.6l-1.7 2.4 1.7 2.4H4' })
      );
    }

    function IconChevron(props) {
      const size = props && props.size ? props.size : 12;
      return h('svg', {
        viewBox: '0 0 16 16',
        width: size,
        height: size,
        'aria-hidden': true,
        focusable: 'false',
        className: props && props.open ? 'exam-chevron is-open' : 'exam-chevron',
        style: { display: 'block', flexShrink: 0 },
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
        h('path', { d: 'M4.4 6.2 8 9.8l3.6-3.6' })
      );
    }

    /* ------------------------------------------------------------------ */
    /* Shared atoms                                                        */
    /* ------------------------------------------------------------------ */

    function Btn(props) {
      const attrs = Object.assign({}, props);
      const variant = attrs.variant;
      const small = attrs.small;
      const block = attrs.block;
      const extraClass = attrs.className;
      const children = attrs.children;
      delete attrs.variant;
      delete attrs.small;
      delete attrs.block;
      delete attrs.className;
      delete attrs.children;
      if (attrs.type === undefined) attrs.type = 'button';
      attrs.className = 'exam-btn'
        + (variant ? ' is-' + variant : '')
        + (small ? ' is-small' : '')
        + (block ? ' is-block' : '')
        + (extraClass ? ' ' + extraClass : '');
      return h('button', attrs, children);
    }

    function ExamStyle() {
      return h('style', { 'data-exam-practice': 'styles' }, EXAM_CSS);
    }

    class ExamBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { error: null };
        this.reset = this.reset.bind(this);
      }

      static getDerivedStateFromError(error) {
        return { error: error };
      }

      reset() {
        this.setState({ error: null });
      }

      render() {
        if (this.state.error) {
          const t = this.props.t;
          const message = asText(this.state.error && this.state.error.message)
            || asText(this.state.error);
          return h('div', { className: 'exam-shell' },
            h('div', { className: 'exam-card exam-error' },
              h('div', { className: 'exam-error-title' }, t('error.title')),
              message ? h('div', { className: 'exam-error-detail' }, message) : null,
              h('div', { className: 'exam-error-actions' },
                h(Btn, { variant: 'primary', onClick: this.reset }, t('error.retry'))
              )
            )
          );
        }
        return this.props.children;
      }
    }

    function useElapsed(accumulatedMs, startedAt) {
      const [now, setNow] = React.useState(function () { return Date.now(); });
      React.useEffect(function () {
        const id = setInterval(function () { setNow(Date.now()); }, 1000);
        return function () { clearInterval(id); };
      }, []);
      const base = Number(accumulatedMs) > 0 ? Number(accumulatedMs) : 0;
      const start = Number(startedAt) > 0 ? Number(startedAt) : 0;
      const running = start > 0 ? Math.max(0, now - start) : 0;
      return base + running;
    }

    /* ------------------------------------------------------------------ */
    /* Bank page                                                           */
    /* ------------------------------------------------------------------ */

    function BankSkeleton(props) {
      const cards = [];
      for (let i = 0; i < 3; i += 1) {
        cards.push(h('div', { key: i, className: 'exam-card exam-skeleton-card', 'aria-hidden': true },
          h('div', { className: 'exam-skel exam-skel-title' }),
          h('div', { className: 'exam-skel exam-skel-line' }),
          h('div', { className: 'exam-skel exam-skel-line short' })
        ));
      }
      return h('div', { className: 'exam-paper-list', 'aria-busy': 'true' },
        h('div', { className: 'exam-sr' }, props.t('bank.loading')),
        cards
      );
    }

    function PaperCard(props) {
      const t = props.t;
      const paper = isPlainObject(props.paper) ? props.paper : {};
      const entry = isPlainObject(props.entry) ? props.entry : {};
      const answers = isPlainObject(entry.answers) ? entry.answers : {};
      const score = isPlainObject(entry.score) ? entry.score : null;
      const submitted = !!entry.submitted;
      const sections = asArray(paper.sections);
      const questionCount = sections.reduce(function (sum, section) {
        return sum + asArray(section.questions).length;
      }, 0);
      const answeredCount = Object.keys(answers).filter(function (key) {
        return isAnswered(answers[key]);
      }).length;
      const typeChips = [];
      sections.forEach(function (section) {
        const type = SECTION_TYPES.indexOf(section.type) >= 0 ? section.type : 'reading';
        if (typeChips.indexOf(type) < 0) typeChips.push(type);
      });
      const levelLabel = paper.level === 'CET6' ? t('paper.level6') : t('paper.level4');
      const title = asText(paper.title) || t('paper.untitled');
      const action = submitted ? 'result' : (answeredCount > 0 ? 'continue' : 'start');
      const actionLabel = submitted
        ? t('paper.viewResult')
        : (answeredCount > 0 ? t('paper.continue') : t('paper.start'));

      function handleAction() {
        if (action === 'result') props.onResult(paper.id);
        else if (action === 'continue') props.onContinue(paper.id);
        else props.onStart(paper.id);
      }

      return h('article', { className: 'exam-card exam-paper' },
        h('div', { className: 'exam-paper-top' },
          h('h2', { className: 'exam-paper-title' }, title),
          h('span', { className: 'exam-level' + (paper.level === 'CET6' ? ' is-cet6' : '') }, levelLabel)
        ),
        h('div', { className: 'exam-paper-meta' },
          paper.year ? h('span', null, asText(paper.year)) : null,
          paper.durationMinutes ? h('span', null, t('paper.duration', { minutes: paper.durationMinutes })) : null,
          h('span', null, t('paper.questions', { count: questionCount })),
          h('span', null, t('paper.sections', { count: sections.length }))
        ),
        typeChips.length > 0
          ? h('div', { className: 'exam-chips' }, typeChips.map(function (type) {
            return h('span', { key: type, className: 'exam-chip' }, labelForType(t, type));
          }))
          : null,
        asArray(paper.tags).length > 0
          ? h('div', { className: 'exam-chips' }, asArray(paper.tags).map(function (tag, index) {
            return h('span', { key: 'tag-' + index, className: 'exam-chip is-plain' }, asText(tag));
          }))
          : null,
        h('div', { className: 'exam-paper-footer' },
          h('div', { className: 'exam-paper-stats' },
            score
              ? h('span', { className: 'exam-last-score' }, t('paper.lastScore', {
                correct: Number(score.correct) || 0,
                total: Number(score.total) || 0,
                percent: Number(score.percent) || 0,
              }))
              : null,
            !submitted && answeredCount > 0
              ? h('span', null, t('paper.answeredOnly', { answered: answeredCount, total: questionCount }))
              : null
          ),
          h(Btn, {
            variant: submitted ? undefined : 'primary',
            onClick: handleAction,
            'aria-label': actionLabel + '：' + title,
          }, actionLabel)
        )
      );
    }

    function ImportCard(props) {
      const t = props.t;
      const bankDir = asText(props.bankDir) || DEFAULT_BANK_DIR;
      const prompt = buildImportPrompt(bankDir);
      const textareaRef = React.useRef(null);
      const [copyState, setCopyState] = React.useState('idle');

      React.useEffect(function () {
        if (copyState === 'idle') return undefined;
        const id = setTimeout(function () { setCopyState('idle'); }, 2600);
        return function () { clearTimeout(id); };
      }, [copyState]);

      function legacyCopy() {
        try {
          const node = textareaRef.current;
          if (node && typeof document !== 'undefined') {
            node.focus();
            node.select();
            const ok = typeof document.execCommand === 'function' ? document.execCommand('copy') : false;
            setCopyState(ok ? 'copied' : 'failed');
            return;
          }
        } catch (err) {
          /* fall through to failed state */
        }
        setCopyState('failed');
      }

      function copyPrompt() {
        try {
          if (typeof navigator !== 'undefined'
            && navigator.clipboard
            && typeof navigator.clipboard.writeText === 'function') {
            navigator.clipboard.writeText(prompt).then(function () {
              setCopyState('copied');
            }).catch(function () {
              legacyCopy();
            });
            return;
          }
        } catch (err) {
          /* fall through */
        }
        legacyCopy();
      }

      return h('section', { className: 'exam-card exam-import' },
        h('h2', { className: 'exam-import-title' }, t('import.title')),
        h('p', { className: 'exam-hint' }, t('import.desc')),
        h('div', { className: 'exam-import-dir' },
          h('span', { className: 'exam-import-label' }, t('import.dirLabel')),
          h('code', { className: 'exam-code-inline' }, bankDir)
        ),
        h('div', { className: 'exam-import-prompt-head' },
          h('span', { className: 'exam-import-label' }, t('import.promptLabel')),
          h(Btn, { small: true, onClick: copyPrompt },
            h(IconCopy, { size: 12 }),
            h('span', null, copyState === 'copied' ? t('import.copied') : t('import.copy'))
          )
        ),
        h('textarea', {
          ref: textareaRef,
          className: 'exam-code-area',
          readOnly: true,
          rows: 8,
          spellCheck: false,
          value: prompt,
          'aria-label': t('import.promptLabel'),
          onFocus: function (event) {
            try { event.target.select(); } catch (err) { /* ignore */ }
          },
        }),
        copyState !== 'idle'
          ? h('div', { className: 'exam-sr', role: 'status' },
            copyState === 'copied' ? t('import.copied') : t('import.copyFail'))
          : null,
        copyState === 'failed'
          ? h('div', { className: 'exam-hint is-warn-text', role: 'status' }, t('import.copyFail'))
          : null,
        h('p', { className: 'exam-hint' }, t('import.hint')),
        h('p', { className: 'exam-hint' }, t('import.formatHint'))
      );
    }

    function BankPage(props) {
      const t = props.t;
      const bank = isPlainObject(props.bank) ? props.bank : {};
      const progress = isPlainObject(props.progress) ? props.progress : {};
      const papers = asArray(bank.papers);
      const loading = bank.status === 'loading' && papers.length === 0;
      const filtering = props.filter || 'all';

      const counts = { all: papers.length, CET4: 0, CET6: 0 };
      papers.forEach(function (paper) {
        if (counts[paper.level] !== undefined) counts[paper.level] += 1;
      });

      const sorted = papers.slice().sort(function (a, b) {
        if (a.level !== b.level) return a.level < b.level ? -1 : 1;
        const ay = asText(a.year);
        const by = asText(b.year);
        if (ay === by) return 0;
        return ay < by ? 1 : -1;
      });
      const visible = sorted.filter(function (paper) {
        return filtering === 'all' || paper.level === filtering;
      });

      function renderFilter(value, label, count) {
        const isActive = filtering === value;
        return h('button', {
          key: value,
          type: 'button',
          className: 'exam-tab' + (isActive ? ' is-active' : ''),
          'aria-pressed': isActive ? 'true' : 'false',
          onClick: function () { props.onFilterChange(value); },
        },
          h('span', null, label),
          h('span', { className: 'exam-tab-count' }, String(count))
        );
      }

      let mainBody;
      if (loading) {
        mainBody = h(BankSkeleton, { t: t });
      } else if (visible.length === 0) {
        mainBody = h('div', { className: 'exam-card exam-empty' },
          h('div', { className: 'exam-empty-title' }, papers.length === 0 ? t('bank.emptyTitle') : t('bank.emptyFilter')),
          h('p', { className: 'exam-hint' }, t('bank.emptyDesc'))
        );
      } else {
        mainBody = h('div', { className: 'exam-paper-list' }, visible.map(function (paper) {
          return h(PaperCard, {
            key: paper.id,
            t: t,
            paper: paper,
            entry: isPlainObject(progress[paper.id]) ? progress[paper.id] : null,
            onStart: props.onStart,
            onContinue: props.onContinue,
            onResult: props.onResult,
          });
        }));
      }

      return h('div', { className: 'exam-shell' },
        h('div', { className: 'exam-page-head' },
          h('div', { className: 'exam-page-heading' },
            h('h1', { className: 'exam-title' }, t('panel.title')),
            h('p', { className: 'exam-subtitle' }, t('panel.subtitle'))
          ),
          h('div', { className: 'exam-head-actions' },
            h('span', {
              className: 'exam-badge' + (bank.source === 'host' ? ' is-host' : ' is-demo'),
              title: bank.error ? bank.error : undefined,
            },
              h('span', { className: 'exam-dot', 'aria-hidden': true }),
              h('span', null, bank.source === 'host' ? t('bank.sourceHost') : t('bank.sourceDemo'))
            ),
            bank.source === 'host' && bank.updatedAt
              ? h('span', { className: 'exam-updated' }, t('bank.updated', { time: formatDateTime(bank.updatedAt) || bank.updatedAt }))
              : null,
            h(Btn, {
              small: true,
              onClick: props.onRefresh,
              disabled: !!props.refreshing,
              'aria-busy': props.refreshing ? 'true' : 'false',
            },
              h(IconRefresh, { size: 13, spinning: !!props.refreshing }),
              h('span', null, props.refreshing ? t('bank.refreshing') : t('bank.refresh'))
            )
          )
        ),
        bank.source === 'demo' && bank.status === 'ready'
          ? h('div', { className: 'exam-notice is-warn', role: 'status' },
            h('span', { className: 'exam-notice-text' }, t('bank.demoNotice')),
            bank.error ? h('span', { className: 'exam-notice-detail', title: bank.error }, bank.error) : null
          )
          : null,
        asArray(bank.warnings).length > 0
          ? h('div', { className: 'exam-notice', role: 'status' },
            h('span', { className: 'exam-notice-text' }, t('bank.warn', { text: asArray(bank.warnings).join('；') }))
          )
          : null,
        h('div', { className: 'exam-toolbar' },
          h('div', { className: 'exam-tabs', role: 'group', 'aria-label': t('bank.filterLabel') },
            renderFilter('all', t('filter.all'), counts.all),
            renderFilter('CET4', t('filter.cet4'), counts.CET4),
            renderFilter('CET6', t('filter.cet6'), counts.CET6)
          )
        ),
        mainBody,
        h(ImportCard, { t: t, bankDir: bank.bankDir })
      );
    }

    /* ------------------------------------------------------------------ */
    /* Exam page                                                           */
    /* ------------------------------------------------------------------ */

    function QuestionCard(props) {
      const t = props.t;
      const question = isPlainObject(props.question) ? props.question : {};
      const kind = question.kind === 'blank' ? 'blank' : 'choice';
      const options = asArray(question.options);
      const hasTranscript = asText(question.transcript) !== '';
      const transcriptKey = 'tr:' + props.qkey;
      const transcriptOpen = !!props.panelOpen;
      const ariaLabel = t('exam.questionAria', { number: props.number });
      const value = asText(props.value);

      let body;
      if (kind === 'choice' && options.length > 0) {
        body = h('div', { className: 'exam-choice-group', role: 'radiogroup', 'aria-label': ariaLabel },
          options.map(function (option, index) {
            const letter = String.fromCharCode(65 + index);
            const selected = value.toUpperCase() === letter;
            return h('button', {
              key: letter,
              type: 'button',
              role: 'radio',
              'aria-checked': selected ? 'true' : 'false',
              className: 'exam-choice' + (selected ? ' is-selected' : ''),
              onClick: function () { props.onAnswer(props.qkey, letter); },
            },
              h('span', { className: 'exam-choice-letter', 'aria-hidden': true }, letter),
              h('span', { className: 'exam-choice-text' }, optionText(option))
            );
          })
        );
      } else if (kind === 'blank') {
        body = h('input', {
          className: 'exam-input',
          type: 'text',
          value: value,
          placeholder: t('exam.blankPlaceholder'),
          'aria-label': ariaLabel,
          autoComplete: 'off',
          spellCheck: false,
          onChange: function (event) { props.onAnswer(props.qkey, event.target.value); },
        });
      } else {
        body = h('div', { className: 'exam-hint' }, t('exam.unsupportedKind'));
      }

      return h('div', { className: 'exam-q' },
        h('div', { className: 'exam-q-head' },
          h('div', { className: 'exam-q-stem' },
            h('span', { className: 'exam-q-number' }, t('review.questionNo', { number: props.number })),
            h('span', null, asText(question.stem))
          ),
          h('button', {
            type: 'button',
            className: 'exam-mark' + (props.marked ? ' is-on' : ''),
            'aria-pressed': props.marked ? 'true' : 'false',
            onClick: function () { props.onToggleMark(props.qkey); },
          },
            h(IconFlag, { size: 12 }),
            h('span', null, props.marked ? t('exam.marked') : t('exam.mark'))
          )
        ),
        body,
        hasTranscript
          ? h('div', { className: 'exam-transcript-wrap' },
            h(Btn, {
              variant: 'ghost',
              small: true,
              onClick: function () { props.onTogglePanel(transcriptKey); },
              'aria-expanded': transcriptOpen ? 'true' : 'false',
            },
              h(IconChevron, { size: 12, open: transcriptOpen }),
              h('span', null, transcriptOpen ? t('exam.hideTranscript') : t('exam.transcript'))
            ),
            transcriptOpen ? h('div', { className: 'exam-transcript' }, asText(question.transcript)) : null
          )
          : null
      );
    }

    function ListeningPanel(props) {
      const t = props.t;
      const section = isPlainObject(props.section) ? props.section : {};
      const materials = listeningMaterials(section, props.questions);
      const supported = speechSupported();
      const prefsRef = React.useRef(null);
      if (!prefsRef.current) prefsRef.current = readAudioPrefs();
      const [rate, setRate] = React.useState(prefsRef.current.rate);
      const [voiceURI, setVoiceURI] = React.useState(prefsRef.current.voiceURI);
      const [voices, setVoices] = React.useState([]);
      const [status, setStatus] = React.useState('ready');
      const [playingIndex, setPlayingIndex] = React.useState(null);
      const [failed, setFailed] = React.useState(false);
      const [expanded, setExpanded] = React.useState(function () {
        const initial = {};
        if (!supported) {
          for (let i = 0; i < materials.length; i += 1) initial[i] = true;
        }
        return initial;
      });
      const rateRef = React.useRef(rate);
      const voiceURIRef = React.useRef(voiceURI);
      const queueRef = React.useRef({ indices: [], pos: 0 });
      const tokenRef = React.useRef(0);
      const speakRef = React.useRef(null);
      rateRef.current = rate;
      voiceURIRef.current = voiceURI;

      React.useEffect(function () {
        if (!supported) return undefined;
        let alive = true;
        function loadVoices() {
          if (!alive) return;
          let list = [];
          try {
            list = window.speechSynthesis.getVoices() || [];
          } catch (err) {
            list = [];
          }
          const english = [];
          for (let i = 0; i < list.length; i += 1) {
            const voice = list[i];
            if (voice && /^en/i.test(asText(voice.lang))) english.push(voice);
          }
          setVoices(english);
        }
        loadVoices();
        let synth = null;
        try {
          synth = window.speechSynthesis;
        } catch (err) {
          synth = null;
        }
        if (!synth || typeof synth.addEventListener !== 'function') {
          return function () { alive = false; };
        }
        synth.addEventListener('voiceschanged', loadVoices);
        return function () {
          alive = false;
          try {
            synth.removeEventListener('voiceschanged', loadVoices);
          } catch (err) {
            /* ignore */
          }
        };
      }, [supported]);

      React.useEffect(function () {
        if (!voiceURI || voices.length === 0) return;
        for (let i = 0; i < voices.length; i += 1) {
          const voice = voices[i];
          if (voice.voiceURI === voiceURI || voice.name === voiceURI) {
            if (asText(voice.voiceURI) && voice.voiceURI !== voiceURI) {
              setVoiceURI(voice.voiceURI);
              writeAudioPrefs({ rate: rateRef.current, voiceURI: voice.voiceURI });
            }
            return;
          }
        }
        setVoiceURI('');
        writeAudioPrefs({ rate: rateRef.current, voiceURI: '' });
      }, [voices, voiceURI]);

      React.useEffect(function () {
        return function () {
          tokenRef.current += 1;
          try {
            if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
          } catch (err) {
            /* ignore */
          }
        };
      }, []);

      function currentVoice() {
        const uri = voiceURIRef.current;
        if (!uri) return null;
        for (let i = 0; i < voices.length; i += 1) {
          if (voices[i].voiceURI === uri || voices[i].name === uri) return voices[i];
        }
        return voices.length > 0 ? voices[0] : null;
      }

      function stopPlayback() {
        tokenRef.current += 1;
        queueRef.current = { indices: [], pos: 0 };
        try {
          if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
        } catch (err) {
          /* ignore */
        }
        setPlayingIndex(null);
        setStatus('stopped');
      }

      function speakIndex(index) {
        if (!supported) return;
        const material = materials[index];
        if (!material || material.audioUrl) return;
        const text = cleanSpeechText(material.text);
        if (!text) {
          setPlayingIndex(null);
          setStatus('stopped');
          return;
        }
        tokenRef.current += 1;
        const token = tokenRef.current;
        try {
          window.speechSynthesis.cancel();
        } catch (err) {
          /* ignore */
        }
        let utterance = null;
        try {
          utterance = new window.SpeechSynthesisUtterance(text);
        } catch (err) {
          setPlayingIndex(null);
          setStatus('stopped');
          return;
        }
        const rateValue = Number(rateRef.current);
        utterance.rate = rateValue > 0 ? rateValue : 1;
        const voice = currentVoice();
        if (voice) {
          utterance.voice = voice;
          if (voice.lang) utterance.lang = voice.lang;
        } else {
          utterance.lang = 'en-US';
        }
        utterance.onend = function () {
          if (token !== tokenRef.current) return;
          const queue = queueRef.current;
          queue.pos += 1;
          if (queue.pos < queue.indices.length) {
            const next = queue.indices[queue.pos];
            if (typeof speakRef.current === 'function') speakRef.current(next);
          } else {
            queueRef.current = { indices: [], pos: 0 };
            setPlayingIndex(null);
            setStatus('stopped');
          }
        };
        utterance.onerror = function () {
          if (token !== tokenRef.current) return;
          queueRef.current = { indices: [], pos: 0 };
          setPlayingIndex(null);
          setStatus('stopped');
          setFailed(true);
        };
        setFailed(false);
        setPlayingIndex(index);
        setStatus('playing');
        try {
          window.speechSynthesis.speak(utterance);
        } catch (err) {
          setPlayingIndex(null);
          setStatus('stopped');
          setFailed(true);
        }
      }
      speakRef.current = speakIndex;

      function startQueue(indices) {
        if (!supported) return;
        if (!indices || indices.length === 0) return;
        const playable = [];
        for (let i = 0; i < indices.length; i += 1) {
          const index = indices[i];
          const material = materials[index];
          if (material && !material.audioUrl && cleanSpeechText(material.text) !== '') playable.push(index);
        }
        if (playable.length === 0) return;
        queueRef.current = { indices: playable, pos: 0 };
        speakIndex(playable[0]);
      }

      function playOne(index) {
        startQueue([index]);
      }

      function playAll() {
        const indices = [];
        for (let i = 0; i < materials.length; i += 1) {
          if (!materials[i].audioUrl) indices.push(i);
        }
        startQueue(indices);
      }

      function pausePlayback() {
        try {
          if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.pause();
        } catch (err) {
          /* ignore */
        }
        setStatus('paused');
      }

      function resumePlayback() {
        try {
          if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.resume();
        } catch (err) {
          /* ignore */
        }
        setStatus('playing');
      }

      function handleRateChange(event) {
        const next = asText(event.target.value) || '1';
        setRate(next);
        writeAudioPrefs({ rate: next, voiceURI: voiceURIRef.current });
        if (playingIndex !== null) startQueue([playingIndex]);
      }

      function handleVoiceChange(event) {
        const next = asText(event.target.value);
        setVoiceURI(next);
        writeAudioPrefs({ rate: rateRef.current, voiceURI: next });
        if (playingIndex !== null) startQueue([playingIndex]);
      }

      function toggleTranscript(index) {
        setExpanded(function (previous) {
          const next = Object.assign({}, previous);
          next[index] = !next[index];
          return next;
        });
      }

      function materialTitle(material, index) {
        const title = asText(isPlainObject(material) ? material.title : '');
        if (title) return title;
        return t('audio.materialN', { n: index + 1 });
      }

      const statusLabels = {
        ready: t('audio.statusReady'),
        playing: t('audio.statusPlaying'),
        paused: t('audio.statusPaused'),
        stopped: t('audio.statusStopped'),
      };
      const hasNative = materials.some(function (material) { return !!material.audioUrl; });
      const header = h('div', { className: 'exam-audio-head' },
        h('span', { className: 'exam-audio-title' }, t('audio.title')),
        supported ? h('span', {
          className: 'exam-audio-status is-' + status,
          role: 'status',
        }, statusLabels[status] || statusLabels.ready) : null,
        h('span', { className: 'exam-audio-hint' }, t('audio.hint'))
      );

      let controls = null;
      if (supported) {
        const rateOptions = ['0.8', '1', '1.25'].map(function (value) {
          return h('option', { key: value, value: value }, value === '1' ? '1.0x' : value + 'x');
        });
        const voiceOptions = [h('option', { key: 'default', value: '' }, t('audio.voiceDefault'))];
        let selectedVoice = '';
        voices.forEach(function (voice) {
          const value = asText(voice.voiceURI) || asText(voice.name);
          if (voiceURI && (voice.voiceURI === voiceURI || voice.name === voiceURI)) selectedVoice = value;
          voiceOptions.push(h('option', {
            key: value,
            value: value,
          }, asText(voice.name)));
        });
        controls = h('div', { className: 'exam-audio-controls' },
          materials.length > 1
            ? h(Btn, { small: true, onClick: playAll }, h('span', null, '▶ ' + t('audio.playAll')))
            : null,
          h('label', { className: 'exam-audio-field' },
            h('span', null, t('audio.rate')),
            h('select', {
              className: 'exam-audio-select',
              value: rate,
              onChange: handleRateChange,
              'aria-label': t('audio.rate'),
            }, rateOptions)
          ),
          h('label', { className: 'exam-audio-field' },
            h('span', null, t('audio.voice')),
            h('select', {
              className: 'exam-audio-select',
              value: selectedVoice,
              onChange: handleVoiceChange,
              disabled: voices.length === 0,
              'aria-label': t('audio.voice'),
            }, voiceOptions)
          ),
          h('span', { className: 'exam-audio-hint' }, t('audio.rateRestart'))
        );
      } else if (!hasNative) {
        controls = h('div', { className: 'exam-audio-hint', role: 'status' }, t('audio.unsupported'));
      }

      if (materials.length === 0) {
        return h('div', { className: 'exam-audio' },
          header,
          h('div', { className: 'exam-audio-empty' }, t('audio.empty'))
        );
      }

      const list = materials.map(function (material, index) {
        const active = playingIndex === index;
        const isPlaying = active && status === 'playing';
        const isPaused = active && status === 'paused';
        const open = !!expanded[index];
        const playLabel = isPlaying
          ? '⏸ ' + t('audio.pause')
          : (isPaused ? '▶ ' + t('audio.resume') : '▶ ' + t('audio.play'));
        const text = asText(material.text);
        let playButton = null;
        if (!material.audioUrl) {
          playButton = h(Btn, {
            small: true,
            variant: isPlaying || isPaused ? 'primary' : undefined,
            onClick: function () {
              if (isPlaying) pausePlayback();
              else if (isPaused) resumePlayback();
              else playOne(index);
            },
            disabled: !supported,
          }, h('span', null, playLabel));
        }
        return h('div', {
          key: index,
          className: 'exam-audio-item' + (active ? ' is-active' : ''),
        },
          h('div', { className: 'exam-audio-item-head' },
            h('span', { className: 'exam-audio-item-title' }, materialTitle(material, index)),
            h('div', { className: 'exam-audio-actions' },
              playButton,
              active
                ? h(Btn, {
                  small: true,
                  variant: 'ghost',
                  onClick: stopPlayback,
                }, h('span', null, '⏹ ' + t('audio.stop')))
                : null,
              text
                ? h(Btn, {
                  small: true,
                  variant: 'ghost',
                  onClick: function () { toggleTranscript(index); },
                  'aria-expanded': open ? 'true' : 'false',
                },
                  h(IconChevron, { size: 12, open: open }),
                  h('span', null, open ? t('audio.hideTranscript') : t('audio.showTranscript'))
                )
                : null
            )
          ),
          material.audioUrl
            ? h('audio', {
              className: 'exam-audio-native',
              controls: true,
              src: material.audioUrl,
            }, h('span', null, t('audio.native')))
            : null,
          text && open ? h('div', { className: 'exam-transcript' }, text) : null
        );
      });

      return h('div', { className: 'exam-audio' },
        header,
        controls,
        supported && failed
          ? h('div', { className: 'exam-hint is-warn-text', role: 'status' }, t('audio.error'))
          : null,
        h('div', { className: 'exam-audio-materials' }, list)
      );
    }

    function SectionCard(props) {
      const t = props.t;
      const section = isPlainObject(props.section) ? props.section : {};
      const items = asArray(props.items);
      const type = SECTION_TYPES.indexOf(section.type) >= 0 ? section.type : 'reading';
      const isSubjective = type === 'writing' || type === 'translation';
      const referenceKey = 'ref:' + asText(section.id);
      const referenceOpen = !!props.openPanels[referenceKey];
      const hasReference = asText(section.reference) !== '';
      const answers = isPlainObject(props.answers) ? props.answers : {};
      const marks = isPlainObject(props.marks) ? props.marks : {};

      return h('section', { className: 'exam-card exam-section' },
        h('div', { className: 'exam-section-head' },
          h('div', { className: 'exam-section-heading' },
            h('h2', { className: 'exam-section-title' }, asText(section.title) || labelForType(t, type)),
            h('span', { className: 'exam-chip' }, labelForType(t, type))
          ),
          items.length > 0
            ? h('span', { className: 'exam-section-count' }, t('section.questionsCount', { count: items.length }))
            : h('span', { className: 'exam-section-count' }, t('section.uncounted'))
        ),
        type === 'listening'
          ? h(ListeningPanel, {
            t: t,
            section: section,
            questions: items.map(function (item) { return item.question; }),
          })
          : (asText(section.note)
            ? h('div', {
              className: 'exam-note' + (asText(section.note).length > 160 ? ' is-long' : ''),
            }, asText(section.note))
            : null),
        asText(section.passage) ? h('div', { className: 'exam-prompt' }, asText(section.passage)) : null,
        asText(section.prompt) ? h('div', { className: 'exam-prompt' }, asText(section.prompt)) : null,
        asText(section.promptZh) ? h('div', { className: 'exam-prompt-zh' }, asText(section.promptZh)) : null,
        section.wordLimit ? h('div', { className: 'exam-hint' }, t('exam.wordLimit', { count: section.wordLimit })) : null,
        hasReference
          ? h('div', { className: 'exam-reference-wrap' },
            h(Btn, {
              variant: 'ghost',
              small: true,
              onClick: function () { props.onTogglePanel(referenceKey); },
              'aria-expanded': referenceOpen ? 'true' : 'false',
            },
              h(IconChevron, { size: 12, open: referenceOpen }),
              h('span', null, referenceOpen ? t('exam.hideReference') : t('exam.showReference'))
            ),
            referenceOpen ? h('div', { className: 'exam-reference' }, asText(section.reference)) : null
          )
          : (isSubjective ? h('div', { className: 'exam-hint' }, t('exam.noReference')) : null),
        items.length > 0
          ? h('div', { className: 'exam-question-list' }, items.map(function (item) {
            const question = isPlainObject(item.question) ? item.question : {};
            return h(QuestionCard, {
              key: item.key,
              t: t,
              question: question,
              qkey: item.key,
              number: item.number,
              value: asText(answers[item.key]),
              marked: !!marks[item.key],
              panelOpen: !!props.openPanels['tr:' + item.key],
              onTogglePanel: props.onTogglePanel,
              onAnswer: props.onAnswer,
              onToggleMark: props.onToggleMark,
            });
          }))
          : null
      );
    }

    function ExamPage(props) {
      const t = props.t;
      const paper = isPlainObject(props.paper) ? props.paper : {};
      const answers = isPlainObject(props.answers) ? props.answers : {};
      const marks = isPlainObject(props.marks) ? props.marks : {};
      const filterKeys = Array.isArray(props.wrongKeys) && props.wrongKeys.length > 0
        ? props.wrongKeys
        : null;
      const [confirming, setConfirming] = React.useState(false);
      const [openPanels, setOpenPanels] = React.useState({});
      const elapsed = useElapsed(props.accumulatedMs, props.startedAt);

      function isInFilter(key) {
        if (!filterKeys) return true;
        return filterKeys.indexOf(key) >= 0;
      }

      function togglePanel(id) {
        setOpenPanels(function (previous) {
          const next = Object.assign({}, previous);
          next[id] = !next[id];
          return next;
        });
      }

      const sections = [];
      let totalQuestions = 0;
      let answeredCount = 0;
      const paperSections = asArray(paper.sections);
      for (let si = 0; si < paperSections.length; si += 1) {
        const section = paperSections[si];
        const rawQuestions = asArray(section.questions);
        const items = [];
        for (let qi = 0; qi < rawQuestions.length; qi += 1) {
          const question = rawQuestions[qi];
          const key = questionKey(section, question, qi);
          if (!isInFilter(key)) continue;
          items.push({ key: key, question: question, number: qi + 1 });
          totalQuestions += 1;
          if (isAnswered(answers[key])) answeredCount += 1;
        }
        if (items.length === 0 && filterKeys) continue;
        sections.push({ section: section, items: items });
      }

      const unanswered = Math.max(0, totalQuestions - answeredCount);

      function handleSubmit() {
        if (totalQuestions === 0) return;
        if (unanswered > 0) {
          setConfirming(true);
          return;
        }
        props.onSubmit();
      }

      let footer;
      if (confirming) {
        footer = h('div', { className: 'exam-confirm', role: 'alert' },
          h('span', { className: 'exam-confirm-text' }, t('exam.submitConfirm', { count: unanswered })),
          h('div', { className: 'exam-confirm-actions' },
            h(Btn, { variant: 'ghost', small: true, onClick: function () { setConfirming(false); } }, t('exam.cancel')),
            h(Btn, {
              variant: 'primary',
              small: true,
              onClick: function () {
                setConfirming(false);
                props.onSubmit();
              },
            }, t('exam.submitConfirmOk'))
          )
        );
      } else {
        footer = h('div', { className: 'exam-submit-row' },
          h('span', { className: 'exam-submit-note' },
            unanswered > 0
              ? t('exam.unanswered', { count: unanswered })
              : t('exam.progress', { answered: answeredCount, total: totalQuestions })
          ),
          h(Btn, { variant: 'primary', onClick: handleSubmit, disabled: totalQuestions === 0 }, t('exam.submit'))
        );
      }

      return h('div', { className: 'exam-shell' },
        h('div', { className: 'exam-bar' },
          h('div', { className: 'exam-bar-main' },
            h(Btn, {
              variant: 'ghost',
              small: true,
              onClick: props.onBack,
              'aria-label': t('exam.back'),
            },
              h(IconBack, { size: 14 }),
              h('span', null, t('exam.back'))
            ),
            h('div', { className: 'exam-bar-titles' },
              h('div', { className: 'exam-bar-title', title: asText(paper.title) }, asText(paper.title) || t('paper.untitled')),
              filterKeys ? h('span', { className: 'exam-chip is-warn' }, t('exam.modeWrong')) : null
            )
          ),
          h('div', { className: 'exam-bar-meta' },
            h('span', { className: 'exam-meta' },
              h(IconClock, { size: 13 }),
              h('span', null, t('exam.timer', { time: formatDuration(elapsed) }))
            ),
            h('span', { className: 'exam-meta' },
              h('span', null, t('exam.progress', { answered: answeredCount, total: totalQuestions }))
            )
          )
        ),
        sections.length > 0
          ? h('div', { className: 'exam-body' }, sections.map(function (item, index) {
            return h(SectionCard, {
              key: asText(item.section.id) + '-' + index,
              t: t,
              section: item.section,
              items: item.items,
              answers: answers,
              marks: marks,
              openPanels: openPanels,
              onTogglePanel: togglePanel,
              onAnswer: props.onAnswer,
              onToggleMark: props.onToggleMark,
            });
          }))
          : h('div', { className: 'exam-card exam-empty' },
            h('div', { className: 'exam-empty-title' }, t('bank.emptyFilter')),
            h('p', { className: 'exam-hint' }, t('review.noWrong'))
          ),
        h('div', { className: 'exam-submit' }, footer)
      );
    }

    /* ------------------------------------------------------------------ */
    /* Result page                                                         */
    /* ------------------------------------------------------------------ */

    function ResultPage(props) {
      const t = props.t;
      const [openTranscripts, setOpenTranscripts] = React.useState({});
      const paper = isPlainObject(props.paper) ? props.paper : {};
      const entry = isPlainObject(props.entry) ? props.entry : {};
      const answers = isPlainObject(entry.answers) ? entry.answers : {};
      const marks = isPlainObject(entry.marks) ? entry.marks : {};
      const result = computeResult(paper, answers);
      let elapsedMs = Number(entry.elapsedMs);
      if (!(elapsedMs > 0)) {
        const startedAt = Number(entry.startedAt);
        const submittedAt = Date.parse(asText(entry.submittedAt));
        if (startedAt > 0 && submittedAt > 0) elapsedMs = Math.max(0, submittedAt - startedAt);
        else elapsedMs = 0;
      }
      const submittedText = formatDateTime(entry.submittedAt);
      const wrongKeys = result.wrong.map(function (item) { return item.key; });
      const hasWrong = wrongKeys.length > 0;
      const totalText = result.total > 0 ? result.correct + ' / ' + result.total : '—';
      const percentText = result.total > 0 ? result.percent + '%' : '—';

      function toggleTranscript(key) {
        setOpenTranscripts(function (previous) {
          const next = Object.assign({}, previous);
          next[key] = !next[key];
          return next;
        });
      }

      const sectionStats = result.sections.map(function (group) {
        const section = group.section;
        const percent = group.total > 0 ? Math.round((group.correct / group.total) * 100) : 0;
        return h('div', { key: asText(section.id), className: 'exam-stat-row' },
          h('div', { className: 'exam-stat-head' },
            h('span', { className: 'exam-stat-name' }, asText(section.title) || labelForType(t, section.type)),
            h('span', { className: 'exam-stat-value' },
              group.total > 0
                ? t('review.sectionScore', { correct: group.correct, total: group.total })
                : t('review.uncounted')
            )
          ),
          h('div', { className: 'exam-meter' },
            h('i', { style: { width: percent + '%' } })
          )
        );
      });

      const wrongList = hasWrong
        ? result.wrong.map(function (item) {
          return h('div', { key: item.key, className: 'exam-wrong-row' },
            h('span', { className: 'exam-wrong-stem' },
              t('review.questionNo', { number: item.number }) + ' ' + asText(item.question.stem)
            ),
            h('span', { className: 'exam-wrong-answer' },
              t('review.correctAnswer') + ' ' + asText(item.question.answer)
            )
          );
        })
        : null;

      const reviewItems = result.sections.map(function (group) {
        const section = group.section;
        const type = SECTION_TYPES.indexOf(section.type) >= 0 ? section.type : 'reading';
        const items = group.items;
        let body;
        if (items.length === 0) {
          body = h('div', { className: 'exam-review-subjective' },
            asText(section.prompt) ? h('div', { className: 'exam-prompt' }, asText(section.prompt)) : null,
            asText(section.promptZh) ? h('div', { className: 'exam-prompt-zh' }, asText(section.promptZh)) : null,
            asText(section.reference)
              ? h('div', { className: 'exam-reference' }, asText(section.reference))
              : h('div', { className: 'exam-hint' }, t('exam.noReference')),
            h('div', { className: 'exam-hint' }, t('review.subjectiveNote'))
          );
        } else {
          body = items.map(function (item) {
            const question = isPlainObject(item.question) ? item.question : {};
            const status = item.objective ? (item.correct ? 'correct' : 'wrong') : 'subjective';
            const marked = !!marks[item.key];
            return h('div', { key: item.key, className: 'exam-review-item is-' + status },
              h('div', { className: 'exam-review-stem' },
                h('span', { className: 'exam-q-number' }, t('review.questionNo', { number: item.number })),
                h('span', null, asText(question.stem)),
                marked ? h('span', { className: 'exam-chip is-warn' }, t('review.marked')) : null
              ),
              item.objective
                ? h('div', { className: 'exam-answer-row' },
                  h('span', { className: 'exam-answer-tag' }, t('review.yourAnswer')),
                  h('span', { className: 'exam-answer-value ' + (item.correct ? 'is-correct' : 'is-wrong') },
                    item.userAnswer ? item.userAnswer : t('review.unansweredAnswer')
                  ),
                  h('span', { className: 'exam-answer-tag' }, t('review.correctAnswer')),
                  h('span', { className: 'exam-answer-value is-correct' }, asText(question.answer))
                )
                : h('div', { className: 'exam-hint' }, t('review.subjectiveHint')),
              asText(question.explanation)
                ? h('div', { className: 'exam-explanation' }, asText(question.explanation))
                : null,
              asText(question.transcript)
                ? h('div', { className: 'exam-transcript-wrap' },
                  h(Btn, {
                    variant: 'ghost',
                    small: true,
                    onClick: function () { toggleTranscript(item.key); },
                    'aria-expanded': openTranscripts[item.key] ? 'true' : 'false',
                  },
                    h(IconChevron, { size: 12, open: !!openTranscripts[item.key] }),
                    h('span', null, openTranscripts[item.key] ? t('exam.hideTranscript') : t('exam.transcript'))
                  ),
                  openTranscripts[item.key]
                    ? h('div', { className: 'exam-transcript' }, asText(question.transcript))
                    : null
                )
                : null
            );
          });
        }
        const audioNode = type === 'listening'
          ? h(ListeningPanel, {
            t: t,
            section: section,
            questions: items.map(function (item) { return item.question; }),
          })
          : null;
        return h('div', { key: asText(section.id), className: 'exam-review-section' },
          h('div', { className: 'exam-review-section-head' },
            h('span', { className: 'exam-section-title' }, asText(section.title) || labelForType(t, type)),
            group.total > 0
              ? h('span', { className: 'exam-section-count' }, t('review.sectionScore', { correct: group.correct, total: group.total }))
              : h('span', { className: 'exam-chip' }, t('review.uncounted'))
          ),
          audioNode,
          body
        );
      });

      return h('div', { className: 'exam-shell' },
        h('div', { className: 'exam-result-head' },
          h(Btn, {
            variant: 'ghost',
            small: true,
            onClick: props.onBack,
            'aria-label': t('review.back'),
          },
            h(IconBack, { size: 14 }),
            h('span', null, t('review.back'))
          ),
          h('h1', { className: 'exam-title' }, t('review.resultTitle')),
          h('p', { className: 'exam-subtitle' }, asText(paper.title) || t('paper.untitled'))
        ),
        h('div', { className: 'exam-score-grid' },
          h('div', { className: 'exam-card exam-score-card' },
            h('div', { className: 'exam-stat-label' }, t('review.score')),
            h('div', { className: 'exam-score-value' }, totalText),
            h('div', { className: 'exam-hint' }, t('review.correctOfTotal', { correct: result.correct, total: result.total }))
          ),
          h('div', { className: 'exam-card exam-score-card' },
            h('div', { className: 'exam-stat-label' }, t('review.percent')),
            h('div', { className: 'exam-score-value' }, percentText),
            h('div', { className: 'exam-meter' }, h('i', { style: { width: result.percent + '%' } }))
          ),
          h('div', { className: 'exam-card exam-score-card' },
            h('div', { className: 'exam-stat-label' }, t('review.elapsed')),
            h('div', { className: 'exam-score-value' }, formatDuration(elapsedMs)),
            submittedText
              ? h('div', { className: 'exam-hint' }, t('review.submittedAt') + ' ' + submittedText)
              : null
          )
        ),
        h('section', { className: 'exam-card exam-section' },
          h('div', { className: 'exam-section-head' },
            h('h2', { className: 'exam-section-title' }, t('review.sectionStats'))
          ),
          sectionStats.length > 0
            ? h('div', { className: 'exam-stat-list' }, sectionStats)
            : h('div', { className: 'exam-hint' }, t('review.uncounted'))
        ),
        h('section', { className: 'exam-card exam-section' },
          h('div', { className: 'exam-section-head' },
            h('h2', { className: 'exam-section-title' }, t('review.wrongTitle')),
            h('span', { className: 'exam-section-count' }, t('paper.questions', { count: result.wrong.length }))
          ),
          hasWrong
            ? h('div', { className: 'exam-wrong-list' }, wrongList)
            : h('div', { className: 'exam-hint' }, t('review.noWrong')),
          h('div', { className: 'exam-result-actions' },
            h(Btn, {
              variant: 'primary',
              onClick: props.onPracticeWrong,
              disabled: !hasWrong,
            },
              h('span', null, t('review.practiceWrong')),
              h('span', { className: 'exam-section-count' }, '(' + wrongKeys.length + ')')
            )
          )
        ),
        h('section', { className: 'exam-card exam-section' },
          h('div', { className: 'exam-section-head' },
            h('h2', { className: 'exam-section-title' }, t('review.reviewTitle'))
          ),
          reviewItems.length > 0
            ? h('div', { className: 'exam-review-list' }, reviewItems)
            : h('div', { className: 'exam-hint' }, t('review.subjectiveHint'))
        ),
        h('div', { className: 'exam-result-actions' },
          h(Btn, { onClick: props.onBack }, t('review.back')),
          h(Btn, { onClick: props.onRedo }, t('review.redo'))
        )
      );
    }

    /* ------------------------------------------------------------------ */
    /* Page container                                                      */
    /* ------------------------------------------------------------------ */

    function Page(props) {
      const t = resolveTranslate(props && props.t);
      const subscribeLocale = props && props.subscribeLocale;
      const [, setLocaleRevision] = React.useState(0);

      React.useEffect(function () {
        if (typeof subscribeLocale !== 'function') return undefined;
        try {
          return subscribeLocale(function () {
            setLocaleRevision(function (value) { return value + 1; });
          });
        } catch (err) {
          return undefined;
        }
      }, [subscribeLocale]);

      const [bank, setBank] = React.useState({
        status: 'loading',
        source: 'demo',
        papers: [],
        updatedAt: '',
        bankDir: '',
        warnings: [],
        error: '',
      });
      const [refreshing, setRefreshing] = React.useState(false);
      const [reloadToken, setReloadToken] = React.useState(0);
      const [progress, setProgress] = React.useState(readProgressMap);
      const [route, setRoute] = React.useState({ name: 'bank' });
      const [filter, setFilter] = React.useState('all');

      React.useEffect(function () {
        writeProgressMap(progress);
      }, [progress]);

      React.useEffect(function () {
        let alive = true;
        setRefreshing(true);
        fetchBankData().then(function (next) {
          if (!alive) return;
          setBank(next);
          setRefreshing(false);
        }).catch(function (err) {
          if (!alive) return;
          setBank({
            status: 'ready',
            source: 'demo',
            papers: DEMO_BANK.papers.map(normalizePaper),
            updatedAt: '',
            bankDir: '',
            warnings: [],
            error: asText(err && err.message ? err.message : err),
          });
          setRefreshing(false);
        });
        return function () { alive = false; };
      }, [reloadToken]);

      function updatePaper(paperId, mutate) {
        setProgress(function (previous) {
          const map = isPlainObject(previous) ? previous : {};
          const existing = isPlainObject(map[paperId]) ? map[paperId] : {};
          const nextEntry = Object.assign({}, existing);
          if (mutate) mutate(nextEntry);
          nextEntry.updatedAt = new Date().toISOString();
          const nextMap = Object.assign({}, map);
          nextMap[paperId] = nextEntry;
          return nextMap;
        });
      }

      function startExam(paperId, options) {
        const opts = options || {};
        setProgress(function (previous) {
          const map = isPlainObject(previous) ? previous : {};
          const existing = isPlainObject(map[paperId]) ? map[paperId] : {};
          const answers = opts.clearAnswers
            ? {}
            : (isPlainObject(existing.answers) ? existing.answers : {});
          const marks = opts.clearMarks
            ? {}
            : (isPlainObject(existing.marks) ? existing.marks : {});
          const previousAccumulated = Number(existing.accumulatedMs) > 0 ? Number(existing.accumulatedMs) : 0;
          const previousStart = Number(existing.startedAt) > 0 ? Number(existing.startedAt) : 0;
          const segment = previousStart > 0
            ? Math.min(Math.max(0, Date.now() - previousStart), 6 * 60 * 60 * 1000)
            : 0;
          const accumulatedMs = opts.keepTimer ? previousAccumulated + segment : 0;
          const nextEntry = {
            answers: answers,
            marks: marks,
            accumulatedMs: accumulatedMs,
            startedAt: Date.now(),
            submitted: false,
            updatedAt: new Date().toISOString(),
          };
          const nextMap = Object.assign({}, map);
          nextMap[paperId] = nextEntry;
          return nextMap;
        });
        const wrongKeys = Array.isArray(opts.wrongKeys) && opts.wrongKeys.length > 0
          ? opts.wrongKeys.slice()
          : null;
        setRoute({
          name: 'exam',
          paperId: paperId,
          wrongKeys: wrongKeys,
          mode: wrongKeys ? 'wrong' : 'all',
        });
      }

      function setAnswer(paperId, key, value) {
        updatePaper(paperId, function (entry) {
          const answers = isPlainObject(entry.answers) ? Object.assign({}, entry.answers) : {};
          if (value === '' || value === undefined || value === null) delete answers[key];
          else answers[key] = value;
          entry.answers = answers;
        });
      }

      function toggleMark(paperId, key) {
        updatePaper(paperId, function (entry) {
          const marks = isPlainObject(entry.marks) ? Object.assign({}, entry.marks) : {};
          if (marks[key]) delete marks[key];
          else marks[key] = true;
          entry.marks = marks;
        });
      }

      function pausePaper(paperId) {
        updatePaper(paperId, function (entry) {
          const start = Number(entry.startedAt) > 0 ? Number(entry.startedAt) : 0;
          const accumulated = Number(entry.accumulatedMs) > 0 ? Number(entry.accumulatedMs) : 0;
          entry.accumulatedMs = accumulated + (start > 0 ? Math.max(0, Date.now() - start) : 0);
          entry.startedAt = 0;
        });
      }

      function submitPaper(paperId) {
        const paper = bank.papers.filter(function (item) { return item.id === paperId; })[0];
        if (!paper) {
          setRoute({ name: 'bank' });
          return;
        }
        const existing = isPlainObject(progress[paperId]) ? progress[paperId] : {};
        const result = computeResult(paper, existing.answers);
        const start = Number(existing.startedAt) > 0 ? Number(existing.startedAt) : 0;
        const accumulated = Number(existing.accumulatedMs) > 0 ? Number(existing.accumulatedMs) : 0;
        const elapsedMs = accumulated + (start > 0 ? Math.max(0, Date.now() - start) : 0);
        updatePaper(paperId, function (entry) {
          entry.submitted = true;
          entry.score = {
            correct: result.correct,
            total: result.total,
            percent: result.percent,
          };
          entry.elapsedMs = elapsedMs;
          entry.accumulatedMs = elapsedMs;
          entry.startedAt = 0;
          entry.submittedAt = new Date().toISOString();
        });
        setRoute({ name: 'result', paperId: paperId });
      }

      function practiceWrong(paperId) {
        const paper = bank.papers.filter(function (item) { return item.id === paperId; })[0];
        if (!paper) return;
        const existing = isPlainObject(progress[paperId]) ? progress[paperId] : {};
        const result = computeResult(paper, existing.answers);
        const keys = result.wrong.map(function (item) { return item.key; });
        if (keys.length === 0) return;
        startExam(paperId, { wrongKeys: keys });
      }

      function redoPaper(paperId) {
        startExam(paperId, { clearAnswers: true, clearMarks: true });
      }

      function backToBank() {
        setRoute({ name: 'bank' });
      }

      const paperId = route.paperId ? asText(route.paperId) : '';
      const currentPaper = paperId
        ? bank.papers.filter(function (item) { return item.id === paperId; })[0]
        : null;
      const currentEntry = paperId && isPlainObject(progress[paperId]) ? progress[paperId] : null;

      let content;
      if (route.name === 'exam' && currentPaper) {
        const examEntry = isPlainObject(currentEntry) ? currentEntry : {};
        content = h(ExamPage, {
          t: t,
          paper: currentPaper,
          mode: route.mode || 'all',
          wrongKeys: route.wrongKeys || null,
          answers: isPlainObject(examEntry.answers) ? examEntry.answers : {},
          marks: isPlainObject(examEntry.marks) ? examEntry.marks : {},
          accumulatedMs: examEntry.accumulatedMs,
          startedAt: examEntry.startedAt,
          onAnswer: function (key, value) { setAnswer(currentPaper.id, key, value); },
          onToggleMark: function (key) { toggleMark(currentPaper.id, key); },
          onSubmit: function () { submitPaper(currentPaper.id); },
          onBack: function () {
            pausePaper(currentPaper.id);
            backToBank();
          },
        });
      } else if (route.name === 'result' && currentPaper) {
        content = h(ResultPage, {
          t: t,
          paper: currentPaper,
          entry: isPlainObject(currentEntry) ? currentEntry : {},
          onBack: backToBank,
          onPracticeWrong: function () { practiceWrong(currentPaper.id); },
          onRedo: function () { redoPaper(currentPaper.id); },
        });
      } else if (route.name !== 'bank') {
        content = h('div', { className: 'exam-shell' },
          h('div', { className: 'exam-card exam-empty' },
            h('div', { className: 'exam-empty-title' }, t('bank.missingPaper')),
            h('div', { className: 'exam-result-actions' },
              h(Btn, { variant: 'primary', onClick: backToBank }, t('review.back'))
            )
          )
        );
      } else {
        content = h(BankPage, {
          t: t,
          bank: bank,
          refreshing: refreshing,
          filter: filter,
          onFilterChange: setFilter,
          progress: progress,
          onRefresh: function () { setReloadToken(function (value) { return value + 1; }); },
          onStart: function (id) { startExam(id, {}); },
          onContinue: function (id) { startExam(id, { keepTimer: true }); },
          onResult: function (id) { setRoute({ name: 'result', paperId: id }); },
        });
      }

      return h('div', { className: 'exam-root' },
        h(ExamStyle, null),
        h(ExamBoundary, { t: t, key: route.name + ':' + paperId }, content)
      );
    }

    /* ------------------------------------------------------------------ */
    /* Styles: only theme tokens (var(--dsw-alias-*)), exam- class names   */
    /* ------------------------------------------------------------------ */

    const EXAM_CSS = `
.exam-root {
  --exam-bg: var(--dsw-alias-bg-base);
  --exam-card: var(--dsw-alias-bg-overlay);
  --exam-border: var(--dsw-alias-border-l1);
  --exam-border-strong: var(--dsw-alias-border-l2);
  --exam-text: var(--dsw-alias-label-primary);
  --exam-muted: var(--dsw-alias-label-secondary);
  --exam-accent: var(--dsw-alias-brand-primary);
  --exam-on-accent: var(--dsw-alias-bg-base);
  --exam-success: var(--dsw-alias-state-success-primary);
  --exam-warn: var(--dsw-alias-state-warn-primary);
  --exam-danger: var(--dsw-alias-state-error-primary);
  --exam-hover: var(--dsw-alias-border-l1);
  --exam-pad: 28px;
  position: relative;
  height: 100%;
  overflow: auto;
  background: var(--exam-bg);
  color: var(--exam-text);
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  text-align: left;
}
.exam-root *,
.exam-root *::before,
.exam-root *::after { box-sizing: border-box; }
.exam-root :where(h1, h2, p) { margin: 0; }
.exam-shell { max-width: 920px; margin: 0 auto; padding: 22px var(--exam-pad) 56px; }
.exam-page-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.exam-page-heading { min-width: 0; }
.exam-title { font-size: 22px; line-height: 30px; font-weight: 650; color: var(--exam-text); }
.exam-subtitle { margin-top: 4px; font-size: 13px; line-height: 20px; color: var(--exam-muted); }
.exam-head-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding-top: 2px; }
.exam-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; line-height: 18px; padding: 1px 9px; border-radius: 999px; border: 1px solid var(--exam-border); color: var(--exam-muted); background: var(--exam-card); white-space: nowrap; }
.exam-badge.is-host { border-color: var(--exam-border-strong); color: var(--exam-text); }
.exam-badge.is-demo { border-color: var(--exam-warn); color: var(--exam-warn); }
.exam-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
.exam-updated { font-size: 11px; color: var(--exam-muted); white-space: nowrap; }
.exam-notice { display: flex; align-items: flex-start; gap: 8px; flex-wrap: wrap; margin-top: 14px; padding: 10px 12px; border: 1px solid var(--exam-border); border-radius: 10px; background: var(--exam-card); font-size: 12px; line-height: 18px; color: var(--exam-muted); }
.exam-notice.is-warn { border-color: var(--exam-warn); color: var(--exam-text); }
.exam-notice-text { flex: 1 1 auto; min-width: 0; }
.exam-notice-detail { color: var(--exam-muted); font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 11px; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.exam-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin: 18px 0 12px; }
.exam-tabs { display: inline-flex; align-items: center; gap: 2px; padding: 3px; border: 1px solid var(--exam-border); border-radius: 10px; background: var(--exam-card); }
.exam-tab { display: inline-flex; align-items: center; gap: 6px; border: 1px solid transparent; background: transparent; color: var(--exam-muted); font: inherit; font-size: 12px; line-height: 18px; padding: 3px 11px; border-radius: 7px; cursor: pointer; transition: color 140ms ease, background 140ms ease, border-color 140ms ease; }
.exam-tab:hover { color: var(--exam-text); background: var(--exam-hover); }
.exam-tab.is-active { color: var(--exam-text); background: var(--exam-bg); border-color: var(--exam-border-strong); }
.exam-tab:focus-visible { outline: 2px solid var(--exam-accent); outline-offset: 2px; }
.exam-tab-count { font-size: 11px; color: var(--exam-muted); font-variant-numeric: tabular-nums; }
.exam-paper-list { display: flex; flex-direction: column; gap: 12px; }
.exam-card { border: 1px solid var(--exam-border); border-radius: 12px; background: var(--exam-card); padding: 16px; }
.exam-paper { display: flex; flex-direction: column; gap: 10px; transition: border-color 140ms ease; }
.exam-paper:hover { border-color: var(--exam-border-strong); }
.exam-paper-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
.exam-paper-title { font-size: 15px; line-height: 22px; font-weight: 600; color: var(--exam-text); min-width: 0; overflow-wrap: anywhere; }
.exam-level { display: inline-flex; align-items: center; flex-shrink: 0; font-size: 11px; line-height: 18px; padding: 1px 8px; border-radius: 999px; border: 1px solid var(--exam-border-strong); color: var(--exam-text); }
.exam-level.is-cet6 { border-color: var(--exam-accent); color: var(--exam-accent); }
.exam-paper-meta { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; font-size: 12px; line-height: 18px; color: var(--exam-muted); }
.exam-paper-meta > span + span::before { content: "·"; margin-right: 6px; color: var(--exam-muted); }
.exam-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.exam-chip { display: inline-flex; align-items: center; font-size: 11px; line-height: 18px; padding: 0 8px; border-radius: 999px; border: 1px solid var(--exam-border); color: var(--exam-muted); background: transparent; white-space: nowrap; }
.exam-chip.is-plain { border-style: dashed; }
.exam-chip.is-warn { border-color: var(--exam-warn); color: var(--exam-warn); }
.exam-paper-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; border-top: 1px solid var(--exam-border); padding-top: 10px; }
.exam-paper-stats { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; font-size: 12px; line-height: 18px; color: var(--exam-muted); }
.exam-last-score { color: var(--exam-text); font-variant-numeric: tabular-nums; }
.exam-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 32px; padding: 0 14px; border-radius: 8px; border: 1px solid var(--exam-border-strong); background: var(--exam-card); color: var(--exam-text); font: inherit; font-size: 13px; line-height: 18px; cursor: pointer; white-space: nowrap; transition: background 140ms ease, border-color 140ms ease, color 140ms ease, opacity 140ms ease; }
.exam-btn:hover { background: var(--exam-hover); }
.exam-btn:active { opacity: .85; }
.exam-btn:focus-visible { outline: 2px solid var(--exam-accent); outline-offset: 2px; }
.exam-btn:disabled { opacity: .5; cursor: not-allowed; }
.exam-btn.is-small { height: 26px; padding: 0 10px; font-size: 12px; border-radius: 7px; }
.exam-btn.is-ghost { background: transparent; border-color: transparent; color: var(--exam-muted); }
.exam-btn.is-ghost:hover { background: var(--exam-hover); color: var(--exam-text); }
.exam-btn.is-primary { background: var(--exam-accent); border-color: var(--exam-accent); color: var(--exam-on-accent); font-weight: 600; }
.exam-btn.is-primary:hover { background: var(--exam-accent); opacity: .92; }
.exam-btn.is-block { width: 100%; }
.exam-empty { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.exam-empty-title { font-size: 14px; line-height: 20px; font-weight: 600; color: var(--exam-text); }
.exam-hint { font-size: 12px; line-height: 19px; color: var(--exam-muted); }
.exam-hint.is-warn-text { color: var(--exam-warn); }
.exam-skeleton-card { display: flex; flex-direction: column; gap: 10px; }
.exam-skel { background: var(--exam-border); border-radius: 6px; animation: exam-pulse 1.5s ease-in-out infinite; }
.exam-skel-title { width: 46%; height: 16px; }
.exam-skel-line { width: 88%; height: 11px; }
.exam-skel-line.short { width: 60%; }
@keyframes exam-pulse { 0%, 100% { opacity: 1; } 50% { opacity: .45; } }
@keyframes exam-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.exam-spin { animation: exam-spin 900ms linear infinite; }
.exam-chevron { transition: transform 140ms ease; }
.exam-chevron.is-open { transform: rotate(180deg); }
.exam-import { display: flex; flex-direction: column; gap: 10px; margin-top: 18px; }
.exam-import-title { font-size: 15px; line-height: 22px; font-weight: 600; color: var(--exam-text); }
.exam-import-dir { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.exam-import-label { font-size: 12px; line-height: 18px; color: var(--exam-muted); font-weight: 600; }
.exam-code-inline { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 12px; line-height: 18px; padding: 1px 7px; border-radius: 6px; border: 1px solid var(--exam-border); color: var(--exam-text); background: var(--exam-bg); overflow-wrap: anywhere; }
.exam-import-prompt-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
.exam-code-area { width: 100%; min-height: 132px; resize: vertical; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 11.5px; line-height: 18px; padding: 10px; border-radius: 8px; border: 1px solid var(--exam-border); background: var(--exam-bg); color: var(--exam-muted); outline: none; }
.exam-code-area:focus { border-color: var(--exam-accent); }
.exam-bar { position: sticky; top: 0; z-index: 5; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin: 0 calc(-1 * var(--exam-pad)); padding: 10px var(--exam-pad); background: var(--exam-bg); border-bottom: 1px solid var(--exam-border); }
.exam-bar-main { display: flex; align-items: center; gap: 10px; min-width: 0; }
.exam-bar-titles { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.exam-bar-title { font-size: 14px; line-height: 20px; font-weight: 600; color: var(--exam-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 46vw; }
.exam-bar-meta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; font-size: 12px; line-height: 18px; color: var(--exam-muted); }
.exam-meta { display: inline-flex; align-items: center; gap: 5px; font-variant-numeric: tabular-nums; }
.exam-body { display: flex; flex-direction: column; gap: 14px; padding-top: 16px; }
.exam-section { display: flex; flex-direction: column; gap: 12px; }
.exam-section-head { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
.exam-section-heading { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.exam-section-title { font-size: 15px; line-height: 22px; font-weight: 600; color: var(--exam-text); }
.exam-section-count { font-size: 12px; line-height: 18px; color: var(--exam-muted); font-variant-numeric: tabular-nums; white-space: nowrap; }
.exam-note { font-size: 12px; line-height: 19px; color: var(--exam-muted); white-space: pre-wrap; overflow-wrap: anywhere; }
.exam-note.is-long { font-size: 13px; line-height: 21px; color: var(--exam-text); background: var(--exam-bg); border: 1px solid var(--exam-border); border-radius: 8px; padding: 12px; }
.exam-prompt { font-size: 13px; line-height: 21px; color: var(--exam-text); white-space: pre-wrap; overflow-wrap: anywhere; background: var(--exam-bg); border: 1px solid var(--exam-border); border-radius: 8px; padding: 12px; }
.exam-prompt-zh { font-size: 12.5px; line-height: 20px; color: var(--exam-muted); white-space: pre-wrap; overflow-wrap: anywhere; }
.exam-reference { font-size: 13px; line-height: 21px; color: var(--exam-text); white-space: pre-wrap; overflow-wrap: anywhere; border-left: 2px solid var(--exam-border-strong); padding-left: 10px; }
.exam-reference-wrap { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.exam-question-list { display: flex; flex-direction: column; gap: 12px; }
.exam-q { display: flex; flex-direction: column; gap: 10px; padding: 14px; border: 1px solid var(--exam-border); border-radius: 10px; background: var(--exam-bg); }
.exam-q-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
.exam-q-stem { display: flex; align-items: baseline; gap: 8px; font-size: 13.5px; line-height: 21px; color: var(--exam-text); min-width: 0; overflow-wrap: anywhere; }
.exam-q-number { font-size: 12px; line-height: 18px; color: var(--exam-muted); font-variant-numeric: tabular-nums; flex-shrink: 0; }
.exam-choice-group { display: flex; flex-direction: column; gap: 6px; }
.exam-choice { display: flex; align-items: flex-start; gap: 9px; width: 100%; text-align: left; padding: 8px 10px; border: 1px solid var(--exam-border); border-radius: 8px; background: transparent; color: var(--exam-text); font: inherit; font-size: 13px; line-height: 20px; cursor: pointer; transition: border-color 140ms ease, background 140ms ease; }
.exam-choice:hover { border-color: var(--exam-border-strong); background: var(--exam-hover); }
.exam-choice:focus-visible { outline: 2px solid var(--exam-accent); outline-offset: 2px; }
.exam-choice.is-selected { border-color: var(--exam-accent); }
.exam-choice-letter { display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; flex-shrink: 0; border-radius: 50%; border: 1px solid var(--exam-border-strong); font-size: 11px; line-height: 18px; font-weight: 600; color: var(--exam-text); }
.exam-choice.is-selected .exam-choice-letter { background: var(--exam-accent); border-color: var(--exam-accent); color: var(--exam-on-accent); }
.exam-choice-text { min-width: 0; overflow-wrap: anywhere; }
.exam-input { width: 100%; height: 34px; padding: 0 10px; border-radius: 8px; border: 1px solid var(--exam-border-strong); background: transparent; color: var(--exam-text); font: inherit; font-size: 13px; line-height: 20px; outline: none; }
.exam-input:focus { border-color: var(--exam-accent); }
.exam-input::placeholder { color: var(--exam-muted); }
.exam-transcript-wrap { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.exam-transcript { font-size: 12.5px; line-height: 21px; color: var(--exam-muted); white-space: pre-wrap; overflow-wrap: anywhere; background: var(--exam-bg); border: 1px dashed var(--exam-border); border-radius: 8px; padding: 10px; }
.exam-mark { display: inline-flex; align-items: center; gap: 5px; flex-shrink: 0; height: 26px; padding: 0 9px; border-radius: 7px; border: 1px solid var(--exam-border); background: transparent; color: var(--exam-muted); font: inherit; font-size: 12px; line-height: 18px; cursor: pointer; transition: color 140ms ease, border-color 140ms ease, background 140ms ease; }
.exam-mark:hover { background: var(--exam-hover); color: var(--exam-text); }
.exam-mark.is-on { color: var(--exam-warn); border-color: var(--exam-warn); }
.exam-mark:focus-visible { outline: 2px solid var(--exam-accent); outline-offset: 2px; }
.exam-submit { margin-top: 16px; }
.exam-submit-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding: 14px 16px; border: 1px solid var(--exam-border); border-radius: 12px; background: var(--exam-card); }
.exam-submit-note { font-size: 12px; line-height: 18px; color: var(--exam-muted); }
.exam-confirm { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding: 14px 16px; border: 1px solid var(--exam-warn); border-radius: 12px; background: var(--exam-card); }
.exam-confirm-text { font-size: 13px; line-height: 20px; color: var(--exam-text); }
.exam-confirm-actions { display: flex; align-items: center; gap: 8px; }
.exam-result-head { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.exam-score-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-top: 16px; }
.exam-score-card { display: flex; flex-direction: column; gap: 6px; }
.exam-stat-label { font-size: 12px; line-height: 18px; color: var(--exam-muted); }
.exam-score-value { font-size: 26px; line-height: 32px; font-weight: 650; color: var(--exam-text); font-variant-numeric: tabular-nums; }
.exam-meter { height: 6px; border-radius: 999px; background: var(--exam-border); overflow: hidden; }
.exam-meter > i { display: block; height: 100%; background: var(--exam-accent); border-radius: 999px; }
.exam-stat-list { display: flex; flex-direction: column; gap: 12px; }
.exam-stat-row { display: flex; flex-direction: column; gap: 6px; }
.exam-stat-head { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
.exam-stat-name { font-size: 13px; line-height: 20px; color: var(--exam-text); }
.exam-stat-value { font-size: 12px; line-height: 18px; color: var(--exam-muted); font-variant-numeric: tabular-nums; }
.exam-wrong-list { display: flex; flex-direction: column; gap: 8px; }
.exam-wrong-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 9px 11px; border: 1px solid var(--exam-border); border-left: 3px solid var(--exam-danger); border-radius: 8px; background: var(--exam-bg); }
.exam-wrong-stem { font-size: 12.5px; line-height: 20px; color: var(--exam-text); min-width: 0; overflow-wrap: anywhere; }
.exam-wrong-answer { font-size: 12px; line-height: 18px; color: var(--exam-muted); white-space: nowrap; }
.exam-result-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
.exam-review-list { display: flex; flex-direction: column; gap: 16px; }
.exam-review-section { display: flex; flex-direction: column; gap: 10px; }
.exam-review-section-head { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
.exam-review-item { display: flex; flex-direction: column; gap: 7px; padding: 11px 12px; border: 1px solid var(--exam-border); border-left: 3px solid var(--exam-border-strong); border-radius: 8px; background: var(--exam-bg); }
.exam-review-item.is-correct { border-left-color: var(--exam-success); }
.exam-review-item.is-wrong { border-left-color: var(--exam-danger); }
.exam-review-item.is-subjective { border-left-color: var(--exam-border-strong); }
.exam-review-stem { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; font-size: 13px; line-height: 20px; color: var(--exam-text); overflow-wrap: anywhere; }
.exam-answer-row { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; font-size: 12.5px; line-height: 19px; }
.exam-answer-tag { color: var(--exam-muted); }
.exam-answer-value { font-weight: 600; overflow-wrap: anywhere; }
.exam-answer-value.is-correct { color: var(--exam-success); }
.exam-answer-value.is-wrong { color: var(--exam-danger); }
.exam-explanation { font-size: 12.5px; line-height: 20px; color: var(--exam-muted); overflow-wrap: anywhere; }
.exam-review-subjective { display: flex; flex-direction: column; gap: 8px; }
.exam-error { display: flex; flex-direction: column; gap: 10px; align-items: flex-start; }
.exam-error-title { font-size: 15px; line-height: 22px; font-weight: 600; color: var(--exam-text); }
.exam-error-detail { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 11.5px; line-height: 18px; color: var(--exam-muted); overflow-wrap: anywhere; }
.exam-error-actions { display: flex; gap: 8px; }
.exam-sr { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
.exam-audio { display: flex; flex-direction: column; gap: 10px; padding: 12px; border: 1px solid var(--exam-border); border-radius: 10px; background: var(--exam-bg); }
.exam-audio-head { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
.exam-audio-title { font-size: 13px; line-height: 20px; font-weight: 600; color: var(--exam-text); }
.exam-audio-status { font-size: 12px; line-height: 18px; color: var(--exam-muted); font-variant-numeric: tabular-nums; }
.exam-audio-status.is-playing { color: var(--exam-accent); }
.exam-audio-status.is-paused { color: var(--exam-warn); }
.exam-audio-status.is-stopped { color: var(--exam-muted); }
.exam-audio-hint { font-size: 12px; line-height: 18px; color: var(--exam-muted); }
.exam-audio-controls { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.exam-audio-field { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; line-height: 18px; color: var(--exam-muted); }
.exam-audio-select { height: 26px; padding: 0 8px; border-radius: 7px; border: 1px solid var(--exam-border-strong); background: var(--exam-bg); color: var(--exam-text); font: inherit; font-size: 12px; line-height: 18px; outline: none; }
.exam-audio-select:focus-visible { outline: 2px solid var(--exam-accent); outline-offset: 2px; }
.exam-audio-select:disabled { opacity: .55; cursor: not-allowed; }
.exam-audio-materials { display: flex; flex-direction: column; gap: 8px; }
.exam-audio-item { display: flex; flex-direction: column; gap: 8px; padding: 10px; border: 1px solid var(--exam-border); border-radius: 8px; background: var(--exam-bg); transition: border-color 140ms ease; }
.exam-audio-item.is-active { border-color: var(--exam-accent); }
.exam-audio-item-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
.exam-audio-item-title { font-size: 13px; line-height: 20px; font-weight: 600; color: var(--exam-text); }
.exam-audio-actions { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.exam-audio-native { width: 100%; }
.exam-audio-empty { font-size: 12px; line-height: 18px; color: var(--exam-muted); }
@media (max-width: 640px) {
  .exam-root { --exam-pad: 16px; }
  .exam-title { font-size: 20px; line-height: 28px; }
  .exam-bar-title { max-width: 60vw; }
  .exam-paper-top { flex-direction: column; }
  .exam-paper-footer { align-items: flex-start; }
}
`;

    /* ------------------------------------------------------------------ */
    /* Registration                                                        */
    /* ------------------------------------------------------------------ */

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        let translate = fallbackTranslate;
        try {
          ctx.effect(function () {
            return ctx.locale.register(NS, { zh: zh, en: en });
          }, 'exam-practice: dictionaries');
          const bound = ctx.locale.bind(NS);
          if (typeof bound === 'function') translate = bound;
        } catch (err) {
          translate = fallbackTranslate;
        }
        if (typeof translate !== 'function') translate = fallbackTranslate;
        activeTranslate = translate;

        function subscribeLocale(listener) {
          try {
            if (ctx.locale && typeof ctx.locale.subscribe === 'function') {
              return ctx.locale.subscribe(listener);
            }
          } catch (err) {
            /* locale service unavailable: no live language switching */
          }
          return function () {};
        }

        function Panel() {
          return h(Page, { t: translate, subscribeLocale: subscribeLocale });
        }

        const labelT = resolveTranslate(translate);

        ctx.slots.inject('sidebar.panellist', function () {
          return ctx.slots.register({
            name: 'sidebar.panellist',
            id: 'exam-practice',
            order: 30,
            label: function () { return labelT('panel.title'); },
          }, ExamIcon);
        });

        ctx.slots.inject('main', function () {
          return ctx.slots.register({
            name: 'main',
            key: 'exam-practice',
          }, Panel);
        });
      },
    };
  },
});
