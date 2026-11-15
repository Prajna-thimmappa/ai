document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'todo-app-items';
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');

    let tasks = loadTasks();

    function loadTasks() {
        try {
            const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            return Array.isArray(savedTasks) ? savedTasks : [];
        } catch (error) {
            return [];
        }
    }

    function saveTasks() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }

    function updateTaskCount() {
        const remaining = tasks.filter((task) => !task.completed).length;
        taskCount.textContent = `${remaining} task${remaining === 1 ? '' : 's'} left`;
    }

    function renderTasks() {
        taskList.innerHTML = '';

        if (tasks.length === 0) {
            const emptyState = document.createElement('li');
            emptyState.className = 'empty-state';
            emptyState.textContent = 'No tasks yet. Add one above!';
            taskList.appendChild(emptyState);
        } else {
            tasks.forEach((task) => {
                const li = document.createElement('li');
                li.classList.toggle('completed', task.completed);

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = task.completed;
                checkbox.setAttribute('aria-label', `Mark ${task.text} as complete`);
                checkbox.addEventListener('change', () => {
                    task.completed = checkbox.checked;
                    saveTasks();
                    renderTasks();
                });

                const span = document.createElement('span');
                span.textContent = task.text;

                const deleteBtn = document.createElement('button');
                deleteBtn.type = 'button';
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = 'Delete';
                deleteBtn.setAttribute('aria-label', `Delete ${task.text}`);
                deleteBtn.addEventListener('click', () => {
                    tasks = tasks.filter((item) => item.id !== task.id);
                    saveTasks();
                    renderTasks();
                });

                li.appendChild(checkbox);
                li.appendChild(span);
                li.appendChild(deleteBtn);
                taskList.appendChild(li);
            });
        }

        updateTaskCount();
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        if (!taskText) {
            taskInput.focus();
            return;
        }

        tasks.unshift({
            id: Date.now() + Math.random(),
            text: taskText,
            completed: false
        });

        saveTasks();
        taskInput.value = '';
        renderTasks();
        taskInput.focus();
    }

    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();
        addTask();
    });

    clearCompletedBtn.addEventListener('click', () => {
        tasks = tasks.filter((task) => !task.completed);
        saveTasks();
        renderTasks();
    });

    renderTasks();
});