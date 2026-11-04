/* Explicit archival fixture for historical content/alias/save regressions.
 * Real replacement-bank integration lives in hidden-gem-release-browser.cjs.
 */
const fs=require('node:fs');
module.exports=async context=>context.route('**/games/hidden-gem/questions.js*',route=>route.fulfill({contentType:'application/javascript',body:fs.readFileSync('content/archive/2026-11-02-pre-large-banks/questions.js','utf8')}));
