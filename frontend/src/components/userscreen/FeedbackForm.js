  import React, { useState } from 'react';
  import { Smile, ThumbsUp, MessageCircle, Star } from 'lucide-react';
  import UserHeader from './header';

  const FeedbackForm = () => {
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      quality: '',
      suggestion: '',
    });

    const [message, setMessage] = useState('');
    const [hoverRating, setHoverRating] = useState(null);

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
      <>
        <UserHeader />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl shadow-xl max-w-2xl w-full border border-gray-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Smile className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Share Your Feedback</h2>
              <p className="text-gray-500 mt-2">We'd love to hear about your experience</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">How would you rate your experience?</label>
                <div className="flex justify-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({...formData, quality: star.toString()})}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${(hoverRating || formData.quality) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2 text-blue-500" />
                  Your Suggestions
                </label>
                <textarea
                  name="suggestion"
                  value={formData.suggestion}
                  onChange={handleChange}
                  rows="4"
                  placeholder="What can we do better?"
                  className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <ThumbsUp className="w-5 h-5 mr-2" />
                Submit Feedback
              </button>

              {message && (
                <div className={`mt-4 p-3 rounded-lg text-center ${message.includes('successfully') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>
      </>
    );
  };

  export default FeedbackForm;