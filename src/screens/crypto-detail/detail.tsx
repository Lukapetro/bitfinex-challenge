import { Spinner } from "@/components";
import { RootStackParamList } from "@/navigation/types";
import { RouteProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { OrderBook } from "./order-book";

type CryptoDetailRouteProp = RouteProp<RootStackParamList, "CryptoDetail">;

type Props = {
  route: CryptoDetailRouteProp;
};

interface TickerData {
  channelId: number;
  bid: number;
  bidSize: number;
  ask: number;
  askSize: number;
  dailyChange: number;
  dailyChangeRelative: number;
  lastPrice: number;
  volume: number;
  high: number;
  low: number;
}

export const CryptoDetail: React.FC<Props> = ({ route }) => {
  const { ticker } = route.params;
  const [tickerData, setTickerData] = useState<TickerData | null>(null);

  useEffect(() => {
    const websocket = new WebSocket("wss://api-pub.bitfinex.com/ws/2");

    websocket.onopen = () => {
      websocket.send(
        JSON.stringify({
          event: "subscribe",
          channel: "ticker",
          symbol: ticker[0],
        })
      );
    };

    websocket.onmessage = (evt) => {
      const data = JSON.parse(evt.data);

      if (Array.isArray(data) && Array.isArray(data[1])) {
        setTickerData({
          channelId: data[0],
          bid: data[1][0],
          bidSize: data[1][1],
          ask: data[1][2],
          askSize: data[1][3],
          dailyChange: data[1][4],
          dailyChangeRelative: data[1][5],
          lastPrice: data[1][6],
          volume: data[1][7],
          high: data[1][8],
          low: data[1][9],
        });
      }
    };

    return () => {
      websocket.close();
    };
  }, []);

  if (!tickerData) return <Spinner />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {tickerData ? (
        <>
          <Text style={styles.header}>DETAILS</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Last Price:</Text>
            <Text style={styles.value}>${tickerData.lastPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Bid:</Text>
            <Text style={styles.value}>${tickerData.bid.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Ask:</Text>
            <Text style={styles.value}>${tickerData.ask.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Daily Change:</Text>
            <Text style={styles.value}>
              {tickerData.dailyChange.toFixed(2)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Daily Change Relative:</Text>
            <Text style={styles.value}>
              {(tickerData.dailyChangeRelative * 100).toFixed(2)}%
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Volume:</Text>
            <Text style={styles.value}>{tickerData.volume.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>High:</Text>
            <Text style={styles.value}>${tickerData.high.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Low:</Text>
            <Text style={styles.value}>${tickerData.low.toFixed(2)}</Text>
          </View>
          <OrderBook ticker={ticker[0]} />
        </>
      ) : (
        <Text style={styles.loading}>Loading...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 14,
    color: "#555",
  },
  value: {
    fontSize: 14,
    color: "#333",
  },
  loading: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});
