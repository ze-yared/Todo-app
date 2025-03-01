document.addEventListener('DOMContentLoaded', () => { 
    document.getElementById("year").textContent = new Date().getFullYear();
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
        tasks = savedTasks;
        updateTaskList();
        updateStats();
    }
});

let tasks = [];

const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const addTask = () => {
    const taskInput = document.getElementById('input');
    const text = taskInput.value.trim();
    if (text) {
        tasks.push({ text: text, completed: false });
        taskInput.value = ""; // Clear input after adding task
        updateTaskList();
        updateStats();
        saveTasks();
    }
};

const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTaskList();
    updateStats();
    saveTasks();
};

const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTaskList();
    updateStats();
    saveTasks();
};

const editTask = (index) => {
    const taskInput = document.getElementById('input');
    taskInput.value = tasks[index].text;
    deleteTask(index);
};

const updateStats = () => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
    
    // Update progress bar width
    const progressBar = document.querySelector('.progress');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }

    // Update progress number
    document.querySelector('.progresnumber').innerText = `${completedTasks}/${totalTasks}`;

    // 🎉 Show confetti if all tasks are completed
    if (totalTasks > 0 && completedTasks === totalTasks) {
        launchConfetti();
    }
};

// 🎊 Confetti Effect
const launchConfetti = () => {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
};

// Ensure function is globally accessible
const updateTaskList = () => {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div class="taskitem">
                <div class="task ${task.completed ? "completed" : ""}">
                    <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""} data-index="${index}"/>
                    <p class="task-text" style="text-decoration: ${task.completed ? "line-through" : "none"};">${task.text}</p>
                </div>
                <div class="icons">
                    <p class="edit" data-index="${index}">Edit</p>
                    <p class="delete" data-index="${index}">Delete</p>
                </div>
            </div>
        `;
        taskList.appendChild(listItem);
    });

    // Attach event listeners dynamically
    document.querySelectorAll(".checkbox").forEach(checkbox => {
        checkbox.addEventListener("change", (e) => {
            const index = e.target.getAttribute("data-index");
            toggleTaskComplete(index);
        });
    });

    document.querySelectorAll(".edit").forEach(editBtn => {
        editBtn.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            editTask(index);
        });
    });

    document.querySelectorAll(".delete").forEach(deleteBtn => {
        deleteBtn.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            deleteTask(index);
        });
    });
};

document.getElementById('submit').addEventListener('click', function(e) {
    e.preventDefault();
    addTask();
});
