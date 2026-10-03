// REPLACE THIS ARRAY WITH THE ACTUAL STARTING DATA FROM YOUR SCREEN
let notes = [
    { text: "Buy groceries", category: "personal" },
    { text: "Finish budget report", category: "work" },
    { text: "Review JavaScript arrays", category: "study" }
];

// 1. searchNotes using filter, toLowerCase, and includes
function searchNotes(word) {
    const searchWord = word.toLowerCase();
    return notes.filter(note => note.text.toLowerCase().includes(searchWord));
}

// 2. longestNote handling empty arrays and comparing lengths
function longestNote() {
    if (notes.length === 0) {
        return null; 
    }
    
    let longest = notes[0];
    for (let i = 1; i < notes.length; i++) {
        if (notes[i].text.length > longest.text.length) {
            longest = notes[i];
        }
    }
    return longest;
}

// 3. countByCategory looping and increasing a counter in an object
function countByCategory() {
    let counts = {};
    for (let note of notes) {
        if (counts[note.category]) {
            counts[note.category]++;
        } else {
            counts[note.category] = 1;
        }
    }
    return counts;
}

// 4. getSummary using countByCategory and template literals
function getSummary() {
    const counts = countByCategory();
    const total = notes.length;
    const noteWord = total === 1 ? "note" : "notes";
    
    let categoryStrings = [];
    for (let category in counts) {
        categoryStrings.push(`${counts[category]} ${category}`);
    }
    
    return `${total} ${noteWord}: ${categoryStrings.join(', ')}.`;
}

// 5. isDuplicate using some and comparing trimmed lower-case text
function isDuplicate(text) {
    const cleanText = text.trim().toLowerCase();
    return notes.some(note => note.text.trim().toLowerCase() === cleanText);
}

// 6. addNote checking length, category, and calling isDuplicate
function addNote(text, category) {
    if (text.length < 1 || text.length > 200) {
        console.log("Failed: Text must be between 1 and 200 characters.");
        return false;
    }
    
    const validCategories = ["personal", "work", "study"];
    if (!validCategories.includes(category)) {
        console.log("Failed: Invalid category. Must be personal, work, or study.");
        return false;
    }
    
    if (isDuplicate(text)) {
        console.log("Failed: Note already exists.");
        return false;
    }
    
    notes.push({ text: text, category: category });
    console.log("Success: Note added successfully.");
    return true;
}

// --- TESTING --- 
// Testing searchNotes
console.log(searchNotes("budget")); // Expected: [{ text: "Finish budget report", category: "work" }]
console.log(searchNotes("xyz")); // Expected: []

// Testing longestNote
console.log(longestNote()); // Expected: { text: "Review JavaScript arrays", category: "study" }
// Edge case for longestNote (empty array test requires temporarily emptying the array, skipped here to preserve data)

// Testing countByCategory
console.log(countByCategory()); // Expected: { personal: 1, work: 1, study: 1 }
console.log(typeof countByCategory()); // Expected: "object"

// Testing getSummary
console.log(getSummary()); // Expected: "3 notes: 1 personal, 1 work, 1 study."

// Testing isDuplicate
console.log(isDuplicate("buy groceries")); // Expected: true (ignores case)
console.log(isDuplicate("   Buy Groceries   ")); // Expected: true (ignores spaces and case)
console.log(isDuplicate("Walk the dog")); // Expected: false

// Testing addNote
console.log(addNote("Walk the dog", "personal")); // Expected: true, logs success
console.log(addNote("Buy groceries", "personal")); // Expected: false, logs Duplicate error
console.log(addNote("", "work")); // Expected: false, logs Length error
console.log(addNote("Read a book", "hobby")); // Expected: false, logs Category error