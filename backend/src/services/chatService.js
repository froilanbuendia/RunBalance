const Anthropic = require("@anthropic-ai/sdk");
const { getRollingAcwr } = require("../repositories/metricsRepo");
const { getTrainingLoad } = require("./metricsService");
const { computeInjuryRisk } = require("./injuryRiskService");
const { getAthleteProfile } = require("../repositories/athletes");
const { getRunStats, getStreak, getPersonalRecords } = require("../repositories/activities");

const client = new Anthropic();

const formatPace = (seconds) => {
  if (!seconds) return "N/A";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}/mi`;
};

const buildSystemPrompt = async (athleteId) => {
  const [profile, acwrData, load, stats, streak, prs] = await Promise.all([
    getAthleteProfile(athleteId),
    getRollingAcwr(athleteId),
    getTrainingLoad(athleteId),
    getRunStats(athleteId),
    getStreak(athleteId),
    getPersonalRecords(athleteId),
  ]);

  const injury = acwrData
    ? computeInjuryRisk(acwrData.acute_load, acwrData.chronic_load)
    : { acwr: 0, risk: "NO_DATA", acuteMiles: 0, chronicMiles: 0 };

  const name = profile?.firstname ?? "Athlete";

  return `You are a knowledgeable running coach assistant inside LetMeRun, a training analysis app.
You are talking to ${name}.

ATHLETE'S CURRENT TRAINING DATA:
- This week's mileage: ${Number(load?.miles ?? 0).toFixed(1)} miles
- Last week's mileage: ${Number((load?.miles ?? 0) - (load?.diff ?? 0)).toFixed(1)} miles
- Weekly change: ${(load?.diff ?? 0) >= 0 ? "+" : ""}${Number(load?.diff ?? 0).toFixed(1)} miles
- Runs this week: ${load?.runs ?? 0}
- Injury risk (ACWR): ${injury.acwr} — ${injury.risk}
  (Acute: ${injury.acuteMiles} mi / Chronic avg: ${injury.chronicMiles} mi)
  ACWR guide: <0.8 = undertraining, 0.8-1.3 = optimal, >1.3 = elevated risk, >1.5 = high risk
- Current run streak: ${streak} day(s)
- All-time total runs: ${stats?.total_runs ?? "N/A"}
- All-time total miles: ${Number(stats?.total_miles ?? 0).toFixed(0)} miles

PERSONAL RECORDS:
- Mile: ${formatPace(prs?.mile_seconds)}
- 5K: ${formatPace(prs?.fivek_seconds)}
- 10K: ${formatPace(prs?.tenk_seconds)}
- Half marathon: ${formatPace(prs?.half_seconds)}
- Marathon: ${formatPace(prs?.marathon_seconds)}

INSTRUCTIONS:
- Give specific, data-driven advice based on the athlete's actual numbers above.
- Be concise — aim for 2-4 sentences unless the question requires more detail.
- Reference the athlete's data when relevant rather than giving generic advice.
- If injury risk is elevated (ACWR > 1.3), proactively flag it if the conversation topic is relevant.
- Use a supportive, coach-like tone — encouraging but honest.
- Do not make up data you don't have. If something isn't in the data above, say so.`;
};

const chat = async (athleteId, history, userMessage) => {
  const systemPrompt = await buildSystemPrompt(athleteId);

  const messages = [
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: userMessage },
  ];

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  return response.content[0].text;
};

module.exports = { chat };