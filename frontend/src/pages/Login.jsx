import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);
        setMessage("");

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    credentials: "include",

                    body: JSON.stringify(formData)
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error || "Login failed"
                );

            }


            setMessage("Login successful!");

            // Go to dashboard
            navigate("/dashboard");

        } catch (error) {

            setMessage(error.message);

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

                <h1 className="text-3xl font-bold mb-6">
                    Login
                </h1>


                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                        required
                    />


                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                        required
                    />


                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white p-3 rounded-lg"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>


                {message && (
                    <p className="mt-4 text-center">
                        {message}
                    </p>
                )}


                <p className="mt-5 text-center">

                    Don't have an account?

                    <Link
                        to="/signup"
                        className="ml-2 text-blue-600"
                    >
                        Signup
                    </Link>

                </p>

            </div>

        </div>
    );
};

export default Login;