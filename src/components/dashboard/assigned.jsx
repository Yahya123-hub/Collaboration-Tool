import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const AssignedTasks = () => {
  const user = useSelector((state) => state.user);
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/assignTask/${user.email}`);
        setAssignments(response.data);
      } catch (error) {
        console.error('Error fetching assignments:', error);
        setError('Error fetching assignments');
        setTimeout(() => setError(''), 5000);
      }
    };

    fetchAssignments();
  }, [user.email]);

  const handlePercentChange = async (assignmentId, newPercent) => {
    try {
      const isDone = newPercent === 100;
      await axios.patch(`http://localhost:3001/api/assignTask/${assignmentId}`, {
        percentComplete: newPercent,
        isDone,
      });

      setAssignments((prevAssignments) =>
        prevAssignments.map((assignment) =>
          assignment._id === assignmentId
            ? { ...assignment, percentComplete: newPercent, isDone }
            : assignment
        )
      );
    } catch (error) {
      console.error('Error updating assignment:', error);
      setError('Error updating assignment');
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center">
      <div className="bg-dark p-8 rounded-lg shadow-md w-full max-w-3xl backdrop-filter backdrop-blur-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Assigned Tasks</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {assignments.length === 0 ? (
          <div className="text-white text-center">You have not been assigned tasks yet.</div>
        ) : (
          <table className="w-full text-white table-fixed">
            <thead>
              <tr>
                <th className="text-left px-6 py-3 w-1/5">Task</th>
                <th className="text-left px-6 py-3 w-1/5">Assigned To</th>
                <th className="text-left px-6 py-3 w-1/5">Assigned By</th>
                <th className="text-left px-6 py-3 w-1/5">Percent Completed</th>
                <th className="text-left px-6 py-3 w-1/5">Is Done</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment._id} className={assignment.isDone ? 'opacity-50' : ''}>
                  <td className="px-6 py-3">{assignment.task}</td>
                  <td className="px-6 py-3 break-words">{assignment.assignTo}</td>
                  <td className="px-6 py-3 break-words">{assignment.assignedBy}</td>
                  <td className="px-6 py-3">
                    <select
                      className="bg-gray-800 text-white rounded px-2 py-1 w-full"
                      value={assignment.percentComplete}
                      onChange={(e) => handlePercentChange(assignment._id, parseInt(e.target.value))}
                      disabled={assignment.isDone}
                    >
                      {[...Array(21).keys()].map((i) => (
                        <option key={i * 5} value={i * 5}>
                          {i * 5}%
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-3">{assignment.isDone ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AssignedTasks;
