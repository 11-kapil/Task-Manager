// Function to add a new task
function addTask(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('due-date').value;
    const category = document.getElementById('category').value;

    if (!title || !dueDate) {
        alert('Please fill in the required fields: Title and Due Date');
        return;
    }

    const dueDateObj = new Date(dueDate);

    const currentDate = new Date();
    
    if (dueDateObj <= currentDate) {
        alert('Due Date must be in the future. Please select a valid date.');
        return;
    }


    const task = {
        title,
        description,
        dueDate,
        category,
        completed: false,
    };

    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    storedTasks.push(task);

    localStorage.setItem('tasks', JSON.stringify(storedTasks));

    displayTasks();
    clearForm();
}



// Function to retrieve tasks from localStorage
function retrieveTasks() {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    return storedTasks;
}

// Function to display tasks
function displayTasks(tasksToDisplay) {
    const taskTable = document.querySelector('.task-table');
    taskTable.innerHTML = '';

    const storedTasks = tasksToDisplay || retrieveTasks();

    const tableHeader = document.createElement('tr');
    tableHeader.innerHTML = `
        <th>Title</th>
        <th>Description</th>
        <th>Due Date</th>
        <th>Category</th>
        <th>Completed</th>
        <th>Action</th>
    `;
    taskTable.appendChild(tableHeader);

    storedTasks.forEach((task, index) => {
        const tableRow = document.createElement('tr');
        tableRow.innerHTML = `
            <td>${task.title}</td>
            <td>${task.description}</td>
            <td>${task.dueDate}</td>
            <td>${task.category}</td>
            <td>
                <input type="checkbox" class="completed-checkbox" onchange="markCompleted(${index}, this)" ${task.completed ? 'checked' : ''}>
            </td>
            <td>
                <button onclick="editTask(${index})">Edit</button>
                <button onclick="deleteTask(${index})">Delete</button>
            </td>
        `;
        taskTable.appendChild(tableRow);
    });
}

// Event listener for the "Add Task" form submission
document.getElementById('add-task-form').addEventListener('submit', addTask);

// Function to clear the form
function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('due-date').value = '';
    document.getElementById('category').value = '';
}

// Function to delete a task
function deleteTask(index) {
    if (confirm('Are you sure you want to delete this task?')) {
        const storedTasks = retrieveTasks();
        storedTasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(storedTasks));
        displayTasks();
    }
}

function markCompleted(index, element) {
    const storedTasks = retrieveTasks();

    storedTasks[index].completed = element.checked;

    localStorage.setItem('tasks', JSON.stringify(storedTasks));

    displayTasks();
}


// Function to search tasks
function searchTasks() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const storedTasks = retrieveTasks();
    const filteredTasks = storedTasks.filter(task => task.title.toLowerCase().includes(searchInput));
    displayTasks(filteredTasks);
}

// Function to edit a task
function editTask(index) {
    const storedTasks = retrieveTasks();
    const taskToEdit = storedTasks[index];

    document.getElementById('title').value = taskToEdit.title;
    document.getElementById('description').value = taskToEdit.description;
    document.getElementById('due-date').value = taskToEdit.dueDate;
    document.getElementById('category').value = taskToEdit.category;


    if (confirm('Do you want to edit this task?')) {
        storedTasks.splice(index, 1);

        localStorage.setItem('tasks', JSON.stringify(storedTasks));

        displayTasks();
    }
}

function sortTasks() {
    const sortCriteria = document.getElementById('sort-criteria').value;
    const storedTasks = retrieveTasks();

    if (sortCriteria === 'due-date') {
        storedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortCriteria === 'completion') {
        storedTasks.sort((a, b) => a.completed - b.completed);
    }

    displayTasks(storedTasks);
}

displayTasks();
