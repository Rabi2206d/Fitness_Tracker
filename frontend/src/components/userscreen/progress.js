import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/deleteprogress/${id}`, {
        headers: {
          'auth-token': localStorage.getItem('auth-token')
        }
      });
      fetchProgressData();
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

  return (
    <div className="container mt-5">
      <h2>{editingId ? 'Update Progress' : 'Add Progress'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Weight (kg)</label>
          <input
            type="number"
            className="form-control"
            name="weight"
            value={progressData.weight}
            onChange={handleChange}
            required
          />
        </div>

        <h4>Measurements (cm)</h4>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Chest</label>
            <input
              type="number"
              className="form-control"
              name="measurements.chest"
              value={progressData.measurements.chest}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Waist</label>
            <input
              type="number"
              className="form-control"
              name="measurements.waist"
              value={progressData.measurements.waist}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Hips</label>
            <input
              type="number"
              className="form-control"
              name="measurements.hips"
              value={progressData.measurements.hips}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Arms</label>
            <input
              type="number"
              className="form-control"
              name="measurements.arms"
              value={progressData.measurements.arms}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Legs</label>
            <input
              type="number"
              className="form-control"
              name="measurements.legs"
              value={progressData.measurements.legs}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <h4>Performance</h4>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Run Time (seconds)</label>
            <input
              type="number"
              className="form-control"
              name="performance.runTime"
              value={progressData.performance.runTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Max Lift (kg)</label>
            <input
              type="number"
              className="form-control"
              name="performance.maxLift"
              value={progressData.performance.maxLift}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary me-2">
          {editingId ? 'Update' : 'Submit'}
        </button>
        {editingId && (
          <button type="button" className="btn btn-secondary" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <div className="mt-5">
        <h3>Your Progress Records</h3>
        {progressRecords.length === 0 ? (
          <p>No progress records found</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Weight</th>
                  <th>Chest</th>
                  <th>Waist</th>
                  <th>Run Time</th>
                  <th>Max Lift</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {progressRecords.map((record) => (
                  <tr key={record._id}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{record.weight} kg</td>
                    <td>{record.measurements.chest} cm</td>
                    <td>{record.measurements.waist} cm</td>
                    <td>{record.performance.runTime} s</td>
                    <td>{record.performance.maxLift} kg</td>
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

export default Progress;