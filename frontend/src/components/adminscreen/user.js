import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminHeader from './header';
import { Link } from 'react-router-dom';

function UserDetails() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]); // Users to display on current page
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // You can adjust this number
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    axios.get('http://localhost:4000/api/users')
      .then((res) => {
        setUsers(res.data);
        setFilteredUsers(res.data);
      })
      .catch((err) => {
        console.error("Error fetching users:", err.response ? err.response.data : err.message);
        setError("Something went wrong while fetching users.");
      });
  }, []);

  // Handle search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.phone && user.phone.toString().includes(searchQuery)) ||
        (user.specialization && user.specialization.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.experience && user.experience.toString().includes(searchQuery)) ||
        (user.status && user.status.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredUsers(filtered);
    }
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchQuery, users]);

  // Handle pagination when filteredUsers changes
  useEffect(() => {
    // Calculate total pages
    const calculatedTotalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    setTotalPages(calculatedTotalPages);
    
    // Get current users to display
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    
    setDisplayedUsers(currentItems);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const loggedInUser = users[0];

  return (
    <>
      {loggedInUser && <AdminHeader file={loggedInUser.file} userName={loggedInUser.name} />}
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                  <h4 className="mb-sm-0">Users</h4>
                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item active">Users</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-12">
                <div className="card" id="customerList">
                  <div className="card-header border-bottom-dashed">
                    <div className="row g-4 align-items-center">
                      <div className="col-sm">
                        <div>
                          <h5 className="card-title mb-0">User List</h5>
                        </div>
                      </div>
                      <div className="col-sm-auto">
                        <div className="d-flex align-items-center">
                          <span className="text-muted me-2">Showing</span>
                          <span className="fw-semibold">
                            {(currentPage - 1) * itemsPerPage + 1} -{' '}
                            {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body border-bottom-dashed border-bottom">
                    <form>
                      <div className="row g-3">
                        <div className="col-xl-12">
                          <div className="search-box">
                            <input 
                              type="text" 
                              className="form-control search" 
                              placeholder="Search by name, email, phone, specialization..." 
                              value={searchQuery}
                              onChange={handleSearchChange}
                            />
                            <i className="ri-search-line search-icon"></i>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="card-body">
                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}
                    <div className="table-responsive table-card mb-1">
                      <table className="table align-middle" id="customerTable">
                        <thead className="table-light text-muted">
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
                        <tbody className="list form-check-all">
                          {displayedUsers.length > 0 ? (
                            displayedUsers.map((user) => (
                              <tr key={user._id}>
                                <td className="id">{user.name}</td>
                                <td className="customer_name">{user.email}</td>
                                <td className="email">{user.phone}</td>
                                <td className="phone">{user.specialization}</td>
                                <td className="date">{user.experience}</td>
                                <td className="date">
                                  <span className={`badge ${user.status === 'active' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} text-uppercase`}>
                                    {user.status}
                                  </span>
                                </td>
                                <td>
                                  <img
                                    src={`http://localhost:4000/uploads/${user.file}`}
                                    alt={user.name}
                                    className="rounded-circle"
                                    style={{ width: '50px', height: '50px' }}
                                  />
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="7" className="text-center py-4">
                                <div className="text-center">
                                  <lord-icon 
                                    src="https://cdn.lordicon.com/msoeawqm.json" 
                                    trigger="loop" 
                                    colors="primary:#121331,secondary:#08a88a"
                                    style={{ width: '75px', height: '75px' }}
                                  ></lord-icon>
                                  <h5 className="mt-2">No Users Found</h5>
                                  <p className="text-muted mb-0">No users match your search criteria.</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="d-flex justify-content-end">
                      <div className="pagination-wrap hstack gap-2">
                        <button 
                          className={`page-item pagination-prev ${currentPage === 1 ? 'disabled' : ''}`}
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                        
                        {/* Page numbers */}
                        <ul className="pagination listjs-pagination mb-0">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <li 
                              key={page} 
                              className={`page-item ${currentPage === page ? 'active' : ''}`}
                            >
                              <button 
                                className="page-link" 
                                onClick={() => handlePageChange(page)}
                              >
                                {page}
                              </button>
                            </li>
                          ))}
                        </ul>
                        
                        <button 
                          className={`page-item pagination-next ${currentPage === totalPages ? 'disabled' : ''}`}
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserDetails;