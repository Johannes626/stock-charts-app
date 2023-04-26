import { useState } from 'react';
import FetchAPI from '../pages/API_Proxy';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface TimeSeriesData {
    [date: string]: {
        '1. open': string;
        '2. high': string;
        '3. low': string;
        '4. close': string;
        '5. adjusted close': string;
        '6. volume': string;
        '7. dividend amount': string;
        '8. split coefficient': string;
    };
}

export type TimeSeriesResponse = TimeSeriesData[];

export default function useHomePage() {
    const [symbolData, setSymbolData] = useState([]);
    const [symbols, setSymbols] = useState([]);
    const [selectedSymbol, setSelectedSymbol] = useState('');

    const handleSearchInput = (e: any): void => {
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
        setSelectedSymbol(e?.target?.value);
    };

    function formatDate(date: string): number {
        return new Date(date).getTime();
    }

    const dailyData: TimeSeriesData = symbolData['Time Series (Daily)'] || {};

    const timeSeriesData: number[][] = Object.keys(dailyData).map((dateKey: string) => {
        return [formatDate(dateKey), Number(dailyData[dateKey]['2. high'])];
    });

    console.log(timeSeriesData);

    const options: Highcharts.Options = {
        title: {
            text: `${selectedSymbol}`,
        },
        xAxis: {
            type: 'datetime',
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

    return {
        handleSearchInput,
        handleSymbolSelect,
        options,
        symbols,
    };
}
