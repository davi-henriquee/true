const genealogyStorageKey = "study-of-truth-genealogy-v1";
const genealogyTimelineStorageKey = "study-of-truth-timeline-v1";
const enoquePhotoMigrationKey = "study-of-truth-remove-enoque-photo-v1";
const enoquePersonId = "person-1790280571489-2fg6btj";

const defaultGenealogyState = {
  rootId: "root-person",
  people: [
    {
      id: "root-person",
      name: "Pessoa inicial",
      notes: "",
      image: "",
      gender: "male",
    },
  ],
  families: [],
};

let genealogyState = loadGenealogyState();
let selectedPersonId = null;
let pendingRelation = null;
let pendingPhoto = "";
let treeZoom = 1;
let genealogyToastTimer = null;

const genealogyElements = {
  personCount: document.getElementById("personCount"),
  treeBoard: document.getElementById("treeBoard"),
  treeViewport: document.getElementById("treeViewport"),
  zoomOut: document.getElementById("zoomOut"),
  zoomIn: document.getElementById("zoomIn"),
  zoomReset: document.getElementById("zoomReset"),
  personModal: document.getElementById("personModal"),
  personModalKicker: document.getElementById("personModalKicker"),
  personModalTitle: document.getElementById("personModalTitle"),
  personForm: document.getElementById("personForm"),
  personId: document.getElementById("personId"),
  personPhoto: document.getElementById("personPhoto"),
  personPhotoPreview: document.getElementById("personPhotoPreview"),
  personName: document.getElementById("personName"),
  personGender: document.getElementById("personGender"),
  personNotes: document.getElementById("personNotes"),
  childFamilyChoice: document.getElementById("childFamilyChoice"),
  childFamilyChoiceLabel: document.getElementById("childFamilyChoiceLabel"),
  childFamilySelect: document.getElementById("childFamilySelect"),
  timelineImportOption: document.getElementById("timelineImportOption"),
  importToTimeline: document.getElementById("importToTimeline"),
  closePersonModal: document.getElementById("closePersonModal"),
  cancelPersonEdit: document.getElementById("cancelPersonEdit"),
  deletePerson: document.getElementById("deleteGenealogyPerson"),
  resetTreeButton: document.getElementById("resetTreeButton"),
  resetTreeModal: document.getElementById("resetTreeModal"),
  cancelResetTree: document.getElementById("cancelResetTree"),
  confirmResetTree: document.getElementById("confirmResetTree"),
  toast: document.getElementById("genealogyToast"),
};

function cloneDefaultGenealogy() {
  return JSON.parse(JSON.stringify(defaultGenealogyState));
}

function loadGenealogyState() {
  try {
    const saved = JSON.parse(localStorage.getItem(genealogyStorageKey));
    if (!saved || !Array.isArray(saved.people) || !Array.isArray(saved.families)) {
      return cloneDefaultGenealogy();
    }
    const rootExists = saved.people.some((person) => person.id === saved.rootId);
    if (!rootExists) return cloneDefaultGenealogy();

    const shouldRemoveEnoquePhoto = localStorage.getItem(enoquePhotoMigrationKey) !== "done";
    let enoqueFound = false;
    const people = saved.people.map((person) => {
      const isPrimary = saved.families.some((family) => family.person1Id === person.id);
      const isSpouse = saved.families.some((family) => family.person2Id === person.id);
      const gender = person.gender === "male" || person.gender === "female"
        ? person.gender
        : isSpouse && !isPrimary
          ? "female"
          : isPrimary || person.id === saved.rootId
            ? "male"
            : "";
      if (person.id === enoquePersonId) enoqueFound = true;
      return {
        ...person,
        gender,
        image: shouldRemoveEnoquePhoto && person.id === enoquePersonId ? "" : person.image,
      };
    });
    const normalizedState = { ...saved, people };
    if (shouldRemoveEnoquePhoto && enoqueFound) {
      localStorage.setItem(genealogyStorageKey, JSON.stringify(normalizedState));
      localStorage.setItem(enoquePhotoMigrationKey, "done");
    }
    return normalizedState;
  } catch {
    return cloneDefaultGenealogy();
  }
}

function saveGenealogyState() {
  localStorage.setItem(genealogyStorageKey, JSON.stringify(genealogyState));
}

function importPersonToTimeline(person) {
  try {
    const saved = JSON.parse(localStorage.getItem(genealogyTimelineStorageKey));
    const timelineState = saved
      && Array.isArray(saved.people)
      && Array.isArray(saved.groups)
      && Array.isArray(saved.selectedIds)
      ? saved
      : { people: [], groups: [], selectedIds: [] };

    if (timelineState.people.some((item) => item.sourceGenealogyId === person.id)) {
      return true;
    }

    timelineState.people.push({
      id: makeId("timeline-person"),
      sourceGenealogyId: person.id,
      name: person.name,
      image: person.image,
      birth: "",
      death: "",
      groupId: "",
      color: "",
    });
    localStorage.setItem(genealogyTimelineStorageKey, JSON.stringify(timelineState));
    return true;
  } catch {
    return false;
  }
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getPerson(personId) {
  return genealogyState.people.find((person) => person.id === personId) || null;
}

function getFamilyForPerson(personId) {
  return getFamiliesForPerson(personId)[0] || null;
}

function getFamiliesForPerson(personId) {
  return genealogyState.families.filter(
    (family) => family.person1Id === personId || family.person2Id === personId,
  );
}

function getFamilyById(familyId) {
  return genealogyState.families.find((family) => family.id === familyId) || null;
}

function getOtherSpouse(family, personId) {
  if (!family) return null;
  const spouseId = family.person1Id === personId ? family.person2Id : family.person1Id;
  return spouseId ? getPerson(spouseId) : null;
}

function initials(name) {
  const parts = String(name || "P").trim().split(/\s+/).filter(Boolean);
  return (parts.slice(0, 2).map((part) => part[0]).join("") || "P").toUpperCase();
}

function personPortrait(person) {
  return person.image
    ? `<img src="${escapeHtml(person.image)}" alt="" />`
    : `<span>${escapeHtml(initials(person.name))}</span>`;
}

function ringIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="12" r="5"></circle><circle cx="15" cy="12" r="5"></circle><path d="M8 5h2l1-2"></path></svg>`;
}

function childrenIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="8" r="3"></circle><circle cx="16" cy="8" r="3"></circle><path d="M3 19c.4-3.4 2.1-5 5-5s4.6 1.6 5 5"></path><path d="M12 19c.4-3.4 1.8-5 4.5-5 2.4 0 3.9 1.3 4.5 4"></path></svg>`;
}

function pencilIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 20 4.2-1 10.6-10.6-3.2-3.2L5 15.8 4 20Z"></path><path d="m13.8 7 3.2 3.2"></path></svg>`;
}

function renderPerson(person) {
  const selected = person.id === selectedPersonId;
  return `
    <div class="person-unit${person.gender === "female" ? " female" : ""}${selected ? " selected" : ""}" data-person-unit="${escapeHtml(person.id)}">
      <button
        class="person-card"
        type="button"
        data-person-select="${escapeHtml(person.id)}"
        aria-expanded="${selected}"
        title="${escapeHtml(person.notes || person.name)}"
      >
        <span class="person-portrait">${personPortrait(person)}</span>
        <span class="person-name">${escapeHtml(person.name)}</span>
      </button>
      <div class="person-actions" aria-label="Ações de ${escapeHtml(person.name)}">
        <button class="person-action" type="button" data-tree-action="spouse" data-person-id="${escapeHtml(person.id)}" aria-label="Adicionar cônjuge" title="Adicionar cônjuge">${ringIcon()}</button>
        <button class="person-action" type="button" data-tree-action="child" data-person-id="${escapeHtml(person.id)}" aria-label="Adicionar filho" title="Adicionar filho">${childrenIcon()}</button>
        <button class="person-action" type="button" data-tree-action="edit" data-person-id="${escapeHtml(person.id)}" aria-label="Editar pessoa" title="Editar pessoa">${pencilIcon()}</button>
      </div>
    </div>
  `;
}

function renderChildren(children, visited) {
  if (!children.length) return "";
  return `
    <div class="family-children">
      <div class="children-row${children.length === 1 ? " single" : ""}">
        ${children.map((child) => `<div class="child-branch">${renderFamily(child.id, visited)}</div>`).join("")}
      </div>
    </div>
  `;
}

function renderFamily(personId, visited = new Set()) {
  if (visited.has(personId)) return "";
  visited.add(personId);

  const person = getPerson(personId);
  if (!person) return "";
  const families = genealogyState.families.filter((family) => family.person1Id === personId);
  const spouseFamilies = families.filter((family) => getOtherSpouse(family, personId));
  const soloChildren = families
    .filter((family) => !getOtherSpouse(family, personId))
    .flatMap((family) => family.childrenIds || [])
    .map((childId) => getPerson(childId))
    .filter(Boolean);

  const spousesMarkup = spouseFamilies.length
    ? `
      <div class="spouse-families${spouseFamilies.length > 1 ? " multiple" : ""}">
        ${spouseFamilies.map((family) => {
          const spouse = getOtherSpouse(family, personId);
          const children = (family.childrenIds || [])
            .map((childId) => getPerson(childId))
            .filter(Boolean);
          return `
            <div class="union-branch" data-family-id="${escapeHtml(family.id)}">
              ${renderPerson(spouse)}
              ${renderChildren(children, visited)}
            </div>
          `;
        }).join("")}
      </div>
    `
    : "";

  return `
    <div class="family-tree">
      <div class="family-generation">
        <div class="primary-branch">
          ${renderPerson(person)}
          ${renderChildren(soloChildren, visited)}
        </div>
        ${spousesMarkup}
      </div>
    </div>
  `;
}

function elementCenterWithin(element, ancestor) {
  if (!element || !ancestor) return null;
  let center = element.offsetWidth / 2;
  let current = element;
  while (current && current !== ancestor) {
    center += current.offsetLeft;
    current = current.offsetParent;
  }
  return current === ancestor ? center : null;
}

function immediateBranchPerson(branch) {
  return branch?.querySelector(
    ":scope > .family-tree > .family-generation > .primary-branch > .person-unit",
  ) || null;
}

function positionTreeConnectors() {
  genealogyElements.treeBoard.querySelectorAll(".spouse-families").forEach((container) => {
    const unions = [...container.querySelectorAll(":scope > .union-branch")];
    const lastSpouse = unions.at(-1)?.querySelector(":scope > .person-unit");
    const lineEnd = elementCenterWithin(lastSpouse, container);
    if (lineEnd !== null) {
      container.style.setProperty("--marriage-line-end", `${lineEnd}px`);
    }
  });

  genealogyElements.treeBoard.querySelectorAll(".children-row").forEach((row) => {
    const branches = [...row.children].filter((child) => child.classList.contains("child-branch"));
    branches.forEach((branch) => {
      const person = immediateBranchPerson(branch);
      const connectorX = elementCenterWithin(person, branch);
      if (connectorX !== null) {
        branch.style.setProperty("--child-connector-x", `${connectorX}px`);
      }
    });

    if (branches.length < 2) return;
    const firstCenter = elementCenterWithin(immediateBranchPerson(branches[0]), row);
    const lastCenter = elementCenterWithin(immediateBranchPerson(branches.at(-1)), row);
    if (firstCenter === null || lastCenter === null) return;
    row.style.setProperty("--children-line-left", `${firstCenter}px`);
    row.style.setProperty("--children-line-right", `${Math.max(0, row.offsetWidth - lastCenter)}px`);
  });
}

function renderGenealogy() {
  genealogyElements.personCount.textContent = String(genealogyState.people.length);
  genealogyElements.treeBoard.innerHTML = renderFamily(genealogyState.rootId);
  positionTreeConnectors();
  window.requestAnimationFrame(positionTreeConnectors);
  applyTreeZoom();
}

function applyTreeZoom() {
  genealogyElements.treeBoard.style.transform = `scale(${treeZoom})`;
  genealogyElements.zoomReset.textContent = `${Math.round(treeZoom * 100)}%`;
  genealogyElements.zoomOut.disabled = treeZoom <= 0.6;
  genealogyElements.zoomIn.disabled = treeZoom >= 1.4;
}

function changeZoom(delta) {
  treeZoom = Math.min(1.4, Math.max(0.6, Math.round((treeZoom + delta) * 10) / 10));
  applyTreeZoom();
}

function setPhotoPreview(image, name) {
  genealogyElements.personPhotoPreview.innerHTML = image
    ? `<img src="${escapeHtml(image)}" alt="" />`
    : escapeHtml(initials(name));
}

function openPersonEditor(personId = "", relation = null) {
  const person = personId ? getPerson(personId) : null;
  pendingRelation = relation;
  pendingPhoto = person?.image || "";
  genealogyElements.personId.value = person?.id || "";
  genealogyElements.personName.value = person?.name || "";
  const sourcePerson = relation ? getPerson(relation.sourceId) : null;
  const defaultGender = relation?.type === "spouse"
    ? sourcePerson?.gender === "female" ? "male" : "female"
    : "";
  genealogyElements.personGender.value = person?.gender || defaultGender;
  genealogyElements.personNotes.value = person?.notes || "";
  genealogyElements.personPhoto.value = "";
  genealogyElements.importToTimeline.checked = false;
  genealogyElements.timelineImportOption.hidden = Boolean(person);
  genealogyElements.deletePerson.hidden = !person;

  const possibleFamilies = relation?.type === "child"
    ? getFamiliesForPerson(relation.sourceId)
      .filter((family) => getOtherSpouse(family, relation.sourceId))
    : [];
  const needsFamilyChoice = possibleFamilies.length > 1;
  genealogyElements.childFamilyChoice.hidden = !needsFamilyChoice;
  genealogyElements.childFamilySelect.required = needsFamilyChoice;
  genealogyElements.childFamilySelect.innerHTML = needsFamilyChoice
    ? `<option value="">Selecione</option>${possibleFamilies.map((family) => {
      const spouse = getOtherSpouse(family, relation.sourceId);
      return `<option value="${escapeHtml(family.id)}">${escapeHtml(spouse?.name || "Cônjuge")}</option>`;
    }).join("")}`
    : "";
  if (relation?.type === "child") {
    relation.familyId = possibleFamilies.length === 1 ? possibleFamilies[0].id : "";
    genealogyElements.childFamilyChoiceLabel.textContent = sourcePerson?.gender === "male"
      ? "Quem é a mãe?"
      : "Quem é o outro responsável?";
  }

  const relationLabels = {
    spouse: ["Novo vínculo", "Adicionar cônjuge"],
    child: ["Nova geração", "Adicionar filho"],
  };
  const [kicker, title] = relation
    ? relationLabels[relation.type]
    : ["Pessoa", "Editar pessoa"];
  genealogyElements.personModalKicker.textContent = kicker;
  genealogyElements.personModalTitle.textContent = title;
  setPhotoPreview(pendingPhoto, person?.name || "Pessoa");
  genealogyElements.personModal.hidden = false;
  window.setTimeout(() => genealogyElements.personName.focus(), 0);
}

function closePersonEditor() {
  genealogyElements.personModal.hidden = true;
  genealogyElements.childFamilySelect.required = false;
  pendingRelation = null;
  pendingPhoto = "";
}

function attachNewPerson(person, relation) {
  genealogyState.people.push(person);
  if (!relation) return;

  let family = relation.familyId ? getFamilyById(relation.familyId) : null;
  if (relation.type === "spouse") {
    const soloFamily = getFamiliesForPerson(relation.sourceId)
      .find((item) => !getOtherSpouse(item, relation.sourceId));
    if (soloFamily) {
      if (soloFamily.person1Id === relation.sourceId) soloFamily.person2Id = person.id;
      else soloFamily.person1Id = person.id;
    } else {
      family = {
        id: makeId("family"),
        person1Id: relation.sourceId,
        person2Id: person.id,
        childrenIds: [],
      };
      genealogyState.families.push(family);
    }
  }

  if (relation.type === "child") {
    if (!family) {
      const families = getFamiliesForPerson(relation.sourceId);
      family = families.find((item) => !getOtherSpouse(item, relation.sourceId))
        || (families.length === 1 ? families[0] : null);
    }
    if (!family) {
      family = {
        id: makeId("family"),
        person1Id: relation.sourceId,
        person2Id: null,
        childrenIds: [],
      };
      genealogyState.families.push(family);
    }
    family.childrenIds.push(person.id);
  }
}

function collectGenealogyBranch(personId, collected = new Set()) {
  if (!getPerson(personId) || collected.has(personId)) return collected;
  collected.add(personId);

  const families = genealogyState.families.filter((item) => item.person1Id === personId);
  families.forEach((family) => {
    if (family.person2Id) collected.add(family.person2Id);
    (family.childrenIds || []).forEach((childId) => collectGenealogyBranch(childId, collected));
  });
  return collected;
}

function deleteGenealogyPerson(personId) {
  const person = getPerson(personId);
  if (!person) return;

  const ownsFamily = genealogyState.families.some((family) => family.person1Id === personId);
  const isSpouse = !ownsFamily && genealogyState.families.some(
    (family) => family.person2Id === personId && family.person1Id !== personId,
  );
  const removedIds = isSpouse
    ? new Set([personId])
    : collectGenealogyBranch(personId);
  const relatedCount = removedIds.size - 1;
  const confirmation = relatedCount > 0
    ? `Excluir ${person.name} e mais ${relatedCount} ${relatedCount === 1 ? "pessoa vinculada" : "pessoas vinculadas"} deste ramo? Esta ação não pode ser desfeita.`
    : `Excluir ${person.name} da árvore? Esta ação não pode ser desfeita.`;
  if (!window.confirm(confirmation)) return;

  genealogyState.people = genealogyState.people.filter((item) => !removedIds.has(item.id));
  genealogyState.families = genealogyState.families
    .map((family) => ({
      ...family,
      person1Id: removedIds.has(family.person1Id) ? null : family.person1Id,
      person2Id: removedIds.has(family.person2Id) ? null : family.person2Id,
      childrenIds: (family.childrenIds || []).filter((childId) => !removedIds.has(childId)),
    }))
    .filter((family) => family.person1Id || family.person2Id || family.childrenIds.length);

  if (!genealogyState.people.length) {
    genealogyState = cloneDefaultGenealogy();
  } else if (!getPerson(genealogyState.rootId)) {
    genealogyState.rootId = genealogyState.people[0].id;
  }

  selectedPersonId = null;
  saveGenealogyState();
  closePersonEditor();
  renderGenealogy();
  showGenealogyToast(relatedCount > 0 ? "Ramo removido da árvore." : "Pessoa removida da árvore.");
}

async function imageFileToDataUrl(file) {
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
  const sourceX = (image.naturalWidth - size) / 2;
  const sourceY = (image.naturalHeight - size) / 2;
  context.drawImage(image, sourceX, sourceY, size, size, 0, 0, 520, 520);
  return canvas.toDataURL("image/jpeg", 0.82);
}

function showGenealogyToast(message) {
  genealogyElements.toast.textContent = message;
  genealogyElements.toast.classList.add("visible");
  clearTimeout(genealogyToastTimer);
  genealogyToastTimer = setTimeout(() => genealogyElements.toast.classList.remove("visible"), 2400);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

genealogyElements.treeBoard.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-tree-action]");
  if (actionButton) {
    const personId = actionButton.dataset.personId;
    const action = actionButton.dataset.treeAction;
    if (action === "edit") {
      openPersonEditor(personId);
      return;
    }
    openPersonEditor("", { type: action, sourceId: personId });
    return;
  }

  const personButton = event.target.closest("[data-person-select]");
  if (personButton) {
    const personId = personButton.dataset.personSelect;
    selectedPersonId = selectedPersonId === personId ? null : personId;
    renderGenealogy();
  }
});

genealogyElements.personPhoto.addEventListener("change", async () => {
  try {
    const file = genealogyElements.personPhoto.files?.[0];
    if (!file) return;
    pendingPhoto = await imageFileToDataUrl(file);
    setPhotoPreview(pendingPhoto, genealogyElements.personName.value);
  } catch (error) {
    genealogyElements.personPhoto.value = "";
    showGenealogyToast(error.message || "Não foi possível carregar esta imagem.");
  }
});

genealogyElements.personName.addEventListener("input", () => {
  if (!pendingPhoto) setPhotoPreview("", genealogyElements.personName.value);
});

genealogyElements.personForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = genealogyElements.personName.value.trim();
  const gender = genealogyElements.personGender.value;
  if (!name || !gender) return;

  if (pendingRelation?.type === "child" && !genealogyElements.childFamilyChoice.hidden) {
    const familyId = genealogyElements.childFamilySelect.value;
    if (!familyId) {
      showGenealogyToast("Escolha quem é a mãe deste filho.");
      genealogyElements.childFamilySelect.focus();
      return;
    }
    pendingRelation.familyId = familyId;
  }

  const personId = genealogyElements.personId.value;
  const shouldImportToTimeline = !personId && genealogyElements.importToTimeline.checked;
  let feedbackMessage = "";
  if (personId) {
    const person = getPerson(personId);
    if (!person) return;
    person.name = name;
    person.gender = gender;
    person.notes = genealogyElements.personNotes.value.trim();
    person.image = pendingPhoto;
    feedbackMessage = "Pessoa atualizada.";
  } else {
    const person = {
      id: makeId("person"),
      name,
      gender,
      notes: genealogyElements.personNotes.value.trim(),
      image: pendingPhoto,
    };
    attachNewPerson(person, pendingRelation);
    selectedPersonId = person.id;
    feedbackMessage = pendingRelation?.type === "spouse" ? "Cônjuge adicionado." : "Filho adicionado.";
    if (shouldImportToTimeline) {
      feedbackMessage = importPersonToTimeline(person)
        ? `${feedbackMessage} Também foi enviado para a linha do tempo.`
        : `${feedbackMessage} Não foi possível enviar para a linha do tempo.`;
    }
  }

  saveGenealogyState();
  renderGenealogy();
  closePersonEditor();
  showGenealogyToast(feedbackMessage);
});

genealogyElements.zoomOut.addEventListener("click", () => changeZoom(-0.1));
genealogyElements.zoomIn.addEventListener("click", () => changeZoom(0.1));
genealogyElements.zoomReset.addEventListener("click", () => {
  treeZoom = 1;
  applyTreeZoom();
});

genealogyElements.closePersonModal.addEventListener("click", closePersonEditor);
genealogyElements.cancelPersonEdit.addEventListener("click", closePersonEditor);
genealogyElements.deletePerson.addEventListener("click", () => {
  deleteGenealogyPerson(genealogyElements.personId.value);
});
genealogyElements.personModal.addEventListener("click", (event) => {
  if (event.target === genealogyElements.personModal) closePersonEditor();
});

genealogyElements.resetTreeButton.addEventListener("click", () => {
  genealogyElements.resetTreeModal.hidden = false;
});
genealogyElements.cancelResetTree.addEventListener("click", () => {
  genealogyElements.resetTreeModal.hidden = true;
});
genealogyElements.confirmResetTree.addEventListener("click", () => {
  genealogyState = cloneDefaultGenealogy();
  selectedPersonId = null;
  saveGenealogyState();
  renderGenealogy();
  genealogyElements.resetTreeModal.hidden = true;
  showGenealogyToast("A árvore foi reiniciada.");
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!genealogyElements.personModal.hidden) closePersonEditor();
  if (!genealogyElements.resetTreeModal.hidden) genealogyElements.resetTreeModal.hidden = true;
});

renderGenealogy();
