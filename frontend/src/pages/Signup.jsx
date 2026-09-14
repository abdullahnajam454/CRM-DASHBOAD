import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event) => { event.preventDefault(); setLoading(true); setMessage(""); try { await apiRequest("/auth/register", { method: "POST", body: JSON.stringify(formData) }); navigate("/login"); } catch (error) { setMessage(error.message); } finally { setLoading(false); } };
  return <main className="auth-page"><section className="auth-art"><div className="auth-brand"><span className="brand-mark">N</span><span>northstar</span></div><div><h1>Turn your<br /><em>pipeline</em><br />into progress.</h1><p>Bring your team, conversations, and opportunities into one focused workspace.</p></div><span className="eyebrow" style={{ color: "#778078" }}>Revenue intelligence · 2026</span></section><section className="auth-card-wrap"><div className="auth-card"><p className="section-kicker">Start clearly</p><h2>Create your workspace</h2><p>Set up your first revenue command center.</p><form className="auth-form" onSubmit={submit}><label>Full name<input required value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} placeholder="Jordan Davis" /></label><label>Email address<input required type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} placeholder="you@company.com" /></label><label>Password<input required minLength="6" type="password" value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} placeholder="At least 6 characters" /></label><button className="primary-button">{loading ? "Creating..." : "Create workspace →"}</button></form>{message && <p className="auth-message">{message}</p>}<p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p></div></section></main>;
};

export default Signup;
