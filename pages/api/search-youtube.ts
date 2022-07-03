import type { NextApiRequest, NextApiResponse } from "next";
import youtubeSearch, { YouTubeSearchResults } from "youtube-search";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<YouTubeSearchResults[]>
) => {
  const searchValue =
    typeof req.query.search === "string" ? req.query.search : "";

  if (!searchValue) {
    console.error("No search value");
    return res.status(400).json([]);
  }

  try {
    const { results: youtubeVideos } = await youtubeSearch(searchValue, {
      maxResults: 10,
      key: process.env.YOUTUBE_API_KEY,
    });

    res.status(200).json(youtubeVideos);
  } catch (err) {
    console.error(err);
    return res.status(500).json([]);
  }
};
