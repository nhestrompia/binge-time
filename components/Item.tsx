import React from "react"
import Image from "next/image"
import Link from "next/link"

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
              <h1 className="text-base font-bold leading-tight tracking-tighter underline min-w-fit md:text-xl">
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
              <div className="py-3 sm:max-w-xl sm:mx-auto ">
                <div className="flex p-8 space-x-8 bg-white border border-gray-100 shadow-lg sm:rounded-3xl">
                  <div className="w-1/2 h-fit ">
                    <Link href={movie.imdbLink} className="">
                      <div className="absolute z-10 p-2 font-bold text-black bg-yellow-400 left-64 w-fit rounded-xl">
                        {movie.imdb}
                      </div>
                    </Link>

                    <div className="relative w-full h-full ">
                      <Link href={movie.imdbLink} className="">
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
                      </Link>
                    </div>
                  </div>

                  <div className="flex flex-col w-1/2 space-y-4">
                    <div className="flex justify-center ">
                      <h2 className="text-3xl font-bold text-black">
                        {movie.title}
                      </h2>
                    </div>
                    <div>
                      <div className="text-lg text-gray-800">{movie.year}</div>
                    </div>
                    <p className="overflow-y-hidden max-h-min text-gray-400 text-ellipsis ... ">
                      {movie.plot}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
        {movie.link !== "" ? (
          <div className="flex items-center gap-4 ml-4">
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
