import React, { useState } from "react"
import Image from "next/legacy/image"
import Link from "next/link"
import { motion } from "framer-motion"

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
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    if (e.currentTarget.id === "container" && isOpen) {
      setIsOpen((prevState) => !prevState)
    }
  }

  if (loading) {
    return null
  } else {
    return (
      <motion.div
        layout
        onClick={handleClick}
        transition={{
          layout: { duration: 1, type: "spring" },
          ease: "easeInOut",
        }}
        whileHover={{ opacity: isOpen ? 1 : 0.6 }}
        // whileFocus={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        id="container"
        // whileFocus={{ opacity: 1.2 }}
        className={`${
          isOpen
            ? "z-10 w-screen h-screen  flex items-center fixed inset-0 "
            : ""
        }  `}
      >
        <motion.div
          id="modal"
          transition={{ layout: { duration: 0.5, type: "spring" } }}
          className={`flex p-4  space-x-2 ${
            isOpen
              ? "bg-white  z-10 max-w-[340px] py-2.5 mx-auto md:max-w-xl border md:p-6 border-gray-100 "
              : "bg-transparent"
          }    md:space-x-8  rounded-3xl`}
        >
          <motion.div
            layout="position"
            transition={{ layout: { duration: 1, type: "spring" } }}
            onClick={() => {
              if (!isOpen) {
                setIsOpen(!isOpen)
              }
            }}
            className={`${
              isOpen ? "w-1/2 " : "w-full cursor-pointer rounded-2xl "
            }  relative bottom-5 `}
          >
            {isOpen && (
              <div className="relative p-1.5 md:p-2 font-semibold text-xs md:text-base text-black bg-yellow-400 rounded-full left-28 z-10 top-9 md:left-[200px] md:top-12 w-fit">
                {movie.imdb}
              </div>
            )}

            <div className={`w-full   ${isOpen ? "h-[95%]" : "h-full"}  `}>
              <Image
                className="w-full h-full rounded-2xl dark:filter dark:saturate-[85%] saturate-100 dark:brightness-90 brightness-100"
                src={movie.image ? movie.image : "/movie.jpg"}
                width={390}
                height={560}
                layout="intrinsic"
                alt=""
              />
            </div>
          </motion.div>

          {isOpen && (
            <motion.div
              transition={{ layout: { duration: 1, type: "spring" } }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col w-1/2 space-y-1 md:space-y-4 justify-evenly "
            >
              <div className="relative flex flex-col justify-center gap-2 text-center bottom-1 md:bottom-4 ">
                <h2 className="text-lg font-bold text-black md:text-3xl">
                  {movie.title}
                </h2>
                <div className="text-xs text-gray-800 md:text-lg">
                  {movie.year}
                </div>
              </div>

              <p className="overflow-y-hidden text-[10px] text-center text-gray-400 md:text-base max-h-min ">
                {movie.plot}
              </p>
              <div className="flex items-center justify-center w-full gap-4 mt-auto ">
                {movie.link.includes("netflix") ? (
                  <Link
                    className=" -mt-0.5 md:mt-0  w-4 h-4 md:w-6 md:h-6"
                    target="_blank"
                    href={movie.link}
                  >
                    <Image
                      className=" hover:text-blue-200"
                      src={"/netflix.svg"}
                      width={24}
                      height={24}
                      alt="netflix"
                    />
                  </Link>
                ) : (
                  <Link target="_blank" href={movie.link}>
                    <svg
                      className="w-4 h-4 fill-current md:w-6 md:h-6 hover:text-blue-200"
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
                <Link target="_blank" href={movie.imdbLink}>
                  <svg
                    className="w-4 h-4 md:w-6 md:h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="IMDb"
                    role="img"
                    viewBox="0 0 512 512"
                  >
                    <rect width="512" height="512" rx="15%" fill="#f5c518" />
                    <path d="M104 328V184H64v144zM189 184l-9 67-5-36-5-31h-50v144h34v-95l14 95h25l13-97v97h34V184zM256 328V184h62c15 0 26 11 26 25v94c0 14-11 25-26 25zm47-118l-9-1v94c5 0 9-1 10-3 2-2 2-8 2-18v-56-12l-3-4zM419 220h3c14 0 26 11 26 25v58c0 14-12 25-26 25h-3c-8 0-16-4-21-11l-2 9h-36V184h38v46c5-6 13-10 21-10zm-8 70v-34l-1-11c-1-2-4-3-6-3s-5 1-6 3v57c1 2 4 3 6 3s6-1 6-3l1-12z" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    )
  }
}
