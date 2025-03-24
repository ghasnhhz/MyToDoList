
// Call fetchTodos when the page loads
window.onload = fetchTodos;
urgeToWriteTitle();

let check = true;

let globalJsonResponse;

async function addTask() {
  const title = document.querySelector('.input-element').value;
  const description = document.querySelector('.input-element-description').value;

  const uniqueId = Date.now();

  if (title.trim().length === 0 || description.trim().length === 0) {
    alert('Title or description is empty!');
    urgeToWriteTitle();
    return;
  }

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
    const  data = await response.json();
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


async function fetchTodos() {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];

  if (todos.length === 0) return;

  todos.forEach(todo => {
    displayTask(todo);
  });
}

async function displayTask(jsonresponse) {
  if (!jsonresponse) {
    console.log('Invalid jsonresponse:', jsonresponse);
    return;
  }

  const tasksDiv = document.querySelector('.tasks-div');
  globalJsonResponse = jsonresponse;


  const taskHTML = `
    <div class="each-task task-${jsonresponse.id}">
      <div class="p-div">
        <p class="p-element p-${jsonresponse.id}">${jsonresponse.title}</p>
        <p class="task-des des-${jsonresponse.id}">${jsonresponse.description}</p>
      </div>
      <div class="buttons-div">
        <button class="edit-button" style="color: rgb(116, 218, 255);" onclick="editTask()">Edit</button>
        <button class="delete-button" onclick="removeTask(${jsonresponse.id})">Delete</button>
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

async function saveRemovedTask(jsonresponseId) {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  
  if (todos.length === 0) {
    return;
  }

  todos = todos.filter(todo => {
    if (todo.id !== jsonresponseId) {
      return todo;
    }
  });
  localStorage.setItem('todos', JSON.stringify(todos));
}



// We can not directly pass jsonresponse since this is an object in addTask().
// onclick can not pass objects. So, we pass the jsonresponse.id.
function editTask() {
  if (check) {
    urgeToWriteTitle();

    document.querySelector('.add-button-element').style.display = 'none';
    document.querySelector('.update-button').style.display = 'inline-block';

    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const todo = todos.find(todo => todo.id === globalJsonResponse.id);

    if (!todo) {
      alert('Task not found');
      return;
    }

    
    const title = document.querySelector(`.p-${globalJsonResponse.id}`).innerText;
    const description = document.querySelector(`.des-${globalJsonResponse.id}`).innerText;


    document.querySelector('.input-element').value = title;
    document.querySelector('.input-element-description').value = description;

    check = !check;
  } else {
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
    
    const newTodos = todos.map(todo => {
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
    });

    localStorage.setItem('todos', JSON.stringify(newTodos));

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