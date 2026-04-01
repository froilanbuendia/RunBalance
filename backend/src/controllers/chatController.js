const { saveMessage, getHistory } = require("../repositories/chat");
const { chat } = require("../services/chatService");

exports.getHistory = async (req, res) => {
  try {
    const history = await getHistory(req.user.id);
    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const athleteId = req.user.id;
    const history = await getHistory(athleteId);

    const reply = await chat(athleteId, history, message.trim());

    await saveMessage(athleteId, "user", message.trim());
    await saveMessage(athleteId, "assistant", reply);

    res.json({ reply });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to send message" });
  }
};