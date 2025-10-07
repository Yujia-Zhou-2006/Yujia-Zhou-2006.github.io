# 🌐 Yujia Zhou – Personal Website

This repository hosts my personal website, built with **Jekyll** and styled using **GitHub Primer** design tokens.

Live site: [https://Yujia-Zhou-2006.github.io](https://Yujia-Zhou-2006.github.io)

---

## 📖 Overview
A minimal, GitHub-style portfolio site designed for readability and simplicity.
It showcases:
- 🎮 **PICO-8 / Picotron** projects  
- ✈️ **Model builds** (1/72 aircraft)  
- 🖼 **Pixel artworks**  
- ⚙️ **Engineering experiments**  
- 📝 Blog posts and development notes

All pages are static and deployed automatically by **GitHub Pages**.

---

## 🏗️ Structure

```text
Yujia-Zhou-2006.github.io/
│
├── _config.yml              # Global configuration (title, socials, pinned projects)
├── _projects/               # Project entries (.md, each with front matter)
├── _posts/                  # Blog posts (standard Jekyll post format)
├── _layouts/                # Page templates (home, project, post, etc.)
├── _includes/               # Shared partials (header, footer, card, etc.)
├── assets/
│   ├── images/              # Avatars and project images
│   ├── styles/              # Custom CSS (theme-tokens.css)
│   └── scripts/             # JS (theme toggle, copy wechat)
└── pages/                   # Stand-alone pages (Projects / Blog / Contact)

```
---

## 🎨 Design
- Based on **GitHub Primer CSS**
- Responsive layout (desktop dual-column, mobile vertical)
- Light / dark / auto color modes  
- Social links with icons (GitHub → Email → WeChat → Instagram → RED → Itch.io → Pixilart)
- WeChat button copies ID automatically with toast notification

