"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { client } from "@/sanity/lib/client";
import type { Order, Customer } from "@/types/Order";
import { Loader2 } from "lucide-react";

interface OrderDetailPageProps {
  params: { id: string };
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrderAndCustomer = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await client.fetch(
          `*[_type == "order" && _id == $id][0]{
            ...,
            customer->{
              _id,
              firstName,
              lastName,
              email,
              phone
            }
          }`,
          { id: params.id }
        );
        if (result) {
          setOrder(result);
          setCustomer(result.customer || null);
        } else {
          setError("Order not found.");
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError("Failed to load order. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) fetchOrderAndCustomer();
  }, [params.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setOrder((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    setIsLoading(true);
    setError(null);

    try {
      await client.createOrReplace(order);
      router.push("/dashboard/orders");
    } catch (err) {
      console.error("Failed to update order:", err);
      setError("Failed to update order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <p>{error}</p>
        <button
          onClick={() => router.push("/dashboard/orders")}
          className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto p-6">
      <div className="bg-blue-100 p-4 rounded-md mb-6">
        <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
        <p>
          Name: {customer?.firstName || ""} {customer?.lastName || ""}
        </p>
        <p>Email: {customer?.email || ""}</p>
        <p>Phone: {customer?.phone || ""}</p>
      </div>

      <div>
        <label className="block mb-1">Order Number</label>
        <input
          type="text"
          name="orderNumber"
          value={order?.orderNumber || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1">Status</label>
        <select
          name="status"
          value={order?.status || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="inline-block h-4 w-4 animate-spin mr-2" />
            Updating...
          </>
        ) : (
          "Update Order"
        )}
      </button>
    </form>
  );
}
