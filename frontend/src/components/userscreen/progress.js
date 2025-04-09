import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import UserHeader from './header';

function Progress() {
  const [progressData, setProgressData] = useState({
    weight: '',
    measurements: {
      chest: '',
      waist: '',
      hips: '',
      arms: '',
      legs: ''
    },
    performance: {
      runTime: '',
      maxLift: ''
    }
  });
  const [progressRecords, setProgressRecords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/getprogress', {
        headers: {
          'auth-token': localStorage.getItem('auth-token')
        }
      });
      setProgressRecords(response.data);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('measurements.')) {
      const measurementField = name.split('.')[1];
      setProgressData(prev => ({
        ...prev,
        measurements: {
          ...prev.measurements,
          [measurementField]: value
        }
      }));
    } else if (name.includes('performance.')) {
      const performanceField = name.split('.')[1];
      setProgressData(prev => ({
        ...prev,
        performance: {
          ...prev.performance,
          [performanceField]: value
        }
      }));
    } else {
      setProgressData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auth-token');
      if (editingId) {
        await axios.put(`http://localhost:4000/api/updateprogress/${editingId}`, progressData, {
          headers: {
            'auth-token': token
          }
        });
      } else {
        await axios.post('http://localhost:4000/api/addprogress', progressData, {
          headers: {
            'auth-token': token
          }
        });
      }
      resetForm();
      fetchProgressData();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving progress data:', error);
    }
  };

  const handleEdit = (record) => {
    setProgressData({
      weight: record.weight,
      measurements: record.measurements,
      performance: record.performance
    });
    setEditingId(record._id);
    setShowModal(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/deleteprogress/${deleteId}`, {
        headers: {
          'auth-token': localStorage.getItem('auth-token')
        }
      });
      fetchProgressData();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting progress record:', error);
    }
  };

  const resetForm = () => {
    setProgressData({
      weight: '',
      measurements: {
        chest: '',
        waist: '',
        hips: '',
        arms: '',
        legs: ''
      },
      performance: {
        runTime: '',
        maxLift: ''
      }
    });
    setEditingId(null);
  };

  const filteredRecords = progressRecords.filter(record => {
    const searchLower = searchTerm.toLowerCase();
    return (
      record.weight.toString().includes(searchLower) ||
      record.measurements.chest.toString().includes(searchLower) ||
      record.measurements.waist.toString().includes(searchLower) ||
      record.performance.runTime.toString().includes(searchLower) ||
      record.performance.maxLift.toString().includes(searchLower)
    );
  });

  return (
    <>
      <UserHeader/>
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                  <h4 className="mb-sm-0">Progress</h4>
                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item active">Progress</li>
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
                          <h5 className="card-title mb-0">Progress Records</h5>
                        </div>
                      </div>
                      <div className="col-sm-auto">
                        <div className="d-flex flex-wrap align-items-start gap-2">
                          <button 
                            type="button" 
                            className="btn btn-success add-btn" 
                            onClick={() => {
                              resetForm();
                              setShowModal(true);
                            }}
                          >
                            <i className="ri-add-line align-bottom me-1"></i> Add Progress
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body border-bottom-dashed border-bottom">
                    <form>
                      <div className="row g-3">
                        <div className="col-xl-4">
                          <div className="search-box">
                            <input 
                              type="text" 
                              className="form-control search" 
                              placeholder="Search for weight, measurements, performance..." 
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <i className="ri-search-line search-icon"></i>
                          </div>
                        </div>
                    
                      <div className="col-sm-4">
                        <div>
                          <input type="text" className="form-control" id="datepicker-range" data-provider="flatpickr" data-date-format="d M, Y" data-range-date="true" placeholder="Select date" />
                        </div>
                      </div>
                      
                      <div className="col-sm-4">
                        <div>
                          <button type="button" className="btn btn-primary w-100"><i className="ri-equalizer-fill me-2 align-bottom"></i>Filters</button>
                        </div>
                      </div>
                      </div>
                    </form>
                  </div>
                  
                  <div className="card-body">
                    <div>
                      <div className="table-responsive table-card mb-1">
                        <table className="table align-middle" id="customerTable">
                          <thead className="table-light text-muted">
                            <tr>
                              <th>Date</th>
                              <th>Weight (kg)</th>
                              <th>Chest (cm)</th>
                              <th>Waist (cm)</th>
                              <th>Hips (cm)</th>
                              <th>Run Time (min)</th>
                              <th>Max Lift (kg)</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody className="list form-check-all">
                            {filteredRecords.length > 0 ? (
                              filteredRecords.map((record) => (
                                <tr key={record._id}>
                                  <td>{new Date(record.createdAt).toLocaleDateString()}</td>
                                  <td>{record.weight}</td>
                                  <td>{record.measurements.chest}</td>
                                  <td>{record.measurements.waist}</td>
                                  <td>{record.measurements.hips}</td>
                                  <td>{record.performance.runTime}</td>
                                  <td>{record.performance.maxLift}</td>
                                  <td>
                                    <ul className="list-inline hstack gap-2 mb-0">
                                      <li className="list-inline-item edit" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="Edit">
                                        <Link
                                          className="text-primary d-inline-block edit-item-btn"
                                          onClick={() => handleEdit(record)}
                                        >
                                          <i className="ri-pencil-fill fs-16"></i>
                                        </Link>
                                      </li>
                                      <li className="list-inline-item" data-bs-tooltip="tooltip" title="Remove">
                                        <Link
                                          className="text-danger d-inline-block remove-item-btn"
                                          onClick={() => handleDeleteClick(record._id)}
                                        >
                                          <i className="ri-delete-bin-5-fill fs-16"></i>
                                        </Link>
                                      </li>
                                    </ul>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="8" className="text-center">
                                  <div className="noresult">
                                    <div className="text-center">
                                      <lord-icon
                                        src="https://cdn.lordicon.com/msoeawqm.json"
                                        trigger="loop"
                                        colors="primary:#121331,secondary:#08a88a"
                                        style={{ width: '75px', height: '75px' }}
                                      ></lord-icon>
                                      <h5 className="mt-2">Sorry! No Result Found</h5>
                                      <p className="text-muted mb-0">
                                        No progress records found. Add a new record to get started.
                                      </p>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Progress Modal */}
        <div className={`modal fade ${showModal ? 'show d-block' : ''}`} id="showModal" tabIndex="-1" aria-hidden="true" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-light p-3">
                <h5 className="modal-title">{editingId ? 'Edit Progress' : 'Add Progress'}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }} 
                  aria-label="Close"
                ></button>
              </div>
              <form className="tablelist-form" onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="weight" className="form-label">Weight (kg)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="weight"
                      name="weight"
                      value={progressData.weight}
                      onChange={handleChange}
                      placeholder="Enter weight"
                      required
                    />
                  </div>

                  <h6 className="mb-3">Measurements (cm)</h6>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label htmlFor="chest" className="form-label">Chest</label>
                      <input
                        type="number"
                        className="form-control"
                        id="chest"
                        name="measurements.chest"
                        value={progressData.measurements.chest}
                        onChange={handleChange}
                        placeholder="Enter chest measurement"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="waist" className="form-label">Waist</label>
                      <input
                        type="number"
                        className="form-control"
                        id="waist"
                        name="measurements.waist"
                        value={progressData.measurements.waist}
                        onChange={handleChange}
                        placeholder="Enter waist measurement"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="hips" className="form-label">Hips</label>
                      <input
                        type="number"
                        className="form-control"
                        id="hips"
                        name="measurements.hips"
                        value={progressData.measurements.hips}
                        onChange={handleChange}
                        placeholder="Enter hips measurement"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="arms" className="form-label">Arms</label>
                      <input
                        type="number"
                        className="form-control"
                        id="arms"
                        name="measurements.arms"
                        value={progressData.measurements.arms}
                        onChange={handleChange}
                        placeholder="Enter arms measurement"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="legs" className="form-label">Legs</label>
                      <input
                        type="number"
                        className="form-control"
                        id="legs"
                        name="measurements.legs"
                        value={progressData.measurements.legs}
                        onChange={handleChange}
                        placeholder="Enter legs measurement"
                      />
                    </div>
                  </div>

                  <h6 className="mb-3">Performance</h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="runTime" className="form-label">Run Time (minutes)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="runTime"
                        name="performance.runTime"
                        value={progressData.performance.runTime}
                        onChange={handleChange}
                        placeholder="Enter run time"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="maxLift" className="form-label">Max Lift (kg)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="maxLift"
                        name="performance.maxLift"
                        value={progressData.performance.maxLift}
                        onChange={handleChange}
                        placeholder="Enter max lift"
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <div className="hstack gap-2 justify-content-end">
                    <button 
                      type="button" 
                      className="btn btn-light" 
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                    >
                      Close
                    </button>
                    <button type="submit" className="btn btn-success">
                      {editingId ? 'Update' : 'Add'} Progress
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <div className={`modal fade ${showDeleteModal ? 'show d-block' : ''}`} id="deleteRecordModal" tabIndex="-1" aria-hidden="true" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowDeleteModal(false)} 
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mt-2 text-center">
                  <lord-icon
                    src="https://cdn.lordicon.com/gsqxdxog.json"
                    trigger="loop"
                    colors="primary:#f7b84b,secondary:#f06548"
                    style={{ width: '100px', height: '100px' }}
                  ></lord-icon>
                  <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
                    <h4>Are you sure?</h4>
                    <p className="text-muted mx-4 mb-0">Are you sure you want to remove this record?</p>
                  </div>
                </div>
                <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
                  <button 
                    type="button" 
                    className="btn w-sm btn-light" 
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Close
                  </button>
                  <button 
                    type="button" 
                    className="btn w-sm btn-danger" 
                    onClick={handleDelete}
                  >
                    Yes, Delete It!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="footer">
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-6">
                <script>document.write(new Date().getFullYear())</script> © Velzon.
              </div>
              <div className="col-sm-6">
                <div className="text-sm-end d-none d-sm-block">
                  Design & Develop by Themesbrand
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Progress;