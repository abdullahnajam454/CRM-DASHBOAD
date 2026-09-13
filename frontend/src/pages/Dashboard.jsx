import { useEffect, useState } from "react";

const Dashboard = () => {

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const fetchStats = async () => {

            try {

                const response = await fetch(
                    "http://localhost:5000/api/leads/stats",
                    {
                        credentials: "include"
                    }
                );


                const data = await response.json();


                if (!response.ok) {
                    throw new Error(
                        data.error || "Failed to fetch stats"
                    );
                }


                setStats(data);

            } catch (error) {

                setError(error.message);

            } finally {

                setLoading(false);

            }
        };


        fetchStats();

    }, []);


    if (loading) {
        return <p className="p-6">Loading...</p>;
    }


    if (error) {
        return (
            <p className="p-6 text-red-500">
                {error}
            </p>
        );
    }


    return (
        <div className="p-6">

            <h1 className="text-3xl font-bold mb-6">
                Dashboard
            </h1>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">


                <div className="bg-white shadow rounded-xl p-5">

                    <p className="text-gray-500">
                        Total Leads
                    </p>

                    <h2 className="text-3xl font-bold">
                        {stats.totalLeads}
                    </h2>

                </div>


                <div className="bg-white shadow rounded-xl p-5">

                    <p className="text-gray-500">
                        Deal Value
                    </p>

                    <h2 className="text-3xl font-bold">
                        Rs.{" "}
                        {stats.totalDealValue?.toLocaleString()}
                    </h2>

                </div>


                <div className="bg-white shadow rounded-xl p-5">

                    <p className="text-gray-500">
                        Average Deal
                    </p>

                    <h2 className="text-3xl font-bold">
                        Rs.{" "}
                        {stats.averageDealValue?.toLocaleString()}
                    </h2>

                </div>


                <div className="bg-white shadow rounded-xl p-5">

                    <p className="text-gray-500">
                        Conversion Rate
                    </p>

                    <h2 className="text-3xl font-bold">
                        {stats.conversionRate}%
                    </h2>

                </div>

            </div>

        </div>
    );
};

export default Dashboard;