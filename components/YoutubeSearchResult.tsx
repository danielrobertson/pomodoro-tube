import React, { useState } from "react";
import Image from "next/future/image";
import classnames from "classnames";
import type { YouTubeSearchResults } from "youtube-search";

const DEFAULT_IMG_URL = "/thumbnail-default.png";

type Props = {
  className?: string;
  handleYoutubeResultClick: (video: YouTubeSearchResults) => void;
  video: YouTubeSearchResults;
};

export const YoutubeSearchResult = ({
  className,
  handleYoutubeResultClick,
  video,
}: Props) => {
  const [thumbnailUrl, setThumbnailUrl] = useState(
    video?.thumbnails?.default?.url || DEFAULT_IMG_URL
  );

  return (
    <div
      className={classnames(
        "flex items-center rounded border border-gray-200 overflow-hidden shadow-sm cursor-pointer active:border-indigo-500",
        className
      )}
      onClick={() => handleYoutubeResultClick(video)}
    >
      <Image
        className="flex-shrink-0"
        onError={() => setThumbnailUrl(DEFAULT_IMG_URL)}
        src={thumbnailUrl}
        alt="Video thumbnail"
        width={70}
        height={50}
        // TODO implement loading blur
      />
      <div className="ml-3">{video.title}</div>
    </div>
  );
};
