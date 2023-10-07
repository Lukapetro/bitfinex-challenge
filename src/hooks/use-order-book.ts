import { RootState, clearOrderBook, updateOrderBook } from "@/redux";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useOrderBook = (symbol: string) => {
  const dispatch = useDispatch();
  const orderBook = useSelector((state: RootState) => state.orderBook.data);

  const [isConnected, setIsConnected] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const connectWs = () => {
    const websocket = new WebSocket("wss://api-pub.bitfinex.com/ws/2");

    websocket.onopen = () => {
      const msg = JSON.stringify({
        event: "subscribe",
        channel: "book",
        symbol: symbol,
        frequency: "F1",
      });
      websocket.send(msg);
    };

    websocket.onmessage = (event: MessageEvent) => {
      const response = JSON.parse(event.data);

      if (Array.isArray(response)) {
        const [, book] = response;
        dispatch(updateOrderBook(book));
      }
    };

    setWs(websocket);
  };

  const disconnectWs = () => {
    ws?.close();
    setWs(null);
  };

  const toggleConnection = () => {
    if (isConnected) {
      disconnectWs();
    } else {
      connectWs();
    }
    setIsConnected(!isConnected);
  };

  useEffect(() => {
    return () => {
      dispatch(clearOrderBook());
      disconnectWs();
    };
  }, []);

  return { orderBook, isConnected, toggleConnection };
};
