import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

interface SpinnerProps {
  size?: number | "small" | "large";
  color?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "large",
  color = "#0000ff",
}) => {
  return (
    <View style={styles.spinnerStyle}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  spinnerStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
