import { Ticker } from "@/api";

export type RootStackParamList = {
  CryptoList: undefined;
  CryptoDetail: { ticker: Ticker };
};
