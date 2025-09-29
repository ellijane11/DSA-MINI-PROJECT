import React from "react";
import Link from "next/link";

const ChooseRolePage = () => {
    return (
        <div className="choose-role-container">
            <h1 className="main-title">Ride It</h1>
            <h2 className="subtitle">Choose Your Role</h2>

            <div className="roles">
                <Link href="/passenger" className="role-card">
                    <span>Are you a passenger 👥</span>
                </Link>

                <Link href="/driver" className="role-card">
                    <span>Are you a driver 🚗</span>
                </Link>
            </div>
        </div>
    );
};

export default ChooseRolePage;
