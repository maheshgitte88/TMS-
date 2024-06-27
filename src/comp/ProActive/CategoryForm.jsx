import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CategoryForm = () => {
  const [categoryName, setCategoryName] = useState('');
  const [subCategoryName, setSubCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  useEffect(() => {
    axios.get('http://13.235.240.117:2000/api/categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [categoryName]);

  const handleSubCSubmit = (e) => {
    e.preventDefault();
    axios.post('http://13.235.240.117:2000/api/subcategories', {
      SubCategoryName: subCategoryName,
      CategoryId: selectedCategoryId
    })
      .then(response => {
        console.log(response.data);
        setSubCategoryName('');
        setSelectedCategoryId('');
      })
      .catch(error => {
        console.error(error);
      });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://13.235.240.117:2000/api/categories', { CategoryName: categoryName })
      .then(response => {
        console.log(response.data);
        setCategoryName('');
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <div className="mb-4">
        <label className="block text-gray-700">Category Name</label>
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Add Category</button>
    </form>

    <form onSubmit={handleSubCSubmit} className="max-w-md mx-auto mt-8">
      <div className="mb-4">
        <label className="block text-gray-700">SubCategory Name</label>
        <input
          type="text"
          value={subCategoryName}
          onChange={(e) => setSubCategoryName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Select Category</label>
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          <option value="">Select Category</option>
          {categories.map(category => (
            <option key={category.CategoryID} value={category.CategoryID}>
              {category.CategoryName}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Add SubCategory</button>
    </form>
    </>
  
  );
};

export default CategoryForm;
