// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title, country, movie } = JSON.parse(req.body)
  console.log("🚀 ~ file: movie.ts:9 ~ title", title, country, movie)

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

  console.log("search", searchTitle)

  const response = await fetch(
    `https://streaming-availability.p.rapidapi.com/search/pro?country=${country}&service=netflix&type=${
      movie ? "movie" : "series"
    }&order_by=original_title&page=1&desc=true&keyword=${title}&output_language=en`,
    options
  ).then((response) => response.json())

  console.log("response", response)
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
  res.status(200).json(response)
}
