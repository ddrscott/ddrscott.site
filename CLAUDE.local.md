# Scott Pierce Blog Voice Guide

## Writing Style
- **Self-deprecating humor** with puns and pop culture references
- **Tutorial-focused** with step-by-step instructions and code examples
- **Visual learner approach** - use ASCII art, diagrams, GIFs when describing concepts
- **Conversational tone** - direct reader engagement, ask for comments
- **"Wouldn't it be great if..." framing** for introducing problems

## Technical Voice
- **SQL expertise** - treat as "love language", 20+ years experience
- **Ruby/Rails veteran** since 2005, "desert island language"
- **Vim power user** with strong opinions on editor efficiency
- **CLI tool philosophy** - POSIX standards, stdin/stdout patterns
- **Pragmatic over trendy** - proven tools over shiny frameworks

## Content Themes
- **Developer productivity** and workflow optimization
- **Questioning requirements** before implementing (XY Problem awareness)
- **Value over velocity** - business impact trumps technical speed
- **Teaching complex topics** with patience and humor
- **Tool building** that bridges different environments

## Article Structure
1. **Hook with humor** or relatable frustration
2. **Problem identification** - why this matters
3. **Step-by-step solution** with code examples
4. **Visual aids** (code blocks, diagrams, demos)
5. **Reflection/lesson learned**
6. **Call for reader engagement**

## Persona Evolution
From "10x developer" focused on speed → value-driven consultant who questions the "why" before the "how" while maintaining deep technical craft.

---

# Project Structure

```
ddrscott.site/
├── docs/
│   ├── blog/
│   │   ├── 2014/
│   │   ├── 2016/
│   │   ├── 2017/
│   │   ├── 2018/
│   │   ├── 2020/
│   │   ├── 2021/
│   │   ├── 2023/
│   │   ├── 2024/
│   │   └── 2025/          # Current year posts
│   ├── images/
│   │   ├── 2024/
│   │   └── 2025/          # Current year images
│   ├── index.md
│   ├── about.md
│   └── projects.md
├── custom/                 # MkDocs theme overrides
├── mkdocs.yml              # Site config and navigation
└── CLAUDE.local.md         # This file
```

## Adding a New Blog Post

1. **Create the markdown file** in `docs/blog/YYYY/` with a descriptive filename:
   ```
   docs/blog/2025/my-new-post.md
   ```

2. **Add frontmatter** at the top of the file:
   ```yaml
   ---
   date: 2025-11-21 12:00 America/Chicago
   comments: true
   categories: cli  # or: life, sql, vim, etc.
   published: true
   title: My Post Title
   image: /images/2025/featured-image.jpg  # optional
   description: |
     A brief description for SEO and previews.
   ---
   ```

3. **Start with H1 title** matching the frontmatter title, then featured image if present:
   ```markdown
   # My Post Title

   <img class="featured" src="/images/2025/featured-image.jpg" alt="description" />
   ```

4. **Register in mkdocs.yml** - Add entry under the appropriate year section in `nav:`:
   ```yaml
   - '2025':
     - 'My Post Title': blog/2025/my-new-post.md
     # ... other posts
   ```

   Note: Newer posts go at the top of the year section.

5. **If post fits a category** (Vim, SQL), also add it to that nav section.

## Building and Previewing

```sh
# Install dependencies (first time)
pip install mkdocs mkdocs-material

# Live preview
mkdocs serve

# Build static site
mkdocs build
```