interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 rounded-lg p-6 mb-8">
      <p className="text-red-600 font-medium">{message}</p>
      <button
        onClick={onRetry}
        className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
      >
        Retry
      </button>
    </div>
  );
}
