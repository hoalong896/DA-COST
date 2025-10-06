'use client';
try { await changeStatus(id, next); await fetchData(); } catch (e) { alert(`Không đổi được trạng thái: ${e.message}`); }



if (loading) return <div className="p-6">Đang tải…</div>;
if (!data) return <div className="p-6">Không có dữ liệu</div>;


return (
<div className="mx-auto max-w-4xl p-6 space-y-6">
<div className="flex items-center justify-between">
<h1 className="text-2xl font-semibold">Đơn hàng {data.code}</h1>
<StatusBadge value={data.status} />
</div>


<section className="rounded-lg border p-4">
<h2 className="mb-3 text-lg font-semibold">Thông tin chung</h2>
<div className="grid gap-2 md:grid-cols-2">
<Field label="Khách hàng" value={data.customer?.name || '—'} />
<Field label="Tổng tiền" value={formatVND(data.total)} />
<Field label="Tạm tính" value={formatVND(data.subtotal)} />
<Field label="Giảm giá" value={formatVND(data.discount)} />
<Field label="Phí vận chuyển" value={formatVND(data.shippingFee)} />
<Field label="Tiền tệ" value={data.currency || 'VND'} />
</div>
</section>


<section className="rounded-lg border p-4">
<h2 className="mb-3 text-lg font-semibold">Sản phẩm</h2>
<div className="overflow-x-auto">
<table className="min-w-full text-sm">
<thead className="bg-gray-50">
<tr>
<th className="px-3 py-2 text-left">Tên</th>
<th className="px-3 py-2 text-right">Đơn giá</th>
<th className="px-3 py-2 text-right">SL</th>
<th className="px-3 py-2 text-right">Thành tiền</th>
</tr>
</thead>
<tbody>
{data.items?.map((it) => (
<tr key={it.id} className="border-t">
<td className="px-3 py-2">{it.name}</td>
<td className="px-3 py-2 text-right">{formatVND(it.unitPrice)}</td>
<td className="px-3 py-2 text-right">{it.quantity}</td>
<td className="px-3 py-2 text-right">{formatVND(it.amount)}</td>
</tr>
))}
</tbody>
</table>
</div>
</section>


<section className="rounded-lg border p-4">
<h2 className="mb-3 text-lg font-semibold">Hành động</h2>
<div className="flex flex-wrap gap-2">
{['PENDING','CONFIRMED','FULFILLED','COMPLETED','CANCELLED','REFUNDED'].map((s) => (
<button key={s} onClick={() => doChangeStatus(s)} className="rounded border px-3 py-2 hover:bg-gray-50">{s}</button>
))}
</div>
</section>
</div>
);



function Field({ label, value }) {
return (
<div className="grid grid-cols-3 items-center">
<div className="text-sm text-gray-500">{label}</div>
<div className="col-span-2 font-medium">{value}</div>
</div>
);
}


function formatVND(n) {
try { return Number(n).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }); } catch { return n; }
}