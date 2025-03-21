
// Call fetchTodos when the page loads
window.onload = fetchTodos;
urgeToWriteTask();

let globalJsonResponse;

async function addTask() {
  let eachTask = document.querySelector('.input-element').value;
  let eachDescription = document.querySelector('.input-element-description').value;

  let uniqueId = Date.now();

  if (eachTask === '') return; // Don't add empty tasks

  if (eachTask === '') {
    alert('Add your task!');
    urgeToWriteTask();
    return;
  } else if (eachDescription === '') {
    alert('Add your description!');
    urgeToWriteDes();
    return;
  }

  try {
    // First POST the data, and save it in a variable
    let response = await fetch("https://jsonplaceholder.typicode.com/todos", {
      method: "POST",
      body: JSON.stringify({
        title: eachTask,
        description: eachDescription,
        userId: 1
      }),
      headers: {
        'Content-type': 'application/json',
      },
    }); 
    // Wait for it, and when it is read, take the data and save it
    let jsonresponse = await response.json();
    jsonresponse.id = uniqueId;

    saveTodoToLocal(jsonresponse);
    displayTask(jsonresponse);
    document.querySelector('.input-element').value = '';
    document.querySelector('.input-element-description').value = '';
  } catch(error) {
    console.error('Error adding task:', error);
  }

  urgeToWriteTask();
}

function saveTodoToLocal(todo) {
  let todos = JSON.parse(localStorage.getItem('todos')) || [];
  todos.push(todo);
  localStorage.setItem('todos', JSON.stringify(todos));
}


async function fetchTodos() {
  try {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    todos.forEach(todo => {
      displayTask(todo);
    });
  } catch (error) {
    console.error("Error parsing todos from localStorage:", error);
    localStorage.setItem('todos', JSON.stringify([])); // Start fresh with an empty list if corrupted
  }
}

async function displayTask(jsonresponse) {
  try {
    const tasksDiv = document.querySelector('.tasks-div');

  
    const tasksHTML = `
      <div class="each-task task-${jsonresponse.id}">
        <div class="p-div">
          <p class="p-element p-${jsonresponse.id}">${jsonresponse.title}</p>
          <p class="task-des des-${jsonresponse.id}">${jsonresponse.description}</p>
        </div>
        <div class="buttons-div">
          <button class="edit-button" style="color: rgb(116, 218, 255);" onclick="editTask(${jsonresponse.id})">Edit</button>
          <button class="delete-button" onclick="removeTaskFromBackend(${jsonresponse.id})">Delete</button>
        </div>
      </div>
    `

    tasksDiv.innerHTML += tasksHTML;
  } catch (error) {
    console.error('Error with jsonresponse:', error);
  }
}


async function removeTaskFromBackend(jsonresponseId) {
  try {
    let removed = await fetch(`https://jsonplaceholder.typicode.com/todos/${jsonresponseId}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
      }
    });


    if (removed.ok) {
      document.querySelector(`.task-${jsonresponseId}`).remove();

      savingRemovedTask(jsonresponseId);
    } else {
      console.log('Error removing the task from API');
    }
  } catch(error) {
    console.error('Error deleting the task:', error);
  }
}

async function savingRemovedTask(jsonresponseId) {
  try {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    todos = todos.filter(todo => {
      if (todo.id !== jsonresponseId) {
        return todo;
      }
    });
    localStorage.setItem('todos', JSON.stringify(todos));
  } catch(error) {
    console.error('Error in the romoveTask():', error);
  }
}



// We can not directly pass jsonresponse since this is an object in addTask().
// onclick can not pass objects. So, we pass the jsonresponse.id.
function editTask(jsonresponseId) {

  urgeToWriteTask();

  document.querySelector('.add-button-element').style.display = 'none';
  document.querySelector('.update-button').style.display = 'inline-block';

  let todos = JSON.parse(localStorage.getItem('todos')) || [];
  let jsonresponse = todos.find(todo => todo.id === jsonresponseId);
  globalJsonResponse = jsonresponse;

  if (!jsonresponse) {
    console.log('Task not found');
  }

  
  let textTask = document.querySelector(`.p-${jsonresponseId}`).innerText;
  let textDes = document.querySelector(`.des-${jsonresponseId}`).innerText;


  document.querySelector('.input-element').value = textTask;
  document.querySelector('.input-element-description').value = textDes;
}


function updateTask() {
  
  let editedTask = document.querySelector('.input-element').value;
  let editedDes = document.querySelector('.input-element-description').value;

  if (editedTask === '') {
    alert('Have not yet updated!');
    urgeToWriteTask();
    return;
  } else if (editedDes === '') {
    urgeToWriteDes();
    alert('Have not yet updated!');
    return;
  }

  document.querySelector('.add-button-element').style.display = 'inline-block';
  document.querySelector('.update-button').style.display = 'none';

  document.querySelector(`.p-${globalJsonResponse.id}`).innerHTML = editedTask;
  document.querySelector(`.des-${globalJsonResponse.id}`).innerHTML = editedDes;

  let todos = JSON.parse(localStorage.getItem('todos')) || [];
  
  todos = todos.map(todo => {
    if (todo.id === globalJsonResponse.id) {
      // This return returns the new updated object(with the new values of object properties)
      return {
        // ... todo creates a new object.
        ...todo,
        title: editedTask,
        description: editedDes,
      } 
    }
    // If the current todo is not the one we want to update, we return it as it is.
    return todo;
  });

  localStorage.setItem('todos', JSON.stringify(todos));

  urgeToWriteTask();

  document.querySelector('.input-element').value = '';
  document.querySelector('.input-element-description').value = '';
}

function urgeToWriteTask() {
  document.querySelector('.input-element').focus();
  document.querySelector('.input-element').select();
}

function urgeToWriteDes() {
  document.querySelector('.input-element-description').focus();
  document.querySelector('.input-element-description').select();
}