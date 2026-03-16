let allItems = [];
let currentFilter = "all";

async function load() {
  const grid = document.getElementById("grid");
  grid.innerHTML = "<div style='padding:20px;'>Loading items...</div>";

  try {
    const res = await fetch("/api/items");

    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      throw new Error("API response is not an array");
    }

    allItems = data;
    updateSidebarCounts();
    renderItems();
  } catch (err) {
    console.error("Failed to load items:", err);
    grid.innerHTML = `
      <div style="padding:20px;color:red;">
        Could not load items from backend.
      </div>
    `;
  }
}

function updateSidebarCounts() {
  const counts = {
    all: allItems.length,
    article: 0,
    youtube: 0,
    pdf: 0
  };

  allItems.forEach((item) => {
    const type = (item.item_type || "article").toLowerCase();
    if (counts[type] !== undefined) {
      counts[type]++;
    }
  });

  const allEl = document.getElementById("count-all");
  const articleEl = document.getElementById("count-article");
  const youtubeEl = document.getElementById("count-youtube");
  const pdfEl = document.getElementById("count-pdf");

  if (allEl) allEl.textContent = counts.all;
  if (articleEl) articleEl.textContent = counts.article;
  if (youtubeEl) youtubeEl.textContent = counts.youtube;
  if (pdfEl) pdfEl.textContent = counts.pdf;
}

function renderItems() {
  const grid = document.getElementById("grid");

  let filteredItems = allItems;

  if (currentFilter !== "all") {
    filteredItems = allItems.filter(
      (item) => (item.item_type || "article") === currentFilter
    );
  }

  if (!filteredItems.length) {
    grid.innerHTML = `
      <div style="padding:20px;color:#666;">
        No items found for this filter.
      </div>
    `;
    return;
  }

  grid.innerHTML = "";

  filteredItems.forEach((item) => {
    let hostname = "";
    try {
      hostname = item.url ? new URL(item.url).hostname : "";
    } catch (e) {
      hostname = item.url || "";
    }

    const card = document.createElement("div");
    card.className = "card";

    const type = (item.item_type || "article").toLowerCase();
    const typeLabel = type.toUpperCase();

    let thumbContent = "";
    if (type === "pdf") {
      thumbContent = `<div class="thumb thumb-pdf">PDF</div>`;
    } else {
      const imageStyle = item.image
        ? `background-image:url('${item.image}');`
        : "background:#ececf3;";
      thumbContent = `<div class="thumb" style="${imageStyle}"></div>`;
    }

    card.innerHTML = `
      ${thumbContent}
      <div class="card-body">
        <div class="card-meta">
          <div class="domain">${hostname}</div>
          <div class="type-badge">${typeLabel}</div>
        </div>
        <h3 class="card-title">${item.title || "Untitled"}</h3>
        <p class="card-desc">${item.description || ""}</p>
      </div>
    `;

    card.addEventListener("click", () => {
      if (item.url) {
        window.open(item.url, "_blank");
      }
    });

    grid.appendChild(card);
  });
}

function setFilter(filter, element) {
  currentFilter = filter;

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active");
  });

  if (element) {
    element.classList.add("active");
  }

  renderItems();
}

async function addItem() {
  const input = document.getElementById("urlInput");
  const typeSelect = document.getElementById("itemType");

  const url = input.value.trim();
  let itemType = typeSelect.value;

  if (!url) return;

  // simple auto-fix for pasted PDF links
  if (url.toLowerCase().endsWith(".pdf")) {
    itemType = "pdf";
    typeSelect.value = "pdf";
  }

  try {
    const res = await fetch(
      `/api/add?url=${encodeURIComponent(url)}&item_type=${encodeURIComponent(itemType)}`
    );

    if (!res.ok) {
      throw new Error(`Add failed with status ${res.status}`);
    }

    input.value = "";
    typeSelect.value = "article";

    await load();
  } catch (err) {
    console.error("Failed to add item:", err);
    alert("Could not add the URL. Check browser console.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  load();

  const input = document.getElementById("urlInput");
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      addItem();
    }
  });
});
