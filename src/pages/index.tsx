import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import { ChangeEvent, DOMElement, useEffect, useState } from 'react';
import FetchAPI from './API_Proxy';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
    const [symbolData, setSymbolData] = useState([]);
    const [symbols, setSymbols] = useState([]);
    const [selectedSymbol, setSelectedSymbol] = useState("");

    const handleSearchInput = (e: any) => {
        const searchTerm = e?.target?.value;
        if (searchTerm && searchTerm.length >= 2) {
            const symbolFetch = new FetchAPI(
                `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchTerm}&apikey=${process.env.NEXT_PUBLIC_API_KEY}`,
            );
            symbolFetch.getFetchRequest().then((data) => {
                setSymbols(data.bestMatches);
            });
        }
    };

    const handleSymbolSelect = (e: any): void => {
        const stocksDataFetch = new FetchAPI(
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${e?.target?.value}&apikey=${process.env.NEXT_PUBLIC_API_KEY}`,
        );
        stocksDataFetch.getFetchRequest().then((data) => setSymbolData(data));
        setSelectedSymbol(e?.target?.value)
    };

    function formatDate(date: string): number {
        return new Date(date).getTime();
    }

    const dailyData = symbolData['Time Series (Daily)'] || {}; // {'12/12/1 : {high: 0}}

    const timeSeriesData: number[][] = Object.keys(dailyData).map((dateKey: string) => {
        return [formatDate(dateKey), Number(dailyData[dateKey]['2. high'])];
    });

    console.log(timeSeriesData);

    const options: Highcharts.Options = {
        title: {
            text: `${selectedSymbol}`,
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: 'Daily High',
            },
        },
        series: [
            {
                type: 'area',
                data: timeSeriesData,
            },
        ],
    };

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
