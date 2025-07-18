import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../provider/AuthProvider";

const PaymentHistory = () => {
  const { user } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetch(`https://your-server.com/payments?email=${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          setPayments(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user?.email]);

  if (loading) {
    return <div className="text-center py-10 font-semibold text-lg">Loading Payment History...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-semibold text-center mb-6">My Payment History</h2>

      {payments.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p className="text-lg">No payment history found yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
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
                  <td className="p-3 border">${payment.amount}</td>
                  <td className="p-3 border">{payment.transactionId}</td>
                  <td className="p-3 border">{new Date(payment.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
