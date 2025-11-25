// pages/CheckoutPage.tsx
import React from "react";
import { ArrowLeft, Mail, Phone, Package, CheckCircle } from "lucide-react";
import { useLandingStore } from "../../../store/useLandingStore";

const product = {
  id: 1,
  name: "Premium Wireless Headphones",
  price: 2999,
  quantity: 1,
  image:
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop&crop=center",
};

const deliveryCharge = 99;
const total = product.price * product.quantity + deliveryCharge;

const CheckoutPage = () => {
  const {
    checkoutStep,
    setCheckoutStep,
    showOTP,
    setShowOTP,
    formData,
    setFormData,
  } = useLandingStore();

  /** FIX: preserve existing formData to prevent losing focus */
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const goBack = () => {
    window.history.back();
  };

  const goToPreviousStep = () => {
    const order = ["auth", "contact", "review", "confirmation"];
    const idx = order.indexOf(checkoutStep);
    if (idx > 0) setCheckoutStep(order[idx - 1]);
  };

  /** --- Steps --- **/
  const AuthStep = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Email */}
      <input
        type="email"
        value={formData.email}
        onChange={(e) => handleInputChange("email", e.target.value)}
        placeholder="Enter your email"
        className="glass-transparent-gradient border border-neutral-700/50 rounded-2xl p-3 mt-5 outline-0 w-full text-white placeholder-neutral-500"
      />

      {/* OTP flow */}
      {showOTP ? (
        <>
          <input
            type="text"
            value={formData.otp || ""}
            onChange={(e) => handleInputChange("otp", e.target.value)}
            placeholder="Enter OTP"
            className="glass-transparent-gradient border border-neutral-700/30 rounded-2xl p-3 mt-5 outline-0 w-full text-white placeholder-neutral-500"
          />

          <button
            onClick={() => setCheckoutStep("contact")}
            disabled={!formData.otp}
            className="w-full bg-primary text-black py-3 sm:py-4 rounded-2xl font-medium hover:bg-primary disabled:bg-neutral-700 disabled:text-neutral-500 transition-all duration-200"
          >
            Verify OTP
          </button>
        </>
      ) : (
        <button
          onClick={() => formData.email && setShowOTP(true)}
          disabled={!formData.email}
          className="w-full bg-primary text-black py-3 sm:py-4 rounded-2xl font-medium hover:bg-primary disabled:bg-neutral-700 disabled:text-neutral-500 transition-all duration-200"
        >
          Continue with Email
        </button>
      )}

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-neutral-700" />
        <span className="text-neutral-500 text-sm">OR</span>
        <div className="flex-1 h-px bg-neutral-700" />
      </div>

      {/* Google login */}
      <button
        onClick={() => setCheckoutStep("contact")}
        className="w-full flex items-center justify-center gap-3 border border-neutral-700/30 glass-transparent-gradient rounded-2xl text-white py-3 sm:py-4 font-medium hover:bg-neutral-900 transition-all duration-200"
      >
        <img
          src="https://www.svgrepo.com/show/355037/google.svg"
          alt="Google"
          className="w-5 h-5"
        />
        Continue with Google
      </button>
    </div>
  );

  const ContactStep = () => (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          Contact & Address
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base">
          We'll use this to deliver your order
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <input
          type="tel"
          value={formData.whatsapp}
          onChange={(e) => handleInputChange("whatsapp", e.target.value)}
          placeholder="WhatsApp Number"
          className="glass-transparent-gradient border border-neutral-700/30 rounded-2xl p-3 mt-5 outline-0 w-full text-white placeholder-neutral-500"
        />

        <textarea
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          placeholder="Complete delivery address"
          rows={4}
          className="glass-transparent-gradient border border-neutral-700/30 rounded-2xl p-3 mt-5 outline-0 w-full text-white placeholder-neutral-500 resize-none"
        />

        <div className="flex gap-3">
          <button
            onClick={goToPreviousStep}
            className="flex-1 bg-neutral-800 text-white py-3 sm:py-4 rounded-2xl font-medium hover:bg-neutral-700 transition-all"
          >
            Back
          </button>
          <button
            onClick={() => setCheckoutStep("review")}
            disabled={!formData.whatsapp || !formData.address}
            className="flex-1 bg-primary text-white py-3 sm:py-4 rounded-2xl font-medium hover:bg-primary disabled:bg-neutral-700 disabled:text-neutral-500 transition-all"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );

  const ReviewStep = () => (
    <div className="space-y-6 sm:space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">
        Review Your Order
      </h1>

      {/* Product */}
      <div className="border border-neutral-700 p-4 sm:p-6 rounded-2xl">
        <div className="flex gap-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium">{product.name}</h3>
            <p className="text-neutral-400 text-sm">Qty: {product.quantity}</p>
            <p className="text-white font-bold mt-1">
              ₹{product.price.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="border border-neutral-700 p-4 sm:p-6 rounded-2xl space-y-3">
        <div className="flex justify-between text-neutral-400">
          <span>Subtotal</span>
          <span>₹{product.price.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-neutral-400">
          <span>Delivery</span>
          <span>₹{deliveryCharge}</span>
        </div>
        <hr className="border-neutral-700" />
        <div className="flex justify-between text-white font-bold text-lg">
          <span>Total</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
      </div>

      {/* Address */}
      <div className="border border-neutral-700 p-4 rounded-2xl">
        <p className="text-neutral-400 text-sm mb-1">Delivery to:</p>
        <p className="text-white font-medium">{formData.address}</p>
        <p className="text-neutral-400 text-sm mt-1">
          Contact: {formData.whatsapp}
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={goToPreviousStep}
          className="flex-1 bg-neutral-800 text-white py-3 sm:py-4 rounded-2xl font-medium hover:bg-neutral-700 transition-all"
        >
          Back
        </button>
        <button
          onClick={() => setCheckoutStep("confirmation")}
          className="flex-1 bg-primary text-white py-3 sm:py-4 rounded-2xl font-bold"
        >
          Confirm & Pay ₹{total.toLocaleString()}
        </button>
      </div>
    </div>
  );

  const ConfirmationStep = () => (
    <div className="text-center space-y-6 sm:space-y-8">
      <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 border border-primary rounded-full mb-4 bg-primary/10">
        <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-white">
        Order Confirmed!
      </h1>
      <p className="text-neutral-400">Thank you for your purchase</p>

      <div className="border border-neutral-700 p-4 rounded-2xl text-left">
        <h3 className="text-white font-medium mb-2">Delivery Details</h3>
        <p className="text-neutral-400 text-sm">
          <span className="text-white font-medium">Address:</span>{" "}
          {formData.address}
        </p>
        <p className="text-neutral-400 text-sm">
          <span className="text-white font-medium">Contact:</span>{" "}
          {formData.whatsapp}
        </p>
      </div>

      <button
        onClick={goBack}
        className="w-full bg-primary text-white py-3 sm:py-4 rounded-2xl font-bold"
      >
        Continue Shopping
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-neutral-700 p-4 sm:p-6">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={goBack}
            className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-primary"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <h1 className="text-white font-bold text-lg sm:text-xl">Checkout</h1>
          <div className="w-9 sm:w-10" />
        </div>
      </div>

      {/* Main */}
      <div className="max-w-lg mx-auto p-4 sm:p-6 pt-8 sm:pt-12">
        {checkoutStep === "auth" && <AuthStep />}
        {checkoutStep === "contact" && <ContactStep />}
        {checkoutStep === "review" && <ReviewStep />}
        {checkoutStep === "confirmation" && <ConfirmationStep />}
      </div>
    </div>
  );
};

export default CheckoutPage;
