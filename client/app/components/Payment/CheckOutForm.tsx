import { useCreateOrderMutation } from "@/redux/features/order/orderApi";
import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import socketIO from "socket.io-client";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
  setOpen: any;
  data: any;
  user: any;
};

const CheckOutForm: React.FC<Props> = ({ data, user }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  
  const [createOrder, { data: orderData, error }] = useCreateOrderMutation(); 
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);
    
    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (stripeError) {
      setMessage(stripeError.message || "An unexpected error occurred.");
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setIsLoading(false);
      await createOrder({ courseId: data._id, payment_info: paymentIntent });
    }
  };

  useEffect(() => {
    if (orderData) {
        socketId.emit("notification", {
        title: "New Order",
        message: `You have a new order from ${data.name}`,
        userId: user._id,
      });
      router.push(`/course-access/${data._id}`); 
    }
    
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      } else {
        toast.error("An error occurred while creating the order.");
      }
    }
  }, [orderData, error, data._id, router]);

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-sm">
      <div className="space-y-4">
        <LinkAuthenticationElement id="link-authentication-element" />
        <PaymentElement id="payment-element" />
      </div>

      {/* Styled Modern Button */}
      <button 
        disabled={isLoading || !stripe || !elements} 
        id="submit"
        className={`w-full mt-6 py-3 px-4 rounded-md text-white font-medium text-sm transition-all duration-200 ease-in-out
          ${isLoading || !stripe || !elements 
            ? "bg-gray-400 cursor-not-allowed" 
            : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-sm shadow-blue-200"
          }`}
      >
        <span id="button-text">
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              {/* Simple inline loading spinner */}
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            `Pay $${data?.price || ""} Now`
          )}
        </span>
      </button>
      
      {/* Enhanced Error Message Display */}
      {message && (
        <div id="payment-message" className="text-red-500 text-sm font-medium pt-3 text-center">
          {message}
        </div>
      )}
    </form>
  );
};

export default CheckOutForm;