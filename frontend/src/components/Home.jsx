const Home = () => {
  const handleLogin = () => {
    window.location.href = "http://localhost:4000/auth/strava";
  };

  return (
    <div>
      <h1>RunBalance</h1>
      <button onClick={handleLogin}>Connect with Strava</button>
    </div>
  );
};

export default Home;
