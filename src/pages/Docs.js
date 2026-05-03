import React from "react";

function Docs() {
  const API = "https://baas-backend-production.up.railway.app";

  return (
    <div className="container">
      <h1>BaaS API Docs 🚀</h1>

      <h2>Base URL</h2>
      <pre>{API}</pre>

      <h2>Authentication</h2>
      <pre>
{`Authorization: Bearer YOUR_API_KEY`}
      </pre>

      <h2>Create Data</h2>
      <pre>
{`POST /api/data/users

Body:
{
  "json": {
    "name": "Rahul"
  }
}`}
      </pre>

      <h2>Get Data</h2>
      <pre>
{`GET /api/data/users`}
      </pre>

      <h2>Filter Data</h2>
      <pre>
{`GET /api/data/users?field=name&value=Rahul`}
      </pre>

      <h2>Update</h2>
      <pre>
{`PUT /api/data/users/1`}
      </pre>

      <h2>Delete</h2>
      <pre>
{`DELETE /api/data/users/1`}
      </pre>
    </div>
  );
}

export default Docs;