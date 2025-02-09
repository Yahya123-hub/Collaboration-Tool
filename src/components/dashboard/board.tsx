import React, { useEffect, useState,useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Columns } from './ts_columns';
import { onDragEnd } from './ts_ondragend';
import { AddOutline, TrashOutline } from 'react-ionicons';
import AddModal from './ts_AddModal';
import Task from './ts_Task';
import axios from 'axios';
import html2canvas from 'html2canvas'; // Import html2canvas for capturing DOM elements
import jsPDF from 'jspdf'; // Import jspdf for PDF generation
import { useUserContext } from './usercontext'; // Import the user context hook


const Home = () => {

  const { email, setEmail } = useUserContext();


  const [columns, setColumns] = useState<Columns>({
    backlog: { name: 'Backlog', items: [] },
    pending: { name: 'Pending', items: [] },
    todo: { name: 'To Do', items: [] },
    doing: { name: 'Doing', items: [] },
    done: { name: 'Done', items: [] },
  });
  const [modalOpen, setModalOpen] = useState(false); // State for modal open/close
  const [selectedColumn, setSelectedColumn] = useState(''); // State for selected column to add task
  const [exporting, setExporting] = useState(false); // State to manage export process
  const kanbanRef = useRef<HTMLDivElement>(null); // Ref for Kanban board div

  useEffect(() => {
    fetchTasks();

  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/kanban/fetch-tasks/${email}`);
      const { backlogTasks = [], pendingTasks = [], todoTasks = [], doingTasks = [], doneTasks = [] } = response.data;
  
      setColumns({
        backlog: { name: 'Backlog', items: backlogTasks },
        pending: { name: 'Pending', items: pendingTasks },
        todo: { name: 'To Do', items: todoTasks },
        doing: { name: 'Doing', items: doingTasks },
        done: { name: 'Done', items: doneTasks },
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // Keep columns initialized even if API fails
      setColumns({
        backlog: { name: 'Backlog', items: [] },
        pending: { name: 'Pending', items: [] },
        todo: { name: 'To Do', items: [] },
        doing: { name: 'Doing', items: [] },
        done: { name: 'Done', items: [] },
      });
    }
  };

  // Function to open modal for adding task to a specific column
  const openModal = (columnId: any) => {
    setSelectedColumn(columnId);
    setModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setModalOpen(false);
  };

  // Function to generate unique id for new tasks
  const generateId = () => {
    return Math.random().toString(36).substr(2, 9); // Example of generating a random id
  };

  // Function to handle adding task
  const handleAddTask = (taskData: any) => {
    const newTask = { ...taskData, id: generateId() }; // Generate id for new task
    const newBoard = { ...columns };
    newBoard[selectedColumn].items.push(newTask);
    setColumns(newBoard); // Update the state with the new task added
  };

  // Function to handle deleting task
  const handleDeleteTask = (columnId: string, taskId: string) => {
    const newBoard = { ...columns };
    newBoard[columnId].items = newBoard[columnId].items.filter((task: any) => task.id !== taskId);
    setColumns(newBoard); // Update the state with the task deleted
  };

  const saveTasks = async () => {
    const tasks = {
      backlogTasks: columns.backlog.items,
      pendingTasks: columns.pending.items,
      todoTasks: columns.todo.items,
      doingTasks: columns.doing.items,
      doneTasks: columns.done.items,
      usermail: email, 

    };
    try {
      await axios.post('http://localhost:3001/api/kanban/save-tasks', tasks);
      alert('Saved to DB');
      console.log(tasks)
      console.log(email)
    } catch (error) {
      console.error('Error saving tasks:', error);
      alert('Error, try rearranging and reducing some tasks or use small sized images');
    }
  };

  const exportKanbanToPDF = async () => {
    setExporting(true); // Set exporting state to true

    // Capture Kanban board as image using html2canvas
    if (kanbanRef.current) {
      try {
        const canvas = await html2canvas(kanbanRef.current, { scrollY: -window.scrollY });
        const imgData = canvas.toDataURL('image/png');

        // Calculate aspect ratio to fit on PDF page
        const imgWidth = 210; // A4 page width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const pdf = new jsPDF('p', 'mm', 'a4'); // Create new jsPDF instance with 'a4' page size
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight); // Add Kanban board image to PDF
        pdf.save('Kanban_Board.pdf'); // Save the PDF with a specific name
      } catch (error) {
        console.error('Error exporting Kanban board to PDF:', error);
        alert('Error exporting Kanban board to PDF. Please try again.');
      }
    }

    setExporting(false); // Reset exporting state
  };

  const areAllColumnsEmpty = () => {
    return columns && Object.values(columns).every(column => column.items.length === 0);
  };


  return (
    <>
      {/* DragDropContext for handling drag and drop functionality */}
      <DragDropContext onDragEnd={(result: any) => onDragEnd(result, columns, setColumns)}>
        
        {/* Render columns and tasks */}
        <div  ref={kanbanRef} id="kanbanboard" className="w-full flex items-start justify-between px-5 pb-8 md:gap-0 gap-10">
          {Object.entries(columns).map(([columnId, column]: any) => (
            <div className="w-full flex flex-col gap-0" key={columnId}>
              {/* Droppable component for each column */}
              <Droppable droppableId={columnId} key={columnId}>
                {(provided: any) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex flex-col md:w-[290px] w-[250px] gap-3 items-center py-5"
                  >
                    {/* Render column name */}
                    <div className="flex items-center justify-center py-[10px] w-full bg-white rounded-lg shadow-sm text-[#555] font-medium text-[15px]">
                      {column.name}
                    </div>
                    {/* Render tasks within the column */}
                    {column.items.map((task: any, index: any) => (
                      <Draggable
                        key={task._id ? task._id.toString() : task.id.toString()}
                        draggableId={task._id ? task._id.toString() : task.id.toString()}
                        index={index}
                      >
                        {(provided: any) => (
                          <>
                            {/* Render Task component for each task */}
                            <div className="relative">
                              <Task provided={provided} task={task} />
                              {/* Delete button for each task */}
                              <button data-testid = "delbtn"
                                className="absolute top-0 right-0 mt-1 mr-1 p-1 rounded-full bg-red-500 text-white shadow-md hover:bg-red-600"
                                onClick={() => handleDeleteTask(columnId, task.id)}
                              >
                                <TrashOutline />
                              </button>
                            </div>
                          </>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              {/* Render "Add Task" button */}
              <div
                onClick={() => openModal(columnId)}
                className="flex cursor-pointer items-center justify-center gap-1 py-[10px] md:w-[90%] w-full opacity-90 bg-white rounded-lg shadow-sm text-[#555] font-medium text-[15px]"
              >
                <AddOutline color={'#555'} />
                Add Task
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4 mb-8 space-x-4 ">
          <button
            onClick={saveTasks}
            disabled={areAllColumnsEmpty()}
            className="save-button px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white  rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Save Tasks
          </button>

          <button
            onClick={exportKanbanToPDF}
            disabled={exporting || areAllColumnsEmpty()}
            className={`save-button px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white  rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 ${exporting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {exporting ? 'Exporting...' : 'Export Kanban Board to PDF'}
          </button>
        </div>
      </DragDropContext>

      {/* Render AddModal component for adding tasks */}
      <AddModal isOpen={modalOpen} onClose={closeModal} handleAddTask={handleAddTask} />
    </>
  );
};

export default Home;
