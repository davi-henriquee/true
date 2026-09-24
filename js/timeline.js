const timelineStorageKey = "study-of-truth-timeline-v1";
const defaultTimelineColor = "#FF3D4D";

const defaultTimelineState = {
  people: [],
  groups: [],
  selectedIds: [],
};

let timelineState = loadTimelineState();
let timelinePendingPhoto = "";
let draggedTimelinePersonId = null;
let timelineToastTimer = null;

const timelineElements = {
  selectedCount: document.getElementById("selectedCount"),
  directory: document.getElementById("timelineDirectory"),
  timelineBoard: document.getElementById("timelineBoard"),
  timelineViewport: document.getElementById("timelineViewport"),
  timelineSummary: document.getElementById("timelineSummary"),
  addPerson: document.getElementById("addTimelinePerson"),
  addGroup: document.getElementById("addTimelineGroup"),
  personModal: document.getElementById("timelinePersonModal"),
  personModalTitle: document.getElementById("timelinePersonTitle"),
  personForm: document.getElementById("timelinePersonForm"),
  personId: document.getElementById("timelinePersonId"),
  personPhoto: document.getElementById("timelinePersonPhoto"),
  photoPreview: document.getElementById("timelinePhotoPreview"),
  personName: document.getElementById("timelinePersonName"),
  birth: document.getElementById("timelineBirth"),
  death: document.getElementById("timelineDeath"),
  personGroup: document.getElementById("timelinePersonGroup"),
  colorPicker: document.getElementById("timelineColorPicker"),
  colorHex: document.getElementById("timelineColorHex"),
  clearColor: document.getElementById("clearTimelineColor"),
  closePerson: document.getElementById("closeTimelinePerson"),
  cancelPerson: document.getElementById("cancelTimelinePerson"),
  groupModal: document.getElementById("timelineGroupModal"),
  groupModalTitle: document.getElementById("timelineGroupTitle"),
  groupForm: document.getElementById("timelineGroupForm"),
  groupId: document.getElementById("timelineGroupId"),
  groupName: document.getElementById("timelineGroupName"),
  groupPicker: document.getElementById("timelineGroupPicker"),
  groupHex: document.getElementById("timelineGroupHex"),
  closeGroup: document.getElementById("closeTimelineGroup"),
  cancelGroup: document.getElementById("cancelTimelineGroup"),
  toast: document.getElementById("timelineToast"),
};

function loadTimelineState() {
  try {
    const saved = JSON.parse(localStorage.getItem(timelineStorageKey));
    if (!saved || !Array.isArray(saved.people) || !Array.isArray(saved.groups)) {
      return JSON.parse(JSON.stringify(defaultTimelineState));
    }
    const personIds = new Set(
      saved.people.filter(hasCompleteTimelineDates).map((person) => person.id),
    );
    return {
      people: saved.people,
      groups: saved.groups,
      selectedIds: Array.isArray(saved.selectedIds)
        ? saved.selectedIds.filter((id) => personIds.has(id)).slice(0, 10)
        : [],
    };
  } catch {
    return JSON.parse(JSON.stringify(defaultTimelineState));
  }
}

function saveTimelineState() {
  localStorage.setItem(timelineStorageKey, JSON.stringify(timelineState));
}

function makeTimelineId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function isHexColor(value) {
  return /^#[0-9a-f]{6}$/i.test(String(value || ""));
}

function normalizedColor(value, fallback = defaultTimelineColor) {
  return isHexColor(value) ? value.toUpperCase() : fallback;
}

function getTimelineGroup(groupId) {
  return timelineState.groups.find((group) => group.id === groupId) || null;
}

function getTimelinePerson(personId) {
  return timelineState.people.find((person) => person.id === personId) || null;
}

function getPersonColor(person) {
  const group = getTimelineGroup(person.groupId);
  return normalizedColor(group?.color || person.color || defaultTimelineColor);
}

function initials(name) {
  const parts = String(name || "P").trim().split(/\s+/).filter(Boolean);
  return (parts.slice(0, 2).map((part) => part[0]).join("") || "P").toUpperCase();
}

function formatYear(year) {
  if (year === "" || year === null || year === undefined) return "Data pendente";
  const number = Number(year);
  if (number < 0) return `${Math.abs(number)} a.C.`;
  if (number > 0) return `${number} d.C.`;
  return "ano 0";
}

function hasCompleteTimelineDates(person) {
  if (!person || person.birth === "" || person.death === "") return false;
  const birth = Number(person.birth);
  const death = Number(person.death);
  return Number.isFinite(birth) && Number.isFinite(death) && death >= birth;
}

function avatarMarkup(person, className) {
  return person.image
    ? `<span class="${className}" style="--person-color:${getPersonColor(person)}"><img src="${escapeTimelineHtml(person.image)}" alt="" /></span>`
    : `<span class="${className}" style="--person-color:${getPersonColor(person)}">${escapeTimelineHtml(initials(person.name))}</span>`;
}

function renderDirectoryPerson(person) {
  const checked = timelineState.selectedIds.includes(person.id);
  const hasDates = hasCompleteTimelineDates(person);
  return `
    <article
      class="directory-person"
      draggable="true"
      data-timeline-person="${escapeTimelineHtml(person.id)}"
      style="--person-color:${getPersonColor(person)}"
    >
      <input
        type="checkbox"
        data-person-toggle="${escapeTimelineHtml(person.id)}"
        aria-label="${hasDates ? "Exibir" : "Complete as datas de"} ${escapeTimelineHtml(person.name)} na linha do tempo"
        ${checked ? "checked" : ""}
        ${hasDates ? "" : "disabled"}
      />
      ${avatarMarkup(person, "directory-avatar")}
      <span class="directory-person-copy">
        <strong>${escapeTimelineHtml(person.name)}</strong>
        <span>${hasDates
          ? `${escapeTimelineHtml(formatYear(person.birth))} — ${escapeTimelineHtml(formatYear(person.death))}`
          : "Datas pendentes · clique no lápis"}</span>
      </span>
      <button class="person-edit-button" type="button" data-edit-timeline-person="${escapeTimelineHtml(person.id)}" aria-label="Editar ${escapeTimelineHtml(person.name)}">✎</button>
    </article>
  `;
}

function renderFolder(group, people, isUngrouped = false) {
  const groupId = group?.id || "";
  const color = group?.color || "#AAA6A6";
  const name = group?.name || "Sem grupo";
  const collapsed = Boolean(group?.collapsed);
  return `
    <section
      class="person-folder${collapsed ? " collapsed" : ""}"
      data-drop-group="${escapeTimelineHtml(groupId)}"
      style="--folder-color:${normalizedColor(color, "#AAA6A6")}" 
    >
      <header class="folder-heading">
        <button class="folder-toggle" type="button" data-toggle-group="${escapeTimelineHtml(groupId)}" aria-expanded="${!collapsed}">
          <i class="folder-dot"></i>
          <span class="folder-name">${escapeTimelineHtml(name)}</span>
          <span class="folder-count">${people.length}</span>
        </button>
        ${isUngrouped ? "" : `<button class="folder-edit" type="button" data-edit-group="${escapeTimelineHtml(groupId)}" aria-label="Editar grupo ${escapeTimelineHtml(name)}">✎</button>`}
      </header>
      <div class="folder-people">
        ${people.length
          ? people.map(renderDirectoryPerson).join("")
          : `<div class="folder-drop-hint">Arraste pessoas para esta pasta</div>`}
      </div>
    </section>
  `;
}

function renderTimelineDirectory() {
  if (!timelineState.people.length && !timelineState.groups.length) {
    timelineElements.directory.innerHTML = `
      <div class="directory-empty">
        <strong>Nenhuma pessoa adicionada</strong>
        <p>Crie pessoas e grupos para começar sua comparação histórica.</p>
      </div>
    `;
    return;
  }

  const fragments = timelineState.groups.map((group) => {
    const people = timelineState.people.filter((person) => person.groupId === group.id);
    return renderFolder(group, people);
  });
  const ungrouped = timelineState.people.filter(
    (person) => !person.groupId || !getTimelineGroup(person.groupId),
  );
  if (ungrouped.length || !timelineState.groups.length) {
    fragments.push(renderFolder(null, ungrouped, true));
  }
  timelineElements.directory.innerHTML = fragments.join("");
}

function niceTimelineRange(people) {
  const magnitude = Math.max(
    100,
    ...people.flatMap((person) => [Math.abs(Number(person.birth)), Math.abs(Number(person.death))]),
  );
  const step = magnitude > 3000 ? 1000 : magnitude > 1000 ? 500 : magnitude > 300 ? 100 : 50;
  return Math.ceil(magnitude / step) * step;
}

function positionForYear(year, range) {
  return ((Number(year) + range) / (range * 2)) * 100;
}

function renderTimeline() {
  const selectedPeople = timelineState.selectedIds
    .map((id) => getTimelinePerson(id))
    .filter(hasCompleteTimelineDates)
    .slice(0, 10);
  timelineElements.selectedCount.textContent = String(selectedPeople.length);

  if (!selectedPeople.length) {
    timelineElements.timelineSummary.textContent = "Adicione pessoas no menu e marque as caixas para compará-las.";
    timelineElements.timelineBoard.innerHTML = `
      <div class="timeline-empty">
        <div class="timeline-empty-inner">
          <div class="empty-cross">†</div>
          <strong>Cristo é o centro.</strong>
          <p>Selecione uma ou mais pessoas no menu à esquerda para posicioná-las ao redor do ano 0.</p>
        </div>
      </div>
    `;
    return;
  }

  const range = niceTimelineRange(selectedPeople);
  const ticks = [-range, -range / 2, 0, range / 2, range];
  timelineElements.timelineSummary.textContent = `${selectedPeople.length} ${selectedPeople.length === 1 ? "vida selecionada" : "vidas selecionadas"}. A cor do grupo prevalece sobre a cor individual.`;

  const axis = `
    <div class="timeline-axis">
      <div class="axis-line">
        ${ticks.map((tick, index) => `
          <i class="axis-tick" style="left:${index * 25}%">
            <span>${escapeTimelineHtml(formatYear(tick))}</span>
          </i>
        `).join("")}
      </div>
      <div class="christ-marker">
        <span class="christ-cross">†</span>
        <strong>CRISTO · ANO 0</strong>
      </div>
    </div>
  `;

  const rows = selectedPeople.map((person) => {
    const start = positionForYear(person.birth, range);
    const end = positionForYear(person.death, range);
    const width = Math.max(0, end - start);
    const color = getPersonColor(person);
    return `
      <article class="life-row" style="--person-color:${color}">
        <div class="life-person">
          ${avatarMarkup(person, "life-avatar")}
          <span>
            <strong>${escapeTimelineHtml(person.name)}</strong>
            <span>${escapeTimelineHtml(formatYear(person.birth))} — ${escapeTimelineHtml(formatYear(person.death))}</span>
          </span>
        </div>
        <div class="life-track">
          <i class="zero-guide" aria-hidden="true"></i>
          <span class="life-bar" style="--life-left:${start.toFixed(3)}%;--life-width:${width.toFixed(3)}%">
            ${Math.abs(Number(person.death) - Number(person.birth))} anos
          </span>
        </div>
      </article>
    `;
  }).join("");

  timelineElements.timelineBoard.innerHTML = `${axis}<div class="timeline-rows">${rows}</div>`;
  window.requestAnimationFrame(() => {
    const marker = timelineElements.timelineBoard.querySelector(".christ-marker");
    const axisElement = marker?.offsetParent;
    if (!marker || !axisElement) return;
    const markerCenter = axisElement.offsetLeft + marker.offsetLeft;
    timelineElements.timelineViewport.scrollLeft = Math.max(
      0,
      markerCenter - timelineElements.timelineViewport.clientWidth / 2,
    );
  });
}

function renderGroupOptions(selectedGroupId = "") {
  timelineElements.personGroup.innerHTML = `
    <option value="">Sem grupo</option>
    ${timelineState.groups.map((group) => `<option value="${escapeTimelineHtml(group.id)}">${escapeTimelineHtml(group.name)}</option>`).join("")}
  `;
  timelineElements.personGroup.value = selectedGroupId || "";
}

function setTimelinePhotoPreview(image, name) {
  timelineElements.photoPreview.innerHTML = image
    ? `<img src="${escapeTimelineHtml(image)}" alt="" />`
    : escapeTimelineHtml(initials(name));
}

function openTimelinePersonModal(personId = "") {
  const person = personId ? getTimelinePerson(personId) : null;
  timelinePendingPhoto = person?.image || "";
  timelineElements.personId.value = person?.id || "";
  timelineElements.personName.value = person?.name || "";
  timelineElements.birth.value = person?.birth ?? "";
  timelineElements.death.value = person?.death ?? "";
  timelineElements.colorHex.value = person?.color || "";
  timelineElements.colorPicker.value = normalizedColor(person?.color || defaultTimelineColor).toLowerCase();
  timelineElements.personPhoto.value = "";
  renderGroupOptions(person?.groupId || "");
  setTimelinePhotoPreview(timelinePendingPhoto, person?.name || "Pessoa");
  timelineElements.personModalTitle.textContent = person ? "Editar pessoa" : "Adicionar pessoa";
  timelineElements.personModal.hidden = false;
  window.setTimeout(() => timelineElements.personName.focus(), 0);
}

function closeTimelinePersonModal() {
  timelineElements.personModal.hidden = true;
  timelinePendingPhoto = "";
}

function openTimelineGroupModal(groupId = "") {
  const group = groupId ? getTimelineGroup(groupId) : null;
  const color = normalizedColor(group?.color || defaultTimelineColor);
  timelineElements.groupId.value = group?.id || "";
  timelineElements.groupName.value = group?.name || "";
  timelineElements.groupPicker.value = color.toLowerCase();
  timelineElements.groupHex.value = color;
  timelineElements.groupModalTitle.textContent = group ? "Editar grupo" : "Adicionar grupo";
  timelineElements.groupModal.hidden = false;
  window.setTimeout(() => timelineElements.groupName.focus(), 0);
}

function closeTimelineGroupModal() {
  timelineElements.groupModal.hidden = true;
}

async function timelineImageToDataUrl(file) {
  if (!file) return "";
  if (file.size > 12 * 1024 * 1024) throw new Error("A imagem deve ter no máximo 12 MB.");
  const source = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = source;
  });
  const size = Math.min(image.naturalWidth, image.naturalHeight);
  const canvas = document.createElement("canvas");
  canvas.width = 520;
  canvas.height = 520;
  const context = canvas.getContext("2d");
  context.drawImage(
    image,
    (image.naturalWidth - size) / 2,
    (image.naturalHeight - size) / 2,
    size,
    size,
    0,
    0,
    520,
    520,
  );
  return canvas.toDataURL("image/jpeg", 0.82);
}

function showTimelineToast(message) {
  timelineElements.toast.textContent = message;
  timelineElements.toast.classList.add("visible");
  clearTimeout(timelineToastTimer);
  timelineToastTimer = setTimeout(() => timelineElements.toast.classList.remove("visible"), 2500);
}

function escapeTimelineHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

timelineElements.addPerson.addEventListener("click", () => openTimelinePersonModal());
timelineElements.addGroup.addEventListener("click", () => openTimelineGroupModal());

timelineElements.directory.addEventListener("change", (event) => {
  const checkbox = event.target.closest("[data-person-toggle]");
  if (!checkbox) return;
  const personId = checkbox.dataset.personToggle;
  const selected = new Set(timelineState.selectedIds);
  if (checkbox.checked) {
    if (selected.size >= 10) {
      checkbox.checked = false;
      showTimelineToast("Você pode comparar no máximo 10 pessoas.");
      return;
    }
    selected.add(personId);
  } else {
    selected.delete(personId);
  }
  timelineState.selectedIds = [...selected];
  saveTimelineState();
  renderTimelineDirectory();
  renderTimeline();
});

timelineElements.directory.addEventListener("click", (event) => {
  const editPerson = event.target.closest("[data-edit-timeline-person]");
  if (editPerson) {
    openTimelinePersonModal(editPerson.dataset.editTimelinePerson);
    return;
  }
  const editGroup = event.target.closest("[data-edit-group]");
  if (editGroup) {
    openTimelineGroupModal(editGroup.dataset.editGroup);
    return;
  }
  const toggle = event.target.closest("[data-toggle-group]");
  if (toggle) {
    const group = getTimelineGroup(toggle.dataset.toggleGroup);
    if (!group) return;
    group.collapsed = !group.collapsed;
    saveTimelineState();
    renderTimelineDirectory();
  }
});

timelineElements.directory.addEventListener("dragstart", (event) => {
  const person = event.target.closest("[data-timeline-person]");
  if (!person || event.target.matches('input[type="checkbox"]')) {
    event.preventDefault();
    return;
  }
  draggedTimelinePersonId = person.dataset.timelinePerson;
  person.classList.add("dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", draggedTimelinePersonId);
});

timelineElements.directory.addEventListener("dragover", (event) => {
  const folder = event.target.closest("[data-drop-group]");
  if (!folder) return;
  event.preventDefault();
  timelineElements.directory.querySelectorAll(".person-folder").forEach((item) => {
    item.classList.toggle("drop-target", item === folder);
  });
});

timelineElements.directory.addEventListener("drop", (event) => {
  const folder = event.target.closest("[data-drop-group]");
  if (!folder) return;
  event.preventDefault();
  const personId = draggedTimelinePersonId || event.dataTransfer.getData("text/plain");
  const person = getTimelinePerson(personId);
  if (!person) return;
  person.groupId = folder.dataset.dropGroup || "";
  saveTimelineState();
  renderTimelineDirectory();
  renderTimeline();
  showTimelineToast(person.groupId ? "Pessoa movida para o grupo." : "Pessoa removida do grupo.");
});

timelineElements.directory.addEventListener("dragend", () => {
  draggedTimelinePersonId = null;
  timelineElements.directory.querySelectorAll(".dragging, .drop-target").forEach((item) => {
    item.classList.remove("dragging", "drop-target");
  });
});

timelineElements.personPhoto.addEventListener("change", async () => {
  try {
    const file = timelineElements.personPhoto.files?.[0];
    if (!file) return;
    timelinePendingPhoto = await timelineImageToDataUrl(file);
    setTimelinePhotoPreview(timelinePendingPhoto, timelineElements.personName.value);
  } catch (error) {
    timelineElements.personPhoto.value = "";
    showTimelineToast(error.message || "Não foi possível carregar esta imagem.");
  }
});

timelineElements.personName.addEventListener("input", () => {
  if (!timelinePendingPhoto) setTimelinePhotoPreview("", timelineElements.personName.value);
});

timelineElements.colorPicker.addEventListener("input", () => {
  timelineElements.colorHex.value = timelineElements.colorPicker.value.toUpperCase();
});
timelineElements.colorHex.addEventListener("input", () => {
  if (isHexColor(timelineElements.colorHex.value)) {
    timelineElements.colorPicker.value = timelineElements.colorHex.value.toLowerCase();
  }
});
timelineElements.clearColor.addEventListener("click", () => {
  timelineElements.colorHex.value = "";
});

timelineElements.personForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = timelineElements.personName.value.trim();
  const birth = Number(timelineElements.birth.value);
  const death = Number(timelineElements.death.value);
  const color = timelineElements.colorHex.value.trim().toUpperCase();

  if (!name || !Number.isFinite(birth) || !Number.isFinite(death)) return;
  if (death < birth) {
    showTimelineToast("O falecimento não pode ser anterior ao nascimento.");
    timelineElements.death.focus();
    return;
  }
  if (color && !isHexColor(color)) {
    showTimelineToast("Digite uma cor hexadecimal no formato #FF3D4D.");
    timelineElements.colorHex.focus();
    return;
  }

  const values = {
    name,
    birth: Math.trunc(birth),
    death: Math.trunc(death),
    groupId: timelineElements.personGroup.value,
    color,
    image: timelinePendingPhoto,
  };
  const personId = timelineElements.personId.value;
  if (personId) {
    Object.assign(getTimelinePerson(personId), values);
    showTimelineToast("Pessoa atualizada.");
  } else {
    timelineState.people.push({ id: makeTimelineId("timeline-person"), ...values });
    showTimelineToast("Pessoa adicionada.");
  }
  saveTimelineState();
  renderTimelineDirectory();
  renderTimeline();
  closeTimelinePersonModal();
});

timelineElements.groupPicker.addEventListener("input", () => {
  timelineElements.groupHex.value = timelineElements.groupPicker.value.toUpperCase();
});
timelineElements.groupHex.addEventListener("input", () => {
  if (isHexColor(timelineElements.groupHex.value)) {
    timelineElements.groupPicker.value = timelineElements.groupHex.value.toLowerCase();
  }
});

timelineElements.groupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = timelineElements.groupName.value.trim();
  const color = timelineElements.groupHex.value.trim().toUpperCase();
  if (!name) return;
  if (!isHexColor(color)) {
    showTimelineToast("Digite uma cor hexadecimal válida para o grupo.");
    timelineElements.groupHex.focus();
    return;
  }
  const groupId = timelineElements.groupId.value;
  if (groupId) {
    const group = getTimelineGroup(groupId);
    if (group) Object.assign(group, { name, color });
    showTimelineToast("Grupo atualizado.");
  } else {
    timelineState.groups.push({ id: makeTimelineId("timeline-group"), name, color, collapsed: false });
    showTimelineToast("Grupo adicionado.");
  }
  saveTimelineState();
  renderTimelineDirectory();
  renderTimeline();
  closeTimelineGroupModal();
});

timelineElements.closePerson.addEventListener("click", closeTimelinePersonModal);
timelineElements.cancelPerson.addEventListener("click", closeTimelinePersonModal);
timelineElements.closeGroup.addEventListener("click", closeTimelineGroupModal);
timelineElements.cancelGroup.addEventListener("click", closeTimelineGroupModal);
timelineElements.personModal.addEventListener("click", (event) => {
  if (event.target === timelineElements.personModal) closeTimelinePersonModal();
});
timelineElements.groupModal.addEventListener("click", (event) => {
  if (event.target === timelineElements.groupModal) closeTimelineGroupModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!timelineElements.personModal.hidden) closeTimelinePersonModal();
  if (!timelineElements.groupModal.hidden) closeTimelineGroupModal();
});

renderTimelineDirectory();
renderTimeline();
