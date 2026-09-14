import { useEffect, useState } from "react";
import { apiRequest, handleSessionError } from "../lib/api";

const stages = ["new", "qualified", "proposal", "won", "lost"];
const sources = ["website", "referral", "linkedin", "cold-call", "other"];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setError("");
      const [statsData, leadsData] = await Promise.all([apiRequest("/leads/stats"), apiRequest("/leads")]);
      setStats(statsData.stats || statsData);
      setLeads(leadsData.leads || []);
    } catch (requestError) {
      handleSessionError(requestError);
      setError(requestError.message);
    }
  };

  useEffect(() => { loadDashboard(); }, []);

  if (error) return <div className="error-state"><span>!</span><h3>Couldn&apos;t load your workspace</h3><p>{error}</p><button className="primary-button" onClick={loadDashboard}>Try again</button></div>;
  if (!stats) return <div className="loading-state"><span className="loader" /><p>Preparing your workspace...</p></div>;

  const recentLeads = [...leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const maxStage = Math.max(...stages.map((stage) => stats.stageStatistics?.[stage] || 0), 1);

  return <section className="page-stack">
    <div className="page-intro dashboard-intro"><div><p className="section-kicker">Monday, September 14, 2026</p><h2>Good morning, Jordan <span className="wave">✦</span></h2><p className="section-description">Here&apos;s the pulse of your revenue engine today.</p></div><button className="ghost-button" onClick={loadDashboard}>↻ Refresh data</button></div>
    <div className="metric-grid">
      <article className="metric-card accent-coral"><div className="metric-top"><span className="metric-label">Total leads</span><span className="metric-icon">↗</span></div><strong>{stats.totalLeads}</strong><span className="metric-trend positive">↑ 12.8% <small>vs last month</small></span></article>
      <article className="metric-card accent-lime"><div className="metric-top"><span className="metric-label">Pipeline value</span><span className="metric-icon">◈</span></div><strong>${Number(stats.totalDealValue || 0).toLocaleString()}</strong><span className="metric-trend positive">↑ 8.4% <small>vs last month</small></span></article>
      <article className="metric-card accent-sky"><div className="metric-top"><span className="metric-label">Average deal</span><span className="metric-icon">⌁</span></div><strong>${Number(stats.averageDealValue || 0).toLocaleString()}</strong><span className="metric-trend neutral">Across all active deals</span></article>
      <article className="metric-card accent-ink"><div className="metric-top"><span className="metric-label">Win rate</span><span className="metric-icon">✦</span></div><strong>{Number(stats.conversionRate || 0).toFixed(1)}%</strong><span className="metric-trend positive">↑ 4.2% <small>vs last month</small></span></article>
    </div>
    <div className="dashboard-grid">
      <article className="panel stage-panel"><div className="panel-heading"><div><h3>Pipeline movement</h3><p>Lead volume by current stage</p></div><span className="period-label">This month ·⌄</span></div><div className="stage-chart">{stages.map((stage) => <div className="stage-bar-row" key={stage}><span>{stage}</span><div className="bar-track"><div className={`bar-fill bar-${stage}`} style={{ width: `${((stats.stageStatistics?.[stage] || 0) / maxStage) * 100}%` }} /></div><strong>{stats.stageStatistics?.[stage] || 0}</strong></div>)}</div></article>
      <article className="panel source-panel"><div className="panel-heading"><div><h3>Lead sources</h3><p>Where your opportunities start</p></div></div><div className="source-list">{sources.map((source) => <div className="source-row" key={source}><span className={`source-dot source-${source}`} /><span>{source}</span><strong>{stats.sourceStatistics?.[source] || 0}</strong></div>)}</div></article>
    </div>
    <article className="panel recent-panel"><div className="panel-heading"><div><h3>Recent leads</h3><p>The latest movement in your pipeline</p></div><a className="text-link" href="/leads">View all leads <span>→</span></a></div>{recentLeads.length === 0 ? <div className="empty-state">Your first lead is waiting to be added.</div> : <div className="compact-table"><div className="table-head"><span>Lead</span><span>Company</span><span>Stage</span><span>Value</span></div>{recentLeads.map((lead) => <div className="table-row" key={lead._id}><div className="lead-cell"><span className="lead-avatar">{lead.name?.slice(0, 2).toUpperCase()}</span><div><strong>{lead.name}</strong><span>{lead.email}</span></div></div><span>{lead.company}</span><span className={`stage-pill stage-${lead.stage}`}>{lead.stage}</span><strong>${Number(lead.dealValue || 0).toLocaleString()}</strong></div>)}</div>}</article>
  </section>;
};

export default Dashboard;
