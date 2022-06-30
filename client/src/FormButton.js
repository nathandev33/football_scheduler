import React from "react";
// import {useNavigate, useLocation} from "react-router"
import styles from "./FormButton.module.css";

const FormButton = (props) => {
  // const navigate = useNavigate()
  // const location = useLocation()
  return (
    <button type="submit" className={styles.formButton}>
      Přihlásit se
    </button>
  );
};

export default FormButton;
