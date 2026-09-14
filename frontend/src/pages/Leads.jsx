import { useEffect, useState } from "react";
import { apiRequest, handleSessionError } from "../lib/api";

const blankLead = {
  name: "",
  email: "",
  phone: "",
  company: "",
  source: "website",
  stage: "new",
  priority: "medium",
  dealValue: "",
};

const filters = ["all", "new", "qualified", "proposal", "won", "lost"];

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState(blankLead);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [totalLeads, setTotalLeads] = useState(0);

  const loadLeads = async (searchTerm = search, stage = filter) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: "1", limit: "100" });
      if (searchTerm.trim()) params.set("search", searchTerm.trim());
      if (stage !== "all") params.set("stage", stage);

      const data = await apiRequest(`/leads/search?${params.toString()}`);
      setLeads(data.leads || []);
      setTotalLeads(data.totalLeads || 0);
    } catch (error) {
      handleSessionError(error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadLeads(search, filter);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [search, filter]);

  const saveLead = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const path = editing ? `/leads/${editing._id}` : "/leads";
      await apiRequest(path, {
        method: editing ? "PATCH" : "POST",
        body: JSON.stringify({ ...form, dealValue: Number(form.dealValue || 0) }),
      });
      setOpen(false);
      setEditing(null);
      setForm(blankLead);
      await loadLeads(search, filter);
    } catch (error) {
      handleSessionError(error);
      setMessage(error.message);
    }
  };

  const deleteLead = async (id) => {
    if (!window.confirm("Delete this lead permanently?")) return;

    try {
      await apiRequest(`/leads/${id}`, { method: "DELETE" });
      await loadLeads(search, filter);
    } catch (error) {
      handleSessionError(error);
      setMessage(error.message);
    }
  };

  const openEdit = (lead) => {
    setEditing(lead);
    setForm({ ...lead, dealValue: lead.dealValue || "" });
    setOpen(true);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(blankLead);
    setOpen(true);
  };

  return (
    <section className="page-stack">
      <div className="page-intro">
        <div>
          <p className="section-kicker">Revenue pipeline</p>
          <h2>Leads</h2>
          <p className="section-description">Every opportunity, one clear next step.</p>
        </div>
        <button className="primary-button" onClick={openCreate}><span>＋</span> New lead</button>
      </div>

      {message && <div className="toast-error">{message}</div>}

      <div className="lead-toolbar">
        <div className="search-box">
          <span>⌕</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search names, companies, emails..."
            aria-label="Search leads"
          />
          {loading && <span className="search-spinner" aria-label="Searching" />}
        </div>
        <div className="filter-tabs">
          {filters.map((item) => (
            <button className={filter === item ? "selected" : ""} key={item} onClick={() => setFilter(item)}>
              {item === "all" ? "All leads" : item}
            </button>
          ))}
        </div>
        <button className="ghost-button" onClick={() => loadLeads(search, filter)} title="Refresh leads">↻</button>
      </div>

      <div className="results-caption">{loading ? "Searching pipeline..." : `${totalLeads} lead${totalLeads === 1 ? "" : "s"} found`}</div>

      <div className="panel leads-panel">
        {loading ? (
          <div className="loading-state compact"><span className="loader" /><p>Searching leads...</p></div>
        ) : leads.length === 0 ? (
          <div className="empty-state"><span className="empty-symbol">⌁</span><h3>No leads found</h3><p>Try another search or add a new opportunity.</p><button className="primary-button" onClick={openCreate}>Add your first lead</button></div>
        ) : (
          <div className="leads-table">
            <div className="table-head"><span>Lead</span><span>Company</span><span>Source</span><span>Stage</span><span>Priority</span><span>Deal value</span><span /></div>
            {leads.map((lead) => (
              <div className="table-row" key={lead._id}>
                <div className="lead-cell"><span className="lead-avatar">{lead.name?.slice(0, 2).toUpperCase()}</span><div><strong>{lead.name}</strong><span>{lead.email}</span></div></div>
                <span>{lead.company}</span>
                <span className="source-text">{lead.source}</span>
                <span className={`stage-pill stage-${lead.stage}`}>{lead.stage}</span>
                <span className={`priority-text priority-${lead.priority}`}>{lead.priority}</span>
                <strong>${Number(lead.dealValue || 0).toLocaleString()}</strong>
                <div className="row-actions"><button className="row-action" onClick={() => openEdit(lead)} title="Edit lead">✎</button><button className="row-action danger" onClick={() => deleteLead(lead._id)} title="Delete lead">⌫</button></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {open && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}><form className="modal wide-modal" onSubmit={saveLead}><div className="modal-heading"><div><p className="section-kicker">{editing ? "Update opportunity" : "Add to pipeline"}</p><h3>{editing ? "Edit lead" : "New lead"}</h3></div><button type="button" className="close-button" onClick={() => setOpen(false)}>×</button></div><div className="form-grid"><label>Full name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Sarah Chen" /></label><label>Work email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="sarah@company.com" /></label><label>Phone number<input required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="+1 555 0123" /></label><label>Company<input required value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} placeholder="Acme Inc." /></label><label>Source<select value={form.source} onChange={(event) => setForm({ ...form, source: event.target.value })}>{["website", "referral", "linkedin", "cold-call", "other"].map((item) => <option key={item}>{item}</option>)}</select></label><label>Stage<select value={form.stage} onChange={(event) => setForm({ ...form, stage: event.target.value })}>{["new", "qualified", "proposal", "won", "lost"].map((item) => <option key={item}>{item}</option>)}</select></label><label>Priority<select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>{["low", "medium", "high"].map((item) => <option key={item}>{item}</option>)}</select></label><label>Deal value<input type="number" min="0" value={form.dealValue} onChange={(event) => setForm({ ...form, dealValue: event.target.value })} placeholder="25000" /></label></div><button className="primary-button full-button">{editing ? "Save changes" : "Create lead"}</button></form></div>}
    </section>
  );
};

export default Leads;
