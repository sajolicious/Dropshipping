import React from 'react';
import { useGetProductsByCategoryQuery } from '../slices/productsApiSlice';

const CategoryScreen = () => {
    const { data, isLoading, error } = useGetProductsByCategoryQuery('cloths');
    
    if (isLoading) {
        return <div>Loading...</div>;
    }
  
    if (error) {
        return <div>Error: {error}</div>;
    }
  
    // Check if data.products is not an array or is empty
    if (!Array.isArray(data.products) || data.products.length === 0) {
        return <div>No products found in the clothing category.</div>;
    }

    return (
        <div>
            <h2>Clothing Category</h2>
            <ul>
                {data.products.map((product) => (
                    <li key={product._id}>
                        <h3>{product.name}</h3>
                        <p>Price: {product.price}</p>
                        <p>Description: {product.description}</p>
                        {/* Add more details as needed */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryScreen;
