# PCB Product Automotions

A comprehensive production-ready web application for managing PCB (Printed Circuit Board) automation reports and user management. Built with modern web technologies for reliable performance and scalability.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure session-based login system with password change capability
- **Report Management**: Create, view, and manage hourly and daily PCB automation reports
- **Date Range Reports**: Generate comprehensive reports across custom date ranges
- **Real-time Data**: Live updates and instant report generation
- **WhatsApp Integration**: Direct sharing of reports via WhatsApp

### Technical Features
- **Production Ready**: MongoDB database with session storage
- **Network Ready**: Automatic IP detection for local network access
- **Responsive Design**: Mobile-friendly interface with modern UI
- **API Documentation**: Complete REST API with comprehensive endpoints
- **Development Tools**: Morgan logging, ESLint, and automated testing setup

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: Session-based auth with express-session
- **Security**: bcryptjs for password hashing, CORS configuration
- **Logging**: Morgan for request logging
- **Environment**: dotenv for configuration management

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: CSS Modules with responsive design
- **HTTP Client**: Axios with credentials support
- **Routing**: React Router for navigation
- **Build Tool**: Vite for fast development and optimized builds

### Development Tools
- **Package Manager**: pnpm for frontend, npm for backend
- **Version Control**: Git with structured commit messages
- **Code Quality**: ESLint for code linting
- **Documentation**: Comprehensive API and setup guides

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB Atlas** account - [Sign up](https://www.mongodb.com/atlas)
- **Git** - [Download](https://git-scm.com/)
- **pnpm** (recommended) or npm

### Optional but Recommended
- **Visual Studio Code** with extensions for React and Node.js development

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone git@github.com:faketi101/pcb-product-automation.git
cd pcb-automotions
```

### 2. Environment Setup
The start scripts will automatically detect your local IP and configure the environment files. Choose between localhost (local only) or network IP (accessible from other devices).

### Linux/macOS
```bash
./start.sh
```

### Windows
```bash
start.bat
```

The script will:
- Detect your local network IP address
- Ask you to choose between localhost or network access
- Automatically configure `.env` files for both backend and frontend
- Install dependencies if needed
- Start both servers

## 📖 Manual Setup (Alternative)

If you prefer manual setup:

### Backend Setup
```bash
cd backend
pnpm install
cp .env.example .env
# Edit .env with your MongoDB connection string and other settings
pnpm start
```

### Frontend Setup
```bash
cd frontend
pnpm install
cp .env.example .env
# Edit .env with the backend API URL
pnpm dev
```

## 🌐 Access URLs

After starting the application, you'll see URLs for both local and network access:

```
Local Access:
  Backend:  http://localhost:5000
  Frontend: http://localhost:5173

Network Access:
  Backend:  http://192.168.1.100:5000
  Frontend: http://192.168.1.100:5173
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/change-password` - Change user password

### Report Endpoints
- `GET /api/reports/hourly` - Get hourly reports with filters
- `POST /api/reports/hourly` - Create new hourly report
- `GET /api/reports/daily/:date` - Get daily report for specific date
- `GET /api/reports/daily` - Get daily reports with date range
- `PUT /api/reports/hourly/:id` - Update hourly report
- `DELETE /api/reports/hourly/:id` - Delete hourly report

### Prompt Endpoints
- `GET /api/prompts` - Get product prompts
- `POST /api/prompts` - Create new prompt

## ⚙️ Configuration

### Environment Variables

#### Backend (.env)
```env
MONGODB_URI=
SESSION_SECRET=
FRONTEND_URL=
PORT=5000
NODE_ENV=development
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

### Network Configuration
The application supports both local development and network access:

1. **Local Development**: Use `localhost` for development on a single machine
2. **Network Access**: Use your local IP (e.g., `192.168.1.100`) to access from other devices on the same network
3. **Production**: Configure with your production domain

## 🧪 Development

### Available Scripts

#### Backend
```bash
cd backend
npm run dev      # Start with nodemon for development
npm start        # Start production server
npm test         # Run tests
```

#### Frontend
```bash
cd frontend
pnpm dev         # Start development server
pnpm build       # Build for production
pnpm preview     # Preview production build
pnpm lint        # Run ESLint
```

### Project Structure
```
pcb-automotions/
├── backend/                 # Express.js server
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── config/             # Configuration files
│   ├── scripts/            # Utility scripts
│   └── server.js           # Main server file
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── context/        # React context
│   │   └── config/         # Configuration
│   ├── public/             # Static assets
│   └── vite.config.js      # Vite configuration
├── start.sh                # Linux/macOS launcher
├── start.bat               # Windows launcher
└── README.md              # This file
```

## 🚀 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production` in backend `.env`
- [ ] Configure production MongoDB URI
- [ ] Set strong `SESSION_SECRET`
- [ ] Configure production frontend URL
- [ ] Enable HTTPS in production
- [ ] Set up proper CORS origins
- [ ] Configure firewall rules

### Build Commands
```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && pnpm build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow ESLint configuration
- Use meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [troubleshooting guide](TROUBLESHOOTING.md)
2. Review the [API documentation](API_REFERENCE.md)
3. Check existing issues on GitHub
4. Create a new issue with detailed information

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.

---

**Built with ❤️ for efficient PCB Store Product automation management by TARIKUL ISLAM**
