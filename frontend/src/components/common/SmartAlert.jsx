// src/components/SmartAlert.jsx
import { AnimatePresence, motion } from "framer-motion";
import "../../styles/smart-alert.css"; // Import CSS file for better style control

export default function SmartAlert({ message, type }) {
  let alertIcon = "";
  let alertClass = "";

  // Determine icon and style based on type
  if (type === "success") {
    alertIcon = "✅"; // Success icon
    alertClass = "success";
  } else if (type === "warning") {
    alertIcon = "⚠️"; // Warning icon
    alertClass = "warning";
  } else if (type === "error") {
    alertIcon = "❌"; // Error icon
    alertClass = "error";
  }

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className={`smart-alert ${alertClass}`} // Dynamically add class based on type
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <span>{alertIcon}</span> {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
