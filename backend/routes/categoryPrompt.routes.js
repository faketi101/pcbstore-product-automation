const express = require("express");
const User = require("../models/User.model");
const verifySession = require("../middleware/auth.middleware");
const {
  DEFAULT_CATEGORY_PROMPT_1,
  DEFAULT_CATEGORY_PROMPT_2,
} = require("../config/defaultCategoryPrompts");

const router = express.Router();

// Get Category Prompts
router.get("/", verifySession, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ message: "User not found." });

    const categoryPrompts = {
      categoryPrompt1:
        user.categoryPrompts?.categoryPrompt1 &&
        user.categoryPrompts.categoryPrompt1.trim()
          ? user.categoryPrompts.categoryPrompt1
          : DEFAULT_CATEGORY_PROMPT_1,
      categoryPrompt2:
        user.categoryPrompts?.categoryPrompt2 &&
        user.categoryPrompts.categoryPrompt2.trim()
          ? user.categoryPrompts.categoryPrompt2
          : DEFAULT_CATEGORY_PROMPT_2,
    };
    res.json(categoryPrompts);
  } catch (error) {
    console.error("Get category prompts error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Save Category Prompts
router.post("/", verifySession, async (req, res) => {
  try {
    const { categoryPrompt1, categoryPrompt2 } = req.body;

    if (
      !categoryPrompt1 ||
      !categoryPrompt2 ||
      !categoryPrompt1.trim() ||
      !categoryPrompt2.trim()
    ) {
      return res
        .status(400)
        .json({
          message:
            "Category prompts data is incomplete. Both prompts are required.",
        });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.categoryPrompts) {
      user.categoryPrompts = {};
    }

    user.categoryPrompts.categoryPrompt1 = categoryPrompt1.trim();
    user.categoryPrompts.categoryPrompt2 = categoryPrompt2.trim();

    await user.save();
    res.json({ message: "Category prompts saved successfully." });
  } catch (error) {
    console.error("Save category prompts error:", error);
    res.status(500).json({ message: "Failed to save category prompts." });
  }
});

// Reset Category Prompts to Default (both)
router.delete("/", verifySession, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Initialize or reset category prompts
    user.categoryPrompts = {
      categoryPrompt1: DEFAULT_CATEGORY_PROMPT_1,
      categoryPrompt2: DEFAULT_CATEGORY_PROMPT_2,
    };

    await user.save();
    return res.json({ message: "Category prompts reset to default." });
  } catch (error) {
    console.error("Reset category prompts error:", error);
    return res
      .status(500)
      .json({ message: "Failed to reset category prompts." });
  }
});

// Reset Category Prompt 1 Only
router.delete("/prompt1", verifySession, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Initialize prompts if not exists
    if (!user.categoryPrompts) {
      user.categoryPrompts = {
        categoryPrompt1: DEFAULT_CATEGORY_PROMPT_1,
        categoryPrompt2: DEFAULT_CATEGORY_PROMPT_2,
      };
    } else {
      // Only reset prompt 1, keep prompt 2
      user.categoryPrompts.categoryPrompt1 = DEFAULT_CATEGORY_PROMPT_1;
    }

    await user.save();
    return res.json({ message: "Category prompt 1 reset to default." });
  } catch (error) {
    console.error("Reset category prompt 1 error:", error);
    return res
      .status(500)
      .json({ message: "Failed to reset category prompt 1." });
  }
});

// Reset Category Prompt 2 Only
router.delete("/prompt2", verifySession, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Initialize prompts if not exists
    if (!user.categoryPrompts) {
      user.categoryPrompts = {
        categoryPrompt1: DEFAULT_CATEGORY_PROMPT_1,
        categoryPrompt2: DEFAULT_CATEGORY_PROMPT_2,
      };
    } else {
      // Only reset prompt 2, keep prompt 1
      user.categoryPrompts.categoryPrompt2 = DEFAULT_CATEGORY_PROMPT_2;
    }

    await user.save();
    return res.json({ message: "Category prompt 2 reset to default." });
  } catch (error) {
    console.error("Reset category prompt 2 error:", error);
    return res
      .status(500)
      .json({ message: "Failed to reset category prompt 2." });
  }
});

module.exports = router;
