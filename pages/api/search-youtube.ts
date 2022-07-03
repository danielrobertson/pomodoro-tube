import type { NextApiRequest, NextApiResponse } from "next";
import youtubeSearch from "youtube-search";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const searchValue =
    typeof req.query.search === "string" ? req.query.search : "";

  if (!searchValue) {
    return res.status(400).json({
      error: "No search value provided",
    });
  }

  try {
    const { results: youtubeVideos } = await youtubeSearch(searchValue, {
      maxResults: 10,
      key: process.env.YOUTUBE_API_KEY,
    });

    res.status(200).json(youtubeVideos);
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};
