
// Call fetchTodos when the page loads
window.onload = fetchTodos;
urgeToWriteTitle();

let globalJsonResponse;

async function addTask() {
  const title = document.querySelector('.input-element').value;
  const description = document.querySelector('.input-element-description').value;


  if (title.trim().length === 0 || description.trim().length === 0) {
    alert('Title or description is empty!');
    urgeToWriteTitle();
    return;
  }

  const uniqueId = Date.now();

  try {
    // First POST the data, and save it in a variable
    const response = await fetch("https://jsonplaceholder.typicode.com/todos", {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
        userId: 1
      }),
      headers: {
        'Content-type': 'application/json',
      },
    });

    // Wait for it, and when it is read, take the data and save it
    const data = await response.json();
    data.id = uniqueId;

    saveTodoToLocal(data);
    displayTask(data);

    document.querySelector('.input-element').value = '';
    document.querySelector('.input-element-description').value = '';
  } catch(error) {
    console.error('Error adding task:', error);
  }
}

function saveTodoToLocal(todo) {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  todos.push(todo);
  localStorage.setItem('todos', JSON.stringify(todos));
}


function fetchTodos() {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];

  if (todos.length === 0) return;

  todos.forEach(todo => {
    displayTask(todo);
  });
}

function displayTask(data) {
  if (!data) {
    console.log('Invalid jsonresponse:', data);
    return;
  }

  const tasksDiv = document.querySelector('.tasks-div');


  const taskHTML = `
    <div class="each-task task-${data.id}">
      <div class="p-div">
        <p class="p-element p-${data.id}">${data.title}</p>
        <p class="task-des des-${data.id}">${data.description}</p>
      </div>
      <div class="buttons-div">
        <button class="edit-button" style="color: rgb(116, 218, 255);" onclick="editTask(${data.id})">Edit</button>
        <button class="delete-button" onclick="removeTask(${data.id})">Delete</button>
      </div>
    </div>
  `

  tasksDiv.innerHTML += taskHTML;
}


async function removeTask(jsonresponseId) {
  try {
    const task = await fetch(`https://jsonplaceholder.typicode.com/todos/${jsonresponseId}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
      }
    });


    if (!task.ok) {
      alert("Couldn't remove your task, please try again later");
      return;
    }
    document.querySelector(`.task-${jsonresponseId}`).remove();

    saveRemovedTask(jsonresponseId);
  } catch(error) {
    alert('Could not delete the task:', error);
  }
}

function saveRemovedTask(jsonresponseId) {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  
  if (todos.length === 0) {
    return;
  }

  const newTodos = todos.filter(todo => todo.id !== jsonresponseId);

  localStorage.setItem('todos', JSON.stringify(newTodos));
}



// We can not directly pass jsonresponse since this is an object in addTask().
// onclick can not pass objects. So, we pass the jsonresponse.id.
function editTask(jsonresponseId) {

  urgeToWriteTitle();

  document.querySelector('.add-button-element').style.display = 'none';
  document.querySelector('.update-button').style.display = 'inline-block';

  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  const todo = todos.find(todo => todo.id === jsonresponseId);

  if (!todo) {
    alert('Task not found');
    return;
  }
    
  globalJsonResponse = todo;

    
  const title = document.querySelector(`.p-${jsonresponseId}`).innerText;
  const description = document.querySelector(`.des-${jsonresponseId}`).innerText;


  document.querySelector('.input-element').value = title;
  document.querySelector('.input-element-description').value = description;
}
  
function replaceEditedTask() {
  const title = document.querySelector('.input-element').value;
  const description = document.querySelector('.input-element-description').value;

  if (title.trim().length === 0 || description.trim().length === 0) {
    alert('Title or description can not be empty!');
    urgeToWriteTitle();
    return;
  }

  document.querySelector('.add-button-element').style.display = 'inline-block';
  document.querySelector('.update-button').style.display = 'none';

  document.querySelector(`.p-${globalJsonResponse.id}`).innerHTML = title;
  document.querySelector(`.des-${globalJsonResponse.id}`).innerHTML = description;

  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  
  const newTodos = todos.map(todo => ({ ...todo, title, description }));
    /*
    if (todo.id === globalJsonResponse.id) {
      // This return returns the new updated object(with the new values of object properties)
      return {
        // ... todo creates a new object.
        ...todo,
        title,
        description,
      } 
    }
    // If the current todo is not the one we want to update, we return it as it is.
    return todo;
    */

  localStorage.setItem('todos', JSON.stringify(newTodos));

  urgeToWriteTitle();

  document.querySelector('.input-element').value = '';
  document.querySelector('.input-element-description').value = '';
}


function urgeToWriteTitle() {
  document.querySelector('.input-element').focus();
  document.querySelector('.input-element').select();
}