SHUDDHO MEDNUTRI — FULL CORPUS UPLOAD-ONLY VERSION
=================================================

এই ZIP-এর files GitHub repository-এর ROOT-এ upload করলেই হবে।

FILES:
- index.html
- app.js
- style.css
- data-loader.js
- 404.html
- DATA_NOTICE.txt

NO BACKEND / NO NODE / NO PYTHON / NO BUILD STEP

GitHub:
1. Repo খুলুন
2. Add file -> Upload files
3. উপরের files upload করুন
4. Commit changes
5. Settings -> Pages
6. Deploy from a branch
7. main / root
8. Save

WHAT THIS VERSION DOES
----------------------
- Full Bangladesh medicine corpus REMOTELY loads from the licensed public GitHub corpus
- 71,795 medicine rows become searchable
- Allopathic / Ayurveda / Unani / Herbal / Homeopathy group browsing
- 1-character Google-style suggestions
- Live brand/generic counts
- 1000 nutrition/supplement formulation candidates generated from corpus keywords
- DDI checker lazy-loads the 2026 DailyMed-derived Zenodo interaction dataset
- Public mode = সাধারণ মানুষ
- Professional mode = doctor / nutritionist / pharmacist
- No developer/raw JSON professional screen
- Three.js premium hero preserved
- Mobile UI preserved
- My Medicine List preserved

FIRST LOAD
----------
The source medicine CSV is ~22 MB. প্রথমবার mobile connection অনুযায়ী কয়েক সেকেন্ড থেকে
কিছুটা বেশি সময় লাগতে পারে. Browser cache পরের load দ্রুত করতে পারে.

IMPORTANT
---------
This package references the public datasets at runtime; the 22 MB corpus is not duplicated
inside this ZIP. This keeps the GitHub upload very simple and avoids a very large bundled file.
