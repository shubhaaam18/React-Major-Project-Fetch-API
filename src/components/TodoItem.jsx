import React, { useState } from 'react';

const TodoItem = ({ todo, updateTodo, deleteTodo, toggleComplete }) => { //Todo item component
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const handleEdit = () => {//handle edit function
    setIsEditing(true);
  };

  const handleUpdate = () => { //handle update function
    updateTodo(todo.id, newTitle, todo.completed);
    setIsEditing(false);
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      {isEditing ? (
        <>
          <input
            type="text"
            className="edit-input"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button className="edit" onClick={handleUpdate}>Update</button>
        </>
      ) : (
        <>
          <span>{todo.title}</span>
          <button className="complete" onClick={() => toggleComplete(todo.id, todo.completed)}>
            {todo.completed ? 'Undo' : 'Complete'}
          </button>
          <button className="edit" onClick={handleEdit}>Edit</button>
          <button className="delete" onClick={() => deleteTodo(todo.id)}>Delete</button>
        </>
      )}
    </li>
  );
};

export default TodoItem;
