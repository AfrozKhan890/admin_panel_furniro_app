import { client } from "@/sanity/lib/client";

export interface ProductData {
  productName: string;
  productDesc: string;
  productCategory: string;
  productPrice: number;
  productTags: string[];
  productSizes: string[];
  rating: number;
  discount: number;
  isFeatured: boolean;
  stockLevel: number;
  image?: string;
}


const uploadImageToSanity = async (imageFile: File): Promise<string | null> => {
    try {
      const asset = await client.assets.upload("image", imageFile, {
        filename: imageFile.name,
      });
      return asset._id;
    } catch (error) {
      console.error("❌ Image upload failed:", error);
      return null;
    }
  };
  
export const addProduct = async (data: ProductData) => {
  try {
    let imageRef = null;
    if (data.image) {
      imageRef = await uploadImageToSanity(data.image as any);
    }

    const newProduct = {
      _type: "product",
      name: data.productName,
      description: data.productDesc,
      price: Number(data.productPrice),
      tags: data.productTags,
      sizes: data.productSizes,
      image: imageRef
        ? {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: imageRef,
            },
          }
        : null,
      rating: Number(data.rating),
      discountPercentage: Number(data.discount),
      category: data.productCategory,
      isFeaturedProduct: data.isFeatured,
      stockLevel: Number(data.stockLevel),
    };

    const createdProduct = await client.create(newProduct);
    return createdProduct;
  } catch (error) {
    console.error("❌ Error adding product:", error);
    throw new Error("Failed to add product");
  }
};