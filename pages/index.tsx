import { createRef, useEffect, useState } from "react"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { COUNTRIES } from "@/utils/countries"
import { useTheme } from "next-themes"

import { siteConfig } from "@/config/site"
import { CountrySelector } from "@/components/CountrySelector"
import { Item } from "@/components/Item"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

interface MovieData {
  title: string
  link?: string
}

export default function IndexPage() {
  const countryRef = createRef<HTMLDivElement>()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [values, setValues] = useState({ title: "", country: "ar" })
  const [isMovie, setIsMovie] = useState(false)
  const [movies, setMovies] = useState<MovieData[]>([])
  const [message, setMessage] = useState("")
  const { theme } = useTheme()

  const submit = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      setMovies([])

      let prompt: string

      if (isMovie) {
        prompt = `Can you recommend me 3 movies similar to ${values.title}? Please just give their names as a response, don't give their release date or year they came out`
      } else {
        prompt = `Can you recommend me 3 tv series similar to ${values.title}? Please just give their names as a response, don't give their release date or year they came out`
      }

      const response = await fetch("/api/recommendation", {
        method: "POST",
        body: JSON.stringify({
          prompt: prompt,
        }),
      })
      const recommendationData = await response.json()

      // setMovies(recommendationData.recommendations)
      let movieObject = []

      const newMovies = recommendationData.recommendations.map((movie) => {
        let tempObject = {
          title: movie,
          link: "",
        }
        movieObject.push(tempObject)
      })
      console.log("movie data", movieObject)
      setMovies(movieObject)
      const country = values.country

      for (let i = 0; i < movieObject.length; i++) {
        const movieGet = await fetch("/api/movie", {
          method: "POST",
          body: JSON.stringify({
            title: movieObject[i].title,
            country: country,
            movie: isMovie,
          }),
        })
        console.log("🚀 ~ file: index.tsx:74 ~ submit ~ movieGet", movieGet)
        const responseData = await movieGet.json()
        console.log(
          "🚀 ~ file: index.tsx:79 ~ submit ~ responseData",
          responseData
        )

        if (responseData.results.length > 0) {
          const movieInfo = responseData.results.find((movie) => {
            console.log("movie within find", movieObject[i].title.toLowerCase())
            return (
              movieObject[i].title.toLowerCase() ===
              movie.originalTitle.toLowerCase()
            )
          })
          console.log(
            "🚀 ~ file: index.tsx:97 ~ movieInfo ~ movieInfo",
            movieInfo
          )
          if (movieInfo !== undefined) {
            console.log(
              "🚀 ~ file: index.tsx:90 ~ movieInfo ~ movieInfo",
              movieInfo
            )
            console.log(
              "🚀 ~ file: index.tsx:90 ~ link",
              movieInfo.streamingInfo.netflix[country]
            )

            movieObject = movieObject.map((movie) => {
              console.log("within movieObject", movie)
              if (
                movie.title.toLowerCase() ==
                movieInfo.originalTitle.toLowerCase()
              ) {
                const movieLink = movieInfo.streamingInfo.netflix[country]
                return {
                  ...movie,
                  link: movieLink.link,
                }
              }
              return movie
            })
            console.log(
              "🚀 ~ file: index.tsx:103 ~ movieObject ~ movieObject",
              movieObject
            )
          } else {
            const newTitle = movieObject[i].title.split(/[ ,]+/)

            const newArr = newTitle.map((title, key) => {
              if (key !== newTitle.length - 1) {
                if (key === 0) {
                  return "watch+" + title + "+"
                } else {
                  return title + "+"
                }
              } else {
                return title
              }
            })

            const searchTitle = newArr.join("").toLowerCase()

            movieObject = movieObject.map((movie) => {
              console.log("within movieObject", movie)
              if (
                movie.title.toLowerCase() ==
                movieInfo.originalTitle.toLowerCase()
              ) {
                return {
                  ...movie,
                  link: `https://www.google.com/search?q=${searchTitle}`,
                }
              }
              return movie
            })
            console.log(
              "🚀 ~ file: index.tsx:156 ~ movieObject=movies.map ~ movieObject",
              movieObject
            )
          }
        } else {
          const newTitle = movieObject[i].title.split(/[ ,]+/)

          const newArr = newTitle.map((title, key) => {
            if (key !== newTitle.length - 1) {
              if (key === 0) {
                return "watch+" + title + "+"
              } else {
                return title + "+"
              }
            } else {
              return title
            }
          })

          const searchTitle = newArr.join("").toLowerCase()
          console.log(
            "🚀 ~ file: index.tsx:180 ~ submit ~ searchTitle",
            searchTitle
          )

          movieObject = movieObject.map((movie) => {
            console.log("within movieObject", movie)
            if (
              movie.title.toLowerCase() == movieObject[i].title.toLowerCase()
            ) {
              return {
                ...movie,
                link: `https://www.google.com/search?q=${searchTitle}`,
              }
            }
            return movie
          })
          console.log(
            "🚀 ~ file: index.tsx:185 ~ movieObject=movies.map ~ movieObject",
            movieObject
          )
        }
      }
      fixTitle()
      setMovies(movieObject)

      setIsLoading(false)
    } catch (err) {
      console.error(err)
    }
  }
  console.log("moviesss", movies)
  // console.log("moviesss netf", movies[0].streamingInfo.netflix.tr.link)

  const handleChange = (val: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prevState) => ({
      ...prevState,
      title: val.target.value,
    }))
  }

  const fixTitle = () => {
    const newTitle = values.title
    const words = newTitle.split(" ")

    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1)
    }
    const fixedTitle = words.join(" ")
    console.log(words)
    setMessage(fixedTitle)
  }

  return (
    <Layout>
      <Head>
        <title>Binge Time</title>
        <meta
          name="description"
          content="AI powered movie/tv series recommendation"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center justify-center w-full max-w-xl gap-6 pt-4 pb-8 md:-mt-6">
        <div className="flex max-w-[980px] flex-col items-center gap-4">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
            Binge Time
          </h1>
          <p className="max-w-[700px] text-center text-base md:text-lg text-slate-700 dark:text-slate-400 ">
            Find tv series/movies similar to your favorite. Enter one show you
            like and country you live in so we can check if it is available on
            Netflix.
          </p>
          <div className="mx-auto opacity-20"></div>

          {/* <div className="fixed flex items-center justify-center min-h-screen bottom-5 -z-10">
            <div className="relative w-full max-w-lg">
              <div className="absolute top-0 w-64 h-64 bg-purple-300 rounded-full opacity-50 -left-8 mix-blend-multiply filter blur-xl "></div>
              <div className="absolute bg-yellow-300 rounded-full opacity-50 w-72 h-72 -top-36 -right-14 mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
              <div className="absolute w-56 h-56 bg-pink-800 rounded-full opacity-50 left-8 -bottom-14 mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
            </div>
          </div> */}
          {/* {theme === "light" && (
            <Image
              className="fixed bottom-8 -z-10 opacity-30"
              src={"cinema.svg"}
              width={600}
              height={600}
              alt="guy with popcorn"
            />
          )} */}
        </div>
        <label className="relative inline-flex items-center justify-center w-full -mt-4 rounded-md ">
          <input id="Toggle" type="checkbox" className="hidden peer" />

          <button
            onClick={() => setIsMovie(false)}
            className={`rounded-l-md  w-fit tracking-tighter leading-tight font-bold text-sm md:text-base transition ease-in-out duration-300 px-4 py-2 ${
              isMovie
                ? "bg-gray-500 dark:hover:bg-[#8170c4] dark:hover:text-[#c3fcf2] dark:bg-[#c3fcf2] hover:bg-gray-800  text-gray-50 dark:text-[#3F0071]"
                : "bg-black dark:bg-[#22003d] dark:text-[#c3fcf2] scale-105  text-white "
            }`}
          >
            Tv Series
          </button>
          <button
            onClick={() => setIsMovie(true)}
            className={`rounded-r-md tracking-tighter leading-tight font-bold text-sm md:text-base transition ease-in-out duration-300 px-4 py-2 ${
              isMovie
                ? "bg-black dark:bg-[#22003d] dark:text-[#c3fcf2] text-white scale-105 "
                : "bg-gray-500 dark:hover:bg-[#8170c4] dark:hover:text-[#c3fcf2] dark:bg-[#c3fcf2] hover:bg-gray-800  text-gray-50 dark:text-[#3F0071] "
            }`}
          >
            Movie
          </button>
        </label>
        <form className="flex flex-col w-full gap-4 mt-4">
          <Input
            className="w-full md:max-w-2xl"
            type="text"
            onChange={handleChange}
            placeholder={`${isMovie ? "Movie" : "Tv series"} you like ${
              isMovie ? "(e.g. Contact)" : "(e.g. The Office)"
            }`}
          />

          <CountrySelector
            id={"countries"}
            ref={countryRef}
            isOpen={isOpen}
            onToggle={() => setIsOpen(!isOpen)}
            onChange={(val) => setValues({ ...values, country: val })}
            selectedValue={COUNTRIES.find(
              (option) => option.value === values.country
            )}
          />
          <Button onClick={submit} variant="subtle">
            Help me Binge Watch
          </Button>
        </form>
        {!isLoading && movies !== undefined && movies.length > 0 && (
          <div className="w-full">
            <h1 className="text-xl">
              Here are some {isMovie ? "movies" : "tv series"} similar to{" "}
              {message} :
            </h1>
            <ul className="mt-8 space-y-4 list-disc">
              {movies.map((movie, key) => {
                return (
                  <li className="text-center" key={key}>
                    <Item movie={movie} loading={isLoading} />
                  </li>
                )
              })}
            </ul>
          </div>
        )}
        {isLoading && (
          <div className="flex justify-center w-full mt-16">
            <span className="inline-flex items-center gap-px">
              <span className="animate-blink mx-px h-2.5 w-2.5 rounded-full dark:bg-[#c3fcf2] bg-gray-500"></span>
              <span className="animate-blink animation-delay-200 mx-px h-2.5 w-2.5 rounded-full dark:bg-[#c3fcf2] bg-gray-500"></span>
              <span className="animate-blink animation-delay-400 mx-px h-2.5 w-2.5 rounded-full dark:bg-[#c3fcf2] bg-gray-500"></span>
            </span>
          </div>
        )}
      </section>
    </Layout>
  )
}
