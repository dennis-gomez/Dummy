import { useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

function InfoTooltip({ message, position = "top", mobilePosition = "bottom" }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative inline-flex items-center">
      <InformationCircleIcon
        className="w-10 h-10 text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
        onClick={() => setVisible(!visible)} 
        onMouseEnter={() => setVisible(true)} 
        onMouseLeave={() => setVisible(false)}
      />
      {/* Tooltip */}
      {visible && (
        <div
          className={`
            absolute z-50 w-56 sm:w-64 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-lg p-3
            left-1/2 -translate-x-1/2
            ${mobilePosition === "bottom" ? "top-full mt-2 sm:mt-0" : ""}
            ${position === "top" ? "sm:bottom-full sm:mb-2" : ""}
            ${position === "bottom" ? "sm:top-full sm:mt-2" : ""}
            ${position === "left" ? "sm:right-full sm:mr-2" : ""}
            ${position === "right" ? "sm:left-full sm:ml-2" : ""}
          `}
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default InfoTooltip;
