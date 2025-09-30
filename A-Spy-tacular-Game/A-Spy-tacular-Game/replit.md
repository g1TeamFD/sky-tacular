# Overview

EcoBlocks is an educational block puzzle game that combines Tetris-style gameplay with sustainability and global citizenship learning. Players manipulate falling blocks containing keywords related to environmental protection, social responsibility, and global awareness. The game features sentence completion challenges where players use collected keywords to fill in blanks, creating an engaging learning experience that promotes environmental consciousness and civic responsibility.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client uses React with TypeScript, built with Vite as the development server and bundler. The UI is constructed using shadcn/ui components built on Radix UI primitives, with Tailwind CSS for styling. The application follows a component-based architecture with clear separation between game logic, UI components, and data management.

**Key Frontend Components:**
- **Game Engine**: Handles Tetris-style block falling mechanics, collision detection, and board state management
- **Educational System**: Manages keyword presentation, sentence challenges, and scoring based on educational content
- **UI Components**: Reusable components for game board, controls, modals, and score displays
- **State Management**: Uses React hooks and TanStack Query for client state and server state synchronization

## Backend Architecture
The server is built with Express.js and follows a RESTful API design. Authentication is handled through Passport.js with local strategy and session-based persistence using PostgreSQL session storage.

**Core Backend Components:**
- **Game Session Management**: Tracks player progress, scores, and completed sentences
- **Player Progress Tracking**: Stores learning analytics and achievement data
- **Achievement System**: Manages milestone recognition and reward distribution
- **Email Integration**: Mock email system for achievement notifications (manual handling preferred)

## Data Storage
Uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations. The database supports both authenticated and anonymous gameplay modes.

**Database Schema Design:**
- **User Management**: Standard authentication tables for registered users
- **Game Sessions**: Stores individual gameplay instances with scores and progress
- **Player Answers**: Tracks sentence completion responses for learning analytics
- **Achievement Tracking**: Records player milestones and reward distribution

## Authentication and Authorization
Implements session-based authentication using Passport.js with local strategy. Supports both authenticated and anonymous gameplay modes to accommodate different user preferences.

**Security Features:**
- Password hashing using scrypt with salt
- Session management with secure cookies in production
- CSRF protection through session validation
- Access control for player data and game sessions

# External Dependencies

## Database Services
- **Neon Database**: PostgreSQL hosting service for production data storage
- **Drizzle ORM**: Type-safe database toolkit for schema management and queries

## UI and Styling
- **shadcn/ui**: Component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Radix UI**: Headless UI components for accessibility and interaction patterns

## Development Tools
- **Vite**: Modern build tool and development server
- **TypeScript**: Type safety and enhanced developer experience
- **TanStack Query**: Server state management and caching

## Email Services
- **SendGrid**: Email delivery service (currently disabled, manual email handling preferred)
- Mock email system logs achievement notifications to console

## Authentication
- **Passport.js**: Authentication middleware with local strategy
- **express-session**: Session management with PostgreSQL storage
- **connect-pg-simple**: PostgreSQL session store adapter