import { useEffect, useState } from "react";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchLeads = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/leads", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to fetch leads");
        return;
      }

      setLeads(data.leads || data);
    } catch (error) {
      setMessage("Server error");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Loading leads...</h1>
      </div>
    );
  }

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Leads
        </h1>

        <button
          onClick={fetchLeads}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Refresh
        </button>
      </div>

      {message && (
        <p className="text-red-500 mb-4">
          {message}
        </p>
      )}

      {leads.length === 0 ? (
        <p className="text-gray-500">
          No leads found.
        </p>
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full border-collapse">

            <thead>
              <tr className="border-b text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Company</th>
                <th className="p-3">Source</th>
                <th className="p-3">Stage</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Deal Value</th>
              </tr>
            </thead>

            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead._id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3">
                    {lead.name}
                  </td>

                  <td className="p-3">
                    {lead.email}
                  </td>

                  <td className="p-3">
                    {lead.phone}
                  </td>

                  <td className="p-3">
                    {lead.company}
                  </td>

                  <td className="p-3">
                    {lead.source}
                  </td>

                  <td className="p-3">
                    {lead.stage}
                  </td>

                  <td className="p-3">
                    {lead.priority}
                  </td>

                  <td className="p-3">
                    {lead.dealValue}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}

    </div>
  );
};

export default Leads;