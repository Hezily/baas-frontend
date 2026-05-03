import React from "react";

function Docs() {
  const API = "https://baas-backend-production.up.railway.app";

  return (
    <div className="container">

      <h1>BaaS API Docs 🚀</h1>

      {/* BASE URL */}
      <h2>Base URL</h2>
      <pre>{API}</pre>

      {/* QUICK START */}
      <h2>⚡ Quick Start</h2>
      <pre>
{`1. Create account from dashboard
2. Create a project
3. Generate API key
4. Use API below`}
      </pre>

      {/* AUTH */}
      <h2>🔐 Authentication</h2>
      <pre>
{`Authorization: Bearer YOUR_API_KEY`}
      </pre>

      {/* CREATE */}
      <h2>➕ Create Data</h2>
      <pre>
{`curl -X POST ${API}/api/data/users \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{"json":{"name":"Rahul","age":22}}'`}
      </pre>

      {/* GET */}
      <h2>📥 Get Data</h2>
      <pre>
{`curl ${API}/api/data/users \\
-H "Authorization: Bearer YOUR_API_KEY"`}
      </pre>

      {/* FILTER */}
      <h2>🔍 Filter Data</h2>
      <pre>
{`curl "${API}/api/data/users?field=name&value=Rahul" \\
-H "Authorization: Bearer YOUR_API_KEY"`}
      </pre>

      {/* UPDATE */}
      <h2>✏️ Update Data</h2>
      <pre>
{`curl -X PUT ${API}/api/data/users/1 \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{"json":{"name":"Rahul Updated"}}'`}
      </pre>

      {/* DELETE */}
      <h2>🗑 Delete Data</h2>
      <pre>
{`curl -X DELETE ${API}/api/data/users/1 \\
-H "Authorization: Bearer YOUR_API_KEY"`}
      </pre>

      {/* RESPONSE */}
      <h2>📦 Example Response</h2>
      <pre>
{`{
  "id": 1,
  "project_id": 1,
  "json_data": {
    "name": "Rahul",
    "age": 22
  },
  "created_at": "2026-05-03T21:11:59.442Z"
}`}
      </pre>

    </div>
  );
}

export default Docs;