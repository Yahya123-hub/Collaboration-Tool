import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const CollaboratorForm = () => {
  const user = useSelector((state) => state.user);
  const [email, setEmail] = useState('');
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    
    fetchGroups();
  }, [user.email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the email is the same as the logged-in user's email
    if (email === user.email) {
      setError("You can't invite yourself to a group.");
      setSuccess('');
      setTimeout(() => {
        setError('');
      }, 5000);
      return;
    }

    // Check if a group already exists between the entered email and the logged-in user
    const groupExists = groups.some(group => group.members.includes(email));
    if (groupExists) {
      setError('You are already in a group with this user.');
      setSuccess('');
      setTimeout(() => {
        setError('');
      }, 5000);
      return;
    }

    try {
      await axios.post('http://localhost:3001/api/collaborators/request', { email, senderEmail: user.email });
      setSuccess('Collaboration request sent');
      setError('');
      setTimeout(() => {
        setSuccess('');
      }, 5000);
    } catch (error) {
      setError('Error sending collaboration request, email server timed out.');
      console.log(user.email)
      console.log(email)
      setSuccess('');
      console.error('Error:', error);
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center">
      <div className="bg-dark p-8 rounded-lg shadow-md w-full max-w-md backdrop-filter backdrop-blur-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Send Collaboration Request</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-white">Collaborator must be registered on system</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter collaborator's email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="w-92 px-4 py-2 my-1 text-sm bg-red-600 text-white rounded text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="w-92 px-4 py-2 my-1 text-sm bg-green-600 text-white rounded text-center">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="bg-gradient-to-r from-blue-400 to-blue-600 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
          >
            Send Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default CollaboratorForm;
