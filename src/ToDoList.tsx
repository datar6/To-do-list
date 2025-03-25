import { useState } from 'react';
import { Tooltip } from 'react-tooltip';

export default function ToDoList() {
  const [tasks, setTasks] = useState<{ task: string[]; completed: boolean }[]>([]);
  const [newTask, setNewTask] = useState<string>('');

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    setNewTask(event.target.value);
  };

  function addTask() {
    if (newTask.trim() !== '') {
      setTasks(t => [...t, { task: newTask, completed: false }]);
      setNewTask('');
    }
  }

  function deleteTask(index: number) {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  }

  function moveTaskUp(index: number) {
    if (index > 0) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index - 1]] = [
        updatedTasks[index - 1],
        updatedTasks[index],
      ];
      setTasks(updatedTasks);
    }
  }

  function moveTaskDown(index: number) {
    if (index < tasks.length - 1) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index + 1]] = [
        updatedTasks[index + 1],
        updatedTasks[index],
      ];
      setTasks(updatedTasks);
    }
  }

  function handleTaskAchieve(index: number) {
    if (index < 0 || index >= tasks.length) return; // Проверка границ

    const updatedTasks = [...tasks];
    const [task] = updatedTasks.splice(index, 1); // Вырезаем задачу
    task.completed = !task.completed; // Переключаем статус
    updatedTasks.push(task); // Добавляем в конец списка

    setTasks(updatedTasks); // Обновляем состояние
  }

  return (
    <div className="to-do-list">
      <h1>To-Do-List</h1>
      <div className="sticky-header">
        <input
          type="text"
          placeholder="Enter a task..."
          value={newTask}
          onChange={handleInputChange}
        />
        <button className="add-button" onClick={addTask}>
          Add
        </button>
      </div>
      <ol>
        {tasks.map((task, index) => (
          <li key={index}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleTaskAchieve(index)}
            />
            <span className={`text ${task.completed ? 'completed' : ''}`}>{task.task}</span>
            <button className="delete-button" onClick={() => deleteTask(index)}>
              Delete
            </button>
            <button
              className={index ? 'move-button' : 'move-button-disabled'}
              onClick={() => moveTaskUp(index)}
              data-tooltip-id="my-tooltip-move-up"
              data-tooltip-content={index === 0 ? 'You cannot move this task up' : ''}
            >
              👆
            </button>
            <Tooltip
              id="my-tooltip-move-up"
              style={{
                backgroundColor: 'black',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
              }}
            />
            <button
              className={index !== tasks.length - 1 ? 'move-button' : 'move-button-disabled'}
              onClick={() => moveTaskDown(index)}
              data-tooltip-id="my-tooltip-move-down"
              data-tooltip-content={
                index === tasks.length - 1 ? 'You cannot move this task down' : ''
              }
            >
              👇
            </button>
            <Tooltip
              id="my-tooltip-move-down"
              style={{
                backgroundColor: 'black',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '14px',
              }}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
