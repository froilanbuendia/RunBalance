exports.computeInjuryRisk = (acute, chronic) => {
  if (!chronic || chronic === 0) {
    return { acwr: 0, risk: "NO_DATA" };
  }

  const acwr = acute / chronic;

  let risk = "LOW";
  if (acwr > 1.3) risk = "MODERATE";
  if (acwr > 1.5) risk = "HIGH";

  return {
    acuteMiles: acute,
    chronicMiles: chronic,
    acwr: Number(acwr.toFixed(2)),
    risk,
  };
};
