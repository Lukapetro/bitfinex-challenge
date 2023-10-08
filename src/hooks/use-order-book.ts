import { RootState, clearOrderBook, updateOrderBook } from "@/redux";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { WS_URL } from "@env";
import { Precision } from "@/screens/crypto-detail/order-book";

export const useOrderBook = (symbol: string, precision: Precision = "P0") => {
  const dispatch = useDispatch();
  const orderBook = useSelector((state: RootState) => state.orderBook.data);

  const [isConnected, setIsConnected] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const connectWs = useCallback(() => {
    if (ws) {
      ws.close();
    }

    const websocket = new WebSocket(WS_URL);

    websocket.onopen = () => {
      const msg = JSON.stringify({
        event: "subscribe",
        channel: "book",
        symbol: symbol,
        prec: precision,
        freq: "F1",
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
  }, [symbol, dispatch]);

  const disconnectWs = useCallback(() => {
    if (ws) {
      ws.close();
      setWs(null);
    }
  }, [ws]);

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
      disconnectWs();
      dispatch(clearOrderBook());
    };
  }, [dispatch, disconnectWs]);

  return { orderBook, isConnected, toggleConnection };
};
