

return (
<form onSubmit={handleSubmit} className="space-y-4">
<div className="grid gap-3 md:grid-cols-2">
<div>
<label className="mb-1 block text-sm font-medium">Khách hàng (customerId)</label>
<input value={customerId} onChange={(e) => setCustomerId(e.target.value)} placeholder="tùy chọn"
className="w-full rounded-md border px-3 py-2" />
</div>
<div className="grid grid-cols-2 gap-3">
<div>
<label className="mb-1 block text-sm font-medium">Giảm giá</label>
<input type="number" min="0" value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-full rounded-md border px-3 py-2" />
</div>
<div>
<label className="mb-1 block text-sm font-medium">Phí vận chuyển</label>
<input type="number" min="0" value={shippingFee} onChange={(e) => setShippingFee(e.target.value)} className="w-full rounded-md border px-3 py-2" />
</div>
</div>
</div>


<div className="rounded-lg border">
<div className="border-b bg-gray-50 px-4 py-2 text-sm font-semibold">Sản phẩm</div>
<div className="divide-y">
{items.map((it, idx) => (
<div key={idx} className="grid items-center gap-3 p-3 md:grid-cols-12">
<input className="md:col-span-3 rounded-md border px-3 py-2" placeholder="productId (tuỳ)"
value={it.productId} onChange={(e) => changeItem(idx, 'productId', e.target.value)} />
<input className="md:col-span-4 rounded-md border px-3 py-2" placeholder="Tên sản phẩm"
value={it.name} onChange={(e) => changeItem(idx, 'name', e.target.value)} />
<input className="md:col-span-2 rounded-md border px-3 py-2" type="number" min="0" placeholder="Đơn giá"
value={it.unitPrice} onChange={(e) => changeItem(idx, 'unitPrice', e.target.value)} />
<input className="md:col-span-2 rounded-md border px-3 py-2" type="number" min="1" placeholder="Số lượng"
value={it.quantity} onChange={(e) => changeItem(idx, 'quantity', e.target.value)} />
<button type="button" onClick={() => removeItem(idx)} className="md:col-span-1 rounded border px-2 py-2 text-rose-700 hover:bg-rose-50">Xoá</button>
</div>
))}
</div>
<div className="flex items-center justify-between p-3">
<button type="button" onClick={addItem} className="rounded border px-3 py-2 hover:bg-gray-50">+ Thêm dòng</button>
<div className="text-right text-sm">
<div>Tạm tính: <b>{formatVND(subtotal)}</b></div>
<div>Tổng cộng: <b>{formatVND(total)}</b></div>
</div>
</div>
</div>


<div className="flex gap-3">
<button disabled={submitting} type="submit" className="rounded-md bg-black px-4 py-2 text-white hover:opacity-90 disabled:opacity-50">Lưu</button>
<button type="button" onClick={() => history.back()} className="rounded-md border px-4 py-2 hover:bg-gray-50">Huỷ</button>
</div>
</form>
);



function formatVND(n) {
try { return Number(n).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }); } catch { return n; }
}