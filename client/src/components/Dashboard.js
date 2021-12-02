/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */

import "../css/dashboard.css";

import { React, useEffect, useState } from "react";
import Logout from "./Logout";
import { Link } from "react-router-dom";
import FormDevComputer from "./FormCreateDevComputer";

const Dashboard = () => {
  const [laptops, setLaptops] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filteredData, setFilteredData] = useState(laptops);

  const [userAuth] = useState(() => {
    const localRef = localStorage.getItem("data");
    const data = JSON.parse(localRef);
    return data || "";
  });

  const [newComputer, setNewComputer] = useState();

  const parentCallback = (formInput) => setNewComputer(formInput);

  const handleSearch = (e) => {
    const filteredComputers = laptops.filter(laptop => { 
      return(
        laptop.computerID.toLowerCase().includes(e.target.value.toLowerCase())
      )
    })
    setFilteredData(filteredComputers);
  };

  const allLaptops = async () => {
    const bearer = "Bearer " + userAuth.returnedData.accessToken;
    // console.log(bearer)
    const response = await fetch("http://localhost:3001/dashboard", {
      method: "GET",
      headers: {
        Authorization: bearer,
      },
    });
    const parsedResponse = await response.json();
    //console.log(parsedResponse)
    setLaptops(parsedResponse);
    setFilteredData(parsedResponse);
  };

  useEffect(() => {
    allLaptops();
  }, [newComputer]);

  const renderForm = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setShowForm(!showForm);
  };

  const renderTableHeaders = () => {
    return (
      <tr>
        <th> Computer ID </th>
        <th> Serial NO </th>
        <th> Information Link </th>
        <th> User </th>
        <th> Handout Date </th>
        <th> Status </th>
        <th> Licence Link </th>
      </tr>
    );
  };

  const renderTableData = () => {
    return filteredData.map((computer) => {
      const {
        _id,
        computerID,
        serialNO,
        informationLink,
        users,
        handoutDate,
        status,
        licenseLink,
      } = computer;
      return (
        <tr key={_id}>
          <td>
            <Link to={`/dashboard/${computerID}`}> {computerID} </Link>
          </td>
          <td>{serialNO}</td>
          <td>{informationLink}</td>
          <td>{users[0]}</td>
          <td>{handoutDate ? handoutDate.split("T")[0] : "Not handed out"}</td>
          <td>{status}</td>
          <td>
            <a href={`${licenseLink}`} target="blank">
              Link
            </a>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="dashboard__container">
        <div className="dashboard__title"> 
        <div className="dashboard__user"> 
          <small> Signed in as {userAuth.returnedData.user.name}</small> 
          <div> <img src={userAuth.returnedData.user.imageUrl} alt="profile" className="profile-img" /> </div>
        </div>
          <h1> Dashboard </h1> 
          <h2> Welcome, {userAuth.returnedData.user.givenName}!</h2>
        </div> 
        <div className="dashboard__controls">
          <div> 
            <label> Filter: </label>
            <input type="text" onChange={(e) => handleSearch(e)} /> 
          </div>
          <div> <button onClick={renderForm}> Add new </button> </div>
        </div>
        {showForm && <FormDevComputer callback={parentCallback} />}
      <div className="dashboard__table">
        <table className="styled-table">
          <thead>
            {renderTableHeaders()}
          </thead>
          <tbody>
            {renderTableData()}
          </tbody>
        </table>
      </div>
      <Logout />
    </div>
  );
};

export default Dashboard;
