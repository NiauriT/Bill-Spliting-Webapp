import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  friends: [
    {
      id: 118836,
      name: "friend1",
      image: "https://i.pravatar.cc/48?u=118836",
      balance: 0,
    },
    {
      id: 933372,
      name: "friend2",
      image: "https://i.pravatar.cc/48?u=933372",
      balance: 0,
    },
    {
      id: 499476,
      name: "friend3",
      image: "https://i.pravatar.cc/48?u=499476",
      balance: 0,
    },
  ],
  selectedFriend: null,
};

const billSlice = createSlice({
  name: "bill",
  initialState,
  reducers: {
    addFriend: (state, action) => {
      state.friends.push(action.payload);
    },
    selectFriend: (state, action) => {
      state.selectedFriend =
        state.selectedFriend?.id === action.payload.id ? null : action.payload;
    },
    updateBalance: (state, action) => {
      const { id, value } = action.payload;
      const friend = state.friends.find((f) => f.id === id);
      if (friend) friend.balance += value;
      state.selectedFriend = null;
    },
  },
});

export const { addFriend, selectFriend, updateBalance } = billSlice.actions;
export default billSlice.reducer;
