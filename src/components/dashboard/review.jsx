import  { useState, useEffect} from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas'; // Import html2canvas for capturing DOM elements
import jsPDF from 'jspdf'; // Import jspdf for PDF generation
import { useUserContext } from './usercontext'; 
import toast from "react-hot-toast";



const Review = () => {
  const { email } = useUserContext(); 
  const [tasks, setTasks] = useState([]);


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/gettodo/${email}`);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();

  }, []);

  const handleUpdate = async (id, updatedField) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/updatetodo/${id}`, updatedField);
      setTasks(tasks.map(task => (task._id === id ? response.data : task)));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleSelectChange = (e, id) => {
    const { name, value } = e.target;
    handleUpdate(id, { [name]: value });
  };

  const handleDateChange = (e, id) => {
    const value = e.target.value;
    handleUpdate(id, { dueDate: value });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/deletetodo/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const todayDate = new Date().toISOString().split('T')[0];

  const exportToPDF = () => {
    const input = document.getElementById('reviewTable'); // Capture the review table div element
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png'); // Convert canvas to base64 image data
        const pdf = new jsPDF('p', 'mm', 'a4'); // Create PDF object (orientation, unit, format)
        const imgWidth = 210; // A4 width in mm (8.27 inches)
        const imgHeight = canvas.height * imgWidth / canvas.width; // Calculate height according to aspect ratio
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight); // Add image to PDF
        pdf.save('tasks.pdf'); // Save PDF
      });
      toast.success("Exported")
  };

  return (
    
    
    <div id="reviewTable" className="container mx-auto p-5 bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg rounded-lg">

      <h1 className='text-black text-3xl font-bold mb-5'>Review Tasks</h1>
      <div className="overflow-x-auto rounded-lg border border-black">
        <table className="bg-white table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 text-black">Task</th>
              <th className="border p-2 text-black">Priority</th>
              <th className="border p-2 text-black">Organization</th>
              <th className="border p-2 text-black">Category</th>
              <th className="border p-2 text-black">Due Date</th>
              <th className="border p-2 text-black">Status</th>
              <th className="border p-2 text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="6" className="border p-2 text-center">No tasks to display</td>
              </tr>
            ) : (
              tasks.map(task => (
                <tr key={task._id}>
                  <td className="border p-2 text-black">{task.todo}</td>
                  <td className="border p-2 text-black">
                    
                    <select name="priority" value={task.priority || 'High'} onChange={(e) => handleSelectChange(e, task._id)} className="bg-white text-black border rounded-md p-2">
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </td>
                  <td className="border p-2 text-black">
                    <select name="organization" value={task.organization || 'Work'} onChange={(e) => handleSelectChange(e, task._id)} className="bg-white text-black border rounded-md p-2">
                      <option value="Work">Work</option>
                      <option value="Personal">Personal</option>
                    </select>
                  </td>
                  <td className="border p-2 text-black">
                    <select name="category" value={task.category || 'Educational'} onChange={(e) => handleSelectChange(e, task._id)} className="bg-white text-black border rounded-md p-2">
                      <option value="Educational">Educational</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Misc">Misc</option>
                    </select>
                  </td>
                  <td className="border p-2 text-black">
                    <input type="date" data-testid="due-date-input" value={task.dueDate ? task.dueDate.substring(0, 10) : todayDate} onChange={(e) => handleDateChange(e, task._id)} className="bg-white text-black border rounded-md p-2"/>
                  </td>
                  <td className="border p-2 text-black">
                    <select name="status" value={task.status || 'Ongoing'} onChange={(e) => handleSelectChange(e, task._id)} className="bg-white text-black border rounded-md p-2">
                      <option value="Ongoing">Ongoing</option>
                      <option value="Done">Done</option>
                    </select>
                  </td>
                  <td className="border p-2 text-center">
                    <button onClick={() => handleDelete(task._id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-5">
        <button onClick={exportToPDF} className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">
          Export to PDF
        </button>
      </div>
    </div>
  );
}

export default Review;
