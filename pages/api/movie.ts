// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title, country, movie } = JSON.parse(req.body)

  const STREAM_API_KEY = process.env.STREAM_API_KEY

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": STREAM_API_KEY,
      "X-RapidAPI-Host": "streaming-availability.p.rapidapi.com",
    },
  }

  const newTitle = title.split(/[ ,]+/)

  const newArr = newTitle.map((title, key) => {
    if (key !== newTitle.length - 1) {
      return title + "%20"
    } else {
      return title
    }
  })

  const searchTitle = newArr.join("").toLowerCase()

  // console.log("search", searchTitle)

  const response = await fetch(
    `https://streaming-availability.p.rapidapi.com/v2/search/basic?country=${country}&service=netflix&type=${
      movie ? "movie" : "series"
    }&keyword=${title}&page=1&output_language=en`,
    options
  ).then((response) => response.json())

  res.status(200).json(response)
}
