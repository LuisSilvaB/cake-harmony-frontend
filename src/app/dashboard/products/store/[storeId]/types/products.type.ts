import { TagsType } from "@/app/dashboard/tags/types/tags.type";

// export type productsType = {
//   id: string;
//   created_at: string;
//   name: string;
//   description: string;
//   image_url: Array<string>;
//   brand: string;
//   PRODUCTS_TAG: Array<{
//     id: number;
//     TAG: {
//       id: number;
//       name: string;
//       color: string;
//       created_at: string;
//       id_main_tag: any;
//     };
//     type: string;
//     TAG_ID: number;
//     created_at: string;
//     PRODUCT_ID: string;
//   }>;
//   PRODUCT_VARIANTS: Array<{
//     PRODUCT_ID: string;
//     created_at: Date;
//     id: number;
//     size: string;
//     sku: string;
//   }>;
// };

export type productsTagsType = {
  id: number;
  type: string;
  created_at: string;
  TAG_ID: number;
  PRODUCT_ID: string;
}

export type variantsType = {
  id?: number;
  created_at?: string;
  PRODUCT_ID?: number;
  presentation?: string;
  unid?: string;
}

export type productsType = {
  id: number;
  name: string;
  description: string;
  brand: string;
  image_url: Array<string>;
  PRODUCTS_TAG: Array<TagsType>;  
  VARIANTS: Array<variantsType>;
}

