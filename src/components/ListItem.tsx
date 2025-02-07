"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loader2 } from "lucide-react";

import { toast } from "react-toastify";
import { Product } from "@/sanity/queries/fetch";


const ListItem = () => {
  const [products, setProducts] = useState<Product[]>([]);
  console.log("product",products)
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

  const inputRef = React.useRef<HTMLInputElement>(null);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const currentProduct = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) throw new Error("Failed to delete product");
  
      setProducts((prev) => prev.filter((item) => item._id !== id));

      setTimeout(() => {
        // Calculate total pages after deletion
        const totalPagesAfterDeletion = Math.ceil((products.length - 1) / productsPerPage);
      
        // Ensure we don't go below page 1
        if (currentPage > totalPagesAfterDeletion) {
          setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
        }
      }, 0);
  
      toast.success("Product deleted successfully!")
    } catch (error) {
      console.log("❌ Error deleting product:", error);
      toast.error("Failed to delete product!")
    }finally{
      setLoading(false)
    }
  };
  

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
  
    try {
      setLoading(true);
      const response = await fetch("/api/products", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedProduct),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update product");
      }
  
      const updatedProduct = await response.json();
      
      setProducts((prev) =>
        prev.map((prod) =>
          prod._id === updatedProduct.updatedProduct._id ? updatedProduct.updatedProduct : prod
        )
      );
  
      toast.success("Product updated successfully!");
    } catch (error) {
      console.error("❌ Error updating product:", error);
      toast.error("Failed to update product!");
    } finally {
      setLoading(false);
    }
  };
  

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get selected file
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create preview URL
      setImagePreview(imageUrl); // Set preview state
      setSelectedProduct({ ...selectedProduct, imageUrl  }as any); // Update selected product state
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-10 w-full  ">
      <h1 className="text-xl text-gray-400">All Items</h1>
      <div className="bg-white shadow-lg min-h-[500px] h-full rounded-md p-2 flex flex-col justify-between ">
        <Table className="w-full mt-5">
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Sizes</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProduct &&
              currentProduct.length > 0 &&
              currentProduct.map((product, index) => (
                <TableRow key={product._id || index}>
                  {/* Image */}
                  <TableCell>
                    <Image
                      src={product.imageUrl ? product.imageUrl : "/assets/main-logo.svg"}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="h-16 w-16 object-cover rounded-md"
                    />
                  </TableCell>

                  {/* Name */}
                  <TableCell>{product.name}</TableCell>

                  {/* Category */}
                  <TableCell>{product.category}</TableCell>

                  {/* Price */}
                  <TableCell>${product.price.toFixed(2)}</TableCell>

                  {/* Stock Level */}
                  <TableCell>
                    {(product.stockLevel ?? 0 > 0) ? (
                      <span className="text-green-600">
                        In Stock ({product.stockLevel})
                      </span>
                    ) : (
                      <span className="text-red-600">Out of Stock</span>
                    )}
                  </TableCell>

                  {/* Rating */}
                  <TableCell>{product.rating} ⭐</TableCell>

                  {/* Tags (Array) */}
                  <TableCell>
                    {product.tags && product.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {product.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">No Tags</span>
                    )}
                  </TableCell>

                  {/* Sizes (Array) */}
                  <TableCell>
                    {product.sizes && product.sizes.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {product.sizes.map((size, sizeIndex) => (
                          <span
                            key={sizeIndex}
                            className="bg-blue-200 text-blue-700 px-2 py-1 rounded-md text-xs"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">No Sizes</span>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="cursor-pointer flex flex-col gap-2">
                    {/* Edit Button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => setSelectedProduct(product)}
                          className="text-white rounded bg-blue-500 h-6 w-20  hover:bg-blue-400"
                        >
                          Edit
                        </Button>
                      </DialogTrigger>
                      {selectedProduct && (
                        <DialogContent className="fixed h-[600px] w-[70vw] p-6 bg-white rounded-lg shadow-lg">
                          <DialogHeader>
                            <DialogTitle>Edit Product</DialogTitle>
                          </DialogHeader>
                          <form
                            onSubmit={handleUpdate}
                            className="flex flex-col overflow-auto gap-4 [&::-webkit-scrollbar]:hidden scrollbar-none"
                          >
                            {/* Image Preview */}
                            <div className="flex flex-col gap-2">
                              <Label>Product Image</Label>
                              <Input
                                type="file"
                                className="hidden"
                                name="image"
                                ref={inputRef}
                                onChange={handleImageChange}
                              />
                              <div className="flex gap-2">
                                <Image
                                  src={imagePreview || selectedProduct.imageUrl}
                                  alt="Product Image"
                                  width={100}
                                  height={100}
                                  className="rounded-md border"
                                />

                                <Image
                                  src="/assets/admin-assets/upload_area.png"
                                  alt="upload-image"
                                  width={100}
                                  height={100}
                                  className="rounded-md border cursor-pointer object-cover"
                                  onClick={() => inputRef.current?.click()}
                                />
                              </div>
                            </div>
                            <div>
                              <Label>Product Name</Label>
                              <Input
                                type="text"
                                value={selectedProduct.name}
                                onChange={(e) =>
                                  setSelectedProduct({
                                    ...selectedProduct,
                                    name: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div>
                              <Label>Category</Label>
                              <Input
                                type="text"
                                value={selectedProduct.category || ""}
                                onChange={(e) =>
                                  setSelectedProduct({
                                    ...selectedProduct,
                                    category: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div>
                              <Label>Price</Label>
                              <Input
                                type="number"
                                value={selectedProduct.price}
                                onChange={(e) =>
                                  setSelectedProduct({
                                    ...selectedProduct,
                                    price: parseFloat(e.target.value),
                                  })
                                }
                              />
                            </div>

                            <div>
                              <Label>Stock Level</Label>
                              <Input
                                type="number"
                                value={selectedProduct.stockLevel || ""}
                                onChange={(e) =>
                                  setSelectedProduct({
                                    ...selectedProduct,
                                    stockLevel: parseInt(e.target.value) || 0,
                                  })
                                }
                              />
                            </div>

                            <div>
                              <Label>Rating</Label>
                              <Input
                                type="number"
                                value={selectedProduct.rating}
                                onChange={(e) =>
                                  setSelectedProduct({
                                    ...selectedProduct,
                                    rating: parseFloat(e.target.value),
                                  })
                                }
                              />
                            </div>

                            <div>
                              <Label>Tags (comma-separated)</Label>
                              <Input
                                type="text"
                                value={selectedProduct.tags?.join(", ") || ""}
                                onChange={(e) =>
                                  setSelectedProduct({
                                    ...selectedProduct,
                                    tags: e.target.value
                                      .split(",")
                                      .map((tag) => tag.trim()),
                                  })
                                }
                              />
                            </div>

                            <div>
                              <Label>Sizes (comma-separated)</Label>
                              <Input
                                type="text"
                                value={selectedProduct.sizes?.join(", ") || ""}
                                onChange={(e) =>
                                  setSelectedProduct({
                                    ...selectedProduct,
                                    sizes: e.target.value
                                      .split(",")
                                      .map((size) => size.trim()),
                                  })
                                }
                              />
                            </div>
                            <DialogClose asChild>
                              <Button
                                type="submit"
                                className="bg-[#f0d786] text-white w-min hover:bg-[#f8e4a6] transition-all"
                              >
                                Save Changes
                              </Button>
                            </DialogClose>
                          </form>
                        </DialogContent>
                      )}
                    </Dialog>

                    {/* Delete Button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="text-white bg-red-500 h-6 w-20 rounded hover:bg-red-400">
                          Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] p-6 bg-white rounded-lg shadow-lg">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold">
                            Confirm Deletion
                          </DialogTitle>
                        </DialogHeader>
                        <p className="text-sm text-gray-600">
                          Are you sure you want to delete this product?
                        </p>
                        <div className="flex justify-end gap-4 mt-6">
                          <DialogClose asChild>
                            <Button
                              disabled={loading}
                              variant="outline"
                              className="text-gray-600"
                            >
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button
                            disabled={loading}
                            variant="destructive"
                            className="bg-red-600 text-white"
                            onClick={() => {
                              handleDelete(product?._id);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {loading && products.length < 1 && (
          <div className="flex flex-1 items-center justify-center h-[90%]">
            <Loader2 className="animate-spin w-[100px] h-[100px]" />
          </div>
        )}
        {/* Pagination */}
        <div className="sm:my-6 my-10 flex sm:flex-row flex-col gap-2  sm:justify-between sm:items-center">
          <p className="text-gray-600">
            {`Showing Data ${(currentPage - 1) * productsPerPage + 1} - ${Math.min(currentPage * productsPerPage, products.length)} of ${products.length}`}
          </p>
          <div className="flex space-x-2">
            {/* Previous Button */}
            {currentPage > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                &lt;
              </Button>
            )}

            {/* Dynamic Page Numbers */}
            {Array.from(
              { length: Math.min(totalPages, 3) }, // Ensure at most 3 buttons are shown
              (_, index) => {
                const startPage = Math.max(
                  1,
                  Math.min(
                    currentPage - 1, // Keep the current page in the middle (if possible)
                    totalPages - 2
                  )
                ); // Calculate the starting page number dynamically
                const pageNumber = startPage + index; // Determine the page number for each button

                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                    className={`${
                      currentPage === pageNumber
                        ? "bg-[#f0d786] text-white hover:bg-[#f0d786]"
                        : ""
                    }`}
                  >
                    {pageNumber}
                  </Button>
                );
              }
            )}

            {/* Next Button */}
            {currentPage < totalPages && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                &gt;
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListItem;