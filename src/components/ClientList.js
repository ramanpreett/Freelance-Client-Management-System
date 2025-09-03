import React from "react";

const ClientList = ({ clients, onDelete }) => (
  <ul>
    {clients.map(client => (
      <li key={client._id} className="flex justify-between items-center border-b py-2">
        <span>
          {client.name} <span className="text-xs text-gray-500">({client.email})</span>
          {client.tags.map(tag => (
            <span key={tag} className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">{tag}</span>
          ))}
        </span>
        <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => onDelete(client._id)}>Delete</button>
      </li>
    ))}
  </ul>
);

export default ClientList;
