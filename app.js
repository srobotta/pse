// Periodensystem der Elemente — vanilla browser app, no build step.
// Depends on the globals `ELEMENTS` and `CATEGORY_LABELS` from elements.js.

(function () {
  "use strict";

  // Turn a category name into a CSS-class-friendly slug, e.g.
  // "noble gas" -> "cat-noble-gas".
  function categoryClass(category) {
    return 'cat-' + CATEGORY_LABELS[category][0]
  }

  function categoryName(category) {
    const labels = CATEGORY_LABELS[category][1];
    return labels[currentLang];
  }

  function openWikipedia(name) {
    window.open(
      'https://' + currentLang + '.wikipedia.org/wiki/' + encodeURIComponent(name),
      '_blank',
      'noopener'
    );
  }

  // Small inline SVGs so we don't depend on an icon library.
  const ICON_SEARCH =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>';
  const ICON_EXTERNAL =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>';

  let searchQuery = "";
  let cellByNumber = {};
  let currentLang = 'en';

  const LABELS = {
    en: {
      clickToRead: 'Click on this element to read the scientific article at Wikipedia.',
      openWp: 'Go to Wikipedia',
      search: 'Search...',
      searchElement: 'Search element...'
    },
    de: {
      clickToRead: 'Klicken Sie auf dieses Element, um den vollständigen wissenschaftlichen Artikel auf Wikipedia zu lesen.',
      openWp: 'Wikipedia öffnen',
      search: 'Suchen...',
      searchElement: 'Element suchen...'
    },
    fr: {
      clickToRead: 'Cliquez sur cet élément pour lire l\'article scientifique complet sur Wikipédia.',
      openWp: 'Ouvrir Wikipédia',
      search: 'Rechercher...',
      searchElement: 'Rechercher élément...'
    },
    it: {
      clickToRead: 'Clicca su questo elemento per leggere l\'articolo scientifico completo su Wikipedia.',
      openWp: 'Apri Wikipedia',
      search: 'Cerca...',
      searchElement: 'Cerca elemento...'
    },
    es: {
      clickToRead: 'Cliquez sur cet élément pour lire l\'article scientifique complet sur Wikipédia.',
      openWp: 'Abrir Wikipédia',
      search: 'Buscar...',
      searchElement: 'Buscar elemento...'
    }

  };

  function getLabel(label) {
    return LABELS[currentLang][label] ?? label;
  }

  function matchesQuery(el, q) {
    if (!q) return true;
    q = q.toLowerCase();
    return (
      el.name[currentLang].toLowerCase().indexOf(q) !== -1 ||
      el.symbol.toLowerCase().indexOf(q) !== -1 ||
      String(el.number).indexOf(q) !== -1
    );
  }

  // ---------- Build the periodic-table grid ----------
  function buildTable() {
    const table = document.getElementById("table");
    const fragment = document.createDocumentFragment();

    ELEMENTS.forEach(function (el) {
      const cell = document.createElement("div");
      cell.className = "element " + categoryClass(el.category);
      // Rows 8/9 (lanthanides/actinides) sit below a one-row gap.
      const gridRow = el.y <= 7 ? el.y : el.y + 1;
      cell.style.gridColumn = String(el.x);
      cell.style.gridRow = String(gridRow);

      cell.innerHTML =
        '<span class="num">' + el.number + "</span>" +
        '<span class="sym">' + el.symbol + "</span>" +
        '<span class="name">' + el.name[currentLang] + "</span>" +
        '<div class="underline"></div>';

      cell.addEventListener("mouseenter", function () {
        showInfo(el);
      });
      cell.addEventListener("mouseleave", hideInfo);
      cell.addEventListener("click", function () {
        openWikipedia(el.name[currentLang]);
      });

      cellByNumber[el.number] = cell;
      fragment.appendChild(cell);
    });

    table.appendChild(fragment);
  }

  // ---------- Legend ----------
  function buildLegend() {
    const legend = document.getElementById("legend");
    // Match the original: show the first five categories, then an ellipsis.
    CATEGORY_LABELS.slice(0, 10).forEach(function (category, i) {
      const item = document.createElement("div");
      item.className = "legend-item";
      const swatch = document.createElement("span");
      swatch.className = "legend-swatch " + categoryClass(i);
      swatch.style.background = "var(--cat-bg)";
      swatch.style.borderColor = "var(--cat-border)";
      item.appendChild(swatch);
      item.appendChild(document.createTextNode(categoryName(i)));
      legend.appendChild(item);
      item.addEventListener('mouseenter', function() {
        applySearch(categoryClass(i));  
      });
      item.addEventListener('mouseleave', function() {
        applySearch();
      })
    });
  }

  // ---------- Info card ----------
  function showInfo(el) {
    const card = document.getElementById("info-card");
    card.className = "info-card " + categoryClass(el.category) + " visible";
    card.innerHTML =
      '<div class="info-head">' +
        "<div>" +
          '<div class="info-title">' +
            '<span class="num">#' + el.number + "</span>" +
            "<h2>" + el.name[currentLang] + "</h2>" +
          "</div>" +
          '<div class="info-meta">' +
            '<span class="info-badge">' + categoryName(el.category) + "</span>" +
            '<span class="info-mass">' + el.mass + " u</span>" +
          "</div>" +
          '<p class="info-desc">' + getLabel('clickToRead') + '</p>' +
        "</div>" +
        '<button class="info-link" title="' + getLabel('openWp') + '">' + ICON_EXTERNAL + "</button>" +
      "</div>";
    card
      .querySelector(".info-link")
      .addEventListener("click", function () {
        openWikipedia(el.name[currentLang]);
      });
  }

  function hideInfo() {
    const card = document.getElementById("info-card");
    card.classList.remove("visible");
  }

  // ---------- Search ----------
  function applySearch(category) {
    ELEMENTS.forEach(function (el) {
      const cell = cellByNumber[el.number];
      const match = category
        ? cell.classList.contains(category)
        : matchesQuery(el, searchQuery);
      cell.classList.toggle("dimmed", !match);
    });
  }

  function wireSearch() {
    const inputs = document.querySelectorAll(".search input");
    inputs.forEach(function (input) {
      input.addEventListener("input", function (e) {
        searchQuery = e.target.value;
        // Keep both search boxes in sync.
        inputs.forEach(function (other) {
          if (other !== e.target) other.value = searchQuery;
        });
        applySearch();
      });
    });
  }

  function initLanguage() {
    const paramsString = window.location.search;
    const searchParams = new URLSearchParams(paramsString);
    if (searchParams.has('lang')) {
      currentLang = searchParams.get('lang');
    } else if (typeof(window.parent.M?.cfg?.language) !== 'undefined') {
      currentLang = window.parent.M.cfg.language;
    } else if (typeof(navigator?.language) !== 'undefined') {
      currentLang = navigator.language;
    }
    currentLang = currentLang.substring(0, 2).toLowerCase();
    if (!LABELS.hasOwnProperty(currentLang)) {
      currentLang = 'en';
    }
  }

  function adaptLanguage() {
    document.querySelectorAll('span[lang]').forEach((s) => {
      if (s.getAttribute('lang') !== currentLang) {
        s.remove();
      }
    });
    document.querySelector('title').textContent = document.querySelector('h1').textContent;
  }

  // ---------- Init ----------
  function init() {
    document.querySelectorAll(".search-icon").forEach(function (span) {
      span.innerHTML = ICON_SEARCH;
    });
    initLanguage();
    adaptLanguage();
    buildLegend();
    buildTable();
    wireSearch();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
