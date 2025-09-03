import React, { useState } from "react";

const TAGS = ["VIP", "Ongoing", "Potential"];

const ClientForm = ({ onSave }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tags, setTags] = useState([]);

  const handleTagChange = (tag) => {
    setTags(tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, email, tags });
    setName("");
    setEmail("");
    setTags([]);
  };

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <input className="border p-2 w-full" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
      <input className="border p-2 w-full" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <div>
        {TAGS.map(tag => (
          <label key={tag} className="mr-2">
            <input type="checkbox" checked={tags.includes(tag)} onChange={() => handleTagChange(tag)} /> {tag}
          </label>
        ))}
      </div>
      <button className="bg-blue-500 text-white px-3 py-1 rounded" type="submit">Save Client</button>
    </form>
  );
};

export default ClientForm;
