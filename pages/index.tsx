import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/future/image";
import YouTube, { YouTubeProps } from "react-youtube";
import type { YouTubeSearchResults } from "youtube-search";

import YoutubeSearch from "../components/YoutubeSearch";
import Timer from "../components/Timer";

const DEFAULT_VIDEO_ID = "5qap5aO4i9A";

const Home: NextPage = () => {
  const [currentVideo, setCurrentVideo] = useState<YouTubeSearchResults>();

  const handleYoutubeResultClick = (video: YouTubeSearchResults) => {
    // TODO retain search history results for quick switches?
    setCurrentVideo(video);
  };

  const onPlayerReady: YouTubeProps["onEnd"] = (event) => {
    // TODO onPlayerEnd restart video
    // event.target.playVideo();
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
          Customize your Pomodoro soundtrack with YouTube videos
        </p>

        <div className="container p-2 my-6 flex flex-col md:flex-row items-stretch justify-center">
          <Timer />
          <YoutubeSearch
            className="mt-6 md:ml-2"
            handleYoutubeResultClick={handleYoutubeResultClick}
          />
        </div>

        {/* Video player */}
        <YouTube
          className="video-container w-11/12 md:w-1/2"
          videoId={currentVideo?.id || DEFAULT_VIDEO_ID}
          opts={{
            height: "390", // px
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
