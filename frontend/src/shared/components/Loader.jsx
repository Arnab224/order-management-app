export default function Loader() {
  return (
    <div className="flex justify-center items-center py-12" role="status" aria-label="Loading">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  );
}
