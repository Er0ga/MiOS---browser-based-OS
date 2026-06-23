/* ============================================================
   MiOS — main script
   Clock, draggable windows, open/close, z-index stacking,
   About me app, Projects app, Terminal, Sticky notes.
   ============================================================ */

/* ===========================================================
   1. CLOCK & TOPBAR
   =========================================================== */
function updateTime() {
  var now = new Date();
  var text = now.toLocaleString("en-GB", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  document.querySelector("#timeElement").innerHTML = text;
}
updateTime();
setInterval(updateTime, 1000);

/* Simulated battery that slowly drains */
var battery = 100;
setInterval(function () {
  battery = battery <= 12 ? 100 : battery - 1;
  document.querySelector("#batteryElement").innerHTML = "🔋 " + battery + "%";
}, 8000);

/* ===========================================================
   2. WINDOW DRAGGING
   Grabbed by the "<id>header" bar. Releases on mouseup.
   =========================================================== */
function dragElement(element) {
  var initialX = 0,
    initialY = 0,
    currentX = 0,
    currentY = 0;

  var handle = document.getElementById(element.id + "header") || element;
  handle.onmousedown = startDragging;

  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();
    bringToFront(element);
    initialX = e.clientX;
    initialY = e.clientY;
    document.onmouseup = stopDragging;
    document.onmousemove = whileDragging;
  }

  function whileDragging(e) {
    e = e || window.event;
    e.preventDefault();
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;

    var newTop = element.offsetTop - currentY;
    var newLeft = element.offsetLeft - currentX;

    if (newTop < 40) newTop = 40;

    element.style.top = newTop + "px";
    element.style.left = newLeft + "px";
  }

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

/* ===========================================================
   3. OPEN / CLOSE / STACK WINDOWS
   =========================================================== */
var biggestIndex = 10;

function bringToFront(element) {
  biggestIndex++;
  element.style.zIndex = biggestIndex;
}

function openWindow(id) {
  var element = document.querySelector("#" + id);
  element.style.display = "flex";
  bringToFront(element);

  if (id === "terminal") {
    document.querySelector("#terminalInput").focus();
  }
}

function closeWindow(element) {
  element.style.display = "none";
}

function initializeWindow(id) {
  var win = document.querySelector("#" + id);
  var closeBtn = document.querySelector("#" + id + "close");

  dragElement(win);
  closeBtn.addEventListener("click", function () {
    closeWindow(win);
  });
  win.addEventListener("mousedown", function () {
    bringToFront(win);
  });
}

["welcome", "about", "projects", "terminal"].forEach(initializeWindow);

document.querySelector("#welcomeopen").addEventListener("click", function () { openWindow("welcome"); });
document.querySelector("#aboutopen").addEventListener("click", function () { openWindow("about"); });
document.querySelector("#projectsopen").addEventListener("click", function () { openWindow("projects"); });
document.querySelector("#terminalopen").addEventListener("click", function () { openWindow("terminal"); });

/* ===========================================================
   4. DESKTOP ICONS (single click = select, double click = open)
   =========================================================== */
var selectedIcon = undefined;

function deselectIcon(element) {
  if (element != undefined) {
    element.classList.remove("selected");
  }
}

function selectIcon(element) {
  deselectIcon(selectedIcon);
  element.classList.add("selected");
  selectedIcon = element;
}

document.querySelectorAll(".appicon").forEach(function (icon) {
  icon.addEventListener("click", function () {
    selectIcon(icon);
  });
  icon.addEventListener("dblclick", function () {
    deselectIcon(icon);
    selectedIcon = undefined;
    openWindow(icon.dataset.window);
  });
});

document.body.addEventListener("mousedown", function (e) {
  if (e.target === document.body) {
    deselectIcon(selectedIcon);
    selectedIcon = undefined;
  }
});

/* ===========================================================
   5. ABOUT ME APP
   =========================================================== */
var aboutSections = [
  {
    title: "Hello!",
    date: "2026",
    body: `
      <h2>hey, I'm eroga</h2>
      <p>
        I study cybersecurity and spend most of my time messing around
        with computers — Linux, privacy stuff, writing scripts, that kind of thing.
      </p>
      <p>
        made this for a Hack Club jam. thought a fake OS
        was more interesting than a normal portfolio page.
      </p>
    `,
  },
  {
    title: "Skills",
    date: "Skills",
    body: `
      <h2>things I actually use</h2>
      <ul>
        <li><strong>Python</strong> — my main language, mostly for tooling and scripts</li>
        <li><strong>cryptography</strong> — classic ciphers, frequency analysis, that stuff</li>
        <li><strong>Linux &amp; privacy</strong> — GrapheneOS, hardening, de-Googling setups</li>
        <li><strong>HTML / CSS / JS</strong> — enough to make this whole thing (apparently)</li>
      </ul>
      <p style="opacity:0.7; font-size:13px;">still learning a lot, especially on the web side</p>
    `,
  },
  {
    title: "Right now",
    date: "Now",
    body: `
      <h2>right now</h2>
      <p>
        apart from this jam I've been working on two things:
        a <strong>Vigenère</strong> cracker in Python (it does statistical
        attacks and brute force), and a <strong>GrapheneOS</strong> setup
        guide for people who want more privacy but don't want to spend
        three hours configuring stuff.
      </p>
      <p>
        both are in the Projects app if you want to check them out.
        also — the sticky notes were my own feature for this jam, try them.
      </p>
    `,
  },
];

var aboutTitle = document.querySelector("#abouttitle");

function setAboutContent(index) {
  document.querySelector("#contentDisplay").innerHTML = aboutSections[index].body;
  aboutTitle.innerHTML = aboutSections[index].title;

  document.querySelectorAll(".sidebar-item").forEach(function (el, i) {
    el.classList.toggle("active", i === index);
  });
}

function addToSidebar(index) {
  var sidebar = document.querySelector("#sidebar");
  var section = aboutSections[index];

  var item = document.createElement("div");
  item.className = "sidebar-item";
  item.innerHTML = `
    <p>${section.title}</p>
    <p class="sidebar-date">${section.date}</p>
  `;
  item.addEventListener("click", function () {
    setAboutContent(index);
  });
  sidebar.appendChild(item);
}

for (var i = 0; i < aboutSections.length; i++) {
  addToSidebar(i);
}
setAboutContent(0);

/* ===========================================================
   6. PROJECTS APP
   =========================================================== */
var projects = [
  {
    emoji: "🖥️",
    name: "MiOS",
    desc: "my portfolio but it's a fake OS. made it for a Hack Club jam.",
    tags: ["HTML", "CSS", "JS"],
    link: "https://github.com/Er0ga/MiOS---browser-based-OS",
  },
  {
    emoji: "🔐",
    name: "Vigenère Tool",
    desc: "Python script to encrypt/decrypt Vigenère and crack it with frequency analysis or brute force.",
    tags: ["Python", "cryptography"],
    link: null,
  },
  {
    emoji: "📱",
    name: "GrapheneOS Guide",
    desc: "setup guide for GrapheneOS focused on everyday use — not for people who live in a bunker.",
    tags: ["privacy", "Android", "Linux"],
    link: "https://github.com/Er0ga/GrapheneOS-for-normal-usage_privacy-without-paranoia",
  },
  {
    emoji: "⚡",
    name: "Hack Club",
    desc: "the community that made me build all this in the first place.",
    tags: ["community"],
    link: "https://hackclub.com/",
  },
];

function renderProjects() {
  var grid = document.querySelector("#projectGrid");
  projects.forEach(function (p) {
    var card = document.createElement("div");
    card.className = "project-card";
    var tagsHtml = p.tags
      .map(function (t) {
        return '<span class="project-tag">' + t + "</span>";
      })
      .join("");
    var linkHtml = p.link
      ? '<a href="' + p.link + '" target="_blank" rel="noopener">View →</a>'
      : '<span style="opacity:0.4;cursor:not-allowed;" title="Not available">View →</span>';
    card.innerHTML = `
      <div class="emoji">${p.emoji}</div>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div>${tagsHtml}</div>
      <p style="margin-top:8px;">
        ${linkHtml}
      </p>
    `;
    grid.appendChild(card);
  });
}
renderProjects();

/* ===========================================================
   7. TERMINAL
   =========================================================== */
var terminalBody = document.querySelector("#terminalBody");
var terminalOutput = document.querySelector("#terminalOutput");
var terminalInput = document.querySelector("#terminalInput");
var cmdHistory = [];
var historyIndex = -1;

function termPrint(html) {
  var line = document.createElement("div");
  line.className = "terminal-line";
  line.innerHTML = html;
  terminalOutput.appendChild(line);
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

var ASCII =
  "  __ _  ___  \n" +
  " |  ( )/ _ \\ \n" +
  " | || | (_) |\n" +
  " |_||_|\\___/  MiOS";

var commands = {
  help: function () {
    return (
      'Available commands:\n' +
      '  <span class="term-accent">help</span>       this help\n' +
      '  <span class="term-accent">about</span>      who I am\n' +
      '  <span class="term-accent">whoami</span>     short version\n' +
      '  <span class="term-accent">projects</span>   my projects\n' +
      '  <span class="term-accent">skills</span>     my skills\n' +
      '  <span class="term-accent">neofetch</span>   system info\n' +
      '  <span class="term-accent">open</span> &lt;app&gt;  open a window (about, projects...)\n' +
      '  <span class="term-accent">date</span>       current date and time\n' +
      '  <span class="term-accent">echo</span> &lt;txt&gt; repeat text\n' +
      '  <span class="term-accent">note</span>       create a sticky note\n' +
      '  <span class="term-accent">clear</span>      clear the screen'
    );
  },
  about: function () {
    return (
      "eroga. cybersecurity student, computer nerd.\n" +
      "made this for the Hack Club webOS jam.\n" +
      'more info: <span class="term-accent">open about</span>'
    );
  },
  whoami: function () {
    return "eroga — probably should be sleeping";
  },
  projects: function () {
    var out = "Projects:\n";
    projects.forEach(function (p) {
      out += "  " + p.emoji + "  " + p.name + " — " + p.desc + "\n";
    });
    out += '\nOpen in a window with <span class="term-accent">open projects</span>.';
    return out;
  },
  skills: function () {
    return "Python ▓▓▓▓▓▓▓░░░\nLinux  ▓▓▓▓▓▓░░░░\nCrypto ▓▓▓▓▓░░░░░\nWeb    ▓▓▓▓░░░░░░\n(the web bar went down while making this)";
  },
  neofetch: function () {
    return (
      '<span class="term-accent">' + ASCII + "</span>\n\n" +
      "OS:      MiOS 1.0 (web)\n" +
      "Host:    browser\n" +
      "Shell:   webOS-sh\n" +
      "Apps:    About, Projects, Terminal, Notes\n" +
      "User:    eroga\n" +
      "Built with: HTML + CSS + JavaScript ❤️"
    );
  },
  date: function () {
    return new Date().toLocaleString("en-GB");
  },
  echo: function (args) {
    return args.join(" ");
  },
  open: function (args) {
    var apps = ["welcome", "about", "projects", "terminal"];
    var app = (args[0] || "").toLowerCase();
    if (apps.indexOf(app) !== -1) {
      openWindow(app);
      return "Opening " + app + "…";
    }
    return (
      '<span class="term-warn">Unknown app.</span> Try: ' +
      apps.join(", ")
    );
  },
  clear: function () {
    terminalOutput.innerHTML = "";
    return "";
  },
  sudo: function () {
    return '<span class="term-warn">Nice try 😏 — no root here.</span>';
  },
  ls: function () {
    return "about.txt  projects/  skills.txt  notes/";
  },
};

function runCommand(raw) {
  var input = raw.trim();
  termPrint('<span class="term-accent">eroga@webOS:~$</span> ' + escapeHtml(input));
  if (input === "") return;

  cmdHistory.push(input);
  historyIndex = cmdHistory.length;

  var parts = input.split(/\s+/);
  var name = parts[0].toLowerCase();
  var args = parts.slice(1);

  if (commands[name]) {
    var output = commands[name](args);
    if (output) termPrint(output);
  } else {
    termPrint(
      '<span class="term-warn">command not found: ' +
        escapeHtml(name) +
        '</span> — type <span class="term-accent">help</span>'
    );
  }
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

terminalInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    runCommand(terminalInput.value);
    terminalInput.value = "";
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      terminalInput.value = cmdHistory[historyIndex];
    }
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    if (historyIndex < cmdHistory.length - 1) {
      historyIndex++;
      terminalInput.value = cmdHistory[historyIndex];
    } else {
      historyIndex = cmdHistory.length;
      terminalInput.value = "";
    }
  }
});

terminalBody.addEventListener("click", function () {
  terminalInput.focus();
});

termPrint('<span class="term-accent">' + ASCII + "</span>");
termPrint('Welcome to MiOS. Type <span class="term-accent">help</span> to get started.');
termPrint('<span class="term-muted">Tip: use ↑ / ↓ to repeat commands.</span>');

/* ===========================================================
   8. STICKY NOTES (custom feature — not in the guide)
   Creates editable, draggable note windows on the desktop.
   =========================================================== */
var noteCount = 0;
var noteColors = [
  { bg: "rgba(255,242,130,0.96)", header: "rgba(240,210,60,0.8)",  text: "#3a3000" },
  { bg: "rgba(200,240,200,0.96)", header: "rgba(140,210,140,0.8)", text: "#0a3000" },
  { bg: "rgba(200,220,255,0.96)", header: "rgba(140,180,240,0.8)", text: "#001a40" },
  { bg: "rgba(255,210,210,0.96)", header: "rgba(240,150,150,0.8)", text: "#400000" },
];

function createStickyNote() {
  noteCount++;
  var id = "note-" + noteCount;
  var color = noteColors[(noteCount - 1) % noteColors.length];

  var randomX = 120 + Math.floor(Math.random() * 500);
  var randomY = 80 + Math.floor(Math.random() * 260);

  var note = document.createElement("div");
  note.className = "window sticky-note";
  note.id = id;
  note.style.top = randomY + "px";
  note.style.left = randomX + "px";
  note.style.zIndex = ++biggestIndex;
  note.style.backgroundColor = color.bg;

  note.innerHTML =
    '<div class="windowheader" id="' + id + 'header" style="background-color:' + color.header + '">' +
      '<div class="closebutton" id="' + id + 'close"></div>' +
      '<p class="headertext" style="color:' + color.text + '">Note</p>' +
      '<div class="header-spacer"></div>' +
    "</div>" +
    '<textarea class="sticky-textarea" placeholder="Write here…" style="color:' + color.text + '"></textarea>';

  document.body.appendChild(note);

  note.querySelector("#" + id + "close").addEventListener("click", function () {
    note.remove();
  });

  dragElement(note);

  note.addEventListener("mousedown", function () {
    bringToFront(note);
  });

  note.querySelector(".sticky-textarea").focus();
}

document.querySelector("#notasnew").addEventListener("click", createStickyNote);

var notasIcon = document.querySelector("#notasicon");
notasIcon.addEventListener("click", function () {
  selectIcon(notasIcon);
});
notasIcon.addEventListener("dblclick", function () {
  deselectIcon(notasIcon);
  selectedIcon = undefined;
  createStickyNote();
});

commands["note"] = function () {
  createStickyNote();
  return '<span class="term-accent">New note created on the desktop.</span>';
};
