# Counsultancy App

A full-stack consultancy application with NestJS backend and Next.js frontend.

## Project structure

- `apps/api` - NestJS backend service
- `apps/web` - Next.js frontend
- `packages` - shared packages / micro frontends
- `stiched` - prototype/archived UI implementations

## Quick start

1. `cd apps/api && pnpm install && pnpm run start:dev`
2. `cd apps/web && pnpm install && pnpm run dev`

## Features

- Client onboarding and profile management
- Institution and partner university directory
- Application and document tracking workflow
- Office check-ins, scheduling, and attendance logs
- Contact management and communication history

## Architecture

- `apps/api`: NestJS + Prisma + REST or GraphQL APIs
- `apps/web`: Next.js with React, Tailwind, and modular Feature UI
- `packages`: shared domain models, UI components, utilities
- `stiched`: past design experiments and launchable UI prototypes

## Environment variables

In `apps/api/.env` and `apps/web/.env`, include at least:
- `DATABASE_URL` (PostgreSQL)
- `NEXT_PUBLIC_API_URL`
- `JWT_SECRET`

## Data seeding

1. `cd apps/api`
2. `pnpm prisma migrate dev`
3. `pnpm prisma db seed`

## Deployment

- Backend: Dockerize `apps/api`, push image to registry, connect to managed DB
- Frontend: Vercel / Netlify with environment variables and API URL

## Contribution

1. Fork the repo
2. Create a feature branch
3. Add tests for new code
4. Open a PR with clear summary and testing steps

## Testing

- API tests: `cd apps/api && pnpm test`
- Web tests: `cd apps/web && pnpm test`

## Notes

This repository is a hands-on consultancy app learning project. Focus on clean architecture and incremental delivery.
