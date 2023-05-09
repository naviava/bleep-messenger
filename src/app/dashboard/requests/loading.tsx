// External packages.
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface RequestsLoadingProps {}

const RequestsLoading: React.FC<RequestsLoadingProps> = ({}) => {
  return (
    <div className="flex w-full flex-col gap-3">
      <Skeleton
        className="mb-4"
        baseColor="#1f2c38"
        highlightColor="#444"
        height={60}
        width={500}
      />
      <Skeleton
        baseColor="#1f2c38"
        highlightColor="#444"
        height={50}
        width={350}
      />
      <Skeleton
        baseColor="#1f2c38"
        highlightColor="#444"
        height={50}
        width={350}
      />
      <Skeleton
        baseColor="#1f2c38"
        highlightColor="#444"
        height={50}
        width={350}
      />
    </div>
  );
};

export default RequestsLoading;
