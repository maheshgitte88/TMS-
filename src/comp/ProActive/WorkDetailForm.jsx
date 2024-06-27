import React, { useState, useEffect } from "react";
import axios from "axios";
import CategoryForm from "./CategoryForm";
import SubCategoryForm from "./SubCategoryForm";
import { toast } from "react-toastify";
import LoadingSpinner from "../LoadingSpinner";

const WorkDetailForm = () => {
  const [formData, setFormData] = useState({
    SelectLocation: "",
    SelectSource: "",
    FromName: "",
    SelectDepartment: "",
    Query: "",
    Action: "",
    ReceivedTime: "",
    SolvedTime: "",
    TAT: "",
    Status: "",
    SelectStatus: "",
    TicketType: "Issue",
    CategoryId: "",
    SubCategoryId: "",
  });
  const [loading, setLoading] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [showForms, setShowForms] = useState(false);

  useEffect(() => {
    axios
      .get("http://13.235.240.117:2000/api/departments")
      .then((response) => setDepartments(response.data))
      .catch((error) => console.error(error));

    axios
      .get("http://13.235.240.117:2000/api/categories")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (formData.CategoryId) {
      axios
        .get(`http://13.235.240.117:2000/api/subcategories/${formData.CategoryId}`)
        .then((response) => setSubCategories(response.data))
        .catch((error) => console.error(error));
    }
  }, [formData.CategoryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      axios
        .post("http://13.235.240.117:2000/api/workdetails", formData)
        .then((response) => {
          console.log(response.data);
          toast.success("Pro-Active Work Add successfully..!");
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <button
        onClick={() => setShowForms(!showForms)}
        className="px-4 py-2 bg-blue-500 text-white rounded mb-4"
      >
        {showForms ? "Hide" : "Add"} Category and SubCategory For Pro-active
      </button>

      <div className="flex flex-grow bg-white mb-2">
        <div className="p-4 overflow-auto">{showForms && <CategoryForm />}</div>
        <div className="flex flex-grow">
          <form onSubmit={handleSubmit} className="w-full flex">
            <div className="w-1/3 overflow-auto">
              <div className="mb-4">
                <label className="block text-gray-700">
                  Select Location <span className="required-star">*</span>
                </label>
                <select
                  name="SelectLocation"
                  value={formData.SelectLocation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">Select Location</option>
                  <option value="Alandi">Alandi</option>
                  <option value="Banner">Banner</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Select Source <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  name="SelectSource"
                  value={formData.SelectSource}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Select Category <span className="required-star">*</span>
                </label>
                <select
                  name="CategoryId"
                  value={formData.CategoryId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option
                      key={category.CategoryID}
                      value={category.CategoryID}
                    >
                      {category.CategoryName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Select SubCategory <span className="required-star">*</span>
                </label>
                <select
                  name="SubCategoryId"
                  value={formData.SubCategoryId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">Select SubCategory</option>
                  {subCategories.map((subCategory) => (
                    <option
                      key={subCategory.SubCategoryID}
                      value={subCategory.SubCategoryID}
                    >
                      {subCategory.SubCategoryName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  From Name <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  name="FromName"
                  value={formData.FromName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Select Department <span className="required-star">*</span>
                </label>
                <select
                  name="SelectDepartment"
                  value={formData.SelectDepartment}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="w-1/3 ps-2 overflow-auto">
              <div className="mb-4">
                <label className="block text-gray-700">
                  Query <span className="required-star">*</span>
                </label>
                <textarea
                  name="Query"
                  value={formData.Query}
                  onChange={handleChange}
                  className="w-full px-3 py-5 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Action <span className="required-star">*</span>
                </label>
                <textarea
                  name="Action"
                  value={formData.Action}
                  onChange={handleChange}
                  className="w-full px-3 py-5 border border-gray-300 rounded"
                  required
                />
              </div>
            </div>

            <div className="w-1/3 px-2 overflow-auto">
              <div className="mb-4">
                <label className="block text-gray-700">
                  Received Time <span className="required-star">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="ReceivedTime"
                  value={formData.ReceivedTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Solved Time <span className="required-star">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="SolvedTime"
                  value={formData.SolvedTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  TAT <span className="required-star">*</span>
                </label>
                <input
                  type="number"
                  name="TAT"
                  value={formData.TAT}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Status <span className="required-star">*</span>
                </label>
                <select
                  name="Status"
                  value={formData.Status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Choose Ticket Type <span className="required-star">*</span>
                </label>
                <select
                  name="TicketType"
                  value={formData.TicketType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                >
                  <option value="Issue">Issue</option>
                  <option value="Transaction">Transaction</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                {loading ? <LoadingSpinner /> : "Submit Work Detail"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WorkDetailForm;
