import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">

      {/* HERO */}
      <section className="hero">
        <h1>BaaS ⚡</h1>

        <p>
          Build your backend in minutes.  
          No servers. No complexity. Just API.
        </p>

        <div style={{ marginTop: 20 }}>
          <button onClick={() => navigate("/auth")}>
            Get Started
          </button>

          <button
            onClick={() => navigate("/docs")}
            style={{ marginLeft: 10 }}
          >
            View Docs
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">

        <div className="card">
          <h3>⚡ Instant API</h3>
          <p>
            Create, read, update and delete data instantly with simple REST APIs.
          </p>
        </div>

        <div className="card">
          <h3>🔐 Secure</h3>
          <p>
            Protect your data using API keys and authentication.
          </p>
        </div>

        <div className="card">
          <h3>📊 Dashboard</h3>
          <p>
            Manage your collections and data visually like a real database.
          </p>
        </div>

      </section>

      {/* CTA SECTION */}
      <section style={{ marginTop: 80 }}>
        <h2>Start building today 🚀</h2>
        <p style={{ color: "#94a3b8" }}>
          No setup required. Just login and go.
        </p>

        <button
          onClick={() => navigate("/auth")}
          style={{ marginTop: 15 }}
        >
          Create Account
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{ marginTop: 80 }}>
        <p>Built with ❤️ by you</p>
      </footer>

    </div>
  );
}

export default Landing;