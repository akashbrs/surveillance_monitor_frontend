import coresentinelLogo from "@/assets/Core Sentinel Logo.jpg";

interface LogoProps {
  /** Size variant: "sm" = 24px, "md" = 32px (default), "lg" = 40px */
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
};

export function Logo({ size = "md", className = "" }: LogoProps) {
  return (
    <img
      src={coresentinelLogo}
      alt="Core Sentinel logo"
      className={`${sizeMap[size]} object-contain shrink-0 ${className}`}
      draggable={false}
    />
  );
}
