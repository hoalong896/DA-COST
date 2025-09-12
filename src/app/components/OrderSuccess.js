"use client";
import React from "react";

export default function OrderSuccess({ order }) {
  if (!order) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md w-full text-black">
        <p className="text-green-600 font-bold mb-4">THANH TOÁN THÀNH CÔNG</p>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Mã đơn hàng:</strong> {order.ma_don_hang}
          </p>
          <p>
            <strong>Tổng tiền:</strong> {order.tong_tien.toLocaleString()}đ
          </p>
          <p>
            <strong>Phương thức:</strong> {order.phuong_thuc}
          </p>
          <p>
            <strong>Người nhận:</strong> {order.nguoi_nhan}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {order.dia_chi}
          </p>
          <p>
            <strong>Thời gian:</strong> {order.thoi_gian}
          </p>
        </div>
        <div className="flex justify-between mt-6">
          <a
            href="/home2/orders"
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Xem đơn hàng
          </a>
          <a
            href="/home2"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Tiếp tục mua sắm
          </a>
        </div>
      </div>
    </div>
  );
}
