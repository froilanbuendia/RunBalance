const { getAthleteProfile } = require("../repositories/athletes");

exports.getAthleteProfile = async (athleteId) => {
  return await getAthleteProfile(athleteId);
};
