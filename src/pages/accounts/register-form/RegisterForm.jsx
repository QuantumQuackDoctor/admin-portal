import {
  FaCalendar,
  FaEnvelope,
  FaIdCard,
  FaLock,
  FaPhone,
} from "react-icons/fa";
import {
  FormBuilder,
  Validators,
} from "../../../shared/form-widget/FormWidget";
import { register } from "../../../services/AuthService";
import { useState } from "react";

const RegisterForm = ({ authenticated }) => {
  let builder = new FormBuilder("Register");
  const [errorMessage, setErrorMessage] = useState("");
  builder
    .addErrorMessageState(errorMessage)

    .addField("Email", "email")
    .addValidator(Validators.Email)
    .setPlaceholder("email")
    .setErrorMessage("*email required")
    .setIcon(<FaEnvelope />)
    .and()

    .addField("Password", "password")
    .addValidator(Validators.Min(8))
    .setPlaceholder("password")
    .setIcon(<FaLock />)
    .setErrorMessage("*password not long enough")
    .setInputType("password")
    .and()

    .addField("Birth date", "DOB")
    .addValidator(Validators.Required)
    .setErrorMessage("*required")
    .setIcon(<FaCalendar />)
    .setInputType("date")
    .and()

    .addField("First name", "firstName")
    .addValidator(Validators.Required)
    .setPlaceholder("first name")
    .setIcon(<FaIdCard />)
    .setErrorMessage("*required")
    .and()

    .addField("Last name", "lastName")
    .setPlaceholder("last name")
    .setIcon(<FaIdCard />)
    .and()

    .addField("Phone", "phone")
    .setPlaceholder("###-###-####")
    .setIcon(<FaPhone />)
    .and()

    .addField("Are you a veteran?", "veteranStatus")
    .setInputType("checkbox")
    .and()

    .addField("recieve email notifications?", "emailNotifications")
    .setInputType("checkbox")
    .and()

    .addField("recieve text notifications?", "textNotifications")
    .setInputType("checkbox")
    .setInitialValue("true")
    .and();

  const [registrationFinished, setRegistrationFinished] = useState(false);
  var canSubmit = true;

  const submitFunction = (userFields) => {
    if (canSubmit) {
      canSubmit = false;
      let userData = changeFormDataToUser(userFields);
      register(userData).then(
        (res) => {
          setRegistrationFinished(true);
        },
        (err) => {
          canSubmit = true;
          switch (err.response.status) {
            case 400:
              setErrorMessage("*missing field");
              break;
            case 403:
              setErrorMessage("*email not valid for admin");
              break;
            case 409:
              setErrorMessage("*email taken");
              break;
            default:
              setErrorMessage("Registration failed");
          }
        }
      );
    }
  };

  const changeFormDataToUser = (obj) => {
    return {
      email: obj.email,
      password: obj.password,
      firstName: obj.firstName,
      lastName: obj.lastName,
      phone: obj.phone,
      DOB: obj.DOB,
      veteranStatus: obj.veteranStatus,
      settings: {
        notifications: {
          email: obj.emailNotifications,
          text: obj.textNotifications,
        },
        theme: "dark",
      },
    };
  };

  return (
    <>
      {authenticated || registrationFinished
        ? ""
        : builder.build(submitFunction)}
    </>
  );
};

export default RegisterForm;
