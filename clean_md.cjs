const fs = require('fs');
const path = require('path');
const mdDir = path.join(process.cwd(), 'MD');

try {
    const files = fs.readdirSync(mdDir);
    for (const file of files) {
        if (file.endsWith('.md')) {
            let content = fs.readFileSync(path.join(mdDir, file), 'utf8');
            const initialLength = content.length;

            // Match AI citation tags across newlines
            //  is \uE200 and  is \uE201
            content = content.replace(/\uE200[\s\S]*?\uE201/g, '');

            // Any remaining single line tags
            content = content.replace(/.*?/g, '');

            if (content.length !== initialLength) {
                fs.writeFileSync(path.join(mdDir, file), content, 'utf8');
                console.log('Cleaned AI tags from: ' + file);
            }
        }
    }
} catch (err) {
    console.error(err);
}
