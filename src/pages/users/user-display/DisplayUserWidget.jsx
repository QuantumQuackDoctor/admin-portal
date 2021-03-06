import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  deleteUser,
  getUserById,
  updateUser,
} from "../../../services/UserService";
import {
  FormBuilder,
  Validators,
} from "../../../shared/form-widget/FormWidget";
import {
  FaCalendar,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaUser,
} from "react-icons/fa";

const DisplayUserWidget = ({ id, close }) => {
  const [user, setUser] = useState({
    email: "",
    firstName: "",
    lastName: "",
    DOB: "",
    phone: "",
    isVeteran: false,
  });
  const [ready, setReady] = useState(false);
  useEffect(() => {
    getUserById(id)
      .then((response) => {
        setUser(response.data);
        setReady(true);
      })
      .catch(() => {
        close();
      });
  }, [id, close]);

  const builder = new FormBuilder("Update User");

  const [errorMessage, setErrorMessage] = useState("");

  const formSubmit = async (data) => {
    const updatePassword = data.password !== "";

    try {
      await updateUser({ ...user, ...data }, updatePassword);
      setErrorMessage("");
      const response = await getUserById(id);
      setUser(response.data);
    } catch (err) {
      switch (err.response.status) {
        default:
          setErrorMessage("*Server Error");
      }
    }
  };

  const [deleteClicked, setDeleteClicked] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const handleDeleteClicked = () => {
    if (!deleteClicked && user.id) {
      setFadeOut(true);
      setTimeout(() => {
        setFadeOut(false);
        setDeleteClicked(true);
      }, 200);
    } else {
      deleteUser(user.id)
        .then(() => {
          close();
        })
        .catch((err) => {
          switch (err.response.status) {
            case 404:
              setErrorMessage("*User does not exist");
              setTimeout(() => close(), 1000);
              break;
            default:
              setErrorMessage("*Server error");
              break;
          }
        });
    }
  };

  builder
    .setChildComponent(
      <div>
        <button
          className="FormWidget-submit"
          style={{ width: "100%" }}
          onClick={() => close()}
        >
          Close
        </button>
        <button
          className="FormWidget-submit"
          style={{ width: "100%", backgroundColor: "red" }}
          onClick={handleDeleteClicked}
          data-testid="delete-button"
        >
          <span
            className={
              fadeOut ? "EditDriverWidget-fadeout" : "EditDriverWidget-fadein"
            }
          >
            {deleteClicked ? "Confirm Delete" : "Delete"}
          </span>
        </button>
      </div>
    )
    .addErrorMessageState(errorMessage)
    .setShowReset(true)
    .setSubmitText("Update")

    .addField("Email", "email")
    .setIcon(<FaEnvelope />)
    .addValidator(Validators.Email)
    .setErrorMessage("*Must be a valid email")
    .setInitialValue(user.email)
    .and()

    .addField("Password", "password")
    .setIcon(<FaLock />)
    .addValidator(Validators.OrNull(Validators.Password))
    .setErrorMessage(
      "*password must have 1 Uppercase, Number, and Special character"
    )
    .and()

    .addField("First name", "firstName")
    .setIcon(<FaUser />)
    .addValidator(Validators.Min(3))
    .setErrorMessage("*Must have a first name")
    .setInitialValue(user.firstName)
    .and()

    .addField("Last name", "lastName")
    .setIcon(<FaUser />)
    .setInitialValue(user.lastName)
    .and()

    .addField("Birth date", "DOB")
    .addValidator(Validators.Required)
    .addValidator(Validators.Age(18))
    .setErrorMessage("*must be over 18")
    .setInitialValue(user.DOB)
    .setIcon(<FaCalendar />)
    .setInputType("date")
    .and()

    .addField("Phone", "phone")
    .setIcon(<FaPhone />)
    .addValidator((val) => val === undefined || val === "" || val.length === 8)
    .and()

    .addField("Veteran", "isVeteran")
    .setInputType("checkbox")
    .setInitialValue(user.isVeteran);

  return <div>{ready ? builder.build(formSubmit) : <></>}</div>;
};

DisplayUserWidget.propTypes = {
  id: PropTypes.number,
  close: PropTypes.func,
};

export default DisplayUserWidget;
