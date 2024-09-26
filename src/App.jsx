import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import './App.css';
import AddTodo from './components/AddTodo';


const App = () => {
  const [todos, setTodos] = useState([]);

  // Fetch Todos on component mount
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos');
        const data = await response.json();
        setTodos(data.slice(0, 15)); // Get only the first 15 todos 
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };
    fetchTodos();
  }, []);

  // Add new todo
  const addTodo = async (title) => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify({
          title,
          completed: false,
          userId: 1,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      let newTodo = await response.json();
      
      // Assign a unique ID to the new todo 
      newTodo = { ...newTodo, id: Date.now(),completed:false };
  
      // Prepend the new todo to the list
      setTodos((prevTodos) => [newTodo, ...prevTodos]);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  // Update existing todo
const updateTodo = async (id, updatedTitle, completed) => {
  try {
    // Check if it's a newly added todo (id >= 200)
    if (id >= 200) {
      // Directly update the local state
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, title: updatedTitle, completed } : todo
        )
      );
    } else {
      // This is a server todo, so sending the PUT request
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          id,
          title: updatedTitle,
          completed,
          userId: 1,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      const updatedTodo = await response.json();

      // Update the local state with the new title and completed status
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? updatedTodo : todo
        )
      );
    }
  } catch (error) {
    console.error('Error updating todo:', error);
  }
};


  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'DELETE',
      });
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // Toggle completion status
  const toggleComplete = async (id, currentCompletedStatus) => {
    try {
      // Newly added todos have an id >= 200
      if (id >= 200) {
        // This is a new todo , update state directly
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === id ? { ...todo, completed: !currentCompletedStatus } : todo
          )
        );
      } else {
        // This is a server todo, so send a PUT request
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
            completed: !currentCompletedStatus, // Toggle the completion status
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
  
        const updatedTodo = await response.json();
  
        // Update the local state based on the response
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === id ? { ...todo, completed: updatedTodo.completed } : todo
          )
        );
      }
    } catch (error) {
      console.error('Error toggling completion:', error);
    }
  };
  
  


  return (
    <div className="todo-app">
      <h1>Todo App with API's</h1>
      <AddTodo addTodo={addTodo} />
      <TodoList
        todos={todos}
        updateTodo={updateTodo}
        deleteTodo={deleteTodo}
        toggleComplete={toggleComplete}
      />
    </div>
  );
};

export default App;
