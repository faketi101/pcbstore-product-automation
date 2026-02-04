const express = require("express");
const User = require("../models/User.model");
const verifyToken = require("../middleware/auth.middleware");
const {
  DEFAULT_STATIC_PROMPT,
  DEFAULT_MAIN_PROMPT_TEMPLATE,
} = require("../config/defaultPrompts");

const router = express.Router();

// Get Prompts
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ message: "User not found." });

    const userPrompts = user.prompts || {
      staticPrompt: DEFAULT_STATIC_PROMPT,
      mainPromptTemplate: DEFAULT_MAIN_PROMPT_TEMPLATE,
    };
    res.json(userPrompts);
  } catch (error) {
    console.error("Get prompts error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Save Prompts
router.post("/", verifyToken, async (req, res) => {
  try {
    const { staticPrompt, mainPromptTemplate } = req.body;

    if (!staticPrompt || !mainPromptTemplate) {
      return res.status(400).json({ message: "Prompts data is incomplete." });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.prompts = {
      staticPrompt,
      mainPromptTemplate,
    };

    await user.save();
    res.json({ message: "Prompts saved successfully." });
  } catch (error) {
    console.error("Save prompts error:", error);
    res.status(500).json({ message: "Failed to save prompts." });
  }
});

// Reset Prompts to Default (both)
router.delete("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Save default prompts to user's database
    user.prompts = {
      staticPrompt: DEFAULT_STATIC_PROMPT,
      mainPromptTemplate: DEFAULT_MAIN_PROMPT_TEMPLATE,
    };

    await user.save();
    return res.json({ message: "Prompts reset to default." });
  } catch (error) {
    console.error("Reset prompts error:", error);
    return res.status(500).json({ message: "Failed to reset prompts." });
  }
});

// Reset Main Prompt Only
router.delete("/main", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Initialize prompts if not exists
    if (!user.prompts) {
      user.prompts = {
        staticPrompt: DEFAULT_STATIC_PROMPT,
        mainPromptTemplate: DEFAULT_MAIN_PROMPT_TEMPLATE,
      };
    } else {
      // Only reset main prompt, keep static prompt
      user.prompts.mainPromptTemplate = DEFAULT_MAIN_PROMPT_TEMPLATE;
    }

    await user.save();
    return res.json({ message: "Main prompt reset to default." });
  } catch (error) {
    console.error("Reset main prompt error:", error);
    return res.status(500).json({ message: "Failed to reset main prompt." });
  }
});

// Reset Static Prompt Only
router.delete("/static", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Initialize prompts if not exists
    if (!user.prompts) {
      user.prompts = {
        staticPrompt: DEFAULT_STATIC_PROMPT,
        mainPromptTemplate: DEFAULT_MAIN_PROMPT_TEMPLATE,
      };
    } else {
      // Only reset static prompt, keep main prompt
      user.prompts.staticPrompt = DEFAULT_STATIC_PROMPT;
    }

    await user.save();
    return res.json({ message: "Static prompt reset to default." });
  } catch (error) {
    console.error("Reset static prompt error:", error);
    return res.status(500).json({ message: "Failed to reset static prompt." });
  }
});

module.exports = router;
