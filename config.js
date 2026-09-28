window.SMN_CONFIG={
  "version": "5.0.0",
  "documentedCounts": {
    "medicineRows": 71795,
    "allopathic": 54423,
    "ayurvedic": 5281,
    "unani": 8484,
    "herbal": 1029,
    "homeopathic": 2578,
    "note": "Documented source-corpus counts; live unique-brand/generic counts are calculated after load."
  },
  "curatedGenerics": [
    "paracetamol",
    "metformin",
    "amlodipine",
    "losartan",
    "telmisartan",
    "enalapril",
    "ramipril",
    "atorvastatin",
    "rosuvastatin",
    "omeprazole",
    "esomeprazole",
    "pantoprazole",
    "levothyroxine",
    "furosemide",
    "spironolactone",
    "hydrochlorothiazide",
    "bisoprolol",
    "metoprolol",
    "carvedilol",
    "aspirin",
    "clopidogrel",
    "warfarin",
    "rivaroxaban",
    "amoxicillin",
    "amoxicillin + clavulanic acid",
    "azithromycin",
    "doxycycline",
    "ciprofloxacin",
    "cefuroxime",
    "ceftriaxone",
    "cetirizine",
    "loratadine",
    "fexofenadine",
    "montelukast",
    "salbutamol",
    "budesonide",
    "prednisolone",
    "dexamethasone",
    "diclofenac",
    "ibuprofen",
    "naproxen",
    "pregabalin",
    "gabapentin",
    "sertraline",
    "escitalopram",
    "ferrous fumarate",
    "calcium carbonate + vitamin d3",
    "vitamin d3",
    "zinc"
  ],
  "verifiedBdSupplements": [
    {
      "id": "bd-gefomag",
      "name": "Gefomag",
      "company": "Navana Pharmaceuticals PLC",
      "category": "Magnesium",
      "ingredients": [
        "Magnesium glycerophosphate"
      ],
      "label": "1 g magnesium glycerophosphate BP equivalent to 97 mg magnesium per chewable tablet",
      "source": "https://navanapharma.com/products/by/brand/1/g"
    },
    {
      "id": "bd-bolardi",
      "name": "Bolardi",
      "company": "Square Pharmaceuticals PLC",
      "category": "Probiotic",
      "ingredients": [
        "Saccharomyces boulardii"
      ],
      "label": "250 mg capsule (manufacturer listing)",
      "source": "https://www.squarepharma.com.bd/product-details.php?pid=799"
    },
    {
      "id": "bd-probio-r",
      "name": "Probio R",
      "company": "Square Pharmaceuticals PLC",
      "category": "Probiotic",
      "ingredients": [
        "Lactobacillus",
        "Bifidobacterium"
      ],
      "label": "Multi-strain probiotic (manufacturer product document)",
      "source": "https://www.squarepharma.com.bd/downloads/1623322203_pdoc_Probio%20R%20DS_web.pdf"
    }
  ],
  "sources": {
    "medicineCorpus": "https://raw.githubusercontent.com/CSE-3200-System-Project/Medora/main/data/medicine_reference/Final_Medicine_Dataset.csv",
    "ddi": "https://zenodo.org/records/19685458/files/ddi_2026.csv?download=1",
    "openfda": "https://api.fda.gov/drug/label.json",
    "dsldBase": "https://api.ods.od.nih.gov/dsld/v9"
  }
};
