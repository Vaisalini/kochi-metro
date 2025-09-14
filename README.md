# KMRL Train Induction Planning System - React Application

A comprehensive React.js application for managing train induction planning at Kochi Metro Rail Limited (KMRL).

## Features

- **Authentication System**: Role-based access control for Admin, Supervisor, and Maintenance Staff
- **Dashboard**: Interactive train grid with search and filtering capabilities
- **Train Management**: Detailed train information with tabbed interface
- **AI Recommendations**: Intelligent train induction planning with conflict detection
- **Plan Approval**: Supervisor approval workflow with export capabilities
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Automatic theme switching based on system preferences

## Installation

1. Clone or extract the project files
2. Navigate to the project directory:
   ```bash
   cd kmrl-train-planning-react
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```
5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser

## Usage

### Login Credentials

- **Admin**: 
  - Username: `admin`
  - Password: `admin123`
  - Role: `Admin`

- **Supervisor**: 
  - Username: `supervisor`
  - Password: `super123`
  - Role: `Supervisor`

- **Maintenance Staff**: 
  - Username: `maintenance`
  - Password: `maint123`
  - Role: `Maintenance Staff`

### Navigation

1. **Dashboard** (`/dashboard`): View all trains with filtering options
2. **Train Details** (`/train/:id`): Detailed information about specific trains
3. **AI Recommendations** (`/ai-recommendation`): Generate and review AI-powered induction plans
4. **Final Confirmation** (`/confirmation`): Approve and export final plans

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components (Modal, LoadingOverlay)
│   ├── layout/          # Layout components (Header)
│   └── train/           # Train-specific components (TrainCard)
├── hooks/               # Custom React hooks (useAuth, useNotifications)
├── pages/               # Page components
├── data/                # Application data
├── styles/              # CSS files
├── utils/               # Utility functions
├── App.js              # Main application component
└── index.js            # Entry point
```

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App (one-way operation)

## Key Features

### Authentication & Authorization
- Secure login system with role-based access
- Protected routes that require authentication
- Session persistence using localStorage

### Train Management
- Real-time train status monitoring
- Certificate expiry tracking
- Job card management
- Branding and SLA compliance monitoring
- Mileage and maintenance tracking

### AI-Powered Planning
- Intelligent train ranking based on multiple criteria
- Conflict detection and resolution suggestions
- Confidence scoring for recommendations
- Plan optimization for revenue service

### User Interface
- Modern, responsive design
- Dark/light mode support
- Interactive components with hover effects
- Loading states and error handling
- Modal dialogs for detailed information

## Technologies Used

- **React 18**: Modern React with functional components and hooks
- **React Router 6**: Client-side routing
- **CSS Custom Properties**: Design system with consistent styling
- **Local Storage**: Client-side data persistence
- **Responsive Design**: Mobile-first approach

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

This application was converted from a vanilla JavaScript implementation to React.js while maintaining all original functionality and styling.

## License

Internal use - Kochi Metro Rail Limited (KMRL)
