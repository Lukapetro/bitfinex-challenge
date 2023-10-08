import { useOrderBook } from "@/hooks/use-order-book";

import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

type Order = [number, number, number];

export type Precision = "P0" | "P1" | "P2" | "P3" | "P4";

interface OrderBookProps {
  ticker: string;
}

const RenderItemBid: React.FC<{ item: Order }> = React.memo(({ item }) => {
  return (
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
});

const RenderItemAsk: React.FC<{ item: Order }> = React.memo(({ item }) => {
  return (
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
});

export const OrderBook: React.FC<OrderBookProps> = ({ ticker }) => {
  const [precision, setPrecision] = useState<Precision>("P0");

  const { orderBook, isConnected, toggleConnection } = useOrderBook(
    ticker,
    precision
  );

  const bids = useMemo(() => {
    return orderBook.filter(([, , amount]) => amount >= 0).slice(0, 10);
  }, [orderBook]);

  const asks = useMemo(() => {
    return orderBook.filter(([, , amount]) => amount < 0).slice(0, 10);
  }, [orderBook]);

  const increasePrecision = () => {
    const nextPrecision = parseInt(precision[1]) + 1;
    if (nextPrecision <= 4) {
      setPrecision(`P${nextPrecision}` as Precision);
    }
  };

  const decreasePrecision = () => {
    const nextPrecision = parseInt(precision[1]) - 1;
    if (nextPrecision >= 0) {
      setPrecision(`P${nextPrecision}` as Precision);
    }
  };

  const getPrecisionLevel = (precisionString: string) => {
    if (
      typeof precisionString === "string" &&
      !isNaN(Number(precisionString[1]))
    ) {
      return parseInt(precisionString[1]);
    }
    return null;
  };

  const isPrecisionIncrementDisabled = useMemo(() => {
    const precisionLevel = getPrecisionLevel(precision);
    return precisionLevel === null || precisionLevel === 4;
  }, [precision]);

  const isPrecisionDecrementDisabled = useMemo(() => {
    const precisionLevel = getPrecisionLevel(precision);
    return precisionLevel === null || precisionLevel === 0;
  }, [precision]);

  const handleToggleConnection = useCallback(() => {
    toggleConnection();
    setPrecision("P0" as Precision);
  }, [toggleConnection]);

  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>ORDER BOOK</Text>
        {isConnected && (
          <View style={styles.precisionControl}>
            <TouchableOpacity
              style={[styles.precisionButton]}
              onPress={decreasePrecision}
              disabled={isPrecisionDecrementDisabled}
            >
              <Text style={styles.precisionButtonText}>-</Text>
            </TouchableOpacity>
            <Text>{precision}</Text>
            <TouchableOpacity
              style={[styles.precisionButton]}
              onPress={increasePrecision}
              disabled={isPrecisionIncrementDisabled}
            >
              <Text style={styles.precisionButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={handleToggleConnection}
        >
          <Text style={styles.buttonText}>
            {isConnected ? "Disconnect" : "Connect"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        {orderBook.length === 0 ? (
          <Text style={styles.noDataMessage}>
            Please connect to view order book data.
          </Text>
        ) : (
          <>
            <View style={styles.column}>
              {bids.map((bid) => (
                <RenderItemBid key={bid[0].toString()} item={bid} />
              ))}
            </View>
            <View style={styles.column}>
              {asks.map((ask) => (
                <RenderItemAsk key={ask[0].toString()} item={ask} />
              ))}
            </View>
          </>
        )}
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
  precisionControl: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  precisionButton: {
    width: 30,
    height: 30,
    borderRadius: 30,
    marginHorizontal: 8,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTextDisabled: {
    color: "#dddddd",
  },
  precisionButtonDisabled: {
    opacity: 0.5,
  },
  precisionButtonText: {
    fontSize: 14,
    color: "#333",
  },
});
