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

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      // prompt: prompt,
      temperature: 0.5,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 300,
      n: 1,
    }),
  })
  let recommendations = await response.json()
  // console.log("recommendations", recommendations)
  let recommendationsArray = []
  recommendations = recommendations.choices[0].message.content.split("\n")
  let recommendationData: string[] = recommendations

  recommendations.map((i) => {
    const newStr = i.slice(2)
    // console.log("neqw", newStr)
    recommendationsArray.push(newStr)
  })
  // console.log("array", recommendationsArray)
  res.status(200).json({
    recommendations: recommendationsArray,
  })
}
