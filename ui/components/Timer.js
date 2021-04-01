import React, { useState, useEffect, useRef, useContext } from "react";
import { useHistory } from "react-router";
import Countdown from "./Countdown";
import { useBeforeunload } from "react-beforeunload";
import useSound from "use-sound";
import startSound from "../../sounds/startSound.mp3";
import AuthContext from "../../helpers/auth-context";
import { authHeader } from "../../helpers/auth";

//import defeatSound from "../../sounds/defeatSound.mp3";

export default function Timer(props) {
  const [time, setTime] = useState(1);
  const [isRunning, setIsRunning] = useState(true);
  const [goal, setGoal] = useState("");
  const [sessionID, setSessionID] = useState(-1);
  const [victory] = useSound(startSound);
  const { authenticated } = useContext(AuthContext);

  let intervalID = useRef(null);
  let history = useHistory();

  useEffect(() => {
    if (authenticated) {
      setSessionID(props.location.state.session_id);
    }
    console.log(sessionID);
    setGoal(props.location.state.goal);
    setIsRunning(true);
    let x = props.location.state.time * 60;
    setTime(5);
    intervalID.current = setInterval(() => {
      if (isRunning) {
        setTime((time) => time - 1);
      }
    }, 1000);

    return () => {
      console.log("Leaving");
      console.log(isRunning, authenticated, time);
      if (isRunning && authenticated && time > 1) {
        giveUp();
      }
    };
  }, []);

  useBeforeunload(
    () => "You'll lose your time! Are you sure you want to leave?"
  );

  async function stop() {
    const data = {
      session_id: props.location.state.session_id,
    };
    if (authenticated && isRunning) {
      await fetch("/endTimer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader(),
        },
        body: JSON.stringify(data),
      });
    }

    setIsRunning(false);
    clearInterval(intervalID.current);
  }

  async function giveUp() {
    victory();
    setIsRunning(false);
    clearInterval(intervalID.current);

    if (authenticated) {
      const data = {
        session_id: props.location.state.session_id,
      };
      await fetch("/endTimer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader(),
        },
        body: JSON.stringify(data),
      });
    }

    history.push("/");
  }

  return (
    <div className="md:container mx-auto ">
      {/* Goal Display */}
      <div className="md:container mx-auto flex flex-col justify-center align-center text-center">
        <span className="text-5xl p-3 mt-10">{goal}</span>
      </div>

      {/* Timer */}
      <div className="md:container mx-auto flex flex-col justify-center align-center text-center mt-10">
        <div>
          <span className="text-3xl">Time Left</span>
          <Countdown seconds={time} stop={stop} />
        </div>

        <div>{/* Progress Bar Here */}</div>
      </div>

      <div>{/* Rotating Affirmations Here (Maybe) */}</div>

      {/* Give up Button */}
      <div className="flex align-center justify-center mt-10">
        {isRunning && (
          <button
            className="md:bg-red-300 md:hover:bg-red-500 w-1/6 text-white text-center font-bold py-2 px-4 rounded pointer"
            onClick={giveUp}
          >
            Give Up
          </button>
        )}
        {!isRunning && (
          <button
            className="md:bg-green-300 md:hover:bg-green-500 w-1/6 text-white text-center font-bold py-2 px-4 rounded pointer"
            onClick={() => {
              history.push("/");
            }}
          >
            You did it!
          </button>
        )}
      </div>
    </div>
  );
}
