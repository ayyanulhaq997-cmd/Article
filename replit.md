# Ayyan's Tech Hub

## Overview
A personal tech content writer portfolio website built with React, Vite, and TypeScript. Features a blog, services page, portfolio, contact page, and admin dashboard. Uses Tailwind CSS (via CDN) for styling.

## Project Architecture
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS (CDN)
- **Icons**: Lucide React
- **Routing**: React Router DOM v7
- **AI Integration**: Google Generative AI (@google/genai)

## Project Structure
- `/` - Root contains main entry files (index.html, index.tsx, App.tsx)
- `/pages/` - Page components (HomePage, BlogPage, ServicesPage, etc.)
- `/components/` - Shared components (Layout, SEO, NewsletterSection)
- `/public/` - Static assets

## Configuration
- Vite dev server runs on port 5000 with all hosts allowed
- Deployment: Static site (builds to `dist/`)

## Recent Changes
- 2026-02-11: Initial Replit setup - configured Vite for port 5000, removed import maps in favor of Vite bundling
