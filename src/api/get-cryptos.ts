import { api } from "./api";

export type Ticker = [
  symbol: string, // [0]
  bid: number, // [1]
  bidSize: number, // [2]
  ask: number, // [3]
  askSize: number, // [4]
  dailyChange: number, // [5]
  dailyChangeRelative: number, // [6]
  lastPrice: number, // [7]
  volume: number, // [8]
  high: number, // [9]
  low: number // [10]
];

export const cryptoApi = api.injectEndpoints({
  endpoints: (build) => ({
    getTickers: build.query<Ticker[], void>({
      query: () => "tickers?symbols=ALL",
    }),
  }),
  overrideExisting: false,
});

export const { useGetTickersQuery } = cryptoApi;
