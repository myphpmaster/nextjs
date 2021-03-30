import { Navbar } from '../components/Navbar';
import React from 'react';
import Head from 'next/head';

export default function Layout({ children }) {
  
  return (
    <>
      <style jsx global>
        {`
        // Add CSSstyle here
        `}
      </style>
      <Head />
      <main>{children}</main>
    </>
  );
};