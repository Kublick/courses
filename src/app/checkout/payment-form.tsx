// app/components/PaymentForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const paymentFormSchema = z.object({
	amount: z.number().min(1),
	currency: z.string().length(3),
	description: z.string().min(1),
	email: z.string().email(),
});

type PaymentFormData = z.infer<typeof paymentFormSchema>;

export default function PaymentForm() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<PaymentFormData>({
		resolver: zodResolver(paymentFormSchema),
	});

	const onSubmit = async (data: PaymentFormData) => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch('/api/payments', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Payment failed');
			}

			setSuccess(true);
			reset();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Payment failed');
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="space-y-4 max-w-md mx-auto p-4"
		>
			<div>
				<label className="block text-sm font-medium mb-1">Amount</label>
				<input
					type="number"
					{...register('amount', { valueAsNumber: true })}
					className="w-full border rounded-md p-2"
				/>
				{errors.amount && (
					<p className="text-red-500 text-sm">{errors.amount.message}</p>
				)}
			</div>

			<div>
				<label className="block text-sm font-medium mb-1">Currency</label>
				<select
					{...register('currency')}
					className="w-full border rounded-md p-2"
				>
					<option value="usd">USD</option>
					<option value="eur">EUR</option>
					<option value="gbp">GBP</option>
				</select>
				{errors.currency && (
					<p className="text-red-500 text-sm">{errors.currency.message}</p>
				)}
			</div>

			<div>
				<label className="block text-sm font-medium mb-1">Description</label>
				<input
					type="text"
					{...register('description')}
					className="w-full border rounded-md p-2"
				/>
				{errors.description && (
					<p className="text-red-500 text-sm">{errors.description.message}</p>
				)}
			</div>

			<div>
				<label className="block text-sm font-medium mb-1">Email</label>
				<input
					type="email"
					{...register('email')}
					className="w-full border rounded-md p-2"
				/>
				{errors.email && (
					<p className="text-red-500 text-sm">{errors.email.message}</p>
				)}
			</div>

			{error && (
				<div className="bg-red-50 text-red-500 p-3 rounded-md">{error}</div>
			)}

			{success && (
				<div className="bg-green-50 text-green-500 p-3 rounded-md">
					Payment processed successfully!
				</div>
			)}

			<button
				type="submit"
				disabled={loading}
				className={`w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors ${
					loading ? 'opacity-50 cursor-not-allowed' : ''
				}`}
			>
				{loading ? 'Processing...' : 'Pay Now'}
			</button>
		</form>
	);
}
