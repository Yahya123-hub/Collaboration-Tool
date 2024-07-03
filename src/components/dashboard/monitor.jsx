import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const MonitorAndChart = () => {
  const user = useSelector((state) => state.user);
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/assignTask/monitor/${user.email}`);
        setAssignments(response.data);
      } catch (error) {
        console.error('Error fetching assignments:', error);
        setError('Error fetching assignments');
        setTimeout(() => setError(''), 5000);
      }
    };

    fetchAssignments();
  }, [user.email]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/assignTask/del/${id}`);
      setAssignments(assignments.filter((assignment) => assignment._id !== id));
    } catch (error) {
      console.error('Error deleting assignment:', error);
      setError('Error deleting assignment');
      setTimeout(() => setError(''), 5000);
    }
  };

  const filteredAssignments = assignments.filter((assignment) => !assignment.isDone);

  const data = {
    labels: filteredAssignments.map((assignment) => assignment.task),
    datasets: [
      {
        label: 'Percent Completed',
        data: filteredAssignments.map((assignment) => assignment.percentComplete),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const assignment = filteredAssignments[context.dataIndex];
            return [
              `Task: ${assignment.task}`,
              `Assigned To: ${assignment.assignTo}`,
              `Assigned By: ${assignment.assignedBy}`,
              `Percent Completed: ${assignment.percentComplete}%`,
              `Is Done: ${assignment.isDone ? 'Yes' : 'No'}`,
            ];
          },
        },
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-8">
      <div className="bg-dark p-8 rounded-lg shadow-md w-full max-w-3xl backdrop-filter backdrop-blur-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Monitor Peers Tasks</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {assignments.length === 0 ? (
          <div className="text-white text-center">You have not assigned any tasks yet.</div>
        ) : (
          <table className="w-full text-white table-fixed">
            <thead>
              <tr>
                <th className="text-left px-6 py-3 w-1/5">Task</th>
                <th className="text-left px-6 py-3 w-1/5">Assigned To</th>
                <th className="text-left px-6 py-3 w-1/5">Assigned By</th>
                <th className="text-left px-6 py-3 w-1/5">Percent Completed</th>
                <th className="text-left px-6 py-3 w-1/5">Is Done</th>
                <th className="text-left px-6 py-3 w-1/5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment._id} className={assignment.isDone ? 'opacity-50' : ''}>
                  <td className="px-6 py-3">{assignment.task}</td>
                  <td className="px-6 py-3 break-words">{assignment.assignTo}</td>
                  <td className="px-6 py-3 break-words">{assignment.assignedBy}</td>
                  <td className="px-6 py-3">{assignment.percentComplete}%</td>
                  <td className="px-6 py-3">{assignment.isDone ? 'Yes' : 'No'}</td>
                  <td className="px-6 py-3">
                    {assignment.isDone && (
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        onClick={() => handleDelete(assignment._id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {filteredAssignments.length > 0 && (
        <div className="bg-dark p-8 rounded-lg shadow-md w-full max-w-3xl backdrop-filter backdrop-blur-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Task Completion Progress</h2>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <Bar data={data} options={options} />
        </div>
      )}
    </div>
  );
};

export default MonitorAndChart;
