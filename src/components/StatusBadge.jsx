'use client';


const map = {
DRAFT: { text: 'Nháp', className: 'bg-gray-100 text-gray-700 border-gray-200' },
PENDING: { text: 'Chờ', className: 'bg-amber-100 text-amber-800 border-amber-200' },
CONFIRMED: { text: 'Xác nhận', className: 'bg-blue-100 text-blue-800 border-blue-200' },
FULFILLED: { text: 'Đã giao', className: 'bg-purple-100 text-purple-800 border-purple-200' },
COMPLETED: { text: 'Hoàn tất', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
CANCELLED: { text: 'Hủy', className: 'bg-rose-100 text-rose-800 border-rose-200' },
REFUNDED: { text: 'Hoàn tiền', className: 'bg-teal-100 text-teal-800 border-teal-200' },
};


export default function StatusBadge({ value }) {
const info = map[value] || { text: value, className: 'bg-gray-100 text-gray-700 border-gray-200' };
return (
<span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${info.className}`}>
{info.text}
</span>
);
}