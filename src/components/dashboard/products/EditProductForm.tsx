"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: "2023-05-03",
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
});

interface ProductFormData {
  _id: string;
  title: string;
  slug: string;
  price: number;
  originalPrice?: number;
  rating: number;
  description: string;
  images: string[];
  colors: string[];
  sizes: string[];
  tags: string[];
  isNewArrival: boolean;
  isTopSelling: boolean;
  inventory: number;
  productDetails: string[];
  faqs: { question: string; answer: string }[];
  category: string;
  style: string;
}

interface EditProductFormProps {
  productId: string;
}

export function EditProductForm({ productId }: EditProductFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>();

  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const result = await client.fetch("*[_type == 'product' && _id == $productId][0]", { productId });
        if (result) {
          Object.keys(result).forEach((key) => {
            setValue(key as keyof ProductFormData, result[key]);
          });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast({ title: "Error", description: "Failed to fetch product", variant: "destructive" });
      }
    }
    fetchProduct();
  }, [productId, setValue, toast]);

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    setIsLoading(true);
    try {
      await client.patch(productId).set(data).commit();
      toast({ title: "Success", description: "Product updated successfully" });
      router.push("/dashboard/products");
    } catch (error) {
      console.error("Error updating product:", error);
      toast({ title: "Error", description: "Failed to update product", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">Edit Product</h1>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title", { required: "Title is required" })} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating Product...
          </>
        ) : (
          "Update Product"
        )}
      </Button>
    </form>
  );
}