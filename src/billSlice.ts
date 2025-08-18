import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BillState {
  friends: Friend[];
  selectedFriend: Friend | null;
}

const initialState: BillState = {
  friends: [
    {
      id: 1,
      name: "friend1",
      image: "https://i.pravatar.cc/48?u=1",
      balance: 0,
    },
    {
      id: 2,
      name: "friend2",
      image: "https://i.pravatar.cc/48?u=2",
      balance: 0,
    },
    {
      id: 3,
      name: "Charlie",
      image: "https://i.pravatar.cc/48?u=3",
      balance: 0,
    },
  ],
  selectedFriend: null,
};

const billSlice = createSlice({
  name: "bill",
  initialState,
  reducers: {
    addFriend: (state, action: PayloadAction<Friend>) => {
      state.friends.push(action.payload);
    },
    selectFriend: (state, action: PayloadAction<Friend>) => {
      state.selectedFriend =
        state.selectedFriend?.id === action.payload.id ? null : action.payload;
    },
    updateBalance: (
      state,
      action: PayloadAction<{ id: number; value: number }>
    ) => {
      const friend = state.friends.find((f) => f.id === action.payload.id);
      if (friend) friend.balance += action.payload.value;
      state.selectedFriend = null;
    },
  },
});

export const { addFriend, selectFriend, updateBalance } = billSlice.actions;
export default billSlice.reducer;
export type Friend = {
  id: number;
  name: string;
  image: string;
  balance: number;
};
