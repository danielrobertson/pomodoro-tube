import React, { useEffect, useState } from "react";
import classnames from "classnames";

import Search from "../components/search.svg";
import { YoutubeSearchResult } from "./YoutubeSearchResult";
import useDebounce from "../hooks/useDebounce";

import type { YouTubeSearchResults } from "youtube-search";

type Props = {
  className?: string;
  handleYoutubeResultClick: (video: YouTubeSearchResults) => void;
};

const DEBOUNCE_TIMEOUT = 500; // ms

enum API_ROUTES {
  SEARCH_YOUTUBE = "/api/search-youtube",
}

export default function YoutubeSearch({
  className,
  handleYoutubeResultClick,
}: Props) {
  const [searchValue, setSearchValue] = useState("");
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchValue(e.target.value);

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

  const classes = classnames(
    className,
    "w-full h-96 rounded-xl border p-6 text-left flex flex-col"
  );

  return (
    <section className={classes}>
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
        {youtubeResults.map((video) => (
          <YoutubeSearchResult
            className="mb-3 mr-3"
            key={video.id}
            video={video}
            handleYoutubeResultClick={handleYoutubeResultClick}
          />
        ))}
      </div>
    </section>
  );
}
