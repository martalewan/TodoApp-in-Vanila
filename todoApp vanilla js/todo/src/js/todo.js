// selectors
const inputTitle = document.getElementById('todo-title');
const inputDescription = document.querySelector('.form__description-input');
const todoWrapper = document.getElementById('todo-container');
const todoDoneWrapper = document.getElementById('todo-done-container');

const filterOption = document.querySelector('.filter-todo');
const formButton = document.querySelector('.form__button');

const saveLocalTodos = (todo) => {
  let todos;
  if (localStorage.getItem('todos') === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem('todos'));
  }
  todos.push(todo);
  localStorage.setItem('todos', JSON.stringify(todos));
};

const removeLocalTodos = (todo) => {
  let todos;
  if (localStorage.getItem('todos') === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem('todos'));
  }

  const todoCard = todo.children[0];
  const frontCard = todoCard.children[0];
  const titleTodo = frontCard.children[0].innerText;

  const arrOfTitles = [];
  for (let i = 0; i < todos.length; i += 1) {
    arrOfTitles.push(todos[i][0]);
  }

  const todoIndex = arrOfTitles.indexOf(titleTodo);

  todos.splice(todoIndex, 1);
  localStorage.setItem('todos', JSON.stringify(todos));
};

const createCard = (data, done, container) => {
  const flipCard = document.createElement('div');
  if (done) {
    flipCard.classList.add('completed');
  }
  flipCard.classList.add('flip-card');
  container.appendChild(flipCard);

  const flipCardInner = document.createElement('div');
  flipCardInner.classList.add('flip-card-inner');
  if (done) {
    flipCardInner.classList.toggle('todo-done');
  }
  flipCard.appendChild(flipCardInner);

  const flipCardFront = document.createElement('div');
  flipCardFront.classList.add('flip-card-front');
  flipCardInner.appendChild(flipCardFront);

  const todoFrontTitle = document.createElement('h3');
  todoFrontTitle.classList.add('todo-front__title');
  todoFrontTitle.innerText = data.title;
  flipCardFront.appendChild(todoFrontTitle);

  const todoFrontDescription = document.createElement('p');
  todoFrontDescription.classList.add('todo-front__description');
  todoFrontDescription.innerText = data.description;
  flipCardFront.appendChild(todoFrontDescription);

  const flipCardBack = document.createElement('div');
  flipCardBack.classList.add('flip-card-back');
  flipCardInner.appendChild(flipCardBack);

  const todoBackDescription = document.createElement('p');
  todoBackDescription.classList.add('todo-back__description');
  todoBackDescription.innerText = 'Good job!';
  flipCardBack.appendChild(todoBackDescription);

  if (!done) {
    const doneButton = document.createElement('button');
    doneButton.classList.add('todo-back__button--done');
    doneButton.innerText = 'It is done';
    doneButton.addEventListener('click', () => {
      createCard(data, true, todoDoneWrapper);
      flipCard.remove();
    });
    flipCardBack.appendChild(doneButton);
  } else {
    const removeButton = document.createElement('button');
    removeButton.classList.add('todo-back__button--remove');
    removeButton.innerText = 'Delete';
    removeButton.style.display = 'block';
    removeButton.addEventListener('click', () => {
      flipCard.classList.add('fall');
      removeLocalTodos(flipCard);
      flipCard.addEventListener('transitionend', () => {
        flipCard.remove();
      });
    });
    flipCardBack.appendChild(removeButton);
  }
};

const todoCreater = (event) => {
  event.preventDefault();
  if (inputTitle.value.length === 0) {
    return;
  }

  saveLocalTodos([inputTitle.value, inputDescription.value]);

  createCard(
    { title: inputTitle.value, description: inputDescription.value },
    false,
    todoWrapper,
  );

  inputTitle.value = '';
  inputDescription.value = '';
};

const filterToDo = (event) => {
  const todos = todoWrapper.children;

  for (let i = 0; i < todos.length; i += 1) {
    switch (event.target.value) {
      case 'all':
        todos[i].style.display = 'block';
        break;
      case 'completed':
        if (todos[i].classList.contains('completed')) {
          todos[i].style.display = 'block';
        } else {
          todos[i].style.display = 'none';
        }
        break;
      case 'uncompleted':
        if (!todos[i].classList.contains('completed')) {
          todos[i].style.display = 'block';
        } else {
          todos[i].style.display = 'none';
        }
        break;
      default:
    }
  }
};

const getOldTodos = () => {
  let todos;
  if (localStorage.getItem('todos') === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem('todos'));
  }
  todos.forEach((todo) => {
    const oldTitle = todo[0];
    const oldDescription = todo[1];
    createCard(
      { title: oldTitle, description: oldDescription },
      false,
      todoWrapper,
    );
  });
};

formButton.addEventListener('click', todoCreater);
filterOption.addEventListener('click', filterToDo);
document.addEventListener('DOMContentLoaded', getOldTodos);
