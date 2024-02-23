"use client";

import Link from "next/link";
import Image from 'next/image'

import favicon from "@/assets/tomaketinylon_logo.jpg"

const Navbar = () => {
  const userId = 1
  return (
    <header className="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-white text-sm py-4 dark:bg-gray-800">
      <nav
        aria-label="Global"
        className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between"
      >
        <div className="flex items-center justify-between">
        <Image alt="" className="pr-1" height={40} src={favicon}/>
        <Link className=" text-xl font-semibold dark:text-white" href="/">
          Verbose Octo Cat
        </Link></div>
        <div className="flex flex-row items-center gap-5 mt-5 sm:justify-end sm:mt-0 sm:ps-5">
          {/* <a
            className="font-medium text-blue-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            href="#"
            aria-current="page"
          >
            Landing
          </a> */}
          <Link
            className="font-medium text-gray-600 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            href="/events"
          >
            Events
          </Link>
          <Link
            className="font-medium text-gray-600 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            href={`users/${userId}`}
          >
            Availabilities
          </Link>
          <a
            className="font-medium text-gray-600 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            href="#"
          >
            Blog
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
