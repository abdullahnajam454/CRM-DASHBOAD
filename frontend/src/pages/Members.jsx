import { useEffect, useState } from "react";
import { apiRequest, handleSessionError } from "../lib/api";

const emptyMember = { name: "", email: "", password: "", role: "member" };

const Members = () => {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(emptyMember);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadMembers = async () => {
    try { setLoading(true); const data = await apiRequest("/members"); setMembers(data.members || []); }
    catch (error) { handleSessionError(error); setMessage(error.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadMembers(); }, []);

  const createMember = async (event) => {
    event.preventDefault(); setMessage("");
    try { await apiRequest("/members", { method: "POST", body: JSON.stringify(form) }); setForm(emptyMember); setOpen(false); await loadMembers(); }
    catch (error) { handleSessionError(error); setMessage(error.message); }
  };

  const updateRole = async (memberId, role) => {
    try {
      await apiRequest(`/members/${memberId}`, { method: "PATCH", body: JSON.stringify({ role }) });
      await loadMembers();
    } catch (error) { handleSessionError(error); setMessage(error.message); }
  };

  const removeMember = async (id) => {
    if (!window.confirm("Remove this member from the organization?")) return;
    try { await apiRequest(`/members/${id}`, { method: "DELETE" }); await loadMembers(); }
    catch (error) { handleSessionError(error); setMessage(error.message); }
  };

  return <section className="page-stack">
    <div className="page-intro"><div><p className="section-kicker">People & access</p><h2>Members</h2><p className="section-description">Build the team behind your pipeline and keep access intentional.</p></div><button className="primary-button" onClick={() => setOpen(true)}><span>＋</span> Add member</button></div>
    {message && <div className="toast-error">{message}</div>}
    <div className="member-summary"><div><span className="summary-label">Active seats</span><strong>{members.length}</strong></div><div><span className="summary-label">Workspace role</span><strong>Collaborative</strong></div><div><span className="summary-label">Last synced</span><strong>Just now</strong></div></div>
    <div className="panel member-panel"><div className="panel-heading"><div><h3>People in Acme Collective</h3><p>Manage roles and access for your revenue team.</p></div><button className="ghost-button" onClick={loadMembers}>↻ Refresh</button></div>{loading ? <div className="empty-state">Loading your team...</div> : <div className="member-list">{members.map((member) => <div className="member-row" key={member._id}><div className="member-person"><span className="member-avatar">{member.userId?.name?.slice(0, 2).toUpperCase() || "NA"}</span><div><strong>{member.userId?.name || "Unknown member"}</strong><span>{member.userId?.email}</span></div></div>{member.role === "owner" ? <span className={`role-pill ${member.role}`}>{member.role}</span> : <select className={`role-select ${member.role}`} value={member.role} onChange={(event) => updateRole(member._id, event.target.value)}><option value="member">member</option><option value="admin">admin</option></select>}<span className="member-joined">Joined {new Date(member.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>{member.role !== "owner" && <button className="row-action danger" onClick={() => removeMember(member._id)} title="Remove member">⌫</button>}</div>)}</div>}</div>
    {open && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}><form className="modal" onSubmit={createMember}><div className="modal-heading"><div><p className="section-kicker">New teammate</p><h3>Invite a member</h3></div><button type="button" className="close-button" onClick={() => setOpen(false)}>×</button></div><label>Full name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Alex Morgan" /></label><label>Email address<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="alex@company.com" /></label><label>Temporary password<input required type="password" minLength="6" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="At least 6 characters" /></label><label>Role<select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}><option value="member">Member</option><option value="admin">Admin</option></select></label><button className="primary-button full-button">Create member</button></form></div>}
  </section>;
};

export default Members;