import { decrement, increment } from "@/redux/my-slice";
import { RootState } from "@/redux/store";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";

export const Landing = () => {
  const count = useSelector((state: RootState) => state.my.value);
  const dispatch = useDispatch();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity
        onPress={() => dispatch(increment())}
        style={{ marginBottom: 20, padding: 10, backgroundColor: "skyblue" }}
      >
        <Text>Increment</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => dispatch(decrement())}
        style={{ marginBottom: 20, padding: 10, backgroundColor: "salmon" }}
      >
        <Text>Decrement</Text>
      </TouchableOpacity>

      <Text>Count: {count}</Text>
    </View>
  );
};
