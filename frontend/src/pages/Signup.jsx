import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "user"
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
                "http://localhost:5000/api/auth/register",
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
                    data.error || "Registration failed"
                );

            }


            setMessage(
                "Registration successful! Please login."
            );


            setTimeout(() => {
                navigate("/login");
            }, 1000);


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
                    Create Account
                </h1>


                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                        required
                    />


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
                        {loading
                            ? "Creating..."
                            : "Create Account"
                        }
                    </button>

                </form>


                {message && (
                    <p className="mt-4 text-center">
                        {message}
                    </p>
                )}


                <p className="mt-5 text-center">

                    Already have an account?

                    <Link
                        to="/login"
                        className="ml-2 text-blue-600"
                    >
                        Login
                    </Link>

                </p>

            </div>

        </div>
    );
};

export default Signup;