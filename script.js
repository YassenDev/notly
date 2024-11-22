class NoteMaker {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem('notes')) || [];
        this.initializeElements();
        this.addEventListeners();
        this.renderNotes();
        this.loadTheme();
    }

    initializeElements() {
        this.noteTitle = document.getElementById('noteTitle');
        this.noteContent = document.getElementById('noteContent');
        this.noteCategory = document.getElementById('noteCategory');
        this.addNoteBtn = document.getElementById('addNote');
        this.searchInput = document.getElementById('searchInput');
        this.notesContainer = document.getElementById('notesContainer');
        this.toggleThemeBtn = document.getElementById('toggleTheme');
        this.newNoteBtn = document.getElementById('newNoteBtn');
        this.noteModal = document.getElementById('noteModal');
        this.closeModalBtn = document.getElementById('closeModal');
        this.allNotesBtn = document.querySelector('[data-filter="all"]');
        this.favoritesBtn = document.querySelector('[data-filter="favorites"]');
    }

    addEventListeners() {
        this.addNoteBtn.addEventListener('click', () => this.addNote());
        this.searchInput.addEventListener('input', () => this.searchNotes());
        this.toggleThemeBtn.addEventListener('click', () => this.toggleTheme());
        this.newNoteBtn.addEventListener('click', () => this.openModal());
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        this.noteModal.addEventListener('click', (e) => {
            if (e.target === this.noteModal) this.closeModal();
        });
        this.allNotesBtn.addEventListener('click', () => this.filterNotes('all'));
        this.favoritesBtn.addEventListener('click', () => this.filterNotes('favorites'));
    }

    openModal() {
        this.noteModal.classList.remove('hidden');
        this.noteTitle.focus();
    }

    closeModal() {
        this.noteModal.classList.add('hidden');
        this.clearForm();
    }

    addNote() {
        if (!this.noteTitle.value || !this.noteContent.value) {
            alert('Please fill in both title and content!');
            return;
        }

        const note = {
            id: Date.now(),
            title: this.noteTitle.value,
            content: this.noteContent.value,
            category: this.noteCategory.value,
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }),
            isFavorite: false
        };

        this.notes.unshift(note);
        this.saveNotes();
        this.renderNotes();
        this.closeModal();
    }

    renderNotes(notesToRender = this.notes) {
        this.notesContainer.innerHTML = notesToRender.map(note => `
            <div class="bg-white dark:bg-dark-100 rounded-2xl shadow-lg p-6 space-y-4 transform transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
                <div class="flex justify-between items-start">
                    <h3 class="text-xl font-semibold text-primary">${note.title}</h3>
                    <button onclick="noteMaker.toggleFavorite(${note.id})" class="text-gray-400 hover:text-yellow-500 transition-colors">
                        <i class="fas fa-star ${note.isFavorite ? 'text-yellow-500' : ''}"></i>
                    </button>
                </div>
                <p class="text-gray-600 dark:text-gray-300">${note.content}</p>
                <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span class="px-3 py-1 rounded-full text-sm font-medium ${this.getCategoryColor(note.category)}">
                        ${note.category}
                    </span>
                    <span class="text-sm text-gray-500 dark:text-gray-400">${note.date}</span>
                </div>
                <div class="flex gap-2">
                    <button onclick="noteMaker.editNote(${note.id})" 
                        class="flex-1 bg-gray-100 dark:bg-dark-200 hover:bg-gray-200 dark:hover:bg-dark-100 text-gray-700 dark:text-gray-300 font-medium px-4 py-2 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2">
                        <i class="fas fa-edit"></i>
                        Edit
                    </button>
                    <button onclick="noteMaker.deleteNote(${note.id})" 
                        class="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    filterNotes(filter) {
        if (filter === 'all') {
            this.renderNotes(this.notes);
        } else if (filter === 'favorites') {
            const favoriteNotes = this.notes.filter(note => note.isFavorite);
            this.renderNotes(favoriteNotes);
        }
    }
    

    toggleFavorite(id) {
        const note = this.notes.find(note => note.id === id);
        if (note) {
            note.isFavorite = !note.isFavorite;
            this.saveNotes();
            this.renderNotes();
        }
    }

    editNote(id) {
        const note = this.notes.find(note => note.id === id);
        if (note) {
            this.noteTitle.value = note.title;
            this.noteContent.value = note.content;
            this.noteCategory.value = note.category;
            this.openModal();
            this.notes = this.notes.filter(n => n.id !== id);
        }
    }

    deleteNote(id) {
        if (confirm('Are you sure you want to delete this note?')) {
            this.notes = this.notes.filter(note => note.id !== id);
            this.saveNotes();
            this.renderNotes();
        }
    }

    searchNotes() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const filteredNotes = this.notes.filter(note => 
            note.title.toLowerCase().includes(searchTerm) || 
            note.content.toLowerCase().includes(searchTerm)
        );
        this.renderNotes(filteredNotes);
    }

    saveNotes() {
        localStorage.setItem('notes', JSON.stringify(this.notes));
    }

    clearForm() {
        this.noteTitle.value = '';
        this.noteContent.value = '';
        this.noteCategory.value = 'General';
    }

    toggleTheme() {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('darkTheme', isDark);
        this.toggleThemeBtn.innerHTML = isDark ? 
            '<i class="fas fa-sun text-xl"></i>' : 
            '<i class="fas fa-moon text-xl"></i>';
    }

    loadTheme() {
        const isDark = localStorage.getItem('darkTheme') === 'true';
        if (isDark) {
            document.documentElement.classList.add('dark');
            this.toggleThemeBtn.innerHTML = '<i class="fas fa-sun text-xl"></i>';
        }
    }

    getCategoryColor(category) {
        const colors = {
            'Tasks': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
            'Personal': 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
            'Work': 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
            'Ideas': 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
            'Projects': 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400'
        };
        return colors[category] || 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400';
    }
}

const noteMaker = new NoteMaker();