<div align="center">

# 📖 Dictionary Web

A fast, responsive dictionary web app built with **Next.js**. Search any English word to get its phonetic pronunciation, definitions, synonyms, antonyms, examples, and source links — all in one clean interface.

![Desktop Mode](./public/screenshot/Dictionary-App-Desktop.jpg)
![Mobile Mode](./public/screenshot/Dictionary-App-10-22-2024_07_45_PM.jpg)

**Live Demo:** [dictionary-web-app-with-next-js-jbfj.vercel.app](https://dictionary-web-app-with-next-js-jbfj.vercel.app/) · **Repo:** [dictionary-web-app-with-nextJs](https://github.com/itadori-kun/dictionary-web-app-with-nextJs)

</div>

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Note](#api-note)
- [Project Structure](#project-structure)
- [Useful Resources](#useful-resources)
- [Author](#author)

## Features

- 🔍 **Word search** — look up any English word via the Free Dictionary API (press Enter or click the search icon). Search terms are case-insensitive
- 🔉 **Translate to Bahasa** — get an English → Indonesian translation of any looked-up word via the MyMemory API
- 🔊 **Audio pronunciation** — hear the word spoken using the Web Speech API
- 📚 **Rich results** — phonetics, definitions, synonyms, antonyms, examples, and source links
- 🔤 **Font selector** — switch between Sans Serif, Serif, and Mono typefaces
- 🌙 **Dark / light mode** — instant theme toggle powered by `next-themes`
- 🧪 **Robust validation** — API responses validated with Zod
- 📱 **Mobile-first, responsive design** — works seamlessly from phone to desktop
- 🛑 **Graceful states** — clear empty-state and "no definitions found" UI

## Tech Stack

- [Next.js](https://nextjs.org/) 16 — React framework
- [React](https://reactjs.org/) 18
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) — styling
- [next-themes](https://github.com/pacocoursey/next-themes) — theme switching
- [Zod](https://zod.dev/) — schema validation
- [Free Dictionary API](https://dictionaryapi.dev/) / [FreeDictionaryAPI](https://freedictionaryapi.com/) — word data
- [MyMemory Translation API](https://mymemory.translated.net/) — English → Bahasa translation
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) — pronunciation audio

## Getting Started

### Prerequisites

- **Node.js** 18+ and **npm** installed on your machine.

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/itadori-kun/dictionary-web-app-with-nextJs.git

# 2. Navigate into the project
cd dictionary-web-app-with-nextJs

# 3. Install dependencies
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

### Build & production

```bash
npm run build   # create an optimized production build
npm run start   # start the production server
npm run lint    # run ESLint
```

## API Note

The app consumes the public **Free Dictionary API** — **no API key is required**. Responses are validated against a Zod schema before being rendered.

The **Translate to Bahasa** feature uses the free [MyMemory Translation API](https://mymemory.translated.net/), which is key-less for low-volume use. Translations are fetched on-demand when you click the "Translate to Bahasa" button under a word.

## Project Structure

```
src/
├── app/
│   ├── fonts/            # Local fonts (Inter, Lora, Inconsolata)
│   ├── globals.css
│   ├── layout.tsx        # Root layout + font + theme provider
│   └── page.tsx          # Main dictionary page (search, results, UI logic)
└── components/
    ├── dropdownArrow.tsx # Font-selector arrow
    ├── emptyMode.tsx     # Empty-state placeholder
    ├── ModeToggle.tsx    # Dark/light theme toggle
    ├── moon.tsx          # Moon icon
    ├── notFound.tsx      # "No definitions found" state
    └── theme-provider.tsx
```

## Useful Resources

- [Flowbite — input field](https://flowbite.com/docs/forms/input-field/) — helped with the search input styling and pattern.

## Author

- **GitHub** — [@itadori-kun](https://github.com/itadori-kun)
- **Frontend Mentor** — [@itadori-kun](https://www.frontendmentor.io/profile/itadori-kun)
- **Twitter / X** — [@godwincruise](https://www.twitter.com/godwincruise)
