document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'todo-app-items';
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let tasks = loadTasks();
    let currentFilter = 'all';

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

    function getVisibleTasks() {
        switch (currentFilter) {
            case 'active':
                return tasks.filter((task) => !task.completed);
            case 'completed':
                return tasks.filter((task) => task.completed);
            default:
                return tasks;
        }
    }

    function updateTaskCount() {
        const remaining = tasks.filter((task) => !task.completed).length;
        taskCount.textContent = `${remaining} task${remaining === 1 ? '' : 's'} left`;
    }

    function renderTasks() {
        taskList.innerHTML = '';
        const visibleTasks = getVisibleTasks();

        if (visibleTasks.length === 0) {
            const emptyState = document.createElement('li');
            emptyState.className = 'empty-state';

            if (tasks.length === 0) {
                emptyState.textContent = 'No tasks yet. Add one above!';
            } else if (currentFilter === 'active') {
                emptyState.textContent = 'No active tasks. Nice work!';
            } else if (currentFilter === 'completed') {
                emptyState.textContent = 'No completed tasks yet.';
            } else {
                emptyState.textContent = 'No tasks found.';
            }

            taskList.appendChild(emptyState);
        } else {
            visibleTasks.forEach((task) => {
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

                const editBtn = document.createElement('button');
                editBtn.type = 'button';
                editBtn.className = 'edit-btn';
                editBtn.textContent = 'Edit';
                editBtn.setAttribute('aria-label', `Edit ${task.text}`);
                editBtn.addEventListener('click', () => {
                    const updatedText = window.prompt('Edit task', task.text);
                    if (updatedText === null) {
                        return;
                    }

                    const trimmedText = updatedText.trim();
                    if (!trimmedText) {
                        window.alert('Task cannot be empty.');
                        return;
                    }

                    task.text = trimmedText;
                    saveTasks();
                    renderTasks();
                });

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
                li.appendChild(editBtn);
                li.appendChild(deleteBtn);
                taskList.appendChild(li);
            });
        }

        filterButtons.forEach((button) => {
            button.classList.toggle('active', button.dataset.filter === currentFilter);
        });

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

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            currentFilter = button.dataset.filter;
            renderTasks();
        });
    });

    clearCompletedBtn.addEventListener('click', () => {
        tasks = tasks.filter((task) => !task.completed);
        saveTasks();
        renderTasks();
    });

    renderTasks();
});