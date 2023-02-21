import React from "react"
import Image from "next/image"
import Link from "next/link"
import { faGoogle, faImdb } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Button } from "./ui/button"

interface MovieData {
  title: string
  link?: string
  imdb?: string
  image?: string
  imdbLink?: string
  plot?: string
  year?: string
}

interface IProps {
  movie: MovieData
  loading: boolean
}

export const Item: React.FC<IProps> = ({ movie, loading }) => {
  if (loading) {
    return null
  } else {
    return (
      <div className="flex items-center justify-between w-full gap-8">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link">
              <h1 className="text-base font-bold leading-tight tracking-tighter underline whitespace-nowrap md:min-w-fit md:text-xl">
                {movie.title}
              </h1>
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className=" w-fit">
            {/* <div className="flex items-center justify-between space-x-4">
              {movie.image !== "" && (
                <Avatar>
                  <AvatarImage src={movie.image} />
                  <AvatarFallback>VC</AvatarFallback>
                </Avatar>
              )}
              <div className="flex gap-4">
                <h4 className="text-sm font-semibold">{movie.title}</h4>
                <h2 className="text-sm">{movie.imdb} on IMDb</h2>

              </div>
            </div> */}
            <div className="flex flex-col justify-center w-full ">
              <div className="max-w-[340px] py-3 mx-auto md:max-w-xl ">
                <div className="flex p-4 space-x-2 bg-white border border-gray-100 shadow-lg md:space-x-8 md:p-8 rounded-3xl">
                  <div className="w-1/2 h-1/3 md:h-fit ">
                    <Link href={movie.imdbLink} className="">
                      <div className="absolute z-10 p-2 font-semibold text-black bg-yellow-400 rounded-full left-36 md:left-60 md:top-16 w-fit">
                        {movie.imdb}
                      </div>

                      <div className="relative w-full h-full ">
                        <Image
                          className="w-full h-full shadow-lg rounded-3xl"
                          src={movie.image ? movie.image : "/movie.jpg"}
                          width={290}
                          height={360}
                          // fill={true}
                          object-fit="contain"
                          // placeholder="blur"
                          alt=""
                        />
                      </div>
                    </Link>
                  </div>

                  <div className="flex flex-col justify-between w-1/2 space-y-4">
                    <div className="flex justify-center ">
                      <h2 className="text-xl font-bold text-black md:text-3xl">
                        {movie.title}
                      </h2>
                    </div>
                    <div>
                      <div className="text-gray-800 text-md md:text-lg">
                        {movie.year}
                      </div>
                    </div>
                    <p className="overflow-y-hidden text-xs md:text-base max-h-min text-gray-400 text-ellipsis ... ">
                      {movie.plot}
                    </p>
                    <div className="flex items-center justify-center w-full gap-4 mt-auto ">
                      {movie.link.includes("netflix") ? (
                        <Link href={movie.link}>
                          <Image
                            className="hover:text-blue-200"
                            src={"netflix.svg"}
                            width={24}
                            height={24}
                            alt="netflix"
                          />
                        </Link>
                      ) : (
                        <Link href={movie.link}>
                          <svg
                            className="w-6 h-6 fill-current hover:text-blue-200"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            viewBox="0 0 32 32"
                          >
                            <defs>
                              <path
                                id="A"
                                d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                              />
                            </defs>
                            <clipPath id="B">
                              <use xlinkHref="#A" />
                            </clipPath>
                            <g transform="matrix(.727273 0 0 .727273 -.954545 -1.45455)">
                              <path
                                d="M0 37V11l17 13z"
                                clipPath="url(#B)"
                                fill="#fbbc05"
                              />
                              <path
                                d="M0 11l17 13 7-6.1L48 14V0H0z"
                                clipPath="url(#B)"
                                fill="#ea4335"
                              />
                              <path
                                d="M0 37l30-23 7.9 1L48 0v48H0z"
                                clipPath="url(#B)"
                                fill="#34a853"
                              />
                              <path
                                d="M48 48L17 24l-4-3 35-10z"
                                clipPath="url(#B)"
                                fill="#4285f4"
                              />
                            </g>
                          </svg>
                        </Link>
                      )}
                      <Link href={movie.imdbLink}>
                        <svg
                          className="w-6 h-6"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-label="IMDb"
                          role="img"
                          viewBox="0 0 512 512"
                        >
                          <rect
                            width="512"
                            height="512"
                            rx="15%"
                            fill="#f5c518"
                          />
                          <path d="M104 328V184H64v144zM189 184l-9 67-5-36-5-31h-50v144h34v-95l14 95h25l13-97v97h34V184zM256 328V184h62c15 0 26 11 26 25v94c0 14-11 25-26 25zm47-118l-9-1v94c5 0 9-1 10-3 2-2 2-8 2-18v-56-12l-3-4zM419 220h3c14 0 26 11 26 25v58c0 14-12 25-26 25h-3c-8 0-16-4-21-11l-2 9h-36V184h38v46c5-6 13-10 21-10zm-8 70v-34l-1-11c-1-2-4-3-6-3s-5 1-6 3v57c1 2 4 3 6 3s6-1 6-3l1-12z" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
        {movie.link !== "" ? (
          <div className="flex items-center gap-4 ml-4 whitespace-nowrap">
            <Link href={movie.link}>
              <Button className="" variant="subtle">
                Watch now
              </Button>
            </Link>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    )
  }
}
