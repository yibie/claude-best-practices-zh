---
title: "如何创建 Skills：关键步骤、限制与示例"
source_url: "https://claude.com/resources/articles/how-to-create-skills-key-steps-limitations-and-examples"
publisher: "claude.com"
type: "blogPost"
date: "2025-11-19"
products: ["Claude apps"]
read_time: 13
excerpt: "了解如何编写量身定制的 Skills，让 Claude 输出更强大、更有效的结果。"
fetched_at: "2026-11-18"
---

# 如何创建 Skills：关键步骤、限制与示例
[Skills（技能）](https://claude.com/resources/articles/skills)是自定义指令，用于扩展 Claude 在特定任务或领域中的能力。

当你通过 [SKILL.md](http://skill.md/) 文件创建 skill 时，你实际上是在教 Claude 如何更有效地处理特定场景。Skills 的强大之处在于，它们能够编码组织知识、标准化输出，并处理复杂的多步骤工作流——否则这些工作流需要反复解释，或投入精力构建自定义智能体。

你可以借助我们的 [skill creator](https://github.com/anthropics/skills/tree/main/skill-creator) 模板或手动方式，学习如何创建 skill，将 Claude 从通用助手转变为针对你特定工作流的专业专家。（小贴士：为简化操作，我们建议使用此模板构建你的 [SKILL.md](http://skill.md/) 文件，再在此基础上进行定制。）

## **五步创建一个 skill**

遵循这一结构化方法，构建触发更可靠的 skills。

### **1. 理解核心需求**

在动笔之前，先明确你的 skill 解决什么问题。强大的 skills 针对具体需求，并有可衡量的成果。"从 PDF 中提取财务数据并格式化为 CSV" 优于 "帮我处理财务相关的事情"，因为前者明确了输入格式、操作和预期输出。

先问自己：这个 skill 完成什么具体任务？什么触发条件应该激活它？成功是什么样子？有哪些边缘情况或限制？

### **2. 编写名称**

你的 skill 需要三个核心组成部分：**name**（清晰的标识符）、**description**（何时激活）和 **instructions**（如何执行）。事实上，name 和 description 是 [SKILL.md](http://skill.md/) 文件中唯一影响触发的部分，换言之，即 Claude 调用 skill 获取专业知识或工作流的能力。

名称应直白且具有描述性。使用小写字母加连字符（例如 pdf-editor、brand-guidelines）。保持简短清晰。

### **3. 编写 description 字段**

description 决定你的 skill 何时激活，因此是最关键的组成部分。从 Claude 的视角来写，聚焦于触发条件、能力和用例。

一个强大的 description 需要平衡多个要素：具体能力、清晰的触发条件、相关上下文和边界。

**较弱的 description**：

```
This skill helps with PDFs and documents.
```

**较强的 description**：

```
Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms. When Claude needs to fill in a PDF form or programmatically process, generate, or analyze PDF documents at scale. Use for document workflows and batch operations. Not for simple PDF viewing or basic conversions.
```

更强的版本为 Claude 提供了多个数据点：具体动词（extract、create、merge）、具体用例（表单填写、批量操作）和清晰边界（不适用于简单查看）。

### **4. 编写主要指令**

你的指令应当结构化、易于浏览且可操作。使用 Markdown 标题、用于选项的要点列表，以及用于示例的代码块。

用清晰的层级结构组织：概述、前提条件、执行步骤、示例、错误处理和限制。将复杂工作流拆分为离散阶段，明确输入和输出。

包含展示正确用法的具体示例。明确 skill 不能做什么，以防止误用并管理预期。你的 [SKILL.md](http://skill.md/) 文件还可以包含额外的参考文件和资源，以便在 skill 被触发时，为你要求智能体执行的操作提供更清晰的说明和指导。

### **5. 上传你的 skill**

根据你所构建的 Claude 平台界面，以下是上传 skill 以供使用的方法：

-   [Claude.ai](http://claude.ai/redirect/claudedotcom.v1.f3c9fc09-6928-4a88-a15c-b8005e93863b)（Claude apps）：前往 **Settings** 并在那里添加你的自定义 skill。自定义 skills 需要 Pro、Max、Ultra、Team 或 Enterprise 套餐，并启用代码执行。在此上传的 skills 属于每个用户个人。它们不会在整个组织范围内共享，也无法由管理员集中管理。
-   [Claude Code](https://www.claude.com/product/claude-code)：在你的插件或项目根目录中创建 skills/ 目录，并添加包含 SKILL.md 文件的 skill 文件夹。安装插件后，Claude 会自动发现并使用它们。示例结构：

```
my-project/
├── skills/
│   └── my-skill/
│       └── SKILL.md
```

-   [Claude Developer Platform](https://www.claude.com/platform/api)：通过 Skills API（/v1/skills 端点）上传 skills。使用带有必需 beta 标头的 POST 请求：

```
curl -X POST "https://api.anthropic.com/v1/skills" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: skills-2025-10-02" \
  -F "display_title=My Skill Name" \
  -F "files[]=@my-skill/SKILL.md;filename=my-skill/SKILL.md"
```

### **4. 测试与验证**

在部署之前，用真实场景测试你的 skill。系统化的测试能揭示指令中的缺口、description 中的歧义，以及只有在实际使用中才会浮现的意外边缘情况。

创建一个覆盖三种场景的测试矩阵：

-   **正常操作**：用 skill 应能完美处理的典型请求进行测试。如果你构建了一个财务分析 skill，试试 "分析微软最新的财报" 或 "为这份 10-K 文件构建一个数据包"。这些基线测试确认你的指令按预期工作。
-   **边缘情况**：用不完整或不寻常的输入进行测试。数据缺失时会怎样？文件格式出乎意料时会怎样？用户提供模糊指令时会怎样？你的 skill 应优雅地处理这些情况——要么产出降级但有用的输出，要么说明继续所需的条件。
-   **超出范围的请求**：用看似相关但不应触发你 skill 的任务进行测试。如果你构建了一个 NDA 审查 skill，试试请求 "审查这份雇佣协议" 或 "分析这份租约"。该 skill 应保持休眠，让其他 skills 或 Claude 的通用能力来处理该请求。

考虑实施以下测试以进行更深入的验证：

-   **触发测试**：skill 是否在预期时激活？用显式请求（"使用财务数据包 skill 分析这家公司"）和自然请求（"帮我理解这家公司的财务状况"）进行测试。不相关时它是否保持不激活？一个范围界定良好的 skill 知道何时不应激活。测试相似但不同的请求以验证边界。
-   **功能测试**：包括输出一致性（用相似输入多次运行是否产生可比结果？）、可用性（不熟悉该领域的人能否成功使用？）和文档准确性（你的示例是否与实际行为一致？）。

### **5. 基于使用情况迭代**

监控你的 skill 在真实使用中的表现。如果触发不一致，改进 description。如果输出出现意外变化，澄清指令。与提示词一样，最好的 skills 通过实际应用不断演进。

## **创建 skills 的通用最佳实践**

这些原则帮助你创建可维护、可复用且真正有用的 skills，而非纸上谈兵。

### **从用例出发**

不要凭空编写 skills。在有真实、重复性任务时再构建它们。最好的 skills 解决你经常遇到的问题。

在创建 skill 之前，问自己：这个任务我做过至少五次吗？我还会再做至少十次吗？如果答案是肯定的，那么 skill 就有意义。

### **定义成功标准——并将其纳入 skill**

告诉 Claude 好的输出是什么样子。如果你在创建财务报告，明确所需章节、格式标准、验证检查和质量阈值。将这些标准纳入你的指令，以便 Claude 能够自我检查。

### **使用 Skill-Creator skill**

[skill-creator skill](https://github.com/anthropics/skills/tree/main/skill-creator) 引导你创建结构良好的 skills。它会提出澄清性问题、建议改进 description，并帮助正确格式化指令。可在 [GitHub 上的 Skills 仓库](https://github.com/anthropics/skills)中获取，也可直接通过 [Claude.ai](http://claude.ai/redirect/claudedotcom.v1.f3c9fc09-6928-4a88-a15c-b8005e93863b) 使用，它对你最初的几个 skills 尤其有价值。

## **Skill 的限制与注意事项**

理解 skills 如何工作——以及它们的边界——有助于你设计更有效的 skills 并设定合理的预期。

### **Skill 触发**

Claude 会根据你的请求评估 skill descriptions 以确定相关性。这不是关键词匹配——Claude 理解语义关系。然而，模糊的 description 会降低触发准确性。

如果多个 skills 处理复杂任务的不同方面，它们可以同时激活。过于通用的 description 会导致不当激活，而缺失的用例会导致漏触发。

### **适当的文件大小**

编写 skills 时，避免用不必要的内容膨胀上下文窗口。考虑每条信息是否需要每次都加载，还是仅在特定条件下加载。

使用 "菜单" 方法：如果你的 skill 涵盖多个不同的流程或选项，SKILL.md 应描述可用的内容，并使用相对路径引用每个流程的独立文件。Claude 随后只读取与用户任务相关的文件，在该对话中保持其他文件不被触碰。

这些独立文件不必代表互斥的路径。关键原则是将内容分解为合理的块，让 Claude 根据手头任务选择所需内容。

## **真实世界的 skills 示例**

### **Skill 示例 #1：[docx 创建 skill](https://github.com/anthropics/skills/tree/main/document-skills/docx)**

````
#---
name: docx
description: "Comprehensive document creation, editing, and analysis with support for tracked changes, comments, formatting preservation, and text extraction. When Claude needs to work with professional documents (.docx files) for: (1) Creating new documents, (2) Modifying or editing content, (3) Working with tracked changes, (4) Adding comments, or any other document tasks"
license: Proprietary. LICENSE.txt has complete terms
---

# DOCX creation, editing, and analysis

## Overview

A user may ask you to create, edit, or analyze the contents of a .docx file. A .docx file is essentially a ZIP archive containing XML files and other resources that you can read or edit. You have different tools and workflows available for different tasks.

## Workflow Decision Tree

### Reading/Analyzing Content
Use "Text extraction" or "Raw XML access" sections below

### Creating New Document
Use "Creating a new Word document" workflow

### Editing Existing Document
- **Your own document + simple changes**
  Use "Basic OOXML editing" workflow

- **Someone else's document**
  Use **"Redlining workflow"** (recommended default)

- **Legal, academic, business, or government docs**
  Use **"Redlining workflow"** (required)

## Reading and analyzing content

### Text extraction
If you just need to read the text contents of a document, you should convert the document to markdown using pandoc. Pandoc provides excellent support for preserving document structure and can show tracked changes:

```bash
# Convert document to markdown with tracked changes
pandoc --track-changes=all path-to-file.docx -o output.md
# Options: --track-changes=accept/reject/all
```

### Raw XML access
You need raw XML access for: comments, complex formatting, document structure, embedded media, and metadata. For any of these features, you'll need to unpack a document and read its raw XML contents.

#### Unpacking a file
`python ooxml/scripts/unpack.py <office_file> <output_directory>`

#### Key file structures
* `word/document.xml` - Main document contents
* `word/comments.xml` - Comments referenced in document.xml
* `word/media/` - Embedded images and media files
* Tracked changes use `<w:ins>` (insertions) and `<w:del>` (deletions) tags

## Creating a new Word document

When creating a new Word document from scratch, use **docx-js**, which allows you to create Word documents using JavaScript/TypeScript.

### Workflow
1. **MANDATORY - READ ENTIRE FILE**: Read [`docx-js.md`](docx-js.md) (~500 lines) completely from start to finish. **NEVER set any range limits when reading this file.** Read the full file content for detailed syntax, critical formatting rules, and best practices before proceeding with document creation.
2. Create a JavaScript/TypeScript file using Document, Paragraph, TextRun components (You can assume all dependencies are installed, but if not, refer to the dependencies section below)
3. Export as .docx using Packer.toBuffer()

## Editing an existing Word document

When editing an existing Word document, use the **Document library** (a Python library for OOXML manipulation). The library automatically handles infrastructure setup and provides methods for document manipulation. For complex scenarios, you can access the underlying DOM directly through the library.

### Workflow
1. **MANDATORY - READ ENTIRE FILE**: Read [`ooxml.md`](ooxml.md) (~600 lines) completely from start to finish. **NEVER set any range limits when reading this file.** Read the full file content for the Document library API and XML patterns for directly editing document files.
2. Unpack the document: `python ooxml/scripts/unpack.py <office_file> <output_directory>`
3. Create and run a Python script using the Document library (see "Document Library" section in ooxml.md)
4. Pack the final document: `python ooxml/scripts/pack.py <input_directory> <office_file>`

The Document library provides both high-level methods for common operations and direct DOM access for complex scenarios.

## Redlining workflow for document review

This workflow allows you to plan comprehensive tracked changes using markdown before implementing them in OOXML. **CRITICAL**: For complete tracked changes, you must implement ALL changes systematically.

**Batching Strategy**: Group related changes into batches of 3-10 changes. This makes debugging manageable while maintaining efficiency. Test each batch before moving to the next.

**Principle: Minimal, Precise Edits**
When implementing tracked changes, only mark text that actually changes. Repeating unchanged text makes edits harder to review and appears unprofessional. Break replacements into: [unchanged text] + [deletion] + [insertion] + [unchanged text]. Preserve the original run's RSID for unchanged text by extracting the `<w:r>` element from the original and reusing it.

Example - Changing "30 days" to "60 days" in a sentence:
```python
# BAD - Replaces entire sentence
'<w:del><w:r><w:delText>The term is 30 days.</w:delText></w:r></w:del><w:ins><w:r><w:t>The term is 60 days.</w:t></w:r></w:ins>'

# GOOD - Only marks what changed, preserves original <w:r> for unchanged text
'<w:r w:rsidR="00AB12CD"><w:t>The term is </w:t></w:r><w:del><w:r><w:delText>30</w:delText></w:r></w:del><w:ins><w:r><w:t>60</w:t></w:r></w:ins><w:r w:rsidR="00AB12CD"><w:t> days.</w:t></w:r>'
```

### Tracked changes workflow

1. **Get markdown representation**: Convert document to markdown with tracked changes preserved:
   ```bash
   pandoc --track-changes=all path-to-file.docx -o current.md
   ```

2. **Identify and group changes**: Review the document and identify ALL changes needed, organizing them into logical batches:

   **Location methods** (for finding changes in XML):
   - Section/heading numbers (e.g., "Section 3.2", "Article IV")
   - Paragraph identifiers if numbered
   - Grep patterns with unique surrounding text
   - Document structure (e.g., "first paragraph", "signature block")
   - **DO NOT use markdown line numbers** - they don't map to XML structure

   **Batch organization** (group 3-10 related changes per batch):
   - By section: "Batch 1: Section 2 amendments", "Batch 2: Section 5 updates"
   - By type: "Batch 1: Date corrections", "Batch 2: Party name changes"
   - By complexity: Start with simple text replacements, then tackle complex structural changes
   - Sequential: "Batch 1: Pages 1-3", "Batch 2: Pages 4-6"

3. **Read documentation and unpack**:
   - **MANDATORY - READ ENTIRE FILE**: Read [`ooxml.md`](ooxml.md) (~600 lines) completely from start to finish. **NEVER set any range limits when reading this file.** Pay special attention to the "Document Library" and "Tracked Change Patterns" sections.
   - **Unpack the document**: `python ooxml/scripts/unpack.py <file.docx> <dir>`
   - **Note the suggested RSID**: The unpack script will suggest an RSID to use for your tracked changes. Copy this RSID for use in step 4b.

4. **Implement changes in batches**: Group changes logically (by section, by type, or by proximity) and implement them together in a single script. This approach:
   - Makes debugging easier (smaller batch = easier to isolate errors)
   - Allows incremental progress
   - Maintains efficiency (batch size of 3-10 changes works well)

   **Suggested batch groupings:**
   - By document section (e.g., "Section 3 changes", "Definitions", "Termination clause")
   - By change type (e.g., "Date changes", "Party name updates", "Legal term replacements")
   - By proximity (e.g., "Changes on pages 1-3", "Changes in first half of document")

   For each batch of related changes:

   **a. Map text to XML**: Grep for text in `word/document.xml` to verify how text is split across `<w:r>` elements.

   **b. Create and run script**: Use `get_node` to find nodes, implement changes, then `doc.save()`. See **"Document Library"** section in ooxml.md for patterns.

   **Note**: Always grep `word/document.xml` immediately before writing a script to get current line numbers and verify text content. Line numbers change after each script run.

5. **Pack the document**: After all batches are complete, convert the unpacked directory back to .docx:
   ```bash
   python ooxml/scripts/pack.py unpacked reviewed-document.docx
   ```

6. **Final verification**: Do a comprehensive check of the complete document:
   - Convert final document to markdown:
     ```bash
     pandoc --track-changes=all reviewed-document.docx -o verification.md
     ```
   - Verify ALL changes were applied correctly:
     ```bash
     grep "original phrase" verification.md  # Should NOT find it
     grep "replacement phrase" verification.md  # Should find it
     ```
   - Check that no unintended changes were introduced

## Converting Documents to Images

To visually analyze Word documents, convert them to images using a two-step process:

1. **Convert DOCX to PDF**:
   ```bash
   soffice --headless --convert-to pdf document.docx
   ```

2. **Convert PDF pages to JPEG images**:
   ```bash
   pdftoppm -jpeg -r 150 document.pdf page
   ```
   This creates files like `page-1.jpg`, `page-2.jpg`, etc.

Options:
- `-r 150`: Sets resolution to 150 DPI (adjust for quality/size balance)
- `-jpeg`: Output JPEG format (use `-png` for PNG if preferred)
- `-f N`: First page to convert (e.g., `-f 2` starts from page 2)
- `-l N`: Last page to convert (e.g., `-l 5` stops at page 5)
- `page`: Prefix for output files

Example for specific range:
```bash
pdftoppm -jpeg -r 150 -f 2 -l 5 document.pdf page  # Converts only pages 2-5
```

## Code Style Guidelines
**IMPORTANT**: When generating code for DOCX operations:
- Write concise code
- Avoid verbose variable names and redundant operations
- Avoid unnecessary print statements

## Dependencies

Required dependencies (install if not available):

- **pandoc**: `sudo apt-get install pandoc` (for text extraction)
- **docx**: `npm install -g docx` (for creating new documents)
- **LibreOffice**: `sudo apt-get install libreoffice` (for PDF conversion)
- **Poppler**: `sudo apt-get install poppler-utils` (for pdftoppm to convert PDF to images)
- **defusedxml**: `pip install defusedxml` (for secure XML parsing)
````

**它为何强大**：提供了清晰的决策树，根据任务类型将 Claude 路由到正确的工作流；使用渐进式披露保持主文件精简，仅在需要时引用详细的实现文件；并包含具体的正反示例，准确展示如何实现修订痕迹等复杂模式。

### **Skill 示例 #2：[品牌指南](https://github.com/anthropics/skills/blob/main/brand-guidelines/SKILL.md?plain=1)**

```
#name: brand-guidelines
description: Applies Anthropic's official brand colors and typography to any sort of artifact that may benefit from having Anthropic's look-and-feel. Use it when brand colors or style guidelines, visual formatting, or company design standards apply.
license: Complete terms in LICENSE.txt
---

# Anthropic Brand Styling

## Overview

To access Anthropic's official brand identity and style resources, use this skill.

**Keywords**: branding, corporate identity, visual identity, post-processing, styling, brand colors, typography, Anthropic brand, visual formatting, visual design

## Brand Guidelines

### Colors

**Main Colors:**

- Dark: `#141413` - Primary text and dark backgrounds
- Light: `#faf9f5` - Light backgrounds and text on dark
- Mid Gray: `#b0aea5` - Secondary elements
- Light Gray: `#e8e6dc` - Subtle backgrounds

**Accent Colors:**

- Orange: `#d97757` - Primary accent
- Blue: `#6a9bcc` - Secondary accent
- Green: `#788c5d` - Tertiary accent

### Typography

- **Headings**: Poppins (with Arial fallback)
- **Body Text**: Lora (with Georgia fallback)
- **Note**: Fonts should be pre-installed in your environment for best results

## Features

### Smart Font Application

- Applies Poppins font to headings (24pt and larger)
- Applies Lora font to body text
- Automatically falls back to Arial/Georgia if custom fonts unavailable
- Preserves readability across all systems

### Text Styling

- Headings (24pt+): Poppins font
- Body text: Lora font
- Smart color selection based on background
- Preserves text hierarchy and formatting

### Shape and Accent Colors

- Non-text shapes use accent colors
- Cycles through orange, blue, and green accents
- Maintains visual interest while staying on-brand

## Technical Details

### Font Management

- Uses system-installed Poppins and Lora fonts when available
- Provides automatic fallback to Arial (headings) and Georgia (body)
- No font installation required - works with existing system fonts
- For best results, pre-install Poppins and Lora fonts in your environment

### Color Application

- Uses RGB color values for precise brand matching
- Applied via python-pptx's RGBColor class
- Maintains color fidelity across different systems
```

**它为何强大**：提供了 Claude 本身不具备的精确、可操作的信息（确切的十六进制色码、字体名称、字号阈值），并通过清晰的 description 告诉 Claude 它做什么以及何时触发。

### **Skill 示例 #3：[前端设计 skill](https://claude.com/resources/articles/improving-frontend-design-through-skills)**

```
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, or applications. Generates creative, polished code that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.
```

## **常见问题**

### **如何编写真正能触发的 description？**

聚焦于能力和场景，而非通用关键词。包含动作动词、具体文件类型和清晰的用例。不要写 "文档处理 skill"，而应写 "从 PDF 中提取表格并转换为 CSV 格式，用于数据分析工作流"。

### **Claude 如何决定调用哪些 skills？**

Claude 使用语义理解，将你的请求与 skill descriptions 进行比对。这不是关键词匹配——Claude 判断的是上下文相关性。如果多个 skills 处理你请求的不同方面，它们可以同时激活。

### **我的 description 应该多细？**

目标是单一用途的 skills。"博客文章的 SEO 优化" 足够聚焦以提供具体指令，又足够宽泛以保持可复用。太宽泛："内容营销助手"。太狭窄："添加 meta 描述"。

### **如何在整个组织内共享 Skills？**

无论团队规模大小，我们都建议创建一个包含 skill 规范的共享文档仓库。

**对于较小团队**，使用包含名称、description、指令和版本信息的模板格式。

**对于中大型团队**，建立 skills 治理流程：

-   为每个领域（财务、法务、营销）指定 skill 负责人
-   维护一个中央 wiki 或共享驱动器作为你的 skill 库
-   为每个 skill 包含使用示例和常见故障排除
-   对 skills 进行版本管理，并在变更日志中记录变更
-   安排季度审查，以更新或淘汰过时的 skills

**适用于所有团队规模的最佳实践**：

-   记录每个 skill 的业务目的
-   为维护和更新分配明确的负责人
-   创建上手材料，向新团队成员展示如何实施共享 skills
-   跟踪哪些 skills 带来最大价值，以优先安排维护工作
-   使用一致的命名约定，以便轻松找到 skills

企业客户可以与 Anthropic 的客户成功团队合作，探索更多部署选项和治理框架。

### **如何调试 skills？**

分别测试触发和执行。如果 skills 不激活，扩展你的 description 并添加用例。如果结果不一致，为指令增加具体性并包含验证步骤。创建一个测试用例库，覆盖正常使用、边缘情况和超出范围的请求。

## **开始使用**

准备好使用 Skills 构建了吗？以下是开始的方法：

[Claude.ai](https://claude.ai/redirect/claudedotcom.v1.f3c9fc09-6928-4a88-a15c-b8005e93863b) 用户：

-   在 Settings → Features 中启用 Skills
-   在 claude.ai/projects 创建你的第一个项目
-   尝试将项目知识与 Skills 结合，用于你的下一个分析任务

API 开发者：

-   在[文档](https://docs.anthropic.com/)中探索 Skills 端点
-   查看我们的 [skills cookbook](https://platform.claude.com/cookbook/skills-notebooks-01-skills-introduction)

Claude Code 用户：

-   通过[插件市场](https://code.claude.com/docs/en/plugin-marketplaces)安装 Skills
-   查看我们的 [skills cookbook](https://platform.claude.com/cookbook/skills-notebooks-01-skills-introduction)
