"use client"
import { Fragment } from "react";
import { useGetProductsQuery } from "@/slices/productsApiSlice";

interface Product {
  _id: string;
  user: string;
  name: string;
  image: string;
  brand: string;
  category: string;
  description: string;
  rating: number;
  numReviews: number;
  price: number;
  countInStock: number;
}

interface Data {
  products: Product[];
}

export default function Home(): JSX.Element {
  const { data, isLoading } = useGetProductsQuery<Data>({});

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Fragment>
        <h1 className="text-3xl font-bold mb-8">Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Render products if data is available */}
          {data?.products.map((product: Product) => (
            <div key={product._id} className="border p-4">
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <img src={product.image} alt={product.name} className="w-full mb-2" />
              <p className="text-gray-700 mb-2">Price: ${product.price}</p>
              {/* Add more product information as needed */}
            </div>
          ))}
        </div>
        {/* Show loading indicator if data is loading */}
        {isLoading && <div className="text-center mt-8">Loading...</div>}
      </Fragment>
    </main>
  );
}
