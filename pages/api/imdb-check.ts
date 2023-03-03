// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title } = JSON.parse(req.body)
  console.log("🚀 ~ file: movie.ts:9 ~ title", title)

  const RAPID_API_KEY = process.env.STREAM_API_KEY

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": RAPID_API_KEY,
      "X-RapidAPI-Host": "imdb-movies-web-series-etc-search.p.rapidapi.com",
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
    `https://imdb-movies-web-series-etc-search.p.rapidapi.com/${title}.json`,
    options
  ).then((response) => response.json())

  const checkMovie = response.d.find((movie) => {
    return movie.l.toLowerCase() === title.toLowerCase()
  })

  const response2 = await fetch(
    `https://movie-database-alternative.p.rapidapi.com/?r=json&i=${checkMovie.id}`,
    rapidOptions
  ).then((response) => response.json())
  console.log("rapid imdb check", response2)

  console.log("imdb check", response)

  //   let recommendationsArray = []
  //   recommendations = recommendations.choices[0].text.split("\n")
  //   console.log("1", recommendations)
  //   for (let i = 0; i < 2; i++) {
  //     recommendations.shift()
  //   }
  //   console.log("3", recommendations)

  //   recommendations.map((i) => {
  //     const newStr = i.slice(3)
  //     console.log("neqw", newStr)
  //     recommendationsArray.push(newStr)
  //   })
  //   console.log(recommendationsArray)
  res.status(200).json(response2)
}
