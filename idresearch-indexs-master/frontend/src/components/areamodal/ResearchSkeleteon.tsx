const ResearchSkeleton = () => {
  return (
    <div
      role="status"
      className="p-4 space-y-4 w-full rounded border border-gray-200 divide-y divide-gray-200 shadow animate-pulse mt-2 overflow-y-auto h-screen"
    >
      {[...Array(20)].map(() => (
        <div className="flex justify-between items-center pt-4">
          <div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          </div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
        </div>
      ))}
    </div>
  );
};

export default ResearchSkeleton;
