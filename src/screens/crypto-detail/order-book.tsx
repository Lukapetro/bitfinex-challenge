import { useOrderBook } from "@/hooks/use-order-book";

import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

type Order = [number, number, number];

interface OrderBookProps {
  ticker: string;
}

export const OrderBook: React.FC<OrderBookProps> = ({ ticker }) => {
  const { orderBook, isConnected, toggleConnection } = useOrderBook(ticker);

  const bids = orderBook.filter(([, , amount]) => amount >= 0).slice(0, 10);
  const asks = orderBook.filter(([, , amount]) => amount < 0).slice(0, 10);

  const renderItemBid = (item: Order) => (
    <View
      key={item[0].toString()}
      style={[
        styles.item,
        { backgroundColor: item[2] > 0 ? "#90ee90" : "#ffcccb" },
      ]}
    >
      <Text style={styles.text}>{Math.abs(item[2]).toFixed(2)}</Text>
      <Text style={styles.text}>{item[0]}</Text>
    </View>
  );

  const renderItemAsk = (item: Order) => (
    <View
      key={item[0].toString()}
      style={[
        styles.item,
        { backgroundColor: item[2] > 0 ? "#90ee90" : "#ffcccb" },
      ]}
    >
      <Text style={styles.text}>{item[0]}</Text>
      <Text style={styles.text}>{Math.abs(item[2]).toFixed(2)}</Text>
    </View>
  );

  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>ORDER BOOK</Text>
        <TouchableOpacity style={styles.button} onPress={toggleConnection}>
          <Text style={styles.buttonText}>
            {isConnected ? "Disconnect" : "Connect"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        {orderBook.length === 0 && (
          <Text style={styles.noDataMessage}>
            Please connect to view order book data.
          </Text>
        )}
        <View style={styles.column}>
          {bids.map((bid) => renderItemBid(bid))}
        </View>
        <View style={styles.column}>
          {asks.map((ask) => renderItemAsk(ask))}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
  },
  header: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 12,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  text: {
    fontSize: 14,
    color: "black",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
  noDataMessage: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
    color: "#555",
  },
});
