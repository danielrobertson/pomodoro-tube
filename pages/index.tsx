import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/future/image";
import YouTube, { YouTubeProps } from "react-youtube";

import { YouTubeSearchResults } from "youtube-search";

import Search from "../components/search.svg";
import useDebounce from "../hooks/useDebounce";

const DEBOUNCE_TIMEOUT = 500; // ms
const DEFAULT_VIDEO_ID = "5qap5aO4i9A";
enum API_ROUTES {
  SEARCH_YOUTUBE = "/api/search-youtube",
}

const Home: NextPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [currentVideo, setCurrentVideo] = useState<YouTubeSearchResults>();
  const [youtubeResults, setYoutubeResults] = useState<YouTubeSearchResults[]>(
    []
  );

  const debouncedSearchValue = useDebounce(searchValue, DEBOUNCE_TIMEOUT);

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
        console.error(`YouTube API error: ${youtubeResponse.status}`);
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

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchValue(e.target.value);

  const handleYoutubeResultClick = (video: YouTubeSearchResults) => {
    // TODO retain search history results for quick switches?
    setCurrentVideo(video);
    setSearchValue("");
    setYoutubeResults([]);
  };

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  };

  return (
    <div className="flex min-h-screen flex-col items-center py-2">
      <Head>
        <title>PomodoroTube</title>
        <link rel="icon" href="/tv.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center text-center">
        <h1 className="container text-5xl md:text-6xl font-bold pt-14">
          PomodoroTube
        </h1>

        <p className="container mt-3 text-xl">
          Customized your Pomodoro soundtrack with YouTube videos
        </p>

        <div className="container p-2 my-6 flex flex-col md:flex-row items-stretch justify-center">
          {/* Pomodoro panel */}
          <div className="w-full mt-6 md:mr-2 rounded-xl border p-6 text-left flex flex-col justify-between">
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

          {/* Search panel */}
          <div className="w-full h-96 mt-6 md:ml-2 rounded-xl border p-6 text-left flex flex-col">
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
            <div className="mt-3 overflow-y-scroll">
              {youtubeResults.map((result) => (
                <div
                  className="flex items-center mb-3 mr-3 rounded border border-gray-200 overflow-hidden shadow-sm cursor-pointer"
                  id={result.id}
                  onClick={() => handleYoutubeResultClick(result)}
                >
                  <Image
                    className="flex-shrink-0"
                    src={
                      result?.thumbnails?.default?.url ||
                      "./thumnail-default.png"
                    }
                    alt="YouTube video thumbnail"
                    width={70}
                    height={50}
                    // TODO implement loading blur
                  />
                  <div className="ml-3 ">{result.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Video player */}
        <YouTube
          className="video-container  w-11/12 md:w-1/2"
          videoId={currentVideo?.id || DEFAULT_VIDEO_ID}
          opts={{
            height: "390",
            width: "640",
            playerVars: {
              // https://developers.google.com/youtube/player_parameters
              autoplay: 1,
            },
          }}
          onReady={onPlayerReady}
        />
      </main>

      <footer className="flex h-18 mt-8 w-full items-center justify-center border-t">
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
