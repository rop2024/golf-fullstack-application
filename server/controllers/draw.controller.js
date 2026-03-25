// Mock draws database
const draws = [];

export const createDraw = async (req, res) => {
  try {
    const { name, participants, date } = req.body;

    const newDraw = {
      id: draws.length + 1,
      name,
      participants,
      date,
      status: "pending",
      createdAt: new Date(),
      createdBy: req.user.id
    };

    draws.push(newDraw);

    res.status(201).json({
      message: "Draw created successfully",
      draw: newDraw
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating draw", error: error.message });
  }
};

export const executeDraw = async (req, res) => {
  try {
    const { drawId } = req.params;
    const draw = draws.find(d => d.id === parseInt(drawId));

    if (!draw) {
      return res.status(404).json({ message: "Draw not found" });
    }

    // Randomly select winner
    const winner = draw.participants[Math.floor(Math.random() * draw.participants.length)];

    draw.status = "completed";
    draw.winner = winner;
    draw.completedAt = new Date();

    res.json({
      message: "Draw executed successfully",
      draw
    });
  } catch (error) {
    res.status(500).json({ message: "Error executing draw", error: error.message });
  }
};

export const getDraws = async (req, res) => {
  try {
    res.json({ draws });
  } catch (error) {
    res.status(500).json({ message: "Error fetching draws", error: error.message });
  }
};