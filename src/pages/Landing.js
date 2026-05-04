import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">

      {/* HERO */}
      <section className="hero">
        <h1>BaaS ⚡</h1>

        <p className="hero-sub">
          Build your backend in minutes.
          No servers. No complexity. Just API.
        </p>

        <div className="hero-buttons">
          <button onClick={() => navigate("/auth")}>
            Get Started
          </button>

          <button
            className="secondary"
            onClick={() => navigate("/docs")}
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
            Create, read, update and delete data instantly with REST APIs.
          </p>
        </div>

        <div className="card">
          <h3>🔐 Secure</h3>
          <p>
            API key-based authentication keeps your data protected.
          </p>
        </div>

        <div className="card">
          <h3>🧪 Built-in Tester</h3>
          <p>
            Test APIs directly in your browser like Postman.
          </p>
        </div>

        <div className="card">
          <h3>📊 Dashboard</h3>
          <p>
            Manage projects, API keys, and data visually.
          </p>
        </div>

      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Start building today 🚀</h2>
        <p>
          No setup required. Create your backend in seconds.
        </p>

        <button onClick={() => navigate("/auth")}>
          Create Free Account
        </button>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 BaaS — Built by you 🚀</p>
      </footer>

    </div>
  );
}

export default Landing;