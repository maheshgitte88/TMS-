import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function StudentPro() {
  const [searchValues, setSearchValues] = useState({
    registration_number: "",
  });
  const [loading, setLoading] = useState("");
  const [marksData, setMarksData] = useState([]);

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (
        searchValues.registration_number.length >= 2 &&
        searchValues.registration_number.length <= 14
      ) {
        try {
          const resData = await axios.get(
            "http://65.1.54.123:7000/api/marks/student-marks",
            {
              params: searchValues,
            }
          );
          if (resData) {
            setData(resData.data);
            setMarksData(resData.data.flattenedData);
            toast.success(`Student Data successfully..!`, {
              autoClose: 1100,
            });
          }
        } catch (error) {
          setMarksData("");
        }
      } else {
        setMarksData("");
      }
    };
    fetchData();
    if (searchValues.registration_number.length > 0) {
      setLoading(
        `Enter Correct registration_number Student Not present with ${searchValues.registration_number} `
      );
    } else {
      setLoading(``);
    }
  }, [searchValues]);

  const handleSearchChange = (field, value) => {
    setSearchValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };
  console.log(data, 49)
  const { name, email, registration_number, contact_number } = data;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <h2 className="font-bold text-lg mb-2">Search Assignment Marks</h2>
        <input
          type="text"
          id="registration_number"
          placeholder="Registration Number"
          className="w-full p-2 border border-gray-300 rounded"
          value={searchValues.registration_number}
          onChange={(e) =>
            handleSearchChange("registration_number", e.target.value)
          }
        />
      </div>
      {marksData ? (
        <>
          <div className="mb-4">
            <div className="bg-white shadow-md rounded p-4">
              <div className="flex justify-between items-center mb-2">
                <strong>Name:</strong>
                <div>{name}</div>
              </div>
              <div className="flex justify-between items-center mb-2">
                <strong>Email:</strong>
                <div>{email}</div>
              </div>
              <div className="flex justify-between items-center mb-2">
                <strong>Registration Number:</strong>
                <div>{registration_number}</div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="bg-white shadow-md rounded p-4">
              <div className="flex justify-between items-center mb-2">
                <strong>Contact Number:</strong>
                <div>{contact_number}</div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">Subject</th>
                  <th className="px-4 py-2 border-b">Assig-1</th>
                  <th className="px-4 py-2 border-b">Atps</th>
                  <th className="px-4 py-2 border-b">Assig-2</th>
                  <th className="px-4 py-2 border-b">Atps</th>
                  <th className="px-4 py-2 border-b">Total</th>
                  <th className="px-4 py-2 border-b">Updated</th>
                </tr>
              </thead>
              <tbody>
                {data.flattenedData ? (
                  data.flattenedData.map((item, rowIndex) => {
                    let totalMk = 0;
                    return (
                      <tr key={`subject-${rowIndex}`}>
                        <td className="px-4 py-2 border-b">
                          {item.subject_name}
                        </td>
                        {item.assignments.map((assignment, index) => {
                          totalMk +=
                            Number(assignment.mk) !== null
                              ? Number(assignment.mk)
                              : 0;
                          return (
                            <React.Fragment key={index}>
                              <td className="px-4 py-2 border-b">
                                {assignment.mk !== null ? assignment.mk : "N/A"}
                              </td>
                              <td className="px-4 py-2 border-b">
                                {assignment.atmpt}
                              </td>
                            </React.Fragment>
                          );
                        })}

                        <td className="px-4 py-2 border-b">{totalMk}</td>
                        <td className="px-4 py-2 border-b">
                          {new Date(item.updatedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td className="px-4 py-2 border-b" colSpan="7">
                      {`No data available for ${searchValues.registration_number}`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
        
        </>
      )}
    </div>
  );
}

export default StudentPro;
