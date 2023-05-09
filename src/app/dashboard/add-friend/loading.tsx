// External packages.
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface AddFriendLoadingProps {}

const AddFriendLoading: React.FC<AddFriendLoadingProps> = ({}) => {
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
        height={20}
        width={150}
      />
      <Skeleton
        baseColor="#1f2c38"
        highlightColor="#444"
        height={50}
        width={400}
      />
    </div>
  );
};

export default AddFriendLoading;
