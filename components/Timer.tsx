import React, { useState } from "react";
import { useTimer } from "use-timer";

type Props = {};

const POMODORO_SECONDS = 25 * 60;
const SHORT_BREAK_SECONDS = 10;
const LONG_BREAK_SECONDS = 20;

export default function Timer({}: Props) {
  const [initialTimeSeconds, setInitialTimeSeconds] =
    useState(POMODORO_SECONDS);

  const {
    time: secondsRemaining,
    start,
    pause,
    reset,
    status,
  } = useTimer({
    initialTime: initialTimeSeconds,
    endTime: 0,
    timerType: "DECREMENTAL",
    onTimeOver: () => {
      console.log("Time is over");
    },
  });

  const minutes = String(Math.trunc(secondsRemaining / 60)).padStart(2, "0");
  const seconds = String(secondsRemaining % 60).padStart(2, "0");

  return (
    <section className="w-full mt-6 md:mr-2 rounded-xl border p-6 text-left flex flex-col justify-between">
      <div className="flex gap-3 justify-center flex-wrap">
        <div className="text-lg font-semibold bg-gray-200 px-2 rounded-md">
          Pomodoro
        </div>
        <div className="text-lg font-semibold">Short Break</div>
        <div className="text-lg font-semibold">Long Break</div>
      </div>
      <h2 className="tabular-nums mt-4 text-8xl text-center py-5">
        {minutes}:{seconds}
      </h2>
      <button
        className="mx-auto mt-4 bg-indigo-500 hover:bg-indigo-400 text-white text-2xl uppercase font-bold px-10 py-3 rounded-lg shadow-2xl"
        onClick={() => (status === "RUNNING" ? pause() : start())}
      >
        {status === "RUNNING" ? "Stop" : "Start"}
      </button>
    </section>
  );
}
