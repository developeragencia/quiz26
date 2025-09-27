# Overview

This is a card matching game web application built with a modern full-stack architecture. Players register with their personal information (including birth date for zodiac sign calculation), then play memory-based card matching games in two different themed modes: Romance and Spicy. The game tracks player statistics and provides personalized feedback based on zodiac signs.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Forms**: React Hook Form with Zod validation
- **Design System**: Dark theme with purple/pink gradient color scheme

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints for player management and game results
- **Development**: Custom Vite integration for hot module replacement in development
- **Production**: Static file serving with Express in production

## Data Storage Solutions
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema**: Two main tables - players and game_results with proper foreign key relationships
- **Development Storage**: In-memory storage implementation for development/testing
- **Migrations**: Drizzle Kit for database schema management

## Database Schema Design
- **Players Table**: Stores user information including name, Instagram handle, birthdate, calculated zodiac sign, and creation timestamp
- **Game Results Table**: Records game sessions with player reference, game mode, score, number of matches, completion status, and timestamp
- **Relationships**: One-to-many relationship between players and game results

## Authentication and Authorization
- **Current State**: No authentication system implemented
- **Session Management**: Basic session handling prepared with connect-pg-simple for future use
- **Player Identification**: Players identified by unique IDs and Instagram handles

## Game Logic Architecture
- **Game Modes**: Two themed card matching experiences (Romance and Spicy mode)
- **Game State**: Local React state management for card positions, matches, and scoring
- **Zodiac Integration**: Birth date calculation to zodiac signs with personalized messaging
- **Scoring System**: Points based on successful matches and completion status

## External Dependencies
- **Database**: Neon PostgreSQL serverless database
- **Fonts**: Google Fonts (Inter, Architects Daughter, DM Sans, Fira Code, Geist Mono)
- **Icons**: Lucide React icon library
- **Development Tools**: Replit-specific Vite plugins for development environment integration
- **UI Framework**: Extensive Radix UI component ecosystem for accessible UI primitives