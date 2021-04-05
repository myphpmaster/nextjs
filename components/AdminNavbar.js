/*  ./components/NavbarLeft.js     */
import Link from 'next/link';
import { Transition } from '@headlessui/react'
import { signIn, signOut, useSession } from 'next-auth/client'
import React, { useState } from "react";

export const Navbar = () => {

    const menus = [
       {
          "id":"menu-home",
          "title":"Home",
          "url":"/"
       },
       {
          "id":"menu-overview",
          "title":"Overview",
          "url":"/#overview"
        },
       {
          "id":"menu-result",
          "title":"Sample",
          "url":"/#result"
        },
        {
          "id":"menu-code",
          "title":"Source Code",
          "url":"https://github.com/myphpmaster/sufian.cloud",
          "target": "_blank"
        },
        {
          "id":"menu-sponsor",
          "title":"Sponsors",
          "url":"/#sponsor"
        }
    ];
        
    const [ session, loading ] = useSession()  

    const [isOpen, setIsOpen] = useState({
        a: false,   // mobile menu - refer to button name attribute
        b: false,   // user menu
        c: false    // notification
      });
    
      const handleClick = (e) => {
          setIsOpen(isOpen => ({
            ...isOpen,
            [e.target.name]: !isOpen[e.target.name]
          })
        );
      };
    

  return (
    <>

        <nav id="header" className="bg-white fixed w-full z-10 top-0 shadow">
            <div className="w-full container mx-auto flex flex-wrap items-center mt-0 pt-3 pb-3 md:pb-0">

                <div className="w-1/2 pl-3">
                    <a className="text-gray-900 text-base xl:text-xl no-underline hover:no-underline font-bold" href="/admin">
                        <i className="fas fa-cloud text-pink-600 pr-3"></i>Dashboard
                    </a>
                </div>
                <div className="w-1/2 pr-0">
                    <div className="flex relative inline-block float-right">
                        <div className={`nojs-show ${(!session && loading) ? 'loading' : 'loaded'} relative text-sm`}>
                            <noscript>
                                <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
                            </noscript>
                            {!session && <>
                                    <span className="notSignedInText">You are not signed in</span>
                                    <a
                                        href={`/api/auth/signin`}
                                        className="buttonPrimary"
                                        onClick={(e) => {
                                        e.preventDefault()
                                        signIn()
                                        }}
                                    >
                                        Sign in
                                    </a>
                            </>}
                            {session && <>
                            <button onClick={handleClick} name="b" id="userButton" className="flex items-center focus:outline-none mr-3">
                                {session.user.image && <img className="w-8 h-8 rounded-full mr-4" src={session.user.image} alt="Avatar of User" />}
                                <span className="hidden md:inline-block">Hi, {session.user.email || session.user.name} </span>
                                <svg className="pl-2 h-2" version="1.1" xmlnsXlink="https://www.w3.org/2000/svg" viewBox="0 0 129 129" xlinkHref="https://www.w3.org/1999/xlink" enableBackground="new 0 0 129 129">
                                    <g>
                                        <path d="m121.3,34.6c-1.6-1.6-4.2-1.6-5.8,0l-51,51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,4.2 0,5.8l53.9,53.9c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2 0.1-5.8z" />
                                    </g>
                                </svg>
                            </button>
                            <div id="userMenu" className={`${ (isOpen.b) ? '' : 'invisible' } bg-white rounded shadow-md mt-2 absolute mt-12 top-0 right-0 min-w-full overflow-auto z-30`}>
                                <ul className="list-reset">
                                    <li><a href="/" className="px-4 py-2 block text-gray-900 hover:bg-gray-400 no-underline hover:no-underline">Frontend</a></li>
                                    <li>
                                        <hr className="border-t mx-2 border-gray-400" />
                                    </li>
                                    <li>
                                        <a
                                            href={`/api/auth/signout`}
                                            className="px-4 py-2 block text-gray-900 hover:bg-gray-400 no-underline hover:no-underline"
                                            onClick={(e) => {
                                            e.preventDefault()
                                            signOut()
                                            }}
                                        >
                                            Sign out
                                        </a>                                    
                                    </li>
                                </ul>
                            </div>
                            </>}
                        </div>

                        <div className="block lg:hidden pr-4">
                            <button onClick={handleClick} name="a" id="nav-toggle" className="flex items-center px-3 py-2 border rounded text-gray-500 border-gray-600 hover:text-gray-900 hover:border-teal-500 appearance-none focus:outline-none">
                                <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlnsXlink="https://www.w3.org/2000/svg">
                                    <title>Menu</title>
                                    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                </div>


                <div className={`${ (isOpen.a) ? '' : 'hidden' } w-full px-2 flex-grow lg:flex lg:items-center lg:w-auto hidden lg:block mt-2 lg:mt-0 bg-white z-20`} id="nav-content">
                    <ul className="list-reset lg:flex flex-1 items-center px-4 md:px-0">
                        <li className="mr-6 my-2 md:my-0">
                            <a href="/" className="block py-1 md:py-3 pl-1 align-middle text-pink-600 no-underline hover:text-gray-900 border-b-2 border-orange-600 hover:border-orange-600">
                                <i className="fas fa-home fa-fw mr-3 text-pink-600"></i><span className="pb-1 md:pb-0 text-sm">Home</span>
                            </a>
                        </li>
                        <li className="mr-6 my-2 md:my-0">
                            <a target="_blank" href="https://portal.azure.com" className="block py-1 md:py-3 pl-1 align-middle text-gray-500 no-underline hover:text-gray-900 border-b-2 border-white hover:border-pink-500">
                                <i className="fas fa-server fa-fw mr-3"></i><span className="pb-1 md:pb-0 text-sm">Server Monitoring</span>
                            </a>
                        </li>
                        <li className="mr-6 my-2 md:my-0">
                            <a target="_blank" href="https://captain.app.sufian.cloud/" className="block py-1 md:py-3 pl-1 align-middle text-gray-500 no-underline hover:text-gray-900 border-b-2 border-white hover:border-purple-500">
                                <i className="fa fa-feather fa-fw mr-3"></i><span className="pb-1 md:pb-0 text-sm">Caprover Dashboard</span>
                            </a>
                        </li>
                        <li className="mr-6 my-2 md:my-0">
                            <a target="_blank" href="https://survey.app.sufian.cloud/" className="block py-1 md:py-3 pl-1 align-middle text-gray-500 no-underline hover:text-gray-900 border-b-2 border-white hover:border-green-500">
                                <i className="fas fa-id-card fa-fw mr-3"></i><span className="pb-1 md:pb-0 text-sm">Form Dashboard</span>
                            </a>
                        </li>
                        <li className="mr-6 my-2 md:my-0">
                            <a target="_blank" href="https://github.com/myphpmaster/sufian.cloud" className="block py-1 md:py-3 pl-1 align-middle text-gray-500 no-underline hover:text-gray-900 border-b-2 border-white hover:border-red-500">
                                <i className="fa fa-code fa-fw mr-3"></i><span className="pb-1 md:pb-0 text-sm">Github Code</span>
                            </a>
                        </li>
                    </ul>

                    <div className="relative pull-right pl-4 pr-4 md:pr-0">
                        <input type="search" placeholder="Search" className="w-full bg-gray-100 text-sm text-gray-800 transition border focus:outline-none focus:border-gray-700 rounded py-1 px-2 pl-10 appearance-none leading-normal" />
                        <div className="absolute search-icon" style={{top: '0.375rem', left: '1.75rem'}}>
                            <svg className="fill-current pointer-events-none text-gray-800 w-4 h-4" xmlnsXlink="https://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                            </svg>
                        </div>
                    </div>

                </div>

            </div>
        </nav>

    </>
  );
};
