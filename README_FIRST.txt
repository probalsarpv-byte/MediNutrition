SHUDDHO MEDNUTRI PREMIUM V4 GREEN — NEW VERSION
=================================================

এই version-এ user feedback অনুযায়ী major UI/UX redesign করা হয়েছে।

WHAT CHANGED
------------
1. Premium greenish medical-tech palette
2. Heavier/bolder English + Bangla typography
3. Real Three.js hero animation with capsule/molecular particles
4. Interaction workspace-এ Three.js network graph
5. Long scrolling single-page navigation বাদ
6. App-like separate views:
   - Home
   - Database
   - Interactions
   - Supplements
   - My Medicines
7. Home page-এ database summary FIRST
8. Common & Useful Medicines summary cards AFTER database summary
9. Full medicine list homepage-এ আর render হয় না
10. Database click করলে full database view open হয়
11. My Medicines click করলে dedicated view open হয়
12. Interaction checker এখন selection-based:
    - Search database
    - Add medicine directly
    - My Medicines থেকে এক click-এ add
    - No need to manually type exact generic names
13. Medicine cards/detail-এ Add to Interaction button
14. My Medicines -> Check All Interactions
15. Drug–Drug + Food + Nutrient + Supplement interaction layers preserved
16. Rich medicine detail tabs preserved
17. Bangla / English toggle preserved
18. Public / Professional mode preserved
19. 1080×1350 share card preserved

UPLOAD
------
Extract ZIP and upload these files to GitHub repository ROOT:
index.html
app.js
style.css
data-loader.js
interaction-rules.js
i18n.js
curated-home.js
404.html

Then Commit changes. GitHub Pages will redeploy automatically.

IMPORTANT
---------
The full medicine corpus still loads remotely. Interaction and label sources also load
remotely when needed. Where structured food/nutrient/supplement interaction evidence is not
available, the app does not invent it.
