import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Nutrition() {
  const [nutritionData, setNutritionData] = useState({
    mealType: 'breakfast',
    foodItems: [{
      name: '',
      quantity: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: ''
    }]
  });
  const [nutritionRecords, setNutritionRecords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchNutritionData();
  }, []);

  const fetchNutritionData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/getnutrition', {
        headers: {
          'auth-token': localStorage.getItem('auth-token')
        }
      });
      setNutritionRecords(response.data);
    } catch (error) {
      console.error('Error fetching nutrition data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('foodItems.')) {
      const parts = name.split('.');
      const index = parseInt(parts[1]);
      const field = parts[2];
      
      setNutritionData(prev => {
        const newFoodItems = [...prev.foodItems];
        newFoodItems[index] = {
          ...newFoodItems[index],
          [field]: value
        };
        return {
          ...prev,
          foodItems: newFoodItems
        };
      });
    } else {
      setNutritionData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addFoodItem = () => {
    setNutritionData(prev => ({
      ...prev,
      foodItems: [
        ...prev.foodItems,
        {
          name: '',
          quantity: '',
          calories: '',
          protein: '',
          carbs: '',
          fat: ''
        }
      ]
    }));
  };

  const removeFoodItem = (index) => {
    setNutritionData(prev => {
      const newFoodItems = [...prev.foodItems];
      newFoodItems.splice(index, 1);
      return {
        ...prev,
        foodItems: newFoodItems
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auth-token');
      const payload = {
        mealType: nutritionData.mealType,
        foodItems: nutritionData.foodItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          calories: Number(item.calories),
          protein: Number(item.protein),
          carbs: Number(item.carbs),
          fat: Number(item.fat)
        }))
      };
  
      if (editingId) {
        await axios.put(`http://localhost:4000/api/updatenutrition/${editingId}`, payload, {
          headers: {
            'auth-token': token
          }
        });
      } else {
        await axios.post('http://localhost:4000/api/addnutrition', payload, {
          headers: {
            'auth-token': token
          }
        });
      }
      resetForm();
      fetchNutritionData();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving nutrition data:', error.response?.data || error.message);
    }
  };

  const handleEdit = (record) => {
    setNutritionData({
      mealType: record.meals[0].type,
      foodItems: record.meals[0].items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        calories: item.calories.toString(),
        protein: item.protein.toString(),
        carbs: item.carbs.toString(),
        fat: item.fat.toString()
      }))
    });
    setEditingId(record._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/deletenutrition/${id}`, {
        headers: {
          'auth-token': localStorage.getItem('auth-token')
        }
      });
      fetchNutritionData();
    } catch (error) {
      console.error('Error deleting nutrition record:', error);
    }
  };

  const resetForm = () => {
    setNutritionData({
      mealType: 'breakfast',
      foodItems: [{
        name: '',
        quantity: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: ''
      }]
    });
    setEditingId(null);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Nutrition Tracker</h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
        >
          {showForm ? 'Hide Form' : 'Add Nutrition Entry'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-5">
          <div className="mb-3">
            <label className="form-label">Meal Type</label>
            <select
              className="form-select"
              name="mealType"
              value={nutritionData.mealType}
              onChange={handleChange}
              required
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          <h4>Food Items</h4>
          {nutritionData.foodItems.map((item, index) => (
            <div key={index} className="card mb-3 p-3">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Food Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name={`foodItems.${index}.name`}
                    value={item.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Quantity</label>
                  <input
                    type="text"
                    className="form-control"
                    name={`foodItems.${index}.quantity`}
                    value={item.quantity}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-3 mb-3">
                  <label className="form-label">Calories</label>
                  <input
                    type="number"
                    className="form-control"
                    name={`foodItems.${index}.calories`}
                    value={item.calories}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Protein (g)</label>
                  <input
                    type="number"
                    className="form-control"
                    name={`foodItems.${index}.protein`}
                    value={item.protein}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Carbs (g)</label>
                  <input
                    type="number"
                    className="form-control"
                    name={`foodItems.${index}.carbs`}
                    value={item.carbs}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Fat (g)</label>
                  <input
                    type="number"
                    className="form-control"
                    name={`foodItems.${index}.fat`}
                    value={item.fat}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              {nutritionData.foodItems.length > 1 && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => removeFoodItem(index)}
                >
                  Remove Item
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className="btn btn-secondary mb-3 me-2"
            onClick={addFoodItem}
          >
            Add Another Food Item
          </button>

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
        <h3>Your Nutrition Records</h3>
        {nutritionRecords.length === 0 ? (
          <p>No nutrition records found</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Meal Type</th>
                  <th>Items</th>
                  <th>Total Calories</th>
                  <th>Total Protein</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {nutritionRecords.map((record) => {
                  const meal = record.meals[0];
                  const totalCalories = meal.items.reduce((sum, item) => sum + (item.calories || 0), 0);
                  const totalProtein = meal.items.reduce((sum, item) => sum + (item.protein || 0), 0);
                  
                  return (
                    <tr key={record._id}>
                      <td>{new Date(record.date).toLocaleDateString()}</td>
                      <td>{meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}</td>
                      <td>
                        <ul className="list-unstyled">
                          {meal.items.map((item, idx) => (
                            <li key={idx}>
                              {item.name} ({item.quantity})
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td>{totalCalories} kcal</td>
                      <td>{totalProtein}g</td>
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Nutrition;