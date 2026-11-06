const bookForm = document.getElementById('bookForm');
const bookList = document.getElementById('bookList');
const message = document.getElementById('message');

let books = window.bookStorage.getBooks();

bookForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('bookTitle').value.trim();
    const author = document.getElementById('bookAuthor').value.trim();
    const status = document.getElementById('bookStatus').value;

    const book = {
        title: title,
        author: author,
        status: status,
        year: '',
        coverUrl: ''
    };

    books.push(book);

    saveBooks();
    displayBooks();

    bookForm.reset();

    message.textContent = 'Book added successfully!';
});

function saveBooks() {
    window.bookStorage.saveBooks(books);
}

function displayBooks() {
    bookList.innerHTML = '';

    if (books.length === 0) {
        bookList.innerHTML =
            '<p class="empty-message">No books saved yet. Start building your collection!</p>';
    }

    for (let i = 0; i < books.length; i++) {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'saved-book';

        const cover = document.createElement('img');

        cover.src = books[i].coverUrl ||
            'https://placehold.co/100x150/261C38/B99AEF?text=No+Cover';

        cover.alt = 'Book cover';

        const info = document.createElement('div');
        info.className = 'saved-book-info';

        const title = document.createElement('h3');
        title.textContent = books[i].title;

        const author = document.createElement('p');
        author.textContent = 'Author: ' + books[i].author;

        const status = document.createElement('span');
        status.className = 'status-tag';
        status.textContent = books[i].status;

        const actions = document.createElement('div');
        actions.className = 'book-actions';

        const editButton = document.createElement('button');
        editButton.className = 'secondary-button';
        editButton.textContent = 'Edit';

        editButton.onclick = function() {
            editBook(i);
        };

        const deleteButton = document.createElement('button');
        deleteButton.className = 'danger-button';
        deleteButton.textContent = 'Delete';

        deleteButton.onclick = function() {
            deleteBook(i);
        };

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        info.appendChild(title);
        info.appendChild(author);

        if (books[i].year) {
            const year = document.createElement('p');
            year.textContent = 'Published: ' + books[i].year;
            info.appendChild(year);
        }

        info.appendChild(status);
        info.appendChild(actions);

        bookDiv.appendChild(cover);
        bookDiv.appendChild(info);

        bookList.appendChild(bookDiv);
    }

    updateJournalBookOptions();
}


function editBook(index) {
    const bookDiv = bookList.children[index];
    const info = bookDiv.querySelector('.saved-book-info');

    info.innerHTML = '';

    // Create title input
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'edit-book-input';
    titleInput.value = books[index].title;
    titleInput.placeholder = 'Book title';

    // Create author input
    const authorInput = document.createElement('input');
    authorInput.type = 'text';
    authorInput.className = 'edit-book-input';
    authorInput.value = books[index].author;
    authorInput.placeholder = 'Author';

    // Create status dropdown
    const statusInput = document.createElement('select');
    statusInput.className = 'edit-book-input';

    const statuses = ['Want to Read', 'Reading', 'Completed'];

    for (let i = 0; i < statuses.length; i++) {
        const option = document.createElement('option');
        option.value = statuses[i];
        option.textContent = statuses[i];

        if (statuses[i] === books[index].status) {
            option.selected = true;
        }

        statusInput.appendChild(option);
    }

    // Create Save button
    const saveButton = document.createElement('button');
    saveButton.className = 'secondary-button';
    saveButton.textContent = 'Save';

    saveButton.onclick = function() {
        if (titleInput.value.trim() === '' ||
            authorInput.value.trim() === '') {
            message.textContent = 'Book title and author cannot be empty.';
            return;
        }

        books[index].title = titleInput.value.trim();
        books[index].author = authorInput.value.trim();
        books[index].status = statusInput.value;

        saveBooks();
        displayBooks();

        message.textContent = 'Book updated successfully!';
    };

    // Create Cancel button
    const cancelButton = document.createElement('button');
    cancelButton.className = 'danger-button';
    cancelButton.textContent = 'Cancel';

    cancelButton.onclick = function() {
        displayBooks();
    };

    // Add everything to the book information section
    const actions = document.createElement('div');
    actions.className = 'book-actions';

    actions.appendChild(saveButton);
    actions.appendChild(cancelButton);

    info.appendChild(titleInput);
    info.appendChild(authorInput);
    info.appendChild(statusInput);
    info.appendChild(actions);
}


function deleteBook(index) {
    const confirmDelete = confirm(
        'Are you sure you want to delete this book?'
    );

    if (confirmDelete) {
        books.splice(index, 1);

        saveBooks();
        displayBooks();

        message.textContent = 'Book deleted successfully!';
    }
}

// READING PROGRESS CALCULATOR

const calculateButton = document.getElementById('calculateButton');

calculateButton.addEventListener('click', function() {
    const pagesReadInput = document.getElementById('pagesRead').value;
    const totalPagesInput = document.getElementById('totalPages').value;
    const pagesRead = Number(pagesReadInput);
    const totalPages = Number(totalPagesInput);
    const progressResult = document.getElementById('progressResult');

    if (pagesReadInput === '' || totalPagesInput === '') {
        progressResult.textContent = 'Please enter both page numbers.';
        return;
    }

    if (pagesRead < 0 || totalPages <= 0) {
        progressResult.textContent = 'Please enter valid page numbers.';
        return;
    }

    if (pagesRead > totalPages) {
        progressResult.textContent = 'Pages read cannot exceed total pages.';
        return;
    }

    const percentage = (pagesRead / totalPages) * 100;

    progressResult.innerHTML = `
        <p class="progress-label">Reading Progress: ${percentage.toFixed(2)}%</p>
        <div class="progress-track" role="progressbar"
            aria-valuenow="${percentage.toFixed(2)}"
            aria-valuemin="0" aria-valuemax="100"
            aria-label="Reading progress">
            <div class="progress-fill" style="width: ${percentage}%;">
                ${percentage > 0 ? '<span class="progress-sparkle">✦</span>' : ''}
            </div>
        </div>
    `;
});


// PERSONAL READING JOURNAL

const journalForm = document.getElementById('journalForm');
const journalList = document.getElementById('journalList');

const journalBook = document.getElementById('journalBook');
const journalQuote = document.getElementById('journalQuote');
const journalThoughts = document.getElementById('journalThoughts');

const journalMessage = document.getElementById('journalMessage');
const journalSaveButton = document.getElementById('journalSaveButton');
const cancelJournalButton = document.getElementById('cancelJournalButton');

let journalEntries = window.bookStorage.getJournalEntries();

let editingJournalIndex = -1;

function saveJournal() {
    window.bookStorage.saveJournalEntries(journalEntries);
}

function updateJournalBookOptions() {
    const selectedBook = journalBook.value;

    journalBook.innerHTML =
        '<option value="">Choose a saved book</option>';

    for (let i = 0; i < books.length; i++) {
        const option = document.createElement('option');

        option.value = books[i].title;
        option.textContent = books[i].title;

        journalBook.appendChild(option);
    }

    journalBook.value = selectedBook;
}

function displayJournal() {
    journalList.innerHTML = '';

    if (journalEntries.length === 0) {
        journalList.innerHTML =
            '<div class="card"><p class="empty-message">No journal entries yet. Your reading memories will appear here.</p></div>';
    }

    for (let i = 0; i < journalEntries.length; i++) {
        const entry = journalEntries[i];

        const entryCard = document.createElement('div');
        entryCard.className = 'journal-card';

        const title = document.createElement('h3');
        title.textContent = entry.bookTitle;

        const date = document.createElement('p');
        date.className = 'journal-date';
        date.textContent = entry.date;

        entryCard.appendChild(title);
        entryCard.appendChild(date);

        if (entry.quote !== '') {
            const quote = document.createElement('p');
            quote.className = 'journal-quote';
            quote.textContent = '"' + entry.quote + '"';

            entryCard.appendChild(quote);
        }

        const thoughts = document.createElement('p');
        thoughts.className = 'journal-thoughts';
        thoughts.textContent = entry.thoughts;

        const actions = document.createElement('div');
        actions.className = 'book-actions';

        const editButton = document.createElement('button');
        editButton.className = 'secondary-button';
        editButton.textContent = 'Edit';

        editButton.onclick = function() {
            editJournal(i);
        };

        const deleteButton = document.createElement('button');
        deleteButton.className = 'danger-button';
        deleteButton.textContent = 'Delete';

        deleteButton.onclick = function() {
            deleteJournal(i);
        };

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        entryCard.appendChild(thoughts);
        entryCard.appendChild(actions);

        journalList.appendChild(entryCard);
    }
}

journalForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const bookTitle = journalBook.value;
    const quote = journalQuote.value.trim();
    const thoughts = journalThoughts.value.trim();

    if (bookTitle === '') {
        journalMessage.textContent =
            'Please select a book from your reading list.';
        return;
    }

    if (thoughts === '') {
        journalMessage.textContent =
            'Please write your thoughts before saving.';
        return;
    }

    if (editingJournalIndex === -1) {
        const entry = {
            bookTitle: bookTitle,
            quote: quote,
            thoughts: thoughts,
            date: new Date().toLocaleDateString()
        };

        journalEntries.push(entry);

        journalMessage.textContent = 'Journal entry saved successfully!';
    }
    else {
        journalEntries[editingJournalIndex].bookTitle = bookTitle;
        journalEntries[editingJournalIndex].quote = quote;
        journalEntries[editingJournalIndex].thoughts = thoughts;

        journalMessage.textContent = 'Journal entry updated successfully!';
    }

    saveJournal();
    displayJournal();

    journalForm.reset();

    editingJournalIndex = -1;
    journalSaveButton.textContent = 'Save Journal Entry';
    cancelJournalButton.style.display = 'none';
});

function editJournal(index) {
    editingJournalIndex = index;

    journalBook.value = journalEntries[index].bookTitle;
    journalQuote.value = journalEntries[index].quote;
    journalThoughts.value = journalEntries[index].thoughts;

    journalSaveButton.textContent = 'Update Journal Entry';
    cancelJournalButton.style.display = 'inline-block';

    journalMessage.textContent = 'Editing your journal entry.';
    
    journalForm.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

function deleteJournal(index) {
    const confirmDelete = confirm(
        'Are you sure you want to delete this journal entry?'
    );

    if (confirmDelete) {
        journalEntries.splice(index, 1);

        saveJournal();
        displayJournal();

        journalMessage.textContent =
            'Journal entry deleted successfully!';
    }
}

cancelJournalButton.addEventListener('click', function() {
    journalForm.reset();

    editingJournalIndex = -1;

    journalSaveButton.textContent = 'Save Journal Entry';
    cancelJournalButton.style.display = 'none';

    journalMessage.textContent = '';
});

displayBooks();
displayJournal();