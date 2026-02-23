import React from "react";
import DashboardLayout from "../layouts/HomeLayout";
import UniversityList from "../components/Explore/UniversityList";

const ExplorePage: React.FC = () => {
    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto w-full">
                <UniversityList />
            </div>
        </DashboardLayout>
    );
};

export default ExplorePage;
