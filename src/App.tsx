import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "./store";
import type { Friend } from "./billSlice";
import { addFriend, selectFriend, updateBalance } from "./billSlice";
import { useTotalBalance } from "./useTotalBalance";

type ButtonProps = {
  children: React.ReactNode; // anything renderable in React
  onClick?: () => void;
};

function Button({ children, onClick }: ButtonProps) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

type FriendProps = {
  friend: Friend;
  selectedFriend: Friend | null;
  onSelection: (friend: Friend) => void;
};

function FriendItem({ friend, selectedFriend, onSelection }: FriendProps) {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}₾
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}₾
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

type FriendsListProps = {
  friends: Friend[];
  selectedFriend: Friend | null;
  onSelection: (friend: Friend) => void;
};

function FriendsList({
  friends,
  selectedFriend,
  onSelection,
}: FriendsListProps) {
  return (
    <ul>
      {friends.map((friend) => (
        <FriendItem
          key={friend.id}
          friend={friend}
          selectedFriend={selectedFriend}
          onSelection={onSelection}
        />
      ))}
    </ul>
  );
}

type FormAddFriendProps = {
  onAddFriend: (friend: Friend) => void;
};

function FormAddFriend({ onAddFriend }: FormAddFriendProps) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name || !image) return;

    const id = Math.floor(Math.random() * 1000000); // or any number id
    const newFriend: Friend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👩🏼‍🤝‍👩🏻 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🐱‍🏍 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

type FormSplitBillProps = {
  selectedFriend: Friend;
  onSplitBill: (value: number) => void;
};

function FormSplitBill({ selectedFriend, onSplitBill }: FormSplitBillProps) {
  const [bill, setBill] = useState<number>(0);

  const [paidByUser, setPaidByUser] = useState<number>(0);

  const paidByFriend =
    bill && paidByUser ? Number(bill) - Number(paidByUser) : 0;

  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!bill || !paidByUser) return;

    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label> 💰 Bill value </label>

      <input
        type="number"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label> 🎟 Your expense </label>

      <input
        type="number"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label>👩🏼‍🤝‍👩🏻 {selectedFriend.name}'s expense</label>

      <input type="text" disabled value={paidByFriend} />

      <label>🤑 Who is paying the bill</label>

      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>

        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}

export default function App() {
  const friends = useSelector((state: RootState) => state.bill.friends);
  const selectedFriend = useSelector(
    (state: RootState) => state.bill.selectedFriend
  );
  const dispatch = useDispatch();
  const totalBalance = useTotalBalance();
  const [showAddFriend, setShowAddFriend] = useState(false);
  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(friend: Friend) {
    dispatch(addFriend(friend));
    setShowAddFriend(false);
  }

  function handleSelection(friend: Friend) {
    dispatch(selectFriend(friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value: number) {
    if (!selectedFriend) return; // also ensure selectedFriend is not null
    dispatch(updateBalance({ id: selectedFriend.id, value }));
  }

  return (
    <div className="app">
      <div className="sidebar">
        <h2 className="total-balance">
          {totalBalance > 0
            ? `${totalBalance}₾ owed to you`
            : totalBalance < 0
            ? `You owe ${Math.abs(totalBalance)}₾`
            : "All settled"}
        </h2>
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}
