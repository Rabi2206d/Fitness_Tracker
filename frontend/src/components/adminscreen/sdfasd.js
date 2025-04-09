import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
      setShowModal(false);
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
    setShowModal(true);
  };

  const confirmDelete = (id) => {
    setRecordToDelete(id);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/deletenutrition/${recordToDelete}`, {
        headers: {
          'auth-token': localStorage.getItem('auth-token')
        }
      });
      fetchNutritionData();
      setDeleteModal(false);
      setRecordToDelete(null);
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

  const filteredRecords = nutritionRecords.filter(record => {
    const meal = record.meals[0];
    const searchLower = searchTerm.toLowerCase();
    return (
      meal.type.toLowerCase().includes(searchLower) ||
      meal.items.some(item => item.name.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                <h4 className="mb-sm-0">Nutrition Tracker</h4>
                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item"><Link>Health</Link></li>
                    <li className="breadcrumb-item active">Nutrition</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="card" id="nutritionList">
                <div className="card-header border-bottom-dashed">
                  <div className="row g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0">Nutrition Records</h5>
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
                          <i className="ri-add-line align-bottom me-1"></i> Add Record
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
                            placeholder="Search for meal type or food items..." 
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
                    <div className="table-responsive table-card mb-1">
                      <table className="table align-middle" id="nutritionTable">
                        <thead className="table-light text-muted">
                          <tr>
                            <th scope="col">Date</th>
                            <th className="sort" data-sort="meal_type">Meal Type</th>
                            <th className="sort" data-sort="food_items">Food Items</th>
                            <th className="sort" data-sort="calories">Calories</th>
                            <th className="sort" data-sort="protein">Protein</th>
                            <th className="sort" data-sort="carbs">Carbs</th>
                            <th className="sort" data-sort="fat">Fat</th>
                            <th className="sort" data-sort="action">Action</th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {filteredRecords.length === 0 ? (
                            <tr>
                              <td colSpan="8" className="text-center">
                                <div className="noresult">
                                  <div className="text-center">
                                    <lord-icon 
                                      src="https://cdn.lordicon.com/msoeawqm.json" 
                                      trigger="loop" 
                                      colors="primary:#121331,secondary:#08a88a"
                                      style={{width: "75px", height: "75px"}}
                                    ></lord-icon>
                                    <h5 className="mt-2">No Records Found</h5>
                                    <p className="text-muted mb-0">No nutrition records found matching your search.</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            filteredRecords.map((record) => {
                              const meal = record.meals[0];
                              const totalCalories = meal.items.reduce((sum, item) => sum + (item.calories || 0), 0);
                              const totalProtein = meal.items.reduce((sum, item) => sum + (item.protein || 0), 0);
                              const totalCarbs = meal.items.reduce((sum, item) => sum + (item.carbs || 0), 0);
                              const totalFat = meal.items.reduce((sum, item) => sum + (item.fat || 0), 0);
                              
                              return (
                                <tr key={record._id}>
                                  <td>{new Date(record.date).toLocaleDateString()}</td>
                                  <td className="meal_type">{meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}</td>
                                  <td className="food_items">
                                    <ul className="list-unstyled mb-0">
                                      {meal.items.map((item, idx) => (
                                        <li key={idx}>
                                          {item.name} ({item.quantity})
                                        </li>
                                      ))}
                                    </ul>
                                  </td>
                                  <td className="calories">{totalCalories} kcal</td>
                                  <td className="protein">{totalProtein}g</td>
                                  <td className="carbs">{totalCarbs}g</td>
                                  <td className="fat">{totalFat}g</td>
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
                                      <li className="list-inline-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" title="Remove">
                                        <Link 
                                          className="text-danger d-inline-block remove-item-btn" 
                                          onClick={() => confirmDelete(record._id)}
                                        >
                                          <i className="ri-delete-bin-5-fill fs-16"></i>
                                        </Link>
                                      </li>
                                    </ul>
                                  </td>
                                </tr>
                              );
                            })
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

      {/* Add/Edit Nutrition Modal */}
      <div className={`modal fade ${showModal ? 'show' : ''}`} id="showModal" tabIndex="-1" aria-hidden="true" style={{display: showModal ? 'block' : 'none'}}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-light p-3">
              <h5 className="modal-title">{editingId ? 'Edit Nutrition Record' : 'Add Nutrition Record'}</h5>
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

                <h5>Food Items</h5>
                {nutritionData.foodItems.map((item, index) => (
                  <div key={index} className="card mb-3 p-3">
                    <div className="row g-3">
                      <div className="col-md-6">
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
                      <div className="col-md-6">
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
                      <div className="col-md-3">
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
                      <div className="col-md-3">
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
                      <div className="col-md-3">
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
                      <div className="col-md-3">
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
                        className="btn btn-danger btn-sm mt-2"
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
                    {editingId ? 'Update' : 'Add Record'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <div className={`modal fade ${deleteModal ? 'show' : ''}`} id="deleteRecordModal" tabIndex="-1" aria-hidden="true" style={{display: deleteModal ? 'block' : 'none'}}>
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
                  style={{width: "100px", height: "100px"}}
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
    </div>
  );
}

export default Nutrition;