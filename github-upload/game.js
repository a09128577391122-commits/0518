const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const SAVE_KEY = "grammar-explorer-storybook";
const DEFAULT_SAVE = {
  coins: 0,
  stars: [0, 0, 0, 0],
  unlocked: [true, false, false, false],
  musicOn: true,
  sfxOn: true,
  vibeOn: true,
  volume: 42
};

const state = {
  ...DEFAULT_SAVE,
  currentLevel: 0,
  stageIndex: 0,
  score: 0,
  combo: 0,
  maxCombo: 0,
  correct: 0,
  total: 0,
  answering: false,
  timerFrame: null,
  timerEndsAt: 0,
  cleanup: null,
  bossHp: 0,
  playerHp: 0
};

const LEVELS = [
  {
    name: "Be 動詞森林",
    short: "森林",
    icon: "🌳",
    animal: "🐱",
    color: "#53b976",
    background: "linear-gradient(180deg, #dff7df 0%, #fff7e8 74%)",
    intro: "學會 am / is / are",
    summary: "主詞和 Be 動詞要找到彼此。",
    position: { x: 28, y: 79 },
    stages: [
      {
        type: "drag",
        title: "拖曳配對",
        hint: "把主詞拖到正確的 Be 動詞。",
        pairs: [
          { subject: "I", answer: "am" },
          { subject: "You", answer: "are" },
          { subject: "He", answer: "is" },
          { subject: "She", answer: "is" },
          { subject: "They", answer: "are" }
        ]
      },
      {
        type: "choice",
        title: "填入 Be 動詞",
        questions: [
          { text: "He ___ happy.", options: ["am", "is", "are"], answer: 1, hint: "he 搭配 is。" },
          { text: "They ___ students.", options: ["am", "is", "are"], answer: 2, hint: "they 搭配 are。" },
          { text: "I ___ a boy.", options: ["am", "is", "are"], answer: 0, hint: "I 永遠搭配 am。" },
          { text: "She ___ a teacher.", options: ["am", "is", "are"], answer: 1, hint: "she 搭配 is。" },
          { text: "We ___ friends.", options: ["am", "is", "are"], answer: 2, hint: "we 搭配 are。" }
        ]
      },
      {
        type: "qa",
        title: "回答問題",
        questions: [
          { text: "Are you happy?", options: ["Yes, I am.", "Yes, you are."], answer: 0, hint: "回答自己時用 I。" },
          { text: "Is he a student?", options: ["Yes, he is.", "Yes, she is."], answer: 0, hint: "問 he，就用 he 回答。" },
          { text: "Are they friends?", options: ["Yes, they are.", "Yes, we are."], answer: 0, hint: "問 they，就用 they 回答。" },
          { text: "Is she a teacher?", options: ["Yes, he is.", "Yes, she is."], answer: 1, hint: "問 she，就用 she 回答。" },
          { text: "Are you students?", options: ["Yes, we are.", "Yes, they are."], answer: 0, hint: "you 指你們時，可用 we 回答。" }
        ]
      }
    ]
  },
  {
    name: "現在進行式火山",
    short: "火山",
    icon: "🌋",
    animal: "🐶",
    color: "#ff7d72",
    background: "linear-gradient(180deg, #ffe1dc 0%, #fff7e8 74%)",
    intro: "掌握 be + V-ing",
    summary: "看到 now，就想起現在正在做。",
    position: { x: 68, y: 58 },
    stages: [
      {
        type: "timed",
        title: "限時挑戰",
        seconds: 10,
        questions: [
          { text: "She ___ TV now.", options: ["watches", "is watching", "watched"], answer: 1, art: "tv" },
          { text: "He ___ a book now.", options: ["reads", "is reading", "read"], answer: 1, art: "book" },
          { text: "They ___ soccer now.", options: ["play", "are playing", "played"], answer: 1, art: "soccer" },
          { text: "I ___ lunch now.", options: ["eat", "am eating", "ate"], answer: 1, art: "lunch" },
          { text: "We ___ to music now.", options: ["listen", "are listening", "listened"], answer: 1, art: "music" },
          { text: "The dog ___ now.", options: ["runs", "is running", "ran"], answer: 1, art: "dog" }
        ]
      }
    ]
  },
  {
    name: "日常生活村莊",
    short: "村莊",
    icon: "🏘",
    animal: "🐰",
    color: "#d29a1f",
    background: "linear-gradient(180deg, #fff1bf 0%, #fff7e8 74%)",
    intro: "練習現在簡單式",
    summary: "每天都做的事，動詞會有自己的規則。",
    position: { x: 27, y: 38 },
    stages: [
      {
        type: "npc",
        title: "村長的問題",
        npcName: "Tom 村長",
        npcIcon: "🧑‍🌾",
        questions: [
          { say: "He 每天跑步，第三人稱單數要加 s。", text: "He ___ every day.", options: ["run", "runs", "running"], answer: 1 },
          { say: "study 遇到 she，要變成 studies。", text: "She ___ English every day.", options: ["study", "studies", "studying"], answer: 1 },
          { say: "They 是複數，動詞維持原形。", text: "They ___ to school every day.", options: ["walk", "walks", "walking"], answer: 0 },
          { say: "He 每天早上喝牛奶。", text: "He ___ milk every morning.", options: ["drink", "drinks", "drinking"], answer: 1 },
          { say: "My sister 可以想成 she。", text: "My sister ___ books every day.", options: ["read", "reads", "reading"], answer: 1 }
        ]
      }
    ]
  },
  {
    name: "文法 Boss 城堡",
    short: "城堡",
    icon: "🏰",
    animal: "🦊",
    color: "#ad79d8",
    background: "linear-gradient(180deg, #efdfff 0%, #fff7e8 74%)",
    intro: "綜合大挑戰",
    summary: "把前面學會的規則全部帶上。",
    position: { x: 64, y: 17 },
    bossHp: 8,
    playerHp: 3,
    stages: [
      {
        type: "boss",
        title: "Boss 戰",
        questions: [
          { text: "She ___ a cat.", options: ["have", "has", "having"], answer: 1 },
          { text: "I ___ happy.", options: ["am", "is", "are"], answer: 0 },
          { text: "They ___ playing now.", options: ["is", "am", "are"], answer: 2 },
          { text: "He ___ to school every day.", options: ["go", "goes", "going"], answer: 1 },
          { text: "We ___ friends.", options: ["am", "is", "are"], answer: 2 },
          { text: "She ___ TV now.", options: ["watches", "is watching", "watched"], answer: 1 },
          { text: "___ you a student?", options: ["Am", "Is", "Are"], answer: 2 },
          { text: "He ___ lunch now.", options: ["eats", "is eating", "ate"], answer: 1 },
          { text: "My mom ___ coffee every morning.", options: ["drink", "drinks", "drinking"], answer: 1 },
          { text: "The children ___ in the park now.", options: ["play", "are playing", "plays"], answer: 1 }
        ]
      }
    ]
  }
];

const ART = {
  tv: `<svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg"><circle cx="70" cy="70" r="66" fill="#e9eefc"/><rect x="22" y="34" width="96" height="66" rx="10" fill="#627bd5"/><rect x="30" y="42" width="80" height="48" rx="6" fill="#fff8e7"/><circle cx="70" cy="63" r="15" fill="#ffb25f"/><path d="M58 51 62 39 66 51M74 51 78 39 82 51" fill="#ffb25f"/><circle cx="64" cy="60" r="2.6" fill="#473329"/><circle cx="76" cy="60" r="2.6" fill="#473329"/><path d="M64 67q6 6 12 0" fill="none" stroke="#473329" stroke-width="2" stroke-linecap="round"/><path d="M46 34 38 17M94 34l8-17" stroke="#627bd5" stroke-width="4" stroke-linecap="round"/><circle cx="38" cy="16" r="5" fill="#ff7d72"/><circle cx="102" cy="16" r="5" fill="#53b976"/></svg>`,
  book: `<svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg"><circle cx="70" cy="70" r="66" fill="#e4f4ff"/><path d="M28 35h34c10 0 14 5 14 14v51c0-8-6-13-15-13H28z" fill="#64c8ef"/><path d="M112 35H78c-10 0-14 5-14 14v51c0-8 6-13 15-13h33z" fill="#8bd7f8"/><path d="M38 50h22M38 59h18M84 50h20M84 59h16" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="70" cy="96" r="17" fill="#ffb25f"/><path d="M56 84 61 72 65 84M75 84l5-12 4 12" fill="#ffb25f"/><circle cx="64" cy="94" r="2.4" fill="#473329"/><circle cx="76" cy="94" r="2.4" fill="#473329"/><path d="M65 100q5 4 10 0" fill="none" stroke="#473329" stroke-width="2" stroke-linecap="round"/></svg>`,
  soccer: `<svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg"><circle cx="70" cy="70" r="66" fill="#e6f8e9"/><ellipse cx="70" cy="112" rx="52" ry="8" fill="#a8dfa7"/><circle cx="78" cy="57" r="25" fill="#fff" stroke="#53b976" stroke-width="3"/><path d="m78 33 9 9-4 14H73l-4-14zM101 57l-11-5-5 12 9 9M55 57l11-5 5 12-9 9M65 80l8-6h10l8 6-5 11H70z" fill="#53b976"/></svg>`,
  lunch: `<svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg"><circle cx="70" cy="70" r="66" fill="#fff0dc"/><rect x="26" y="42" width="88" height="58" rx="10" fill="#806454"/><rect x="33" y="49" width="74" height="44" rx="7" fill="#ffd25c"/><circle cx="56" cy="64" r="11" fill="#fff"/><circle cx="56" cy="64" r="6" fill="#53b976"/><ellipse cx="84" cy="63" rx="14" ry="9" fill="#ff8e86"/><rect x="44" y="78" width="19" height="8" rx="4" fill="#ffb25f"/></svg>`,
  music: `<svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg"><circle cx="70" cy="70" r="66" fill="#f5e7fb"/><circle cx="70" cy="70" r="25" fill="#ffb25f"/><path d="M53 51 59 38 64 52M76 52l6-14 5 14" fill="#ffb25f"/><circle cx="63" cy="67" r="3" fill="#473329"/><circle cx="77" cy="67" r="3" fill="#473329"/><path d="M63 75q7 7 14 0" fill="none" stroke="#473329" stroke-width="2" stroke-linecap="round"/><path d="M47 60c-2-19 7-26 16-28M93 60c2-19-7-26-16-28" fill="none" stroke="#ad79d8" stroke-width="6" stroke-linecap="round"/><text x="24" y="42" font-size="18" fill="#ad79d8">♪</text><text x="102" y="38" font-size="17" fill="#ad79d8">♫</text></svg>`,
  dog: `<svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg"><circle cx="70" cy="70" r="66" fill="#ffe9e3"/><ellipse cx="70" cy="111" rx="48" ry="8" fill="#a8dfa7"/><ellipse cx="70" cy="72" rx="24" ry="20" fill="#8d6e63"/><ellipse cx="70" cy="55" rx="18" ry="15" fill="#a1887f"/><ellipse cx="57" cy="48" rx="7" ry="12" fill="#806454" transform="rotate(-18 57 48)"/><ellipse cx="83" cy="48" rx="7" ry="12" fill="#806454" transform="rotate(18 83 48)"/><circle cx="64" cy="55" r="3" fill="#473329"/><circle cx="76" cy="55" r="3" fill="#473329"/><ellipse cx="70" cy="62" rx="4" ry="3" fill="#473329"/></svg>`
};

const AUDIO = {
  ctx: null,
  master: null,
  musicGain: null,
  sfxGain: null,
  loopId: null,
  beat: 0,
  init() {
    if (this.ctx) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.musicGain = this.ctx.createGain();
    this.sfxGain = this.ctx.createGain();
    this.musicGain.connect(this.master);
    this.sfxGain.connect(this.master);
    this.master.connect(this.ctx.destination);
    this.setVolume(state.volume);
  },
  resume() {
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
  },
  setVolume(value) {
    state.volume = Number(value);
    const volume = Math.max(0, Math.min(1, state.volume / 100));
    if (this.musicGain) this.musicGain.gain.setTargetAtTime(volume * .22, this.ctx.currentTime, .03);
    if (this.sfxGain) this.sfxGain.gain.setTargetAtTime(Math.max(.08, volume) * .72, this.ctx.currentTime, .03);
    save();
  },
  tone(freq, duration = .18, type = "sine", gain = .2, delay = 0, dest = "sfx") {
    if (!this.ctx || (dest === "sfx" && !state.sfxOn)) return;
    const now = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const amp = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    amp.gain.setValueAtTime(gain, now);
    amp.gain.exponentialRampToValueAtTime(.001, now + duration);
    osc.connect(amp);
    amp.connect(dest === "music" ? this.musicGain : this.sfxGain);
    osc.start(now);
    osc.stop(now + duration + .02);
  },
  startMusic() {
    this.init();
    this.resume();
    this.stopMusic();
    if (!state.musicOn || !this.ctx) return;
    const chords = [
      [261.63, 329.63, 392],
      [220, 261.63, 329.63],
      [174.61, 220, 261.63],
      [196, 246.94, 293.66],
      [246.94, 293.66, 392],
      [220, 261.63, 349.23],
      [196, 246.94, 329.63],
      [220, 261.63, 329.63]
    ];
    const melody = [523.25, 587.33, 659.25, 587.33, 523.25, 493.88, 440, 493.88];
    const tick = () => {
      if (!state.musicOn || !this.ctx) return;
      const index = this.beat % 8;
      chords[index].forEach((freq, i) => this.tone(freq, .42, "triangle", .065 - i * .007, i * .012, "music"));
      this.tone(melody[index], .18, "sine", .065, .04, "music");
      if (index % 2 === 0) this.tone(chords[index][0] / 2, .12, "square", .028, 0, "music");
      this.beat++;
      this.loopId = setTimeout(tick, 430);
    };
    tick();
  },
  stopMusic() {
    clearTimeout(this.loopId);
    this.loopId = null;
  },
  click() { this.tone(740, .035, "sine", .12); },
  ok() {
    this.tone(523, .08, "sine", .20);
    this.tone(659, .09, "sine", .19, .06);
    this.tone(784, .16, "triangle", .22, .13);
    vibrate(24);
  },
  no() {
    this.tone(330, .13, "sawtooth", .14);
    this.tone(247, .18, "sawtooth", .11, .08);
    vibrate([16, 26, 16]);
  },
  coin() {
    this.tone(1047, .05, "sine", .14);
    this.tone(1319, .08, "sine", .14, .04);
  },
  combo() {
    [523, 659, 784, 1047].forEach((freq, i) => this.tone(freq, .08, "triangle", .16, i * .045));
  },
  bossHit() {
    this.tone(144, .14, "square", .2);
    this.tone(220, .08, "sawtooth", .12, .04);
  },
  win() {
    [523, 659, 784, 1047, 1319].forEach((freq, i) => this.tone(freq, .18, "sine", .17, i * .08));
  }
};

function vibrate(pattern) {
  if (state.vibeOn && navigator.vibrate) navigator.vibrate(pattern);
}

function save() {
  localStorage.setItem(SAVE_KEY, JSON.stringify({
    coins: state.coins,
    stars: state.stars,
    unlocked: state.unlocked,
    musicOn: state.musicOn,
    sfxOn: state.sfxOn,
    vibeOn: state.vibeOn,
    volume: state.volume
  }));
}

function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    Object.assign(state, DEFAULT_SAVE, JSON.parse(raw));
  } catch {
    localStorage.removeItem(SAVE_KEY);
  }
}

function showScreen(id) {
  $$(".screen").forEach(screen => screen.classList.remove("is-active"));
  $(`#${id}`).classList.add("is-active");
}

function currentUnlockedIndex() {
  return Math.max(0, state.unlocked.lastIndexOf(true));
}

function clearedCount() {
  return state.stars.filter(Boolean).length;
}

function totalStars() {
  return state.stars.reduce((sum, stars) => sum + stars, 0);
}

function updateStats() {
  $("#homeStars").textContent = totalStars();
  $("#homeCoins").textContent = state.coins;
  $("#homeCleared").textContent = clearedCount();
  $("#mapStars").textContent = totalStars();
  $("#mapCoins").textContent = state.coins;
  $("#gameScore").textContent = state.score;
  $("#gameCoins").textContent = state.coins;
  $("#continueBtn").hidden = !clearedCount();
  $("#continueBtn").textContent = `繼續第 ${currentUnlockedIndex() + 1} 關`;
}

function starsMarkup(value) {
  return [1, 2, 3].map(i => `<span class="${value >= i ? "" : "empty"}">★</span>`).join("");
}

function renderMap(selected = currentUnlockedIndex()) {
  updateStats();
  const nodes = $("#mapNodes");
  nodes.innerHTML = "";
  LEVELS.forEach((level, index) => {
    const node = document.createElement("button");
    node.type = "button";
    node.className = [
      "map-node",
      state.unlocked[index] ? "" : "is-locked",
      selected === index ? "is-current" : "",
      state.stars[index] === 3 ? "is-perfect" : ""
    ].filter(Boolean).join(" ");
    node.style.left = `${level.position.x}%`;
    node.style.top = `${level.position.y}%`;
    node.dataset.label = level.short;
    node.textContent = state.unlocked[index] ? level.icon : "🔒";
    node.addEventListener("click", () => {
      renderMap(index);
      if (state.unlocked[index]) startLevel(index);
      else toast("先完成前一關喔！", "no");
    });
    nodes.appendChild(node);
  });
  const level = LEVELS[selected];
  $("#mapSummary").innerHTML = `
    <div class="summary-row">
      <h2>第 ${selected + 1} 關：${level.name}</h2>
      <div class="stars">${starsMarkup(state.stars[selected])}</div>
    </div>
    <p>${level.summary}</p>
    <div class="summary-row">
      <span>${state.unlocked[selected] ? level.intro : "完成前一關後解鎖"}</span>
      <strong>${state.unlocked[selected] ? "可挑戰" : "尚未解鎖"}</strong>
    </div>
  `;
}

function showMap() {
  stopTimer();
  runCleanup();
  renderMap();
  showScreen("map");
}

function syncSettings() {
  $("#musicSwitch").classList.toggle("is-on", state.musicOn);
  $("#sfxSwitch").classList.toggle("is-on", state.sfxOn);
  $("#vibeSwitch").classList.toggle("is-on", state.vibeOn);
  $("#volumeRange").value = state.volume;
  $("#homeSound").textContent = state.musicOn ? "🔊" : "🔇";
}

function showSettings() {
  AUDIO.init();
  AUDIO.click();
  syncSettings();
  $("#settingsOverlay").classList.add("is-active");
}

function hideSettings() {
  AUDIO.click();
  $("#settingsOverlay").classList.remove("is-active");
}

function runCleanup() {
  if (typeof state.cleanup === "function") state.cleanup();
  state.cleanup = null;
}

function startLevel(index) {
  runCleanup();
  stopTimer();
  const level = LEVELS[index];
  state.currentLevel = index;
  state.stageIndex = 0;
  state.score = 0;
  state.combo = 0;
  state.maxCombo = 0;
  state.correct = 0;
  state.total = level.stages.reduce((sum, stage) => sum + (stage.type === "drag" ? stage.pairs.length : stage.questions.length), 0);
  state.bossHp = level.bossHp || 0;
  state.playerHp = level.playerHp || 0;
  $("#levelName").textContent = `第 ${index + 1} 關：${level.name}`;
  $("#game").style.background = level.background;
  $("#result").style.background = level.background;
  updateStats();
  showIntro(level, () => {
    showScreen("game");
    playStage();
  });
}

function showIntro(level, done) {
  const intro = document.createElement("div");
  intro.className = "intro";
  intro.style.background = level.color;
  intro.innerHTML = `
    <div class="intro-card">
      <div class="intro-icon">${level.icon}</div>
      <h2>${level.name}</h2>
      <p>${level.intro}</p>
    </div>
  `;
  document.body.appendChild(intro);
  AUDIO.combo();
  setTimeout(() => {
    intro.style.transition = "opacity .22s ease";
    intro.style.opacity = "0";
    setTimeout(() => {
      intro.remove();
      done();
    }, 220);
  }, 900);
}

function playStage() {
  runCleanup();
  stopTimer();
  const level = LEVELS[state.currentLevel];
  const stage = level.stages[state.stageIndex];
  if (!stage) {
    finishLevel(true);
    return;
  }
  const pct = Math.round((state.stageIndex / level.stages.length) * 100);
  $("#stageCounter").textContent = `階段 ${state.stageIndex + 1} / ${level.stages.length}`;
  $("#stageTitle").textContent = stage.title;
  $("#progressFill").style.width = `${pct}%`;
  $("#buddy").textContent = level.animal;
  $("#buddyTitle").textContent = "準備好了！";
  $("#buddyTalk").textContent = "看清主詞，再出發。";
  $("#comboPill").textContent = `${state.combo} Combo`;
  $("#playArea").innerHTML = "";
  state.answering = false;

  if (stage.type === "drag") renderDrag(stage);
  if (stage.type === "choice") renderQuestionSequence(stage);
  if (stage.type === "qa") renderQuestionSequence(stage, true);
  if (stage.type === "timed") renderTimed(stage);
  if (stage.type === "npc") renderNpc(stage);
  if (stage.type === "boss") renderBoss(stage);
}

function buddyMood(kind, hint = "") {
  const buddy = $("#buddy");
  buddy.classList.remove("ok", "no");
  void buddy.offsetWidth;
  if (kind === "ok") {
    buddy.classList.add("ok");
    $("#buddyTitle").textContent = "答對了！";
    $("#buddyTalk").textContent = hint || "節奏很好，繼續前進。";
  } else if (kind === "no") {
    buddy.classList.add("no");
    $("#buddyTitle").textContent = "差一點！";
    $("#buddyTalk").textContent = hint || "再看一次規則就會了。";
  }
  $("#comboPill").textContent = `${state.combo} Combo`;
}

function questionCard(question, index, total, plain = false) {
  const card = $("#questionTemplate").content.firstElementChild.cloneNode(true);
  $(".q-label", card).textContent = `Q${index + 1} / ${total}`;
  $(".q-hint", card).textContent = question.hint || "";
  if (plain) {
    $(".q-text", card).textContent = question.text;
  } else {
    const [before, after = ""] = question.text.split("___");
    $(".q-text", card).innerHTML = `${before}<span class="blank">?</span>${after}`;
  }
  return card;
}

function choicesFor(question, onPick) {
  const wrap = document.createElement("div");
  wrap.className = `choices${question.options.length === 2 ? " two-col" : ""}`;
  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice";
    button.textContent = option;
    button.addEventListener("click", () => onPick(button, index, wrap));
    wrap.appendChild(button);
  });
  return wrap;
}

function applyAnswer(button, selected, question, choices, card, extra = {}) {
  if (state.answering) return false;
  state.answering = true;
  const correct = selected === question.answer;
  $$(".choice", choices).forEach(choice => choice.disabled = true);
  const rect = button.getBoundingClientRect();
  const blank = $(".blank", card);
  if (correct) {
    button.classList.add("correct");
    AUDIO.ok();
    AUDIO.coin();
    state.correct++;
    state.combo++;
    state.maxCombo = Math.max(state.maxCombo, state.combo);
    state.score += (extra.baseScore || 10) + Math.min(state.combo * 2, 24) + (extra.bonus || 0);
    state.coins += extra.coins || 3;
    if (blank) blank.textContent = question.options[question.answer];
    floatToken(rect.left + rect.width / 2, rect.top, "★");
    floatToken(rect.left + rect.width / 2 + 22, rect.top + 8, "🪙");
    if (state.combo >= 3) {
      AUDIO.combo();
      comboPop();
    }
    buddyMood("ok", question.hint);
  } else {
    button.classList.add("wrong");
    state.combo = 0;
    $$(".choice", choices)[question.answer]?.classList.add("correct");
    if (blank) blank.textContent = question.options[question.answer];
    toast(`正確答案：${question.options[question.answer]}`, "no", 1300);
    AUDIO.no();
    buddyMood("no", question.hint);
  }
  updateStats();
  save();
  return correct;
}

function renderQuestionSequence(stage, plain = false) {
  let index = 0;
  const next = () => {
    if (index >= stage.questions.length) {
      state.stageIndex++;
      playStage();
      return;
    }
    state.answering = false;
    const play = $("#playArea");
    play.innerHTML = "";
    const question = stage.questions[index];
    const card = questionCard(question, index, stage.questions.length, plain);
    const choices = choicesFor(question, (button, selected, root) => {
      const correct = applyAnswer(button, selected, question, root, card);
      index++;
      setTimeout(next, correct ? 620 : 1360);
    });
    play.append(card, choices);
  };
  next();
}

function renderTimed(stage) {
  let index = 0;
  const next = () => {
    stopTimer();
    if (index >= stage.questions.length) {
      state.stageIndex++;
      playStage();
      return;
    }
    state.answering = false;
    const play = $("#playArea");
    play.innerHTML = "";
    const dots = document.createElement("div");
    dots.className = "dot-row";
    stage.questions.forEach((_, dotIndex) => {
      const dot = document.createElement("i");
      dot.className = `dot${dotIndex < index ? " done" : dotIndex === index ? " now" : ""}`;
      dots.appendChild(dot);
    });
    const timer = document.createElement("div");
    timer.className = "timer-wrap";
    timer.innerHTML = `<div class="progress-bar"><i class="timer-fill" id="timerFill" style="width:100%"></i></div><div class="timer-label" id="timerLabel">${stage.seconds}s</div>`;
    const question = stage.questions[index];
    play.append(dots, timer);
    if (question.art) {
      const orb = document.createElement("div");
      orb.className = "art-orb";
      orb.innerHTML = ART[question.art];
      play.appendChild(orb);
    }
    const card = questionCard(question, index, stage.questions.length);
    const choices = choicesFor(question, (button, selected, root) => {
      const left = Math.max(0, (state.timerEndsAt - performance.now()) / 1000);
      stopTimer();
      const correct = applyAnswer(button, selected, question, root, card, { bonus: Math.ceil(left * 2) });
      index++;
      setTimeout(next, correct ? 620 : 1360);
    });
    play.append(card, choices);
    startTimer(stage.seconds, question, choices, card, () => {
      index++;
      setTimeout(next, 1360);
    });
  };
  next();
}

function startTimer(seconds, question, choices, card, onExpire) {
  state.timerEndsAt = performance.now() + seconds * 1000;
  const fill = $("#timerFill");
  const label = $("#timerLabel");
  const tick = now => {
    const left = Math.max(0, state.timerEndsAt - now);
    const ratio = left / (seconds * 1000);
    fill.style.width = `${ratio * 100}%`;
    fill.className = `timer-fill${ratio < .25 ? " danger" : ratio < .55 ? " warn" : ""}`;
    label.textContent = `${Math.ceil(left / 1000)}s`;
    if (left <= 0) {
      state.timerFrame = null;
      if (!state.answering) {
        state.answering = true;
        state.combo = 0;
        $$(".choice", choices).forEach(choice => choice.disabled = true);
        $$(".choice", choices)[question.answer]?.classList.add("correct");
        $(".blank", card).textContent = question.options[question.answer];
        toast(`時間到！答案：${question.options[question.answer]}`, "no", 1300);
        AUDIO.no();
        buddyMood("no");
        onExpire();
      }
      return;
    }
    state.timerFrame = requestAnimationFrame(tick);
  };
  state.timerFrame = requestAnimationFrame(tick);
}

function stopTimer() {
  if (state.timerFrame) cancelAnimationFrame(state.timerFrame);
  state.timerFrame = null;
}

function renderDrag(stage) {
  const play = $("#playArea");
  play.innerHTML = `
    <div class="drag-hint">${stage.hint}</div>
    <div class="drag-area">
      <div class="drag-subjects" id="subjects"></div>
      <div class="drop-zones" id="zones"></div>
    </div>
  `;
  const subjects = $("#subjects");
  const zones = $("#zones");
  shuffle(stage.pairs).forEach(pair => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "subject-chip";
    chip.textContent = pair.subject;
    chip.dataset.answer = pair.answer;
    subjects.appendChild(chip);
  });
  ["am", "is", "are"].forEach(answer => {
    const zone = document.createElement("div");
    zone.className = "drop-zone";
    zone.dataset.answer = answer;
    zone.innerHTML = `<div class="zone-title">${answer}</div><div class="zone-items"></div>`;
    zones.appendChild(zone);
  });

  let active = null;
  let clone = null;
  let offsetX = 0;
  let offsetY = 0;
  let matched = 0;

  const point = event => event.touches ? event.touches[0] : event;

  const start = event => {
    const chip = event.target.closest(".subject-chip");
    if (!chip || chip.classList.contains("used")) return;
    event.preventDefault();
    active = chip;
    const p = point(event);
    const rect = chip.getBoundingClientRect();
    offsetX = p.clientX - rect.left;
    offsetY = p.clientY - rect.top;
    clone = chip.cloneNode(true);
    clone.classList.add("dragging");
    clone.style.width = `${rect.width}px`;
    clone.style.left = `${p.clientX - offsetX}px`;
    clone.style.top = `${p.clientY - offsetY}px`;
    document.body.appendChild(clone);
    chip.style.opacity = ".2";
  };

  const move = event => {
    if (!clone) return;
    event.preventDefault();
    const p = point(event);
    clone.style.left = `${p.clientX - offsetX}px`;
    clone.style.top = `${p.clientY - offsetY}px`;
    $$(".drop-zone").forEach(zone => zone.classList.remove("hover"));
    clone.style.display = "none";
    const target = document.elementFromPoint(p.clientX, p.clientY);
    clone.style.display = "";
    target?.closest(".drop-zone")?.classList.add("hover");
  };

  const end = event => {
    if (!clone || !active) return;
    const p = event.changedTouches ? event.changedTouches[0] : event;
    clone.style.display = "none";
    const target = document.elementFromPoint(p.clientX, p.clientY);
    clone.style.display = "";
    const zone = target?.closest(".drop-zone");
    if (zone && zone.dataset.answer === active.dataset.answer) {
      active.classList.add("used");
      $(".zone-items", zone).insertAdjacentHTML("beforeend", `<span>${active.textContent}</span>`);
      state.correct++;
      state.score += 10;
      state.coins += 2;
      matched++;
      AUDIO.ok();
      AUDIO.coin();
      buddyMood("ok");
      updateStats();
      save();
      if (matched >= stage.pairs.length) {
        setTimeout(() => {
          state.stageIndex++;
          playStage();
        }, 620);
      }
    } else {
      active.style.opacity = "1";
      toast("再找找正確的家。", "no", 760);
      AUDIO.no();
      buddyMood("no");
    }
    $$(".drop-zone").forEach(zone => zone.classList.remove("hover"));
    clone.remove();
    clone = null;
    active = null;
  };

  subjects.addEventListener("touchstart", start, { passive: false });
  subjects.addEventListener("mousedown", start);
  document.addEventListener("touchmove", move, { passive: false });
  document.addEventListener("mousemove", move);
  document.addEventListener("touchend", end);
  document.addEventListener("mouseup", end);
  state.cleanup = () => {
    document.removeEventListener("touchmove", move);
    document.removeEventListener("mousemove", move);
    document.removeEventListener("touchend", end);
    document.removeEventListener("mouseup", end);
  };
}

function renderNpc(stage) {
  let index = 0;
  const next = () => {
    const play = $("#playArea");
    play.innerHTML = "";
    if (index >= stage.questions.length) {
      play.innerHTML = `
        <div class="npc-card">
          <div class="npc-avatar" style="background:${LEVELS[state.currentLevel].color}">${stage.npcIcon}</div>
          <div>
            <strong>${stage.npcName}</strong>
            <p>太好了，你已經抓到日常句子的節奏了！</p>
          </div>
        </div>
      `;
      setTimeout(() => {
        state.stageIndex++;
        playStage();
      }, 1000);
      return;
    }
    state.answering = false;
    const question = stage.questions[index];
    play.innerHTML = `
      <div class="npc-card">
        <div class="npc-avatar" style="background:${LEVELS[state.currentLevel].color}">${stage.npcIcon}</div>
        <div>
          <strong>${stage.npcName}</strong>
          <p>${question.say}</p>
        </div>
      </div>
    `;
    const card = questionCard(question, index, stage.questions.length);
    const choices = choicesFor(question, (button, selected, root) => {
      const correct = applyAnswer(button, selected, question, root, card);
      index++;
      setTimeout(next, correct ? 620 : 1360);
    });
    play.append(card, choices);
  };
  next();
}

function renderBoss(stage) {
  const level = LEVELS[state.currentLevel];
  let index = 0;
  state.bossHp = level.bossHp;
  state.playerHp = level.playerHp;
  const next = () => {
    if (state.bossHp <= 0 || state.playerHp <= 0 || index >= stage.questions.length) {
      const won = state.bossHp <= 0;
      toast(won ? "Boss 被擊敗了！" : "Boss 還守著城堡！", won ? "ok" : "no", 1300);
      if (won) AUDIO.win();
      setTimeout(() => finishLevel(won), 1300);
      return;
    }
    state.answering = false;
    const play = $("#playArea");
    play.innerHTML = "";
    const question = stage.questions[index];
    const panel = document.createElement("div");
    panel.className = "boss-card";
    panel.innerHTML = `
      <div class="boss-face" id="bossFace">🐉</div>
      <div class="boss-stats">
        <div class="progress-bar"><i id="bossHp" style="width:${state.bossHp / level.bossHp * 100}%;background:linear-gradient(90deg,var(--coral),var(--plum));"></i></div>
        <div class="boss-meta">
          <span>Boss HP ${state.bossHp} / ${level.bossHp}</span>
          <span class="hearts">${Array.from({ length: level.playerHp }, (_, i) => `<span class="${i >= state.playerHp ? "lost" : ""}">♥</span>`).join("")}</span>
        </div>
      </div>
    `;
    const card = questionCard(question, index, stage.questions.length);
    const choices = choicesFor(question, (button, selected, root) => {
      const correct = applyAnswer(button, selected, question, root, card, { baseScore: 15, coins: 5 });
      if (correct) {
        state.bossHp = Math.max(0, state.bossHp - 1);
        AUDIO.bossHit();
        $("#bossFace")?.classList.add("hit");
        $("#bossHp").style.width = `${state.bossHp / level.bossHp * 100}%`;
        $(".boss-meta span:first-child").textContent = `Boss HP ${state.bossHp} / ${level.bossHp}`;
      } else {
        state.playerHp = Math.max(0, state.playerHp - 1);
        $(".hearts").innerHTML = Array.from({ length: level.playerHp }, (_, i) => `<span class="${i >= state.playerHp ? "lost" : ""}">♥</span>`).join("");
      }
      index++;
      setTimeout(next, correct ? 680 : 1360);
    });
    play.append(panel, card, choices);
  };
  next();
}

function finishLevel(won) {
  runCleanup();
  stopTimer();
  const stars = won ? scoreToStars(state.correct, state.total) : 0;
  state.stars[state.currentLevel] = Math.max(state.stars[state.currentLevel], stars);
  if (stars > 0 && state.currentLevel < LEVELS.length - 1) {
    state.unlocked[state.currentLevel + 1] = true;
  }
  save();
  updateStats();
  $("#progressFill").style.width = "100%";
  $("#resultIcon").textContent = stars === 3 ? "👑" : stars > 0 ? "🏆" : "🛡";
  $("#resultTitle").textContent = stars === 3 ? "完美探險！" : stars >= 2 ? "過關成功！" : stars === 1 ? "過關了！" : "再挑戰一次！";
  $("#resultMessage").textContent = stars > 0 ? "新的路段已經在地圖上亮起。" : "再練幾題，你就能把城門推開。";
  $("#resultStars").innerHTML = starsMarkup(stars);
  $("#resultStats").innerHTML = `
    <div><strong>${state.score}</strong><span>分數</span></div>
    <div><strong>${state.correct}/${state.total}</strong><span>答對</span></div>
    <div><strong>${state.maxCombo}</strong><span>最大 Combo</span></div>
    <div><strong>${state.coins}</strong><span>金幣</span></div>
  `;
  $("#nextBtn").textContent = stars > 0 ? "繼續冒險" : "返回地圖";
  showScreen("result");
}

function scoreToStars(correct, total) {
  if (!total) return 0;
  const ratio = correct / total;
  if (ratio >= .9) return 3;
  if (ratio >= .7) return 2;
  if (ratio >= .4) return 1;
  return 0;
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function toast(message, type = "ok", duration = 1100) {
  $(".toast")?.remove();
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), duration);
}

function floatToken(x, y, text) {
  const el = document.createElement("div");
  el.className = "float-token";
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 720);
}

function comboPop() {
  const el = document.createElement("div");
  el.className = "combo-pop";
  el.innerHTML = `<strong>${state.combo}</strong><span>Combo!</span>`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 720);
}

function bindUi() {
  $("#startBtn").addEventListener("click", () => {
    AUDIO.init();
    AUDIO.resume();
    AUDIO.click();
    if (state.musicOn) AUDIO.startMusic();
    showMap();
  });
  $("#continueBtn").addEventListener("click", () => {
    AUDIO.init();
    AUDIO.resume();
    AUDIO.click();
    if (state.musicOn) AUDIO.startMusic();
    startLevel(currentUnlockedIndex());
  });
  $("#homeSound").addEventListener("click", () => {
    AUDIO.init();
    state.musicOn = !state.musicOn;
    state.musicOn ? AUDIO.startMusic() : AUDIO.stopMusic();
    syncSettings();
    save();
  });
  ["homeSettings", "mapSettings", "gameSettings"].forEach(id => {
    $(`#${id}`).addEventListener("click", showSettings);
  });
  $("#closeSettings").addEventListener("click", hideSettings);
  $("#settingsOverlay").addEventListener("click", event => {
    if (event.target === $("#settingsOverlay")) hideSettings();
  });
  $("#musicSwitch").addEventListener("click", () => {
    AUDIO.init();
    state.musicOn = !state.musicOn;
    state.musicOn ? AUDIO.startMusic() : AUDIO.stopMusic();
    syncSettings();
    save();
  });
  $("#sfxSwitch").addEventListener("click", () => {
    state.sfxOn = !state.sfxOn;
    syncSettings();
    save();
  });
  $("#vibeSwitch").addEventListener("click", () => {
    state.vibeOn = !state.vibeOn;
    syncSettings();
    save();
  });
  $("#volumeRange").addEventListener("input", event => AUDIO.setVolume(event.target.value));
  $("#resetSave").addEventListener("click", () => {
    Object.assign(state, JSON.parse(JSON.stringify(DEFAULT_SAVE)));
    localStorage.removeItem(SAVE_KEY);
    syncSettings();
    updateStats();
    renderMap(0);
    toast("紀錄已清除。", "ok");
  });
  $("#backMap").addEventListener("click", () => {
    AUDIO.click();
    showMap();
  });
  $("#nextBtn").addEventListener("click", () => {
    AUDIO.click();
    showMap();
  });
  $("#retryBtn").addEventListener("click", () => {
    AUDIO.click();
    startLevel(state.currentLevel);
  });
}

load();
bindUi();
syncSettings();
updateStats();
