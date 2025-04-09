import { useEffect, useState } from 'react';

const FeedbackTable = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/feedback');
        const data = await res.json();
        setFeedbacks(data);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">User Feedback</h2>
      <table className="w-full border text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">First Name</th>
            <th className="p-2">Last Name</th>
            <th className="p-2">Quality</th>
            <th className="p-2">Suggestion</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((fb, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{fb.firstName}</td>
              <td className="p-2">{fb.lastName}</td>
              <td className="p-2">{fb.quality}</td>
              <td className="p-2">{fb.suggestion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeedbackTable;
