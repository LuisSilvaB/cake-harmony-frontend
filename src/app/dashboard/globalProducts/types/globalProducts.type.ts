import { TagsType } from "@/app/dashboard/tags/types/tags.type";

export type productsType = {
  id: string;
  created_at: string;
  name: string;
  description: string;
  image_url: Array<string>;
  brand: string;
  PRODUCTS_TAGS: Array<{
    id: number;
    TAG: {
      id: number;
      name: string;
      color: string;
      created_at: string;
      id_main_tag: any;
    };
    type: string;
    TAG_ID: number;
    created_at: string;
    PRODUCT_ID: string;
  }>;
  VARIANTS: Array<{
    PRODUCT_ID: string;
    created_at: Date;
    id: number;
    size: string;
    sku: string;
  }>;
};

export type productsTagsType = {
  id: number;
  TAG: TagsType
  type: string;
  TAG_ID: number;
  created_at: string;
  PRODUCT_ID: string;
}

export type variantsType = {
  PRODUCT_ID: string;
  created_at: Date;
  id: number;
  size: string;
  sku: string;
}

