import React, { useEffect, useState } from "react";
import axios from "axios";
import ClientForm from "./ClientForm";
import ClientList from "./ClientList";
import AutomationPanel from "./AutomationPanel";

const API_URL = process.env.REACT_APP_API_URL + "/api/clients";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [showAutomation, setShowAutomation] = useState(false);

  const fetchClients = async () => {
    const res = await axios.get(API_URL, { headers: { Authorization: localStorage.getItem("token") } });
    setClients(res.data);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const addClient = async (client) => {
    await axios.post(API_URL, client, { headers: { Authorization: localStorage.getItem("token") } });
    fetchClients();
  };

  const deleteClient = async (id) => {
    await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: localStorage.getItem("token") } });
    fetchClients();
  };

  const handleClientCreated = (newClient) => {
    fetchClients(); // Refresh the client list
  };

  return (
    <section className="bg-white rounded shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Clients</h2>
        <button
          onClick={() => setShowAutomation(!showAutomation)}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          {showAutomation ? 'Hide Automation' : '🤖 Automation'}
        </button>
      </div>
      
      {showAutomation && (
        <div className="mb-6">
          <AutomationPanel onClientCreated={handleClientCreated} />
        </div>
      )}
      
      <ClientForm onSave={addClient} />
      <ClientList clients={clients} onDelete={deleteClient} />
    </section>
  );
};

export default Clients;
