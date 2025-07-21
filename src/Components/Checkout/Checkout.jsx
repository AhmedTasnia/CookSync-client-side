import { useQuery } from "@tanstack/react-query";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useContext, useState } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import { useParams } from "react-router";
import Swal from "sweetalert2";

const packageDetails = {
  Silver: { price: 1900, displayPrice: "$19", badge: "Silver" },
  Gold: { price: 3900, displayPrice: "$39", badge: "Gold" },
  Platinum: { price: 5900, displayPrice: "$59", badge: "Platinum" },
};

const CheckoutPage = () => {
  const { user } = useContext(AuthContext);
  const { packageName } = useParams();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const selectedPackage = packageDetails[packageName];

  if (!selectedPackage) {
    return (
      <div className="max-w-xl mx-auto my-10">
        <h2 className="text-3xl font-bold mb-6">Invalid Package</h2>
        <p>Please select a valid package.</p>
      </div>
    );
  }

  const { data: dbUser = {} } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3000/users/${user.email}`);
      return res.json();
    },
    enabled: !!user?.email,
  });

  console.log("DB User:", dbUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: selectedPackage.price }),
      });
      const { clientSecret } = await res.json();

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (error) {
        Swal.fire("Payment Failed", error.message, "error");
        setLoading(false);
        return;
      }

      await fetch(`http://localhost:3000/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          package: packageName,
          badge: selectedPackage.badge,
          price: selectedPackage.displayPrice,
          transactionId: paymentIntent.id,
        }),
      });

      Swal.fire({
        icon: "success",
        title: "Payment Successful!",
        text: `You are now a ${selectedPackage.badge} member`,
        confirmButtonColor: "#810000",
      });
    } catch (error) {
      console.error(error);
      Swal.fire("Something went wrong", "", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-10">
      <h2 className="text-3xl font-bold mb-6">{packageName} Package Checkout</h2>
      <p className="mb-4">Price: {selectedPackage.displayPrice}</p>

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
