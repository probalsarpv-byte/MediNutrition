
/*
  SHUDDHO MEDNUTRI — FULL CORPUS REMOTE DATA LOADER

  Medicine corpus:
  CSE-3200-System-Project/Medora
  data/medicine_reference/Final_Medicine_Dataset.csv
  Consolidated corpus license: CC BY 4.0, with source notices in that repository.

  DDI:
  Zenodo record 19685458, ddi_2026.csv
  Derived from FDA 2026 DailyMed labels.
*/

window.SMN_DATA = (() => {
  const MEDICINE_URL =
    "https://raw.githubusercontent.com/CSE-3200-System-Project/Medora/main/data/medicine_reference/Final_Medicine_Dataset.csv";

  const DDI_URL =
    "https://zenodo.org/records/19685458/files/ddi_2026.csv?download=1";

  const CACHE = {
    medicineText: null,
    medicineRows: null,
    ddiRows: null
  };

  function parseCSV(text) {
    const rows = [];
    let row = [], field = "", quoted = false;

    for (let i = 0; i < text.length; i++) {
      const c = text[i];

      if (quoted) {
        if (c === '"' && text[i + 1] === '"') {
          field += '"';
          i++;
        } else if (c === '"') {
          quoted = false;
        } else {
          field += c;
        }
      } else {
        if (c === '"') quoted = true;
        else if (c === ",") {
          row.push(field);
          field = "";
        } else if (c === "\n") {
          row.push(field.replace(/\r$/, ""));
          rows.push(row);
          row = [];
          field = "";
        } else {
          field += c;
        }
      }
    }
    if (field.length || row.length) {
      row.push(field);
      rows.push(row);
    }

    if (!rows.length) return [];
    const headers = rows[0].map(x => x.trim());

    return rows.slice(1)
      .filter(r => r.some(v => String(v || "").trim()))
      .map(r => {
        const o = {};
        headers.forEach((h, i) => o[h] = r[i] ?? "");
        return o;
      });
  }

  async function fetchText(url) {
    const res = await fetch(url, {cache:"force-cache"});
    if (!res.ok) throw new Error(`Could not load dataset: ${res.status}`);
    return res.text();
  }

  async function loadMedicineCorpus(onProgress) {
    if (CACHE.medicineRows) return CACHE.medicineRows;
    onProgress?.("বাংলাদেশ medicine corpus ডাউনলোড হচ্ছে… প্রথমবার একটু সময় লাগতে পারে।");

    const text = await fetchText(MEDICINE_URL);
    CACHE.medicineText = text;

    onProgress?.("71k+ medicine rows process করা হচ্ছে…");
    const rows = parseCSV(text);

    rows.forEach((r, idx) => {
      r.__id = "MED_" + String(idx + 1).padStart(6, "0");
      r.__search = [
        r.generic_name, r.brand_name, r.manufacturer,
        r.strength, r.dosage_form, r.common_uses, r.medicine_type
      ].join(" ").toLowerCase().normalize("NFKC");
    });

    CACHE.medicineRows = rows;
    return rows;
  }

  async function loadDDI(onProgress) {
    if (CACHE.ddiRows) return CACHE.ddiRows;
    onProgress?.("Interaction dataset load হচ্ছে…");
    const text = await fetchText(DDI_URL);
    const rows = parseCSV(text);
    CACHE.ddiRows = rows;
    return rows;
  }

  return {
    MEDICINE_URL,
    DDI_URL,
    parseCSV,
    loadMedicineCorpus,
    loadDDI
  };
})();
