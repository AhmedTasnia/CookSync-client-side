import React, { useState, useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { secureFetch } from "../../Hook/api";
import AuthContext from "../../provider/AuthContext";

const ManageUsers = () => {
  const [searchInput, setSearchInput] = useState("");
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search input with 500ms delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput.trim());
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Fetch users based on search term using secureFetch
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users", search],
    enabled: !!user?.email,
    queryFn: async () => {
      try {
        const res = await secureFetch(
          `http://localhost:3000/users?email=${encodeURIComponent(
            user.email
          )}&search=${encodeURIComponent(search)}`
        );
        // axios-like response: data inside res.data
        return res.data;
      } catch {
        throw new Error("Failed to fetch users");
      }
    },
  });

  // Handle promoting user to admin
  const handleMakeAdmin = async (id) => {
    try {
      const res = await secureFetch(`http://localhost:3000/users/admin/${id}`, {
        method: "PATCH",
      });
      if (res.status === 200 || res.status === 204) {
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "User promoted to Admin!",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        let errorMsg = "Could not promote user.";
        if (res.data?.message) {
          errorMsg = res.data.message;
        }
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: errorMsg,
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong.",
      });
    }
  };

  // Component to display subscription badge with colors
  const SubscriptionBadge = ({ badge }) => {
    const badgeType = badge?.toLowerCase() || "free";
    let colorClass = "bg-gray-300 text-gray-700";

    if (badgeType === "bronze") colorClass = "bg-yellow-400 text-yellow-900";
    else if (badgeType === "silver") colorClass = "bg-gray-400 text-white";
    else if (badgeType === "gold") colorClass = "bg-yellow-600 text-white";

    return (
      <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}
      >
        {badge || "Free"}
      </span>
    );
  };

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto p-4 jost-font bg-white rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search by username or email..."
        className="w-full mb-4 p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
      />

      {isLoading && <p>Loading users...</p>}

      {!isLoading && (!users || users.length === 0) && (
        <p className="text-center text-gray-500">No users found</p>
      )}

      {!isLoading && users && users.length > 0 && (
        <>
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="table-auto w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">Username</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-center">Badge</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user._id} className="border-t">
                    <td className="p-4">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4 text-center">
                      <SubscriptionBadge badge={user.badge} />
                    </td>
                    <td className="p-4 text-center">
                      {user.role === "admin" ? (
                        <span className="text-green-600 font-semibold">
                          Admin
                        </span>
                      ) : (
                        <button
                          onClick={() => handleMakeAdmin(user._id)}
                          className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-700 transition"
                        >
                          Make Admin
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="block sm:hidden space-y-4">
            {users.map((user) => (
              <div key={user._id} className="border rounded-lg p-4 shadow">
                <h3 className="font-semibold text-lg">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
                <div className="mb-2">
                  <SubscriptionBadge badge={user.badge} />
                </div>
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
            ))}
          </div>
          <div className="flex justify-center mt-6 gap-2 flex-wrap">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded-full border ${
                  currentPage === index + 1
                    ? "bg-[#810000] text-white"
                    : "bg-white text-[#810000] border-[#810000]"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageUsers;
