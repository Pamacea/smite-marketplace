# Architect Agent - Creative Design Workflow

Complete guide to the creative design workflow powered by MCP tools.

## Overview

The Architect agent now features a powerful creative workflow that leverages MCP tools (WebSearch, Vision, Chrome DevTools) to research, analyze, and generate 5 distinct UI style variations for your project.

## Workflow Options

```bash
# Step-by-step creative workflow
/architect -b                    # Step 1: Create design brief
/architect -w                    # Step 2: Web search for references
/architect -v [-i <url>]         # Step 3: Visual analysis (optional specific image)
# Step 4: Generate 5 style variations (automatic)
/architect -x                    # Step 5: Create preview workspace
/architect --select=<style>      # Step 6: Implement chosen style

# Or combine steps
/architect -b -w -v -x "Design a modern SaaS dashboard"
```

## Option Flags

| Flag | Long Form | Purpose |
|------|-----------|---------|
| `-b` | `--brief` | Create design brief from prompt |
| `-w` | `--websearch` | Research design trends via WebSearch MCP |
| `-v` | `--vision` | Analyze references via Vision MCP |
| `-i <url>` | `--image <url>` | Analyze specific image URL |
| `-x` | `--preview` | Create temporary workspace with 5 style previews |
| `--select=<style>` | `--select=<style>` | Implement chosen style |

## The 5 Design Styles

### 1. Minimalist
- **Mood**: Calm, professional, focused
- **Best For**: SaaS products, Dashboards, Professional services
- **Complexity**: Low
- **Characteristics**:
  - Generous white space
  - Strong typography hierarchy
  - Limited color palette
  - Simple geometric shapes
  - Subtle interactions

### 2. Brutalist
- **Mood**: Bold, rebellious, confident
- **Best For**: Creative agencies, Portfolio sites, Edgy brands
- **Complexity**: Medium
- **Characteristics**:
  - High contrast colors
  - Bold typography
  - Visible borders/dividers
  - Asymmetric layouts
  - Raw, unpolished aesthetic

### 3. Glassmorphism
- **Mood**: Modern, futuristic, ethereal
- **Best For**: Tech startups, SaaS products, Mobile apps
- **Complexity**: High
- **Characteristics**:
  - Translucent backgrounds
  - Backdrop blur effects
  - Vibrant gradient accents
  - Floating elements
  - Subtle borders

### 4. Neumorphism
- **Mood**: Soft, modern, clean
- **Best For**: Mobile apps, Smart home interfaces, Modern tools
- **Complexity**: High
- **Characteristics**:
  - Soft shadows
  - Extruded shapes
  - Low contrast
  - Subtle depth
  - Rounded corners

### 5. Bento/Grid
- **Mood**: Organized, structured, modern
- **Best For**: Dashboards, Portfolio sites, Content-heavy apps
- **Complexity**: Medium
- **Characteristics**:
  - Card-based layout
  - Modular grid system
  - Clear content hierarchy
  - Responsive grid
  - Organized information

## MCP Tools Integration

### WebSearch MCP
- **Purpose**: Research current design trends, find inspiration
- **Used in**: Step 2 (`-w` flag)
- **Queries**: Design trends, color palettes, layout patterns
- **Output**: 15-30 curated references with URLs

### Vision MCP
- **Purpose**: Analyze reference images to extract design patterns
- **Used in**: Step 3 (`-v` flag)
- **Capabilities**:
  - `mcp__zai-mcp-server__analyze_image` - Extract design elements
  - `mcp__zai-mcp-server__ui_to_artifact` - Convert UI to code specs
- **Output**: Color schemes, typography, spacing, component patterns

### Chrome DevTools MCP
- **Purpose**: Inspect live websites for implementation patterns
- **Used in**: Optional for deeper research
- **Capabilities**: Extract computed styles, analyze breakpoints
- **Output**: Technical implementation insights

## Subagent Collaboration

### Frontend Subagent
- **Purpose**: Implement design specifications as production-ready components
- **Launched by**: Step 5 (`-x` flag)
- **Capabilities**:
  - Pixel-perfect component implementation
  - Design token integration
  - Responsive layouts
  - Accessibility (WCAG AA)
- **Output**: Working Next.js components in preview workspace

### UX Subagent
- **Purpose**: Refine designs for optimal usability
- **Launched by**: Step 6 for final refinements
- **Capabilities**:
  - Heuristic evaluation
  - Accessibility audit
  - User flow analysis
  - Micro-interaction design
- **Output**: Refined design with improved UX

## Output Files

| File | Location | Purpose |
|------|----------|---------|
| Design Brief | `.claude/.smite/design-brief.md` | Project requirements |
| Research Summary | `.claude/.smite/design-research.md` | Curated references |
| Visual Analysis | `.claude/.smite/visual-analysis.md` | Extracted tokens |
| Style Variations | `.claude/.smite/design-styles.md` | 5 style specifications |
| Final Spec | `.claude/.smite/final-design-spec.md` | Implementation spec |

## Complete Example

```bash
# 1. Create design brief
/architect -b "Design a modern SaaS analytics dashboard for e-commerce"

# 2. Research trends
/architect -w

# 3. Analyze references
/architect -v

# 4. Generate 5 styles (automatic)

# 5. Create previews
/architect -x
# Dev server: http://localhost:3000/preview

# 6. Browse and choose, then implement
/architect --select=glassmorphism
```

## See Also

- [Architect Documentation Index](INDEX.md) - All architect documentation
- [Design Styles Configuration](../../config/design-styles.json) - Complete style specifications
- [Workflow Steps](../../steps/architect/) - Detailed step-by-step guides
- [Frontend Subagent](../../skills/frontend/SKILL.md) - Implementation details
- [UX Subagent](../../skills/ux/SKILL.md) - Refinement guidelines
