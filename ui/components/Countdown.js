import React, { useEffect, useState } from "react";
import { ProgressBar } from "react-bootstrap";

export default function Countdown(props) {
  const format = (time) => {
    if (time < 1) {
      props.stop();
      return "00:00";
    } else {
      let seconds = time % 60;
      let minutes = Math.floor(time / 60);
      minutes = minutes.toString().length == 1 ? "0" + minutes : minutes;
      seconds = seconds.toString().length == 1 ? "0" + seconds : seconds;
      return minutes + ":" + seconds;
    }
  };

  return (
    <div className="flex flex-grow justify-center align-center">
      <span className="text-9xl">{format(props.seconds)}</span>
      <div>
        <ProgressBar now={60} />
      </div>
    </div>
  );
}
