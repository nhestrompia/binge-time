/* eslint-disable react/display-name */

import React, { MutableRefObject, useEffect, useState } from "react"
import { COUNTRIES } from "@/utils/countries"
import { AnimatePresence, motion } from "framer-motion"

type SelectMenuOption = (typeof COUNTRIES)[number]

export const CountrySelector = React.forwardRef<
  HTMLDivElement,
  {
    id: string
    isOpen: boolean
    onToggle: () => void
    onChange: (value: SelectMenuOption["value"]) => void
    selectedValue: SelectMenuOption
  }
>((props, ref) => {
  useEffect(() => {
    const mutableRef = ref as MutableRefObject<HTMLDivElement | null>

    const handleClickOutside = (event) => {
      if (
        mutableRef.current &&
        !mutableRef.current.contains(event.target) &&
        props.isOpen
      ) {
        props.onToggle()
        setQuery("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref])

  const [query, setQuery] = useState("")

  return (
    <div ref={ref}>
      <div className="relative mt-1">
        <button
          type="button"
          className="relative w-full py-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-md shadow-sm cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          aria-haspopup="listbox"
          aria-expanded="true"
          aria-labelledby="listbox-label"
          onClick={props.onToggle}
        >
          <span className="flex items-center text-black truncate">
            {/* <img
              alt={`${props.selectedValue.value}`}
              src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${props.selectedValue.value}.svg`}
              className={"inline mr-2 h-4 rounded-sm"}
            /> */}
            {props.selectedValue.title}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </button>

        <AnimatePresence>
          {props.isOpen && (
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="absolute z-10 w-full mt-1 text-base bg-white rounded-md shadow-lg max-h-80 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              tabIndex={-1}
              role="listbox"
              aria-labelledby="listbox-label"
              aria-activedescendant="listbox-option-3"
            >
              <div className="sticky top-0 z-10 bg-white">
                <li className="relative px-3 py-2 text-gray-900 cursor-default select-none ">
                  <input
                    type="search"
                    name="search"
                    autoComplete={"off"}
                    className="block w-full border-gray-300 rounded-md focus:outline-none focus:border-blue-500 dark:bg-white sm:text-sm"
                    placeholder={"Select your country"}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </li>
                <hr />
              </div>

              <div
                className={
                  "max-h-64  scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-600 scrollbar-thumb-rounded scrollbar-thin overflow-y-scroll"
                }
              >
                {COUNTRIES.filter((country) =>
                  country.title.toLowerCase().startsWith(query.toLowerCase())
                ).length === 0 ? (
                  <li className="relative py-2 pl-3 text-gray-900 cursor-default select-none pr-9">
                    No countries found
                  </li>
                ) : (
                  COUNTRIES.filter((country) =>
                    country.title.toLowerCase().startsWith(query.toLowerCase())
                  ).map((value, index) => {
                    return (
                      <li
                        key={`${props.id}-${index}`}
                        className="relative flex items-center py-2 pl-3 text-gray-900 transition cursor-default select-none pr-9 hover:bg-gray-50"
                        id="listbox-option-0"
                        role="option"
                        onClick={() => {
                          props.onChange(value.value)
                          setQuery("")
                          props.onToggle()
                        }}
                      >
                        <span className="font-normal truncate">
                          {value.title}
                        </span>
                        {value.value === props.selectedValue.value ? (
                          <span className="absolute inset-y-0 right-0 flex items-center pr-8 text-blue-600">
                            <svg
                              className="w-5 h-5"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        ) : null}
                      </li>
                    )
                  })
                )}
              </div>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
})
