import { CryptoDetail, CryptoList } from "@/screens";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { RootStackParamList } from "./types";
import { formatTradingPair } from "@/utils";

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CryptoList">
        <Stack.Screen
          name="CryptoList"
          component={CryptoList}
          options={{
            headerTitle: "Cryptocurrencies",
            headerTitleStyle: {
              fontSize: 16,
            },
            headerStyle: {
              backgroundColor: "white",
            },
          }}
        />
        <Stack.Screen
          name="CryptoDetail"
          component={CryptoDetail}
          options={({ route }) => ({
            title: formatTradingPair(route.params.ticker[0]),
            headerTitleStyle: {
              fontSize: 16,
            },
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
