import React, { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import UserHeader from './header';

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

    if (!formData.firstName || !formData.lastName || !formData.quality) {
      setMessage('Please fill in all required fields.');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/api/addfeedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('auth-token')
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
    <>
      <UserHeader />
      <div className="main-content">
        <div className="page-content">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-md-10 col-lg-8">
                <div className="card my-5 shadow-sm">
                  <div className="card-body">
                    <h4 className="card-title text-center mb-4">Feedback Form</h4>

                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="firstName" className="form-label">
                            First Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="lastName" className="form-label">
                            Last Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="quality" className="form-label">
                          Rating
                        </label>
                        <select
                          className="form-select"
                          id="quality"
                          name="quality"
                          value={formData.quality}
                          onChange={handleChange}
                          required
                        >
                          <option value="" disabled>
                            Choose a rating
                          </option>
                          <option value="5">5 - Excellent</option>
                          <option value="4">4 - Very Good</option>
                          <option value="3">3 - Good</option>
                          <option value="2">2 - Fair</option>
                          <option value="1">1 - Poor</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="suggestion" className="form-label">
                          Message
                        </label>
                        <textarea
                          className="form-control"
                          id="suggestion"
                          name="suggestion"
                          rows="4"
                          placeholder="Your feedback..."
                          value={formData.suggestion}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="text-center">
                        <button type="submit" className="btn btn-primary px-4">
                          <ThumbsUp className="me-2" size={18} />
                          Submit Feedback
                        </button>
                      </div>

                      {message && (
                        <div
                          className={`alert mt-4 text-center ${
                            message.includes('successfully')
                              ? 'alert-success'
                              : 'alert-danger'
                          }`}
                        >
                          {message}
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedbackForm;
