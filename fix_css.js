import fs from 'fs';
const path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');
css = css.replace(/height:\s*3rem;/g, 'min-height: 3rem;');
fs.writeFileSync(path, css);
console.log('Fixed CSS');
