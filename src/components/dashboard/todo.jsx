import { useState, useEffect } from 'react';
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { useUserContext } from './usercontext';

const Todo = () => {
  const { email } = useUserContext();
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [dbTodos, setDbTodos] = useState([]);
  const [showFinished, setShowFinished] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/gettodo/${email}`);
        setDbTodos(response.data || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setDbTodos([]);
      }
    };

    const todoString = localStorage.getItem(`todos_${email}`);
    if (todoString) {
      const storedTodos = JSON.parse(todoString);
      setTodos(storedTodos);
    }

    fetchTasks();
  }, [email]);

  const saveToLS = () => {
    localStorage.setItem(`todos_${email}`, JSON.stringify(todos));
  };

  const toggleFinished = () => {
    setShowFinished(!showFinished);
  };

  const handleEdit = (id) => {
    const t = todos.find(i => i.id === id);
    if (t) {
      setTodo(t.todo);
      const newTodos = todos.filter(item => item.id !== id);
      setTodos(newTodos);
      saveToLS();
    }
  };

  const handleDelete = (id) => {
    const newTodos = todos.filter(item => item.id !== id);
    setTodos(newTodos);
    saveToLS();
  };

  const handleAdd = () => {
    if (todo.length > 3) {
      const storedTodos = JSON.parse(localStorage.getItem(`todos_${email}`)) || [];
      const isDuplicate = todos.some(item => item.todo.toLowerCase() === todo.toLowerCase()) ||
                          dbTodos.some(item => item.todo.toLowerCase() === todo.toLowerCase()) ||
                          storedTodos.some(item => item.todo.toLowerCase() === todo.toLowerCase());
      if (isDuplicate) {
        window.alert('Todo with the same name already exists.');
        return;
      }
      const newTodo = { id: uuidv4(), todo, isCompleted: false, useremail: email };
      setTodos([...todos, newTodo]);
      setTodo("");
      saveToLS();
    }
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleCheckbox = (e, id) => {
    const index = todos.findIndex(item => item.id === id);
    if (index !== -1) {
      const newTodos = [...todos];
      newTodos[index].isCompleted = !newTodos[index].isCompleted;
      setTodos(newTodos);
      saveToLS();
    }
  };

  const saveAllToDB = async () => {
    const uniqueTodos = Array.from(new Set(todos.map(item => item.todo.toLowerCase())));
    if (uniqueTodos.length !== todos.length) {
      window.alert('Duplicate todos found. Please remove duplicates before saving.');
      return;
    }

    if (todos.length > 6) {
      window.alert('You can only save a maximum of 6 todos at once.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/addtodo', { todos });
      console.log(response.data);
      window.alert("Saved all todos to DB");
      setTodos([]);
    } catch (error) {
      console.error('Error saving todos to DB:', error);
      window.alert('Error saving todos to DB:', error);
    }
  };

  return (
    <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-gradient-to-r from-blue-500 to-blue-600 min-h-[80vh] md:w-[35%]">
      <h1 className='font-bold text-center text-3xl'>Todos</h1>
      <div className="addTodo my-5 flex flex-col gap-4">
        <h2 className='text-2xl font-bold'>Add a Todo</h2>
        <div className="flex">
          <input onChange={handleChange} value={todo} type="text" className='w-full rounded-full px-5 py-1' />
          <button onClick={handleAdd} disabled={todo.length <= 3} className='bg-white mx-2 rounded-full hover:bg-white disabled:bg-gray-400 p-4 py-2 text-sm font-bold text-black'>Save</button>
        </div>
      </div>
      <input className='my-4' id='show' onChange={toggleFinished} type="checkbox" checked={showFinished} />
      <label className='mx-2' htmlFor="show">Show Finished</label>
      <div className='h-[1px] bg-black opacity-15 w-[90%] mx-auto my-2'></div>
      <h2 className='text-2xl font-bold'>Todos</h2>
      <div className="todos">
        {todos.length === 0 && <div className='m-5'>No Todos to display</div>}
        {todos.map(item => (
          (showFinished || !item.isCompleted) &&
          <div key={item.id} className={"todo flex my-3 justify-between"}>
            <div className='flex gap-5'>
              <input name={item.id} onChange={(e) => handleCheckbox(e, item.id)} type="checkbox" checked={item.isCompleted} />
              <div className={item.isCompleted ? "line-through" : ""}>{item.todo}</div>
            </div>
            <div className="buttons flex h-full">
              <button onClick={() => handleEdit(item.id)} className='bg-black hover:bg-gray-400 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'><FaEdit /></button>
              <button onClick={() => handleDelete(item.id)} className='bg-black hover:bg-gray-400 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'><AiFillDelete /></button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center">
        <button onClick={saveAllToDB} disabled={todos.length === 0} className="bg-white mx-2 rounded-full hover:bg-white disabled:bg-gray-400 p-4 py-2 text-sm font-bold text-black">
          Save All to DB
        </button>
      </div>
    </div>
  );
}

export default Todo;
