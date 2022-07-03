import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/future/image";

import Search from "../components/search.svg";
import useDebounce from "../hooks/useDebounce";

enum API_ROUTES {
  SEARCH_YOUTUBE = "/api/search-youtube",
}

const DEBOUNCE_TIMEOUT = 300; // ms

const Home: NextPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [youtubeResults, setYoutubeResults] = useState([]);
  const debouncedSearchValue = useDebounce(searchValue, DEBOUNCE_TIMEOUT);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchValue(e.target.value);

  useEffect(() => {
    // Fetch YouTube search results
    const abortController = new AbortController();

    // TODO implement caching on YouTube search results
    const fetchYoutubeData = async () => {
      const youtubeResponse = await fetch(
        `${API_ROUTES.SEARCH_YOUTUBE}?search=${debouncedSearchValue}`,
        { signal: abortController.signal }
      );

      if (!youtubeResponse.ok) {
        throw new Error(`Error: ${youtubeResponse.status}`);
      }
      const youtubeResults = await youtubeResponse.json();
      setYoutubeResults(youtubeResults);
    };

    if (debouncedSearchValue.length > 0) {
      fetchYoutubeData();
    } else {
      setYoutubeResults([]);
    }

    return () => {
      abortController.abort();
    };
  }, [debouncedSearchValue]);

  return (
    <div className="flex min-h-screen flex-col items-center py-2">
      <Head>
        <title>PomodoroTube</title>
        <link rel="icon" href="/tv.ico" />
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

          <div className="w-full h-96 mt-6 ml-2 rounded-xl border p-6 text-left flex flex-col overflow-y-scroll">
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 fill-gray-500" />
              </div>
              <input
                type="text"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md placeholder:text-gray-500"
                placeholder="Search YouTube e.g. lofi chill"
                onChange={handleSearchInputChange}
                value={searchValue}
              />
            </div>
            <div className="mt-3">
              {youtubeResults.map((result: any) => (
                <div className="flex mb-3" id={result.id}>
                  <Image
                    className="flex-shrink-0"
                    src={result.thumbnails?.default.url}
                    alt="YouTube video thumbnail"
                    width={70}
                    height={50}
                  />
                  <div className="ml-3 ">{result.title}</div>
                </div>
              ))}
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
