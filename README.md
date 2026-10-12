<p align="right"><strong>🇺🇸 English</strong> · <a href="README.pt-BR.md">🇧🇷 Português</a></p>

<p align="center"><img src="docs/screenshots/fitcpx-logo.png" alt="FitCPX logo" width="100" /></p>

<h1 align="center">FitCPX — Web Platform</h1>
<p align="center"><strong>Fitness management SaaS built for real-world operations.</strong></p>
<p align="center"><a href="https://fitcpx.com">Official website</a> · <a href="#product-preview">Product preview</a> · <a href="#engineering">Engineering</a> · <a href="#mobile-apps">Mobile apps</a></p>
<p align="center"><code>React</code> · <code>TypeScript</code> · <code>Vite</code> · <code>TanStack Query</code> · <code>Playwright</code></p>

---

## Overview

FitCPX is a commercial SaaS platform that helps personal trainers and fitness businesses manage their daily operations. It brings **student management, workout prescription, physical assessments, scheduling, contracts and payments** together in one application.

I developed and maintained the web frontend, translating product requirements into interfaces and workflows used across different areas of the platform. This repository contains that **React/TypeScript application**, with its development history dating back to **November 2024**.

The backend and mobile applications are separate projects; they are introduced below to show how the platform fits together.

## Product preview

### Workout planning

Professionals can build training routines, organize sessions, select exercises and configure sets, repetitions and loads.

<p align="center"><img src="docs/screenshots/web-workout.png" alt="FitCPX web interface for planning and managing workouts" width="880" /></p>

### Physical assessments and reporting

The platform supports measurements, body-composition tracking and visual reports, making progress easier for professionals to review and discuss with students.

<p align="center"><img src="docs/screenshots/web-assessments.png" alt="FitCPX physical assessment charts and reports" width="780" /></p>

### Beyond workouts

The web application also includes company and student profiles, operational dashboards, appointment-related flows, contracts, subscriptions and billing interfaces. These modules form connected workflows rather than isolated demonstration screens.

## Engineering

This frontend combines a modular React application with business workflows, shared UI infrastructure and API integrations.

| Area | Implementation |
| --- | --- |
| **Application structure** | Feature-focused modules in `src/modules`, reusable components and hooks |
| **Forms and user flows** | React Hook Form, validation and multi-step interfaces |
| **Server data** | Dedicated API layer and TanStack Query for requests and data synchronization |
| **Data-intensive interfaces** | Tables, grids, dashboards and assessment charts |
| **State and navigation** | React Router and client-side state management |
| **Internationalization** | i18next and react-i18next |
| **Development and delivery** | Vite, Playwright, Docker, Nginx and documented historical CI/CD workflows |

**Technologies present in the project:** React 18, TypeScript, Vite, Tailwind CSS, Radix UI, React Bootstrap, TanStack Query, React Hook Form, Recoil, Zustand, TanStack Table, AG Grid, Recharts and ApexCharts.

The repository includes years of incremental changes, maintenance and refactoring. Its Git history reflects the evolution of an operating product rather than a one-off demo.

## Mobile apps

The FitCPX ecosystem also includes two mobile applications with separate codebases.

### FitCPX – Aluno

A companion app for students linked to trainers and businesses using the FitCPX platform. Students can access their assigned workouts, exercise demonstrations, assessment results and payment information.

<p align="center"><img src="docs/screenshots/student-app.png" alt="FitCPX Aluno mobile app showing an assigned workout exercise" width="500" /></p>

**Android:** [Google Play](https://play.google.com/store/apps/details?id=com.devcomplexlab.alunofitcpx) · **iOS:** [App Store](https://apps.apple.com/br/app/fitcpx-aluno/id6749808580)  
**Source code:** separate Flutter project.

### FitCPX – Exercise Library

An independent Android and iOS app for browsing **690+ exercises**, including video demonstrations and technical information. It can be used without an account linked to a FitCPX trainer or business.

**Android:** [Google Play](https://play.google.com/store/apps/details?id=com.devcomplexlab.fitcpx) · **iOS:** [App Store](https://apps.apple.com/us/app/fitcpx/id6749830273)  
**Source code:** separate mobile application project.

## Repository structure

```text
src/
├── api/             # Backend communication
├── components/      # Reusable UI components
├── hooks/           # Shared hooks
├── modules/         # Business features
├── routes/          # Navigation
├── states/          # Client state
└── types/           # Type definitions
public/              # Static assets
tests/               # Playwright tests
docs/
├── screenshots/     # Product images used here
└── legacy-workflows/ # Historical deployment configuration
```

## Local development

Requires Node.js, npm dependencies and a compatible development API.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `VITE_API_URL` in `.env.local` to the appropriate development backend. To create a production build:

```bash
npm run build
```

Some features and end-to-end tests require services and test credentials not included in this frontend repository.

## Links

- **Website:** [fitcpx.com](https://fitcpx.com)
- **Product:** FitCPX — LAB COMPLEX DEV LTDA

This repository documents the FitCPX web frontend. The product and its source code remain subject to their respective owners' rights; no open-source license is implied.
