"use client";

import React, { useState } from "react";
import { Label } from "./ui/label";
import Image from "next/image";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { client } from "@/sanity/lib/client"; 
import { toast } from "react-toastify";

const AddItem = () => {
  const furnitureTags = [
    "Wooden",
    "Modern",
    "Vintage",
    "Luxury",
    "Compact",
    "Handmade",
    "Eco-friendly",
    "Minimalist",
  ];
  const sizes = ["Small", "Medium", "Large", "Extra Large"];

  const [formData, setFormData] = useState({
    image: null as File | null,
    productName: "",
    productDesc: "",
    productCategory: "",
    productPrice: "",
    productTags: [] as string[],
    productSizes: [] as string[],
    rating: "",
    discount: "",
    isFeatured: false,
    stockLevel: "",
  });

  console.log("formData",formData)
  const [loading, setLoading] = useState(false)

  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string | boolean,
    field?: string
  ) => {
    if (typeof e === "string" && field) {
      // Handle Select Input
      setFormData((prev) => ({ ...prev, [field]: e }));
    } else if (typeof e === "boolean" && field) {
      // Handle Checkbox
      setFormData((prev) => ({ ...prev, [field]: e }));
    } else {
      // Handle Text and File Inputs
      const target = e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
      const { name, type, value, files } = target.target as HTMLInputElement;
  
      setFormData((prev) => ({
        ...prev,
        [name]: type === "file" ? files?.[0] || null : value,
      }));
    }
  };
  

  const handleTagSelect = (tag: string) => {
    if (!formData.productTags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        productTags: [...prev.productTags, tag],
      }));
    }
  };

  // Handle Removing Tags
  const handleTagRemove = (tag: string, event: React.MouseEvent) => {
    event.stopPropagation(); // 🛑 Stop dropdown from opening
    setFormData((prev) => ({
      ...prev,
      productTags: prev.productTags.filter((t) => t !== tag),
    }));
  };

  const handleSizeSelect = (value: string) => {
    if (!formData.productSizes.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        productSizes: [...prev.productSizes, value],
      }));
    }
  };

  const handleSizeRemove = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      productSizes: prev.productSizes.filter((s) => s !== size),
    }));
  };

 
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const formDataToSend = new FormData();
  
      if (formData.image) {
        formDataToSend.append("image", formData.image); 
      }
  
    
      formDataToSend.append("productName", formData.productName);
      formDataToSend.append("productDesc", formData.productDesc);
      formDataToSend.append("productCategory", formData.productCategory);
      formDataToSend.append("productPrice", String(formData.productPrice));
      formDataToSend.append("productTags", JSON.stringify(formData.productTags));
      formDataToSend.append("productSizes", JSON.stringify(formData.productSizes));
      formDataToSend.append("rating", String(formData.rating));
      formDataToSend.append("discount", (formData.discount));
      formDataToSend.append("isFeatured", String(formData.isFeatured));
      formDataToSend.append("stockLevel", String(formData.stockLevel));
  
      // ✅ Fetch API Call: JSON NAHI FormData Send Karna Hai
      const response = await fetch("/api/products", {
        method: "POST",
        body: formDataToSend, // 🟢 JSON.stringify() HATADO
      });
  
      if (!response.ok) throw new Error("Failed to add product");
  
      const result = await response.json();
      console.log("✅ Product added:", result);
  
      toast.success("Product added successfully.")
      setFormData({
        image: null,
        productName: "",
        productDesc: "",
        productCategory: "",
        productPrice: "",
        productTags: [],
        productSizes: [],
        rating: "",
        discount: "",
        isFeatured: false,
        stockLevel: "",
      });
    } catch (error) {
      console.log("❌ Error adding product:", error);
      toast.error("Failed to add product!")
    } finally {
      setLoading(false);
    }
  };
  
    
   
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-[800px] w-full p-10 flex flex-col gap-4 text-lg"
    >
      {/* Upload Image */}
      <div className="flex flex-col gap-2">
        <Label>Upload Image</Label>
        <Input
          type="file"
          className="hidden"
          name="image"
          onChange={handleChange}
          ref={inputRef}
          disabled={loading}
        />
        <Image
          src={
            formData.image
              ? URL.createObjectURL(formData.image)
              : "/assets/admin-assets/upload_area.png"
          }
          alt="upload-image"
          width={150}
          height={150}
          className="cursor-pointer"
          onClick={() => inputRef.current?.click()}
        />
      </div>

      <div className="flex gap-4 w-full">
        {/* Product Name */}
        <div className="w-full">
          <Label>Product Name</Label>
          <Input
            type="text"
            name="productName"
            placeholder="Enter Product Name"
            value={formData.productName}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        {/* Stock Level */}
        <div className="w-full">
          <Label>Stock Level</Label>
          <Input
            type="number"
            name="stockLevel"
            placeholder="Enter Stock Level"
            value={formData.stockLevel}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex gap-4 w-full">
        {/* Product Category */}
        <div className="w-full">
          <Label>Product Category</Label>
          <Select
            onValueChange={(value) => handleChange(value, "productCategory")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
              <SelectItem value="furniture">Furniture</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Product Price */}
        <div className="w-full">
          <Label>Product Price</Label>
          <Input
            type="number"
            name="productPrice"
            placeholder="Enter Price"
            value={formData.productPrice}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </div>

      {/* Product Tags (Multiple Select) */}
      <div>
      <Label>Product Tags</Label>
      <Select onValueChange={handleTagSelect}>
        <SelectTrigger className="relative min-h-[40px] p-2 flex items-center">
          {/* Selected Tags */}
          {formData.productTags.length > 0 ? (
            <div
              className="absolute inset-0 flex items-center gap-2 pl-2"
              onClick={(e) => e.stopPropagation()} // 🛑 Prevent dropdown from opening
            >
              {formData.productTags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-200 px-2 py-1 rounded-full flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={(e) => handleTagRemove(tag, e)}
                    className="text-red-500"
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <SelectValue placeholder="Select Tags" />
          )}
        </SelectTrigger>

        {/* Dropdown Options */}
        <SelectContent>
          {furnitureTags.map((tag) => (
            <SelectItem key={tag} value={tag}>
              {tag}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

      {/* Product Sizes (Multiple Select) */}
      <div>
        <Label>Product Sizes</Label>
        <Select onValueChange={handleSizeSelect}>
          <SelectTrigger>
            {formData?.productSizes?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.productSizes.map((size) => (
                  <span
                    key={size}
                    className="bg-gray-200 px-2 py-1 rounded-full text-xs flex items-center gap-1"
                  >
                    {size}
                    <button
                      type="button"
                      onClick={() => handleSizeRemove(size)}
                      className="text-red-500"
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <SelectValue placeholder="Select Sizes" />
            )}
          </SelectTrigger>
          <SelectContent>
            {sizes.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4 w-full">
        {/* Rating */}
        <div className="w-full ">
          <Label>Rating (1-5)</Label>
          <Input
            type="number"
            name="rating"
            min="1"
            max="5"
            placeholder="Enter Rating"
            value={formData.rating}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        {/* Discount Percentage */}
        <div className="w-full">
          <Label>Discount Percentage</Label>
          <Input
            type="number"
            name="discount"
            placeholder="Enter Discount %"
            value={formData.discount}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </div>
      {/* Is Featured Product */}
      <div className="flex items-center gap-2">
        <Checkbox
          name="isFeatured"
          checked={formData.isFeatured}
          onCheckedChange={(value) => handleChange(value, "isFeatured")}
          disabled={loading}
        />
        <Label>Is Featured Product</Label>
      </div>

      {/* Product Description */}
      <div>
        <Label>Product Description</Label>
        <Textarea
          rows={6}
          name="productDesc"
          value={formData.productDesc}
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      <Button type="submit" className="w-36 mt-2" disabled={loading}>
        Add
      </Button>
    </form>
  );
};

export default AddItem;