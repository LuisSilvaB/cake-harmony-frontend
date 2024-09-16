import { TagsType } from "../../tags/types/tags.type";

export type GlobalProductsType = {
  id: string;
  created_at: string;
  name: string;
  description: string;
  image_url: Array<string>;
  brand: string;
  GLOBAL_PRODUCTS_TAG: Array<{
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
    GLOBAL_PRODUCT_ID: string;
  }>;
};

export type GlobalProductsTagsType = {
  id: number;
  TAG: TagsType
  type: string;
  TAG_ID: number;
  created_at: string;
  GLOBAL_PRODUCT_ID: string;
}

