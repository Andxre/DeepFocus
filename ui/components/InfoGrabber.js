import React, { useState, useContext } from "react";
import { Slider } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import useSound from "use-sound";
import clickSound from "../../sounds/startSound.mp3";
import AuthContext from "../../helpers/auth-context";
import { authHeader } from "../../helpers/auth";

export default function InfoGrabber() {
  const styles = {
    container:
      "container-fluid min-h-screen w-screen flex flex-col justify-center align-center dark:bg-gray-800",
    setGoal: "goal",
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [time, setTime] = useState(5);
  const [goal, setGoal] = useState("");
  const { authenticated } = useContext(AuthContext);
  const history = useHistory();

  // Submit's isLoggedIn, Goal and Time to Backend, Backend will history.push("/timer")
  async function submit() {
    const data = {
      goal: goal,
      time: time,
      session_id: null,
    };
    if (data.goal) {
      if (authenticated) {
        // API CALL to Start Timer
        await fetch("/startTimer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader(),
          },
          body: JSON.stringify(data),
        })
          .then((res) => res.json())
          .then((res) => {
            data.session_id = res.session_id;
          });
      }
      history.push({
        pathname: "/timer",
        state: data,
      });
    }
  }
  const handleChange = (event) => [setGoal(event.target.value)];

  const [play] = useSound(clickSound);

  return (
    <div className={styles.container}>
      <div className="flex flex-col p-5">
        <div className="flex flex-col align-center justify-center">
          <div className="align-center justify-center display-block margin-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="200"
              height="200"
              className="m-auto display-block"
            >
              <path fill="none" d="M0 0H24V24H0z" />
              <path d="M13 2v1.278l5 1.668 3.632-1.21.633 1.896-3.032 1.011 3.096 8.512C21.237 16.292 19.7 17 18 17c-1.701 0-3.237-.708-4.329-1.845l3.094-8.512L13 5.387V19H17v2H7v-2h4V5.387L7.232 6.643l3.096 8.512C9.237 16.292 7.7 17 6 17c-1.701 0-3.237-.708-4.329-1.845l3.094-8.512-3.03-1.01.633-1.898L6 4.945l5-1.667V2h2zm5 7.103L16.582 13h2.835L18 9.103zm-12 0L4.582 13h2.835L6 9.103z" />
            </svg>
          </div>
          <div className="font-sans text-center text-3xl dark:text-white">
            Set Goal:{" "}
          </div>
          <div className="flex flex-row py-10 justify-center">
            <input
              type="text"
              id="goal"
              className="border w-1/2 p-2 border-gray-800 dark:border-white"
              maxLength="90"
              value={goal}
              onChange={handleChange}
            ></input>
          </div>
        </div>
        <div className="mt-5 flex flex-row justify-center align-center">
          <div className="my-10 mr-2 text-center dark:text-white">
            Set Time (Minutes):
          </div>
          <div className="my-10 w-1/2">
            <Slider
              defaultValue={5}
              aria-labelledby="discrete-slider-small-steps"
              step={5}
              marks
              min={5}
              max={120}
              onChange={(event, value) => setTime(value)}
              valueLabelDisplay="on"
            />
          </div>
        </div>
        <div className="flex align-center justify-center">
          <button
            className="md:bg-red-300 md:hover:bg-red-500 w-1/6 text-white text-center font-bold py-2 px-4 rounded pointer"
            onClick={() => {
              play();
              submit();
            }}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
