import React, { useEffect, useState } from "react";
import axios from "axios";
import InvoiceForm from "./InvoiceForm";
import InvoiceList from "./InvoiceList";
import { generateInvoicePDF } from "../utils/pdfExport";

const API_URL = process.env.REACT_APP_API_URL + "/invoices";
const CLIENTS_URL = process.env.REACT_APP_API_URL + "/clients";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState("");

  const fetchInvoices = async () => {
    try {
      const res = await axios.get(API_URL, { headers: { Authorization: localStorage.getItem("token") } });
      setInvoices(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await axios.get(CLIENTS_URL, { headers: { Authorization: localStorage.getItem("token") } });
      setClients(res.data);
    } catch {}
  };

  useEffect(() => {
    fetchInvoices();
    fetchClients();
  }, []);

  const addInvoice = async (invoice) => {
    try {
      await axios.post(API_URL, invoice, { headers: { Authorization: localStorage.getItem("token") } });
      fetchInvoices();
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const deleteInvoice = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: localStorage.getItem("token") } });
      fetchInvoices();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const markPaid = async (id) => {
    try {
      await axios.patch(`${API_URL}/${id}/paid`, {}, { headers: { Authorization: localStorage.getItem("token") } });
      fetchInvoices();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const exportPDF = async (invoice) => {
    try {
      const client = clients.find(c => c._id === invoice.client);
      generateInvoicePDF(invoice, client);
    } catch (err) {
      setError("Failed to generate PDF: " + err.message);
    }
  };

  return (
    <section className="bg-white rounded shadow p-4">
      <h2 className="text-xl font-semibold mb-2">Invoices</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <InvoiceForm clients={clients} onSave={addInvoice} />
      <InvoiceList invoices={invoices} clients={clients} onDelete={deleteInvoice} onMarkPaid={markPaid} onExportPDF={exportPDF} />
    </section>
  );
};

export default Invoices;
