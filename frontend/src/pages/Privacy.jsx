import { Link } from "react-router-dom";
import "./legal.css";

const Privacy = () => (
  <div className="legal-page">
    <div className="legal-container">
      <Link to="/" className="legal-back">← Back</Link>

      <h1 className="legal-title">Privacy Policy</h1>
      <p className="legal-meta">Effective date: March 31, 2025</p>

      <section className="legal-section">
        <h2>1. Overview</h2>
        <p>
          LetMeRun ("we", "us") is a read-only training analysis tool that
          connects to your Strava account to surface insights about your
          activities. We take your privacy seriously and only collect what is
          strictly necessary to provide the service.
        </p>
      </section>

      <section className="legal-section">
        <h2>2. Data we collect</h2>
        <p>When you authorize LetMeRun via Strava, we store:</p>
        <ul>
          <li>
            <strong>Profile info</strong> — your Strava ID, username, first
            name, last name, profile photo URL, city, state, and country.
          </li>
          <li>
            <strong>Activity data</strong> — name, type, distance, moving time,
            elapsed time, elevation gain, start date, timezone, average speed,
            max speed, average heart rate, max heart rate, and gear ID for each
            synced activity.
          </li>
          <li>
            <strong>Strava OAuth tokens</strong> — access token, refresh token,
            and expiry timestamp, used solely to fetch your data from Strava on
            your behalf.
          </li>
        </ul>
        <p>We do not collect passwords, payment information, or location tracks.</p>
      </section>

      <section className="legal-section">
        <h2>3. How we use your data</h2>
        <ul>
          <li>To display your training dashboard, charts, and history.</li>
          <li>To compute metrics such as mileage, pace trends, personal records, and injury risk scores.</li>
          <li>To re-fetch updated activities from Strava when you trigger a sync.</li>
        </ul>
        <p>
          We do not sell, rent, or share your data with any third parties. Your
          data is never used for advertising.
        </p>
      </section>

      <section className="legal-section">
        <h2>4. Read-only access</h2>
        <p>
          LetMeRun requests read-only Strava permissions. We cannot create,
          modify, or delete any activities or data on your Strava account.
        </p>
      </section>

      <section className="legal-section">
        <h2>5. Data storage</h2>
        <p>
          Your data is stored in a secured PostgreSQL database. OAuth tokens are
          stored server-side and are never exposed to the browser beyond the
          short-lived JWT used to authenticate your session.
        </p>
      </section>

      <section className="legal-section">
        <h2>6. Data retention & deletion</h2>
        <p>
          Your data is retained as long as you have an account with LetMeRun.
          To request deletion of all your data, revoke LetMeRun's access in
          your{" "}
          <a
            href="https://www.strava.com/settings/apps"
            target="_blank"
            rel="noopener noreferrer"
          >
            Strava app settings
          </a>{" "}
          and contact us. We will permanently delete your stored data within 30
          days.
        </p>
      </section>

      <section className="legal-section">
        <h2>7. Changes to this policy</h2>
        <p>
          We may update this policy as the app evolves. Material changes will
          be communicated by updating the effective date above.
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

export default Privacy;