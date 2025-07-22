import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../provider/AuthProvider";

const fetchPayments = async (email) => {
  const response = await fetch(`http://localhost:3000/payments?email=${email}`);
  if (!response.ok) {
    throw new Error("Failed to fetch payment history");
  }
  return response.json();
};

const PaymentHistory = () => {
  const { user } = useContext(AuthContext);

  const { data: payments = [], isLoading, isError } = useQuery({
    queryKey: ["payments", user?.email],
    enabled: !!user?.email,
    queryFn: () => fetchPayments(user.email),
  });

  if (isLoading) {
    return (
      <div className="text-center py-10 font-semibold text-lg">
        Loading Payment History...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500 font-semibold text-lg">
        Failed to load payment history.
      </div>
    );
  }

  return (
    <div className="max-w-6xl jost-font mx-auto p-4 rounded-lg shadow-lg bg-white">
      <h2 className="text-3xl font-semibold text-center mb-10 mt-6">My Payment History</h2>

      {payments.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p className="text-lg">No payment history found yet.</p>
        </div>
      ) : (
        <>
          {/* Table for md+ screens */}
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border">#</th>
                  <th className="p-3 border">Meal Title</th>
                  <th className="p-3 border">Amount</th>
                  <th className="p-3 border">Transaction ID</th>
                  <th className="p-3 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => (
                  <tr key={payment._id} className="text-center">
                    <td className="p-3 border">{index + 1}</td>
                    <td className="p-3 border">{payment.mealTitle || "N/A"}</td>
                    <td className="p-3 border">{payment.price}</td>
                    <td className="p-3 border">{payment.transactionId}</td>
                    <td className="p-3 border">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Cards for small screens */}
          <div className="md:hidden flex flex-col gap-4">
            {payments.map((payment, index) => (
              <div
                key={payment._id}
                className="border rounded-lg shadow p-4 bg-gray-50"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">#{index + 1}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(payment.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="mb-1">
                  <span className="font-semibold">Meal Title: </span>
                  {payment.mealTitle || "N/A"}
                </div>
                <div className="mb-1">
                  <span className="font-semibold">Amount: </span>
                  {payment.price}
                </div>
                <div className="mb-1">
                  <span className="font-semibold">Transaction ID: </span>
                  {payment.transactionId}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentHistory;
