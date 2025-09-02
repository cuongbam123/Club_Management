import React from "react";

function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-full bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Đăng nhập Admin</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-4"
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          className="w-full p-2 border rounded mb-4"
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Đăng nhập
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
