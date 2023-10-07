import { useGetTickersQuery } from "@/api";
import { Spinner } from "@/components";
import { RootStackParamList } from "@/navigation";
import { formatTradingPair } from "@/utils";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";

export const CryptoList = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { data = [], error, isLoading } = useGetTickersQuery();
  const [page, setPage] = useState(1);

  const handleLoadMore = useCallback(() => {
    setPage((prevPage) => prevPage + 1);
  }, []);

  if (isLoading && page === 1) {
    return <Spinner />;
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error.toString()}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>NAME</Text>
        <Text style={styles.headerText}>LAST</Text>
        <Text style={styles.headerText}>24H</Text>
      </View>
      <FlatList
        data={data.slice(0, page * 10)}
        keyExtractor={(item) => item[0]}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() =>
              navigation.navigate("CryptoDetail", { ticker: item })
            }
          >
            <Text style={styles.itemText}>{formatTradingPair(item[0])}</Text>
            <Text style={styles.itemText}>${item[7]}</Text>
            <Text
              style={[
                styles.itemText,
                item[6] > 0 ? styles.positive : styles.negative,
              ]}
            >
              {item[6].toFixed(2)}%
            </Text>
          </TouchableOpacity>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  itemText: {
    fontSize: 14,
  },
  positive: {
    color: "green",
  },
  negative: {
    color: "red",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 8,
  },
  headerText: {
    color: "#666666",
    fontSize: 14,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
  },
});
