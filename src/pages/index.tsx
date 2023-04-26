import Head from 'next/head';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import { ChangeEvent, DOMElement, useEffect, useState } from 'react';
import FetchAPI from './API_Proxy';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import useHomePage from '@hooks/useHomePage';
import { TimeSeriesResponse } from '@hooks/useHomePage';
const inter = Inter({ subsets: ['latin'] });

type UseHomePage = {
    handleSearchInput: (e: any) => void;
    options: Highcharts.Options;
    handleSymbolSelect: (e: any) => void;
    symbols: TimeSeriesResponse[];
};

export default function Home() {
    const { handleSearchInput, handleSymbolSelect, options, symbols }: UseHomePage = useHomePage();

    // TODO: throttling vs debouncing - which to use here and why?
    // TODO: how to limit requests by using the cache? it should refresh daily - look up TTL - can this be set to midnight?

    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <input type="text" placeholder="Search symbol here..." onChange={handleSearchInput} />
                <select onChange={handleSymbolSelect}>
                    {symbols.map((sym) => (
                        <option value={sym['1. symbol']} key={sym['1. symbol']}>
                            {sym['2. name']}
                        </option>
                    ))}
                </select>
                <HighchartsReact highcharts={Highcharts} options={options} />
            </main>
        </>
    );
}

/*documentation sites to keep in mind:
https://rapidapi.com/alphavantage/api/alpha-vantage
https://www.alphavantage.co/documentation/
https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/demo/basic-line/ - Highcharts stock example
https://www.highcharts.com/docs/getting-started/your-first-chart - highcharts docs getting started
https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/usdeur.json - example of how data should look for chart implementation
https://www.highcharts.com/demo/line-time-series - timeseries example chart in JS
https://github.com/highcharts/highcharts-react#highcharts-with-nextjs - github documentation of highcharts with nextjs
*/
