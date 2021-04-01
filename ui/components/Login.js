import React, { useState, useEffect, useContext } from "react";
import { login } from "../../helpers/auth";
import { useHistory } from "react-router-dom";
import AuthContext from "../../helpers/auth-context";

export default function Login() {
  const [username, setUsername] = useState(" ");
  const [password, setPassword] = useState(" ");
  const [error, setError] = useState("");
  const history = useHistory();
  const { authenticated, setAuthenticated } = useContext(AuthContext);

  const handleUsername = (event) => {
    setUsername(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = () => {
    // Post Request to API
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    };

    fetch("/auth/login", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.access_token) {
          localStorage.setItem("currentUser", JSON.stringify(data));
          setAuthenticated(true);
          history.push("/account");
        } else {
          return setError("Invalid Credentials");
        }
      });
  };

  return (
    <div>
      <div className="flex h-screen">
        {error && <div>{error}</div>}
        <div className="box-border h-100 w-100 p-4 border-4 m-auto">
          <div className="mb-5">
            <div>Username: </div>
            <input onChange={handleUsername} className="border p-1"></input>
          </div>
          <div className="mb-5">
            <div>Password: </div>
            <input
              onChange={handlePassword}
              type="password"
              className="border p-1"
            ></input>
          </div>
          <div className="text-center">
            <button onClick={handleSubmit} className="border p-1 w-20">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
