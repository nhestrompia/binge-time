import React from "react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "./ui/button"

interface MovieData {
  title: string
  link?: string
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
        <h1 className="text-xl font-bold leading-tight tracking-tighter">
          {movie.title}
        </h1>
        {/* <Image
        src={"/netflix.svg"}
        height={24}
        width={24}
        className="cursor-pointer hover:text-"
        alt="netflix logo"
      /> */}
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
