
// Call fetchTodos when the page loads
window.onload = fetchTodos;
urgeToWriteTitle();

let check = true;

let globalJsonResponse;

async function addTask() {
  let title = document.querySelector('.input-element').value;
  let description = document.querySelector('.input-element-description').value;

  let uniqueId = Date.now();

  if (title.trim().length === 0 || description.trim().length === 0) {
    alert('Add your task title!');
    urgeToWriteTitle();
    return;
  }

  try {
    // First POST the data, and save it in a variable
    const response = await fetch("https://jsonplaceholder.typicode.com/todos", {
      method: "POST",
      body: JSON.stringify({
        title: title,
        description: description,
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

  urgeToWriteTitle();
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
    globalJsonResponse = jsonresponse;

  
    const tasksHTML = `
      <div class="each-task task-${jsonresponse.id}">
        <div class="p-div">
          <p class="p-element p-${jsonresponse.id}">${jsonresponse.title}</p>
          <p class="task-des des-${jsonresponse.id}">${jsonresponse.description}</p>
        </div>
        <div class="buttons-div">
          <button class="edit-button" style="color: rgb(116, 218, 255);" onclick="editTask()">Edit</button>
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
function editTask() {
  if (check) {
    urgeToWriteTitle();

    document.querySelector('.add-button-element').style.display = 'none';
    document.querySelector('.update-button').style.display = 'inline-block';

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let todo = todos.find(todo => todo.id === globalJsonResponse.id);

    if (!todo) {
      console.log('Task not found');
      return;
    }

    
    let textTask = document.querySelector(`.p-${globalJsonResponse.id}`).innerText;
    let textDes = document.querySelector(`.des-${globalJsonResponse.id}`).innerText;


    document.querySelector('.input-element').value = textTask;
    document.querySelector('.input-element-description').value = textDes;

    check = !check;
  } else {
    let editedTitle = document.querySelector('.input-element').value;
    let editedDescription = document.querySelector('.input-element-description').value;

    if (editedTitle.trim().length === 0 || editedDescription.trim().length === 0) {
      alert('Title or description can not be empty!');
      urgeToWriteTitle();
      return;
    }

    document.querySelector('.add-button-element').style.display = 'inline-block';
    document.querySelector('.update-button').style.display = 'none';

    document.querySelector(`.p-${globalJsonResponse.id}`).innerHTML = editedTitle;
    document.querySelector(`.des-${globalJsonResponse.id}`).innerHTML = editedDescription;

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    
    todos = todos.map(todo => {
      if (todo.id === globalJsonResponse.id) {
        // This return returns the new updated object(with the new values of object properties)
        return {
          // ... todo creates a new object.
          ...todo,
          title: editedTitle,
          description: editedDescription,
        } 
      }
      // If the current todo is not the one we want to update, we return it as it is.
      return todo;
    });

    localStorage.setItem('todos', JSON.stringify(todos));

    urgeToWriteTitle();

    document.querySelector('.input-element').value = '';
    document.querySelector('.input-element-description').value = '';

    check = !check;
  }
}

function urgeToWriteTitle() {
  document.querySelector('.input-element').focus();
  document.querySelector('.input-element').select();
}