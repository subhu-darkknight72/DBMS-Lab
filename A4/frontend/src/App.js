import "./App.css";
import { useState, useEffect } from "react";
import DoctorDash from "./components/doctor_dash";
import FrontOperatorDash from "./frontend-desk-operator/dash"
import DatabaseAdmin from "./database_administrator/dash";
import DataEntryDash from "./data_entry_operator/dash";

const url = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [username, setUsername] = useState("");
  const [designation, setDesignation] = useState("");

  useEffect(() => {
    fetch(url.concat("api/getinfo/"), {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setUsername(data.user);
        setDesignation(data.job);
      });
  }, []);

  if (username == "-1") {
    window.location.replace(url.concat("login/"));
  } else if (designation == "doctor") {
    return <DoctorDash doctor_username={username} />;
  } else if (designation == "front_desk_operator") {
    return <FrontOperatorDash fod={username}></FrontOperatorDash>
  } else if (designation == "database_admin") {
    return <DatabaseAdmin admin={username} />;
  } else {
    return <DataEntryDash de_user={username}/>;
  }
}

export default App;
