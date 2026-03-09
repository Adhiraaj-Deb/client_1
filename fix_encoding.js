const fs = require('fs');

try {
    const raw = fs.readFileSync('styles.css');
    // Convert buffer to string, stripping null bytes which are artifacts of UTF-16 in a UTF-8 read
    let cleaned = raw.toString('utf8').replace(/\0/g, '');

    // Also normalize newlines to prevent \r\r\n issues
    cleaned = cleaned.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // Write it back as pure UTF-8
    fs.writeFileSync('styles.css', cleaned, 'utf8');
    console.log("Successfully cleaned styles.css encoding!");
} catch (e) {
    console.error(e);
}
