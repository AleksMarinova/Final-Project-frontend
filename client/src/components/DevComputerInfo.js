import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormUpdateDevComputer from "./FormUpdateDevComputer";

const DevComputerInfo = ({ laptop, renderDevComputer }) => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  // const [updatedComputer, setUpdatedComputer] = useState();
  const [currentComputer] = useState(laptop[0]);

  const [userAuth] = useState(() => {
    const localRef = localStorage.getItem("data");
    const data = JSON.parse(localRef);
    return data || "";
  });

  const handleDelete = async () => {
    const bearer = "Bearer " + userAuth.returnedData.accessToken;
    const response = await fetch(
      `http://localhost:3001/dashboard/${laptop[0].computerID}`,
      {
        method: "DELETE",
        headers: {
          Authorization: bearer,
        },
      }
    );
    // console.log(response);
    if (response.status === 200) {
      navigate("/dashboard");
    }
  };

  const handleEdit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setShowForm(!showForm);
  };

  const renderUpdate = (formInput) => { 
    // setUpdatedComputer(formInput);
    console.log('devComInfo', formInput);
    renderDevComputer(formInput);
  };

  return (
    <div className='devComputerCard'>
      <h2>{currentComputer.computerID}</h2>
      <p> Serial#: {currentComputer.serialNO}</p>
      <p> Current User: {currentComputer.users[0]}</p>
      <p> Current Status: {currentComputer.status}</p>
      <p><a className="devComputerCard__link" href={`${currentComputer.licenseLink}`} target="blank"> Link </a></p>
      <p> Days since Handout: {currentComputer.handoutDate}</p>
      <div className="devComputerCart">
      <button className="devComputerCard__delete-button" onClick={handleDelete}> Delete </button>
      <button className="devComputerCard__edit-button"onClick={handleEdit}> Edit </button>
      </div>
      {showForm && <FormUpdateDevComputer callback={renderUpdate} currentComputer={currentComputer}/>}
      <h3> User History </h3>
      <p>...</p>
      <h3> Device History </h3>
      <p>...</p>
    </div>
  );
};

export default DevComputerInfo;
