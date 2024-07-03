import { useEffect, useState } from "react";
import axios from "axios";
import Chart from "./chart";
import html2canvas from 'html2canvas'; // Import html2canvas for capturing DOM elements
import jsPDF from 'jspdf'; // Import jspdf for PDF generation
import { useUserContext } from './usercontext'; 

const Visualize = () => {
  const { email } = useUserContext(); 
  const [tasksByMonth, setTasksByMonth] = useState([]);
  const [tasksByPriority, setTasksByPriority] = useState([]);
  const [tasksByCategory, setTasksByCategory] = useState([]);
  const [tasksByCompletion, setTasksByCompletion] = useState([]);
  const [exporting, setExporting] = useState(false); // State to manage export process


  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksByMonthResponse = await axios.get(`http://localhost:3001/api/chart_data/tasks-by-month/${email}`);
        setTasksByMonth(tasksByMonthResponse.data);

        const tasksByPriorityResponse = await axios.get(`http://localhost:3001/api/chart_data/tasks-by-priority/${email}`);
        setTasksByPriority(tasksByPriorityResponse.data);

        const tasksByCategoryResponse = await axios.get(`http://localhost:3001/api/chart_data/tasks-by-category/${email}`);
        setTasksByCategory(tasksByCategoryResponse.data);

        const tasksByCompletionResponse = await axios.get(`http://localhost:3001/api/chart_data/tasks-by-completion/${email}`);
        setTasksByCompletion(tasksByCompletionResponse.data);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

  }, []);

  const exportAllToPDF = async () => {
    setExporting(true); // Set exporting state to true
  
    const pdf = new jsPDF('p', 'pt', 'a4'); // Create new jsPDF instance with 'a4' page size
  
    // Define positions for charts in the PDF
    let yPosition = 1; // Start with a bit of margin from top
  
    // Function to add chart to PDF
    const addChartToPDF = async (id) => {
      const input = document.getElementById(id); // Capture the chart div element by id
  
      // Check if input element is valid
      if (!input) {
        console.error(`Element with id '${id}' not found.`);
        return;
      }
  
      // Set the width and height of the chart div
      const width = input.offsetWidth;
      const height = input.offsetHeight;
  
      // Use html2canvas to capture the chart as canvas
      const canvas = await html2canvas(input, { width, height });
      const imgData = canvas.toDataURL('image/png'); // Convert canvas to base64 image data
  
      // Add chart image to PDF, scaling to fit on one page
      pdf.addImage(imgData, 'PNG', 40, yPosition, 500, 200); // Adjust position (x, y, width, height) as needed
      yPosition += 200; // Increase y position for next chart, with some margin between charts
    };
  
    // Add each chart to the PDF
    await addChartToPDF('tasksByMonth', 'Tasks Created by Month');
    await addChartToPDF('tasksByPriority', 'Tasks by Priority');
    await addChartToPDF('tasksByCategory', 'Tasks by Category');
    await addChartToPDF('tasksByCompletion', 'Tasks by Completion Status');
  
    // Save the PDF with a specific name
    pdf.save('All_Charts.pdf');
  
    setExporting(false); // Reset exporting state
  };
  

  return (
    <div className="flex flex-col py-10 lg:px-16 md:px-10 px-6 h-screen overflow-y-auto w-full">
      <h2 className="lg:text-3xl md:text-2xl text-xl">Visuals</h2>

      {/* Charts with IDs and titles */}
      <div className="flex space-x-8 py-6 w-4/5">
        <div id="tasksByMonth" className="flex flex-col rounded-md border w-full p-8 justify-center">
          Tasks Graph by Month
          <Chart data={tasksByMonth} labels={Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'short' }))} title="Tasks Created by Month" />
        </div>
      </div>
      
      <div className="flex space-x-8 py-6 w-4/5">
        <div id="tasksByPriority" className="flex flex-col rounded-md border w-full p-8 justify-center">
          Tasks Graph by Priority
          <Chart data={tasksByPriority} labels={tasksByPriority.map(task => task._id)} title="Tasks by Priority" />
        </div>
      </div>
      
      <div className="flex space-x-8 py-6 w-4/5">
        <div id="tasksByCategory" className="flex flex-col rounded-md border w-full p-8 justify-center">
          Tasks Graph by Category
          <Chart data={tasksByCategory} labels={tasksByCategory.map(task => task._id)} title="Tasks by Category" />
        </div>
      </div>
      
      <div className="flex space-x-8 py-6 w-4/5">
        <div id="tasksByCompletion" className="flex flex-col rounded-md border w-full p-8 justify-center">
          Tasks Graph by Completion Status
          <Chart data={tasksByCompletion} labels={tasksByCompletion.map(task => task._id)} title="Tasks by Completion Status" />
        </div>
      </div>

      {/* Button to export all charts to PDF */}
      <div className="mt-5">
        <button onClick={exportAllToPDF} disabled={exporting} className={`bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded ${exporting ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {exporting ? 'Exporting...' : 'Export All to PDF'}
        </button>
      </div>
    </div>
  );
};

export default Visualize;
