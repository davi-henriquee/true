const storageKeys = {
  study: "study-of-truth-state-v1",
  genealogy: "study-of-truth-genealogy-v1",
  timeline: "study-of-truth-timeline-v1",
};
const backupApp = "study-of-truth";
const currentBackupVersion = 2;

const chapterCounts = {
  gn: 50, ex: 40, lv: 27, nm: 36, dt: 34, js: 24, jz: 21, rt: 4,
  "1sm": 31, "2sm": 24, "1rs": 22, "2rs": 25, "1cr": 29, "2cr": 36,
  ed: 10, ne: 13, et: 10, jo: 42, sl: 150, pv: 31, ec: 12, ct: 8,
  is: 66, jr: 52, lm: 5, ez: 48, dn: 12, os: 14, jl: 3, am: 9,
  ob: 1, jn: 4, mq: 7, na: 3, hc: 3, sf: 3, ag: 2, zc: 14, ml: 4,
  mt: 28, mc: 16, lc: 24, joao: 21, at: 28, rm: 16, "1co": 16,
  "2co": 13, gl: 6, ef: 6, fp: 4, cl: 4, "1ts": 5, "2ts": 3,
  "1tm": 6, "2tm": 4, tt: 3, fm: 1, hb: 13, tg: 5, "1pe": 5,
  "2pe": 3, "1jo": 5, "2jo": 1, "3jo": 1, jd: 1, ap: 22,
};
const markerTypes = new Set(["genealogy", "fun", "debate", "christ"]);

const defaultStudy = {
  selectedBook: "gn",
  markers: {},
  notes: [],
  sidebarCollapsed: false,
};
const defaultGenealogy = {
  rootId: "root-person",
  people: [{ id: "root-person", name: "Pessoa inicial", notes: "", image: "" }],
  families: [],
};
const defaultTimeline = { people: [], groups: [], selectedIds: [] };

const exportButton = document.getElementById("exportBackup");
const importButton = document.getElementById("importBackup");
const fileInput = document.getElementById("backupFile");
const statusLine = document.getElementById("backupStatus");
const importModal = document.getElementById("importConfirm");
const importDescription = document.getElementById("importDescription");
const cancelButtons = [
  document.getElementById("cancelImport"),
  document.getElementById("confirmImportCancel"),
].filter(Boolean);
const confirmButton = document.getElementById("confirmImport");
let pendingBackupData = null;

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validBookChapter(bookId, chapter) {
  return Object.hasOwn(chapterCounts, bookId)
    && Number.isInteger(chapter)
    && chapter >= 1
    && chapter <= chapterCounts[bookId];
}

function validateStudy(study) {
  if (!isRecord(study)
    || !Object.hasOwn(chapterCounts, study.selectedBook)
    || typeof study.sidebarCollapsed !== "boolean"
    || !isRecord(study.markers)
    || !Array.isArray(study.notes)) {
    throw new Error("Este arquivo não contém dados de estudo válidos.");
  }

  const noteIds = new Set();
  for (const note of study.notes) {
    if (!isRecord(note)
      || typeof note.id !== "string"
      || !note.id
      || note.id.length > 200
      || noteIds.has(note.id)
      || !validBookChapter(note.bookId, note.chapter)
      || !markerTypes.has(note.type)
      || typeof note.verse !== "string"
      || typeof note.text !== "string") {
      throw new Error("O arquivo contém uma marcação inválida.");
    }
    noteIds.add(note.id);
  }

  for (const [chapterKey, types] of Object.entries(study.markers)) {
    const match = /^([a-z0-9]+)-(\d+)$/.exec(chapterKey);
    if (!match
      || !validBookChapter(match[1], Number(match[2]))
      || !Array.isArray(types)
      || types.some((type) => !markerTypes.has(type))) {
      throw new Error("O arquivo contém marcações de capítulo inválidas.");
    }
  }
  return study;
}

function validateImage(value) {
  return typeof value === "string" && value.length <= 6_000_000;
}

function validateGenealogy(genealogy) {
  if (!isRecord(genealogy)
    || typeof genealogy.rootId !== "string"
    || !Array.isArray(genealogy.people)
    || !Array.isArray(genealogy.families)
    || !genealogy.people.length) {
    throw new Error("O arquivo contém uma árvore genealógica inválida.");
  }
  const peopleIds = new Set();
  for (const person of genealogy.people) {
    if (!isRecord(person)
      || typeof person.id !== "string"
      || !person.id
      || peopleIds.has(person.id)
      || typeof person.name !== "string"
      || person.name.length > 80
      || typeof person.notes !== "string"
      || person.notes.length > 600
      || !validateImage(person.image)) {
      throw new Error("A árvore contém uma pessoa inválida.");
    }
    peopleIds.add(person.id);
  }
  if (!peopleIds.has(genealogy.rootId)) {
    throw new Error("A pessoa inicial da árvore não foi encontrada.");
  }
  const familyIds = new Set();
  for (const family of genealogy.families) {
    if (!isRecord(family)
      || typeof family.id !== "string"
      || familyIds.has(family.id)
      || !peopleIds.has(family.person1Id)
      || (family.person2Id !== null && !peopleIds.has(family.person2Id))
      || !Array.isArray(family.childrenIds)
      || family.childrenIds.some((id) => !peopleIds.has(id))) {
      throw new Error("A árvore contém uma relação familiar inválida.");
    }
    familyIds.add(family.id);
  }
  return genealogy;
}

function isValidHex(value) {
  return value === "" || /^#[0-9a-f]{6}$/i.test(value);
}

function validateTimeline(timeline) {
  if (!isRecord(timeline)
    || !Array.isArray(timeline.people)
    || !Array.isArray(timeline.groups)
    || !Array.isArray(timeline.selectedIds)
    || timeline.selectedIds.length > 10) {
    throw new Error("O arquivo contém uma linha do tempo inválida.");
  }
  const groupIds = new Set();
  for (const group of timeline.groups) {
    if (!isRecord(group)
      || typeof group.id !== "string"
      || groupIds.has(group.id)
      || typeof group.name !== "string"
      || group.name.length > 60
      || !isValidHex(group.color)
      || typeof group.collapsed !== "boolean") {
      throw new Error("A linha do tempo contém um grupo inválido.");
    }
    groupIds.add(group.id);
  }
  const personIds = new Set();
  for (const person of timeline.people) {
    const hasPendingDates = person.birth === "" && person.death === "";
    const hasValidDates = Number.isInteger(person.birth)
      && Number.isInteger(person.death)
      && person.death >= person.birth;
    if (!isRecord(person)
      || typeof person.id !== "string"
      || personIds.has(person.id)
      || typeof person.name !== "string"
      || person.name.length > 80
      || (!hasPendingDates && !hasValidDates)
      || !validateImage(person.image)
      || !isValidHex(person.color)
      || (person.groupId && !groupIds.has(person.groupId))) {
      throw new Error("A linha do tempo contém uma pessoa inválida.");
    }
    personIds.add(person.id);
  }
  if (timeline.selectedIds.some((id) => !personIds.has(id))) {
    throw new Error("A seleção da linha do tempo é inválida.");
  }
  return timeline;
}

function readStorage(key, fallback, validator) {
  const saved = localStorage.getItem(key);
  if (saved === null) return JSON.parse(JSON.stringify(fallback));
  return validator(JSON.parse(saved));
}

function readAllData() {
  return {
    study: readStorage(storageKeys.study, defaultStudy, validateStudy),
    genealogy: readStorage(storageKeys.genealogy, defaultGenealogy, validateGenealogy),
    timeline: readStorage(storageKeys.timeline, defaultTimeline, validateTimeline),
  };
}

function showStatus(message, isError = false) {
  statusLine.textContent = message;
  statusLine.classList.toggle("error", isError);
}

function closeImportDialog() {
  importModal.hidden = true;
  pendingBackupData = null;
  importButton.focus();
}

function exportBackup() {
  try {
    const data = readAllData();
    const backup = {
      app: backupApp,
      version: currentBackupVersion,
      exportedAt: new Date().toISOString(),
      data,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = `study-of-truth-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showStatus(`Backup exportado: ${data.study.notes.length} marcações, ${data.genealogy.people.length} pessoas na árvore e ${data.timeline.people.length} na linha do tempo.`);
  } catch {
    showStatus("Não foi possível exportar os dados salvos neste navegador.", true);
  }
}

async function prepareImport(file) {
  if (!file) return;
  if (file.size > 40 * 1024 * 1024) {
    showStatus("O arquivo JSON é grande demais para importar.", true);
    return;
  }

  try {
    const backup = JSON.parse(await file.text());
    if (!isRecord(backup)
      || backup.app !== backupApp
      || ![1, currentBackupVersion].includes(backup.version)
      || !isRecord(backup.data)) {
      throw new Error("Formato de backup incompatível.");
    }

    const study = validateStudy(backup.data.study);
    const isLegacy = backup.version === 1;
    pendingBackupData = {
      study,
      genealogy: isLegacy
        ? readStorage(storageKeys.genealogy, defaultGenealogy, validateGenealogy)
        : validateGenealogy(backup.data.genealogy),
      timeline: isLegacy
        ? readStorage(storageKeys.timeline, defaultTimeline, validateTimeline)
        : validateTimeline(backup.data.timeline),
      isLegacy,
    };
    importDescription.textContent = isLegacy
      ? `Este backup antigo contém ${study.notes.length} marcações. Ele atualizará o estudo bíblico sem apagar a árvore ou a linha do tempo atuais.`
      : `O arquivo contém ${study.notes.length} marcações, ${pendingBackupData.genealogy.people.length} pessoas na árvore e ${pendingBackupData.timeline.people.length} pessoas na linha do tempo. A importação substituirá os dados atuais.`;
    importModal.hidden = false;
    confirmButton.focus();
  } catch (error) {
    showStatus(error instanceof SyntaxError
      ? "O arquivo selecionado não é um JSON válido."
      : error.message || "Não foi possível ler este backup.", true);
  }
}

function confirmImport() {
  if (!pendingBackupData) return;
  try {
    localStorage.setItem(storageKeys.study, JSON.stringify(pendingBackupData.study));
    localStorage.setItem(storageKeys.genealogy, JSON.stringify(pendingBackupData.genealogy));
    localStorage.setItem(storageKeys.timeline, JSON.stringify(pendingBackupData.timeline));
    const legacyMessage = pendingBackupData.isLegacy ? " Backup antigo convertido com segurança." : "";
    closeImportDialog();
    showStatus(`Dados importados com sucesso.${legacyMessage}`);
  } catch {
    showStatus("Não foi possível salvar o backup neste navegador.", true);
  }
}

exportButton.addEventListener("click", exportBackup);
importButton.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", async () => {
  const file = fileInput.files?.[0];
  fileInput.value = "";
  await prepareImport(file);
});
cancelButtons.forEach((button) => button.addEventListener("click", closeImportDialog));
confirmButton.addEventListener("click", confirmImport);
importModal.addEventListener("click", (event) => {
  if (event.target === importModal) closeImportDialog();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !importModal.hidden) closeImportDialog();
});
