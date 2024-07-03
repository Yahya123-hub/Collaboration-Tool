import ChartComponent from "./chart";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNotifications } from './notificationcontext';
import { useUserContext } from './usercontext'; 
import "../../styles.css";

let timers = [];

const fetchTasks = async (email) => {
  try {
    const response = await axios.get(`http://localhost:3001/api/kanban/fetch-tasks/${email}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return {};
  }
};

const startTimers = async (email) => {
  try {
    const { backlogTasks, pendingTasks, todoTasks, doingTasks, doneTasks } = await fetchTasks(email);
    const allTasks = [
      ...backlogTasks,
      ...pendingTasks,
      ...todoTasks,
      ...doingTasks,
      ...doneTasks
    ];

    clearTimers();

    allTasks.forEach(task => {
      const { title, description, deadline } = task;
      const delay = deadline * 30 * 1000; // Adjust this as per your requirements

      const timer = setTimeout(async () => {
        await insertNotification({ title, description, pingTime: new Date(), email });
      }, delay);

      timers.push(timer);
    });
  } catch (error) {
    console.error('Error starting timers:', error);
  }
};

const clearTimers = () => {
  timers.forEach(timer => clearTimeout(timer));
  timers = [];
};

const insertNotification = async (notification) => {
  try {
    const response = await axios.post('http://localhost:3001/api/notifications/addnotification', notification);
    console.log(response.data);
  } catch (error) {
    console.error('Error inserting notification:', error);
  }
};

const Dashboard = () => {
  const { email, setEmail } = useUserContext(); 
  const [totalTasks, setTotalTasks] = useState([]);
  const [highPriorityTasks, setHighPriorityTasks] = useState([]);
  const [personalTasks, setPersonalTasks] = useState([]);
  const [worktasks, setworktasks] = useState([]);
  const { notifications, setNotifications } = useNotifications();
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalTasksResponse = await axios.get(`http://localhost:3001/api/gettodo/${email}`);
        setTotalTasks(totalTasksResponse.data.length);

        const highPriorityTasksResponse = await axios.get(`http://localhost:3001/api/todopriority/${email}`);
        setHighPriorityTasks(highPriorityTasksResponse.data.length);

        const personalTasksResponse = await axios.get(`http://localhost:3001/api/todopersonal/${email}`);
        setPersonalTasks(personalTasksResponse.data.length);

        const worktasksResponse = await axios.get(`http://localhost:3001/api/todowork/${email}`);
        setworktasks(worktasksResponse.data.length);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    if (email) {
      startTimers(email);
    }

    const handlePopState = () => {
      setEmail(null);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      clearTimers();
      window.removeEventListener('popstate', handlePopState);
    };

  }, [email, setEmail]);

  useEffect(() => {
    const intervalId = setInterval(fetchNotifications, 5000); // Fetch notifications every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [email, notifications.length]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/notifications/getnotis/${email}`);
      const newNotifications = response.data;
      if (newNotifications.length > notifications.length) {
        setAlert('New Task Alert');
        setTimeout(() => setAlert(null), 5000);
      }
      setNotifications(newNotifications);

    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const chartLabels = ['Total Tasks', 'High Priority', 'Personal', 'Work'];
  const chartData = [
    { _id: 1, count: totalTasks },
    { _id: 2, count: highPriorityTasks },
    { _id: 3, count: personalTasks },
    { _id: 4, count: worktasks },
  ];

  useEffect(() => {
    // Lock the scrollbar position when the component mounts
    const scrollPosition = window.innerHeight * 0.1; 
    window.scrollTo(0, scrollPosition);
  }, []);

  return (
    <div className="flex flex-col py-10 lg:px-16 md:px10 px-6 h-screen overflow-y-auto w-full">
      <h2 className="lg:text-3xl md:text-2xl text-xl">
        Dash
        <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-transparent bg-clip-text">
          {""}board
        </span>

      </h2>

      {alert && (
        <div className="alert bg-blue-500 text-white p-4 mb-4 rounded lg">
          {alert}
        </div>
      )}

      <div className="md:flex md:space-x-8 py-6 ">
        <div className="flex flex-col rounded-md border md:w-[400px] w-[250px] h-[150px] md:p-8 p-4 justify-center">
          <h2>Total Tasks</h2>
          <p className="text-gray-500 mt-3">{totalTasks}</p>
        </div>
        <div className="flex flex-col rounded-md border md:w-[400px] w-[250px] h-[150px] md:p-8 p-4 justify-center md:mt-0 mt-4">
          <h2>High Priority Tasks</h2>
          <p className="text-gray-500 mt-3">{highPriorityTasks}</p>
        </div>
      </div>
      
      <div className="flex space-x-8 py-6 w-4/5">
        <div id="taskGraph" className="flex flex-col rounded-md border w-full p-8 justify-center">
          Tasks Graph
          <ChartComponent
            data={chartData}
            labels={chartLabels}
            title="Tasks"
          />
        </div>
      </div>

      <div className="md:flex md:space-x-8 py-6">
        <div className="flex flex-col rounded-md border  md:w-[400px] w-[250px] h-[200px] md:p-8 p-4 justify-center">
          <h2>Personal Tasks</h2>
          <p className="text-gray-500 mt-3">{personalTasks}</p>
        </div>
        <div className="flex flex-col rounded-md border md:w-[400px] w-[250px] h-[200px] md:p-8 p-4 justify-center md:mt-0 mt-4">
          <h2>Work Tasks</h2>
          <p className="text-gray-500 mt-3">{worktasks}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
