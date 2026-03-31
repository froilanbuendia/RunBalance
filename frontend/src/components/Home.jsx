import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "../pages/home.css";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const features = [
  {
    icon: "📊",
    title: "Interactive Training Charts",
    desc: "Visualize your mileage, pace trends, and weekly load over time with charts built to surface what matters.",
  },
  {
    icon: "🛡️",
    title: "Injury Risk Monitoring",
    desc: "Track your acute-to-chronic workload ratio so you can push hard without tipping into the danger zone.",
  },
  {
    icon: "🔥",
    title: "Activity Heatmap & Insights",
    desc: "See your training consistency at a glance and uncover patterns across your entire Strava history.",
  },
];

const StravaLogo = () => (
  <svg
    className="strava-icon"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M17.2 28.8L13 20.8H7L17.2 40L27.4 20.8H21.4L17.2 28.8Z"
      fill="white"
    />
    <path
      d="M17.2 0L7 20H13L17.2 11.2L21.4 20H27.4L17.2 0Z"
      fill="white"
      fillOpacity="0.7"
    />
  </svg>
);

const Home = () => {
  const handleLogin = () => {
    window.location.href = "http://localhost:4000/auth/strava";
  };

  return (
    <div className="home">
      {/* Top bar */}
      <header className="home-topbar">
        <span className="home-brand">
          LetMe<span>Run</span>
        </span>
      </header>

      {/* Hero */}
      <motion.main
        className="home-hero"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={fadeUp} className="home-eyebrow">
          <span className="home-eyebrow-dot" />
          Powered by your Strava data
        </motion.div>

        <motion.h1 variants={fadeUp} className="home-headline">
          Train smarter.
          <br />
          Stay <em>injury&#8209;free</em>.
        </motion.h1>

        <motion.p variants={fadeUp} className="home-subheadline">
          LetMeRun turns your Strava activities into actionable insights — so
          you can build fitness consistently without breaking down.
        </motion.p>

        <motion.button
          variants={fadeUp}
          className="strava-btn"
          onClick={handleLogin}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <StravaLogo />
          Connect with Strava
        </motion.button>

        <motion.p variants={fadeUp} className="home-disclaimer">
          Free to use &nbsp;·&nbsp; Read-only access &nbsp;·&nbsp; No credit
          card required
        </motion.p>
      </motion.main>

      {/* Feature cards */}
      <motion.section
        className="home-features"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {features.map((f) => (
          <motion.div key={f.title} className="feature-card" variants={fadeUp}>
            <div className="feature-icon">{f.icon}</div>
            <p className="feature-title">{f.title}</p>
            <p className="feature-desc">{f.desc}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* Footer */}
      <footer className="home-footer">
        <span>© {new Date().getFullYear()} LetMeRun</span>
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms of Service</Link>
      </footer>
    </div>
  );
};

export default Home;
