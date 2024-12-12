// components/LoadingSpinner.tsx
import React from "react";

const LoadingSpinner: React.FC = () => (
  <div className="d-flex justify-content-center mt-5">
    <div className="spinner-border" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

export default LoadingSpinner;
