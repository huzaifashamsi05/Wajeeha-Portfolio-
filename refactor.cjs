const fs = require('fs');
let code = fs.readFileSync('routes/admin.js', 'utf8');

// Convert routes to async
code = code.replace(/router\.(get|post|put|delete)\('([^']+)',\s*(upload\.single\('[^']+'\),\s*)?(validateCsrfToken,\s*)?\(req, res\)\s*=>\s*{/g, "router.$1('$2', $3$4async (req, res) => {");
code = code.replace(/router\.post\('\/login',\s*loginLimiter,\s*validateCsrfToken,\s*\(req, res\)\s*=>\s*{/, "router.post('/login', loginLimiter, validateCsrfToken, async (req, res) => {");

// Single line arrow functions
code = code.replace(/router\.get\('([^']+)',\s*\(req, res\)\s*=>\s*res\.json\(db\.prepare\('([^']+)'\)\.all\(\)\)\);/g, "router.get('$1', async (req, res) => { res.json((await db.execute('$2')).rows); });");
code = code.replace(/router\.get\('([^']+)',\s*\(req, res\)\s*=>\s*res\.json\(db\.prepare\('([^']+)'\)\.get\(\)\s*\|\|\s*\{\}\)\);/g, "router.get('$1', async (req, res) => { res.json((await db.execute('$2')).rows[0] || {}); });");
code = code.replace(/router\.get\('\/check-auth',\s*\(req, res\)\s*=>\s*res\.json\(\{ authenticated: true \}\)\);/g, "router.get('/check-auth', async (req, res) => { res.json({ authenticated: true }); });");

// Queries
code = code.replace(/db\.prepare\('([^']+)'\)\.get\(\)/g, "(await db.execute('$1')).rows[0]");
code = code.replace(/db\.prepare\('([^']+)'\)\.all\(\)/g, "(await db.execute('$1')).rows");
code = code.replace(/db\.prepare\('([^']+)'\)\s*\.run\(([^)]*)\)/g, "await db.execute({ sql: '$1', args: [$2] })");

fs.writeFileSync('routes/admin.js', code);
console.log("admin.js refactored.");
