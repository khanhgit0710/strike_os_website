const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/(<div class="service-card[^>]*?>)/g, '$1\n                        <div class="card-inner-bg"></div>');
fs.writeFileSync('index.html', html);
console.log('done');
