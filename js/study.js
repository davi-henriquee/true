const books = [
  { id: "gn", name: "Gênesis", abbr: "Gn", chapters: 50, testament: "Antigo Testamento" },
  { id: "ex", name: "Êxodo", abbr: "Êx", chapters: 40, testament: "Antigo Testamento" },
  { id: "lv", name: "Levítico", abbr: "Lv", chapters: 27, testament: "Antigo Testamento" },
  { id: "nm", name: "Números", abbr: "Nm", chapters: 36, testament: "Antigo Testamento" },
  { id: "dt", name: "Deuteronômio", abbr: "Dt", chapters: 34, testament: "Antigo Testamento" },
  { id: "js", name: "Josué", abbr: "Js", chapters: 24, testament: "Antigo Testamento" },
  { id: "jz", name: "Juízes", abbr: "Jz", chapters: 21, testament: "Antigo Testamento" },
  { id: "rt", name: "Rute", abbr: "Rt", chapters: 4, testament: "Antigo Testamento" },
  { id: "1sm", name: "1 Samuel", abbr: "1Sm", chapters: 31, testament: "Antigo Testamento" },
  { id: "2sm", name: "2 Samuel", abbr: "2Sm", chapters: 24, testament: "Antigo Testamento" },
  { id: "1rs", name: "1 Reis", abbr: "1Rs", chapters: 22, testament: "Antigo Testamento" },
  { id: "2rs", name: "2 Reis", abbr: "2Rs", chapters: 25, testament: "Antigo Testamento" },
  { id: "1cr", name: "1 Crônicas", abbr: "1Cr", chapters: 29, testament: "Antigo Testamento" },
  { id: "2cr", name: "2 Crônicas", abbr: "2Cr", chapters: 36, testament: "Antigo Testamento" },
  { id: "ed", name: "Esdras", abbr: "Ed", chapters: 10, testament: "Antigo Testamento" },
  { id: "ne", name: "Neemias", abbr: "Ne", chapters: 13, testament: "Antigo Testamento" },
  { id: "et", name: "Ester", abbr: "Et", chapters: 10, testament: "Antigo Testamento" },
  { id: "jo", name: "Jó", abbr: "Jó", chapters: 42, testament: "Antigo Testamento" },
  { id: "sl", name: "Salmos", abbr: "Sl", chapters: 150, testament: "Antigo Testamento" },
  { id: "pv", name: "Provérbios", abbr: "Pv", chapters: 31, testament: "Antigo Testamento" },
  { id: "ec", name: "Eclesiastes", abbr: "Ec", chapters: 12, testament: "Antigo Testamento" },
  { id: "ct", name: "Cantares", abbr: "Ct", chapters: 8, testament: "Antigo Testamento" },
  { id: "is", name: "Isaías", abbr: "Is", chapters: 66, testament: "Antigo Testamento" },
  { id: "jr", name: "Jeremias", abbr: "Jr", chapters: 52, testament: "Antigo Testamento" },
  { id: "lm", name: "Lamentações", abbr: "Lm", chapters: 5, testament: "Antigo Testamento" },
  { id: "ez", name: "Ezequiel", abbr: "Ez", chapters: 48, testament: "Antigo Testamento" },
  { id: "dn", name: "Daniel", abbr: "Dn", chapters: 12, testament: "Antigo Testamento" },
  { id: "os", name: "Oseias", abbr: "Os", chapters: 14, testament: "Antigo Testamento" },
  { id: "jl", name: "Joel", abbr: "Jl", chapters: 3, testament: "Antigo Testamento" },
  { id: "am", name: "Amós", abbr: "Am", chapters: 9, testament: "Antigo Testamento" },
  { id: "ob", name: "Obadias", abbr: "Ob", chapters: 1, testament: "Antigo Testamento" },
  { id: "jn", name: "Jonas", abbr: "Jn", chapters: 4, testament: "Antigo Testamento" },
  { id: "mq", name: "Miqueias", abbr: "Mq", chapters: 7, testament: "Antigo Testamento" },
  { id: "na", name: "Naum", abbr: "Na", chapters: 3, testament: "Antigo Testamento" },
  { id: "hc", name: "Habacuque", abbr: "Hc", chapters: 3, testament: "Antigo Testamento" },
  { id: "sf", name: "Sofonias", abbr: "Sf", chapters: 3, testament: "Antigo Testamento" },
  { id: "ag", name: "Ageu", abbr: "Ag", chapters: 2, testament: "Antigo Testamento" },
  { id: "zc", name: "Zacarias", abbr: "Zc", chapters: 14, testament: "Antigo Testamento" },
  { id: "ml", name: "Malaquias", abbr: "Ml", chapters: 4, testament: "Antigo Testamento" },
  { id: "mt", name: "Mateus", abbr: "Mt", chapters: 28, testament: "Novo Testamento" },
  { id: "mc", name: "Marcos", abbr: "Mc", chapters: 16, testament: "Novo Testamento" },
  { id: "lc", name: "Lucas", abbr: "Lc", chapters: 24, testament: "Novo Testamento" },
  { id: "joao", name: "João", abbr: "Jo", chapters: 21, testament: "Novo Testamento" },
  { id: "at", name: "Atos", abbr: "At", chapters: 28, testament: "Novo Testamento" },
  { id: "rm", name: "Romanos", abbr: "Rm", chapters: 16, testament: "Novo Testamento" },
  { id: "1co", name: "1 Coríntios", abbr: "1Co", chapters: 16, testament: "Novo Testamento" },
  { id: "2co", name: "2 Coríntios", abbr: "2Co", chapters: 13, testament: "Novo Testamento" },
  { id: "gl", name: "Gálatas", abbr: "Gl", chapters: 6, testament: "Novo Testamento" },
  { id: "ef", name: "Efésios", abbr: "Ef", chapters: 6, testament: "Novo Testamento" },
  { id: "fp", name: "Filipenses", abbr: "Fp", chapters: 4, testament: "Novo Testamento" },
  { id: "cl", name: "Colossenses", abbr: "Cl", chapters: 4, testament: "Novo Testamento" },
  { id: "1ts", name: "1 Tessalonicenses", abbr: "1Ts", chapters: 5, testament: "Novo Testamento" },
  { id: "2ts", name: "2 Tessalonicenses", abbr: "2Ts", chapters: 3, testament: "Novo Testamento" },
  { id: "1tm", name: "1 Timóteo", abbr: "1Tm", chapters: 6, testament: "Novo Testamento" },
  { id: "2tm", name: "2 Timóteo", abbr: "2Tm", chapters: 4, testament: "Novo Testamento" },
  { id: "tt", name: "Tito", abbr: "Tt", chapters: 3, testament: "Novo Testamento" },
  { id: "fm", name: "Filemom", abbr: "Fm", chapters: 1, testament: "Novo Testamento" },
  { id: "hb", name: "Hebreus", abbr: "Hb", chapters: 13, testament: "Novo Testamento" },
  { id: "tg", name: "Tiago", abbr: "Tg", chapters: 5, testament: "Novo Testamento" },
  { id: "1pe", name: "1 Pedro", abbr: "1Pe", chapters: 5, testament: "Novo Testamento" },
  { id: "2pe", name: "2 Pedro", abbr: "2Pe", chapters: 3, testament: "Novo Testamento" },
  { id: "1jo", name: "1 João", abbr: "1Jo", chapters: 5, testament: "Novo Testamento" },
  { id: "2jo", name: "2 João", abbr: "2Jo", chapters: 1, testament: "Novo Testamento" },
  { id: "3jo", name: "3 João", abbr: "3Jo", chapters: 1, testament: "Novo Testamento" },
  { id: "jd", name: "Judas", abbr: "Jd", chapters: 1, testament: "Novo Testamento" },
  { id: "ap", name: "Apocalipse", abbr: "Ap", chapters: 22, testament: "Novo Testamento" },
];

const markerTypes = {
  genealogy: { label: "Genealogia", color: "#a9d9b4" },
  fun: { label: "Divertido", color: "#e7b6d3" },
  debate: { label: "Debate", color: "#f2ad7e" },
  christ: { label: "Cristocentria", color: "#efff38" },
};

const storageKey = "study-of-truth-state-v1";

const defaultState = {
  selectedBook: "gn",
  markers: {},
  notes: [],
  sidebarCollapsed: false,
};

let state = loadState();
let activeChapter = null;
let activeNoteFilter = "all";
let draggedNoteId = null;
let toastTimeout = null;

const elements = {
  studyLayout: document.getElementById("studyLayout"),
  bookSidebar: document.getElementById("bookSidebar"),
  sidebarBackdrop: document.getElementById("sidebarBackdrop"),
  mobileMenuButton: document.getElementById("mobileMenuButton"),
  collapseButton: document.getElementById("collapseButton"),
  bookList: document.getElementById("bookList"),
  bookTitle: document.getElementById("bookTitle"),
  testamentLabel: document.getElementById("testamentLabel"),
  bookSummary: document.getElementById("bookSummary"),
  topBookName: document.getElementById("topBookName"),
  topChapterCount: document.getElementById("topChapterCount"),
  chapterGrid: document.getElementById("chapterGrid"),
  notesLegend: document.getElementById("notesLegend"),
  notesList: document.getElementById("notesList"),
  notesCount: document.getElementById("notesCount"),
  markerModal: document.getElementById("markerModal"),
  markerOptions: document.getElementById("markerOptions"),
  dialogBookName: document.getElementById("dialogBookName"),
  markerDialogTitle: document.getElementById("markerDialogTitle"),
  dialogVersePrefix: document.getElementById("dialogVersePrefix"),
  dialogVerseInput: document.getElementById("dialogVerseInput"),
  dialogVerseError: document.getElementById("dialogVerseError"),
  dialogClose: document.getElementById("dialogClose"),
  dialogDone: document.getElementById("dialogDone"),
  toast: document.getElementById("toast"),
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (!saved || typeof saved !== "object") return { ...defaultState };

    return {
      ...defaultState,
      ...saved,
      markers: saved.markers && typeof saved.markers === "object" ? saved.markers : {},
      notes: Array.isArray(saved.notes) ? saved.notes : [],
    };
  } catch {
    return { ...defaultState };
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function getSelectedBook() {
  return books.find((book) => book.id === state.selectedBook) || books[0];
}

function getChapterKey(bookId, chapter) {
  return `${bookId}-${chapter}`;
}

function getChapterMarkers(bookId, chapter) {
  return state.markers[getChapterKey(bookId, chapter)] || [];
}

function noteMatchesCurrentView(note) {
  return note.bookId === getSelectedBook().id
    && (activeNoteFilter === "all" || note.type === activeNoteFilter);
}

function getVisibleNotes() {
  return state.notes.filter(noteMatchesCurrentView);
}

function renderNoteFilters() {
  elements.notesLegend.querySelectorAll("[data-note-filter]").forEach((button) => {
    const isActive = button.dataset.noteFilter === activeNoteFilter;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function renderBookList() {
  const fragments = [];
  let currentTestament = "";

  books.forEach((book) => {
    if (book.testament !== currentTestament) {
      currentTestament = book.testament;
      fragments.push(
        `<div class="testament-divider">${escapeHtml(currentTestament.toUpperCase())}</div>`,
      );
    }

    const isActive = book.id === state.selectedBook;
    fragments.push(`
      <button
        class="book-button${isActive ? " active" : ""}"
        type="button"
        data-book="${book.id}"
        aria-current="${isActive ? "page" : "false"}"
        title="${escapeHtml(book.name)}"
      >
        <span class="book-abbr">${escapeHtml(book.abbr)}</span>
        <span class="book-name">${escapeHtml(book.name)}</span>
      </button>
    `);
  });

  elements.bookList.innerHTML = fragments.join("");
}

function renderSelectedBook() {
  const book = getSelectedBook();
  const chapterLabel = book.chapters === 1 ? "capítulo" : "capítulos";

  elements.bookTitle.textContent = book.name;
  elements.testamentLabel.textContent = book.testament.toUpperCase();
  elements.bookSummary.textContent = `${book.chapters} ${chapterLabel}. Escolha um capítulo para adicionar uma marcação.`;
  elements.topBookName.textContent = book.name;
  elements.topChapterCount.textContent = `${book.chapters} ${chapterLabel}`;

  const chapters = [];
  for (let chapter = 1; chapter <= book.chapters; chapter += 1) {
    const markers = getChapterMarkers(book.id, chapter);
    const chapterNotes = state.notes.filter(
      (note) => note.bookId === book.id && note.chapter === chapter,
    );
    const markerCounts = {
      debate: chapterNotes.filter((note) => note.type === "debate").length,
      genealogy: chapterNotes.filter((note) => note.type === "genealogy").length,
      fun: chapterNotes.filter((note) => note.type === "fun").length,
      christ: chapterNotes.filter((note) => note.type === "christ").length,
    };

    ["debate", "genealogy", "fun", "christ"].forEach((type) => {
      if (!markerCounts[type] && markers.includes(type)) markerCounts[type] = 1;
    });

    const isChristCentered = markerCounts.christ > 0;
    const markerNames = markers.map((type) => markerTypes[type].label).join(", ");

    chapters.push(`
      <button
        class="chapter-card${markers.length ? " marked" : ""}${isChristCentered ? " christ-centered" : ""}"
        type="button"
        data-chapter="${chapter}"
        aria-label="Capítulo ${chapter}${markerNames ? `, marcado como ${escapeHtml(markerNames)}` : ""}"
      >
        <span class="chapter-number">${chapter}</span>
        ${markerCounts.christ > 1 ? `<span class="christ-count">${markerCounts.christ}</span>` : ""}
        <span class="chapter-markers" aria-hidden="true">
          <i class="chapter-marker-slot debate${markerCounts.debate ? " filled" : ""}">${markerCounts.debate > 1 ? markerCounts.debate : ""}</i>
          <i class="chapter-marker-slot genealogy${markerCounts.genealogy ? " filled" : ""}">${markerCounts.genealogy > 1 ? markerCounts.genealogy : ""}</i>
          <i class="chapter-marker-slot fun${markerCounts.fun ? " filled" : ""}">${markerCounts.fun > 1 ? markerCounts.fun : ""}</i>
        </span>
      </button>
    `);
  }

  elements.chapterGrid.innerHTML = chapters.join("");
}

function renderNotes() {
  const book = getSelectedBook();
  const bookNotes = state.notes.filter((note) => note.bookId === book.id);
  const visibleNotes = getVisibleNotes();
  elements.notesCount.textContent = activeNoteFilter === "all"
    ? String(bookNotes.length)
    : `${visibleNotes.length}/${bookNotes.length}`;
  renderNoteFilters();

  if (!visibleNotes.length) {
    const filteredLabel = markerTypes[activeNoteFilter]?.label;
    elements.notesList.innerHTML = `
      <div class="empty-notes">
        <div class="empty-notes-mark">＋</div>
        <strong>${filteredLabel
          ? `Nenhuma marcação de ${escapeHtml(filteredLabel)} em ${escapeHtml(book.name)}`
          : `Nenhuma marcação em ${escapeHtml(book.name)}`}</strong>
        <p>${filteredLabel && bookNotes.length
          ? "Escolha outra categoria ou adicione uma nova marcação."
          : "Clique em um capítulo e escolha uma categoria para começar."}</p>
      </div>
    `;
    return;
  }

  elements.notesList.innerHTML = visibleNotes
    .map((note, index) => {
      const book = books.find((item) => item.id === note.bookId) || books[0];
      const marker = markerTypes[note.type] || markerTypes.genealogy;
      return `
        <article
          class="note-item"
          draggable="true"
          data-note-id="${escapeHtml(note.id)}"
          style="--note-color: ${marker.color}"
        >
          <div class="note-meta">
            <span class="note-kind">${escapeHtml(marker.label)}</span>
            <span class="note-reference">${escapeHtml(book.name)} ${note.chapter}</span>
            <span class="note-actions">
              <button
                class="note-action move-up"
                type="button"
                data-note-id="${escapeHtml(note.id)}"
                aria-label="Mover anotação para cima"
                ${index === 0 ? "disabled" : ""}
              >↑</button>
              <button
                class="note-action move-down"
                type="button"
                data-note-id="${escapeHtml(note.id)}"
                aria-label="Mover anotação para baixo"
                ${index === visibleNotes.length - 1 ? "disabled" : ""}
              >↓</button>
              <button
                class="note-action drag-handle"
                type="button"
                aria-label="Arraste para reordenar"
                tabindex="-1"
              >⠿</button>
              <button
                class="note-action delete-note"
                type="button"
                data-note-id="${escapeHtml(note.id)}"
                aria-label="Excluir acontecimento"
              >×</button>
            </span>
          </div>
          <div class="note-fields">
            <input
              class="verse-input"
              data-field="verse"
              data-note-id="${escapeHtml(note.id)}"
              value="${escapeHtml(note.verse || "")}"
              placeholder="${escapeHtml(book.abbr)} ${note.chapter}:"
              aria-label="Versículo de ${escapeHtml(book.name)} capítulo ${note.chapter}"
            />
            <input
              class="note-input"
              data-field="text"
              data-note-id="${escapeHtml(note.id)}"
              value="${escapeHtml(note.text || "")}"
              placeholder="Clique para escrever sua anotação..."
              aria-label="Anotação"
            />
          </div>
        </article>
      `;
    })
    .join("");
}

function renderSidebarState() {
  const isDesktop = window.matchMedia("(min-width: 981px)").matches;
  elements.studyLayout.classList.toggle(
    "sidebar-collapsed",
    isDesktop && state.sidebarCollapsed,
  );
  elements.collapseButton.setAttribute(
    "aria-expanded",
    String(!(isDesktop && state.sidebarCollapsed)),
  );
  elements.collapseButton.setAttribute(
    "aria-label",
    state.sidebarCollapsed ? "Expandir menu de livros" : "Minimizar menu de livros",
  );
}

function selectBook(bookId) {
  if (!books.some((book) => book.id === bookId)) return;
  state.selectedBook = bookId;
  saveState();
  renderBookList();
  renderSelectedBook();
  renderNotes();
  closeMobileMenu();
  document.querySelector(".chapter-workspace").scrollTop = 0;
}

function openMarkerDialog(chapter) {
  const book = getSelectedBook();
  activeChapter = chapter;
  elements.dialogBookName.textContent = book.name.toUpperCase();
  elements.markerDialogTitle.textContent = `Capítulo ${chapter}`;
  elements.dialogVersePrefix.textContent = `${book.abbr} ${chapter}:`;
  elements.dialogVerseInput.value = "";
  clearVerseError();
  elements.markerModal.hidden = false;
  document.body.classList.add("modal-open");
  window.setTimeout(() => elements.dialogVerseInput.focus(), 0);
}

function closeMarkerDialog() {
  elements.markerModal.hidden = true;
  document.body.classList.remove("modal-open");
  activeChapter = null;
}

function addOccurrence(type) {
  if (activeChapter === null || !markerTypes[type]) return;

  const book = getSelectedBook();
  const verse = elements.dialogVerseInput.value.trim();

  if (!verse) {
    showVerseError();
    return;
  }

  const key = getChapterKey(book.id, activeChapter);
  const currentMarkers = [...getChapterMarkers(book.id, activeChapter)];
  const noteId = `${key}-${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  if (!currentMarkers.includes(type)) {
    currentMarkers.push(type);
  }

  state.markers[key] = currentMarkers;
  state.notes.push({
    id: noteId,
    bookId: book.id,
    chapter: activeChapter,
    type,
    verse,
    text: "",
  });

  saveState();
  renderSelectedBook();
  renderNotes();
  showToast(`${markerTypes[type].label} em ${book.abbr} ${activeChapter}:${verse} adicionada.`);
  elements.dialogVerseInput.value = "";
  clearVerseError();
  elements.dialogVerseInput.focus();
}

function showVerseError() {
  const field = elements.dialogVerseInput.closest(".dialog-verse-field");
  const control = elements.dialogVerseInput.closest(".dialog-verse-control");
  field.classList.add("invalid");
  control.classList.add("invalid");
  elements.dialogVerseInput.setAttribute("aria-invalid", "true");
  elements.dialogVerseInput.focus();
}

function clearVerseError() {
  const field = elements.dialogVerseInput.closest(".dialog-verse-field");
  const control = elements.dialogVerseInput.closest(".dialog-verse-control");
  field.classList.remove("invalid");
  control.classList.remove("invalid");
  elements.dialogVerseInput.removeAttribute("aria-invalid");
}

function updateNote(noteId, field, value) {
  const note = state.notes.find((item) => item.id === noteId);
  if (!note || !["verse", "text"].includes(field)) return;
  note[field] = value;
  saveState();
}

function moveNote(noteId, direction) {
  const visibleNotes = getVisibleNotes();
  const index = visibleNotes.findIndex((note) => note.id === noteId);
  if (index < 0) return;
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= visibleNotes.length) return;

  reorderNote(noteId, visibleNotes[nextIndex].id);
}

function removeNote(noteId) {
  const note = state.notes.find((item) => item.id === noteId);
  if (!note) return;

  state.notes = state.notes.filter((item) => item.id !== noteId);
  syncChapterMarkers(note.bookId, note.chapter);
  saveState();
  renderSelectedBook();
  renderNotes();
  showToast("Acontecimento removido.");
}

function syncChapterMarkers(bookId, chapter) {
  const key = getChapterKey(bookId, chapter);
  const types = [
    ...new Set(
      state.notes
        .filter((note) => note.bookId === bookId && note.chapter === chapter)
        .map((note) => note.type),
    ),
  ];

  if (types.length) state.markers[key] = types;
  else delete state.markers[key];
}

function reorderNote(sourceId, targetId) {
  if (!sourceId || sourceId === targetId) return;
  const visibleNotes = getVisibleNotes();
  const sourceIndex = visibleNotes.findIndex((note) => note.id === sourceId);
  const targetIndex = visibleNotes.findIndex((note) => note.id === targetId);
  if (sourceIndex < 0 || targetIndex < 0) return;

  const [note] = visibleNotes.splice(sourceIndex, 1);
  visibleNotes.splice(targetIndex, 0, note);
  let visibleIndex = 0;
  state.notes = state.notes.map((item) =>
    noteMatchesCurrentView(item) ? visibleNotes[visibleIndex++] : item,
  );
  saveState();
  renderNotes();
}

function openMobileMenu() {
  elements.bookSidebar.classList.add("mobile-open");
  elements.sidebarBackdrop.classList.add("visible");
  elements.mobileMenuButton.setAttribute("aria-expanded", "true");
}

function closeMobileMenu() {
  elements.bookSidebar.classList.remove("mobile-open");
  elements.sidebarBackdrop.classList.remove("visible");
  elements.mobileMenuButton.setAttribute("aria-expanded", "false");
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    elements.toast.classList.remove("visible");
  }, 2200);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

elements.bookList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-book]");
  if (button) selectBook(button.dataset.book);
});

elements.chapterGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-chapter]");
  if (button) openMarkerDialog(Number(button.dataset.chapter));
});

elements.markerOptions.addEventListener("click", (event) => {
  const button = event.target.closest("[data-marker]");
  if (button) addOccurrence(button.dataset.marker);
});

elements.notesLegend.addEventListener("click", (event) => {
  const button = event.target.closest("[data-note-filter]");
  if (!button) return;
  const filter = button.dataset.noteFilter;
  if (filter !== "all" && !markerTypes[filter]) return;
  activeNoteFilter = filter;
  renderNotes();
});

elements.notesList.addEventListener("input", (event) => {
  const input = event.target.closest("[data-note-id][data-field]");
  if (input) updateNote(input.dataset.noteId, input.dataset.field, input.value);
});

elements.notesList.addEventListener("click", (event) => {
  const upButton = event.target.closest(".move-up");
  const downButton = event.target.closest(".move-down");
  const deleteButton = event.target.closest(".delete-note");
  if (upButton) moveNote(upButton.dataset.noteId, -1);
  if (downButton) moveNote(downButton.dataset.noteId, 1);
  if (deleteButton) removeNote(deleteButton.dataset.noteId);
});

elements.notesList.addEventListener("dragstart", (event) => {
  const item = event.target.closest(".note-item");
  if (!item) return;
  if (event.target.closest("input")) {
    event.preventDefault();
    return;
  }
  draggedNoteId = item.dataset.noteId;
  item.classList.add("dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", draggedNoteId);
});

elements.notesList.addEventListener("dragend", () => {
  draggedNoteId = null;
  document.querySelectorAll(".note-item").forEach((item) => {
    item.classList.remove("dragging", "drag-target");
  });
});

elements.notesList.addEventListener("dragover", (event) => {
  const item = event.target.closest(".note-item");
  if (!item || item.dataset.noteId === draggedNoteId) return;
  event.preventDefault();
  document.querySelectorAll(".note-item").forEach((note) => {
    note.classList.toggle("drag-target", note === item);
  });
});

elements.notesList.addEventListener("drop", (event) => {
  const item = event.target.closest(".note-item");
  if (!item) return;
  event.preventDefault();
  reorderNote(draggedNoteId || event.dataTransfer.getData("text/plain"), item.dataset.noteId);
});

elements.collapseButton.addEventListener("click", () => {
  state.sidebarCollapsed = !state.sidebarCollapsed;
  saveState();
  renderSidebarState();
});

elements.mobileMenuButton.addEventListener("click", () => {
  const isOpen = elements.bookSidebar.classList.contains("mobile-open");
  if (isOpen) closeMobileMenu();
  else openMobileMenu();
});

elements.sidebarBackdrop.addEventListener("click", closeMobileMenu);
elements.dialogClose.addEventListener("click", closeMarkerDialog);
elements.dialogDone.addEventListener("click", closeMarkerDialog);
elements.dialogVerseInput.addEventListener("input", clearVerseError);

elements.markerModal.addEventListener("click", (event) => {
  if (event.target === elements.markerModal) closeMarkerDialog();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !elements.markerModal.hidden) {
    closeMarkerDialog();
  } else if (event.key === "Escape") {
    closeMobileMenu();
  }
});

window.addEventListener("resize", () => {
  renderSidebarState();
  if (window.matchMedia("(min-width: 981px)").matches) closeMobileMenu();
});

renderBookList();
renderSelectedBook();
renderNotes();
renderSidebarState();
