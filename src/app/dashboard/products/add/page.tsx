"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X, Loader2 } from "lucide-react";
import { createClient } from "@sanity/client";
import type { Product, Category, Style } from "@/types/Product";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false,
  apiVersion: "2023-05-03",
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
});

type ProductFormData = Omit<Product, "_id" | "createdAt" | "slug" | "reviews"> & { slug: string };

export default function AddProductPage() {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: {
      title: "",
      slug: "",
      price: 0,
      originalPrice: 0,
      rating: 0,
      description: "",
      images: [],
      colors: [],
      sizes: [],
      tags: [],
      isNewArrival: false,
      isTopSelling: false,
      inventory: 0,
      productDetails: [],
      faqs: [],
      category: { _type: "reference", _ref: "" },
      style: { _type: "reference", _ref: "" },
    },
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [styles, setStyles] = useState<Style[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const title = watch("title");

  useEffect(() => {
    fetchCategories();
    fetchStyles();
  }, []);

  useEffect(() => {
    if (title) {
      setValue("slug", title.toLowerCase().replace(/\s+/g, "-").slice(0, 96));
    }
  }, [title, setValue]);

  const fetchCategories = async () => {
    try {
      const result = await client.fetch('*[_type == "category"]{_id, name, "slug": slug.current}');
      setCategories(result);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch categories", variant: "destructive" });
    }
  };

  const fetchStyles = async () => {
    try {
      const result = await client.fetch('*[_type == "style"]{_id, name, "slug": slug.current}');
      setStyles(result);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch styles", variant: "destructive" });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []; // Null check handled
    if (files.length > 0) {
      setImageFiles((prevFiles) => [...prevFiles, ...files].slice(0, 3));
    }
  };
  

  const removeImage = (index: number) => {
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    setIsLoading(true);
    try {
      if (imageFiles.length === 0) throw new Error("At least one image is required");
      
      const imageAssets = await Promise.all(
        imageFiles.map((file) => client.assets.upload("image", file))
      );

      const product = {
        _type: "product",
        title: data.title,
        slug: { _type: "slug", current: data.slug },
        price: Number(data.price),
        originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
        rating: Number(data.rating),
        description: data.description,
        images: imageAssets.map((asset) => ({
          _type: "image",
          asset: { _type: "reference", _ref: asset._id },
          _key: asset._id,
        })),
        colors: data.colors,
        sizes: data.sizes,
        tags: data.tags,
        isNewArrival: data.isNewArrival,
        isTopSelling: data.isTopSelling,
        inventory: Math.round(Number(data.inventory)),
        productDetails: data.productDetails,
        faqs: data.faqs.map((faq, index) => ({ ...faq, _key: `faq_${index}` })),
        category: { _type: "reference", _ref: data.category._ref },
        style: { _type: "reference", _ref: data.style._ref },
      };

      await client.create(product);
      toast({ title: "Success", description: "Product added successfully" });
      router.push("/dashboard/products");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Label>Title</Label>
      <Input {...register("title", { required: true })} placeholder="Product Title" />
      {errors.title && <p className="text-red-500">Title is required</p>}

      <Label>Price</Label>
      <Input {...register("price", { required: true })} type="number" placeholder="Product Price" />
      {errors.price && <p className="text-red-500">Price is required</p>}

      <Label>Upload Images</Label>
      <Input type="file" multiple onChange={handleImageChange} ref={fileInputRef} accept="image/*" />
      <div className="flex space-x-2">
        {imageFiles.map((file, index) => (
          <div key={index} className="relative">
            <img src={URL.createObjectURL(file)} alt="preview" className="w-16 h-16 rounded-md" />
            <button type="button" onClick={() => removeImage(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1">
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? <Loader2 className="animate-spin" /> : "Add Product"}
      </Button>
    </form>
  );
}
