import { Skeleton } from "@/components/ui/skeleton";

const SkeletonLoader = () => {
  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-20" />
      </div>

      {/* Generate 3 skeleton cards to represent loading flashcards */}
      {[1, 2, 3].map((index) => (
        <div key={index} className="border rounded-lg p-4 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
          <div className="flex justify-between pt-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      ))}

      <div className="flex justify-end mt-6">
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
};

export default SkeletonLoader;
