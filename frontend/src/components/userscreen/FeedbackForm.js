import React, { useState } from 'react';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    quality: '',
    suggestion: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:4000/api/addfeedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage('Feedback submitted successfully!');
        setFormData({
          firstName: '',
          lastName: '',
          quality: '',
          suggestion: '',
        });
      } else {
        setMessage('Error submitting feedback');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white shadow-xl rounded-lg border border-gray-200">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">We Value Your Feedback</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div>
          <label className="block text-lg font-medium text-gray-700">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-3">
            How would you rate the quality of our services?
          </label>
          <div className="space-y-3">
            {['Excellent', 'Very Good', 'Good', 'Average', 'Poor'].map((option) => (
              <label key={option} className="block text-gray-700">
                <input
                  type="radio"
                  name="quality"
                  value={option}
                  checked={formData.quality === option}
                  onChange={handleChange}
                  className="mr-2 text-blue-500"
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">Suggestions</label>
          <textarea
            name="suggestion"
            value={formData.suggestion}
            onChange={handleChange}
            rows="4"
            placeholder="Do you have any suggestions?"
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit Feedback
        </button>

        {message && <p className="mt-4 text-center text-lg text-green-600">{message}</p>}
      </form>
    </div>
  );
};

export default FeedbackForm;
