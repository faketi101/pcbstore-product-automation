const DEFAULT_CATEGORY_PROMPT_1 = `Role: Act as an expert SEO Content Strategist and Technical Copywriter specializing in e-commerce architecture and product category optimization.
Task: Write a comprehensive, 800-word article on the Following Topic
Constraint Checklist & Confidence Score: 
Total Word Count: Approx. 800 words.
Formatting: Must include exactly 2 bullet point lists within the content.
Linking Scope: Product Category Pages ONLY. Do not link to blog posts, articles, or individual product pages. Focus exclusively on Product Category pages.
Technical Compliance: Follow the "Critical Technical Rules for 2026".
Content Authority: Follow the "New Authority & Readability Rules".

1. CRITICAL TECHNICAL RULES FOR 2026 (STRICTLY ENFORCED)
Before writing, embed these rules into your process:
Avoid "Link Stacking": Never place two internal links in the same sentence. Never place two links immediately adjacent to each other (e.g., at the end of one sentence and the start of the next). Space them out to preserve content clarity and bot relevance.
Dofollow Only: Ensure all internal links are standard "dofollow" links. Do not use rel="nofollow" on internal links, as this prevents Googlebot from passing equity.
Unique Anchors: If you link to the same target page twice (which is discouraged), you MUST use different anchor text for the second instance. Google typically only credits the anchor text of the first instance.
Crawl Depth Efficiency: When selecting Product Category pages to link to, ensure they are logically no more than 3 clicks away from the homepage.

2. NEW AUTHORITY & READABILITY RULES
Semantic Anchor Matching: Do not use generic anchors like "click here" or "read more." Ensure the anchor text is topically relevant to the destination Product Category. Use natural language variants of the category name (e.g., link to "Men's Running Shoes" using anchors like "performance joggers" or "footwear for running").
Paragraph Length: Keep paragraphs short and punchy (max 2–3 sentences). This improves "skimmability" and increases the likelihood of a user clicking your internal category links.
Contextual Buffering: Every internal link must be surrounded by relevant context. Do not place a link at the very start or very end of a paragraph without supporting sentences that explain why that specific Product Category is valuable to the reader.

SECTION-SPECIFIC INSTRUCTIONS
Section 1: Introduction (Words 1–150)
Goal: Hook the reader and define the scope.
Link Requirements: Insert 1–2 links.
Link Type (Critical Priority): Upward Links. Link to broad, high-level Main Product Categories (e.g., "Electronics," "Apparel").
Constraint Check: Ensure these are Category pages, NOT blog posts.
Section 2: Body (Words 150–650)
Goal: Provide core value, detailed information, and analysis.
Formatting Requirement: Include exactly 2 bullet point lists within this section to break up text.
Link Requirements: Insert 4–5 links.
Link Type (Medium Priority): Horizontal Links. Link to Related Product Categories or Sub-Categories relevant to the specific features discussed.
Constraint Check: Do NOT link to blog articles. All links must point to Commercial/Category pages.
Section 3: Conclusion (Words 650–800)
Goal: Summarize key takeaways and drive action.
Link Requirements: Insert 1–2 links.
Link Type (Low Priority): Downward Links. Link to specific Niche Product Categories or Clearance Categories to guide the user toward purchase.
Constraint Check: Ensure these are Category pages accessible within 3 clicks from the homepage.
Section 4 
A complete, ready to buy Paragraph Mention brand name and [PCB Store]

FORMATTING REQUIREMENTS
Use clear H2 and H3 headers for the body.
Ensure all links flow naturally within the context of the sentences.
Bold the anchor text for the internal links so they are easily identifiable.
Start with a h2 heading using the product name 
at the end add PCB Store and Brand name anchor text with a heading of ready to buy 
Do not place H2 and H3 headings consecutively (one after another)."
Anchor text Placement Requirements 
Place them in the middle of a sentence
Don,t use it double time 
Place anchor text serially 
Don,t place this kind of sentence like [ eg: For gamers and creators exploring bold, reliable options inside the broader PC Components ecosystem]
Optimization Tips for Internal Link Placement :
Natural Placement: Use internal links naturally within the body text rather than just in sidebars or footers; RankBrain prioritizes contextual links.
Link to Relevant "Next Steps": Anticipate what a user wants to know next after reading your current page and provide a link to it.
Avoid Over-Optimization: Do not force exact-match keywords into anchor text. RankBrain prefers natural, human-readable language. 


Product Name : [\${productName}]
Product main category: [\${productMainCategory}]
Product Sub Category: [\${productSubCategory}]
Product Sub Category 2: [\${productSubCategory2}]
Product Related Category: [\${relatedCategories}]
Specs: [\${specs}]

Note:
- Do not use any words like "Introduction", "Conclusion", "Section 1", "Section 2" or "Section 3" in the final article.
`;

const DEFAULT_CATEGORY_PROMPT_2 = `INPUT CONTENT
\${productContent}

INSTRUCTIONS
Using the content provided in the INPUT CONTENT section above, generate the following sections:

Key Features
List 4–6 major features in bullet points.
The 1st point must be the Model Name.
Each point must be less than 4 words.
Keep it scannable, informative, and keyword-rich.

Specification Table
Create a detailed "Specification Table" with 8+ rows.
Use a clean, readable Markdown table (two-column structure).
Must include "small section title headers" and subheadings within the table.
Keep formatting uniform and visually clear.
Write all numbers, units, and tech terms accurately and consistently.
Maintain concise but complete phrasing (no extra explanations).
General Information: Must include Product Category and Product Sub-Category.
Warranty: Include warranty info as the last row.

Specific Product Rules:
Keyboards: Check names carefully; add color and switch type to specs if listed in the title. Follow the name if there are multiple options.
Tomica Brand: Add the number in Key Features as "Item No - [no]" (e.g., TOMICA 297796 PREMIUM TP-40 TOYOTA MR2 CAR -> Item No - 297796).
Do NOT convert the table into lines.

Meta Title (2026 Rules)
Length: Keep under 60 characters or 600 pixels to prevent cutting off.
Keywords: Place primary keywords near the beginning.
Uniqueness: Ensure a unique title to avoid keyword cannibalization.
Relevance: Match the title to the H1 headline.
Branding: Include the brand name at the end.

Meta Description (2026 Rules)
Length: Aim for 140–160 characters (920 pixels desktop, 680 mobile).
Actionable: Use active voice with a clear Call-to-Action (CTA) like "Shop now" or "Discover".
User Intent: Focus on answering the query rather than keyword stuffing.
Uniqueness: Create unique, non-duplicated descriptions.
Formatting: Avoid excessive punctuation; stick to alphanumeric characters.
Mobile First: Ensure the most important information is in the first half.

Frequently Asked Questions (FAQs)
Generate a list of 10 Frequently Asked Questions based specifically on the information provided in the blog text.
The questions should be ones a real customer would actually ask before buying.
The answers must be accurate and derived directly from the blog text.
Include a mix of questions about features, usage, and benefits.
Keep the tone friendly, professional, and helpful.
Format all FAQ questions as H3 headers.
Do not add numbers (1, 2, 3) or list markers at the start of the questions.

General Requirements:
No repetition, no commentary, no explanation outside the generated sections.
Keep formatting consistent and human-readable.`;

module.exports = {
  DEFAULT_CATEGORY_PROMPT_1,
  DEFAULT_CATEGORY_PROMPT_2,
};
