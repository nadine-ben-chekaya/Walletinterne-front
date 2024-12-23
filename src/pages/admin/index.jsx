import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import TransferETH from "../../components/TransferETH"; // Import the TransferETH component

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedPKey, setSelectedPKey] = useState(null); // State for selected pkey
  const router = useRouter();

  useEffect(() => {
    // Retrieve the username from localStorage (set during login)
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    // Fetch user data from backend
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://walletinterne-back.onrender.com/account/list"
        ); // Replace with your backend URL
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    router.push("/auth/login");
  };

  const handleTransferClick = (pkey) => {
    setSelectedPKey(pkey); // Set the selected private key
  };

  return (
    <div>
      <h1>Welcome, Admin {username}!</h1>
      <p>This is your personalized admin dashboard.</p>

      <h2>Users List</h2>
      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%", textAlign: "left" }}
      >
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleTransferClick(user.pkey)}>
                  Transfer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedPKey && (
        <div>
          <h2>Transfer ETH</h2>
          <TransferETH pkey={selectedPKey} />
        </div>
      )}
      <br />
      <br />
      <button class="button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
