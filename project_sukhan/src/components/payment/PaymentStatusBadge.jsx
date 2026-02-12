import React from "react";

const statusConfig = {
  created: {
    label: "CREATED",
    bg: "bg-gray-700/40",
    text: "text-gray-300",
    ring: "ring-gray-500/30"
  },
  paid: {
    label: "PAID",
    bg: "bg-emerald-600/20",
    text: "text-emerald-400",
    ring: "ring-emerald-500/30"
  },
  failed: {
    label: "FAILED",
    bg: "bg-red-600/20",
    text: "text-red-400",
    ring: "ring-red-500/30"
  },
  refunded: {
    label: "REFUNDED",
    bg: "bg-blue-600/20",
    text: "text-blue-400",
    ring: "ring-blue-500/30"
  }
};

const PaymentStatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.created;

  return (
    <span
      className={`
        inline-flex items-center gap-2
        px-3 py-1.5
        rounded-full
        text-xs font-semibold tracking-wide
        ${config.bg} ${config.text}
        ring-1 ${config.ring}
        backdrop-blur-sm
        transition-all duration-300 ease-in-out
        hover:scale-105
      `}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
      </span>

      {config.label}
    </span>
  );
};

export default PaymentStatusBadge;
