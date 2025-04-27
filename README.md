# Fishki

A modern flashcard learning application that uses AI to help you study smarter, not harder.

## Table of Contents

- [Project Description](#project-description)
- [Tech Stack](#tech-stack)
- [Getting Started Locally](#getting-started-locally)
- [Available Scripts](#available-scripts)
- [Project Scope](#project-scope)
- [Project Status](#project-status)
- [License](#license)

## Project Description

Fishki is an educational flashcard application that helps users quickly create and manage study materials. The application leverages LLMs (via API) to automatically generate flashcard suggestions from provided text, significantly reducing the time needed to create effective study materials.

Key features:
- AI-powered flashcard generation from pasted text
- Manual creation and management of flashcards
- Spaced repetition algorithm for effective learning
- User authentication and account management
- Personal flashcard collection management

Fishki aims to solve the main pain point of manual flashcard creation, which often discourages users from using the effective spaced repetition learning method.

## Tech Stack

### Frontend
- [Astro](https://astro.build/) v5.5.5 - Modern web framework for building fast, content-focused websites
- [React](https://react.dev/) v19.0.0 - UI library for building interactive components
- [TypeScript](https://www.typescriptlang.org/) v5 - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) v4.0.17 - Utility-first CSS framework
- [Shadcn/ui](https://ui.shadcn.com/) - Accessible React component library based on Radix UI

### Backend
- [Supabase](https://supabase.com/) - Open-source Backend-as-a-Service with:
  - PostgreSQL database
  - Built-in authentication
  - Comprehensive SDK

### AI Integration
- [Openrouter.ai](https://openrouter.ai/) - Access to multiple LLM providers with cost management

### Development & Deployment
- GitHub Actions for CI/CD pipelines
- DigitalOcean for hosting via Docker

## Getting Started Locally

### Prerequisites
- Node.js v22.14.0 (as specified in `.nvmrc`)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/fishki.git
cd fishki
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Then edit the `.env` file to add your Supabase and OpenRouter API credentials.

4. Run the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:4321` to view the application.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run astro` - Run Astro CLI commands
- `npm run lint` - Run ESLint for code validation
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code using Prettier

## Project Scope

### Included in MVP

1. **Automated Flashcard Generation**
   - Text input (1,000-10,000 characters)
   - AI-generated flashcard suggestions
   - Review, acceptance, editing, or rejection of suggestions

2. **Manual Flashcard Management**
   - Manual creation with front and back sides
   - Editing and deletion options
   - Personal flashcard collection

3. **User Authentication**
   - Registration and login
   - Account management
   - Secure data storage

4. **Learning System**
   - Integration with a spaced repetition algorithm
   - Study session functionality

### Out of Scope for MVP

- Advanced, custom spaced repetition algorithm
- Gamification elements
- Mobile applications (web only)
- Document import (PDF, DOCX, etc.)
- Public API
- Flashcard sharing between users
- Advanced notification system
- Keyword-based flashcard search

## Project Status

This project is currently in active development. The MVP is under construction with a focus on core features:

- AI-powered flashcard generation
- Basic flashcard management
- User authentication
- Study session implementation

## License

MIT

---

© 2025 Fishki. All rights reserved.