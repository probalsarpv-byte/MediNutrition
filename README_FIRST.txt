SHUDDHO MEDNUTRI PREMIUM V3 — CORRECTED UPDATE
===============================================

এই version-এ আগের আলোচনার missing/incorrect অংশগুলো একত্রে ঠিক করা হয়েছে।

UPLOAD TO GITHUB ROOT
---------------------
index.html
app.js
style.css
data-loader.js
interaction-rules.js
i18n.js
curated-home.js
404.html

তারপর GitHub -> Settings -> Pages -> Deploy from branch -> main -> /(root)

MAJOR FIXES
-----------
1. বাংলা + English toggle
2. Public Mode = সাধারণ মানুষ
3. Professional Mode = doctor / nutritionist / pharmacist
4. Raw JSON/developer professional view completely removed
5. Home page-এ full database render হয় না
6. 40–50 curated/common medicine cards only
7. Full 71k+ corpus remains searchable in background
8. Group-wise Database browsing
9. Rich medicine details:
   Overview
   Uses
   Mechanism
   Drug–Drug
   Food
   Nutrient
   Supplement/Herbal
   Timing
   Side Effects
   Nutrition Support
   Monitoring
   Sources
10. Medicine open করলে DDI auto-load
11. Food/Nutrient/Supplement interaction rule layer
12. openFDA label details when available
13. My Medicine List -> pairwise interaction review
14. 1080×1350 share-card download
15. More premium navy/cyan/blue/violet color system
16. Three.js hero preserved
17. Mobile layout preserved

IMPORTANT LIMITATION
--------------------
The Bangladesh medicine corpus does not contain a full bilingual clinical monograph for every
generic. Therefore Bengali UI and curated interaction summaries are bilingual, while some
openFDA label excerpts remain in English and are clearly identified as label text. The app
does not fabricate Bengali clinical details that are not supported by a source.

Food/nutrient/supplement interaction rules are expanded but not complete for every medicine.
Where no structured evidence is available, the app says so.
