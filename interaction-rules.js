window.SMN_RULES = [
  {
    "id": "LEVO_FOOD",
    "generic": [
      "levothyroxine",
      "thyroxine"
    ],
    "type": "food",
    "with_bn": "খাবার",
    "with_en": "Food",
    "severity": "timing",
    "bn": "লেভোথাইরক্সিন সাধারণত খালি পেটে একইভাবে নেওয়া হয়; খাবার absorption প্রভাবিত করতে পারে।",
    "en": "Levothyroxine is generally taken consistently on an empty stomach; food can affect absorption.",
    "pro": "Administration consistency and fasting interval are clinically relevant.",
    "action_bn": "Product label অনুযায়ী fasting interval অনুসরণ করুন।",
    "action_en": "Follow the product-specific fasting interval.",
    "source": "Product label/guideline"
  },
  {
    "id": "LEVO_CA",
    "generic": [
      "levothyroxine",
      "thyroxine"
    ],
    "type": "nutrient",
    "with_bn": "ক্যালসিয়াম",
    "with_en": "Calcium",
    "severity": "timing",
    "bn": "ক্যালসিয়াম লেভোথাইরক্সিনের absorption কমাতে পারে।",
    "en": "Calcium can reduce levothyroxine absorption.",
    "pro": "Calcium salts may reduce levothyroxine bioavailability.",
    "action_bn": "সাধারণত কয়েক ঘণ্টা ব্যবধান রাখা হয়; label অনুসরণ করুন।",
    "action_en": "A several-hour separation is commonly used; follow the label.",
    "source": "Product label"
  },
  {
    "id": "LEVO_IRON",
    "generic": [
      "levothyroxine",
      "thyroxine"
    ],
    "type": "nutrient",
    "with_bn": "আয়রন",
    "with_en": "Iron",
    "severity": "timing",
    "bn": "আয়রন supplement লেভোথাইরক্সিনের absorption কমাতে পারে।",
    "en": "Iron supplements can reduce levothyroxine absorption.",
    "pro": "Iron salts can bind/reduce levothyroxine absorption.",
    "action_bn": "Label অনুযায়ী spacing রাখুন।",
    "action_en": "Separate according to the product label.",
    "source": "Product label"
  },
  {
    "id": "LEVO_MG",
    "generic": [
      "levothyroxine",
      "thyroxine"
    ],
    "type": "supplement",
    "with_bn": "ম্যাগনেসিয়াম/অ্যান্টাসিড",
    "with_en": "Magnesium/antacids",
    "severity": "timing",
    "bn": "ম্যাগনেসিয়াম বা কিছু antacid-এর সাথে spacing প্রয়োজন হতে পারে।",
    "en": "Spacing may be needed with magnesium or some antacid products.",
    "pro": "Polyvalent cations/antacids may reduce absorption.",
    "action_bn": "Label অনুযায়ী ব্যবধান রাখুন।",
    "action_en": "Separate according to the label.",
    "source": "Product label"
  },
  {
    "id": "MET_B12",
    "generic": [
      "metformin"
    ],
    "type": "nutrient",
    "with_bn": "ভিটামিন B12",
    "with_en": "Vitamin B12",
    "severity": "monitor",
    "bn": "দীর্ঘমেয়াদি metformin ব্যবহারে Vitamin B12 কমে যেতে পারে।",
    "en": "Long-term metformin use can be associated with lower vitamin B12 levels.",
    "pro": "Long-term therapy can be associated with reduced B12 concentrations.",
    "action_bn": "ঝুঁকি/উপসর্গ থাকলে B12 assessment বিবেচনা করুন।",
    "action_en": "Consider B12 assessment when clinically indicated.",
    "source": "Clinical guidance/label"
  },
  {
    "id": "PPI_B12",
    "generic": [
      "omeprazole",
      "esomeprazole",
      "pantoprazole",
      "lansoprazole",
      "rabeprazole"
    ],
    "type": "nutrient",
    "with_bn": "ভিটামিন B12",
    "with_en": "Vitamin B12",
    "severity": "monitor",
    "bn": "দীর্ঘমেয়াদি PPI ব্যবহারে কিছু মানুষের B12 status বিবেচনা করা লাগতে পারে।",
    "en": "Long-term PPI use may warrant B12 consideration in some people.",
    "pro": "Long-term acid suppression may affect food-bound B12 absorption.",
    "action_bn": "ঝুঁকি থাকলে assessment বিবেচনা করুন।",
    "action_en": "Consider assessment when risk factors are present.",
    "source": "Label/clinical guidance"
  },
  {
    "id": "PPI_MG",
    "generic": [
      "omeprazole",
      "esomeprazole",
      "pantoprazole",
      "lansoprazole",
      "rabeprazole"
    ],
    "type": "nutrient",
    "with_bn": "ম্যাগনেসিয়াম",
    "with_en": "Magnesium",
    "severity": "monitor",
    "bn": "দীর্ঘমেয়াদি PPI ব্যবহারে বিরলভাবে magnesium কমতে পারে।",
    "en": "Long-term PPI use can rarely be associated with low magnesium.",
    "pro": "Prolonged PPI therapy has label warnings regarding hypomagnesemia.",
    "action_bn": "High-risk/long-term use-এ monitoring বিবেচনা করুন।",
    "action_en": "Consider monitoring in selected high-risk or long-term users.",
    "source": "Product label"
  },
  {
    "id": "WARF_VITK",
    "generic": [
      "warfarin"
    ],
    "type": "food",
    "with_bn": "ভিটামিন K-সমৃদ্ধ খাবার",
    "with_en": "Vitamin K-rich foods",
    "severity": "monitor",
    "bn": "Vitamin K-সমৃদ্ধ খাবার সম্পূর্ণ বন্ধ নয়; intake consistent রাখা গুরুত্বপূর্ণ।",
    "en": "Vitamin K-rich foods do not need to be eliminated; consistent intake is important.",
    "pro": "Large changes in vitamin K intake can alter anticoagulation response.",
    "action_bn": "খাদ্য intake consistent রাখুন এবং INR clinician অনুযায়ী monitor করুন।",
    "action_en": "Keep intake consistent and monitor INR as clinically indicated.",
    "source": "Guideline/label"
  },
  {
    "id": "STAT_GRAPE",
    "generic": [
      "atorvastatin",
      "simvastatin",
      "lovastatin"
    ],
    "type": "food",
    "with_bn": "গ্রেপফ্রুট",
    "with_en": "Grapefruit",
    "severity": "context",
    "bn": "গ্রেপফ্রুট কিছু statin-এর drug exposure বাড়াতে পারে।",
    "en": "Grapefruit can increase exposure to some statins.",
    "pro": "CYP3A4-mediated interaction is product- and dose-dependent.",
    "action_bn": "Product-specific advice অনুসরণ করুন।",
    "action_en": "Follow product-specific advice.",
    "source": "Product label"
  },
  {
    "id": "TET_MIN",
    "generic": [
      "doxycycline",
      "tetracycline",
      "minocycline"
    ],
    "type": "supplement",
    "with_bn": "ক্যালসিয়াম/আয়রন/ম্যাগনেসিয়াম/জিঙ্ক",
    "with_en": "Calcium/Iron/Magnesium/Zinc",
    "severity": "timing",
    "bn": "এই minerals কিছু tetracycline antibiotic-এর absorption কমাতে পারে।",
    "en": "These minerals can reduce absorption of some tetracycline antibiotics.",
    "pro": "Chelation with polyvalent cations reduces absorption.",
    "action_bn": "Mineral supplement ও antibiotic-এর মাঝে label অনুযায়ী spacing রাখুন।",
    "action_en": "Separate mineral supplements according to the product label.",
    "source": "Product label"
  },
  {
    "id": "FQ_MIN",
    "generic": [
      "ciprofloxacin",
      "levofloxacin",
      "moxifloxacin",
      "ofloxacin"
    ],
    "type": "supplement",
    "with_bn": "ক্যালসিয়াম/আয়রন/ম্যাগনেসিয়াম/জিঙ্ক",
    "with_en": "Calcium/Iron/Magnesium/Zinc",
    "severity": "timing",
    "bn": "Mineral supplement কিছু fluoroquinolone-এর absorption কমাতে পারে।",
    "en": "Mineral supplements can reduce absorption of some fluoroquinolones.",
    "pro": "Chelation with polyvalent cations reduces bioavailability.",
    "action_bn": "Label অনুযায়ী spacing রাখুন।",
    "action_en": "Separate according to the product label.",
    "source": "Product label"
  },
  {
    "id": "ACE_K",
    "generic": [
      "lisinopril",
      "enalapril",
      "ramipril",
      "perindopril",
      "captopril"
    ],
    "type": "nutrient",
    "with_bn": "পটাশিয়াম/সল্ট সাবস্টিটিউট",
    "with_en": "Potassium/salt substitutes",
    "severity": "caution",
    "bn": "Potassium supplement বা potassium salt substitute ACE inhibitor-এর সাথে potassium বাড়াতে পারে।",
    "en": "Potassium supplements or potassium-containing salt substitutes can increase potassium with ACE inhibitors.",
    "pro": "RAAS blockade can increase serum potassium.",
    "action_bn": "Unsupervised potassium supplement এড়িয়ে চলুন; প্রয়োজনে monitor করুন।",
    "action_en": "Avoid unsupervised potassium supplementation; monitor when indicated.",
    "source": "Product label"
  },
  {
    "id": "ARB_K",
    "generic": [
      "losartan",
      "valsartan",
      "telmisartan",
      "olmesartan",
      "candesartan"
    ],
    "type": "nutrient",
    "with_bn": "পটাশিয়াম/সল্ট সাবস্টিটিউট",
    "with_en": "Potassium/salt substitutes",
    "severity": "caution",
    "bn": "Potassium supplement বা salt substitute-এর সাথে hyperkalemia risk বাড়তে পারে।",
    "en": "Potassium supplements or salt substitutes may increase hyperkalemia risk.",
    "pro": "RAAS blockade can increase serum potassium.",
    "action_bn": "প্রয়োজনে potassium monitor করুন।",
    "action_en": "Monitor potassium when clinically indicated.",
    "source": "Product label"
  },
  {
    "id": "SPIRO_K",
    "generic": [
      "spironolactone",
      "eplerenone"
    ],
    "type": "nutrient",
    "with_bn": "পটাশিয়াম",
    "with_en": "Potassium",
    "severity": "major",
    "bn": "নিজে থেকে potassium supplement নেওয়া ঝুঁকিপূর্ণ হতে পারে।",
    "en": "Unsupervised potassium supplementation can be risky.",
    "pro": "Potassium-sparing agents increase hyperkalemia risk.",
    "action_bn": "শুধু clinician supervision-এ ব্যবহার করুন।",
    "action_en": "Use potassium supplements only under clinical supervision.",
    "source": "Product label"
  },
  {
    "id": "SSRI_STJ",
    "generic": [
      "sertraline",
      "fluoxetine",
      "paroxetine",
      "citalopram",
      "escitalopram",
      "venlafaxine",
      "duloxetine"
    ],
    "type": "supplement",
    "with_bn": "St John’s wort",
    "with_en": "St John's wort",
    "severity": "major",
    "bn": "St John’s wort serotonergic antidepressant-এর সাথে গুরুতর interaction করতে পারে।",
    "en": "St John's wort can cause serious interactions with serotonergic antidepressants.",
    "pro": "Serotonergic toxicity and CYP/P-gp induction are concerns.",
    "action_bn": "নিজে থেকে একসাথে ব্যবহার করবেন না।",
    "action_en": "Avoid unsupervised combination.",
    "source": "Label/clinical reference"
  },
  {
    "id": "LOOP_ELEC",
    "generic": [
      "furosemide",
      "frusemide",
      "bumetanide",
      "torsemide"
    ],
    "type": "nutrient",
    "with_bn": "পটাশিয়াম/ম্যাগনেসিয়াম",
    "with_en": "Potassium/Magnesium",
    "severity": "monitor",
    "bn": "Loop diuretic electrolyte loss করতে পারে।",
    "en": "Loop diuretics can contribute to electrolyte losses.",
    "pro": "Loop diuresis can increase urinary potassium and magnesium loss.",
    "action_bn": "Clinical context অনুযায়ী electrolyte monitor করুন।",
    "action_en": "Monitor electrolytes according to clinical context.",
    "source": "Guideline/label"
  }
];
