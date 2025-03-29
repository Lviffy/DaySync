import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { todoService } from '../services/todoService';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useUser();

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);

  async function fetchTodos() {
    try {
      setLoading(true);
      const data = await todoService.fetchTodos(user.id);
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTodo(e) {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    try {
      const todo = {
        title: newTodo,
        completed: false,
        created_at: new Date()
      };
      
      const addedTodo = await todoService.addTodo(todo, user.id);
      setTodos([addedTodo, ...todos]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  }

  async function handleToggleComplete(id, completed) {
    try {
      const updatedTodo = await todoService.updateTodo(id, { completed: !completed });
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  }

  async function handleDeleteTodo(id) {
    try {
      await todoService.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  }

  return (
    <div className="todo-container">
      <header className="app-header">
        <h1>DaySync</h1>
        <button onClick={signOut} className="logout-button">Logout</button>
      </header>
      
      <form onSubmit={handleAddTodo} className="todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="todo-input"
        />
        <button type="submit" className="add-button">Add</button>
      </form>
      
      {loading ? (
        <div className="loading">Loading your tasks...</div>
      ) : (
        <ul className="todo-list">
          {todos.length === 0 ? (
            <div className="empty-state">No tasks yet. Add some!</div>
          ) : (
            todos.map(todo => (
              <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo.id, todo.completed)}
                />
                <span className="todo-text">{todo.title}</span>
                <button 
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default TodoApp;
