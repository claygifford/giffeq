import React from "react";
import {
  isAlbum,
  isArtist,
  SearchItem,
} from "../../lib/context/search-context";
import Image from "next/image";

type ItemType = {
  item: SearchItem;
};

const getImage = (item: SearchItem) => {
  if (isAlbum(item) || isArtist(item)) {
    const [image] = item.images;
    return image;
  }
  if (item.album) {
    const [image] = item.album.images;
    return image;
  }
};
export default function ImageComponent({ item }: ItemType) {
  const image = getImage(item);
  if (image) {
    return (
      <Image
        src={image.url}
        width={32}
        height={32}
        alt="Picture of the artist"
      />
    );
  }
}
