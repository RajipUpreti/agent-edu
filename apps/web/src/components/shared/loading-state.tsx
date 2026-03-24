type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = "Loading data..." }: LoadingStateProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-blue-600" />
        <span>{label}</span>
      </div>
    </div>
  );
}
