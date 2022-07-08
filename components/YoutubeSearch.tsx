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

  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(false);
    };

    if (debouncedSearchValue.length > 0) {
      setIsLoading(true);
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
        {isLoading ? (
          <div className="flex justify-center">
            <svg
              role="status"
              className=" w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-400 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        ) : (
          youtubeResults.map((video) => (
            <YoutubeSearchResult
              className="mb-3 mr-3"
              key={video.id}
              video={video}
              handleYoutubeResultClick={handleYoutubeResultClick}
            />
          ))
        )}
      </div>
    </section>
  );
}
