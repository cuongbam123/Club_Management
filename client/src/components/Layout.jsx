import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Navbar cố định */}
            <Navbar />

            {/* Nội dung chính, chừa khoảng trống cho Navbar */}
            <main className="flex-1 pt-[170px] px-6">
                <Outlet />
            </main>
        </div>
    );
}
