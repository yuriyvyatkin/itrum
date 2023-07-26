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
          <a href="#" class="task__complete-control"></a>
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
      'afterend',
      '<p class="error">Ошибка: Пустое значение!</p>'
    );

    setTimeout(() => {
      const errorElement = document.querySelector('.error');

      if (errorElement) {
        errorElement.remove();
      }
    }, 2000);
    return;
  }

  handleInput();
})

taskInput.addEventListener('keyup', (event) => {
  if (tasksForm.lastElementChild.className === 'error') {
    tasksForm.lastElementChild.remove();
  }
});

tasks.addEventListener('click', (event) => {
  const { target } = event;

  console.log(target);

  if (target.classList.contains('task__complete-control')) {
    target.parentElement.classList.toggle('task_completed');
  } else if (target.classList.contains('task__deletion-control')) {
    const relatedID = +target.parentElement.id.split('#')[1];
    const relatedTodo = todos.find((todo) => {
      return todo.id === relatedID;
    });
    const task = target.parentElement;

    if (task.classList.contains('task_deleted')) {
      relatedTodo.deleted = false;
    } else {
      relatedTodo.deleted = true;
    }

    task.classList.toggle('task_deleted');
    renderTasks(getTodosHTML());
  }
})
