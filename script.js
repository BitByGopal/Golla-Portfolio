/* ══════════════════════════════════════════════
   CLOCK
══════════════════════════════════════════════ */
function updateClocks() {
  const now  = new Date();
  const h    = now.getHours();
  const m    = String(now.getMinutes()).padStart(2,'0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12  = ((h % 12) || 12);
  const str  = `${h12}:${m} ${ampm}`;
  document.getElementById('lockTime').textContent = str;
  document.getElementById('mbClock').textContent  = str;
  // date
  const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dateEl = document.getElementById('lockDate');
  if (dateEl) dateEl.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
}
updateClocks();
setInterval(updateClocks, 10000);

/* ── LOCK SCREEN ROTATING QUOTES ── */
const DEV_QUOTES = [
  '"First, solve the problem. Then, write the code." — John Johnson',
  '"Code is like humor. When you have to explain it, it\'s bad." — Cory House',
  '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." — Martin Fowler',
  '"It\'s not a bug – it\'s an undocumented feature." — Anonymous',
  '"The best error message is the one that never shows up." — Thomas Fuchs',
  '"Programs must be written for people to read, and only incidentally for machines to execute." — Harold Abelson',
  '"The most disastrous thing that you can ever learn is your first programming language." — Alan Kay',
  '"Simplicity is the soul of efficiency." — Austin Freeman',
  '"Talk is cheap. Show me the code." — Linus Torvalds',
  '"Every great developer you know got there by solving problems they were unqualified to solve." — Patrick McKenzie',
];

let quoteIdx = Math.floor(Math.random() * DEV_QUOTES.length);

function startQuoteRotation() {
  const el = document.getElementById('lockQuote');
  if (!el) return;
  function showQuote() {
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = DEV_QUOTES[quoteIdx % DEV_QUOTES.length];
      quoteIdx++;
      el.style.transition = 'opacity 0.8s ease';
      el.style.opacity = '1';
    }, 400);
  }
  showQuote();
  setInterval(showQuote, 6000);
}

/* ══════════════════════════════════════════════
   BOOT — Terminal Typewriter
══════════════════════════════════════════════ */
const bootFill   = document.getElementById('bootFill');
const bootScreen = document.getElementById('boot-screen');
const lockScreen = document.getElementById('lock-screen');
const desktop    = document.getElementById('desktop');
const btLines    = document.getElementById('btLines');
const btCursor   = document.getElementById('btCursor');

const BOOT_LINES = [
  { html: '<span class="bt-prompt">$</span> <span class="bt-cmd">init</span> gopal.portfolio', delay: 0 },
  { html: '<span class="bt-out">// Loading system...</span>', delay: 320 },
  { html: '<span class="bt-prompt">$</span> <span class="bt-cmd">whoami</span>', delay: 700 },
  { html: '<span class="bt-name">Golla Gopal</span>', delay: 1000 },
  { html: '<span class="bt-prompt">$</span> <span class="bt-cmd">cat</span> role.txt', delay: 1500 },
  { html: '<span class="bt-out">Full Stack Developer · AI & ML Student</span>', delay: 1800 },
  { html: '<span class="bt-prompt">$</span> <span class="bt-cmd">status</span> --check', delay: 2200 },
  { html: '<span class="bt-ok">✓ Open to Work</span>  <span class="bt-ok">✓ 5+ Projects</span>  <span class="bt-ok">✓ LPU Punjab</span>', delay: 2500 },
  { html: '<span class="bt-out">// Starting portfolio...</span>', delay: 3000 },
];

let bootProgress = 0;
let bootDone = false;

// Type lines one by one
BOOT_LINES.forEach(({ html, delay }) => {
  setTimeout(() => {
    if (!btLines) return;
    const line = document.createElement('div');
    line.className = 'bt-line';
    line.innerHTML = html;
    btLines.appendChild(line);
    if (btCursor) btLines.appendChild(btCursor);
  }, delay);
});

// Progress bar
const bootInterval = setInterval(() => {
  bootProgress += Math.random() * 6 + 2;
  if (bootProgress >= 100) {
    bootProgress = 100;
    clearInterval(bootInterval);
    setTimeout(showLock, 400);
  }
  bootFill.style.width = bootProgress + '%';
}, 120);

function showLock() {
  bootScreen.classList.add('fade-out');
  setTimeout(() => {
    bootScreen.classList.add('hidden');
    lockScreen.classList.remove('hidden');
    lockScreen.style.opacity = '0';
    requestAnimationFrame(() => {
      lockScreen.style.transition = 'opacity 0.5s';
      lockScreen.style.opacity = '1';
      startQuoteRotation();
    });
  }, 800);
}

/* ══════════════════════════════════════════════
   UNLOCK
══════════════════════════════════════════════ */
function unlock() {
  lockScreen.classList.add('fade-out');
  setTimeout(() => {
    lockScreen.classList.add('hidden');
    desktop.classList.remove('hidden');
    requestAnimationFrame(() => desktop.classList.add('visible'));
    // No auto-open — user clicks app icon to open
  }, 600);
}

// Simple unlock — click button or press Enter anywhere
const lockArrow = document.getElementById('lockArrow');
lockArrow.addEventListener('click', unlock);

// Press Enter anywhere on lock screen to unlock
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !lockScreen.classList.contains('hidden') && !lockScreen.classList.contains('fade-out')) {
    unlock();
  }
});

// Click anywhere on lock screen also unlocks
lockScreen.addEventListener('click', e => {
  if (!lockScreen.classList.contains('fade-out')) unlock();
});


/* ══════════════════════════════════════════════
   WINDOW MANAGEMENT
══════════════════════════════════════════════ */
const windows = {
  terminal: { el: document.getElementById('win-terminal'), open: false, min: false },
  finder:   { el: document.getElementById('win-finder'),   open: false, min: false },
  classic:  { el: document.getElementById('win-classic'),  open: false, min: false },
};

function openWindow(id) {
  const w = windows[id];
  if (!w) return;
  w.el.style.display = 'flex';
  w.open = true;
  w.min  = false;
  focusWindow(id);
  document.getElementById(`dot-${id}`)?.classList.add('on');

  // Classic app opens fullscreen
  if (id === 'classic') {
    w.el.style.top      = 'var(--menubar-h)';
    w.el.style.left     = '0';
    w.el.style.width    = '100vw';
    w.el.style.height   = `calc(100vh - var(--menubar-h))`;
    w.el.style.transform = 'none';
    w.el.style.borderRadius = '0';
    w.el.dataset.maximized = '1';
    w.el.style.opacity = '1';
    return;
  }

  w.el.style.opacity = '1';
  w.el.style.transform = 'translateX(-50%) scale(1)';

  // Focus terminal input
  if (id === 'terminal') {
    setTimeout(() => {
      document.getElementById('term-input').focus();
      if (document.getElementById('term-output').children.length === 0) printWelcome();
    }, 350);
  }
}

function closeWindow(id) {
  const w = windows[id];
  if (!w) return;
  w.el.style.transition = 'opacity 0.2s, transform 0.2s';
  w.el.style.opacity = '0';
  w.el.style.transform = 'translateX(-50%) scale(0.94)';
  setTimeout(() => {
    w.el.style.display = 'none';
    w.open = false;
    w.el.style.transition = '';
  }, 200);
  document.getElementById(`dot-${id}`)?.classList.remove('on');
}

function minimizeWindow(id) {
  const w = windows[id];
  if (!w) return;
  w.el.style.transition = 'opacity 0.25s, transform 0.25s';
  w.el.style.opacity = '0';
  w.el.style.transform = 'translateX(-50%) scale(0.88) translateY(60px)';
  setTimeout(() => {
    w.el.style.display = 'none';
    w.min = true;
    w.el.style.transition = '';
  }, 250);
}

function maximizeWindow(id) {
  const w = windows[id];
  if (!w) return;
  const isMax = w.el.dataset.maximized === '1';
  if (!isMax) {
    w.el.style.top      = 'var(--menubar-h)';
    w.el.style.left     = '0';
    w.el.style.width    = '100vw';
    w.el.style.height   = `calc(100vh - var(--menubar-h))`;
    w.el.style.transform = 'none';
    w.el.style.borderRadius = '0';
    w.el.dataset.maximized = '1';
  } else {
    w.el.style.top      = '50px';
    w.el.style.left     = '50%';
    w.el.style.width    = 'min(960px, 94vw)';
    w.el.style.height   = 'calc(100vh - 90px)';
    w.el.style.transform = 'translateX(-50%)';
    w.el.style.borderRadius = '12px';
    w.el.dataset.maximized = '0';
  }
}

function focusWindow(id) {
  let z = 200;
  Object.keys(windows).forEach(k => {
    windows[k].el.classList.add('inactive');
    windows[k].el.style.zIndex = z++;
  });
  windows[id].el.classList.remove('inactive');
  windows[id].el.style.zIndex = z;
}

// Window control buttons
document.querySelectorAll('.wd').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const action = btn.dataset.action;
    const win    = btn.dataset.win;
    if (action === 'close')    closeWindow(win);
    if (action === 'minimize') minimizeWindow(win);
    if (action === 'maximize') maximizeWindow(win);
  });
});

// Titlebar click = focus
document.querySelectorAll('[data-drag]').forEach(bar => {
  bar.addEventListener('mousedown', () => focusWindow(bar.dataset.drag));
});

// Desktop icons & dock
document.querySelectorAll('.desk-icon, .dock-item').forEach(el => {
  el.addEventListener('dblclick', () => {
    const id = el.dataset.window;
    if (!id) return;
    const w = windows[id];
    if (w && (!w.open || w.min)) openWindow(id);
    else if (w && w.open) focusWindow(id);
  });
  el.addEventListener('click', () => {
    const id = el.dataset.window;
    if (!id) return;
    const w = windows[id];
    if (w) {
      if (!w.open || w.min) openWindow(id);
      else focusWindow(id);
    }
  });
});

/* ══════════════════════════════════════════════
   FINDER NAVIGATION
══════════════════════════════════════════════ */
window.showSection = function(id) {
  document.querySelectorAll('.fc-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.fs-item').forEach(i => i.classList.remove('active'));
  const sec = document.getElementById(`fc-${id}`);
  if (sec) sec.classList.add('active');
  const item = document.querySelector(`.fs-item[data-section="${id}"]`);
  if (item) item.classList.add('active');
  // open finder if not open
  if (!windows.finder.open) openWindow('finder');
  else focusWindow('finder');
};

document.querySelectorAll('.fs-item').forEach(item => {
  item.addEventListener('click', () => showSection(item.dataset.section));
});

/* ══════════════════════════════════════════════
   TERMINAL ENGINE
══════════════════════════════════════════════ */
const out   = document.getElementById('term-output');
const inp   = document.getElementById('term-input');
const hist  = [];
let histIdx = -1;

function tl(text, cls = 'tl-white') {
  const d = document.createElement('div');
  d.className = `tl ${cls}`;
  d.innerHTML = text;
  out.appendChild(d);
  out.scrollTop = out.scrollHeight;
  return d;
}
function tlGap() {
  const d = document.createElement('span');
  d.className = 'tl tl-gap';
  out.appendChild(d);
}
function tlEcho(cmd) {
  tl(`<span style="color:#30d158">gopal</span><span style="color:rgba(255,255,255,0.3)">@portfolio:~$</span> <span style="color:rgba(255,255,255,0.9)">${cmd}</span>`, 'tl-white');
}

function printWelcome() {
  tl('┌─────────────────────────────────────────────┐', 'tl-green');
  tl('│                                             │', 'tl-green');
  tl('│   <span style="color:#e8e8e8;font-weight:600;font-size:1.05em">Golla Gopal</span>  <span style="color:rgba(255,255,255,0.3)">·</span>  <span style="color:#30d158">Full Stack Dev</span>        │', 'tl-green');
  tl('│   <span style="color:rgba(255,255,255,0.35)">BTech CSE AI&ML  ·  LPU  ·  India</span>        │', 'tl-green');
  tl('│                                             │', 'tl-green');
  tl('└─────────────────────────────────────────────┘', 'tl-green');
  tlGap();
  tl('Type <span style="color:#ffd60a">help</span> to see all commands.  <span style="color:rgba(255,255,255,0.25)">Tab = autocomplete  ↑↓ = history</span>', 'tl-mid');
  tlGap();
}

const CMDS = {
  help() {
    tlGap();
    tl('COMMANDS', 'tl-amber');
    tl('─────────────────────────────────────────', 'tl-dim');
    const list = [
      ['about',         'Open About section'],
      ['skills',        'Open Skills section'],
      ['projects',      'Open Projects section'],
      ['internship',    'View 1Stop.AI internship details'],
      ['education',     'Open Education section'],
      ['contact',       'Open Contact section'],
      ['certificates',  'View all 12 certificates'],
      ['ls',            'List all sections'],
      ['whoami',        'Display identity'],
      ['open github',   'Open GitHub profile ↗'],
      ['open linkedin', 'Open LinkedIn profile ↗'],
      ['open leetcode', 'Open LeetCode profile ↗'],
      ['open gfg',      'Open GeeksforGeeks profile ↗'],
      ['download cv',   'Download resume PDF'],
      ['clear',         'Clear terminal'],
      ['help',          'Show this menu'],
    ];
    list.forEach(([cmd, desc]) => {
      tl(`  <span style="color:#30d158;display:inline-block;min-width:150px">${cmd}</span><span style="color:rgba(255,255,255,0.28)">│</span> <span style="color:rgba(255,255,255,0.5)">${desc}</span>`);
    });
    tlGap();
  },

  ls() {
    tlGap();
    tl('sections/', 'tl-amber');
    const s = ['about','skills','projects','internship','education','certificates','contact'];
    s.forEach((name, i) => {
      setTimeout(() => {
        tl(`  <span style="color:#30d158">📁 ${name}/</span>`);
        out.scrollTop = out.scrollHeight;
      }, i * 70);
    });
    setTimeout(tlGap, s.length * 70 + 80);
  },

  whoami() {
    tlGap();
    const rows = [
      ['name',     'Golla Gopal'],
      ['role',     'Full Stack Developer'],
      ['studying', 'BTech CSE (AI & ML) — LPU'],
      ['stack',    'Python · Django · JS · HTML · CSS'],
      ['problems', '400+ (LeetCode + GFG)'],
      ['status',   '🟢 open_to_opportunities'],
    ];
    rows.forEach(([k, v], i) => {
      setTimeout(() => {
        tl(`  <span style="color:#ffd60a">${k.padEnd(10)}</span><span style="color:rgba(255,255,255,0.28)">:</span> <span style="color:rgba(255,255,255,0.8)">${v}</span>`);
        out.scrollTop = out.scrollHeight;
      }, i * 90);
    });
    setTimeout(tlGap, rows.length * 90 + 80);
  },

  about()     { navTo('about');     },
  skills()    { navTo('skills');    },
  projects()  { navTo('projects'); },
  education() { navTo('education');},
  contact()      { navTo('contact');   },
  certificates() {
    tlGap();
    tl('🏆 CERTIFICATES & ACHIEVEMENTS', 'tl-amber');
    tl('─────────────────────────────────────────', 'tl-dim');
    tlGap();
    const certs = [
      ['💼', 'Internship Certificate',         '1Stop.AI · Jul 2025'],
      ['🏆', 'Project Completion (PET)',        '1Stop.AI · Jul 2025'],
      ['🐍', 'Complete Python Developer',       'Udemy · Mar 2024'],
      ['🤖', 'Generative AI',                  'Udemy · 2025'],
      ['🧠', 'Data Structures & Algorithms',   'Neo Colab · May 2025'],
      ['☕', 'Java Programming',               'Neo Colab · May 2025'],
      ['💻', 'C Language',                     'Neo Colab · 2025'],
      ['🎨', 'Responsive Web Design',          'freeCodeCamp · 2024'],
      ['🌐', 'Network Communication',          '2024'],
      ['📡', 'Computer Communications',        '2024'],
      ['📝', 'English Grammar Pro',            '2024'],
      ['⚡', 'WEBka Hackathon Participation',  'LPU × Web3 Sabha · Mar 2024'],
    ];
    certs.forEach(([icon, name, src], i) => {
      setTimeout(() => {
        tl(`  ${icon} <span style="color:#D7C9B2;display:inline-block;min-width:200px">${name}</span> <span style="color:rgba(255,255,255,0.28)">— ${src}</span>`);
        out.scrollTop = out.scrollHeight;
      }, i * 80);
    });
    setTimeout(() => {
      tlGap();
      tl(`  <span style="color:#30d158">✓ Total: 12 Certificates across 5 platforms</span>`);
      tlGap();
    }, certs.length * 80 + 100);
  },
  internship() {
    tlGap();
    tl('╔══════════════════════════════════════════╗', 'tl-green');
    tl('║  💼  1Stop.AI — Frontend Internship      ║', 'tl-green');
    tl('╚══════════════════════════════════════════╝', 'tl-green');
    tlGap();
    const rows = [
      ['Company',  '1Stop.AI (EdTech & Training Solutions)'],
      ['Role',     'Frontend Developer Intern'],
      ['Duration', 'July 2025'],
      ['Location', 'Remote / India'],
    ];
    rows.forEach(([k,v]) => {
      tl(`  <span style="color:#ffd60a">${k.padEnd(10)}</span><span style="color:rgba(255,255,255,0.3)">:</span> <span style="color:#D7C9B2">${v}</span>`);
    });
    tlGap();
    tl('  <span style="color:rgba(255,255,255,0.5)">Responsibilities:</span>', 'tl-white');
    [
      '→ Built responsive UI components (HTML, CSS, JS, jQuery, Bootstrap 5)',
      '→ Designed cross-device compatible pages (mobile, tablet, desktop)',
      '→ Debugged UI issues & optimized layouts for better UX',
      '→ Implemented LocalStorage-based dynamic features',
    ].forEach(l => tl(`  <span style="color:#888">${l}</span>`));
    tlGap();
    tl('  <span style="color:#30d158">✓ Certificate: Web Development (Frontend) — July 2025</span>');
    tlGap();
    setTimeout(() => {
      showSection('internship');
      tl('  <span style="color:#555">→ Opening internship section in Portfolio.app...</span>');
      tlGap();
    }, 800);
  },

  'open github'() {
    tl('→ Opening GitHub...', 'tl-mid');
    setTimeout(() => window.open('https://github.com/BitByGopal','_blank'), 400);
    tl('<span style="color:#30d158">✓ Opened in new tab</span>');
    tlGap();
  },
  'open linkedin'() {
    tl('→ Opening LinkedIn...', 'tl-mid');
    setTimeout(() => window.open('https://linkedin.com/in/golla-gopal','_blank'), 400);
    tl('<span style="color:#30d158">✓ Opened in new tab</span>');
    tlGap();
  },
  'open leetcode'() {
    tl('→ Opening LeetCode...', 'tl-mid');
    setTimeout(() => window.open('https://leetcode.com/u/BitByGopal/','_blank'), 400);
    tl('<span style="color:#30d158">✓ Opened in new tab</span>');
    tlGap();
  },
  'open gfg'() {
    tl('→ Opening GeeksforGeeks...', 'tl-mid');
    setTimeout(() => window.open('https://www.geeksforgeeks.org/profile/bitbygopal','_blank'), 400);
    tl('<span style="color:#30d158">✓ Opened in new tab</span>');
    tlGap();
  },
  'download cv'() {
    tl('→ Downloading Gopal_CV.pdf ...', 'tl-mid');
    const a = document.createElement('a');
    a.href = 'Gopal_CV.pdf'; a.download = 'Gopal_CV.pdf'; a.click();
    setTimeout(() => { tl('<span style="color:#30d158">✓ Download started</span>'); tlGap(); }, 500);
  },
  clear() { out.innerHTML = ''; },
};

function navTo(id) {
  tlGap();
  tl(`→ cd ${id}/`, 'tl-mid');
  setTimeout(() => {
    showSection(id);
    tl(`<span style="color:#30d158">✓ Navigated to ${id}</span>`);
    tlGap();
  }, 250);
}

inp.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const raw = inp.value.trim().toLowerCase();
    inp.value = '';
    if (!raw) return;
    hist.unshift(raw);
    histIdx = -1;
    tlEcho(raw);
    const fn = CMDS[raw];
    if (fn) { fn(); }
    else {
      tlGap();
      tl(`<span style="color:#ff453a">command not found: ${raw}</span>`);
      tl(`Type <span style="color:#ffd60a">help</span> for available commands.`, 'tl-mid');
      tlGap();
    }
  }
  if (e.key === 'ArrowUp')   { e.preventDefault(); if (histIdx < hist.length-1) { histIdx++; inp.value = hist[histIdx]; } }
  if (e.key === 'ArrowDown') { e.preventDefault(); if (histIdx > 0) { histIdx--; inp.value = hist[histIdx]; } else { histIdx=-1; inp.value=''; } }
  if (e.key === 'Tab') {
    e.preventDefault();
    const p = inp.value.trim().toLowerCase();
    const m = Object.keys(CMDS).find(k => k.startsWith(p));
    if (m) inp.value = m;
  }
});

out.addEventListener('click', () => inp.focus());


/* ══════════════════════════════════════════════
   GAMES
══════════════════════════════════════════════ */
windows.games = { el: document.getElementById('win-games'), open: false, min: false };

/* Tab switcher */
document.querySelectorAll('.game-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.game-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.game-area').forEach(a => a.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`game-${tab.dataset.game}`).classList.add('active');
  });
});

/* Card reveal helper */
function addCard(containerId, title, sub) {
  const box = document.getElementById(containerId);
  const empty = box.querySelector('.gr-empty');
  if (empty) empty.remove();
  const card = document.createElement('div');
  card.className = 'gr-card';
  card.innerHTML = `<div class="gr-card-title">${title}</div>${sub ? `<div class="gr-card-sub">${sub}</div>` : ''}`;
  box.appendChild(card);
  box.scrollTop = box.scrollHeight;
}

/* Full project card for flappy — with desc, tech, GitHub */
function addFlappyCard(containerId, proj) {
  const box = document.getElementById(containerId);
  const empty = box.querySelector('.gr-empty');
  if (empty) empty.remove();
  const card = document.createElement('div');
  card.className = 'gr-card gr-card-full';
  const techTags = (proj.tech || []).map(t => `<span>${t}</span>`).join('');
  const liveBtn = proj.live ? `<a href="${proj.live}" target="_blank" class="gr-card-link gr-card-live">🌐 Live Demo ↗</a>` : '';
  card.innerHTML = `
    <div class="gr-card-title">${proj.title}</div>
    <div class="gr-card-sub">${proj.sub}</div>
    <div class="gr-card-tech">${techTags}</div>
    ${liveBtn}
    <a href="${proj.github}" target="_blank" class="gr-card-link">View on GitHub ↗</a>`;
  box.appendChild(card);
  box.scrollTop = box.scrollHeight;
}

/* ══════════════════════════════════════════════
   SNAKE — Skills
══════════════════════════════════════════════ */
const SKILLS = [
  { title: 'Python 🐍',        sub: 'Core language — ML, scripting, backend' },
  { title: 'Django ⚙️',        sub: 'Full-stack web framework' },
  { title: 'JavaScript ⚡',    sub: 'Frontend interactivity & logic' },
  { title: 'HTML & CSS 🎨',    sub: 'Responsive UI, layouts, animations' },
  { title: 'Flask 🌶️',         sub: 'Lightweight Python web framework' },
  { title: 'Bootstrap 📐',     sub: 'Mobile-first CSS framework' },
  { title: 'jQuery 💫',        sub: 'DOM manipulation & AJAX' },
  { title: 'NumPy & Pandas 📊',sub: 'Data analysis & manipulation' },
  { title: 'Git & GitHub 🔀',  sub: 'Version control & collaboration' },
  { title: 'Docker 🐳',        sub: 'Containerization & deployment' },
  { title: 'DSA 🧠',           sub: '400+ problems on LeetCode & GFG' },
  { title: 'Machine Learning 🤖', sub: 'Regression, Decision Trees, Streamlit' },
];

(function initSnake() {
  const canvas = document.getElementById('snakeCanvas');
  const ctx = canvas.getContext('2d');
  const COLS = 18, ROWS = 18;
  let snake, dir, nextDir, food, running, score, level, unlocked, loop;

  function reset() {
    snake = [{x:9,y:9},{x:8,y:9},{x:7,y:9}];
    dir = {x:1,y:0}; nextDir = {x:1,y:0};
    score = 0; level = 1; unlocked = 0; running = false;
    document.getElementById('snakeScore').textContent = 0;
    document.getElementById('snakeLevel').textContent = 1;
    document.getElementById('snakeUnlocked').textContent = `0/${SKILLS.length}`;
    document.getElementById('snakeCards').innerHTML = '<div class="gr-empty">Eat food to unlock skills one by one!</div>';
    placeFood(); draw();
  }

  function placeFood() {
    do { food = {x:Math.floor(Math.random()*COLS), y:Math.floor(Math.random()*ROWS)}; }
    while (snake.some(s=>s.x===food.x&&s.y===food.y));
  }

  function draw() {
    const W = canvas.width, H = canvas.height;
    const cw = W/COLS, ch = H/ROWS;
    ctx.fillStyle = '#0d0d0d'; ctx.fillRect(0,0,W,H);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 0.5;
    for(let x=0;x<=COLS;x++){ctx.beginPath();ctx.moveTo(x*cw,0);ctx.lineTo(x*cw,H);ctx.stroke();}
    for(let y=0;y<=ROWS;y++){ctx.beginPath();ctx.moveTo(0,y*ch);ctx.lineTo(W,y*ch);ctx.stroke();}

    // Food glow
    const grd = ctx.createRadialGradient(food.x*cw+cw/2,food.y*ch+ch/2,1,food.x*cw+cw/2,food.y*ch+ch/2,cw/1.5);
    grd.addColorStop(0,'#F5ECDC'); grd.addColorStop(1,'rgba(215,201,178,0.1)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(food.x*cw+cw/2, food.y*ch+ch/2, cw/2.5, 0, Math.PI*2);
    ctx.fill();

    // Snake body
    snake.forEach((s,i) => {
      const ratio = 1 - i/snake.length;
      ctx.fillStyle = i===0 ? '#F5ECDC' : `rgba(215,201,178,${Math.max(0.15, ratio*0.7)})`;
      const pad = i===0 ? 1 : 2;
      ctx.beginPath();
      ctx.roundRect(s.x*cw+pad, s.y*ch+pad, cw-pad*2, ch-pad*2, 3);
      ctx.fill();
    });

    if (!running) {
      ctx.fillStyle = 'rgba(0,0,0,0.65)'; ctx.fillRect(0,0,W,H);
      ctx.fillStyle = '#D7C9B2';
      ctx.font = `bold 18px -apple-system`;
      ctx.textAlign = 'center';
      ctx.fillText(score>0 ? 'Game Over' : 'Press Start', W/2, H/2-8);
      ctx.fillStyle = '#7B7369'; ctx.font = '13px -apple-system';
      ctx.fillText(`Score: ${score}`, W/2, H/2+14);
    }
  }

  function step() {
    dir = {...nextDir};
    const head = {x:snake[0].x+dir.x, y:snake[0].y+dir.y};
    if (head.x<0||head.x>=COLS||head.y<0||head.y>=ROWS||snake.some(s=>s.x===head.x&&s.y===head.y)) {
      running=false; clearInterval(loop); draw(); return;
    }
    snake.unshift(head);
    if (head.x===food.x&&head.y===food.y) {
      score += 10*level;
      level = Math.floor(score/60)+1;
      document.getElementById('snakeScore').textContent = score;
      document.getElementById('snakeLevel').textContent = level;
      if (unlocked < SKILLS.length) {
        const sk = SKILLS[unlocked];
        addCard('snakeCards', sk.title, sk.sub);
        unlocked++;
        document.getElementById('snakeUnlocked').textContent = `${unlocked}/${SKILLS.length}`;
      }
      placeFood();
    } else { snake.pop(); }
    draw();
  }

  document.getElementById('snakeStart').addEventListener('click', () => {
    reset(); running=true;
    document.getElementById('snakeStart').textContent = '■ Running';
    clearInterval(loop);
    loop = setInterval(() => { if(running) step(); }, Math.max(120, 220-(level-1)*10));
  });

  document.addEventListener('keydown', e => {
    if (!document.getElementById('game-snake').classList.contains('active')) return;
    const map = {ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0},
                 w:{x:0,y:-1},s:{x:0,y:1},a:{x:-1,y:0},d:{x:1,y:0}};
    const nd = map[e.key];
    if (nd && !(nd.x===-dir.x&&nd.y===-dir.y)) { nextDir=nd; e.preventDefault(); }
  });

  reset();
})();

/* ══════════════════════════════════════════════
   FLAPPY BIRD — Projects & Experience
══════════════════════════════════════════════ */
const PROJECTS = [
  {
    title: 'YumYum 🍔',
    sub: 'A full-featured food delivery platform built with Django. Users browse restaurants by category, explore menus, add items to cart, and place orders online. Includes complete user authentication, session management, order history, and a fully responsive UI across all devices.',
    tech: ['HTML','CSS','JavaScript','Django','SQLite'],
    github: 'https://github.com/BitByGopal',
    live: 'https://web-production-58c6.up.railway.app/'
  },
  {
    title: 'SmartShop 🛒',
    sub: 'A clean, minimal e-commerce website built with HTML, CSS, and JavaScript. Features a bold hero section, product grid with real-time search and category filter, Add to Cart functionality, and live cart count in the navbar. Designed with a premium black-and-white aesthetic, fully responsive.',
    tech: ['HTML','CSS','JavaScript','Bootstrap'],
    github: 'https://github.com/BitByGopal'
  },
  {
    title: 'Smart Home ML 🤖',
    sub: 'A machine learning project that optimizes energy and water usage in home appliances like washing machines and refrigerators. The pipeline covers data simulation, EDA, feature engineering, and training regression and decision tree models. A Streamlit dashboard visualizes real-time predictions and smart conservation recommendations.',
    tech: ['Python','Pandas','Scikit-learn','Streamlit','Colab'],
    github: 'https://github.com/BitByGopal'
  },
  {
    title: 'Math Fun 4 Kids 🧮',
    sub: 'An interactive educational web app for children in early grades with four game modes — Addition, Subtraction, Sort Numbers, and Count Pictures. Questions are dynamically generated using DSA concepts. Players earn stars, track scores, and compete with high scores, making math learning fun and engaging.',
    tech: ['HTML','CSS','JavaScript','DSA'],
    github: 'https://github.com/BitByGopal'
  },
  {
    title: 'Expense Tracker 💰',
    sub: 'A personal finance web app to log, track, and analyze daily expenses. Users add entries with amount, category, date, and description. Filters allow sorting by category and date range. A dynamic summary shows total spending. All data persists across sessions using LocalStorage — no backend required.',
    tech: ['JavaScript','jQuery','Bootstrap 5','LocalStorage'],
    github: 'https://github.com/BitByGopal'
  },
  {
    title: '1Stop.AI Internship 💼',
    sub: 'Frontend Developer Intern at 1Stop.AI — an EdTech & Training Solutions company. Built responsive UI components using HTML, CSS, JavaScript, jQuery, and Bootstrap 5. Designed cross-device compatible web pages for mobile, tablet, and desktop. Debugged UI issues and implemented LocalStorage-based dynamic features.',
    tech: ['HTML','CSS','JavaScript','jQuery','Bootstrap 5'],
    github: 'https://linkedin.com/in/golla-gopal'
  },
];

(function initFlappy() {
  const canvas = document.getElementById('flappyCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  let bird, pipes, running, score, best=0, unlocked, animId;

  function reset() {
    bird = {x:60, y:H/2, vy:0, gravity:0.22, jump:-5.5, r:14};
    pipes = []; score=0; unlocked=0; running=false;
    document.getElementById('flappyScore').textContent=0;
    document.getElementById('flappyBest').textContent=best;
    document.getElementById('flappyUnlocked').textContent=`0/${PROJECTS.length}`;
    document.getElementById('flappyCards').innerHTML='<div class="gr-empty">Pass pipes to reveal projects & experience!</div>';
    if(animId) cancelAnimationFrame(animId);
    draw();
  }

  function addPipe() {
    const gap = 140;
    const top = 60 + Math.random()*(H - gap - 120);
    pipes.push({x:W, top, bot:top+gap, w:42, scored:false});
  }

  let frameCount = 0;
  function gameLoop() {
    if (!running) return;
    animId = requestAnimationFrame(gameLoop);
    frameCount++;

    // Spawn pipes
    if (frameCount % 100 === 0) addPipe();

    // Bird physics
    bird.vy += bird.gravity;
    bird.y += bird.vy;

    // Move pipes
    pipes.forEach(p => p.x -= 1.5);
    pipes = pipes.filter(p => p.x > -p.w);

    // Score + reveal
    pipes.forEach(p => {
      if (!p.scored && p.x + p.w < bird.x) {
        p.scored = true; score++;
        document.getElementById('flappyScore').textContent = score;
        if (score > best) { best=score; document.getElementById('flappyBest').textContent=best; }
        if (unlocked < PROJECTS.length) {
          const proj = PROJECTS[unlocked];
          addFlappyCard('flappyCards', proj);
          unlocked++;
          document.getElementById('flappyUnlocked').textContent=`${unlocked}/${PROJECTS.length}`;
        }
      }
    });

    // Collision
    const hit = bird.y-bird.r < 0 || bird.y+bird.r > H ||
      pipes.some(p => bird.x+bird.r > p.x && bird.x-bird.r < p.x+p.w &&
                      (bird.y-bird.r < p.top || bird.y+bird.r > p.bot));
    if (hit) { running=false; draw(); return; }

    draw();
  }

  function draw() {
    // Sky gradient
    const sky = ctx.createLinearGradient(0,0,0,H);
    sky.addColorStop(0,'#0d1117'); sky.addColorStop(1,'#1a1f2e');
    ctx.fillStyle=sky; ctx.fillRect(0,0,W,H);

    // Stars
    if (!running) {
      ctx.fillStyle='rgba(215,201,178,0.4)';
      [[40,30],[100,60],[200,20],[250,80],[60,120],[180,100]].forEach(([x,y])=>{
        ctx.fillRect(x,y,1.5,1.5);
      });
    }

    // Pipes
    pipes.forEach(p => {
      ctx.fillStyle='#2a3a2a';
      ctx.fillRect(p.x,0,p.w,p.top);
      ctx.fillRect(p.x,p.bot,p.w,H-p.bot);
      // Pipe caps
      ctx.fillStyle='#3a4a3a';
      ctx.fillRect(p.x-3,p.top-12,p.w+6,12);
      ctx.fillRect(p.x-3,p.bot,p.w+6,12);
    });

    // Bird
    ctx.save();
    ctx.translate(bird.x, bird.y);
    ctx.rotate(Math.min(Math.PI/4, bird.vy*0.06));
    ctx.fillStyle='#D7C9B2';
    ctx.beginPath(); ctx.arc(0,0,bird.r,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#1F1D20';
    ctx.beginPath(); ctx.arc(5,-3,4,0,Math.PI*2); ctx.fill(); // eye
    ctx.fillStyle='#F5ECDC';
    ctx.beginPath(); ctx.arc(5.5,-3,1.5,0,Math.PI*2); ctx.fill(); // pupil
    ctx.restore();

    // Score
    ctx.fillStyle='rgba(215,201,178,0.8)';
    ctx.font='bold 18px -apple-system';
    ctx.textAlign='center';
    ctx.fillText(score, W/2, 36);

    if (!running) {
      ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#D7C9B2'; ctx.font='bold 18px -apple-system';
      ctx.textAlign='center';
      ctx.fillText(score>0?'Game Over':'Click Start', W/2, H/2-8);
      ctx.fillStyle='#7B7369'; ctx.font='13px -apple-system';
      ctx.fillText(`Score: ${score}`, W/2, H/2+14);
    }
  }

  function flap() { if(running) bird.vy = bird.jump; }

  document.getElementById('flappyStart').addEventListener('click', () => {
    reset(); running=true; frameCount=0;
    document.getElementById('flappyStart').textContent='■ Running';
    addPipe(); gameLoop();
  });

  canvas.addEventListener('click', flap);
  document.addEventListener('keydown', e => {
    if (e.code==='Space' && document.getElementById('game-flappy').classList.contains('active')) {
      e.preventDefault(); flap();
    }
  });

  reset();
})();

/* ══════════════════════════════════════════════
   2048 — Certificates & Achievements
══════════════════════════════════════════════ */
const CERTS = [
  { title: 'Internship Certificate 💼', sub: '1Stop.AI — Frontend Dev Intern · July 2025' },
  { title: 'Web Dev (Frontend) 🏆', sub: '1Stop.AI — Project Completion · July 2025' },
  { title: 'Complete Python Dev 🐍', sub: 'Udemy — March 2024' },
  { title: 'Generative AI 🤖', sub: 'Udemy — 2025' },
  { title: 'DSA Certificate 🧠', sub: 'Neo Colab — May 2025' },
  { title: 'Java Programming ☕', sub: 'Neo Colab — May 2025' },
  { title: 'C Language 💻', sub: 'Neo Colab — 2025' },
  { title: 'Responsive Web Design 🎨', sub: 'freeCodeCamp — 2024' },
  { title: 'Network Communication 🌐', sub: 'Fundamentals Course — 2024' },
  { title: 'Computer Communications 📡', sub: '2024' },
  { title: 'English Grammar Pro 📝', sub: '2024' },
  { title: 'WEBka Hackathon ⚡', sub: 'LPU × Web3 Sabha × BlockSeBlock · 22-23 March 2024' },
  { title: '200+ LeetCode ⚡', sub: 'DSA & Algorithms problems solved' },
  { title: '200+ GeeksforGeeks ⚡', sub: 'Competitive coding problems' },
  { title: '5+ Projects Built 🚀', sub: 'Real-world web & ML projects deployed' },
  { title: 'Full Stack Intern 💼', sub: '1Stop.AI — Responsive UI components' },
];

(function init2048() {
  let board, score, best=0, mergeCount;

  function newGame() {
    board=Array(4).fill(null).map(()=>Array(4).fill(0));
    score=0; mergeCount=0;
    addTile(); addTile(); render();
    document.getElementById('g2048Score').textContent=0;
    document.getElementById('g2048Unlocked').textContent=`0/${CERTS.length}`;
    document.getElementById('g2048Cards').innerHTML='<div class="gr-empty">Merge tiles to unlock certificates!</div>';
  }

  function addTile() {
    const empty=[];
    board.forEach((r,y)=>r.forEach((v,x)=>{if(!v)empty.push({x,y});}));
    if(!empty.length) return;
    const {x,y}=empty[Math.floor(Math.random()*empty.length)];
    board[y][x]=Math.random()<0.9?2:4;
  }

  function render() {
    const boardEl=document.getElementById('g2048Board');
    boardEl.innerHTML='';
    board.forEach(row=>row.forEach(val=>{
      const cell=document.createElement('div');
      cell.className='g2048-cell'+(val?` v${val}`:'');
      cell.textContent=val||'';
      boardEl.appendChild(cell);
    }));
  }

  function slide(row) {
    let arr=row.filter(v=>v), m=false;
    for(let i=0;i<arr.length-1;i++) {
      if(arr[i]===arr[i+1]) {
        arr[i]*=2; score+=arr[i]; arr.splice(i+1,1); m=true;
      }
    }
    while(arr.length<4) arr.push(0);
    if(m){
      document.getElementById('g2048Score').textContent=score;
      if(score>best){best=score;document.getElementById('g2048Best').textContent=best;}
      if(mergeCount<CERTS.length){
        addCard('g2048Cards',CERTS[mergeCount].title,CERTS[mergeCount].sub);
        mergeCount++;
        document.getElementById('g2048Unlocked').textContent=`${mergeCount}/${CERTS.length}`;
      }
    }
    return arr;
  }

  function move(dir) {
    let moved=false;
    if(dir==='left') board=board.map(r=>{const s=slide(r);if(s.join()!==r.join())moved=true;return s;});
    if(dir==='right') board=board.map(r=>{const rev=r.slice().reverse();const s=slide(rev).reverse();if(s.join()!==r.join())moved=true;return s;});
    if(dir==='up'||dir==='down'){
      for(let x=0;x<4;x++){
        let col=board.map(r=>r[x]);
        if(dir==='down')col.reverse();
        const s=slide(col);
        if(dir==='down')s.reverse();
        if(s.join()!==col.join())moved=true;
        board.forEach((r,y)=>r[x]=s[y]);
      }
    }
    if(moved){addTile();render();}
  }

  document.addEventListener('keydown',e=>{
    if(!document.getElementById('game-g2048').classList.contains('active'))return;
    const map={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'};
    if(map[e.key]){e.preventDefault();move(map[e.key]);}
  });

  document.getElementById('g2048New').addEventListener('click',newGame);
  newGame();
})();

/* ══════════════════════════════════════════════
   MEMORY CARD FLIP — Project Screenshots
══════════════════════════════════════════════ */
(function initMemory() {
  const PROJECTS = [
    {
      id: 'yumyum', name: 'YumYum 🍔',
      // img: 'images/YumYum.png',
      desc: 'A full-featured food delivery web platform built with Django. Users can browse restaurants by category, explore menus, add items to cart, and place orders. Includes complete user authentication, session management, order history, and a responsive UI that works seamlessly across mobile and desktop devices.',
      tech: ['HTML','CSS','JavaScript','Django','SQLite'],
      github: 'https://github.com/BitByGopal'
    },
    {
      id: 'smartshop', name: 'SmartShop Home 🛒',
      // img: 'images/Smartshop_Home.png',
      desc: 'A clean, minimal e-commerce landing page built with pure HTML, CSS, and JavaScript. Features a bold hero section, product highlights, and smooth navigation. Designed with a black-and-white aesthetic for a premium feel. Fully responsive across all screen sizes with fast load times and zero dependencies.',
      tech: ['HTML','CSS','JavaScript','Bootstrap'],
      github: 'https://github.com/BitByGopal'
    },
    {
      id: 'smartshop2', name: 'SmartShop Products 🛍️',
      // img: 'images/Smartshop_Products.png',
      desc: 'The product listing page of SmartShop featuring a real-time search bar, category filter dropdown, and a dynamic product grid. Users can filter by clothing type and instantly see results update. Each product card has a name, price, and Add to Cart button. Cart count updates live in the navbar.',
      tech: ['HTML','CSS','JavaScript','Bootstrap'],
      github: 'https://github.com/BitByGopal'
    },
    {
      id: 'mathfun', name: 'Math Fun 4 Kids 🧮',
      // img: 'images/Maths_Home.png',
      desc: 'An interactive educational web app designed for children in early grades. Includes four learning modules: Addition, Subtraction, Sort Numbers, and Count Pictures. Questions are dynamically generated using DSA concepts. Players earn stars and track their high scores, making learning math fun and competitive.',
      tech: ['HTML','CSS','JavaScript','DSA Concepts'],
      github: 'https://github.com/BitByGopal'
    },
    {
      id: 'mathsort', name: 'Math Count & Sort 🔢',
      // img: 'images/Maths_Sort.png',
      desc: 'The Count Pictures module of Math Fun 4 Kids — children are shown a set of visual items (balloons, fruits, etc.) and must enter the correct count. Instant right/wrong feedback is provided, stars are awarded for correct answers, and the high score is tracked across sessions using LocalStorage.',
      tech: ['HTML','CSS','JavaScript'],
      github: 'https://github.com/BitByGopal'
    },
    {
      id: 'expense', name: 'Expense Tracker 💰',
      // img: 'images/PET.png',
      desc: 'A personal finance management web app to log and analyze daily expenses. Users can add entries with amount, category, date, and description. Filters allow sorting by category and date range. An expense summary section shows total spending. All data persists across browser sessions using LocalStorage — no backend needed.',
      tech: ['JavaScript','jQuery','Bootstrap 5','LocalStorage'],
      github: 'https://github.com/BitByGopal'
    },
  ];

  const grid      = document.getElementById('memoryGrid');
  const detail    = document.getElementById('memoryDetail');
  const movesEl   = document.getElementById('memMoves');
  const matchedEl = document.getElementById('memMatched');
  const timeEl    = document.getElementById('memTime');

  let flipped = [], matched = 0, moves = 0, lock = false, timer, seconds = 0, matchedProjects = [];

  function startTimer() {
    clearInterval(timer);
    seconds = 0; timeEl.textContent = '0s';
    timer = setInterval(() => { seconds++; timeEl.textContent = seconds+'s'; }, 1000);
  }

  function buildGrid() {
    grid.innerHTML = '';
    detail.innerHTML = '<div class="md-header">📁 Matched Projects</div><div class="md-empty">Match cards to reveal project details!</div>';
    flipped = []; matched = 0; moves = 0; lock = false; matchedProjects = [];
    movesEl.textContent = 0;
    matchedEl.textContent = `0/${PROJECTS.length}`;
    clearInterval(timer); timeEl.textContent = '0s';

    // Duplicate + shuffle
    const cards = [...PROJECTS, ...PROJECTS]
      .sort(() => Math.random() - 0.5);

    cards.forEach((proj, idx) => {
      const card = document.createElement('div');
      card.className = 'mem-card';
      card.dataset.id = proj.id;
      card.dataset.idx = idx;
      card.innerHTML = `
        <div class="mem-card-inner">
          <div class="mem-front">🃏</div>
          <div class="mem-back">
            <img src="${proj.img}" alt="${proj.name}" loading="lazy"
                 onerror="this.parentElement.classList.add('styled');this.parentElement.innerHTML='<span class=\\'mb-icon\\'>${proj.name.split(' ')[1]||'📁'}</span><span class=\\'mb-name\\'>${proj.name}</span>'"/>
          </div>
        </div>`;
      card.addEventListener('click', () => flipCard(card, proj));
      grid.appendChild(card);
    });
  }

  function flipCard(card, proj) {
    if (lock || card.classList.contains('flipped') || card.classList.contains('matched')) return;
    if (moves === 0 && flipped.length === 0) startTimer();

    card.classList.add('flipped');
    flipped.push({card, proj});

    if (flipped.length === 2) {
      moves++;
      movesEl.textContent = moves;
      lock = true;
      const [a, b] = flipped;
      if (a.proj.id === b.proj.id) {
        // Match!
        setTimeout(() => {
          a.card.classList.add('matched');
          b.card.classList.add('matched');
          matched++;
          matchedEl.textContent = `${matched}/${PROJECTS.length}`;
          flipped = []; lock = false;
          // Add to detail panel
          addProjectDetail(a.proj);
          if (matched === PROJECTS.length) {
            clearInterval(timer);
            setTimeout(() => showWin(), 400);
          }
        }, 500);
      } else {
        setTimeout(() => {
          a.card.classList.remove('flipped');
          b.card.classList.remove('flipped');
          flipped = []; lock = false;
        }, 900);
      }
    }
  }

  function addProjectDetail(proj) {
    if (matchedProjects.includes(proj.id)) return;
    matchedProjects.push(proj.id);
    const empty = detail.querySelector('.md-empty');
    if (empty) empty.remove();
    const el = document.createElement('div');
    el.className = 'md-proj';
    el.innerHTML = `
      <div class="md-proj-name">${proj.name}</div>
      <div class="md-proj-desc">${proj.desc}</div>
      <div class="md-proj-tech">${proj.tech.map(t=>`<span>${t}</span>`).join('')}</div>
      <a href="${proj.github}" target="_blank" class="md-proj-link">View on GitHub ↗</a>`;
    detail.appendChild(el);
    detail.scrollTop = detail.scrollHeight;
  }

  function showWin() {
    const overlay = document.createElement('div');
    overlay.className = 'mem-win';
    overlay.style.position = 'absolute';
    overlay.innerHTML = `<h3>🎉 All Matched!</h3><p>${moves} moves · ${seconds}s · You've seen all projects!</p>`;
    grid.style.position = 'relative';
    grid.appendChild(overlay);
  }

  document.getElementById('memNew').addEventListener('click', buildGrid);
  buildGrid();
})();

/* ══════════════════════════════════════════════
   WEATHER — Phagwara, Punjab
══════════════════════════════════════════════ */
(function initWeather() {
  // Current conditions from live data — updates display
  const CONDITIONS = {
    clear: '☀️', sunny: '☀️', cloudy: '☁️', overcast: '☁️',
    rain: '🌧️', drizzle: '🌦️', snow: '❄️', fog: '🌫️',
    thunder: '⛈️', storm: '⛈️', wind: '💨', haze: '🌫️'
  };

  function getIcon(cond) {
    const c = (cond || '').toLowerCase();
    for (const [k, v] of Object.entries(CONDITIONS)) {
      if (c.includes(k)) return v;
    }
    return '🌤️';
  }

  function fToC(f) { return Math.round((f - 32) * 5/9); }

  async function fetchWeather() {
    try {
      const r = await fetch(
        'https://wttr.in/Phagwara,Punjab,India?format=j1'
      );
      if (!r.ok) throw new Error();
      const d = await r.json();
      const cur = d.current_condition[0];
      const tempC = cur.temp_C;
      const desc  = cur.weatherDesc[0].value;
      const icon  = getIcon(desc);
      document.getElementById('mbWeather').textContent = `${icon} ${tempC}°C`;
      document.getElementById('mbWeather').title = `${desc} — Phagwara, Punjab`;
    } catch {
      // Fallback to known current conditions
      document.getElementById('mbWeather').textContent = '☁️ 17°C';
      document.getElementById('mbWeather').title = 'Cloudy — Phagwara, Punjab';
    }
  }

  fetchWeather();
  setInterval(fetchWeather, 10 * 60 * 1000); // refresh every 10 min
})();

/* ══════════════════════════════════════════════
   CALENDAR WIDGET
══════════════════════════════════════════════ */
(function initCalendar() {
  const monthNames = ['January','February','March','April','May','June',
                      'July','August','September','October','November','December'];
  let viewDate = new Date();

  function render() {
    const now   = new Date();
    const year  = viewDate.getFullYear();
    const month = viewDate.getMonth();

    document.getElementById('calMonth').textContent = `${monthNames[month]} ${year}`;

    const grid  = document.getElementById('calGrid');
    grid.innerHTML = '';

    const first = new Date(year, month, 1).getDay();
    const days  = new Date(year, month + 1, 0).getDate();
    const prevDays = new Date(year, month, 0).getDate();

    // Prev month padding
    for (let i = first - 1; i >= 0; i--) {
      const el = document.createElement('div');
      el.className = 'cal-day other-month';
      el.textContent = prevDays - i;
      grid.appendChild(el);
    }

    // Current month
    for (let d = 1; d <= days; d++) {
      const el = document.createElement('div');
      el.className = 'cal-day';
      const isToday = d === now.getDate() && month === now.getMonth() && year === now.getFullYear();
      if (isToday) el.classList.add('today');
      el.textContent = d;
      grid.appendChild(el);
    }

    // Next month padding
    const total = grid.children.length;
    const remaining = total % 7 === 0 ? 0 : 7 - (total % 7);
    for (let d = 1; d <= remaining; d++) {
      const el = document.createElement('div');
      el.className = 'cal-day other-month';
      el.textContent = d;
      grid.appendChild(el);
    }
  }

  document.getElementById('calPrev').addEventListener('click', () => {
    viewDate.setMonth(viewDate.getMonth() - 1);
    render();
  });
  document.getElementById('calNext').addEventListener('click', () => {
    viewDate.setMonth(viewDate.getMonth() + 1);
    render();
  });

  render();
})();

/* ══════════════════════════════════════════════
   RIGHT CLICK CONTEXT MENU
══════════════════════════════════════════════ */
(function initContextMenu() {
  const menu = document.getElementById('ctx-menu');
  const desktop = document.getElementById('desktop');

  desktop.addEventListener('contextmenu', e => {
    // Don't show on windows/dock/menubar
    if (e.target.closest('.mac-window, #dock, #menubar, #desktop-calendar')) return;
    e.preventDefault();

    const x = Math.min(e.clientX, window.innerWidth - 220);
    const y = Math.min(e.clientY, window.innerHeight - 280);
    menu.style.left = x + 'px';
    menu.style.top  = y + 'px';
    menu.classList.remove('hidden');
  });

  document.addEventListener('click', () => menu.classList.add('hidden'));
  document.addEventListener('keydown', e => { if(e.key==='Escape') menu.classList.add('hidden'); });

  menu.querySelectorAll('.ctx-item[data-action]').forEach(item => {
    item.addEventListener('click', () => {
      const action = item.dataset.action;
      menu.classList.add('hidden');
      if (action === 'about')       { openWindow('finder'); showSection('about'); }
      if (action === 'projects')    { openWindow('finder'); showSection('projects'); }
      if (action === 'internship')  { openWindow('finder'); showSection('internship'); }
      if (action === 'contact')     { openWindow('finder'); showSection('contact'); }
      if (action === 'cv')       { const a=document.createElement('a'); a.href='Gopal_CV.pdf'; a.download='Gopal_CV.pdf'; a.click(); }
      if (action === 'github')   { window.open('https://github.com/BitByGopal','_blank'); }
      if (action === 'linkedin') { window.open('https://linkedin.com/in/golla-gopal','_blank'); }
      if (action === 'wallpaper') {
        const bg = document.getElementById('desktop');
        const current = bg.style.backgroundImage;
        bg.style.backgroundImage = current.includes('DesktopHome')
          ? "url('images/LockScreen.jpg')"
          : "url('images/DesktopHome.jpg')";
      }
    });
  });
})();

/* ══════════════════════════════════════════════
   DAY / NIGHT MODE
══════════════════════════════════════════════ */
(function initTheme() {
  const btn = document.getElementById('themeToggle');
  let isDay = false;

  function applyTheme(day) {
    isDay = day;
    document.body.classList.toggle('day-mode', day);
    btn.textContent = day ? '🌙' : '☀️';
    btn.title = day ? 'Switch to Night Mode' : 'Switch to Day Mode';
  }

  // Default: Night mode
  applyTheme(false);

  // Manual toggle only
  btn.addEventListener('click', () => applyTheme(!isDay));
})();

/* ══════════════════════════════════════════════
   BOOK A CALL — EmailJS
══════════════════════════════════════════════ */
(function initBookCall() {
  // Register window
  windows.bookcall = { el: document.getElementById('win-bookcall'), open: false, min: false };

  // Open from menubar button
  document.getElementById('mbBookCall').addEventListener('click', () => {
    openWindow('bookcall');
  });

  // ── EmailJS CONFIG ──────────────────────────
  // STEP 1: Go to https://emailjs.com → Sign up free
  // STEP 2: Add Gmail service → copy Service ID
  // STEP 3: Create email template → copy Template ID
  // STEP 4: Go to Account → copy Public Key
  // Replace the values below:
  const EMAILJS_PUBLIC_KEY  = 'px6SRFx3RvUxkPGk3';
  const EMAILJS_SERVICE_ID  = 'service_6q8wr9p';
  const EMAILJS_TEMPLATE_ID = 'template_hdw6tnp';
  // ────────────────────────────────────────────

  // Initialize EmailJS
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  const form      = document.getElementById('bcForm');
  const success   = document.getElementById('bcSuccess');
  const submitBtn = document.getElementById('bcSubmit');
  const btnText   = document.getElementById('bcBtnText');

  document.getElementById('bcSubmit').addEventListener('click', async () => {
    const name   = document.getElementById('bcName').value.trim();
    const email  = document.getElementById('bcEmail').value.trim();
    const date   = document.getElementById('bcDate').value;
    const time   = document.getElementById('bcTime').value;
    const reason = document.getElementById('bcReason').value.trim();

    // Validation
    if (!name || !email || !date || !time || !reason) {
      alert('Please fill in all fields!');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address!');
      return;
    }

    // Format date nicely
    const dateObj = new Date(date + 'T' + time);
    const formatted = dateObj.toLocaleString('en-IN', {
      weekday: 'long', year: 'numeric', month: 'long',
      day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    submitBtn.disabled = true;
    btnText.textContent = '⏳ Sending...';

    const templateParams = {
      from_name:   name,
      from_email:  email,
      call_date:   formatted,
      call_reason: reason,
      to_name:     'Gopal',
      reply_to:    email,
    };

    try {
      if (typeof emailjs !== 'undefined') {
        const result = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        console.log('EmailJS success:', result);
      } else {
        await new Promise(r => setTimeout(r, 1500));
      }
      // Show success
      form.classList.add('hidden');
      success.classList.remove('hidden');
    } catch (err) {
      console.error('EmailJS error:', err);
      const errMsg = err?.text || err?.message || JSON.stringify(err);
      alert(`Failed to send.\nError: ${errMsg}\n\nPlease email directly: gollagopalyadav08@gmail.com`);
      submitBtn.disabled = false;
      btnText.textContent = '📅 Confirm Booking';
    }
  });

  document.getElementById('bcNewBooking').addEventListener('click', () => {
    form.classList.remove('hidden');
    success.classList.add('hidden');
    ['bcName','bcEmail','bcDate','bcTime','bcReason'].forEach(id => {
      document.getElementById(id).value = '';
    });
    submitBtn.disabled = false;
    btnText.textContent = '📅 Confirm Booking';
  });

  // Set min date to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('bcDate').min = today;
})();

/* ══════════════════════════════════════════════
   AI ASSISTANT — Smart Rule-Based Chatbot
══════════════════════════════════════════════ */
(function initAssistant() {
  windows.assistant = { el: document.getElementById('win-assistant'), open: false, min: false };

  const messagesEl = document.getElementById('aiMessages');
  const inputEl    = document.getElementById('aiInput');
  const sendBtn    = document.getElementById('aiSend');

  // ── KNOWLEDGE BASE ──────────────────────────
  const KB = {
    name:    'Golla Gopal (also known as Prince)',
    age:     21,
    role:    'Full Stack Developer & AI/ML Student',
    uni:     'Lovely Professional University, Punjab — BTech CSE (AI & ML), 3rd Year · Pre-Final Year, CGPA: 7.2',
    email:   'gollagopalyadav08@gmail.com',
    phone:   '+91 7075810619',
    github:   'github.com/BitByGopal',
    linkedin: 'linkedin.com/in/golla-gopal',
    leetcode: 'leetcode.com/u/BitByGopal',
    gfg:      'geeksforgeeks.org/profile/bitbygopal',
    location:'Punjab, India (Originally from Andhra Pradesh)',
    status:  'Open to Work — internships, freelance, full-time roles',

    skills: {
      languages:  ['Python', 'Java', 'JavaScript', 'HTML', 'CSS'],
      frameworks: ['Django', 'Flask', 'Bootstrap', 'jQuery', 'NumPy', 'Pandas'],
      tools:      ['Git', 'GitHub', 'Docker', 'VS Code', 'Streamlit'],
      core:       ['DSA', 'OOP', 'DBMS', 'OS', 'Computer Networks', 'Statistics'],
      ml:         ['Regression', 'Decision Trees', 'EDA', 'Data Simulation', 'Scikit-learn']
    },

    projects: [
      { name: 'YumYum', type: 'Food Delivery App', tech: 'HTML, CSS, JS, Django', desc: 'Full-stack food delivery platform with restaurant browsing, cart, user authentication, and order management.' },
      { name: 'SmartShop', type: 'E-Commerce', tech: 'HTML, CSS, JS, Bootstrap', desc: 'E-commerce website with product listing, search, cart, and fully responsive design.' },
      { name: 'Smart Home ML', type: 'Machine Learning', tech: 'Python, Pandas, Scikit-learn, Streamlit', desc: 'ML project optimizing home energy and water usage using regression and decision tree models with a Streamlit dashboard.' },
      { name: 'Math Fun 4 Kids', type: 'EdTech', tech: 'HTML, CSS, JS, DSA', desc: 'Interactive math learning app for children with dynamic question generation and instant feedback.' },
      { name: 'Expense Tracker', type: 'Finance App', tech: 'JS, jQuery, Bootstrap 5, LocalStorage', desc: 'Personal finance tracker to add, filter, and analyze expenses with persistent LocalStorage storage.' },
    ],

    internship: '1Stop.AI — Frontend Developer Intern (July 2025). Built responsive UI components, cross-device compatible pages, debugged UI issues, implemented LocalStorage features. Certified in Web Development (Frontend). Internship completed ✓',

    education: [
      'BTech CSE (AI & ML) — LPU, Punjab | 2023–Present | CGPA: 7.2',
      'Higher Secondary — Narayana Junior College, Hyderabad | 2022–2023 | 92.9%',
      'Secondary — Narayana Schools, Kurnool | 2020–2021 | 99%'
    ],

    certs: [
      'Internship Certificate — 1Stop.AI, July 2025',
      'Project Completion (PET) — 1Stop.AI, July 2025',
      'Complete Python Developer — Udemy, March 2024',
      'Generative AI — Udemy, 2025',
      'Data Structures & Algorithms — Neo Colab, May 2025',
      'Java Programming — Neo Colab, May 2025',
      'C Language — Neo Colab, 2025',
      'Responsive Web Design — freeCodeCamp, 2024',
      'Network Communication Fundamentals — 2024',
      'Computer Communications — 2024',
      'English Grammar Pro — 2024',
      'WEBka Hackathon (Participation) — LPU × Web3 Sabha, March 2024',
    ],

    achievements: [
      '200+ problems solved on LeetCode',
      '200+ DSA problems on GeeksforGeeks',
      '5+ real-world projects built and deployed',
      'Frontend Developer Internship at 1Stop.AI'
    ]
  };

  // ── RESPONSE ENGINE ─────────────────────────
  function getResponse(msg) {
    const q = msg.toLowerCase();

    // ── GREETINGS — introduce + mention projects ──
    if (/^(hi|hello|hey|hii|helo|good\s*(morning|evening|afternoon)|sup|yo|howdy|greetings)\b/.test(q))
      return `Hey! 👋 I'm Gopal's AI Assistant.\n\n**Golla Gopal** is a Full Stack Developer & AI/ML student at LPU, Punjab. Here's a quick overview:\n\n🚀 **Projects:** YumYum (live!), SmartShop, Smart Home ML, Math Fun 4 Kids, Expense Tracker\n💼 **Experience:** Frontend Dev Intern @ 1Stop.AI ✓\n⚡ **DSA:** 200+ LeetCode · 200+ GFG\n📬 **Email:** ${KB.email}\n\nAsk me anything! Try: "Tell me about YumYum" or "Show all projects" 😊`;

    // ── TELL ABOUT HIM ──
    if (/tell.*(about|me|us|him|yourself)|about (him|gopal|yourself)|introduce|who is|describe|overview|summary|brief/.test(q))
      return `Here's everything about Gopal! 👨‍💻\n\n**Golla Gopal** — 21 years old, BTech CSE (AI & ML), 3rd Year · Pre-Final Year, LPU Punjab. Originally from Kurnool, Andhra Pradesh.\n\n🔥 **Projects:** YumYum (live!), SmartShop, Smart Home ML, Math Fun 4 Kids, Expense Tracker\n💼 **Internship:** Frontend Dev at 1Stop.AI — certified ✓\n⚡ **DSA:** 200+ LeetCode + 200+ GFG\n🏆 **Certs:** 12+ across Udemy, Neo Colab, freeCodeCamp\n\n📬 ${KB.email}\n📞 ${KB.phone}\n💻 github.com/BitByGopal\n🔗 linkedin.com/in/golla-gopal\n⚡ leetcode.com/u/BitByGopal\n🟢 geeksforgeeks.org/profile/bitbygopal`;

    // ── ALL PROJECTS ──
    if (/all project|list project|what.*project|show.*project|project.*list/.test(q))
      return `Here are all of Gopal's projects! 🚀\n\n🍔 **YumYum** — Food delivery platform (Django, full auth, cart, orders)\n🌐 Live: web-production-58c6.up.railway.app\n\n🛒 **SmartShop** — E-commerce site (search, filter, cart, Bootstrap)\n\n🤖 **Smart Home ML** — Energy optimizer (Python, Scikit-learn, Streamlit)\n\n🧮 **Math Fun 4 Kids** — Math learning app for kids (DSA, instant feedback)\n\n💰 **Expense Tracker** — Finance tracker (jQuery, LocalStorage, Bootstrap 5)\n\nAll on GitHub: **${KB.github}**\n\nAsk me about any specific project for full details!`;

    // ── YUMYUM specifically ──
    if (/yumyum|yum yum|food.*deliver|deliver.*food/.test(q))
      return `🍔 **YumYum** — Live Food Delivery Platform\n\nA full-stack food delivery web app built with Django. Users browse restaurants, explore menus, add to cart, and place orders online.\n\n✅ **Features:**\n• User authentication & session management\n• Restaurant browsing & menu display\n• Add to cart & order placement\n• Order history tracking\n• Fully responsive across all devices\n\n🛠️ **Tech:** HTML · CSS · JavaScript · Django · SQLite\n\n🌐 **Live Demo:** web-production-58c6.up.railway.app\n💻 **GitHub:** ${KB.github}`;

    // ── SMARTSHOP ──
    if (/smartshop|smart shop|ecommerce|e-commerce|shop.*site/.test(q))
      return `🛒 **SmartShop** — E-Commerce Website\n\nA responsive e-commerce site with bold hero section, product grid, real-time search, and category filter. Add to Cart with live count in navbar.\n\n✅ **Features:**\n• Real-time product search & filtering\n• Add to Cart with live count\n• Premium black-and-white aesthetic\n• Fully responsive (mobile/tablet/desktop)\n\n🛠️ **Tech:** HTML · CSS · JavaScript · Bootstrap\n💻 **GitHub:** ${KB.github}`;

    // ── SMART HOME ML ──
    if (/smart home|ml project|machine.*learn.*project|energy|streamlit/.test(q))
      return `🤖 **Smart Home ML** — Energy & Water Optimizer\n\nML project that optimizes energy and water usage in home appliances.\n\n✅ **Pipeline:**\n• Data simulation & EDA\n• Feature engineering\n• Regression & Decision Tree models\n• Real-time Streamlit dashboard\n• Smart conservation recommendations\n\n🛠️ **Tech:** Python · Pandas · Scikit-learn · Streamlit · Colab\n💻 **GitHub:** ${KB.github}`;

    // ── MATH FUN 4 KIDS ──
    if (/math|math fun|kids.*app|edtech|children.*app/.test(q))
      return `🧮 **Math Fun 4 Kids** — EdTech App\n\nInteractive math learning app for early-grade children.\n\n✅ **Features:**\n• Addition, Subtraction, Multiplication modules\n• Number sorting with DSA concepts\n• Dynamically generated questions\n• Instant feedback + star ratings\n• High score tracking\n• Fully responsive on all devices\n\n🛠️ **Tech:** HTML · CSS · JavaScript · DSA\n💻 **GitHub:** ${KB.github}`;

    // ── EXPENSE TRACKER ──
    if (/expense|tracker|finance.*app|money.*app|budget/.test(q))
      return `💰 **Expense Tracker** — Personal Finance App\n\nPersonal finance web app to log, filter, and analyze daily expenses. No backend — all data via LocalStorage.\n\n✅ **Features:**\n• Add entries with category, amount, date\n• Filter by category & date range\n• Dynamic spending summaries\n• Delete & edit records\n• LocalStorage persistence\n\n🛠️ **Tech:** JavaScript · jQuery · Bootstrap 5 · LocalStorage\n💻 **GitHub:** ${KB.github}`;

    // ── NAME ──
    if (/name|who (is|are) (he|gopal)/.test(q))
      return `His name is **Golla Gopal** (also goes by Prince). 21-year-old Full Stack Developer & AI/ML student at LPU Punjab, originally from Kurnool, Andhra Pradesh. 🚀`;

    // ── SKILLS ──
    if (/skill|tech|stack|know|language|framework|tool|good at|expertise/.test(q))
      return `⚡ **Gopal's Full Tech Stack:**\n\n💻 **Languages:** ${KB.skills.languages.join(', ')}\n⚙️ **Frameworks:** ${KB.skills.frameworks.join(', ')}\n🛠️ **Tools:** ${KB.skills.tools.join(', ')}\n🧠 **Core CS:** ${KB.skills.core.join(', ')}\n🤖 **ML:** ${KB.skills.ml.join(', ')}`;

    // ── INTERNSHIP ──
    if (/intern|experience|work|job|company|1stop|1\.stop/.test(q))
      return `💼 **Work Experience — 1Stop.AI**\n\n**Role:** Frontend Developer Intern\n**Duration:** July 2025 (Completed ✓)\n**Company:** 1Stop.AI — EdTech & Training Solutions\n\n📌 **Responsibilities:**\n• Built responsive UI components (HTML, CSS, JS, jQuery, Bootstrap 5)\n• Designed cross-device compatible pages\n• Debugged UI issues & optimized layouts\n• Implemented LocalStorage dynamic features\n\n🏆 Certified in Web Development (Frontend)\n🔗 **LinkedIn:** ${KB.linkedin}`;

    // ── EDUCATION ──
    if (/edu|study|college|university|school|degree|lpu|cgpa|grade|marks/.test(q))
      return `🎓 **Education:**\n\n• **LPU Punjab** — BTech CSE (AI & ML) · 2023–Present · CGPA: 7.2\n• **Narayana Jr College, Hyderabad** — Higher Secondary · 2022-23 · 92.9%\n• **Narayana EM School, Kurnool** — SSC · 2020-21 · 99% (598/600)`;

    // ── CERTIFICATES ──
    if (/how many cert|number of cert|total cert/.test(q))
      return `Gopal has earned **${KB.certs.length} certificates!** 🏆\n\nPlatforms: 1Stop.AI, Udemy, Neo Colab, freeCodeCamp, LPU Hackathon.`;
    if (/cert|certif|course|udemy|hackathon|freecodecamp/.test(q))
      return `🏆 **${KB.certs.length} Certificates:**\n\n${KB.certs.map(c => `• ${c}`).join('\n')}`;

    // ── CONTACT (full details) ──
    if (/contact|reach|hire|connect/.test(q))
      return `📬 **Contact Golla Gopal:**\n\n✉️ **Email:** ${KB.email}\n📞 **Phone:** ${KB.phone}\n💻 **GitHub:** github.com/BitByGopal\n🔗 **LinkedIn:** linkedin.com/in/golla-gopal\n⚡ **LeetCode:** leetcode.com/u/BitByGopal\n🟢 **GFG:** geeksforgeeks.org/profile/bitbygopal\n\n📅 Use **Book a Call** in the menubar to schedule directly!`;

    // ── EMAIL ──
    if (/email|mail/.test(q))
      return `✉️ **Email:** ${KB.email}\n\nFeel free to reach out — response time under 24 hours!`;

    // ── PHONE / MOBILE ──
    if (/phone|mobile|number|whatsapp/.test(q))
      return `📞 **Phone/Mobile:** ${KB.phone}\n\nAlso available via 📅 **Book a Call** in the menubar!`;

    // ── ALL SOCIAL / PROFILES ──
    if (/all.*link|all.*profile|social|profile.*link|link.*profile/.test(q))
      return `🔗 **All of Gopal's Links:**\n\n✉️ Email: ${KB.email}\n📞 Phone: ${KB.phone}\n💻 GitHub: github.com/BitByGopal\n🔗 LinkedIn: linkedin.com/in/golla-gopal\n⚡ LeetCode: leetcode.com/u/BitByGopal\n🟢 GFG: geeksforgeeks.org/profile/bitbygopal\n🌐 YumYum Live: web-production-58c6.up.railway.app`;

    // ── GITHUB ──
    if (/github|repo|code/.test(q))
      return `💻 **GitHub:** github.com/BitByGopal\n\nRepos: YumYum, SmartShop, Smart Home ML, Math Fun 4 Kids, Expense Tracker — all with full source code! 🚀`;

    // ── LINKEDIN ──
    if (/linkedin/.test(q))
      return `🔗 **LinkedIn:** linkedin.com/in/golla-gopal\n\nActive profile — open to connections, internships, and opportunities!`;

    // ── LEETCODE + GFG COMBINED ──
    if (/leetcode.*gfg|gfg.*leetcode|dsa.*profile|both.*profile|coding.*profile/.test(q))
      return `⚡ **DSA Profiles:**\n\n⚡ **LeetCode:** leetcode.com/u/BitByGopal\n→ 200+ problems solved (Easy + Medium + Hard)\n\n🟢 **GeeksforGeeks:** geeksforgeeks.org/profile/bitbygopal\n→ 200+ DSA problems, competitive coding focus\n\nTotal: **400+ problems solved!** 💪`;

    // ── LEETCODE ──
    if (/leetcode|lc\b/.test(q))
      return `⚡ **LeetCode:** leetcode.com/u/BitByGopal\n\n200+ problems solved across Easy, Medium, and Hard. Consistently grinding DSA! 💪`;

    // ── GFG ──
    if (/gfg|geeksforgeeks|geeks/.test(q))
      return `🟢 **GeeksforGeeks:** geeksforgeeks.org/profile/bitbygopal\n\n200+ DSA problems solved. Strong focus on competitive coding and algorithms!`;

    // ── AVAILABILITY ──
    if (/availab|open to|looking|opportunit|freelance/.test(q))
      return `🟢 **Gopal is Open to Work!**\n\nAvailable for:\n• Internships\n• Freelance projects\n• Full-time roles\n• Collaborations\n\n📬 ${KB.email}\n📞 ${KB.phone}\n📅 Book a Call from the menubar!`;

    // ── LOCATION ──
    if (/locat|where|city|from|based/.test(q))
      return `📍 Currently at **LPU, Punjab, India**. Originally from **Kurnool, Andhra Pradesh** — moved 2000km north! #KurnoolToCode`;

    // ── ML / AI ──
    if (/ml|machine.?learn|ai|artificial|data.?scien|model/.test(q))
      return `🤖 **Gopal's ML Skills:**\n\n• **Smart Home ML** — Regression & decision trees for energy optimization\n• Tools: Python, Pandas, Scikit-learn, Streamlit\n• Concepts: EDA, Feature Engineering, Data Simulation, Model Evaluation\n• BTech specialization: AI & ML at LPU 🎓`;

    // ── DJANGO / BACKEND ──
    if (/django|backend|server|api|flask/.test(q))
      return `⚙️ Proficient in **Django** and **Flask**.\n\nBiggest project: **YumYum** — full food delivery platform with auth, cart, order management.\n\n🌐 Live: web-production-58c6.up.railway.app`;

    // ── THANKS ──
    if (/thank|thanks|awesome|nice|helpful|great/.test(q))
      return `You're welcome! 😊\n\nConnect with Gopal:\n✉️ ${KB.email}\n📞 ${KB.phone}\n📅 Book a Call from the menubar!`;

    // ── WHO BUILT THIS ──
    if (/portfolio|website|this site|who made|built this/.test(q))
      return `This was built by **Golla Gopal** himself — a full macOS-style interactive experience with Terminal, apps, games, and this AI assistant! 😄`;

    // ── DEFAULT ──
    return `I can help! Try asking:\n\n• "Tell me about YumYum"\n• "Show all projects"\n• "What are his skills?"\n• "How to contact him?"\n• "LeetCode and GFG profile"\n• "GitHub link"\n• "Phone number"\n• "Is he available for work?"`;
  }
  // ── CHAT UI ──────────────────────────────────
  const addMessage = (text, role = 'bot') => {
    // Remove suggestions on user message
    if (role === 'user') {
      const sug = document.getElementById('aiSuggestions');
      if (sug) sug.remove();
    }

    const msg = document.createElement('div');
    msg.className = `ai-msg ${role}`;
    const bubble = document.createElement('div');
    bubble.className = 'ai-bubble';

    // Format bold **text**
    bubble.innerHTML = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');

    msg.appendChild(bubble);
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  const showTyping = () => {
    const div = document.createElement('div');
    div.className = 'ai-msg bot';
    div.id = 'aiTyping';
    div.innerHTML = `<div class="ai-typing"><span></span><span></span><span></span></div>`;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  const removeTyping = () => {
    const t = document.getElementById('aiTyping');
    if (t) t.remove();
  }

  const handleSend = () => {
    const q = inputEl.value.trim();
    if (!q) return;
    inputEl.value = '';
    addMessage(q, 'user');
    showTyping();
    // Simulate thinking delay
    setTimeout(() => {
      removeTyping();
      addMessage(getResponse(q), 'bot');
    }, 600 + Math.random() * 400);
  }

  sendBtn.addEventListener('click', handleSend);
  inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSend();
  });

  // Suggestion chips
  document.querySelectorAll('.ai-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      inputEl.value = chip.dataset.q;
      handleSend();
    });
  });

  // Focus input when window opens
  const origOpen = openWindow;
})();

/* ══════════════════════════════════════════════
   CERTIFICATE VIEWER
══════════════════════════════════════════════ */
window.viewCert = function(path, title) {
  window.open(path, '_blank');
};

window.closeCert = function() {
  const modal = document.getElementById('certModal');
  modal.classList.add('hidden');
};

// ESC to close
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('certModal');
    if (modal && !modal.classList.contains('hidden')) closeCert();
  }
});

/* ══════════════════════════════════════════════
   LOCK SCREEN — HORIZONTAL CAROUSEL
══════════════════════════════════════════════ */
(function initLockCarousel() {
  let current = 0;
  const total = 5;
  let autoTimer = null;

  function goTo(idx) {
    const carousel = document.getElementById('lsCarousel');
    const dots = document.querySelectorAll('.ls-dot');
    if (!carousel) return;
    current = (idx + total) % total;
    carousel.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 3500);
  }

  // Start carousel when lock screen visible
  const obs = new MutationObserver(() => {
    const ls = document.getElementById('lock-screen');
    if (ls && !ls.classList.contains('hidden')) {
      setTimeout(() => { goTo(0); startAuto(); }, 600);
      obs.disconnect();
    }
  });
  const ls = document.getElementById('lock-screen');
  if (ls) obs.observe(ls, { attributes: true, attributeFilter: ['class'] });

  // Dot clicks
  document.querySelectorAll('.ls-dot').forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(autoTimer);
      goTo(i);
      startAuto();
    });
  });
})();

/* ══════════════════════════════════════════════
   CLASSIC APP — CARD DECK
══════════════════════════════════════════════ */
(function initDeck() {
  let current = 0;
  const total  = 7;

  function goTo(idx) {
    const track = document.getElementById('deckTrack');
    const dots  = document.querySelectorAll('.deck-dot');
    const prev  = document.getElementById('deckPrev');
    const next  = document.getElementById('deckNext');
    if (!track) return;
    current = Math.max(0, Math.min(idx, total - 1));
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    if (prev) prev.disabled = current === 0;
    if (next) next.disabled = current === total - 1;
  }

  document.addEventListener('click', e => {
    if (e.target.id === 'deckNext') goTo(current + 1);
    if (e.target.id === 'deckPrev') goTo(current - 1);
    const dot = e.target.closest('.deck-dot');
    if (dot) goTo(parseInt(dot.dataset.i));
  });

  // Keyboard navigation when classic app is open
  document.addEventListener('keydown', e => {
    const win = document.getElementById('win-classic');
    if (!win || win.style.display === 'none') return;
    if (e.key === 'ArrowRight') goTo(current + 1);
    if (e.key === 'ArrowLeft')  goTo(current - 1);
  });

  // Init on open
  const obs = new MutationObserver(() => {
    const win = document.getElementById('win-classic');
    if (win && win.style.display !== 'none') goTo(0);
  });
  const win = document.getElementById('win-classic');
  if (win) obs.observe(win, { attributes: true, attributeFilter: ['style'] });
})();