import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event) => { 
    event.preventDefault(); 
    setLoading(true); 
    setMessage(""); 
    try {
         await apiRequest("/auth/login", {
             method: "POST", body: JSON.stringify(formData) });
              sessionStorage.setItem("crm-authenticated", "true");
               navigate("/dashboard");
             } 
             catch (error) {
                 setMessage(error.message); 
                } finally {
                     setLoading(false); 
                    } 
                };
  return <main className="auth-page">
    <section className="auth-art">
        <div className="auth-brand">
            <span className="brand-mark">N</span>
            <span>northstar</span>
            </div>
            <div><h1>Make every<br /><em>conversation</em><br />count.</h1><p>A sharper command center for the relationships that move your business forward.</p></div>
            <span className="eyebrow" style={{ color: "#778078" }}>Revenue intelligence · 2026</span>
            </section>
            <section className="auth-card-wrap">
                <div className="auth-card">
                    <p className="section-kicker">Welcome back</p>
                    <h2>Sign in to northstar</h2>
                    <p>Pick up where your team left off.</p>
                    <form className="auth-form" onSubmit={submit}>
                        <label>Email address
                            <input required type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} placeholder="you@company.com" />
                        </label>
                        <label>Password
                            <input required type="password" value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} placeholder="Enter your password" />
                        </label>
                        <button className="primary-button">{loading ? "Signing in..." : "Enter workspace →"}</button>
                    </form>
                    {message && <p className="auth-message">{message}</p>}
                    <p className="auth-footer">New to northstar? <Link to="/signup">Create an account</Link></p>
                </div>
            </section>
        </main>;
};

export default Login;
