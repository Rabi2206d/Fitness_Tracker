import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminHeader from './header';  // Ensure correct import

function UserDetails() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null); // To capture errors

  useEffect(() => {
    axios.get('http://localhost:4000/api/users')  // Backend route to fetch users
      .then((res) => {
        setUsers(res.data);  // Set the users data
      })
      .catch((err) => {
        console.error("Error fetching users:", err.response ? err.response.data : err.message);
        setError("Something went wrong while fetching users.");
      });
  }, []);

  // Assuming the first user is logged in (or you can add logic to get the logged-in user)
  const loggedInUser = users[0]; // You can replace this with the logic for the actual logged-in user.

  return (
    <>
      {/* Pass the avatar (file path) and username to AdminHeader */}
      {loggedInUser && <AdminHeader file={loggedInUser.file} userName={loggedInUser.name} />}

      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            {/* Heading */}
            <div className="row">
              <div className="col-12">
                <h4 className="mb-sm-0">Customers</h4>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {/* Users Table */}
            <div className="row mt-4">
              <div className="col-lg-12">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Specialization</th>
                      <th>Experience</th>
                      <th>Status</th>
                      <th>Avatar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.specialization}</td>
                        <td>{user.experience}</td>
                        <td>{user.status}</td>
                        <td>
                          {/* Display avatar image */}
                          <img
                            src={`http://localhost:4000/uploads/${user.file}`}  // Dynamically set the avatar image
                            alt={user.name}
                            className="rounded-circle"
                            style={{ width: '50px', height: '50px' }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default UserDetails;
