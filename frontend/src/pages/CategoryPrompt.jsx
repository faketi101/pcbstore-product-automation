import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import authService from "../services/api";

const CategoryPrompt = () => {
  const [formData, setFormData] = useState({
    productName: "",
    productMainCategory: "",
    productSubCategory: "",
    productSubCategory2: "",
    relatedCategories: "",
    specs: "",
  });

  // For Prompt 2 - Key Features & Specs
  const [productContent, setProductContent] = useState("");

  const [prompt1, setPrompt1] = useState("");
  const [prompt2, setPrompt2] = useState("");

  // Prompts State
  const [categoryPrompt1Template, setCategoryPrompt1Template] = useState("");
  const [categoryPrompt2Template, setCategoryPrompt2Template] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Temporary state for editing
  const [editCategoryPrompt1, setEditCategoryPrompt1] = useState("");
  const [editCategoryPrompt2, setEditCategoryPrompt2] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Active tab for switching between the two prompts
  const [activeTab, setActiveTab] = useState("prompt1");

  useEffect(() => {
    document.title = "Category Prompt Generator - PCB Automation";
  }, []);

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    setIsLoading(true);
    try {
      const data = await authService.getCategoryPrompts();
      console.log("Loaded category prompts:", data);
      setCategoryPrompt1Template(data.categoryPrompt1 || "");
      setCategoryPrompt2Template(data.categoryPrompt2 || "");
    } catch (error) {
      console.error("Failed to load category prompts", error);
      toast.error("Failed to load prompts from server.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-emerald-600 animate-pulse">
          Loading Category Prompts...
        </div>
      </div>
    );
  }

  const handleCopy = async (text, successMsg) => {
    if (!text) {
      toast.error("Nothing to copy");
      return;
    }

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        toast.success(successMsg);
        return;
      } catch (err) {
        console.error("Clipboard API failed", err);
        toast.error("Copy failed");
      }
    } else {
      toast.error("Clipboard access denied");
    }
  };

  const generatePrompt1 = () => {
    let generated = categoryPrompt1Template;

    // Build related categories string
    const relatedCatsArray = formData.relatedCategories
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c);

    const replacements = {
      "${productName}": formData.productName,
      "${productMainCategory}": formData.productMainCategory,
      "${productSubCategory}": formData.productSubCategory,
      "${productSubCategory2}": formData.productSubCategory2,
      "${relatedCategories}": relatedCatsArray.join(", "),
      "${specs}": formData.specs,
    };

    Object.keys(replacements).forEach((key) => {
      // eslint-disable-next-line no-useless-escape
      const escapedKey = key.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
      generated = generated.replace(
        new RegExp(escapedKey, "g"),
        replacements[key] || "",
      );
    });

    // Clean up empty placeholders if fields were not provided
    // Remove lines with empty optional fields
    generated = generated
      .split("\n")
      .filter((line) => {
        // Keep line if it doesn't have empty placeholders for optional fields
        if (
          line.includes("Product Sub Category 2:") &&
          !formData.productSubCategory2
        )
          return false;
        if (
          line.includes("Product Related Category:") &&
          !formData.relatedCategories
        )
          return false;
        return true;
      })
      .join("\n");

    return generated;
  };

  const generatePrompt2 = () => {
    let generated = categoryPrompt2Template;

    const replacements = {
      "${productContent}": productContent,
    };

    Object.keys(replacements).forEach((key) => {
      // eslint-disable-next-line no-useless-escape
      const escapedKey = key.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
      generated = generated.replace(
        new RegExp(escapedKey, "g"),
        replacements[key] || "",
      );
    });

    return generated;
  };

  const handleGeneratePrompt1 = () => {
    const { productName, productMainCategory } = formData;

    if (!productName.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (!productMainCategory.trim()) {
      toast.error("Product main category is required");
      return;
    }

    if (!categoryPrompt1Template || !categoryPrompt1Template.trim()) {
      toast.error(
        "SEO Category prompt template not loaded. Please refresh the page.",
      );
      return;
    }

    const generated = generatePrompt1();
    setPrompt1(generated);
    toast.success("SEO Category Prompt generated successfully");
  };

  const handleGeneratePrompt2 = () => {
    if (!productContent.trim()) {
      toast.error("Product content is required");
      return;
    }

    if (!categoryPrompt2Template || !categoryPrompt2Template.trim()) {
      toast.error(
        "Key Features & Specs prompt template not loaded. Please refresh the page.",
      );
      return;
    }

    const generated = generatePrompt2();
    setPrompt2(generated);
    toast.success("Key Features & Specs Prompt generated successfully");
  };

  const startEditing = () => {
    setEditCategoryPrompt1(categoryPrompt1Template);
    setEditCategoryPrompt2(categoryPrompt2Template);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const saveEdits = async () => {
    if (!editCategoryPrompt1.trim() || !editCategoryPrompt2.trim()) {
      toast.error("Both prompts must have content before saving.");
      return;
    }

    try {
      console.log("Saving prompts:", {
        categoryPrompt1: editCategoryPrompt1.length,
        categoryPrompt2: editCategoryPrompt2.length,
      });
      await authService.saveCategoryPrompts({
        categoryPrompt1: editCategoryPrompt1,
        categoryPrompt2: editCategoryPrompt2,
      });
      setCategoryPrompt1Template(editCategoryPrompt1);
      setCategoryPrompt2Template(editCategoryPrompt2);
      setIsEditing(false);
      toast.success("Category prompts saved successfully!");
    } catch (error) {
      console.error("Failed to save prompts", error);
      toast.error("Failed to save prompts.");
    }
  };

  const handleResetAll = async () => {
    if (
      !window.confirm(
        "Are you sure you want to reset BOTH category prompts to default? This will overwrite your custom changes.",
      )
    ) {
      return;
    }
    try {
      await authService.resetCategoryPrompts();
      await loadPrompts();
      setIsEditing(false);
      toast.success("Both category prompts reset to default!");
    } catch (error) {
      console.error("Failed to reset prompts", error);
      toast.error("Failed to reset prompts.");
    }
  };

  const handleResetPrompt1 = async () => {
    if (
      !window.confirm(
        "Reset SEO Category Prompt to default? Your custom prompt will be overwritten.",
      )
    ) {
      return;
    }
    try {
      await authService.resetCategoryPrompt1();
      const data = await authService.getCategoryPrompts();
      setCategoryPrompt1Template(data.categoryPrompt1);
      setEditCategoryPrompt1(data.categoryPrompt1);
      toast.success("SEO Category prompt reset to default!");
    } catch (error) {
      console.error("Failed to reset prompt", error);
      toast.error("Failed to reset prompt.");
    }
  };

  const handleResetPrompt2 = async () => {
    if (
      !window.confirm(
        "Reset Key Features & Specs Prompt to default? Your custom prompt will be overwritten.",
      )
    ) {
      return;
    }
    try {
      await authService.resetCategoryPrompt2();
      const data = await authService.getCategoryPrompts();
      setCategoryPrompt2Template(data.categoryPrompt2);
      setEditCategoryPrompt2(data.categoryPrompt2);
      toast.success("Key Features & Specs prompt reset to default!");
    } catch (error) {
      console.error("Failed to reset prompt", error);
      toast.error("Failed to reset prompt.");
    }
  };

  if (isEditing) {
    return (
      <div className="min-h-screen bg-slate-100 text-gray-800 p-8 font-sans">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Edit Category Prompt Templates
            </h1>
            <div className="flex gap-4">
              <button
                className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                onClick={handleResetAll}
              >
                Reset All to Default
              </button>
              <div>
                <button
                  className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 mr-4"
                  onClick={cancelEditing}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-md"
                  onClick={saveEdits}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold">
                  SEO Category Content Prompt
                </label>
                <button
                  className="px-3 py-1 text-xs font-semibold text-orange-600 bg-orange-50 rounded hover:bg-orange-100"
                  onClick={handleResetPrompt1}
                >
                  Reset Prompt 1
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-2">
                Placeholders: {"${productName}"}, {"${productMainCategory}"},{" "}
                {"${productSubCategory}"}, {"${productSubCategory2}"},{" "}
                {"${relatedCategories}"}, {"${specs}"}
              </p>
              <textarea
                className="w-full p-4 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-emerald-600 min-h-[600px] font-mono whitespace-pre-wrap bg-gray-50"
                value={editCategoryPrompt1}
                onChange={(e) => setEditCategoryPrompt1(e.target.value)}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold">
                  Key Features & Specs Prompt
                </label>
                <button
                  className="px-3 py-1 text-xs font-semibold text-orange-600 bg-orange-50 rounded hover:bg-orange-100"
                  onClick={handleResetPrompt2}
                >
                  Reset Prompt 2
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-2">
                Placeholder: {"${productContent}"}
              </p>
              <textarea
                className="w-full p-4 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-emerald-600 min-h-[600px] font-mono whitespace-pre-wrap bg-gray-50"
                value={editCategoryPrompt2}
                onChange={(e) => setEditCategoryPrompt2(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-gray-800 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2 text-gray-900">
                Category Content Prompt Generator
              </h1>
              <p className="text-gray-500 text-sm">
                Generate SEO-optimized category content and key features/specs
                prompts
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={loadPrompts}
                className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
              >
                Refresh Templates
              </button>
              <button
                onClick={startEditing}
                className="px-4 py-2 text-xs font-semibold text-emerald-600 bg-emerald-50 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition"
              >
                Edit Templates
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`px-6 py-3 text-sm font-semibold transition-all ${
                activeTab === "prompt1"
                  ? "text-emerald-600 border-b-2 border-emerald-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("prompt1")}
            >
              SEO Category Content
            </button>
            <button
              className={`px-6 py-3 text-sm font-semibold transition-all ${
                activeTab === "prompt2"
                  ? "text-emerald-600 border-b-2 border-emerald-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("prompt2")}
            >
              Key Features & Specs
            </button>
          </div>

          {/* Prompt 1 - SEO Category Content */}
          {activeTab === "prompt1" && (
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full p-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-emerald-600 focus:ring-[3px] focus:ring-emerald-600/15 transition-all"
                    value={formData.productName}
                    onChange={(e) =>
                      setFormData({ ...formData, productName: e.target.value })
                    }
                    placeholder="e.g. NVIDIA RTX 4090"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Product Main Category{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full p-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-emerald-600 focus:ring-[3px] focus:ring-emerald-600/15 transition-all"
                    value={formData.productMainCategory}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        productMainCategory: e.target.value,
                      })
                    }
                    placeholder="e.g. PC Components"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Product Sub Category
                  </label>
                  <input
                    className="w-full p-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-emerald-600 focus:ring-[3px] focus:ring-emerald-600/15 transition-all"
                    value={formData.productSubCategory}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        productSubCategory: e.target.value,
                      })
                    }
                    placeholder="e.g. Graphics Cards"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Product Sub Category 2
                  </label>
                  <input
                    className="w-full p-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-emerald-600 focus:ring-[3px] focus:ring-emerald-600/15 transition-all"
                    value={formData.productSubCategory2}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        productSubCategory2: e.target.value,
                      })
                    }
                    placeholder="e.g. NVIDIA GPUs"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold mb-2">
                  Related Categories (comma separated)
                </label>
                <input
                  className="w-full p-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-emerald-600 focus:ring-[3px] focus:ring-emerald-600/15 transition-all"
                  value={formData.relatedCategories}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      relatedCategories: e.target.value,
                    })
                  }
                  placeholder="e.g. Gaming Monitors, Power Supplies, CPU Coolers"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold mb-2">
                  Specs <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full p-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-emerald-600 focus:ring-[3px] focus:ring-emerald-600/15 transition-all min-h-[120px] resize-y"
                  value={formData.specs}
                  onChange={(e) =>
                    setFormData({ ...formData, specs: e.target.value })
                  }
                  placeholder="Paste product specifications here..."
                ></textarea>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  className="px-6 py-3 text-sm font-semibold rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-lg shadow-emerald-600/25 hover:-translate-y-px hover:shadow-emerald-600/35 transition-all cursor-pointer border-none"
                  onClick={handleGeneratePrompt1}
                >
                  Generate SEO Prompt
                </button>
                <button
                  className="px-6 py-3 text-sm font-semibold rounded-lg bg-gray-100 text-gray-800 border border-gray-200 hover:bg-emerald-50 hover:border-emerald-600 transition-all cursor-pointer"
                  onClick={() =>
                    handleCopy(
                      prompt1,
                      "SEO Category prompt copied to clipboard!",
                    )
                  }
                >
                  Copy Prompt
                </button>
                <button
                  className="px-6 py-3 text-sm font-semibold rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all cursor-pointer"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      productName: "",
                      productMainCategory: "",
                      productSubCategory: "",
                      productSubCategory2: "",
                      relatedCategories: "",
                      specs: "",
                    });
                    setPrompt1("");
                    toast.success("Form reset successfully");
                  }}
                >
                  Reset Form
                </button>
              </div>

              <div className="mt-8">
                <label className="block text-sm font-semibold mb-2">
                  Generated SEO Category Prompt
                </label>
                <textarea
                  className="w-full p-3 text-sm rounded-lg border border-gray-200 min-h-[320px] font-mono whitespace-pre-wrap bg-gray-50 text-gray-600"
                  readOnly
                  value={prompt1}
                />
              </div>
            </div>
          )}

          {/* Prompt 2 - Key Features & Specs */}
          {activeTab === "prompt2" && (
            <div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Product Content <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Paste the complete product content/information here
                </p>
                <textarea
                  className="w-full p-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-emerald-600 focus:ring-[3px] focus:ring-emerald-600/15 transition-all min-h-[200px] resize-y"
                  value={productContent}
                  onChange={(e) => setProductContent(e.target.value)}
                  placeholder="Paste complete product content here..."
                ></textarea>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  className="px-6 py-3 text-sm font-semibold rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-lg shadow-emerald-600/25 hover:-translate-y-px hover:shadow-emerald-600/35 transition-all cursor-pointer border-none"
                  onClick={handleGeneratePrompt2}
                >
                  Generate Features & Specs Prompt
                </button>
                <button
                  className="px-6 py-3 text-sm font-semibold rounded-lg bg-gray-100 text-gray-800 border border-gray-200 hover:bg-emerald-50 hover:border-emerald-600 transition-all cursor-pointer"
                  onClick={() =>
                    handleCopy(
                      prompt2,
                      "Key Features & Specs prompt copied to clipboard!",
                    )
                  }
                >
                  Copy Prompt
                </button>
                <button
                  className="px-6 py-3 text-sm font-semibold rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all cursor-pointer"
                  onClick={() => {
                    setProductContent("");
                    setPrompt2("");
                    toast.success("Form reset successfully");
                  }}
                >
                  Reset Form
                </button>
              </div>

              <div className="mt-8">
                <label className="block text-sm font-semibold mb-2">
                  Generated Key Features & Specs Prompt
                </label>
                <textarea
                  className="w-full p-3 text-sm rounded-lg border border-gray-200 min-h-[320px] font-mono whitespace-pre-wrap bg-gray-50 text-gray-600"
                  readOnly
                  value={prompt2}
                />
              </div>
            </div>
          )}
        </div>
        <footer className="text-center mt-8 text-xs text-gray-500">
          Category Prompt Tool · Developed by TARIKUL ISLAM
        </footer>
      </div>
    </div>
  );
};

export default CategoryPrompt;
