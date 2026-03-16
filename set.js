const fs = require('fs-extra');
const path = require("path");

// Load environment variables from set.env if exists
if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

const databasePath = path.join(__dirname, './database.db');

// Use environment variables with fallbacks
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;

module.exports = { 
    session: process.env.SESSION_ID || '',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "Confronter",
    NUMERO_OWNER: process.env.OWNER_NUMBER || "254796283064",
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT: process.env.BOT_NAME || 'DEADPOOL-V4',
    URL: process.env.BOT_MENU_LINKS || 'https://telegra.ph/file/f6230a0cb5b118fa01561.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    WARN_COUNT: process.env.WARN_COUNT || '3',
    ETAT: process.env.PRESENCE || '',
    CHATBOT: process.env.PM_CHATBOT || 'no',
    DP: process.env.STARTING_BOT_MESSAGE || "yes",
    ADM: process.env.ANTI_DELETE_MESSAGE || 'no',
    DATABASE_URL: DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "sqlite" 
        : DATABASE_URL,
    PACKNAME: process.env.PACKNAME || 'DEADPOOL-V4',
    AUTHOR: process.env.AUTHOR || 'CONFRONTER',
    AUTOLIKE: process.env.AUTO_LIKE_STATUS || 'true',
    AUTOREAD: process.env.AUTO_READ_STATUS || 'true',
    ANTICALL: process.env.ANTICALL || 'false',
    WELCOME: process.env.WELCOME || 'false'
};

let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
