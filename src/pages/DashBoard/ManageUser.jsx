import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const ManageUsers = () => {
  const [search, setSearch] = useState("");

  const {
    data: users = [],
    refetch,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users", search],
    queryFn: async () => {
      // Replace with your actual backend URL (http://localhost:3000 or deployed URL)
      const backendUrl = "http://localhost:3000";

      const res = await fetch(
        `${backendUrl}/users?search=${encodeURIComponent(search)}`
      );
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
    // Optionally add debounce or delay on search for better UX (not included here)
  });

  const handleMakeAdmin = async (id) => {
    try {
      const backendUrl = "http://localhost:3000";
      const res = await fetch(`${backendUrl}/users/admin/${id}`, {
        method: "PATCH",
      });
      if (res.ok) {
        alert("User promoted to Admin!");
        refetch(); // Refresh the user list after update
      } else {
        alert("Failed to promote user.");
      }
    } catch (err) {
      alert("Error while promoting user.");
      console.error(err);
    }
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

      {isLoading && <p>Loading users...</p>}

      {isError && (
        <p className="text-red-500">
          Error fetching users: {error?.message || "Unknown error"}
        </p>
      )}

      {!isLoading && !isError && (
        <>
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
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center p-4 text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="border-t">
                      <td className="p-4">{user.username}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4 text-center">
                        {user.subscription || "Free"}
                      </td>
                      <td className="p-4 text-center">
                        {user.role === "admin" ? (
                          <span className="text-green-600 font-semibold">Admin</span>
                        ) : (
                          <button
                            onClick={() => handleMakeAdmin(user._id)}
                            className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition"
                          >
                            Make Admin
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="block sm:hidden space-y-4">
            {users.length === 0 ? (
              <p className="text-center text-gray-500">No users found</p>
            ) : (
              users.map((user) => (
                <div key={user._id} className="border rounded-lg p-4 shadow">
                  <h3 className="font-semibold text-lg">{user.username}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500 mb-2">
                    Subscription: {user.subscription || "Free"}
                  </p>
                  {user.role === "admin" ? (
                    <span className="text-green-600 font-semibold">Admin</span>
                  ) : (
                    <button
                      onClick={() => handleMakeAdmin(user._id)}
                      className="bg-blue-500 text-white w-full py-2 rounded-md hover:bg-blue-700"
                    >
                      Make Admin
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageUsers;
