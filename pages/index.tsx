import { createRef, useEffect, useState } from "react"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { COUNTRIES } from "@/utils/countries"
import { useTheme } from "next-themes"

import { siteConfig } from "@/config/site"
import { CountrySelector } from "@/components/CountrySelector"
import { Item } from "@/components/Item"
import { Icons } from "@/components/icons"
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
  imdb?: string
  image?: string
  imdbLink?: string
  plot?: string
  year?: string
}

interface PrevRecommendation {
  title: string
  recommendations: string[]
}

//TODO add another button so they can request different recommendations than current ones.

export default function IndexPage() {
  const countryRef = createRef<HTMLDivElement>()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [values, setValues] = useState({ title: "", country: "ar" })
  const [isMovie, setIsMovie] = useState(false)
  const [movies, setMovies] = useState<MovieData[]>([])
  const [message, setMessage] = useState("")
  const [prevTitle, setPrevTitle] = useState<PrevRecommendation>()
  const { theme } = useTheme()

  const submit = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      const movieTitle = values.title
      setIsLoading(true)
      setMovies([])

      let prompt: string

      if (prevTitle && movieTitle === prevTitle.title) {
        const recommendedTitles = prevTitle.recommendations.join(",")

        if (isMovie) {
          prompt = `Can you recommend me 3 movies similar to ${movieTitle}? Please recommend other shows than these ones; ${recommendedTitles}. Please just give their names as a response in a numbered list, don't give their release date or year they came out`
        } else {
          prompt = `Can you recommend me 3 tv series similar to ${movieTitle}? Please recommend other shows than these ones; ${recommendedTitles}. Please just give their names as a response in a numbered list, don't give their release date or year they came out`
        }
      } else {
        if (isMovie) {
          prompt = `Can you recommend me 3 movies similar to ${movieTitle}? Please just give their names as a response in a numbered list, don't give their release date or year they came out`
        } else {
          prompt = `Can you recommend me 3 tv series similar to ${movieTitle}? Please just give their names as a response in a numbered list, don't give their release date or year they came out`
        }
        setPrevTitle({
          title: movieTitle,
          recommendations: [],
        })
      }

      const response = await fetch("/api/recommendation", {
        method: "POST",
        body: JSON.stringify({
          prompt: prompt,
        }),
      })
      const recommendationData = await response.json()

      let movieObject = []

      const newMovies = recommendationData.recommendations.map((movie) => {
        let tempObject = {
          title: movie,
          link: "",
          imdb: "",
          image: "",
          imdbLink: "",
          plot: "",
          year: "",
        }
        movieObject.push(tempObject)
      })
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
        const responseData = await movieGet.json()
        if (responseData.results.length > 0) {
          const movieInfo = responseData.results.find((movie) => {
            return (
              movieObject[i].title.toLowerCase() ===
              movie.originalTitle.toLowerCase()
            )
          })
          if (movieInfo !== undefined) {
            movieObject = movieObject.map((movie) => {
              if (
                movie.title.toLowerCase() ==
                movieInfo.originalTitle.toLowerCase()
              ) {
                console.log("poster URL", movieInfo)
                console.log("poster data", movieInfo.posterURLs)
                const movieLink = movieInfo.streamingInfo.netflix[country]
                const poster = movieInfo.posterURLs.original
                console.log(
                  "🚀 ~ file: index.tsx:102 ~ movieObject=movieObject.map ~ poster:",
                  poster
                )

                const rating = movieInfo.imdbRating.toString()
                // console.log(
                //   "🚀 ~ file: index.tsx:102 ~ movieObject=movieObject.map ~ rating:",
                //   rating
                // )

                const ratingArr = Array.from(rating)
                // console.log(
                //   "🚀 ~ file: index.tsx:105 ~ movieObject=movieObject.map ~ ratingArr:",
                //   ratingArr
                // )

                const fixedRating = ratingArr[0] + "." + ratingArr[1]
                // console.log(
                //   "🚀 ~ file: index.tsx:108 ~ movieObject=movieObject.map ~ fixedRating:",
                //   fixedRating
                // )
                return {
                  ...movie,
                  link: movieLink.link,
                  imdb: fixedRating,
                  image: poster,
                  plot: movieInfo.overview,
                  imdbLink: `https://www.imdb.com/title/${movieInfo.imdbID}`,
                  year: `${movieInfo.firstAirYear}-${movieInfo.lastAirYear}`,
                }
              }
              return movie
            })
          } else {
            const movieGet = await fetch("/api/imdb-check", {
              method: "POST",
              body: JSON.stringify({
                title: movieObject[i].title.toLowerCase(),
              }),
            })
            const responseData = await movieGet.json()
            if (responseData !== undefined) {
              console.log(
                "🚀 ~ file: index.tsx:145 ~ submit ~ responseData",
                responseData
              )
              movieObject[i].imdb = responseData.imdbRating
              movieObject[i].image = responseData.Poster
              movieObject[i].plot = responseData.Plot
              ;(movieObject[
                i
              ].imdbLink = `https://www.imdb.com/title/${responseData.imdbID}`),
                (movieObject[i].year = responseData.Year)
            } else {
              movieObject[i].imdb = "N/A"
              movieObject[i].image = ""
            }

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
          }
        } else {
          const movieGet = await fetch("/api/imdb-check", {
            method: "POST",
            body: JSON.stringify({
              title: movieObject[i].title.toLowerCase(),
            }),
          })
          const responseData = await movieGet.json()
          if (responseData !== undefined) {
            console.log(
              "🚀 ~ file: index.tsx:145 ~ submit ~ responseData",
              responseData
            )
            movieObject[i].imdb = responseData.imdbRating
            movieObject[i].image = responseData.Poster
            movieObject[i].plot = responseData.Plot
            movieObject[
              i
            ].imdbLink = `https://www.imdb.com/title/${responseData.imdbID}`
            movieObject[i].year = responseData.Year
          } else {
            movieObject[i].imdb = "N/A"
            movieObject[i].image = ""
          }

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
        }
      }
      fixTitle(movieTitle)
      setMovies(movieObject)

      const recommendedTitles = []
      movieObject.forEach((movie) => {
        recommendedTitles.push(movie.title)
      })

      setPrevTitle((prevState) => ({
        ...prevState,
        recommendations: [...prevState.recommendations, ...recommendedTitles],
      }))

      console.log("prev Title 286", prevTitle)
      setIsLoading(false)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    setValues({ title: "", country: "ar" })
  }, [])

  const handleChange = (val: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prevState) => ({
      ...prevState,
      title: val.target.value,
    }))
  }

  const fixTitle = (name) => {
    const newTitle = name
    const words = newTitle.split(" ")
    console.log(words)
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
      <section className="container grid items-center justify-center w-full max-w-xl gap-6 pt-4 pb-8 md:-mt-4">
        <div className="flex max-w-[980px] flex-col items-center gap-4">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
            Binge Time
          </h1>
          <p className="max-w-[700px] text-center text-base md:text-lg text-slate-700 dark:text-slate-400 ">
            Tired of endless scrolling? Let us help you find your next
            binge-worthy show. Enter your favorite show and your country, and
            we&apos;ll give you three tailored recommendations. Bonus:
            we&apos;ll check if they&apos;re on Netflix in your area. Start
            exploring now!
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
                ? "bg-gray-500 dark:bg-[#c1a0da] dark:hover:bg-[#8246AF] dark:hover:text-white dark:text-[#3F0071]   hover:bg-gray-800  text-gray-50 "
                : "bg-black dark:bg-[#22003d] dark:text-white scale-105  text-white "
            }`}
          >
            Tv Series
          </button>
          <button
            onClick={() => setIsMovie(true)}
            className={`rounded-r-md tracking-tighter leading-tight font-bold text-sm md:text-base transition ease-in-out duration-300 px-4 py-2 ${
              isMovie
                ? "bg-black dark:bg-[#22003d] dark:text-white scale-105  text-white "
                : "bg-gray-500 dark:bg-[#c1a0da] dark:hover:bg-[#8246AF] dark:hover:text-white dark:text-[#3F0071]   hover:bg-gray-800  text-gray-50 "
            }`}
          >
            Movie
          </button>
        </label>
        <form className="flex flex-col w-full gap-4 mt-6">
          <Input
            className="w-full md:max-w-2xl"
            type="text"
            required={true}
            value={values.title}
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
            <h1 className="text-base md:text-lg">
              Here are some {isMovie ? "Movies" : "TV series"} similar to{" "}
              <span className="font-semibold">{message} </span> :
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
            <div className="flex justify-center mt-6">
              <div className="flex items-center justify-center px-4 py-2 space-x-2 text-sm text-gray-600 transition-colors bg-white border border-gray-300 rounded-full shadow-md max-w-fit hover:bg-gray-100">
                <div className="flex flex-row space-x-4">
                  <p>Project</p>
                  <Link href={"https://github.com/nhestrompia/binge-time"}>
                    <Icons.gitHub className="w-4 h-4 mt-0.5  dark:text-[#3F0071]" />
                  </Link>
                  <p>made by</p>
                  <Link href={"https://twitter.com/nhestrompia"}>
                    <Icons.twitter className="w-4 h-4 mt-0.5 dark:text-[#3F0071]" />
                  </Link>
                </div>
              </div>
            </div>
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
        {/* <div className="sticky flex justify-center top-full">
          <div className="flex items-center justify-center px-4 py-2 space-x-2 text-sm text-gray-600 transition-colors bg-white border border-gray-300 rounded-full shadow-md max-w-fit hover:bg-gray-100">
            <div className="flex flex-row space-x-4">
              <p>Project</p>
              <Link href={"https://github.com/nhestrompia/binge-time"}>
                <Icons.gitHub className="w-4 h-4 mt-0.5  dark:text-[#3F0071]" />
              </Link>
              <p>made by</p>
              <Link href={"https://twitter.com/nhestrompia"}>
                <Icons.twitter className="w-4 h-4 mt-0.5 dark:text-[#3F0071]" />
              </Link>
            </div>
          </div>
        </div> */}
      </section>
    </Layout>
  )
}
