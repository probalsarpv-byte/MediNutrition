# Shuddho MedNutri V5 — Consolidated Clean Build

এই ZIP আর patch নয়। এটি clean V5 base.

## Upload
GitHub repo root-এ এই files upload/replace করুন:
- index.html
- 404.html
- style.css
- config.js
- i18n.js
- rules.js
- data-loader.js
- app.js

পুরোনো `supplement-data.js`, `curated-home.js`, `interaction-rules.js` আর V5-এর জন্য দরকার নেই।
চাইলে repo-তে রেখে দিলেও index.html এগুলো load করবে না।

## V5 features
- Fast home: full 22 MB medicine corpus initial page render block করে না
- Bangladesh full medicine corpus loads lazily
- App-like Home / Database / Interactions / Supplements / My Stack
- Green premium design + bold Bangla/English fonts
- Three.js hero
- White compact interaction graph
- 40–48 curated common medicine cards after corpus load
- Rich medicine details with label + DDI + food/nutrient/supplement/timing tabs
- Public / Professional mode
- Bangla / English UI
- My Stack supports medicine + supplement
- Automatic mixed interaction review
- Duplicate supplement ingredient detection
- Bangladesh verified supplement formulation focus
- Bangladesh medicine-corpus nutrition formulations remain available via medicine database/search
- International supplements use LIVE NIH DSLD API instead of a fake 6–7 product list
- DSLD currently contains 200,000+ U.S. dietary supplement labels
- DSLD product details include label ingredients, forms, quantities, directions and precautions when present
- Global formulation intelligence maps common supplement ingredients to mechanism, absorption, food, drug and nutrient considerations

## Important data notes
- Bangladesh medicine corpus is a reference corpus, not presented as the official DGDA database.
- NIH DSLD label data are manufacturer/distributor-declared label information; a listing is not a recommendation or proof of effectiveness.
- Food/nutrient/supplement interaction rules are curated but not exhaustive.
- Where a supported clinical detail is unavailable, V5 shows that limitation instead of inventing data.
