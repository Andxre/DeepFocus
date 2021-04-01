import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { checkAuth, logout } from "../../helpers/auth";
import AuthContext from "../../helpers/auth-context";
import { useHistory } from "react-router-dom";

export default function Navbar() {
  const { authenticated, setAuthenticated } = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    if (checkAuth()) {
      setAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    history.push("/login");
  };

  return (
    <nav className="bg-gray-800">
      <div className="container mx-auto h-15">
        <div className="flex space-x-2 justify-between">
          <div className="text-center font-mono text-white rounded-md px-2 py-2">
            DeepFocus
          </div>
          <ul className="flex space-x-4 justify-end">
            <li className="text-gray-300 hover:text-blue-300 hover:text-white px-3 py-2 rounded-md text-md font-mono">
              <NavLink exact to="/">
                Home
              </NavLink>
            </li>
            {authenticated
              ? [
                  <li className="text-gray-300 hover:text-blue-300 hover:text-white px-3 py-2 rounded-md text-md font-mono">
                    <NavLink exact to="/account">
                      Account
                    </NavLink>
                  </li>,
                ]
              : [
                  <li className="text-gray-300 hover:text-blue-300 hover:text-white px-3 py-2 rounded-md text-md font-mono">
                    <NavLink exact to="/login">
                      Login
                    </NavLink>
                  </li>,
                  <li className="text-gray-300 hover:text-blue-300 hover:text-white px-3 py-2 rounded-md text-md font-mono">
                    <NavLink exact to="/register">
                      Register
                    </NavLink>
                  </li>,
                ]}
          </ul>
        </div>
      </div>
    </nav>
  );
}
