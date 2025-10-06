'use client';
import { useState } from 'react';
import { createOrder } from '@/lib/ordersClient';
import OrderForm from '@/components/OrderForm';
import { useRouter } from 'next/navigation';


export default function NewOrderPage() {
const router = useRouter();
const [submitting, setSubmitting] = useState(false);


async function handleSubmit(payload) {
try {
setSubmitting(true);
const created = await createOrder(payload);
router.push(`/orders/${created.id}`);
} catch (e) {
alert(`Lỗi tạo đơn: ${e.message}`);
} finally {
setSubmitting(false);
}
}


return (
<div className="mx-auto max-w-3xl p-6">
<h1 className="mb-4 text-2xl font-semibold">Tạo đơn hàng</h1>
<OrderForm onSubmit={handleSubmit} submitting={submitting} />
</div>
);
}