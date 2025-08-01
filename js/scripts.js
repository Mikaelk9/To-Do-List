// Seleção de elementos
const todoForm = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');
const editForm = document.querySelector('#edit-form');
const editInput = document.querySelector('#edit-input');
const cancelEditBtn = document.querySelector('#cancel-edit-btn');

let oldInputValue;

// Funções
const saveTodo = (text) => {
    const todo = {
        text: text,
        done: false
    };
    const todos = getTodosFromStorage();
    todos.push(todo);
    saveTodosToStorage(todos);
    renderTodos();
};

const renderTodos = () => {
    todoList.innerHTML = '';
    const todos = getTodosFromStorage();
    todos.forEach(todo => {
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");
        if (todo.done) {
            todoDiv.classList.add("done");
        }

        const todoTitle = document.createElement("h3");
        todoTitle.innerText = todo.text;
        todoDiv.appendChild(todoTitle);

        const doneBtn = document.createElement("button");
        doneBtn.classList.add("finish-todo");
        doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        todoDiv.appendChild(doneBtn);

        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-todo");
        editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
        todoDiv.appendChild(editBtn);

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("remove-todo");
        deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        todoDiv.appendChild(deleteBtn);

        todoList.appendChild(todoDiv);
    });
};

const saveTodosToStorage = (todos) => {
    localStorage.setItem('todos', JSON.stringify(todos));
};

const getTodosFromStorage = () => {
    const todos = localStorage.getItem('todos');
    return todos ? JSON.parse(todos) : [];
};

const toggleForms = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
};

const updateTodo = (text) => {
    const todos = getTodosFromStorage();
    todos.forEach(todo => {
        if (todo.text === oldInputValue) {
            todo.text = text;
        }
    });
    saveTodosToStorage(todos);
    renderTodos();
};

// Carregar tarefas do local storage ao iniciar
document.addEventListener("DOMContentLoaded", renderTodos);

// Eventos
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputValue = todoInput.value;
    if (inputValue) {
        saveTodo(inputValue);
        todoInput.value = '';
    }
});

document.addEventListener("click", (e) => {
    const targetEl = e.target;
    const parentEl = targetEl.closest("div");
    let todoTitle;

    if (parentEl && parentEl.querySelector("h3")) {
        todoTitle = parentEl.querySelector("h3").innerText;
    }

    if (targetEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle("done");
        const todos = getTodosFromStorage();
        todos.forEach(todo => {
            if (todo.text === todoTitle) {
                todo.done = !todo.done;
            }
        });
        saveTodosToStorage(todos);
    }

    if (targetEl.classList.contains("remove-todo")) {
        parentEl.remove();
        const todos = getTodosFromStorage().filter(todo => todo.text !== todoTitle);
        saveTodosToStorage(todos);
        renderTodos();
    }

    if (targetEl.classList.contains("edit-todo")) {
        toggleForms();
        editInput.value = todoTitle;
        oldInputValue = todoTitle;
    }
});

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms();
});

editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const editInputValue = editInput.value;
    if (editInputValue) {
        updateTodo(editInputValue);
    }
    toggleForms();
});
