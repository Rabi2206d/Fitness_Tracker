import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import UserHeader from './header';

function Workout() {
  const [workoutData, setWorkoutData] = useState({
    category: 'strength',
    exercises: [{
      name: '',
      sets: '',
      reps: '',
      weight: '',
      notes: ''
    }],
    tags: []
  });
  const [workoutRecords, setWorkoutRecords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notesModal, setNotesModal] = useState(false);
  const [currentNotes, setCurrentNotes] = useState([]);

  useEffect(() => {
    fetchWorkoutData();
  }, []);

  const fetchWorkoutData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/getworkoutdetails', {
        headers: {
          'auth-token': localStorage.getItem('auth-token')
        }
      });
      setWorkoutRecords(response.data);
    } catch (error) {
      setError('Error fetching workout data');
      console.error('Error fetching workout data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('exercises.')) {
      const parts = name.split('.');
      const index = parseInt(parts[1]);
      const field = parts[2];

      setWorkoutData(prev => {
        const newExercises = [...prev.exercises];
        newExercises[index] = {
          ...newExercises[index],
          [field]: value
        };
        return {
          ...prev,
          exercises: newExercises
        };
      });
    } else {
      setWorkoutData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const removeExercise = (index) => {
    setWorkoutData(prev => {
      const newExercises = [...prev.exercises];
      newExercises.splice(index, 1);
      return {
        ...prev,
        exercises: newExercises
      };
    });
  };

  const addTag = () => {
    if (newTag.trim() && !workoutData.tags.includes(newTag.trim())) {
      setWorkoutData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setWorkoutData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);

      const token = localStorage.getItem('auth-token');
      const payload = {
        ...workoutData,
        exercises: workoutData.exercises.map(ex => ({
          ...ex,
          sets: Number(ex.sets),
          reps: Number(ex.reps),
          weight: Number(ex.weight)
        }))
      };

      if (editingId) {
        await axios.put(`http://localhost:4000/api/updateworkout/${editingId}`, payload, {
          headers: {
            'auth-token': token
          }
        });
        setSuccess('Workout updated successfully');
      } else {
        await axios.post('http://localhost:4000/api/addworkout', payload, {
          headers: {
            'auth-token': token
          }
        });
        setSuccess('Workout added successfully');
      }
      resetForm();
      fetchWorkoutData();
      setShowModal(false);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to save workout data');
      console.error('Error saving workout data:', error);
    }
  };

  const handleEdit = (record) => {
    setWorkoutData({
      category: record.category,
      exercises: record.exercises.map(ex => ({
        name: ex.name,
        sets: ex.sets.toString(),
        reps: ex.reps.toString(),
        weight: ex.weight.toString(),
        notes: ex.notes || ''
      })),
      tags: record.tags || []
    });
    setEditingId(record._id);
    setShowModal(true);
  };

  const confirmDelete = (id) => {
    setWorkoutToDelete(id);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      setError(null);
      setSuccess(null);

      await axios.delete(`http://localhost:4000/api/deleteworkout/${workoutToDelete}`, {
        headers: {
          'auth-token': localStorage.getItem('auth-token')
        }
      });

      setSuccess('Workout deleted successfully');
      fetchWorkoutData();
      setDeleteModal(false);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to delete workout');
      console.error('Error deleting workout:', error);
    }
  };

  const showExerciseNotes = (exercises) => {
    setCurrentNotes(exercises.filter(ex => ex.notes).map(ex => ({
      name: ex.name,
      notes: ex.notes
    })));
    setNotesModal(true);
  };

  const resetForm = () => {
    setWorkoutData({
      category: 'strength',
      exercises: [{
        name: '',
        sets: '',
        reps: '',
        weight: '',
        notes: ''
      }],
      tags: []
    });
    setEditingId(null);
  };

  const filteredWorkouts = workoutRecords.filter(workout => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const dateStr = new Date(workout.date).toLocaleDateString().toLowerCase();
    const categoryStr = workout.category.toLowerCase();
    const exerciseStr = workout.exercises.map(ex => 
      `${ex.name.toLowerCase()} ${ex.sets}x${ex.reps} ${ex.weight}kg`
    ).join(' ');
    const tagsStr = workout.tags?.join(' ').toLowerCase() || '';

    return (
      dateStr.includes(searchLower) ||
      categoryStr.includes(searchLower) ||
      exerciseStr.includes(searchLower) ||
      tagsStr.includes(searchLower)
    );
  });

  return (
    <>
      <UserHeader />

      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                  <h4 className="mb-sm-0">Workout Tracker</h4>
                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item"><Link>Fitness</Link></li>
                      <li className="breadcrumb-item active">Workouts</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-12">
                <div className="card" id="workoutList">
                  <div className="card-header border-bottom-dashed">
                    <div className="row g-4 align-items-center">
                      <div className="col-sm">
                        <div>
                          <h5 className="card-title mb-0">Workout List</h5>
                        </div>
                      </div>
                      <div className="col-sm-auto">
                        <div className="d-flex flex-wrap align-items-start gap-2">
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => {
                              resetForm();
                              setShowModal(true);
                            }}
                          >
                            <i className="ri-add-line align-bottom me-1"></i> Add Workout
                          </button>
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
                              placeholder="Search workouts by date, category, exercises or tags..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <i className="ri-search-line search-icon"></i>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="card-body">
                    <div>
                      {error && <div className="alert alert-danger">{error}</div>}
                      {success && <div className="alert alert-success">{success}</div>}

                      <div className="table-responsive table-card mb-1">
                        <table className="table align-middle" id="workoutTable">
                          <thead className="table-light text-muted">
                            <tr>
                              <th className="sort" data-sort="date">Date</th>
                              <th className="sort" data-sort="category">Category</th>
                              <th className="sort" data-sort="exercises">Exercises</th>
                              <th className="sort" data-sort="tags">Tags</th>
                              <th className="sort" data-sort="action">Action</th>
                            </tr>
                          </thead>
                          <tbody className="list form-check-all">
                            {filteredWorkouts.length === 0 ? (
                              <tr>
                                <td colSpan="5" className="text-center">
                                  <div className="noresult">
                                    <div className="text-center">
                                      <lord-icon
                                        src="https://cdn.lordicon.com/msoeawqm.json"
                                        trigger="loop"
                                        colors="primary:#121331,secondary:#08a88a"
                                        style={{ width: "75px", height: "75px" }}
                                      ></lord-icon>
                                      <h5 className="mt-2">No Workouts Found</h5>
                                      <p className="text-muted mb-0">No workouts match your search criteria.</p>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ) : (
                              filteredWorkouts.map((record) => (
                                <tr key={record._id}>
                                  <td className="date">{new Date(record.date).toLocaleDateString()}</td>
                                  <td className="category">
                                    <span className={`badge bg-${record.category === 'strength' ? 'primary' :
                                      record.category === 'cardio' ? 'success' :
                                        record.category === 'flexibility' ? 'warning' : 'info'}-subtle text-${record.category === 'strength' ? 'primary' :
                                          record.category === 'cardio' ? 'success' :
                                            record.category === 'flexibility' ? 'warning' : 'info'} text-uppercase`}>
                                      {record.category.charAt(0).toUpperCase() + record.category.slice(1)}
                                    </span>
                                  </td>
                                  <td className="exercises">
                                    <ul className="list-unstyled mb-0">
                                      {record.exercises.map((exercise, idx) => (
                                        <li key={idx}>
                                          <i className={`ri-${record.category === 'strength' ? 'weight-line' :
                                            record.category === 'cardio' ? 'run-line' :
                                              record.category === 'flexibility' ? 'mental-health-line' : 'focus-line'} align-middle me-1`}></i>
                                          {exercise.name} ({exercise.sets}x{exercise.reps})
                                          {exercise.weight > 0 && ` @ ${exercise.weight}kg`}
                                        </li>
                                      ))}
                                    </ul>
                                  </td>
                                  <td className="tags">
                                    {record.tags?.map((tag, idx) => (
                                      <span key={idx} className="badge bg-secondary-subtle text-secondary me-1">
                                        {tag}
                                      </span>
                                    ))}
                                  </td>
                                  <td className="text-center">
                                    <div className="d-flex justify-content-center">
                                      <ul className="list-inline hstack gap-2 mb-0">
                                        <li className="list-inline-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="Show Notes">
                                          <button
                                            className="btn btn-sm btn-soft-info"
                                            onClick={() => showExerciseNotes(record.exercises)}
                                          >
                                            <i className="ri-file-list-line fs-16"></i>
                                          </button>
                                        </li>
                                        <li className="list-inline-item edit" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="Edit">
                                          <button
                                            className="btn btn-sm btn-soft-primary edit-item-btn"
                                            onClick={() => handleEdit(record)}
                                          >
                                            <i className="ri-pencil-fill fs-16"></i>
                                          </button>
                                        </li>
                                        <li className="list-inline-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="Remove">
                                          <button
                                            className="btn btn-sm btn-soft-danger remove-item-btn"
                                            onClick={() => confirmDelete(record._id)}
                                          >
                                            <i className="ri-delete-bin-5-fill fs-16"></i>
                                          </button>
                                        </li>
                                      </ul>
                                    </div>
                                  </td>
                                </tr>
                              ))
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

        <div className={`modal fade ${showModal ? 'show' : ''}`} id="showModal" tabIndex="-1" aria-hidden="true" style={{ display: showModal ? 'block' : 'none' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-light p-3">
                <h5 className="modal-title">{editingId ? 'Edit Workout' : 'Add Workout'}</h5>
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
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      name="category"
                      value={workoutData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="strength">Strength</option>
                      <option value="cardio">Cardio</option>
                      <option value="flexibility">Flexibility</option>
                      <option value="balance">Balance</option>
                    </select>
                  </div>

                  <h5>Exercises</h5>
                  {workoutData.exercises.map((exercise, index) => (
                    <div key={index} className="card mb-3 p-3">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Exercise Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name={`exercises.${index}.name`}
                            value={exercise.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label">Sets</label>
                          <input
                            type="number"
                            className="form-control"
                            name={`exercises.${index}.sets`}
                            value={exercise.sets}
                            onChange={handleChange}
                            required
                            min="1"
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label">Reps</label>
                          <input
                            type="number"
                            className="form-control"
                            name={`exercises.${index}.reps`}
                            value={exercise.reps}
                            onChange={handleChange}
                            required
                            min="1"
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label">Weight (kg)</label>
                          <input
                            type="number"
                            className="form-control"
                            name={`exercises.${index}.weight`}
                            value={exercise.weight}
                            onChange={handleChange}
                            min="0"
                            step="0.5"
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Notes</label>
                          <input
                            type="text"
                            className="form-control"
                            name={`exercises.${index}.notes`}
                            value={exercise.notes}
                            onChange={handleChange}
                          />
                        </div>
                        {workoutData.exercises.length > 1 && (
                          <div className="col-12">
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => removeExercise(index)}
                            >
                              Remove Exercise
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="mb-3">
                    <label className="form-label">Tags</label>
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        className="form-control"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={addTag}
                      >
                        Add
                      </button>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {workoutData.tags.map((tag, index) => (
                        <span key={index} className="badge bg-primary">
                          {tag}
                          <button
                            type="button"
                            className="ms-2 btn-close btn-close-white"
                            onClick={() => removeTag(tag)}
                            aria-label="Remove"
                          />
                        </span>
                      ))}
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
                      {editingId ? 'Update' : 'Add Workout'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className={`modal fade ${deleteModal ? 'show' : ''}`} id="deleteRecordModal" tabIndex="-1" aria-hidden="true" style={{ display: deleteModal ? 'block' : 'none' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDeleteModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mt-2 text-center">
                  <lord-icon
                    src="https://cdn.lordicon.com/gsqxdxog.json"
                    trigger="loop"
                    colors="primary:#f7b84b,secondary:#f06548"
                    style={{ width: "100px", height: "100px" }}
                  ></lord-icon>
                  <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
                    <h4>Are you sure?</h4>
                    <p className="text-muted mx-4 mb-0">Are you sure you want to remove this workout?</p>
                  </div>
                </div>
                <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
                  <button
                    type="button"
                    className="btn w-sm btn-light"
                    onClick={() => setDeleteModal(false)}
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

        <div className={`modal fade ${notesModal ? 'show' : ''}`} id="notesModal" tabIndex="-1" aria-hidden="true" style={{ display: notesModal ? 'block' : 'none' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-light p-3">
                <h5 className="modal-title">Exercise Notes</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setNotesModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {currentNotes.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {currentNotes.map((note, index) => (
                      <div key={index} className="list-group-item">
                        <h6 className="mb-1">{note.name}</h6>
                        <p className="mb-0 text-muted">{note.notes}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <lord-icon
                      src="https://cdn.lordicon.com/msoeawqm.json"
                      trigger="loop"
                      colors="primary:#121331,secondary:#08a88a"
                      style={{ width: "75px", height: "75px" }}
                    ></lord-icon>
                    <h5 className="mt-2">No Notes Found</h5>
                    <p className="text-muted mb-0">There are no notes for this workout.</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setNotesModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Workout;