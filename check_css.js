const fs = require('fs');
const buf = fs.readFileSync('styles.css');
// Find the index of '.nav-menu'
const idx = buf.indexOf(Buffer.from('.nav-menu'));
if (idx !== -1) {
    console.log(buf.slice(idx, idx + 200).toString('hex'));
    console.log("String representation:");
    console.dir(buf.toString('utf8', idx, idx + 200));
}
