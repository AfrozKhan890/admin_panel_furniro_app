import { NextRequest, NextResponse } from "next/server";
import { getAllProducts } from "@/sanity/queries/fetch";
import { addProduct } from "@/sanity/queries/addProduct";
import { client } from "@/sanity/lib/client";

export async function GET() {
  try {
    const products = await getAllProducts(); // Fetch data from Sanity
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData(); // ✅ FormData Parse Karein

    const imageFile = formData.get("image") as File | null; // ✅ Image Get Karein

   const productData = {
      productName: formData.get("productName") as string,
      productDesc: formData.get("productDesc") as string,
      productCategory: formData.get("productCategory") as string,
      productPrice: Number(formData.get("productPrice")),
      productTags: JSON.parse(formData.get("productTags") as string),
      productSizes: JSON.parse(formData.get("productSizes") as string),
      rating: Number(formData.get("rating")),
      discount: Number(formData.get("discount")),
      isFeaturedProduct: formData.get("isFeatured") === "true",
      stockLevel: Number(formData.get("stockLevel")),
      image: imageFile, // 🟢 Sanity Image Reference
    };

    const newProduct = await addProduct(productData as any); // ✅ Add Product to Sanity

    return NextResponse.json(
      { message: "Product added successfully!", product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error in API:", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json(
        { error: "Missing product ID" },
        { status: 400 }
      );
    }

    await client.delete(productId);

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body._id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const updatedProduct = await client
      .patch(body._id) 
      .set({
        name: body.name,
        description: body.description,
        price: body.price,
        tags: body.tags,
        sizes: body.sizes,
        imageUrl: body.imageUrl,
        rating: body.rating,
        discountpercentage: body.discountpercentage,
        category: body.category,
        isFeaturedProduct: body.isFeaturedProduct,
        stockLevel: body.stockLevel,
      })
      .commit();

    return NextResponse.json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}