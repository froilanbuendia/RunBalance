exports.computeInjuryRisk = (acute, chronic) => {
  if (!chronic || chronic === 0) {
    return {
      acuteMiles: acute || 0,
      chronicMiles: chronic || 0,
      acwr: 0,
      risk: "NO_DATA",
    };
  }

  const acwr = acute / chronic;

  let risk = "LOW";
  if (acwr > 1.3) risk = "MODERATE";
  if (acwr > 1.5) risk = "HIGH";

  return {
    acuteMiles: Number(acute.toFixed(1)),
    chronicMiles: Number(chronic.toFixed(1)),
    acwr: Number(acwr.toFixed(2)),
    risk,
  };
};
