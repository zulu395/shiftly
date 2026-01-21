import { CONFIG } from "@/utils/constants";
import { Metadata } from "next";

export type MetadataProps = {
  title: string;
  description: string;
  img?: string;
  path?: string;
};

export function appMetadata({
  title,
  description,
  img,
}: MetadataProps): Metadata {
  const HOST = CONFIG.website.host;
  const keywords = ["Shiftly", ...title.split(" "), ...description.split(" ")];
  const defaultImage = `${HOST}/images/banner.png`;
  const buildImg = img
    ? img.startsWith("/")
      ? HOST + img
      : img
    : defaultImage;

  return {
    title,
    description,
    metadataBase: new URL(HOST),
    icons: ["/images/icon.png"],
    applicationName: "Shiftly",
    keywords: keywords,
    // manifest: "/files/manifest.json",
    twitter: { title, description, images: [buildImg] },
    openGraph: {
      title,
      description,
      images: [buildImg],
      tags: keywords,
    },
  };
}
