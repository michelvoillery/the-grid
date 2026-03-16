let allItems = [];
let currentFilter = "all";

const API = "http://127.0.0.1:8000";

function detectItemType(url) {

  const lowerUrl = (url || "").toLowerCase().trim();

  if (
    lowerUrl.endsWith(".jpg") ||
    lowerUrl.endsWith(".jpeg") ||
    lowerUrl.endsWith(".png") ||
    lowerUrl.endsWith(".webp") ||
    lowerUrl.endsWith(".gif")
  ) {
    return "image";
  }

  if (lowerUrl.endsWith(".pdf")) {
    return "pdf";
  }

  if (
    lowerUrl.includes("youtube.com/watch") ||
    lowerUrl.includes("youtu.be/")
  ) {
    return "youtube";
  }

  return "article";
}

function escapeHtml(value) {

  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

async function load() {

  const grid = document.getElementById("grid");

  if (!grid) return;

  grid.innerHTML = "Loading...";

  try {

    const res = await fetch(`${API}/items`);

    if (!res.ok) throw new Error("Backend error");

    const data = await res.json();

    allItems = data;

    updateSidebarCounts();
    renderItems();

  } catch (err) {

    console.error(err);

    grid.innerHTML = "Could not load backend.";

  }
}

function updateSidebarCounts() {

  const counts = {
    all: allItems.length,
    article: 0,
    youtube: 0,
    pdf: 0,
    image: 0
  };

  allItems.forEach(item => {

    const type = (item?.item_type || "article").toLowerCase();

    if (counts[type] !== undefined) counts[type]++;

  });

  document.getElementById("count-all").textContent = counts.all;
  document.getElementById("count-article").textContent = counts.article;
  document.getElementById("count-youtube").textContent = counts.youtube;
  document.getElementById("count-pdf").textContent = counts.pdf;
  document.getElementById("count-image").textContent = counts.image;
}

function renderItems() {

  const grid = document.getElementById("grid");

  if (!grid) return;

  let filtered = allItems;

  if (currentFilter !== "all") {

    filtered = allItems.filter(item =>
      (item?.item_type || "article") === currentFilter
    );

  }

  if (!filtered.length) {

    grid.innerHTML = "No items.";

    return;
  }

  grid.innerHTML = "";

  filtered.forEach(item => {

    let hostname = "";

    try {

      if (item.url.startsWith("/uploads")) {
        hostname = "local upload";
      } else {
        hostname = new URL(item.url).hostname;
      }

    } catch {
      hostname = "";
    }

    const type = (item?.item_type || "article").toUpperCase();

    const card = document.createElement("div");
    card.className = "card";

    let thumb = `<div class="thumb"></div>`;

    if (item.image) {
      thumb = `<div class="thumb" style="background-image:url('${item.image}')"></div>`;
    }

    if (type === "PDF") {
      thumb = `<div class="thumb thumb-pdf">PDF</div>`;
    }

    card.innerHTML = `
      ${thumb}
      <div class="card-body">

        <div class="card-meta">
          <div class="domain">${escapeHtml(hostname)}</div>
          <div class="type-badge">${type}</div>
        </div>

        <h3 class="card-title">${escapeHtml(item.title)}</h3>

        <p class="card-desc">${escapeHtml(item.description)}</p>

      </div>
    `;

    card.onclick = () => window.open(item.url, "_blank");

    grid.appendChild(card);

  });

}

function setFilter(filter, el) {

  currentFilter = filter;

  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));

  if (el) el.classList.add("active");

  renderItems();
}

async function addItem() {

  const input = document.getElementById("urlInput");
  const typeSelect = document.getElementById("itemType");

  const url = input.value.trim();

  if (!url) return;

  let itemType = detectItemType(url);

  typeSelect.value = itemType;

  try {

    const res = await fetch(
      `${API}/add?url=${encodeURIComponent(url)}&item_type=${itemType}`
    );

    if (!res.ok) throw new Error("Add failed");

    input.value = "";

    await load();

  } catch (err) {

    console.error(err);

  }
}

async function uploadFile() {

  const input = document.getElementById("fileUpload");

  if (!input.files.length) return;

  const file = input.files[0];

  const form = new FormData();

  form.append("file", file);

  try {

    const res = await fetch(`${API}/upload`, {
      method: "POST",
      body: form
    });

    if (!res.ok) throw new Error("Upload failed");

    input.value = "";

    await load();

  } catch (err) {

    console.error(err);

  }
}

document.addEventListener("DOMContentLoaded", () => {

  const input = document.getElementById("urlInput");

  load();

  input.addEventListener("keydown", e => {

    if (e.key === "Enter") addItem();

  });

});