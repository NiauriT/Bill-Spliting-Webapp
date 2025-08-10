import { useSelector } from "react-redux";
import { useMemo } from "react";

export function useTotalBalance() {
  const friends = useSelector((state) => state.bill.friends);

  // useMemo to avoid recalculating if friends haven't changed
  return useMemo(() => {
    return friends.reduce((total, friend) => total + friend.balance, 0);
  }, [friends]);
}
