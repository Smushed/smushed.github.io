// ===========================
// GLOBAL STATE
// ===========================
let startTime = Date.now();
let commandHistory = [];
let historyIndex = -1;

// ===========================
// INITIALIZATION
// ===========================
document.addEventListener('DOMContentLoaded', function () {
  startBootSequence();
});

// ===========================
// BOOT SEQUENCE DATA
// ===========================
const bootMessages = [
  { text: 'BIOS Date 01/15/25 14:22:51 Ver: 1.0.25', delay: 30 },
  { text: 'CPU: Quantum Core i9-9900K @ 5.00GHz', delay: 60 },
  { text: 'Memory Test: 65536K OK', delay: 130 },
  { text: 'Initializing Boot Agent...', delay: 200 },
  { text: 'Loading Kernel Modules...', delay: 260 },
  { text: '  [OK] neural-net-driver', delay: 300 },
  { text: '  [OK] crypto-cypher-v2', delay: 330 },
  { text: '  [OK] matrix-renderer', delay: 360 },
  { text: 'Mounting File Systems...', delay: 430 },
  { text: '  /dev/sda1 mounted on /boot', delay: 460 },
  { text: '  /dev/sda2 mounted on /', delay: 500 },
  { text: 'Starting Network Services...', delay: 600 },
  { text: '  [OK] dhcp-client', delay: 630 },
  { text: '  [OK] ssh-server', delay: 660 },
  { text: '  [OK] http-daemon', delay: 700 },
  { text: 'System Integrity Check...', delay: 800 },
  { text: '  Verifying checksums... 100%', delay: 930 },
  { text: 'Boot Sequence Complete.', delay: 1000 },
];

// ===========================
// BOOT SEQUENCE LOGIC
// ===========================
function startBootSequence() {
  const bootLog = document.getElementById('boot-log');
  const progressBar = document.getElementById('boot-progress-fill');
  const progressText = document.getElementById('boot-progress-text');
  const skipBtn = document.getElementById('skip-boot');

  // Skip button handler
  skipBtn.addEventListener('click', () => {
    finishBootSequence();
  });

  // Start adding messages
  let maxDelay = 0;
  bootMessages.forEach((msg) => {
    setTimeout(() => {
      const line = document.createElement('div');
      line.className = 'log-line';

      // Timestamp
      const now = new Date();
      const time = `[${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(
        Math.floor(Math.random() * 999)
      ).padStart(3, '0')}]`;

      line.innerHTML = `<span class="log-timestamp">${time}</span><span class="log-message">${msg.text}</span>`;
      bootLog.appendChild(line);
      bootLog.scrollTop = bootLog.scrollHeight;
    }, msg.delay);

    if (msg.delay > maxDelay) maxDelay = msg.delay;
  });

  // Progress bar animation
  const progressInterval = setInterval(() => {
    const elapsedTime = Date.now() - startTime;
    const progress = Math.min(100, Math.floor((elapsedTime / 1000) * 100));

    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${progress}%`;

    if (progress >= 100) {
      clearInterval(progressInterval);
    }
  }, 50);

  // Transition to login (Parallel)
  setTimeout(() => {
    startLoginSequence();
  }, 1000); // Start login after 1.0s while boot continues
}

function startLoginSequence() {
  const loginScreen = document.getElementById('login-screen');

  // bootScreen.classList.remove('active'); // Keep boot screen active in background
  loginScreen.classList.add('active');

  // Auto-type credentials
  setTimeout(() => {
    typeText('login-username', 'guest', 100, () => {
      document.getElementById('password-row').classList.remove('hidden');
      setTimeout(() => {
        typeText('login-password', '********', 100, () => {
          authenticate();
        });
      }, 500);
    });
  }, 500);
}

function typeText(elementId, text, speed, callback) {
  const element = document.getElementById(elementId);
  let i = 0;
  const interval = setInterval(() => {
    element.textContent += text.charAt(i);
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      if (callback) callback();
    }
  }, speed);
}

function authenticate() {
  const accessMsg = document.getElementById('access-granted');
  accessMsg.classList.remove('hidden');

  setTimeout(() => {
    finishBootSequence();
  }, 1500);
}

function finishBootSequence() {
  const loginScreen = document.getElementById('login-screen');
  const bootScreen = document.getElementById('boot-screen');
  const mainScreen = document.getElementById('main-screen');

  loginScreen.classList.remove('active');
  bootScreen.classList.remove('active');
  mainScreen.classList.add('active');

  bootTerminal();
}

function bootTerminal() {
  const output = document.getElementById('terminal-output');
  // Clear previous output if any
  output.innerHTML = '';

  const messages = [
    'Initializing portfolio terminal...',
    'Loading system modules... [OK]',
    'Establishing secure connection... [OK]',
    'Mounting file systems... [OK]',
    'Starting network services... [OK]',
    '',
    '╔════════════════════════════════════════════════════════╗',
    "║   WELCOME TO KEVIN FLERLAGE'S PORTFOLIO TERMINAL       ║",
    '║   ────────────────────────────────────────────────     ║',
    '║   System: Portfolio OS v3.2.9-cyberpunk                ║',
    '║   User: guest@flerlage                                 ║',
    '║   Access Level: PUBLIC                                 ║',
    '╚════════════════════════════════════════════════════════╝',
    '',
    'Type "help" for available commands.',
    '',
  ];

  messages.forEach((msg, index) => {
    setTimeout(() => {
      const line = document.createElement('div');
      line.className = 'output-line response';
      line.textContent = msg;
      output.appendChild(line);
      output.scrollTop = output.scrollHeight;
    }, index * 50);
  });

  // Initialize everything after boot messages
  setTimeout(() => {
    initializeTerminal();
    initializeSystemInfo();
    initializeCommandMenu();
    initializeTextGlitch();
  }, messages.length * 50);
}

// ===========================
// TERMINAL LOGIC
// ===========================
function initializeTerminal() {
  const input = document.getElementById('terminal-input');

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const command = input.value.trim();
      if (command) {
        executeCommand(command);
        input.value = '';
        resizeInput(input);
        historyIndex = -1;
        // Scroll to bottom
        const output = document.getElementById('terminal-output');
        output.scrollTop = output.scrollHeight;
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        if (historyIndex === -1) {
          historyIndex = commandHistory.length - 1;
        } else if (historyIndex > 0) {
          historyIndex--;
        }
        input.value = commandHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        historyIndex++;
        if (historyIndex >= commandHistory.length) {
          historyIndex = -1;
          input.value = '';
        } else {
          input.value = commandHistory[historyIndex];
        }
      }
    }
    // Resize input after history change
    setTimeout(() => resizeInput(input), 0);
  });

  // Auto-resize input
  input.addEventListener('input', () => resizeInput(input));

  // Initial resize
  resizeInput(input);

  // Keep focus on input (Desktop only to prevent keyboard popup on mobile)
  if (window.innerWidth > 768) {
    input.focus();
    document.addEventListener('click', (e) => {
      // Don't focus if selecting text or clicking buttons
      if (
        window.getSelection().toString().length === 0 &&
        !e.target.closest('button') &&
        !e.target.closest('a')
      ) {
        input.focus();
      }
    });
  }
}

function resizeInput(input) {
  input.style.width = (input.value.length || 1) + 'ch';
}

function executeCommand(command) {
  const output = document.getElementById('terminal-output');
  const trimmedCommand = command.trim();

  // Split command into base command and arguments
  const parts = trimmedCommand.split(/\s+/);
  const baseCmd = parts[0].toLowerCase();
  const args = parts.slice(1);
  const fullArgs = args.join(' ');

  if (inputState === 'password') {
    checkPassword(command);
    return;
  }

  commandHistory.push(command);

  const commandLine = document.createElement('div');
  commandLine.className = 'output-line command';
  commandLine.innerHTML = `<span class="prompt">guest@portfolio:~$</span> ${command}`;
  output.appendChild(commandLine);

  switch (baseCmd) {
    case 'help':
      printOutput([
        'Available commands:',
        '  about     - View system profile / bio',
        '  projects  - List project repository',
        '  contact   - Show connection protocols',
        '  resume    - Download resume file',
        '  clear     - Clear terminal buffer',
        '  whoami    - Current user session',
        '  sudo      - Execute a command as admin',
        '  su        - Switch user',
        '  theme     - Change terminal theme',
        '  ?🥚?      - COMMAND HIDDEN',
      ]);
      break;

    case 'sudo':
      if (isGodMode) {
        // If god mode is on, just execute the rest of the command or show success
        if (fullArgs.includes('rm -rf')) {
          triggerSystemCrash();
        } else if (fullArgs) {
          printOutput([
            `root@portfolio:~# ${fullArgs}`,
            'Command executed successfully.',
          ]);
        } else {
          printOutput(['root@portfolio:~#', 'Sudo access granted.']);
        }
      } else {
        printOutput([
          'guest is not in the sudoers file. This incident will be reported.',
        ]);
      }
      break;

    case 'su':
    case 'root':
      initiatePasswordInput();
      break;

    case 'rm':
      if (fullArgs.includes('-rf')) {
        if (isGodMode) {
          triggerSystemCrash();
        } else {
          printOutput(['Permission denied.']);
        }
      } else {
        printOutput([
          'rm: missing operand',
          "Try 'help' for more information.",
        ]);
      }
      break;

    case 'duck':
      printOutput([
        '     ⢀⡴⠋⠉⠛⠒⣄',
        '    ⢸⠏  ⣶⡄  ⣛',
        '    ⣿⠃    ⡤⠋⠠⠉⠡⢤⢀   quack.',
        '    ⢿     ⢉⣝⠲⠤⣄⣀⣀⠌',
        '    ⡏     ⢸⠁',
        '   ⡴⠃     ⠸⡄',
        '⢀⠖⠋        ⠘⣆',
        '⠉           ⠈⢳',
      ]);
      break;
    case 'vi':
    case 'vim':
    case 'emacs':
    case 'nano':
      printOutput([
        'You are now trapped in a text editor.',
        'To exit, you must solve the riddle of the ages...',
        'Just kidding.',
        'Press ESC... oh wait, this is a browser.',
      ]);
      break;

    case 'theme':
      const themeArg = args[0];
      if (themeArg) {
        changeTheme(themeArg);
      } else {
        printOutput(['Usage: theme [green|amber|blue|red]']);
      }
      break;

    case 'fortune':
      const quotes = [
        '"Talk is cheap. Show me the code." - Linus Torvalds',
        '"Programs must be written for people to read, and only incidentally for machines to execute." - Abelson & Sussman',
        '"The most disastrous thing that you can ever learn is your first programming language." - Alan Kay',
        '"There are two ways to write error-free programs; only the third one works." - Alan J. Perlis',
        '"It\'s not a bug, it\'s a feature."',
      ];
      printOutput([quotes[Math.floor(Math.random() * quotes.length)]]);
      break;

    case 'about':
    case 'bio':
      appendTemplate('tpl-about');
      break;

    case 'projects':
    case 'work':
      appendTemplate('tpl-projects');
      break;

    case 'contact':
    case 'email':
    case 'socials':
      appendTemplate('tpl-contact');
      break;

    case 'resume':
      printOutput(['Downloading resume.pdf...']);
      setTimeout(() => {
        window.open('./assets/resume/Kevin Flerlage Resume.pdf', '_blank');
        printOutput(['[SUCCESS] Download initiated.']);
      }, 500);
      break;

    case 'whoami':
      printOutput([
        'guest@portfolio',
        'UID: 1000',
        'GID: 1000',
        'Groups: guest, www-data',
      ]);
      break;

    case 'clear':
    case 'cls':
      output.innerHTML = '';
      break;

    case 'egg':
    case 'eggs':
      printOutput([
        '🥚 EASTER EGG FOUND 🥚',
        'Try these hidden commands:',
        '  matrix',
        '  hack',
        '  reboot',
        '  duck',
        '  fortune',
        '  vi',
      ]);
      break;

    case 'matrix':
      triggerMatrixEffect();
      printOutput(['The Matrix has you...']);
      break;

    case 'hack':
      runHackSequence();
      break;

    case 'reboot':
      location.reload();
      break;

    case '':
      break;

    default:
      printOutput([
        `Command not found: ${baseCmd}`,
        'Type "help" for list of commands.',
      ]);
  }

  // Scroll to bottom
  output.scrollTop = output.scrollHeight;
}

function printOutput(lines) {
  const output = document.getElementById('terminal-output');
  let lineIndex = 0;

  function processNextLine() {
    if (lineIndex >= lines.length) {
      output.scrollTop = output.scrollHeight;
      return;
    }

    const text = lines[lineIndex];
    const line = document.createElement('div');
    line.className = 'output-line response typing';
    output.appendChild(line);

    let charIndex = 0;
    const typeInterval = setInterval(() => {
      line.textContent += text.charAt(charIndex);
      charIndex++;

      output.scrollTop = output.scrollHeight;

      if (charIndex >= text.length) {
        clearInterval(typeInterval);
        line.classList.remove('typing');
        lineIndex++;
        setTimeout(processNextLine, 50);
      }
    }, 10);
  }

  processNextLine();
}

function appendTemplate(templateId) {
  const output = document.getElementById('terminal-output');
  const template = document.getElementById(templateId);
  if (template) {
    const clone = template.content.cloneNode(true);
    const div = document.createElement('div');
    div.appendChild(clone);

    Array.from(div.children).forEach((child, index) => {
      child.style.opacity = '0';
      child.style.animation = `fadeIn 0.1s forwards ${index * 0.05}s`;
      output.appendChild(child);
    });

    setTimeout(() => {
      output.scrollTop = output.scrollHeight;
    }, 100);
  }
}

// ===========================
// SYSTEM INFO
// ===========================
function initializeSystemInfo() {
  updateSystemInfo();
  setInterval(updateSystemInfo, 1000);
  setInterval(updateMemoryUsage, 3000); // Update memory every 3s
}

function updateSystemInfo() {
  // Update time
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const timeEl = document.getElementById('system-time');
  if (timeEl) timeEl.textContent = `${hours}:${minutes}:${seconds}`;

  // Update uptime
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const hoursUp = Math.floor(elapsed / 3600);
  const minutesUp = Math.floor((elapsed % 3600) / 60);
  const secondsUp = elapsed % 60;
  const uptimeEl = document.getElementById('uptime');
  if (uptimeEl)
    uptimeEl.textContent = `${String(hoursUp).padStart(2, '0')}:${String(
      minutesUp
    ).padStart(2, '0')}:${String(secondsUp).padStart(2, '0')}`;
}

function updateMemoryUsage() {
  const memEl = document.getElementById('memory-usage');
  if (memEl) {
    // Simulate fluctuating memory usage
    const usage = 12 + Math.floor(Math.random() * 8); // 12-20%
    memEl.textContent = `${usage}%`;
  }
}

// ===========================
// EASTER EGG EFFECTS
// ===========================
let matrixInterval;

function triggerMatrixEffect() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;

  if (canvas.style.display === 'block') {
    // Toggle off
    canvas.style.display = 'none';
    clearInterval(matrixInterval);
    return;
  }

  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const katakana =
    'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
  const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nums = '0123456789';
  const alphabet = katakana + latin + nums;

  const fontSize = 16;
  const columns = canvas.width / fontSize;

  const rainDrops = [];
  for (let x = 0; x < columns; x++) {
    rainDrops[x] = 1;
  }

  const draw = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < rainDrops.length; i++) {
      const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
      ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

      if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        rainDrops[i] = 0;
      }
      rainDrops[i]++;
    }
  };

  clearInterval(matrixInterval);
  matrixInterval = setInterval(draw, 50);

  // Handle resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

let isGodMode = false;
let inputState = 'normal'; // 'normal' or 'password'

function initiatePasswordInput() {
  inputState = 'password';
  const input = document.getElementById('terminal-input');
  input.type = 'password';
  input.value = '';

  const output = document.getElementById('terminal-output');
  const line = document.createElement('div');
  line.className = 'output-line';
  line.textContent = 'Password: ';
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;

  // We don't want the prompt "guest@portfolio" for password
  // But the UI structure has prompt and input together.
  // We can hide the prompt temporarily or just let it be.
  // Standard unix `su` shows "Password: " on a new line.
  // Our input is inside .terminal-input-line next to prompt.
  // Let's just hide the prompt text.
  document.querySelector('.terminal-input-line .prompt').style.display = 'none';
}

function checkPassword(password) {
  const output = document.getElementById('terminal-output');

  // Reset state
  inputState = 'normal';
  const input = document.getElementById('terminal-input');
  input.type = 'text';
  input.value = '';
  document.querySelector('.terminal-input-line .prompt').style.display =
    'inline';

  if (password === 'fsociety' || password === 'bonsoir') {
    activateGodMode();
  } else {
    const line = document.createElement('div');
    line.className = 'output-line response';
    line.textContent = 'su: Authentication failure';
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }
}

function activateGodMode() {
  isGodMode = true;
  printOutput([
    'Authentication successful.',
    'GOD MODE ACTIVATED',
    'Unlimited power granted.',
  ]);
  document.body.style.border = '2px solid #ff0000';
  setTimeout(() => {
    document.body.style.border = 'none';
  }, 2000);
}

function runHackSequence() {
  const output = document.getElementById('terminal-output');
  output.innerHTML = ''; // Clear screen

  const sequence = [
    { text: 'Initializing fsociety exploit framework...', delay: 500 },
    { text: 'Target: E Corp (Evil Corp) Data Center', delay: 1000 },
    { text: 'Bypassing firewall...', delay: 1500 },
    { text: 'Injecting rootkit...', delay: 2000 },
    { text: 'Accessing mainframe...', delay: 2500 },
  ];

  let totalDelay = 0;
  sequence.forEach((step) => {
    setTimeout(() => {
      const line = document.createElement('div');
      line.className = 'output-line response';
      line.textContent = step.text;
      output.appendChild(line);
      output.scrollTop = output.scrollHeight;
    }, step.delay);
    totalDelay = Math.max(totalDelay, step.delay);
  });

  // Hex dump effect
  setTimeout(() => {
    const duration = 3000;
    const interval = 50;
    const hexInterval = setInterval(() => {
      const hex = Array(8)
        .fill(0)
        .map(() =>
          Math.floor(Math.random() * 255)
            .toString(16)
            .padStart(2, '0')
        )
        .join(' ');
      const line = document.createElement('div');
      line.className = 'output-line response';
      line.style.color = '#00ff00';
      line.style.fontSize = '10px';
      line.textContent = `0x${Math.floor(Math.random() * 1000000).toString(
        16
      )}: ${hex} ${hex}`;
      output.appendChild(line);
      output.scrollTop = output.scrollHeight;
    }, interval);

    setTimeout(() => {
      clearInterval(hexInterval);
      printOutput([
        '',
        'Access Granted.',
        'Hello, friend.',
        '',
        '----------------------------------------',
        'SYSTEM HINT: Superuser privileges available.',
        'Use "su" to switch user.',
        'Password hint: The name of our group.',
        '----------------------------------------',
      ]);
    }, duration);
  }, totalDelay + 500);
}

function triggerSystemCrash() {
  const body = document.body;
  body.innerHTML = ''; // Kill everything
  body.style.backgroundColor = '#0000aa'; // BSOD Blue or just black? Let's go Red for "Critical"
  body.style.background = '#000';
  body.style.color = '#ff0000';
  body.style.fontFamily = 'monospace';
  body.style.display = 'flex';
  body.style.flexDirection = 'column';
  body.style.alignItems = 'center';
  body.style.justifyContent = 'center';
  body.style.height = '100vh';
  body.style.overflow = 'hidden';

  const msg = document.createElement('div');
  msg.innerHTML = `
        <h1 style="font-size: 48px; margin-bottom: 20px;">SYSTEM FAILURE</h1>
        <p>CRITICAL KERNEL PANIC</p>
        <p>Error Code: 0xDEADBEEF</p>
        <p>Deleting root partition...</p>
        <div id="fake-progress" style="width: 300px; height: 20px; border: 1px solid #ff0000; margin-top: 20px;">
            <div id="fake-fill" style="width: 0%; height: 100%; background: #ff0000;"></div>
        </div>
    `;
  body.appendChild(msg);

  const fill = document.getElementById('fake-fill');
  let width = 0;
  const interval = setInterval(() => {
    width += Math.random() * 5;
    if (width > 100) width = 100;
    fill.style.width = width + '%';

    if (width === 100) {
      clearInterval(interval);
      setTimeout(() => {
        location.reload();
      }, 1000);
    }
  }, 100);
}

function changeTheme(color) {
  const root = document.documentElement;
  switch (color) {
    case 'amber':
    case 'orange':
      root.style.setProperty('--terminal-green', '#ffb000');
      root.style.setProperty('--green-bright', '#ffcc00');
      root.style.setProperty('--green-dim', '#996600');
      break;
    case 'blue':
    case 'cyan':
      root.style.setProperty('--terminal-green', '#00ffff');
      root.style.setProperty('--green-bright', '#ccffff');
      root.style.setProperty('--green-dim', '#008888');
      break;
    case 'red':
    case 'danger':
      root.style.setProperty('--terminal-green', '#ff0000');
      root.style.setProperty('--green-bright', '#ff3333');
      root.style.setProperty('--green-dim', '#880000');
      break;
    case 'green':
    case 'default':
      root.style.setProperty('--terminal-green', '#00ff00');
      root.style.setProperty('--green-bright', '#33ff33');
      root.style.setProperty('--green-dim', '#008800');
      break;
    default:
      printOutput(['Unknown theme. Available: green, amber, blue, red']);
      return;
  }
  printOutput([`Theme changed to ${color}.`]);
}

// ===========================
// MOBILE OPTIMIZATIONS
// ===========================
if (window.innerWidth < 768) {
  // Disable intensive animations on mobile
  const scanlines = document.querySelector('.scanlines');
  if (scanlines) scanlines.style.display = 'none';
}

// ===========================
// RANDOM GLITCH EFFECT
// ===========================
function scheduleRandomGlitch() {
  const delay = 10000 + Math.random() * 20000; // 10-30 seconds
  setTimeout(() => {
    if (window.innerWidth >= 768) {
      const body = document.body;
      body.style.transform = `translate(${Math.random() * 2 - 1}px, ${
        Math.random() * 2 - 1
      }px)`;
      setTimeout(() => {
        body.style.transform = 'translate(0, 0)';
      }, 50);
    }
    scheduleRandomGlitch();
  }, delay);
}

scheduleRandomGlitch();

// Initialize
function initializeCommandMenu() {
  const buttons = document.querySelectorAll('.action-btn');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        // Visual feedback - type it in the input first?
        // Or just execute. Let's just execute for speed, but maybe update input value for effect.
        const input = document.getElementById('terminal-input');
        input.value = cmd;
        executeCommand(cmd);
        input.value = '';
        resizeInput(input);

        // Keep focus on input for continued typing if desired
        input.focus();
      }
    });
  });
}

// ===========================
// TEXT GLITCH EFFECT
// ===========================
function initializeTextGlitch() {
  // Run glitch loop
  setInterval(() => {
    // 60% chance to trigger a glitch every 2 seconds
    if (Math.random() < 0.6) {
      triggerTextGlitch();
    }
  }, 2000);
  setInterval(() => {
    // 30% chance to trigger a glitch every 1.5 seconds
    if (Math.random() < 0.3) {
      triggerTextGlitch();
    }
  }, 1500);
  setInterval(() => {
    // 60% chance to trigger a glitch every 3 seconds
    if (Math.random() < 0.6) {
      triggerTextGlitch();
    }
  }, 3000);
}

function triggerTextGlitch() {
  const output = document.getElementById('terminal-output');
  if (!output) return;

  // Select candidates: .output-line.response that are NOT .typing
  // Also include other text elements if needed, but response lines are the main ones
  const lines = Array.from(
    output.querySelectorAll('.output-line.response:not(.typing)')
  );

  // Filter out empty lines
  const validLines = lines.filter((line) => line.textContent.trim().length > 0);

  if (validLines.length === 0) return;

  const target = validLines[Math.floor(Math.random() * validLines.length)];
  const originalText = target.textContent;

  // Generate glitch text
  // We want to preserve length mostly, but swap chars
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*';
  let glitchedText = '';

  for (let i = 0; i < originalText.length; i++) {
    // 15% chance to glitch a character, but keep spaces to preserve word structure roughly
    if (Math.random() < 0.15 && originalText[i] !== ' ') {
      glitchedText += chars.charAt(Math.floor(Math.random() * chars.length));
    } else {
      glitchedText += originalText[i];
    }
  }

  // Apply glitch
  target.textContent = glitchedText;
  target.classList.add('glitching');

  // Revert after random delay (0.25s - 1s)
  const duration = 250 + Math.random() * 750;

  setTimeout(() => {
    target.textContent = originalText;
    target.classList.remove('glitching');
  }, duration);
}

