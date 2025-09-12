// "use client";
// import { useEffect, useState } from "react";
// //import OrderSuccess from "@/components/OrderSuccess";

// export default function SuccessPage() {
//   const [order, setOrder] = useState(null);

//   useEffect(() => {
//     const saved = localStorage.getItem("lastOrder");
//     if (saved) {
//       setOrder(JSON.parse(saved));
//     }
//   }, []);

//   if (!order) {
//     return (
//       <div className="flex items-center justify-center min-h-screen text-black">
//         <p>❌ Không tìm thấy thông tin đơn hàng.</p>
//       </div>
//     );
//   }

//   return <OrderSuccess order={order} />;
// }
export default function SuccessPage() {
  return <div>Trang Success đang xây dựng...</div>;
}
