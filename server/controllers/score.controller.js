// Mock scores database
const scores = [];

export const submitScore = async (req, res) => {
  try {
    const { matchId, score, round } = req.body;
    const userId = req.user.id;

    const newScore = {
      id: scores.length + 1,
      userId,
      matchId,
      score,
      round,
      createdAt: new Date()
    };

    scores.push(newScore);

    res.status(201).json({
      message: "Score submitted successfully",
      score: newScore
    });
  } catch (error) {
    res.status(500).json({ message: "Error submitting score", error: error.message });
  }
};

export const getUserScores = async (req, res) => {
  try {
    const userId = req.user.id;
    const userScores = scores.filter(s => s.userId === userId);

    res.json({ scores: userScores });
  } catch (error) {
    res.status(500).json({ message: "Error fetching scores", error: error.message });
  }
};

export const getAllScores = async (req, res) => {
  try {
    res.json({ scores });
  } catch (error) {
    res.status(500).json({ message: "Error fetching scores", error: error.message });
  }
};