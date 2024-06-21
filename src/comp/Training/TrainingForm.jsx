import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const TrainingForm = () => {
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const [trainings, setTrainings] = useState([]);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [sendFeedbacks, setSendFeedbacks] = useState(false);

  const [formData, setFormData] = useState({
    TrainingDate: "",
    Title: "",
    Description: "",
    TrainingLink: "",
    TrainerId: decoded.user_id,
    Trainer: decoded.user_Name,
    TrainerEmail: decoded.user_Email,
    Attendees: [],
  });
  const [attendees, setAttendees] = useState([]); // State for attendees

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleAttendeeChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevFormData) => {
      const newAttendees = checked
        ? [...prevFormData.Attendees, value]
        : prevFormData.Attendees.filter((attendee) => attendee !== value);
      return { ...prevFormData, Attendees: newAttendees };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("https://13.235.240.117:2000/api/trainings", formData)
      .then((response) => {
        console.log(response.data);
        toast.success("Training Feedback mails successfully..!");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    // Fetch employee emails from the API
    const fetchAttendees = async () => {
      try {
        const response = await axios.get(
          "https://13.235.240.117:2000/api/allEmployess"
        );
        const employees = response.data.Employees.map(
          (employee) => employee.user_Email
        );
        setAttendees(employees);
      } catch (error) {
        console.error("Error fetching attendees:", error);
      }
    };

    fetchAttendees();
    const fetchTrainings = async () => {
      try {
        const response = await axios.get(
          `https://13.235.240.117:2000/api/gettrainings/${decoded.user_id}`
        );
        setTrainings(response.data);
      } catch (error) {
        console.error("Error fetching trainings:", error);
      }
    };

    fetchTrainings();
  }, []);

  const handleRowClick = (training) => {
    setSelectedTraining(training);
  };

  console.log(trainings, 85);
  const formGenralShow = () => {
    setSendFeedbacks(!sendFeedbacks);
  };
  return (
    <>
      <div className="p-2">
        <button
          onClick={formGenralShow}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
        >
          {sendFeedbacks ? "Hide Form" : "Send Feedback"}
        </button>
        {sendFeedbacks && (
          <form onSubmit={handleSubmit} className="w-full mt-4 bg-white p-2">
            <div className="flex justify-between">
              {/* First Column */}
              <div className="w-1/2 pr-4">
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Training Date <span className="required-star">*</span>
                  </label>
                  <input
                    type="date"
                    name="TrainingDate"
                    value={formData.TrainingDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Title <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    name="Title"
                    value={formData.Title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Description <span className="required-star">*</span>
                  </label>
                  <textarea
                    name="Description"
                    value={formData.Description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Training Link</label>
                  <input
                    type="text"
                    name="TrainingLink"
                    value={formData.TrainingLink}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
              </div>

              {/* Second Column */}
              <div className="w-1/2 pl-4">
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Attendees <span className="required-star">*</span>
                  </label>
                  <textarea
                    // name="Description"
                    value={formData.Attendees}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    // required
                  />
                  <div className="w-full px-3 py-2 border border-gray-300 rounded h-50 overflow-y-scroll">
                    {attendees.map((attendee, index) => (
                      <div key={index}>
                        <input
                          type="checkbox"
                          id={`attendee-${index}`}
                          value={attendee}
                          onChange={handleAttendeeChange}
                        />
                        <label htmlFor={`attendee-${index}`} className="ml-2">
                          {attendee}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
            >
              Send Feedback
            </button>
          </form>
        )}

        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Trainings</h1>
          <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Training Date</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Trainer</th>
              </tr>
            </thead>
            <tbody>
              {trainings.map((training) => (
                <tr
                  key={training.TrainingId}
                  onClick={() => handleRowClick(training)}
                  className="cursor-pointer hover:bg-gray-100 transition duration-150"
                >
                  <td className="border px-4 py-2">
                    {new Date(training.TrainingDate).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">{training.Title}</td>
                  <td className="border px-4 py-2">{training.Trainer}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedTraining && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">
                Feedbacks for {selectedTraining.Title}
              </h2>
              <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2">Employee Name</th>
                    <th className="px-4 py-2">Employee Email</th>
                    <th className="px-4 py-2">Feedback</th>
                    <th className="px-4 py-2">Review Description</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTraining.TrainingFeedbacks.map((feedback) => (
                    <tr
                      key={feedback.FeedbackId}
                      className="hover:bg-gray-100 transition duration-150"
                    >
                      <td className="border px-4 py-2">
                        {feedback.EmployeeName}
                      </td>
                      <td className="border px-4 py-2">
                        {feedback.EmployeeEmail}
                      </td>
                      <td className="border px-4 py-2">{feedback.Feedback}</td>
                      <td className="border px-4 py-2">
                        {feedback.ReviewDescription}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TrainingForm;
