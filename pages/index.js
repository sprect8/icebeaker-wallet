import React from 'react';
import ReactDOM from 'react-dom';
import style from './index.module.css';
import App from './App';
import Head from 'next/head'
import { Container } from '@material-ui/core';


export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <App />
    </div>
  );
}

