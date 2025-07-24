import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useContext, useState } from "react";
import { useParams } from "react-router";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { secureFetch } from "../../Hook/api";
import AuthContext from "../../provider/AuthContext";


const packageDetails = {
  Silver: { price: 1900, displayPrice: "$19", badge: "Silver" },
  Gold: { price: 3900, displayPrice: "$39", badge: "Gold" },
  Platinum: { price: 5900, displayPrice: "$59", badge: "Platinum" },
};

const fetchUserData = async (email) => {
  const res = await secureFetch(`http://localhost:3000/users/${email}`);
  if (res.status !== 200) {
    throw new Error("Failed to fetch user data");
  }
  return res.data;
};

const CheckoutPage = () => {
  const { user } = useContext(AuthContext);
  const { packageName } = useParams();
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);

  const selectedPackage = packageDetails[packageName];

  // Use React Query to fetch user data
  const {
    data: dbUser,
    error: fetchError,
    isLoading: isFetchingUser,
  } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: () => fetchUserData(user.email),
    enabled: !!user?.email,
    retry: false,
  });

  if (!selectedPackage) {
    return (
      <div className="max-w-xl mx-auto my-10">
        <h2 className="text-3xl font-bold mb-6">Invalid Package</h2>
        <p>Please select a valid package.</p>
      </div>
    );
  }

  if (isFetchingUser) {
    return (
      <div className="max-w-xl mx-auto my-10 text-center font-semibold">
        Loading user data...
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="max-w-xl mx-auto my-10 text-red-600 text-center">
        <p>Error loading user data: {fetchError.message || "Unknown error"}</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      Swal.fire("Stripe not loaded", "Please try again later", "error");
      return;
    }

    setLoading(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card information is incomplete");

      const { error: tokenError, token } = await stripe.createToken(cardElement);
      if (tokenError) throw new Error(tokenError.message);

      const paymentData = {
        email: user.email,
        package: packageName,
        badge: selectedPackage.badge,
        price: selectedPackage.displayPrice,
        stripeToken: token.id,
      };

      console.log("Payment data to send:", paymentData);

      const saveRes = await fetch("http://localhost:3000/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });

      if (saveRes.status !== 200) {
        throw new Error(saveRes.data?.message || "Failed to save payment info");
      }

      Swal.fire({
        icon: "success",
        title: "Payment Successful!",
        text: `You are now a ${selectedPackage.badge} member`,
        confirmButtonColor: "#810000",
      });
    } catch (error) {
      console.error(error);
      Swal.fire("Payment Failed", error.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-10">
      <h2 className="text-3xl font-bold mb-6">{packageName} Package Checkout</h2>
      <p className="mb-4">Price: {selectedPackage.displayPrice}</p>

      {dbUser && (
        <div className="mb-4">
          <p>User Name: {dbUser.name || "N/A"}</p>
          <p>User Email: {dbUser.email}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <CardElement className="border p-4 rounded-md" />
        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full bg-red-800 text-white py-3 rounded-lg hover:bg-red-900 transition"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
