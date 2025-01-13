// app/components/ProductCheckout.tsx
'use client';

import { useState } from 'react';

interface ProductCheckoutProps {
	priceId: string;
	productName: string;
	price: number;
	currency: string;
}

export default function ProductCheckout({
	priceId,
	productName,
	price,
	currency,
}: ProductCheckoutProps) {
	const [loading, setLoading] = useState(false);

	const handleCheckout = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/payments/checkout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ priceId }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Checkout failed');
			}

			if (data.url) {
				window.location.href = data.url;
			} else {
				throw new Error('No checkout URL returned');
			}
		} catch (error) {
			console.error('Error:', error);
			alert(
				error instanceof Error ? error.message : 'Failed to initiate checkout',
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="border rounded-lg p-6 max-w-sm mx-auto">
			<h2 className="text-xl font-bold mb-4">{productName}</h2>
			<p className="text-lg mb-4">
				{new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: currency.toUpperCase(),
				}).format(price / 100)}
			</p>
			<button
				onClick={handleCheckout}
				disabled={loading}
				className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors ${
					loading ? 'opacity-50 cursor-not-allowed' : ''
				}`}
			>
				{loading ? 'Loading...' : 'Buy Now'}
			</button>
		</div>
	);
}
