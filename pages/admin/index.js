/*  ./pages/admin/[...route].js     */
import React, { Component, useState, useEffect } from 'react'
import { signIn, signOut, useSession } from 'next-auth/client'
import { useRouter } from "next/router";
import useSWR, { useSWRInfinite } from "swr";
import Head from 'next/head'
import Link from 'next/link';
import Login from '../../components/admin/login';

import { Navbar } from '../../components/admin/navbar';
import { RespondData } from '../../components/admin/respondData';
import { Table } from '../../components/admin/latestSubmission';
import { Footer } from '../../components/admin/footer';

const { MONGODB_SERVER } = process.env

export default function Admin() {

	const [ session, loading ] = useSession()
	const [ content , setContent ] = useState()
  
	const router = useRouter();
	const slug = router.query.slug

    const fetcher = url => fetch(url).then(res => res.json());
    const { data: schem, error } = useSWR(() => '/api/label/', fetcher)
    const schems = schem ? [].concat(...schem) : [];
	const menus = [	
		{
			"id":"entry",
			"title":"Latest Entry",
			"url":"/admin/entry",
			"class": 'bg-red-100 w-full mr-2 mb-2 md:mb-0 hover:bg-red-50',
			"classActive": 'bg-red-200'
		}
	];

    for (let i = 0; i < schems.length; i++) {
        if(schems[i].type == 'panel') {
			menus.push(
				{
					"id": schems[i].key,
					"title": schems[i].title,
					"url":"/admin/" + schems[i].key,
				}
			)
        }
    }
	
	// Fetch content from protected route
	useEffect(()=>{
	  	const fetchData = async () => {
			const res = await fetch('/api/account/protected')
			const json = await res.json()
			if (json.content) { setContent(json.content) }
		}
	  fetchData()
	},[session])
  
	// When rendering client side don't display anything until loading is complete
	if (typeof window !== 'undefined' && loading) return null
  
	// If no session exists, display access denied message
	if (!session) { return (<Login />)}
  
  return (
    <>
		<Head>
			<title>IEQ POE Online System - Administrator</title>
			<link rel="icon" href="/favicon.ico" />		
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossOrigin="anonymous" />
		</Head>

		<Navbar />
		
		<div className="container w-full mx-auto pt-20">
			<div className="w-full px-4 md:px-0 md:mt-8 mb-16 text-gray-800 leading-normal">

				<RespondData />

				<hr className="border-b-2 border-gray-400 my-8 mx-4" />

                <div className="text-center font-black text-2xl min-h-full py-12">
                    Welcome to POE IEQ Dashboard
                </div>
					

				<div className="container w-full pb-5 text-2xl font-bold text-center text-black">					
					<nav className="relative z-0 rounded-md -space-x-px" aria-label="Pagination">

					{ menus.map( (menu, index) => ( 
						<Link key={index} href={menu.url}>
							<a id={menu.id}
								className={`${ menu.id==slug ? ( menu.classActive ? menu.classActive : 'bg-blue-100') : 'bg-gray-50' }
								 ${ menu.class ? menu.class : 'hover:bg-blue-50 w-1/3' } inline-block md:w-auto items-center px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700`}>
								 
								{menu.title}
							</a>
						</Link>
					))}
					
					</nav>
				</div>            
				

			</div>
    	</div>
		<Footer />

    </>
  )
}
  