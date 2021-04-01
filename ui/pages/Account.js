import React, { useState, useEffect, useContext } from "react";
import { authHeader, checkAuth, logout } from "../../helpers/auth";
import AuthContext from "../../helpers/auth-context";
import { useHistory } from "react-router-dom";

/*
This component will use Grid
*/

export default function Account() {
  //const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState("");
  const [sessions, setSessions] = useState([]);
  const { authenticated, setAuthenticated } = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    let x = checkAuth();
    if (!x) {
      return history.push("/login");
    }

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: authHeader(),
      },
    };
    getInfo();
    getData();
  }, []);

  const getInfo = async () => {
    let data = JSON.parse(localStorage.getItem("currentUser"));
    setUser(data.username);
  };

  const getData = async () => {
    await fetch("/getAllSessions", {
      method: "GET",
      headers: { Authorization: authHeader() },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.result);
        setSessions(data.result);
      });
  };

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    history.push("/login");
  };

  return (
    <div>
      <div className="container mx-auto flex flex-col justify-center text-center">
        {authenticated && <h1 className="text-xl"> Welcome {user}! </h1>}
      </div>
      <div className="flex align-center justify-center">
        <button className="border text-4xl" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="flex flex-col text-center justify-center align-center mt-10">
        <h2>This content will only show if authenticated: </h2>
        {sessions.map((x) => (
          <li className="justify-center align-center text-xl list-none ">
            {x.goal} - {x.totalTime}
          </li>
        ))}
      </div>
    </div>
  );
}
