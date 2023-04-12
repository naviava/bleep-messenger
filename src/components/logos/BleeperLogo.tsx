// React and Next.
import Image from "next/image";

// Lib and Utils.
import images from "@/utils/images";

const BleeperLogo = () => {
  return (
    <div className="flex max-w-[5rem] flex-col items-center">
      <Image src={images.logoImage} alt="Logo" />
      <Image src={images.brandName} alt="Logo" />
    </div>
  );
};

export default BleeperLogo;
