// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${OPENAI_API_KEY}`,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { prompt } = JSON.parse(req.body)

  const response = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 300,
    }),
  })
  let recommendations = await response.json()

  let recommendationsArray = []
  recommendations = recommendations.choices[0].text.split("\n")
  console.log("1", recommendations)
  for (let i = 0; i < 2; i++) {
    recommendations.shift()
  }
  console.log("3", recommendations)

  recommendations.map((i) => {
    const newStr = i.slice(3)
    console.log("neqw", newStr)
    recommendationsArray.push(newStr)
  })
  console.log(recommendationsArray)
  res.status(200).json({
    recommendations: recommendationsArray,
  })
}
