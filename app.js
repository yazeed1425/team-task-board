const STORAGE_KEY = "team-task-board-tasks";

const defaultTasks = [
  { id: "1", title: "Set up GitHub webhook", assignee: "yazeed1425", status: "done" },
  { id: "2", title: "Connect Discord bot", assignee: "yazeed1425", status: "progress" },
  { id: "3", title: "Test daily summary", assignee: "yazeed1425", status: "todo" },
];

let tasks = loadTasks();
let editingId = null;

const dialog = document.getElementById("task-dialog");
const form = document.getElementById("task-form");

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [...defaultTasks];
  } catch {
    return [...defaultTasks];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function render() {
  const cols = { todo: [], progress: [], done: [] };
  tasks.forEach((t) => cols[t.status]?.push(t));

  for (const [status, list] of Object.entries(cols)) {
    const container = document.getElementById(`col-${status}`);
    const count = document.getElementById(`count-${status}`);
    count.textContent = list.length;
    container.innerHTML = list
      .map(
        (t) => `
      <div class="card" data-id="${t.id}">
        <h4>${escapeHtml(t.title)}</h4>
        <div class="assignee">${t.assignee ? "@" + escapeHtml(t.assignee) : "Unassigned"}</div>
      </div>`
      )
      .join("");

    container.querySelectorAll(".card").forEach((el) => {
      el.addEventListener("click", () => openEdit(el.dataset.id));
    });
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function openNew() {
  editingId = null;
  document.getElementById("dialog-title").textContent = "New Task";
  document.getElementById("task-title").value = "";
  document.getElementById("task-assignee").value = "";
  document.getElementById("task-status").value = "todo";
  dialog.showModal();
}

function openEdit(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  editingId = id;
  document.getElementById("dialog-title").textContent = "Edit Task";
  document.getElementById("task-title").value = task.title;
  document.getElementById("task-assignee").value = task.assignee || "";
  document.getElementById("task-status").value = task.status;
  dialog.showModal();
}

document.getElementById("add-task-btn").addEventListener("click", openNew);
document.getElementById("cancel-btn").addEventListener("click", () => dialog.close());

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("task-title").value.trim();
  const assignee = document.getElementById("task-assignee").value.trim();
  const status = document.getElementById("task-status").value;

  if (editingId) {
    const task = tasks.find((t) => t.id === editingId);
    if (task) Object.assign(task, { title, assignee, status });
  } else {
    tasks.push({ id: Date.now().toString(), title, assignee, status });
  }

  saveTasks();
  render();
  dialog.close();
});

render();
