import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const FeedbackForm = () => {
  const { TrainingId } = useParams();
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);

  const [formData, setFormData] = useState({
    Like: false,
    EmployeeName: decoded.user_Name,
    EmployeeEmail: decoded.user_Email,
    Feedback: 0,
    ReviewDescription: "",
    TrainingId: Number(TrainingId),
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleStarClick = (rating) => {
    setFormData({ ...formData, Feedback: rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://13.235.240.117:2000/api/feedback",
        formData
      );
      console.log(response.data);
      toast.success("Feedback submitted successfully!");
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        toast.error("Feedback already submitted.");
      } else {
        toast.error("Error submitting feedback.");
      }
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 10; i++) {
      stars.push(
        <span
          key={i}
          className={`cursor-pointer text-3xl ${
            i <= formData.Feedback
              ? formData.Feedback < 7
                ? "text-red-500"
                : "text-green-500"
              : "text-gray-400"
          }`}
          onClick={() => handleStarClick(i)}
        >
          ★
        </span>
      );
    }
    return stars;
  };
  console.log(formData);
  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <div className="mb-4">
        <label className="block text-gray-700">Do you like the training?</label>
        <input
          type="checkbox"
          name="Like"
          checked={formData.Like}
          onChange={handleChange}
          className="mr-2 leading-tight"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Employee Name</label>
        <input
          type="text"
          name="EmployeName"
          value={decoded.user_Name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Employee Email</label>
        <input
          type="email"
          name="EmployeEmail"
          value={decoded.user_Email}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Feedback (1-10)</label>
        <div className="flex space-x-2">{renderStars()}</div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Reviews Description</label>
        <textarea
          name="ReviewDescription"
          value={formData.ReviewDescription}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Submit Feedback
      </button>
    </form>
  );
};

export default FeedbackForm;
