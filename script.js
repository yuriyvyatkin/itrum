class Task {
  constructor(content, id) {
    this.id = id;
    this.content = content;
    this.deleted = false;
  }
}

const tasksForm = document.body.querySelector('#tasks__form');
const taskInput = tasksForm.querySelector('#tasks__input');
const tasks = document.body.querySelector('#tasks');
const allTasks = tasks.querySelector('#all-tasks');
const deletedTasks = tasks.querySelector('#deleted-tasks');

const todos = [];

function getTodosHTML() {
  let all = '';
  let deleted = '';

  todos.forEach((todo) => {
    if (todo.deleted) {
      deleted += `
        <div class="task task_deleted task_completed" id="task#${todo.id}">
          <div class="task__title">
            ${todo.content}
          </div>
          <a href="#" class="task__deletion-control"></a>
        </div>
      `
    } else {
      all += `
        <div class="task" id="task#${todo.id}">
          <div class="task__title">
            ${todo.content}
          </div>
          <a href="#" class="task__completion-control"></a>
          <a href="#" class="task__deletion-control"></a>
        </div>
      `
    }
  });

  if (deleted === '') {
    deleted = '<p class="warning">Нет удалённых задач</p>';
  }

  return {
    all,
    deleted
  }
}

function renderTasks(todosHTML) {
  allTasks.textContent = '';
  allTasks.insertAdjacentHTML('beforeend', todosHTML.all);

  deletedTasks.textContent = '';
  deletedTasks.insertAdjacentHTML('beforeend', todosHTML.deleted);
}

function handleInput() {
  todos.push(new Task(taskInput.value, todos.length));

  renderTasks(getTodosHTML());

  taskInput.value = '';
}

tasksForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const { target } = event;

  if (taskInput.value.trim() === '') {
    taskInput.value = '';

    target.insertAdjacentHTML(
      'beforeend',
      '<p class="error">Ошибка: Пустое значение!</p>'
    );

    setTimeout(() => {
      const errorElement = tasksForm.querySelector('.error');

      if (errorElement) {
        errorElement.remove();
      }
    }, 2000);
    return;
  }

  handleInput();
})

taskInput.addEventListener('keyup', () => {
  if (tasksForm.lastElementChild.className === 'error') {
    tasksForm.lastElementChild.remove();
  }
});

tasks.addEventListener('click', (event) => {
  const { target } = event;

  if (target.classList.contains('task__completion-control')) {
    target.parentElement.classList.toggle('task_completed');
  } else if (target.classList.contains('task__deletion-control')) {
    const task = target.parentElement;
    const relatedID = +task.id.split('#')[1];
    const relatedTodo = todos.find((todo) => {
      return todo.id === relatedID;
    });

    if (task.classList.contains('task_deleted')) {
      relatedTodo.deleted = false;
    } else {
      relatedTodo.deleted = true;
    }

    renderTasks(getTodosHTML());
  }
})
