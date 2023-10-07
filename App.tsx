import { StyleSheet } from "react-native";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import { RootNavigator } from "@/navigation";

export default function App() {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
