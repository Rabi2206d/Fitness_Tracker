import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
  const [showForm, setShowForm] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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

  const addExercise = () => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          name: '',
          sets: '',
          reps: '',
          weight: '',
          notes: ''
        }
      ]
    }));
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
      setShowForm(false);
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
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this workout?")) {
      try {
        setError(null);
        setSuccess(null);
        
        await axios.delete(`http://localhost:4000/api/deleteworkout/${id}`, {
          headers: {
            'auth-token': localStorage.getItem('auth-token')
          }
        });
        
        setSuccess('Workout deleted successfully');
        fetchWorkoutData();
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to delete workout');
        console.error('Error deleting workout:', error);
      }
    }
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

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Workout Tracker</h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
        >
          {showForm ? 'Hide Form' : 'Add Workout'}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-5">
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

          <h4>Exercises</h4>
          {workoutData.exercises.map((exercise, index) => (
            <div key={index} className="card mb-3 p-3">
              <div className="row">
                <div className="col-md-6 mb-3">
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
                <div className="col-md-2 mb-3">
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
                <div className="col-md-2 mb-3">
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
                <div className="col-md-2 mb-3">
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
              </div>
              <div className="mb-3">
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
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => removeExercise(index)}
                >
                  Remove Exercise
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className="btn btn-secondary mb-3 me-2"
            onClick={addExercise}
          >
            Add Another Exercise
          </button>

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

          <div>
            <button type="submit" className="btn btn-primary me-2">
              {editingId ? 'Update' : 'Submit'}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      <div className="mt-5">
        <h3>Your Workout Records</h3>
        {workoutRecords.length === 0 ? (
          <p>No workout records found</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Exercises</th>
                  <th>Tags</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {workoutRecords.map((record) => (
                  <tr key={record._id}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{record.category.charAt(0).toUpperCase() + record.category.slice(1)}</td>
                    <td>
                      <ul className="list-unstyled">
                        {record.exercises.map((exercise, idx) => (
                          <li key={idx}>
                            {exercise.name} ({exercise.sets}x{exercise.reps})
                            {exercise.weight > 0 && ` @ ${exercise.weight}kg`}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      {record.tags?.map((tag, idx) => (
                        <span key={idx} className="badge bg-primary me-1">
                          {tag}
                        </span>
                      ))}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(record)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(record._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Workout;