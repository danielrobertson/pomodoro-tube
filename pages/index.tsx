import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Search from "../components/search.svg";

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center py-2">
      <Head>
        <title>PomodoroTube</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center text-center">
        <h1 className="text-6xl font-bold pt-14">PomodoroTube</h1>

        <p className="mt-3 text-xl">
          Customized your Pomodoro soundtrack with YouTube videos
        </p>

        <div className="container my-6 flex items-stretch justify-center">
          <div className="w-full mt-6 mr-2 rounded-xl border p-6 text-left flex flex-col justify-center">
            <div className="flex gap-3 justify-center flex-wrap">
              <div className="text-lg font-semibold bg-gray-200 px-2 rounded-md">
                Pomodoro
              </div>
              <div className="text-lg font-semibold">Short Break</div>
              <div className="text-lg font-semibold">Long Break</div>
            </div>
            <h2 className="mt-4 text-8xl text-center py-5">25:00</h2>
            <button className="mx-auto mt-4 bg-indigo-500 hover:bg-indigo-400 text-white text-2xl uppercase font-bold px-10 py-3 rounded-lg shadow-2xl">
              Start
            </button>
          </div>

          <div className="w-full mt-6 ml-2 rounded-xl border p-6 text-left flex flex-col">
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 fill-gray-500 " />
              </div>
              <input
                type="text"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md placeholder:text-gray-500"
                placeholder="Search YouTube e.g. lofi chill"
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="flex h-18 w-full items-center justify-center border-t">
        <a
          className="flex items-center justify-center gap-2"
          href="https://www.buymeacoffee.com/danielrobertson"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/buy-coffee.png"
            alt="Buy me a coffee"
            width={200}
            height={48}
          />
        </a>
      </footer>
    </div>
  );
};

export default Home;
