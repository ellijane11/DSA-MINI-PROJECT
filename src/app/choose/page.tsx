import React from "react";
import Link from "next/link";

const ChooseRolePage = () => {
    return (
        <div className="choose-role-container min-h-screen  bg-[#01003d] text-white flex flex-col items-center justify-center">
            <h1 className="main-title text-4xl font-bold mb-4">Ride It</h1>
            <h2 className="subtitle text-2xl font-semibold mb-8">Choose Your Role</h2>

            <div className="roles flex flex-col sm:flex-row gap-6">
                <Link
                    href="/passenger"
                    className="role-card bg-blue-100 hover:bg-blue-200 text-blue-900 px-6 py-4 rounded-lg shadow-md text-lg font-medium text-center transition-colors duration-200"
                >
                    <span>Are you a passenger 👥</span>
                </Link>

                <Link
                    href="/driver"
                    className="role-card bg-green-100 hover:bg-green-200 text-green-900 px-6 py-4 rounded-lg shadow-md text-lg font-medium text-center transition-colors duration-200"
                >
                    <span>Are you a driver 🚗</span>
                </Link>
            </div>
        </div>
    );
};

export default ChooseRolePage;

