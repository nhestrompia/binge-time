// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title } = JSON.parse(req.body)
  const RAPID_API_KEY = process.env.STREAM_API_KEY

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": RAPID_API_KEY,
      "X-RapidAPI-Host": "imdb-search2.p.rapidapi.com",
    },
  }

  const rapidOptions = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": RAPID_API_KEY,
      "X-RapidAPI-Host": "movie-database-alternative.p.rapidapi.com",
    },
  }

  const response = await fetch(
    `https://imdb-search2.p.rapidapi.com/${title}`,
    options
  ).then((response) => response.json())
  const checkMovie = response.description.find((movie) => {
    return movie["#TITLE"].toLowerCase() === title.toLowerCase()
  })
  const response2 = await fetch(
    `https://movie-database-alternative.p.rapidapi.com/?r=json&i=${checkMovie["#IMDB_ID"]}`,
    rapidOptions
  ).then((response) => response.json())
  // console.log("rapid imdb check", response2)

  // console.log("imdb check", response)

  res.status(200).json(response2)
}
