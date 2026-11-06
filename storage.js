// iMybook stores its information in the browser's Local Storage.
// Both pages share the same origin because main.js serves them from localhost.

function getList(key) {
    try {
        const savedData = localStorage.getItem(key);
        return savedData ? JSON.parse(savedData) : [];
    } catch (error) {
        console.error('Could not read ' + key + ' from Local Storage:', error);
        return [];
    }
}

function saveList(key, items) {
    try {
        localStorage.setItem(key, JSON.stringify(items));
    } catch (error) {
        console.error('Could not save ' + key + ' to Local Storage:', error);
    }
}

// Migrate data from the previous JSON-file version without deleting the backup.
(function migrateOldData() {
    try {
        if (localStorage.getItem('imybook_data_migrated') === 'true') return;

        const fs = require('fs');
        const path = require('path');
        const dataFile = path.join(__dirname, 'imybook-data.json');

        if (fs.existsSync(dataFile)) {
            const oldData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

            if (localStorage.getItem('books') === null && Array.isArray(oldData.books)) {
                saveList('books', oldData.books);
            }
            if (localStorage.getItem('journalEntries') === null && Array.isArray(oldData.journalEntries)) {
                saveList('journalEntries', oldData.journalEntries);
            }
            if (localStorage.getItem('recommendations') === null && Array.isArray(oldData.recommendations)) {
                saveList('recommendations', oldData.recommendations);
            }
        }

        localStorage.setItem('imybook_data_migrated', 'true');
    } catch (error) {
        console.error('Could not migrate previous iMybook data:', error);
    }
})();

window.bookStorage = {
    getBooks: function() { return getList('books'); },
    saveBooks: function(books) { saveList('books', books); },
    getJournalEntries: function() { return getList('journalEntries'); },
    saveJournalEntries: function(entries) { saveList('journalEntries', entries); },
    getRecommendations: function() { return getList('recommendations'); },
    saveRecommendations: function(items) { saveList('recommendations', items); }
};
