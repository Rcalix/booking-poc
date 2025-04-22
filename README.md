# Booking Application

A full-stack booking application that allows users to schedule appointments while preventing conflicts with their Google Calendar events.

## Features

- User authentication with Auth0
- Google Calendar integration
- Booking creation with conflict prevention
- Viewing and canceling bookings
- Responsive design

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Framer Motion
- **Backend**: NestJS, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: Auth0
- **External APIs**: Google Calendar API
- **Deployment**: Docker, Docker Compose

## Prerequisites

- Docker and Docker Compose
- Auth0 account
- Google Cloud Console project with Calendar API enabled

## Setup and Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/booking-app.git
cd booking-app
```

### 2. Environment variables

Create a `.env` file at the root of the project based on the provided `.env.example`:

```bash
cp .env.example .env
```

Edit the `.env` file with your credentials:
- Auth0 credentials
- Google API credentials
- Database connection details
- JWT secret

### 3. Docker setup

Build and start the Docker containers:

```bash
docker-compose up -d
```

### 4. Database migration

Run Prisma migrations to create the database schema:

```bash
docker-compose exec booking-backend npx prisma migrate deploy
```

### 5. Access the application

Once the containers are running and migrations are complete:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

## Project Structure

### Backend (NestJS)

```
booking-backend/
├── src/
│   ├── auth/                # Authentication module
│   ├── booking/             # Booking management
│   ├── google-calendar/     # Google Calendar integration
│   ├── prisma/              # Database schema and client
│   ├── user/                # User management
│   └── app.module.ts        # Main application module
├── prisma/
│   └── schema.prisma        # Prisma schema
├── Dockerfile               # Docker configuration
└── package.json             # Dependencies
```

### Frontend (Next.js)

```
booking-frontend/
├── src/
│   ├── app/                 # Next.js pages
│   ├── components/          # React components
│   ├── context/             # React contexts
│   ├── hooks/               # Custom hooks
│   ├── services/            # API services
│   └── types/               # TypeScript types
├── public/                  # Static assets
├── Dockerfile               # Docker configuration
└── package.json             # Dependencies
```

## API Endpoints

### Authentication
- `GET /api/auth/login` - Initiates Auth0 login flow
- `GET /api/auth/callback` - Auth0 callback handler
- `GET /api/auth/me` - Gets current user info
- `GET /api/auth/logout` - Logs user out

### Bookings
- `GET /api/bookings` - Gets all user bookings
- `GET /api/bookings/:id` - Gets a specific booking
- `POST /api/bookings` - Creates a new booking
- `DELETE /api/bookings/:id` - Cancels a booking

### Google Calendar
- `GET /api/google/connect` - Initiates Google OAuth flow
- `GET /api/google/callback` - Google OAuth callback
- `GET /api/google/check-conflicts` - Checks for conflicts with Google Calendar

## Common Issues and Troubleshooting

### Database Connection Issues
If the application can't connect to the database, ensure PostgreSQL is running:
```bash
docker-compose ps
```

If there are connection issues, you can check the logs:
```bash
docker-compose logs booking-postgres
```

### Migration Issues
If tables don't exist, manually run migrations:
```bash
docker-compose exec booking-backend npx prisma migrate deploy
```

### Auth0 Connection Problems
Ensure your Auth0 credentials are correct and the callback URLs are properly configured in the Auth0 dashboard.

## Development

### Running in Development Mode

For development with hot reloading:

```bash
# Frontend
cd booking-frontend
npm run dev

# Backend
cd booking-backend
npm run start:dev
```

### Backend Tests

```bash
cd booking-backend
npm test
```

## Deployment

For production deployment:

1. Update environment variables for production
2. Build and push Docker images
3. Run with docker-compose in production mode

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Auth0](https://auth0.com/) for authentication
- [Google Calendar API](https://developers.google.com/calendar) for calendar integration
- [NestJS](https://nestjs.com/) for backend framework
- [Next.js](https://nextjs.org/) for frontend framework
- [Prisma](https://www.prisma.io/) for database ORM
- [Docker](https://www.docker.com/) for containerization