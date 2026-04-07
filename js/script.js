const userNameInput = document.getElementById('user-name-input');

const savedName = localStorage.getItem('userName') || '';
userNameInput.value = savedName;

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    document.getElementById('time-display').textContent = `${hours}:${minutes}:${seconds}`;

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('date-display').textContent = now.toLocaleDateString('id-ID', options);

    let greeting = 'Selamat Malam';
    const currentHour = now.getHours();
    
    if (currentHour >= 5 && currentHour < 12) {
        greeting = 'Selamat Pagi';
    } else if (currentHour >= 12 && currentHour < 15) {
        greeting = 'Selamat Siang';
    } else if (currentHour >= 15 && currentHour < 18) {
        greeting = 'Selamat Sore';
    }

    const name = userNameInput.value.trim();
    document.getElementById('greeting-text').textContent = name ? `${greeting}, ${name}!` : `${greeting}!`;
}

userNameInput.addEventListener('input', () => {
    localStorage.setItem('userName', userNameInput.value);
    updateClock();
});

setInterval(updateClock, 1000);
updateClock(); 

let timerInterval;
let timeLeft = 25 * 60;
let isRunning = false;

const timerDisplay = document.getElementById('timer-display');

function updateTimerDisplay() {
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

document.getElementById('start-btn').addEventListener('click', () => {
    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                isRunning = false;
                alert("Waktu fokus 25 menit selesai! Istirahatlah sejenak.");
            }
        }, 1000);
    }
});

document.getElementById('stop-btn').addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;
});

document.getElementById('reset-btn').addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;
    timeLeft = 25 * 60;
    updateTimerDisplay();
});

const todoInput = document.getElementById('todo-input');
const addTodoBtn = document.getElementById('add-todo-btn');
const todoList = document.getElementById('todo-list');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

function renderTodos() {
    todoList.innerHTML = ''; 
    
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.alignItems = 'center';
        li.style.gap = '10px';
        li.style.marginBottom = '10px';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleTodo(index));

        const span = document.createElement('span');
        span.textContent = todo.text;
        span.style.flex = '1'; 
        if (todo.completed) {
            span.style.textDecoration = 'line-through';
            span.style.color = '#888';
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.style.backgroundColor = '#e74c3c'; 
        deleteBtn.style.padding = '5px 10px';
        deleteBtn.addEventListener('click', () => deleteTodo(index));

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    });
    
    localStorage.setItem('todos', JSON.stringify(todos));
}

function addTodo() {
    const text = todoInput.value.trim();
    if (text !== '') {
        const isDuplicate = todos.some(todo => todo.text.toLowerCase() === text.toLowerCase());
        
        if (isDuplicate) {
            alert("Tugas ini sudah ada dalam daftar!");
            return;
        }

        todos.push({ text: text, completed: false });
        todoInput.value = '';
        renderTodos();
    }
}

function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    renderTodos();
}

function deleteTodo(index) {
    todos.splice(index, 1);
    renderTodos();
}

addTodoBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

renderTodos(); 

const linkNameInput = document.getElementById('link-name');
const linkUrlInput = document.getElementById('link-url');
const addLinkBtn = document.getElementById('add-link-btn');
const linksContainer = document.getElementById('links-container');

let links = JSON.parse(localStorage.getItem('quickLinks')) || [];

function renderLinks() {
    linksContainer.innerHTML = '';
    
    links.forEach((link, index) => {
        const linkWrapper = document.createElement('div');
        linkWrapper.style.display = 'inline-flex';
        linkWrapper.style.alignItems = 'center';
        linkWrapper.style.backgroundColor = '#0eb836'; 
        linkWrapper.style.padding = '8px 12px';
        linkWrapper.style.borderRadius = '6px';
        linkWrapper.style.gap = '8px';

        const a = document.createElement('a');
        a.href = link.url;
        a.textContent = link.name;
        a.target = '_blank'; 
        a.style.color = 'white';
        a.style.textDecoration = 'none';
        a.style.fontSize = '0.9rem';

        const deleteBtn = document.createElement('span');
        deleteBtn.textContent = 'x';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.color = 'white';
        deleteBtn.style.fontSize = '12px';
        deleteBtn.style.backgroundColor = 'rgba(0,0,0,0.2)';
        deleteBtn.style.borderRadius = '50%';
        deleteBtn.style.padding = '2px 6px';
        
        deleteBtn.addEventListener('click', () => deleteLink(index));

        linkWrapper.appendChild(a);
        linkWrapper.appendChild(deleteBtn);
        linksContainer.appendChild(linkWrapper);
    });
    
    localStorage.setItem('quickLinks', JSON.stringify(links));
}

function addLink() {
    const name = linkNameInput.value.trim();
    let url = linkUrlInput.value.trim();
    
    if (name !== '' && url !== '') {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        links.push({ name: name, url: url });
        linkNameInput.value = '';
        linkUrlInput.value = '';
        renderLinks();
    }
}

function deleteLink(index) {
    links.splice(index, 1);
    renderLinks();
}

addLinkBtn.addEventListener('click', addLink);

renderLinks();

const themeToggle = document.getElementById('theme-toggle');

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀️ Mode Terang';
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    const isDark = document.body.classList.contains('dark-mode');
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    themeToggle.textContent = isDark ? '☀️ Mode Terang' : '🌙 Mode Gelap';
});