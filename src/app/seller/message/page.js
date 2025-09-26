"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Store } from "lucide-react";

export default function SellerQuestionsPage() {
  // Câu hỏi từ khách hàng (giả lập)
  const [questions, setQuestions] = useState([
    { id: 1, user: "Khách 1", question: "Sản phẩm này có bảo hành không?", answer: "Có, bảo hành 12 tháng." },
    { id: 2, user: "Khách 2", question: "Phí ship là bao nhiêu?", answer: null },
    { id: 3, user: "Khách 3", question: "Có đủ size không?", answer: null },
  ]);

  const [newAnswer, setNewAnswer] = useState("");

  // Người bán trả lời câu hỏi
  const handleAnswer = (id) => {
    if (!newAnswer.trim()) return;
    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, answer: newAnswer } : q
      )
    );
    setNewAnswer("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6 flex items-center space-x-3 border mb-8"
      >
        <Store size={28} className="text-yellow-700" />
        <h1 className="text-2xl font-bold text-yellow-700">Quản lý Câu hỏi từ Khách hàng</h1>
      </motion.div>

      {/* Danh sách câu hỏi */}
      <div className="space-y-6">
        {questions.map((q) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow p-6"
          >
            <div className="flex items-center space-x-3 mb-2">
              <MessageCircle className="text-yellow-600" size={20} />
              <p className="font-semibold text-gray-800">{q.user} hỏi:</p>
            </div>
            <p className="ml-8 text-gray-700">{q.question}</p>

            {q.answer ? (
              <div className="mt-3 ml-8 border-l-4 border-yellow-500 pl-4 text-gray-800">
                <p><b>Bạn đã trả lời:</b> {q.answer}</p>
              </div>
            ) : (
              <div className="mt-3 ml-8 flex">
                <input
                  type="text"
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Nhập câu trả lời..."
                  className="flex-1 border rounded-xl px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  onClick={() => handleAnswer(q.id)}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700"
                >
                  Trả lời
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
