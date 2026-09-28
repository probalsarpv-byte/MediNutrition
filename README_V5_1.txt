# Shuddho MedNutri V5.1 Corrective Patch

Replace only:
- app.js
- style.css

Fixes:
1. Supplement view no longer calls a missing function.
2. Bangladesh supplement Details buttons work.
3. Global Formulation Intelligence Details buttons work.
4. Home search is more unified: medicine + Bangladesh supplement + formulation profile + NIH DSLD handoff.
5. Search query carries into the NIH DSLD supplement view.
6. Day / Night mode added; theme preference is saved.
7. requestIdleCallback now has a browser-safe fallback.
8. Drug-detail mechanism/side-effect fallbacks restored for common generics.
9. Professional mode monitoring can show deeper source sections when available.
10. Interaction review adds supplement-food, supplement-nutrient and supplement-caution findings.
11. Interaction graph now has a readable legend for selected nodes.
12. Existing compact white graph is preserved.
13. Local supplement source links are available in details.

Important:
- This patch does NOT claim all international countries are covered. NIH DSLD is primarily a U.S. label database.
- Bangladesh verified supplement data remain limited and should be expanded from official manufacturer sources.
- Interaction rules remain curated and not exhaustive.
