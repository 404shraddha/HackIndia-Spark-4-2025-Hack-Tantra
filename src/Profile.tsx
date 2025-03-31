import { useState, useEffect } from "react";
import axios from "axios"; // ✅ Axios for API call

// Define the User type
interface User {
  name: string;
  coins: number;
  debatesWon: number;
  debatesLost: number;
}

function Profile() {
  const [user, setUser] = useState<User | null>(null); // ✅ User type
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User>({
    name: "",
    coins: 0,
    debatesWon: 0,
    debatesLost: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const fetchProfile = async () => {
        try {
          const res = await axios.get("http://localhost:5100/user/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
          setFormData(res.data); // Initialize formData with user data
        } catch (error) {
          console.error("Failed to fetch profile:", error);
        }
      };

      fetchProfile();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .put("http://localhost:5100/user/profile", formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data); // Update user data after saving
          setIsEditing(false); // Stop editing after saving
        })
        .catch((error) => {
          console.error("Failed to update profile:", error);
        });
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Coins
              </label>
              <input
                type="number"
                name="coins"
                value={formData.coins}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Debates Won
              </label>
              <input
                type="number"
                name="debatesWon"
                value={formData.debatesWon}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Debates Lost
              </label>
              <input
                type="number"
                name="debatesLost"
                value={formData.debatesLost}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-500 text-white py-2 px-4 rounded-md"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="ml-4 py-2 px-4 border rounded-md bg-gray-300"
            >
              Cancel
            </button>
          </form>
        ) : (
          <div>
            <div className="text-lg font-semibold">{user.name}</div>
            <div className="text-sm text-gray-500">Coins: {user.coins}</div>
            <div className="text-sm text-gray-500">
              🏆 {user.debatesWon} Wins / ❌ {user.debatesLost} Losses
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 bg-emerald-500 text-white py-2 px-4 rounded-md"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
