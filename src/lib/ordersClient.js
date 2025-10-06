const USE_MOCK = false; // 👉 đặt true để dùng dữ liệu giả nếu BE chưa sẵn


export async function listOrders({ page = 1, pageSize = 10, status, q } = {}) {
if (USE_MOCK) return mockList({ page, pageSize, status, q });
const params = new URLSearchParams({ page, pageSize });
if (status) params.set('status', status);
if (q) params.set('q', q);
const res = await fetch(`/api/orders?${params.toString()}`, { cache: 'no-store' });
if (!res.ok) throw new Error(await res.text());
return res.json();
}


export async function getOrder(id) {
if (USE_MOCK) return mockGet(id);
const res = await fetch(`/api/orders/${id}`, { cache: 'no-store' });
if (!res.ok) throw new Error(await res.text());
return res.json();
}


export async function createOrder(payload) {
if (USE_MOCK) return mockCreate(payload);
const res = await fetch(`/api/orders`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(payload),
});
if (!res.ok) throw new Error(await res.text());
return res.json();
}


export async function updateOrder(id, payload) {
if (USE_MOCK) return mockUpdate(id, payload);
const res = await fetch(`/api/orders/${id}`, {
method: 'PATCH',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(payload),
});
if (!res.ok) throw new Error(await res.text());
return res.json();
}


export async function changeStatus(id, nextStatus) {
if (USE_MOCK) return mockUpdate(id, { status: nextStatus });
const res = await fetch(`/api/orders/${id}/status`, {
method: 'PATCH',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ status: nextStatus }),
});
if (!res.ok) throw new Error(await res.text());
return res.json();
}


export async function removeOrder(id) {
if (USE_MOCK) return { ok: true };
const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
if (!res.ok) throw new Error(await res.text());
return { ok: true };
}


// ------------------- MOCK (tối giản) -------------------
let _mock = {
items: Array.from({ length: 17 }).map((_, i) => ({
id: `mock-${i + 1}`,
code: `ORD-20251006-${String(i + 1).padStart(4, '0')}`,
status: ['PENDING', 'CONFIRMED', 'FULFILLED', 'COMPLETED'][i % 4],
total: 1000000 + i * 10000,
customer: { name: `Khách ${i + 1}` },
createdAt: new Date(Date.now() - i * 86400000).toISOString(),
})),
}