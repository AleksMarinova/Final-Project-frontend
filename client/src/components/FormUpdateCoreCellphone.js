import { React, useState } from "react";

const FormUpdateCoreCellphone = ({ cellphone, callback }) => {
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const [updatedCoreCellphone, setUpdatedCoreCellphone] = useState({
    cellphoneID: cellphone.cellphoneID,
    name: cellphone.name,
    imei: cellphone.imei,
    type: cellphone.type,
    comments: cellphone.comments,
  });

  const [userAuth] = useState(() => {
    const localRef = localStorage.getItem("data");
    const data = JSON.parse(localRef);
    return data || "";
  });

  const {
    _id,
    cellphoneID,
    name,
    imei,
    type,
    comments,
  } = cellphone;

  const handleComputerChange = (e) => {
    const { value } = e.target;
    setUpdatedCoreCellphone({
      ...updatedCoreCellphone,
      [e.target.name]: value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const cellphone = updatedCoreCellphone;
    // console.log(newDevComputer);
    const bearer = "Bearer " + userAuth.returnedData.accessToken;
    const response = await fetch(`http://localhost:3001/coreCellphones/:id`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: bearer,
      },
      body: JSON.stringify({ cellphone }),
    });
    const parsedResponse = await response.json();
    // console.log(parsedResponse);
    if (parsedResponse) {
      console.log("form response", parsedResponse);
      callback(parsedResponse);
      setShowUpdateForm(!showUpdateForm);
    }
  };

  const handleDelete = async () => {
    const confirmBox = window.confirm(
      "Do you really want to delete this device?"
    )
    if (confirmBox === true) {
      const bearer = "Bearer " + userAuth.returnedData.accessToken;
      const response = await fetch(
        `http://localhost:3001/coreCellphones/${cellphone.cellphoneID}`,
        {
          method: "DELETE",
          headers: {
            Authorization: bearer,
          },
        }
      );
      // console.log(response);
      if (response.status === 200) {
        callback("");
      }
    }
  };

  const renderTable = () => {
    return (
      <tr key={_id}>
        <td>{cellphoneID}</td>
        <td>{name}</td>
        <td>{imei}</td>
        <td>{type}</td>
        <td>{comments ? comments : "-"}</td>
        <td>
          <button onClick={renderUpdateForm}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </td>
      </tr>
    );
  };

  const renderForm = () => {
    return (
      <tr key={_id}>
        <td>{cellphoneID}</td>
        <td>
          <input
            type="text"
            name="name"
            defaultValue={name}
            placeholder="Name"
            onChange={(e) => handleComputerChange(e)}
          />
        </td>
        <td>
          <input
            type="text"
            name="imei"
            defaultValue={imei}
            placeholder="imei"
            onChange={(e) => handleComputerChange(e)}
          />
        </td>
        <td>
          <input
            type="text"
            name="type"
            defaultValue={type}
            placeholder="Type"
            onChange={(e) => handleComputerChange(e)}
          />
        </td>
        <td>
          <input
            type="text"
            name="comments"
            defaultValue={comments}
            placeholder="Comments"
            onChange={(e) => handleComputerChange(e)}
          />
        </td>
        <td>
          <button onClick={handleUpdate}>Update</button>
          <button onClick={renderUpdateForm}>Cancel</button>
        </td>
      </tr>
    );
  };

  const renderUpdateForm = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowUpdateForm(!showUpdateForm);
  };

  return <>{showUpdateForm ? renderForm() : renderTable()}</>;
};

export default FormUpdateCoreCellphone;
