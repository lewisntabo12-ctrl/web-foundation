// 1. Select elements
const noteText = document.getElementById('note-text');
const charCount = document.getElementById('char-count');
const wordCount = document.getElementById('word-count');
const clearBtn = document.getElementById('clear-btn');
const themeToggle = document.getElementById('theme-toggle');

// 2. updateCounts() function
function updateCounts() {
    const text = noteText.value;
    const length = text.length;
    
    // Show "N / 200 characters"
    charCount.textContent = `${length} / 200 characters`;
    
    // Show "N words"
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    wordCount.textContent = `${words} words`;
    
    // Warning and Over classes
    charCount.classList.remove('warning', 'over');
    if (length > 200) {
        charCount.classList.add('over');
    } else if (length > 180) {
        charCount.classList.add('warning');
    }
}

// 3. Input event: Call updateCounts() and save draft
noteText.addEventListener('input', () => {
    updateCounts();
    localStorage.setItem('draftNote', noteText.value);
});

// 4. Clear functionality (Button and Escape key)
function clearAll() {
    noteText.value = '';
    updateCounts();
    localStorage.removeItem('draftNote');
}

clearBtn.addEventListener('click', clearAll);

noteText.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        clearAll();
    }
});

// 5. Theme toggle and saving choice
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    
    if (isDark) {
        themeToggle.textContent = 'Light mode';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggle.textContent = 'Dark mode';
        localStorage.setItem('theme', 'light');
    }
});

// 6. Page load: restore saved draft and theme, then update counts
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        themeToggle.textContent = 'Light mode';
    }
    
    const savedDraft = localStorage.getItem('draftNote');
    if (savedDraft) {
        noteText.value = savedDraft;
    }
    
    updateCounts();
});