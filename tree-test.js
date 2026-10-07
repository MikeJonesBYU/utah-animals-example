// Utah Animals tree test.
//   index.html?test     starts a session for the next participant (P1, P2, ...)
//   index.html?results  the moderator's results page: saved sessions, CSV download, clear
// Every click during a task is recorded. Results are kept in this browser's
// localStorage until cleared, so they survive reloads and browser restarts.
// A session belongs to the tab it was started in (sessionStorage): other tabs,
// and the same tab once the moderator moves on, show the normal site.
// app.js calls TreeTest.init() once the page is built.

(function () {
  "use strict";

  var data = window.SITE_DATA || { attributes: [], animals: [], tasks: [] };
  var tasks = data.tasks || [];
  var KEY = "utahAnimalsTreeTest.v2";
  var TAB_KEY = "utahAnimalsTreeTest.tab";
  var params = new URLSearchParams(window.location.search);
  var pageType = document.body.getAttribute("data-page");

  var COLUMNS = [
    "participant", "session_start", "session_status",
    "task_position", "task_id", "task_text", "target",
    "task_outcome", "task_seconds", "task_clicks",
    "predicted_first_click", "first_click", "first_click_predicted", "first_click_correct_path",
    "click_number", "action", "label", "page", "seconds_since_previous"
  ];

  // ---------- helpers ----------

  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    }
    if (text != null) node.textContent = text;
    return node;
  }

  function valuesOf(animal, attr) {
    var v = animal[attr.id];
    if (v == null) return [];
    return Array.isArray(v) ? v : [v];
  }

  function shuffle(list) {
    for (var i = list.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = list[i]; list[i] = list[j]; list[j] = tmp;
    }
    return list;
  }

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function formatDate(ms) {
    var d = new Date(ms);
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function formatDateTime(ms) {
    var d = new Date(ms);
    return formatDate(ms) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
  }

  function seconds(ms) { return (ms / 1000).toFixed(1); }

  // ---------- saved state ----------

  function emptyState() {
    return { sessions: [], nextParticipant: 1, navCounter: 0 };
  }

  function load() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* fall through to a fresh state */ }
    return emptyState();
  }

  // Writes this tab's session into what's stored, so a second tab (say, the results
  // page) can't be overwritten by this one, or the reverse.
  var storageOk = true;
  function save() {
    try {
      if (session) {
        var stored = load();
        var i = indexOfSession(stored.sessions, session.id);
        if (i === -1) stored.sessions.push(session);
        else stored.sessions[i] = session;
        stored.nextParticipant = Math.max(stored.nextParticipant, state.nextParticipant);
        stored.navCounter = Math.max(stored.navCounter || 0, state.navCounter || 0);
        state = stored;
      }
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      storageOk = false;
    }
  }

  // What this tab is doing: { pending: true } (ready modal, nothing saved yet),
  // { sessionId: ... } (running that session), { thanks: true } (finished), or null.
  function loadTab() {
    try {
      return JSON.parse(window.sessionStorage.getItem(TAB_KEY));
    } catch (e) {
      return null;
    }
  }

  function saveTab() {
    try {
      if (tab) window.sessionStorage.setItem(TAB_KEY, JSON.stringify(tab));
      else window.sessionStorage.removeItem(TAB_KEY);
    } catch (e) { /* the tab just won't remember its session */ }
  }

  function indexOfSession(sessions, id) {
    for (var i = 0; i < sessions.length; i++) {
      if (sessions[i].id === id) return i;
    }
    return -1;
  }

  var state = load();
  var tab = loadTab();
  var session = null;
  if (tab && tab.sessionId) {
    session = state.sessions[indexOfSession(state.sessions, tab.sessionId)] || null;
    if (!session) { tab = null; saveTab(); } // results were cleared
  }
  var mode = params.has("results") ? "results" : "site";

  // Landing-page buttons whose category page holds any of the targets.
  function correctFirstClicks(targets) {
    var found = [];
    data.attributes.filter(function (a) { return a.onHome; }).forEach(function (attr) {
      attr.values.forEach(function (value) {
        var holds = data.animals.some(function (animal) {
          return targets.indexOf(animal.name) !== -1 && valuesOf(animal, attr).indexOf(value[0]) !== -1;
        });
        if (holds) found.push(value[1]);
      });
    });
    return found;
  }

  // Called when the participant clicks Start: only then is the session saved and
  // given a participant number. Each session keeps its own copy of the tasks, so
  // its results still read correctly after data.js changes.
  function startSession() {
    state = load(); // another tab may have used participant numbers since this page loaded
    var order = shuffle(tasks.slice());
    session = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      participant: "P" + state.nextParticipant,
      start: Date.now(),
      status: "incomplete",
      phase: "intro",
      pos: 0,
      lastIdx: null,
      currentPage: null,
      tasks: order.map(function (task) {
        var targets = Array.isArray(task.targets) ? task.targets : [task.targets];
        return {
          id: String(task.id),
          text: task.text,
          targets: targets,
          predictedFirstClick: task.predictedFirstClick,
          correctFirstClicks: correctFirstClicks(targets),
          startedAt: null,
          endedAt: null,
          outcome: "",
          actions: []
        };
      })
    };
    state.nextParticipant += 1;
    state.sessions.push(session);
    save();
    tab = { sessionId: session.id };
    saveTab();
  }

  // ?test sets this tab up for a new participant. Any unfinished session stays saved
  // as incomplete. The ?test is then dropped from the address so a reload doesn't
  // start another one.
  if (params.has("test") && mode !== "results") {
    session = null;
    tab = { pending: true };
    saveTab();
    if (pageType !== "home") {
      window.location.replace("index.html");
    } else {
      history.replaceState(null, "", "index.html");
    }
  }

  function currentTask() { return session.tasks[session.pos]; }

  // ---------- recording ----------

  var pageName = "";

  function log(action, label) {
    currentTask().actions.push({ action: action, label: label, page: pageName, at: Date.now() });
    save();
  }

  // Each page in the tab's history gets a number. Arriving at a page with a lower
  // number than the last one means the browser's Back button; higher means Forward.
  function trackHistory() {
    var st = history.state;
    var idx;
    var direction = null;
    if (st && typeof st.ttIdx === "number") {
      idx = st.ttIdx;
      if (session.lastIdx != null && idx < session.lastIdx) direction = "back";
      if (session.lastIdx != null && idx > session.lastIdx) direction = "forward";
    } else {
      state.navCounter += 1;
      idx = state.navCounter;
      history.replaceState({ ttIdx: idx }, "");
    }
    if (direction && session.phase === "running") {
      currentTask().actions.push({
        action: direction,
        label: direction === "back" ? "Back" : "Forward",
        page: session.currentPage || "",
        at: Date.now()
      });
    }
    session.lastIdx = idx;
    session.currentPage = pageName;
    save();
  }

  function filterLabel(input) {
    var label = document.querySelector("label[for='" + input.id + "']");
    return label ? label.firstChild.textContent.trim() : input.value;
  }

  function onClick(e) {
    if (!session || session.phase !== "running") return;
    var target = e.target;
    if (target.closest(".tt-bar, .tt-modal")) return;
    var button = target.closest("button");
    var link = target.closest("a");
    if (button && button.classList.contains("card")) {
      cardClicked(button.getAttribute("data-name"));
    } else if (button && button.id === "clear-filters") {
      log("clear filters", button.textContent);
    } else if (link && link.closest(".category-buttons")) {
      log("category button", link.textContent);
    } else if (link && link.closest(".breadcrumb")) {
      log("breadcrumb", link.textContent);
    } else if (link) {
      log("link", link.textContent);
    }
  }

  function onChange(e) {
    if (!session || session.phase !== "running") return;
    var input = e.target;
    if (input.type !== "checkbox" || !input.closest("#filters")) return;
    log(input.checked ? "filter check" : "filter uncheck", filterLabel(input));
  }

  function cardClicked(name) {
    log("card", name);
    if (currentTask().targets.indexOf(name) !== -1) endTask("success");
  }

  function giveUp() {
    log("give up", "I give up");
    endTask("give up");
  }

  // Ends the task and goes back to the landing page for the next one (or the thank-you).
  function endTask(outcome) {
    var task = currentTask();
    task.outcome = outcome;
    task.endedAt = Date.now();
    session.pos += 1;
    var finished = session.pos >= session.tasks.length;
    if (finished) {
      session.phase = "done";
      session.status = "complete";
    } else {
      session.phase = "intro";
    }
    save();
    if (finished) {
      session = null;
      tab = { thanks: true };
      saveTab();
    }
    if (pageType !== "home") {
      window.location.href = "index.html";
    } else {
      render();
    }
  }

  // ---------- participant screens ----------

  var shown = [];
  var fitBar = null;

  function clearUI() {
    shown.forEach(function (node) {
      if (node.tagName === "DIALOG") {
        node.setAttribute("data-closing", "");
        if (node.open) node.close();
      }
      node.remove();
    });
    shown = [];
    if (fitBar) window.removeEventListener("resize", fitBar);
    fitBar = null;
    document.body.style.paddingBottom = "";
  }

  function modal(heading, paragraphs, buttonText, onPress) {
    var dialog = el("dialog", { class: "tt-modal", "aria-labelledby": "tt-modal-heading" });
    dialog.appendChild(el("h2", { id: "tt-modal-heading" }, heading));
    paragraphs.forEach(function (text) {
      dialog.appendChild(el("p", null, text));
    });
    if (buttonText) {
      var button = el("button", { type: "button", class: "tt-primary" }, buttonText);
      button.addEventListener("click", onPress);
      dialog.appendChild(button);
    }
    // Escape doesn't dismiss it: the participant has to use the button.
    dialog.addEventListener("cancel", function (e) { e.preventDefault(); });
    dialog.addEventListener("close", function () {
      if (!dialog.hasAttribute("data-closing")) dialog.showModal();
    });
    document.body.appendChild(dialog);
    dialog.showModal();
    shown.push(dialog);
  }

  function showReady() {
    modal("Before you start", [
      "You'll be asked to find " + tasks.length + " animals on a website about Utah animals, one at a time.",
      "Click around the way you normally would. When you find the animal, click its card.",
      "If you can't find it, click \"I give up\" at the bottom of the screen. That helps us too.",
      "We're testing the website, not you."
    ], "Start", function () {
      startSession();
      pageName = "Home";
      trackHistory();
      listen();
      render();
    });
  }

  function showIntro() {
    var task = currentTask();
    modal("Task " + (session.pos + 1) + " of " + session.tasks.length, [
      task.text,
      "When you find it, click its card."
    ], "Start task", function () {
      task.startedAt = Date.now();
      session.phase = "running";
      save();
      render();
    });
  }

  function showThanks() {
    modal("Thank you, you're done", [
      "Please let the moderator know you've finished."
    ]);
  }

  function showBar() {
    var task = currentTask();
    var bar = el("div", { class: "tt-bar", role: "region", "aria-label": "Your task" });
    var text = el("p", { class: "tt-task" });
    text.appendChild(el("span", { class: "tt-task-number" }, "Task " + (session.pos + 1) + " of " + session.tasks.length + ": "));
    text.appendChild(document.createTextNode(task.text));
    bar.appendChild(text);
    var giveUpButton = el("button", { type: "button", class: "tt-give-up" }, "I give up");
    giveUpButton.addEventListener("click", giveUp);
    bar.appendChild(giveUpButton);
    document.body.appendChild(bar);
    shown.push(bar);
    // Room at the bottom of the page so the bar never covers cards or filters.
    fitBar = function () { document.body.style.paddingBottom = (bar.offsetHeight + 16) + "px"; };
    fitBar();
    window.addEventListener("resize", fitBar);
  }

  function render() {
    clearUI();
    if (!session) {
      if (tab && tab.pending) showReady();
      else if (tab && tab.thanks) showThanks();
      return;
    }
    if (session.phase === "intro") showIntro();
    else if (session.phase === "running") showBar();
  }

  // ---------- results page (moderator) ----------

  function firstClickInfo(task) {
    var first = task.actions[0];
    var label = first ? first.label : "";
    var isCategory = !!first && first.action === "category button";
    return {
      label: label,
      predicted: isCategory && label === task.predictedFirstClick ? "yes" : "no",
      onPath: isCategory && task.correctFirstClicks.indexOf(label) !== -1 ? "yes" : "no"
    };
  }

  function csvCell(value) {
    var v = value == null ? "" : String(value);
    return /[",\r\n]/.test(v) ? "\"" + v.replace(/"/g, "\"\"") + "\"" : v;
  }

  // One row per recorded action. Task-level columns repeat on each of the task's rows.
  function buildCsv() {
    var lines = [COLUMNS.join(",")];
    state.sessions.forEach(function (s) {
      s.tasks.forEach(function (task, i) {
        if (!task.actions.length) return;
        var first = firstClickInfo(task);
        var end = task.endedAt || task.actions[task.actions.length - 1].at;
        var previous = task.startedAt;
        task.actions.forEach(function (act, n) {
          var row = [
            s.participant, formatDateTime(s.start), s.status,
            i + 1, task.id, task.text, task.targets.join("; "),
            task.outcome, seconds(end - task.startedAt), task.actions.length,
            task.predictedFirstClick, first.label, first.predicted, first.onPath,
            n + 1, act.action, act.label, act.page, seconds(act.at - previous)
          ];
          previous = act.at;
          lines.push(row.map(csvCell).join(","));
        });
      });
    });
    return lines.join("\r\n") + "\r\n";
  }

  function download() {
    var blob = new Blob([buildCsv()], { type: "text/csv" });
    var url = URL.createObjectURL(blob);
    var now = new Date();
    var stamp = formatDate(now.getTime()) + "-" + pad(now.getHours()) + pad(now.getMinutes());
    var link = el("a", { href: url, download: "tree-test-results-" + stamp + ".csv" });
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function buildResults() {
    document.title = "Tree test results | Utah Animals";
    var main = document.querySelector("main");
    main.innerHTML = "";
    main.appendChild(el("h1", null, "Tree test results"));

    var intro = el("p");
    intro.appendChild(document.createTextNode("Results are saved in this browser. To run a session, open "));
    intro.appendChild(el("a", { href: "index.html?test" }, "index.html?test"));
    intro.appendChild(document.createTextNode("."));
    main.appendChild(intro);

    if (!storageOk) {
      main.appendChild(el("p", { class: "problems", role: "alert" }, "This browser isn't letting the page save results."));
    }

    if (!state.sessions.length) {
      main.appendChild(el("p", null, "No sessions saved yet."));
      return;
    }

    var table = el("table", { class: "tt-table" });
    var head = el("tr");
    ["Participant", "Started", "Status", "Tasks completed", "Successes"].forEach(function (h) {
      head.appendChild(el("th", { scope: "col" }, h));
    });
    table.appendChild(el("thead")).appendChild(head);
    var body = el("tbody");
    state.sessions.forEach(function (s) {
      var done = s.tasks.filter(function (t) { return t.outcome; }).length;
      var wins = s.tasks.filter(function (t) { return t.outcome === "success"; }).length;
      var row = el("tr");
      [s.participant, formatDateTime(s.start), s.status, done + " of " + s.tasks.length, String(wins)].forEach(function (v) {
        row.appendChild(el("td", null, v));
      });
      body.appendChild(row);
    });
    table.appendChild(body);
    main.appendChild(table);

    var actions = el("div", { class: "tt-actions" });
    var downloadButton = el("button", { type: "button", id: "tt-download" }, "Download CSV");
    downloadButton.addEventListener("click", download);
    var clearButton = el("button", { type: "button", id: "tt-clear" }, "Clear all results");
    actions.appendChild(downloadButton);
    actions.appendChild(clearButton);
    main.appendChild(actions);

    var count = state.sessions.length;
    var confirmBox = el("div", { class: "tt-confirm", role: "alert", hidden: "" });
    confirmBox.appendChild(el("p", null, "Delete all " + count + (count === 1 ? " session" : " sessions") +
      "? Download the CSV first if you need it. This can't be undone."));
    var yes = el("button", { type: "button", id: "tt-clear-yes" }, "Yes, delete all");
    var no = el("button", { type: "button", id: "tt-clear-no" }, "Cancel");
    confirmBox.appendChild(yes);
    confirmBox.appendChild(no);
    main.appendChild(confirmBox);

    clearButton.addEventListener("click", function () {
      confirmBox.hidden = false;
      no.focus();
    });
    no.addEventListener("click", function () {
      confirmBox.hidden = true;
      clearButton.focus();
    });
    yes.addEventListener("click", function () {
      state = emptyState();
      session = null;
      save();
      buildResults();
    });
  }

  // ---------- start ----------

  function listen() {
    document.addEventListener("click", onClick, true);
    document.addEventListener("change", onChange, true);
  }

  function init() {
    // A page restored from the back/forward cache doesn't rerun scripts: reload it
    // so the history check and the task screens match the saved state.
    window.addEventListener("pageshow", function (e) {
      if (e.persisted) window.location.reload();
    });
    if (mode === "results") {
      // Opening the results page releases a tab that was showing the thank-you.
      if (tab && tab.thanks) { tab = null; saveTab(); }
      buildResults();
      return;
    }
    // Tasks always start on the landing page.
    var waiting = (tab && tab.pending) || (session && session.phase !== "running");
    if (waiting && pageType !== "home") {
      window.location.replace("index.html");
      return;
    }
    if (session) {
      var title = document.getElementById("page-title");
      pageName = pageType === "home" ? "Home" : (title ? title.textContent : "Category not found");
      trackHistory();
      listen();
    }
    render();
  }

  window.TreeTest = {
    init: init,
    // Cards are clickable only while a session is running.
    cardsClickable: function () { return mode !== "results" && !!session; }
  };
})();
