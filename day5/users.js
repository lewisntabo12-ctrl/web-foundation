const loadBtn = document.getElementById('load-users');
const filterInput = document.getElementById('filter-input');
const statusText = document.getElementById('status');
const usersList = document.getElementById('users-list');

let usersArray = []; // Store the loaded users here

// Fetch users from the API
async function loadUsers() {
    loadBtn.disabled = true;
    statusText.textContent = "Loading...";
    
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        usersArray = await response.json();
        statusText.textContent = "Users loaded successfully.";
        renderUsers(usersArray);
        
    } catch (error) {
        statusText.textContent = `Error loading users: ${error.message}`;
    } finally {
        loadBtn.disabled = false;
    }
}

// Draw the array of users to the screen
function renderUsers(list) {
    usersList.innerHTML = ''; // Clear current list
    
    if (list.length === 0) {
        statusText.textContent = "No users match your filter.";
        return;
    }
    
    list.forEach(user => {
        const li = document.createElement('li');
        
        // Display name, email, city, and company name
        li.textContent = `${user.name} | Email: ${user.email} | City: ${user.address.city} | Company: ${user.company.name}`;
        
        usersList.appendChild(li);
    });
}

// Listen for clicks on the load button
loadBtn.addEventListener('click', loadUsers);

// Listen for typing in the filter box
filterInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    const filteredUsers = usersArray.filter(user => 
        user.name.toLowerCase().includes(searchTerm)
    );
    
    // Clear status text when filtering, unless empty
    statusText.textContent = ""; 
    renderUsers(filteredUsers);
});