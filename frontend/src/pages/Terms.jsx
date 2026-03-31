import { Link } from "react-router-dom";
import "./legal.css";

const Terms = () => (
  <div className="legal-page">
    <div className="legal-container">
      <Link to="/" className="legal-back">← Back</Link>

      <h1 className="legal-title">Terms of Service</h1>
      <p className="legal-meta">Effective date: March 31, 2025</p>

      <section className="legal-section">
        <h2>1. Acceptance</h2>
        <p>
          By connecting your Strava account to LetMeRun you agree to these
          Terms. If you do not agree, do not use the service.
        </p>
      </section>

      <section className="legal-section">
        <h2>2. Description of service</h2>
        <p>
          LetMeRun is a free training analysis tool that reads your Strava
          activity data to provide charts, metrics, and injury risk insights.
          The service is provided as-is with no guarantees of uptime or
          availability.
        </p>
      </section>

      <section className="legal-section">
        <h2>3. Your responsibilities</h2>
        <ul>
          <li>You must have a valid Strava account and comply with Strava's own terms of service.</li>
          <li>You are responsible for the accuracy of data synced from Strava.</li>
          <li>You must not attempt to reverse-engineer, scrape, or abuse the service.</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>4. Health & fitness disclaimer</h2>
        <p>
          LetMeRun provides training metrics and injury risk indicators for
          informational purposes only. Nothing in this app constitutes medical
          advice. Always consult a qualified healthcare professional before
          making changes to your training, especially if you have a history of
          injury or illness.
        </p>
      </section>

      <section className="legal-section">
        <h2>5. Limitation of liability</h2>
        <p>
          LetMeRun is provided "as is" without warranty of any kind. We are not
          liable for any damages arising from your use of, or inability to use,
          the service — including decisions made based on metrics or insights
          displayed in the app.
        </p>
      </section>

      <section className="legal-section">
        <h2>6. Termination</h2>
        <p>
          You may stop using the service at any time by revoking access in your
          Strava settings. We reserve the right to suspend or terminate access
          for any user who misuses the service.
        </p>
      </section>

      <section className="legal-section">
        <h2>7. Changes to these terms</h2>
        <p>
          We may revise these terms as the app grows. Continued use of the
          service after changes are posted constitutes acceptance of the new
          terms.
        </p>
      </section>

      <section className="legal-section">
        <h2>8. Contact</h2>
        <p>
          Questions? Open an issue on our{" "}
          <a
            href="https://github.com/froilanbuendia/RunBalance/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub repository
          </a>
          .
        </p>
      </section>
    </div>
  </div>
);

export default Terms;