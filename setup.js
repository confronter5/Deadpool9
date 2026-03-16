const fs = require('fs');
const path = require('path');

// Create necessary directories for Heroku ephemeral filesystem
const dirs = ['tmp', 'session', 'media', 'database'];

dirs.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
    }
});

console.log('Setup complete - all directories created');
