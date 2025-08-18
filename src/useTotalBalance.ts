import { useSelector } from "react-redux";
import { useMemo } from "react";
import type { RootState } from "./store";
import type { Friend } from "./types";

export function useTotalBalance() {
  const friends = useSelector((state: RootState) => state.bill.friends);

  return useMemo(
    () => friends.reduce((total, friend: Friend) => total + friend.balance, 0),
    [friends]
  );
}
