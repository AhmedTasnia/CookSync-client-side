import React, { useState, useEffect } from "react";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`https://your-backend-url.com/users?search=${search}`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, [search]);

  const handleMakeAdmin = (id) => {
    fetch(`https://your-backend-url.com/users/admin/${id}`, {
      method: "PATCH",
    })
      .then((res) => res.json())
      .then(() => {
        alert("User promoted to Admin!");
        setSearch(search); // Refresh users
      });
  };

  return (
    <div className="container mx-auto p-4 bg-white rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by username or email..."
        className="w-full mb-4 p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
      />

      <div className="hidden sm:block overflow-x-auto">
        <table className="table-auto w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Username</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-center">Subscription</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-4">{user.username}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4 text-center">{user.subscription || "Free"}</td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleMakeAdmin(user._id)}
                    className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition"
                  >
                    Make Admin
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="block sm:hidden space-y-4">
        {users.map((user) => (
          <div key={user._id} className="border rounded-lg p-4 shadow">
            <h3 className="font-semibold text-lg">{user.username}</h3>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500 mb-2">Subscription: {user.subscription || "Free"}</p>
            <button
              onClick={() => handleMakeAdmin(user._id)}
              className="bg-blue-500 text-white w-full py-2 rounded-md hover:bg-blue-700"
            >
              Make Admin
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;
