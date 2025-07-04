const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const assetsDir = path.join(distDir, 'assets');

// 1. Знаходимо перший .css файл у dist/assets/
const cssFile = fs.readdirSync(assetsDir).find(f => f.endsWith('.css'));
if (!cssFile) {
  console.error('❌ CSS файл не знайдено у dist/assets/');
  process.exit(1);
}
const cssHref = `assets/${cssFile}`;

// 2. Проходимо по всіх .html у dist/
fs.readdirSync(distDir)
  .filter(f => f.endsWith('.html'))
  .forEach(htmlFile => {
    const htmlPath = path.join(distDir, htmlFile);
    let html = fs.readFileSync(htmlPath, 'utf8');
    // Якщо лінк вже є — пропускаємо
    if (html.includes(cssHref)) return;
    // Вставляємо перед </head>
    html = html.replace(
      /<\/head>/i,
      `  <link rel="stylesheet" href="${cssHref}" />\n</head>`
    );
    fs.writeFileSync(htmlPath, html, 'utf8');
    console.log(`✅ Додано CSS у ${htmlFile}`);
  });

// 3. Додаємо main-*.js у всі HTML-файли dist
const mainJsFile = fs.readdirSync(assetsDir).find(f => f.startsWith('main-') && f.endsWith('.js'));
if (!mainJsFile) {
  console.error('❌ JS файл не знайдено у dist/assets/');
  process.exit(1);
}
const jsSrc = `assets/${mainJsFile}`;

fs.readdirSync(distDir)
  .filter(f => f.endsWith('.html'))
  .forEach(htmlFile => {
    const htmlPath = path.join(distDir, htmlFile);
    let html = fs.readFileSync(htmlPath, 'utf8');
    // Якщо скрипт вже є — пропускаємо
    if (html.includes(jsSrc)) return;
    // Вставляємо перед </body>
    html = html.replace(
      /<\/body>/i,
      `  <script type="module" src="${jsSrc}"></script>\n</body>`
    );
    fs.writeFileSync(htmlPath, html, 'utf8');
    console.log(`✅ Додано JS у ${htmlFile}`);
  });

console.log('🎉 Всі HTML-файли у dist тепер мають лінк на CSS!'); 