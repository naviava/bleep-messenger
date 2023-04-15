// React and Next.
import Image from "next/image";

// Lib and Utils.
import images from "@/utils/images";

interface BleeperLogoProps {
  iconOnly?: boolean;
  logoClasses?: string;
  brandNameClasses?: string;
  height?: string;
  horizontal?: boolean;
}

const BleeperLogo: React.FC<BleeperLogoProps> = ({
  iconOnly = false,
  logoClasses,
  brandNameClasses,
  height,
  horizontal,
}) => {
  return (
    <div
      className={`flex max-w-[5rem] items-center
      ${horizontal ? "flex-row gap-x-1" : "flex-col"}`}
    >
      <Image
        src={images.logoImage}
        alt="Logo"
        className={`${logoClasses} ${height}`}
      />
      {!iconOnly && (
        <Image
          src={images.brandName}
          alt="Logo"
          className={`${brandNameClasses} ${height}`}
        />
      )}
    </div>
  );
};

export default BleeperLogo;
