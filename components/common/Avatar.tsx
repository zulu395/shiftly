import {
  AvatarImage,
  Avatar as AvatarRoot,
  AvatarFallback,
} from "../ui/avatar";

type AvatarProps = {
  src?: string;
  alt?: string;
  size?: number;
};

export default function Avatar({ src, alt = "", size = 40 }: AvatarProps) {
  return (
    <AvatarRoot
      style={{
        height: size,
        width: size,
      }}
      className="border"
    >
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback className="bg-gray-200">
        {alt.toString().at(0)?.toUpperCase()}
      </AvatarFallback>
    </AvatarRoot>
  );
}
