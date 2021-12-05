import { React, useState } from "react";
import '../css/formUpdateDevComputer.css';

const FormUpdateDevComputer = ({ callback, currentComputer }) => {
  const [user, setUser] = useState("");

  const [updatedComputer, setUpdatedComputer] = useState({
    computerID: currentComputer.computerID,
    serialNO: currentComputer.serialNO,
    informationLink: currentComputer.informationLink,
    status: "Ready to be handed out",
    handoutDate: currentComputer.handoutDate,
  });

  const [userAuth] = useState(() => {
    const localRef = localStorage.getItem("data");
    const data = JSON.parse(localRef);
    return data || "";
  });

  const handleComputerChange = (e) => {
    const { value } = e.target;
    setUpdatedComputer({
      ...updatedComputer,
      [e.target.name]: value,
    });
  };

  const handleUserChange = (e) => {
    setUser(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const computer = updatedComputer;
    const users = user;
    // console.log(newDevComputer);
    const bearer = "Bearer " + userAuth.returnedData.accessToken;
    const response = await fetch(`http://localhost:3001/dashboard/:id`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: bearer,
      },
      body: JSON.stringify({ computer, users }),
    });
    const parsedResponse = await response.json();
    // console.log(parsedResponse);
    if (parsedResponse) {
      console.log('form response', parsedResponse);
      callback(parsedResponse);
    }
  };

  return (
    <div className="updateFormContainer">
      <form onSubmit={(e) => handleSubmit(e)}>
        <h2>{currentComputer.computerID} (editing) </h2>
        {/* add divs around each label and input tags */}
        <div>
          <label> Serial Number </label>
          <input
            type="text"
            name="serialNO"
            defaultValue={currentComputer.serialNO || updatedComputer.serialNO}
            placeholder="Serial NO"
            onChange={(e) => handleComputerChange(e)}
            required
          ></input>
        </div>
        <div>
          <label> Information Link </label>
          <input
            type="text"
            name="informationLink"
            defaultValue={
              currentComputer.informationLink || updatedComputer.informationLink
            }
            placeholder="Information Link"
            onChange={(e) => handleComputerChange(e)}
            required
          ></input>
        </div>
        <div>
          <label> Status </label>
          <select
            name="status"
            defaultValue={currentComputer.status || updatedComputer.status}
            onChange={(e) => handleComputerChange(e)}
          >
            <option value="Handed out"> Handed out </option>
            <option value="Returned"> Returned </option>
            <option value="Broken"> Broken </option>
            <option value="Being Repaired"> Being Repaired </option>
            <option value="Stolen or Lost"> Stolen or Lost </option>
            <option value="Ready to be handed out"> Ready to be handed out </option>
            <option value="Unknown"> Unknown </option>
          </select>
        </div>
        <div>
          <label> Users </label>
          <input
            type="text"
            name="users"
            defaultValue={currentComputer.users[0] || user}
            placeholder="User"
            onChange={(e) => handleUserChange(e)}
          ></input>
        </div>
        <div>
          <label> Handed Out </label>
          <input
            type="date"
            name="handoutDate"
            defaultValue={
              (currentComputer.handoutDate !== undefined && currentComputer.handoutDate !== null ? currentComputer.handoutDate.split('T')[0] : "") || updatedComputer.handoutDate
            }
            placeholder="Handout Date"
            onChange={(e) => handleComputerChange(e)}
          ></input>
        </div>
        <div>
          <input className="update-button" type="submit" value="Update" />
        </div>
      </form>
    </div>
  );
};

export default FormUpdateDevComputer;
