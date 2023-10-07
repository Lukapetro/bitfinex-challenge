import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Order = [number, number, number];

interface OrderBookState {
  data: Order[];
}

const initialState: OrderBookState = {
  data: [],
};

export const orderBookSlice = createSlice({
  name: "orderBook",
  initialState,
  reducers: {
    updateOrderBook: (state, action: PayloadAction<Order[]>) => {
      const book = action.payload;

      if (Array.isArray(book) && Array.isArray(book[0])) {
        // Snapshot
        state.data = book;
      } else if (Array.isArray(book) && typeof book[0] === "number") {
        // Update
        const [price, count, amount] = book as unknown as Order;

        // Remove the level if it exists
        const newOrderBook = state.data.filter(([_price]) => _price !== price);

        // Insert or update
        if (count > 0) {
          newOrderBook.push([price, count, amount]);
        }

        // Sort by price descending for bids and ascending for asks
        newOrderBook.sort(([p1, , a1], [p2, , a2]) =>
          a1 > 0 ? p2 - p1 : p1 - p2
        );

        state.data = newOrderBook;
      }
    },
    clearOrderBook: () => {
      return initialState;
    },
  },
});

export const { updateOrderBook, clearOrderBook } = orderBookSlice.actions;

export default orderBookSlice.reducer;
