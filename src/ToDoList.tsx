import { useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';

type Task = {
  task: string;
  completed: boolean;
  originalIndex?: number;
};

export default function ToDoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  // Загружаем задачи из localStorage при первом рендере
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      setTasks(parsedTasks);
      setFilteredTasks(parsedTasks); // Обновляем отфильтрованный список сразу
    }
  }, []);

  // Сохраняем задачи в localStorage при их изменении
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } else {
      localStorage.removeItem('tasks');
    }

    // Обновляем фильтрованный список, если нет активного поиска
    if (searchTerm === '') {
      setFilteredTasks(tasks);
    }
  }, [tasks]);

  // Функция поиска
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value === '') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter(task => task.task.toLowerCase().includes(value.toLowerCase())));
    }
  };

  // Добавление новой задачи
  function addTask() {
    if (newTask.trim() !== '') {
      const updatedTasks = [...tasks, { task: newTask, completed: false }];
      setTasks(updatedTasks);
      setNewTask('');
    }
  }

  // Удаление задачи
  function deleteTask(index: number) {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  }

  // Перемещение задачи вверх
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

  // Перемещение задачи вниз
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

  // Отметка выполнения задачи
  function handleTaskAchieve(index: number) {
    if (index < 0 || index >= tasks.length) return;

    const updatedTasks = [...tasks];
    const [task] = updatedTasks.splice(index, 1);
    task.completed = !task.completed;

    if (task.completed) {
      task.originalIndex = index;
      updatedTasks.push(task);
    } else {
      const insertIndex = task.originalIndex ?? updatedTasks.length;
      updatedTasks.splice(insertIndex, 0, task);
      delete task.originalIndex;
    }

    setTasks(updatedTasks);
  }

  return (
    <div className="to-do-list">
      <div>
        <input type="text" placeholder="Search..." onChange={handleSearch} />
      </div>
      <h1 className="bouncing-letters">
        <span>T</span>
        <span>o</span>
        <span>-</span>
        <span>D</span>
        <span>o</span>
        <span>-</span>
        <span>L</span>
        <span>i</span>
        <span>s</span>
        <span>t</span>
      </h1>
      <div className="sticky-header">
        <input
          type="text"
          placeholder="Enter a task..."
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
        />
        <button className="add-button" onClick={addTask}>
          Add
        </button>
      </div>
      <ol>
        {filteredTasks.map((task, index) => (
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
