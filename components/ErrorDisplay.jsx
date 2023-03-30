import React from "react";

function ErrorDisplay({ error }) {
  return (
    <div>
      {" "}
      {error.message && (
        <p className="text-red-600 font-medium mb-2">Error: {error.message}</p>
      )}
      {error.code && (
        <p className="text-red-600 font-medium mb-2">
          Error code: {error.code}
        </p>
      )}
    </div>
  );
}

export default ErrorDisplay;
