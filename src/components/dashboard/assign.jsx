import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const GroupTasks = () => {
  const user = useSelector((state) => state.user);
  const [groups, setGroups] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/groups/${user.email}`);
        setGroups(response.data.groups || []);
      } catch (error) {
        console.error('Error fetching groups:', error);
        setGroups([]);
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/gettodo/${user.email}`);
        setTasks(response.data || []);
        // Initialize assignments array with default values
        const initialAssignments = response.data.map(task => ({ task: task.todo, group: '' }));
        setAssignments(initialAssignments);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setTasks([]);
      }
    };

    fetchGroups();
    fetchTasks();
  }, [user.email]);

  const handleGroupChange = async (index, event) => {
    const newAssignments = [...assignments];  // Make a copy of assignments array
    newAssignments[index] = {
      ...newAssignments[index],               // Make a copy of the assignment object
      group: event.target.value               // Update the group property
    };
    setAssignments(newAssignments);           // Update the state with the modified assignments

    // Save assignment immediately on group change
    await saveAssignment(newAssignments[index]);
  };

  const saveAssignment = async (assignment) => {
    const task = tasks.find(t => t.todo === assignment.task);
    const group = groups.find(g => g._id === assignment.group);
    const assignTo = group ? group.members.filter(member => member !== user.email).join(', ') : '';

    const dataToSave = {
      task: task ? task.todo : '',
      assignTo,
      assignedBy: user.email,
      percentComplete: 0,
      isDone: false,
      isAssigned: true
    };

    try {
      setIsSaving(true);
      await axios.post('http://localhost:3001/api/assignTask', dataToSave);
      setIsSaving(false);
      setError('');
      //alert('Assignment saved');
    } catch (error) {
      console.error('Error saving assignment:', error);
      setError('Error saving assignment.');
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-start justify-center">
      <div className="bg-dark p-8 rounded-lg shadow-md w-full max-w-md backdrop-filter backdrop-blur-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Assign Tasks</h2>
        {error && (
          <div className="bg-red-500 text-white p-2 mb-4 rounded">
            {error}
          </div>
        )}
        {groups.length === 0 ? (
          <div className="text-white text-center">You have not made any groups yet.</div>
        ) : (
          <table className="w-full text-white">
            <thead>
              <tr>
                <th className="text-left">Task</th>
                <th className="text-left">Select Group</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={index}>
                  <td>{task.todo}</td>
                  <td>
                    <select
                      className="bg-gray-800 text-white rounded px-2 py-1 w-full"
                      value={assignments[index]?.group || ''}
                      onChange={(e) => handleGroupChange(index, e)}
                    >
                      <option value="">Select a group</option>
                      {groups.map((group) => (
                        <option key={group._id} value={group._id}>
                          {group.members.filter(member => member !== user.email).join(', ')}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default GroupTasks;
