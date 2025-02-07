import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    tags: string[];
    sizes: string[];
    imageUrl:string
    rating: number;
    discountpercentage?:number;
    category?:string;
    isFeaturedProduct?:boolean;
    stockLevel?:number
}


export const getAllProducts = async () => {
  const ALL_PRODUCTS_QUERY = defineQuery(`*[_type == "product"]{
    _id,
    name,
    description,
    price,
    tags,
    sizes,
    rating,
    "imageUrl": image.asset->url,
    category,
    discountPercentage,
    isFeaturedProduct,
    stockLevel,
}`);
  try {
    const products = await sanityFetch({ query: ALL_PRODUCTS_QUERY });
    console.log(" product", products.data);
    return products.data as Product || [];
  } catch (error) {
    console.error("error fetching all products " + error);
    return [];
  }
};