import React from "react";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import { useNavigate } from "react-router";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 
      bg-gradient-to-br 
      from-background 
      via-muted/30 
      to-background">

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-card/80 backdrop-blur-xl 
        border border-border/60 
        rounded-3xl shadow-[0_0_40px_rgba(16,185,129,0.12)]
        p-10 max-w-md w-full text-center overflow-hidden"
      >

        {/* Soft green glow */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <div className="p-5 rounded-full bg-primary/10 shadow-inner">
            <XCircle size={80} className="text-destructive drop-shadow-lg" />
          </div>
        </motion.div>

        <h1 className="text-3xl font-bold text-foreground mb-4 tracking-wide">
          Payment Failed
        </h1>

        <p className="text-muted-foreground mb-8 leading-relaxed">
          Something went wrong during the transaction.
          Please try again or use a different payment method.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-destructive hover:opacity-90 transition-all duration-300 
            text-base-content font-semibold px-6 py-3 rounded-xl shadow-lg"
          >
            Try Again
          </button>

          <button
            onClick={() => navigate("/")}
            className="border border-border hover:bg-accent transition-all duration-300 
            text-foreground px-6 py-3 rounded-xl"
          >
            Go Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentFailed;
