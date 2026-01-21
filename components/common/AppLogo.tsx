import Image from "next/image";

export default function AppLogo({ size = 64 }: { size?: number }) {
  return (
    <>
      <Image
        alt="Logo"
        src="/images/logo.png"
        height={size}
        width={size}
        className="object-contain aspect-square "
      />
    </>
  );
}
