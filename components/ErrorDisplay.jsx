import React, { useMemo } from "react";

function ErrorDisplay({ error }) {
  const _err = useMemo(
    () => (typeof error === 'string' || error instanceof String)
      ? new Error(error)
      : error,
    [error]
  )

  return (
    <div>
      {" "}
      {_err.message && (
        <p className="text-red-500 font-medium mb-2">Error: {_err.message}</p>
      )}
      {_err.code && (
        <p className="text-red-500 font-medium mb-2">
          Error code: {_err.code}
        </p>
      )}
    </div>
  );
}

export default ErrorDisplay;
