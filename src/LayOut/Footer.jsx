// Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white text-black py-3">
    <div className="container mx-auto px-2">
      <div className="flex flex-wrap justify-between">
        {/* <div className="w-full sm:w-auto mb-4 sm:mb-0">
          <h2 className="text-xl font-bold">Company Name</h2>
        </div>
        <div className="w-full sm:w-auto mb-4 sm:mb-0">
          <ul className="list-none">
            <li><a href="#" className="hover:text-gray-700">About Us</a></li>
            <li><a href="#" className="hover:text-gray-700">Contact</a></li>
            <li><a href="#" className="hover:text-gray-700">Privacy Policy</a></li>
          </ul>
        </div>
        <div className="w-full sm:w-auto mb-4 sm:mb-0">
          <ul className="list-none">
            <li><a href="#" className="hover:text-gray-700">Facebook</a></li>
            <li><a href="#" className="hover:text-gray-700">Twitter</a></li>
            <li><a href="#" className="hover:text-gray-700">Instagram</a></li>
          </ul>
        </div> */}
      </div>
      <div className="text-center mt-6">
        <p className="text-sm">&copy; 2024 MITSDE. All rights reserved.</p>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
