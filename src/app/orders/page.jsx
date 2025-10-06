// src/app/orders/page.jsx
<input
value={q}
onChange={(e) => setQ(e.target.value)}
placeholder="Tìm theo mã đơn…"
className="rounded-md border px-3 py-2 outline-none"
/>
<select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border px-3 py-2">
<option value="">Tất cả trạng thái</option>
{['DRAFT','PENDING','CONFIRMED','FULFILLED','COMPLETED','CANCELLED','REFUNDED'].map(s => (
<option key={s} value={s}>{s}</option>
))}
</select>
<button onClick={() => fetchData(1)} className="rounded-md border px-4 py-2 hover:bg-gray-50">Lọc</button>
</div>


<div className="overflow-x-auto rounded-lg border">
<table className="min-w-full text-sm">
<thead className="bg-gray-50 text-left">
<tr>
<th className="px-4 py-2">Mã đơn</th>
<th className="px-4 py-2">Khách</th>
<th className="px-4 py-2">Tổng tiền</th>
<th className="px-4 py-2">Trạng thái</th>
<th className="px-4 py-2">Ngày tạo</th>
<th className="px-4 py-2 text-right">Hành động</th>
</tr>
</thead>
<tbody>
{data.items.map((o) => (
<tr key={o.id} className="border-t">
<td className="px-4 py-2 font-medium"><Link href={`/orders/${o.id}`} className="underline">{o.code}</Link></td>
<td className="px-4 py-2">{o.customer?.name || '—'}</td>
<td className="px-4 py-2">{formatVND(o.total)}</td>
<td className="px-4 py-2"><StatusBadge value={o.status} /></td>
<td className="px-4 py-2">{new Date(o.createdAt).toLocaleString()}</td>
<td className="px-4 py-2 text-right">
<Link href={`/orders/${o.id}`} className="mr-2 rounded border px-2 py-1 hover:bg-gray-50">Xem</Link>
<button onClick={async() => { if (confirm('Xoá đơn này?')) { await removeOrder(o.id); fetchData(data.page); }}} className="rounded border px-2 py-1 text-rose-700 hover:bg-rose-50">Xoá</button>
</td>
</tr>
))}
{data.items.length === 0 && (
<tr><td className="px-4 py-6 text-center text-gray-500" colSpan={6}>{loading ? 'Đang tải…' : 'Không có dữ liệu'}</td></tr>
)}
</tbody>
</table>
</div>


<div className="mt-4 flex items-center justify-between">
<span className="text-sm text-gray-500">Tổng: {data.total}</span>
<div className="flex items-center gap-2">
<button disabled={data.page <= 1} onClick={() => fetchData(data.page - 1)} className="rounded border px-3 py-1 disabled:opacity-40">« Trước</button>
<span className="text-sm">Trang {data.page}/{totalPages}</span>
<button disabled={data.page >= totalPages} onClick={() => fetchData(data.page + 1)} className="rounded border px-3 py-1 disabled:opacity-40">Sau »</button>
</div>
</div>
</div>
);
}


function formatVND(n) {
try { return Number(n).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }); } catch { return n; }
}