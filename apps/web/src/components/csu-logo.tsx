import Image from "next/image";
import { CSU_LOGO } from "@/lib/assets";
import { cn } from "@/lib/utils";

type CsuLogoProps = {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  priority?: boolean;
};

const sizes = {
  sm: { px: 72, img: 144, className: "h-[4.5rem] w-[4.5rem] min-h-[4.5rem] min-w-[4.5rem]" },
  md: { px: 88, img: 176, className: "h-[5.5rem] w-[5.5rem] min-h-[5.5rem] min-w-[5.5rem]" },
  lg: { px: 112, img: 224, className: "h-28 w-28 min-h-28 min-w-28" },
  xl: { px: 176, img: 352, className: "h-44 w-44 min-h-44 min-w-44 md:h-40 md:w-40 md:min-h-40 md:min-w-40" },
};

/** CSU circular seal — round clip so only the seal is visible */
export function CsuLogo({ size = "md", className, priority }: CsuLogoProps) {
  const { img, className: sizeClass } = sizes[size];
  return (
    <span className={cn("inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full", sizeClass, className)}>
      <Image
        src={CSU_LOGO}
        alt="Cotabato State University"
        width={img}
        height={img}
        quality={95}
        priority={priority}
        className="h-full w-full object-cover object-center"
      />
    </span>
  );
}
