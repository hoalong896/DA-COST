"use client";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50">
      <video
        autoPlay
        muted
        playsInline
        loop
        className="w-screen h-screen object-cover"
      >
        <source src="/videos/loading.mp4" type="video/mp4" />
        Trình duyệt không hỗ trợ video.
      </video>
    </div>
  );
}
