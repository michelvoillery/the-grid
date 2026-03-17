let allItems = [];
let currentFilter = "all";
let isEditMode = false;
let currentImageIndex = 0;
let articleImages = [];
let collections = [];
let tags = [];
let currentCollectionId = null;
let currentTag = null;

const API = "";

// Curated list of Font Awesome icons for search
const faIcons = [
  "fas fa-folder", "far fa-folder", "fas fa-tag", "fas fa-bookmark",
  "fas fa-heart", "far fa-heart", "fas fa-star", "far fa-star",
  "fas fa-lightbulb", "far fa-lightbulb", "fas fa-bell", "far fa-bell",
  "fas fa-home", "fas fa-wrench", "fas fa-code", "fas fa-book",
  "fas fa-graduation-cap", "fas fa-briefcase", "fas fa-dollar-sign",
  "fas fa-globe", "fas fa-camera", "fas fa-music", "fas fa-gamepad",
  "fas fa-utensils", "fas fa-plane", "fas fa-car", "fas fa-bicycle",
  "fas fa-bus", "fas fa-train", "fas fa-ship", "fas fa-rocket",
  "fas fa-shopping-cart", "fas fa-gift", "fas fa-fire", "fas fa-flask",
  "fas fa-leaf", "fas fa-cloud", "fas fa-sun", "fas fa-moon",
  "fas fa-snowflake", "fas fa-paw", "fas fa-bug", "fas fa-fish",
  "fas fa-feather-alt", "fas fa-tree", "fas fa-mountain", "fas fa-map",
  "fas fa-compass", "fas fa-anchor", "fas fa-trophy", "fas fa-crown",
  "fas fa-dragon", "fas fa-ghost", "fas fa-robot", "fas fa-space-shuttle",
  "fas fa-meteor", "fas fa-atom", "fas fa-dna", "fas fa-brain",
  "fas fa-hand-sparkles", "fas fa-magic", "fas fa-hat-wizard", "fas fa-mask",
  "fas fa-theater-masks", "fas fa-palette", "fas fa-paint-brush", "fas fa-pencil-alt",
  "fas fa-eraser", "fas fa-ruler-combined", "fas fa-cut", "fas fa-copy",
  "fas fa-paste", "fas fa-undo", "fas fa-redo", "fas fa-history",
  "fas fa-clock", "far fa-clock", "fas fa-calendar-alt", "far fa-calendar-alt",
  "fas fa-chart-line", "fas fa-chart-pie", "fas fa-signal", "fas fa-wifi",
  "fas fa-bluetooth-b", "fas fa-battery-full", "fas fa-plug", "fas fa-power-off",
  "fas fa-hdd", "far fa-hdd", "fas fa-microchip", "fas fa-server",
  "fas fa-database", "fas fa-cloud-download-alt", "fas fa-cloud-upload-alt",
  "fas fa-box", "fas fa-archive", "fas fa-trash-alt", "far fa-trash-alt",
  "fas fa-check", "fas fa-times", "fas fa-plus", "fas fa-minus",
  "fas fa-exclamation-triangle", "fas fa-info-circle", "fas fa-question-circle",
  "far fa-question-circle", "fas fa-comment", "far fa-comment", "fas fa-comments",
  "far fa-comments", "fas fa-envelope", "far fa-envelope", "fas fa-paper-plane",
  "far fa-paper-plane", "fas fa-share-alt", "fas fa-upload", "fas fa-download",
  "fas fa-link", "fas fa-external-link-alt", "fas fa-thumbtack", "fas fa-pushpin",
  "fas fa-map-marker-alt", "fas fa-location-arrow", "fas fa-road", "fas fa-mountain",
  "fas fa-tree", "fas fa-globe-americas", "fas fa-globe-europe", "fas fa-globe-asia",
  "fas fa-anchor", "fas fa-ship", "fas fa-swimmer", "fas fa-water",
  "fas fa-fire-extinguisher", "fas fa-fire-alt", "fas fa-sun", "fas fa-cloud-sun",
  "fas fa-cloud-moon", "fas fa-cloud-rain", "fas fa-snowflake", "fas fa-wind",
  "fas fa-smog", "fas fa-fan", "fas fa-temperature-high", "fas fa-temperature-low",
  "fas fa-thermometer-half", "fas fa-tint", "fas fa-umbrella", "fas fa-bolt",
  "fas fa-lightning", "fas fa-flash", "fas fa-star-and-crescent", "fas fa-mosque",
  "fas fa-menorah", "fas fa-om", "fas fa-peace", "fas fa-yin-yang",
  "fas fa-cross", "fas fa-church", "fas fa-gopuram", "fas fa-synagogue",
  "fas fa-khanda", "fas fa-dharmachakra", "fas fa-ankh", "fas fa-atom-alt",
  "fas fa-atom", "fas fa-brain", "fas fa-dna", "fas fa-head-side-brain",
  "fas fa-flask", "fas fa-microscope", "fas fa-bacteria", "fas fa-virus",
  "fas fa-syringe", "fas fa-band-aid", "fas fa-first-aid", "fas fa-hospital",
  "far fa-hospital", "fas fa-clinic-medical", "fas fa-pills", "fas fa-capsules",
  "fas fa-prescription-bottle-alt", "fas fa-notes-medical", "fas fa-heartbeat",
  "fas fa-lungs", "fas fa-hand-holding-medical", "fas fa-face-mask", "fas fa-head-side-mask",
  "fas fa-people-carry", "fas fa-handshake", "far fa-handshake", "fas fa-user-friends",
  "fas fa-users", "fas fa-user-tie", "fas fa-user-graduate", "fas fa-user-ninja",
  "fas fa-child", "fas fa-baby", "fas fa-person-booth", "fas fa-restroom",
  "fas fa-toilet", "fas fa-bath", "fas fa-shower", "fas fa-bed",
  "fas fa-couch", "fas fa-chair", "fas fa-table", "fas fa-door-closed",
  "fas fa-door-open", "fas fa-dungeon", "fas fa-gavel", "fas fa-balance-scale",
  "fas fa-scale-balanced", "fas fa-landmark", "fas fa-building", "far fa-building",
  "fas fa-city", "fas fa-factory", "fas fa-industry", "fas fa-warehouse",
  "fas fa-store", "fas fa-store-alt", "fas fa-shopping-basket", "fas fa-cash-register",
  "fas fa-receipt", "fas fa-credit-card", "far fa-credit-card", "fas fa-money-bill-alt",
  "far fa-money-bill-alt", "fas fa-wallet", "fas fa-piggy-bank", "fas fa-chart-bar",
  "far fa-chart-bar", "fas fa-comment-dollar", "fas fa-hand-holding-dollar",
  "fas fa-gem", "far fa-gem", "fas fa-ring", "fas fa-crown",
  "fas fa-dice", "fas fa-puzzle-piece", "fas fa-chess", "fas fa-trophy",
  "fas fa-medal", "fas fa-award", "fas fa-ticket-alt", "fas fa-clapperboard",
  "fas fa-film", "fas fa-video", "fas fa-camera-retro", "fas fa-images",
  "far fa-images", "fas fa-portrait", "fas fa-id-badge", "far fa-id-badge",
  "fas fa-address-card", "far fa-address-card", "fas fa-user", "far fa-user",
  "fas fa-user-circle", "far fa-user-circle", "fas fa-users", "fas fa-user-plus",
  "fas fa-user-minus", "fas fa-user-slash", "fas fa-user-lock", "fas fa-user-shield",
  "fas fa-user-secret", "fas fa-fingerprint", "fas fa-key", "fas fa-unlock-alt",
  "fas fa-lock", "fas fa-shield-alt", "fas fa-robot", "fas fa-terminal",
  "fas fa-code-branch", "fas fa-bug", "fas fa-power-off", "fas fa-wifi",
  "fas fa-signal", "fas fa-battery-full", "fas fa-plug", "fas fa-hdd",
  "far fa-hdd", "fas fa-microchip", "fas fa-server", "fas fa-database",
  "fas fa-cloud-download-alt", "fas fa-cloud-upload-alt", "fas fa-box", "fas fa-archive",
  "fas fa-trash-alt", "far fa-trash-alt", "fas fa-check", "fas fa-times",
  "fas fa-plus", "fas fa-minus"
];

function toggleEditMode() {

  isEditMode = !isEditMode;

  const btn = document.getElementById("toggleEdit");

  if (isEditMode) {
    document.body.classList.add("edit-mode");
    btn.classList.add("active");
  } else {
    document.body.classList.remove("edit-mode");
    btn.classList.remove("active");
  }

  renderCollections();
  renderTags();

}

function handleTypeChange() {

  const type = document.getElementById("itemType").value;
  const fileInput = document.getElementById("fileUpload");

  if (type === "upload") {
    fileInput.click();
  }

}

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
    const colRes = await fetch(`${API}/collections`);
    const tagRes = await fetch(`${API}/tags`);

    if (!res.ok || !colRes.ok || !tagRes.ok) throw new Error("Backend error");

    allItems = await res.json();
    collections = await colRes.json();
    tags = await tagRes.json();

    updateSidebarCounts();
    renderCollections();
    renderTags();
    renderItems();

  } catch (err) {

    console.error(err);

    grid.innerHTML = "Could not load backend.";

  }
}

function renderCollections() {

  const list = document.getElementById("collectionsList");

  if (!list) return;

  list.innerHTML = "";

  collections.forEach(col => {

    const div = document.createElement("div");
    div.className = `collection-item ${currentCollectionId === col.id ? 'active' : ''}`;
    
    let style = "";
    if (col.color) {
      style += `color:${col.color};`;
      if (currentCollectionId === col.id) { // active state color
        style += `background-color:${col.color}20;`; // 20 for 20% opacity
        div.setAttribute("data-color", col.color);
        div.style.setProperty("--data-color", col.color);
        div.style.setProperty("--data-bg-color", `${col.color}20`);
      }
    }

    div.style = style;
    
    const iconHtml = col.icon ? `<i class="${col.icon}"></i>` : '';

    div.innerHTML = `
      <span onclick="setCollection(${col.id})">
        ${iconHtml} ${escapeHtml(col.name)}
      </span>
      <div style="display:flex; gap: 4px;">
        <button class="btn-sidebar-edit" onclick="event.stopPropagation(); openEditModal('collection', ${col.id})">⚙️</button>
        <button class="btn-sidebar-delete" onclick="event.stopPropagation(); deleteCollection(${col.id})">-</button>
      </div>
    `;
    list.appendChild(div);

  });

}

async function deleteCollection(id) {

  if (!confirm("Are you sure you want to delete this collection?")) return;

  try {

    const res = await fetch(`${API}/collections/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error("Failed to delete collection");

    await load();

  } catch (err) {
    console.error(err);
  }

}

function setCollection(id) {

  currentCollectionId = (currentCollectionId === id) ? null : id;
  currentTag = null; 
  renderCollections();
  renderTags();
  renderItems();

}

function renderTags() {

  const list = document.getElementById("tagsList");

  if (!list) return;

  list.innerHTML = "";

  const allTagsSet = new Set(tags.map(t => t.name));

  allItems.forEach(item => {
    (item.tags || "").split(",").forEach(t => {
      const tag = t.trim();
      if (tag) allTagsSet.add(tag);
    });
  });

  allTagsSet.forEach(tag => {

    const tagObj = tags.find(t => t.name === tag);

    const div = document.createElement("div");
    div.className = `tag-badge ${currentTag === tag ? 'active' : ''}`;
    
    let style = "";
    if (tagObj && tagObj.color) {
      style += `color:${tagObj.color};`;
      if (currentTag === tag) {
        style += `background-color:${tagObj.color}20;`;
        div.setAttribute("data-color", tagObj.color);
        div.style.setProperty("--data-color", tagObj.color);
        div.style.setProperty("--data-bg-color", `${tagObj.color}20`);
      }
    } else if (currentTag === tag) { // Default active
        div.style.setProperty("--data-color", "var(--accent)");
        div.style.setProperty("--data-bg-color", "rgba(124, 58, 237, 0.2)");
    }
    div.style = style;

    const iconHtml = (tagObj && tagObj.icon) ? `<i class="${tagObj.icon}"></i>` : '';

    div.innerHTML = `
      <span onclick="setTag('${tag}')">${iconHtml} ${escapeHtml(tag)}</span>
      <div style="display:flex; gap: 4px;">
        ${tagObj ? `<button class="btn-sidebar-edit" onclick="event.stopPropagation(); openEditModal('tag', ${tagObj.id})">⚙️</button>` : ''}
        ${tagObj ? `<button class="btn-sidebar-delete" onclick="event.stopPropagation(); deleteTag(${tagObj.id})">-</button>` : ''}
      </div>
    `;
    list.appendChild(div);

  });

}

async function addTag() {

  openEditModal('tag', null, ''); // Open modal for new tag

}

async function deleteTag(id) {

  if (!confirm("Are you sure you want to delete this tag?")) return;

  try {

    const res = await fetch(`${API}/tags/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error("Failed to delete tag");

    await load();

  } catch (err) {
    console.error(err);
  }

}

function setTag(tag) {

  currentTag = (currentTag === tag) ? null : tag;
  currentCollectionId = null;
  renderTags();
  renderCollections();
  renderItems();

}

async function addCollection() {

  openEditModal('collection', null, ''); // Open modal for new collection

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

  if (currentCollectionId) {
    filtered = filtered.filter(item => item.collection_id === currentCollectionId);
  }

  if (currentTag) {
    filtered = filtered.filter(item => (item.tags || "").split(",").map(t => t.trim()).includes(currentTag));
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
      <div class="card-delete-x" onclick="event.stopPropagation(); deleteItem(${item.id})">✕</div>
      ${thumb}
      <div class="card-body">

        <div class="card-meta">
          <div class="domain">${escapeHtml(hostname)}</div>
          <div class="type-badge">${type}</div>
        </div>

        <h3 class="card-title">${escapeHtml(item.title)}</h3>

        <p class="card-desc">${escapeHtml(item.description)}</p>

        <div class="card-tags">
          ${(item.tags || "").split(",").filter(t => t.trim()).map(t => `<span class="tag-badge-small">${escapeHtml(t.trim())}</span>`).join("")}
        </div>

      </div>
      <div class="card-edit-btn" onclick="event.stopPropagation(); editItem(${item.id})">Edit Tags</div>
    `;

    card.onclick = () => openReader(item.id);

    grid.appendChild(card);

  });

}

function setFilter(filter, el) {

  currentFilter = filter;
  currentCollectionId = null;
  currentTag = null;

  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
  document.querySelectorAll(".collection-item").forEach(n => n.classList.remove("active"));
  document.querySelectorAll(".tag-badge").forEach(n => n.classList.remove("active"));

  if (el) el.classList.add("active");

  renderItems();
  renderCollections();
  renderTags();
}

async function deleteItem(id) {

  if (!confirm("Are you sure you want to delete this item?")) return;

  try {

    const res = await fetch(`${API}/items/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error("Delete failed");

    await load();

  } catch (err) {

    console.error(err);

  }
}

async function editItem(id) {

  const item = allItems.find(i => i.id === id);

  if (!item) return;

  const newTags = prompt("Enter tags (comma separated):", item.tags || "");

  if (newTags === null) return;

  let colId = item.collection_id;

  if (collections.length > 0) {

    const colList = collections.map(c => `${c.id}: ${c.name}`).join("\n");
    const choice = prompt(`Assign to collection (enter ID, or 0 for none):\n${colList}`, item.collection_id || 0);

    if (choice !== null) colId = parseInt(choice);

  }

  try {

    const res = await fetch(`${API}/items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tags: newTags, collection_id: colId })
    });

    if (!res.ok) throw new Error("Update failed");

    await load();

  } catch (err) {
    console.error(err);
  }

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
  const typeSelect = document.getElementById("itemType");

  if (!input.files.length) {
    typeSelect.value = "article";
    return;
  }

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
    typeSelect.value = "article";

    await load();

  } catch (err) {

    console.error(err);
    typeSelect.value = "article";

  }
}

async function openReader(id) {

  const overlay = document.getElementById("readerOverlay");
  const title = document.getElementById("readerTitle");
  const body = document.getElementById("readerBody");
  const link = document.getElementById("readerOriginalLink");

  body.innerHTML = "Loading...";
  overlay.classList.add("show");
  document.body.style.overflow = "hidden"; // Prevent scrolling behind overlay

  try {

    const res = await fetch(`${API}/items/${id}`);

    if (!res.ok) throw new Error("Could not load item details");

    const item = await res.json();

    title.textContent = item.title;
    link.href = item.url;

    const type = (item.item_type || "article").toLowerCase();

    if (type === "youtube") {

      const videoId = detectItemType(item.url) === "youtube" ? extractYoutubeId(item.url) : "";

      if (videoId) {
        body.innerHTML = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%;background:#000;border-radius:12px">
          <iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"
            src="https://www.youtube.com/embed/${videoId}"
            allowfullscreen></iframe>
        </div>`;
      } else {
        body.innerHTML = "Cannot embed this video.";
      }

    } else if (type === "image") {

      body.innerHTML = `<img src="${item.url}" style="max-width:100%;height:auto;border-radius:12px;display:block;margin:0 auto">`;

    } else if (item.content) {

      body.innerHTML = item.content;

    } else {

      body.innerHTML = `
        <div style="text-align:center;padding:40px;background:#f9f9f9;border-radius:12px">
          <p>No clean version available.</p>
          <a href="${item.url}" target="_blank" style="color:var(--accent);font-weight:600">Open Original Website</a>
        </div>
      `;

    }

    // After loading content, handle image clicks for lightbox
    const images = body.querySelectorAll("img");
    articleImages = Array.from(images).map(img => img.src);
    images.forEach((img, index) => {
      img.onclick = (e) => {
        e.stopPropagation();
        openLightbox(index);
      };
    });

  } catch (err) {

    console.error(err);

    body.innerHTML = "Failed to load content.";

  }

}

function closeReader() {

  const overlay = document.getElementById("readerOverlay");

  overlay.classList.remove("show");
  document.body.style.overflow = "";

}

function openLightbox(index) {

  currentImageIndex = index;

  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImg");
  const prevBtn = lightbox.querySelector(".prev");
  const nextBtn = lightbox.querySelector(".next");

  img.src = articleImages[currentImageIndex];
  lightbox.classList.add("show");

  // Only show nav if there's more than one image
  const multi = articleImages.length > 1;
  prevBtn.style.display = multi ? "flex" : "none";
  nextBtn.style.display = multi ? "flex" : "none";

}

function closeLightbox() {

  const lightbox = document.getElementById("lightbox");

  lightbox.classList.remove("show");

}

function nextImage() {

  if (articleImages.length <= 1) return;

  currentImageIndex = (currentImageIndex + 1) % articleImages.length;
  document.getElementById("lightboxImg").src = articleImages[currentImageIndex];

}

function prevImage() {

  if (articleImages.length <= 1) return;

  currentImageIndex = (currentImageIndex - 1 + articleImages.length) % articleImages.length;
  document.getElementById("lightboxImg").src = articleImages[currentImageIndex];

}

// Add Keyboard Support
document.addEventListener("keydown", (e) => {

  const lightbox = document.getElementById("lightbox");

  if (!lightbox.classList.contains("show")) return;

  if (e.key === "ArrowRight") nextImage();
  if (e.key === "ArrowLeft") prevImage();
  if (e.key === "Escape") closeLightbox();

});

// Helper to get YouTube ID on frontend
function extractYoutubeId(url) {

  try {

    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) return parsed.pathname.slice(1);

    if (parsed.hostname.includes("youtube.com")) {

      if (parsed.pathname === "/watch") return parsed.searchParams.get("v");

      if (parsed.pathname.startsWith("/shorts/")) return parsed.pathname.split("/")[2];

      if (parsed.pathname.startsWith("/embed/")) return parsed.pathname.split("/")[2];

    }

  } catch (e) {
    return null;
  }

  return null;

}

document.addEventListener("DOMContentLoaded", () => {

  const input = document.getElementById("urlInput");

  load();

  input.addEventListener("keydown", e => {

    if (e.key === "Enter") addItem();

  });

});

function openEditModal(type, id, name = null) {
  const modal = document.getElementById("editModal");
  const title = document.getElementById("editModalTitle");
  const idInput = document.getElementById("editModalId");
  const typeInput = document.getElementById("editModalType");
  const nameInput = document.getElementById("editModalName");
  const colorInput = document.getElementById("editModalColor");
  const iconInput = document.getElementById("editModalIcon");

  typeInput.value = type;
  idInput.value = id || "";
  title.textContent = id ? `Edit ${type}` : `New ${type}`;

  if (id) {
    const list = type === 'collection' ? collections : tags;
    const item = list.find(x => x.id === id);
    if (item) {
      nameInput.value = item.name || "";
      colorInput.value = item.color || "#000000";
      iconInput.value = item.icon || "";
    }
  } else {
    nameInput.value = name || "";
    colorInput.value = "#7c3aed";
    iconInput.value = type === 'collection' ? "fas fa-folder" : "fas fa-tag";
  }

  modal.classList.add("show");
  filterIcons();
}

function closeEditModal() {
  document.getElementById("editModal").classList.remove("show");
}

async function saveEditModal() {
  const type = document.getElementById("editModalType").value;
  const id = document.getElementById("editModalId").value;
  const name = document.getElementById("editModalName").value.trim();
  const color = document.getElementById("editModalColor").value;
  const icon = document.getElementById("editModalIcon").value.trim();

  if (!name) return alert("Name is required");

  const method = id ? "PATCH" : "POST";
  const url = id ? `${API}/${type}s/${id}` : `${API}/${type}s`;

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, color, icon })
    });

    if (!res.ok) throw new Error("Save failed");

    closeEditModal();
    await load();

  } catch (err) {
    console.error(err);
    alert("Error saving " + type);
  }
}

function filterIcons() {
  const query = document.getElementById("iconSearchInput").value.toLowerCase();
  const results = document.getElementById("iconSearchResults");
  results.innerHTML = "";

  const filtered = faIcons.filter(icon => icon.toLowerCase().includes(query)).slice(0, 20);

  filtered.forEach(icon => {
    const div = document.createElement("div");
    div.className = "icon-item";
    div.innerHTML = `<i class="${icon}"></i>`;
    div.title = icon;
    div.onclick = () => selectIcon(icon);
    results.appendChild(div);
  });
}

function selectIcon(iconClass) {
  document.getElementById("editModalIcon").value = iconClass;
}