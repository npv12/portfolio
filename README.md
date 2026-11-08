# Personal Portfolio

A modern, responsive portfolio website built with Next.js that showcases experience, projects, skills and blog content.

Visit the live demo at: https://portfolio-pranavs-projects-1ca3ecef.vercel.app/

View the blogs at: https://portfolio-pranavs-projects-1ca3ecef.vercel.app/blogs

## Features

- 🌓 Dark/Light mode along with various themes with theme persistence
- 💼 Professional experience timeline
- 🛠️ Skills visualization with interactive tag sphere
- 📱 Fully responsive design
- 📝 Blog integration
- 🎯 Project showcase
- ✨ Smooth animations and transitions

## Tech Stack

- Next.js
- TypeScript
- TailwindCSS
- DaisyUI
- React Icons

## Getting Started

1. Clone the repository:

git clone https://github.com/npv12/portfolio.git


2. Install dependencies:

yarn install


3. Run the development server:

yarn dev


4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Customization

Personal data lives in `src/data/`:

- `basic.ts`: name, role, contact links
- `experience.ts`: work history
- `projects.ts`: projects
- `skills.ts`: toolbox

Blog posts are Markdown files in `public/blogs/`.

## Project Structure

```
src/
├── app/          # Routes only: pages, layout, metadata, OG images, feeds
├── components/   # Shared UI (article/ holds blog-post widgets)
├── sections/     # Home page sections: Intro, Experience, Projects, …
├── data/         # Personal content
├── lib/          # Server helpers: blog loading, Markdown, OG cards
├── theme/        # Light/dark scheme state and the build-time palette
├── styles/       # CSS: tokens, base, components, sections, blog
└── types/        # Shared TypeScript types
```

### Colour system

`src/styles/tokens.css` defines two 12-step scales (`sage` neutral, `blue`
accent) as `light-dark()` pairs, and semantic tokens (`--paper`, `--ink`,
`--line`, `--signal`, …) that components use. To change the palette, edit the
scale steps there and mirror them in `src/theme/palette.ts`, which feeds the
social cards, icon and browser theme colour.

## Contributing

Feel free to fork this project and customize it for your own use. If you find any bugs or have suggestions, please open an issue.

## Acknowledgements
Special thanks to:
- [Cody AI](https://sourcegraph.com/cody) for code assistance
- [DaisyUI](https://daisyui.com/) for beautiful UI components
- [Next.js](https://nextjs.org/) for the amazing framework
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS
- Various open source projects and their maintainers for inspiration

If I missed acknowledging someone, please reach out at pranav10121@gmail.com and I will ensure they are included.
