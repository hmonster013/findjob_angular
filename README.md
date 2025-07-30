# FindJob Angular

A job search application built with Angular 19, providing a platform that connects employers and job seekers.

## 📋 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Docker](#docker)
- [Project Structure](#project-structure)
- [API and Services](#api-and-services)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features

### For Job Seekers:
- 🔍 Search and filter jobs by multiple criteria
- 📝 Create and manage personal profiles
- 📄 Upload and manage CVs/resumes
- 💼 Apply for jobs online
- 📊 Track application status
- 🔔 Receive job opportunity notifications
- 💬 Chat with employers
- 📈 View activity statistics

### For Employers:
- 📋 Post and manage job listings
- 👥 Search and view candidate profiles
- 📊 Manage recruitment process
- 💬 Chat with candidates
- 📈 Statistics and reporting
- 🏢 Manage company information

### General Features:
- 🔐 User authentication and authorization
- 🤖 Support chatbot
- 📱 Responsive design
- 🌐 Multi-language support
- 📤 Social media sharing
- 📊 Charts and analytics

## 🛠 Technologies Used

### Frontend Framework:
- **Angular 19** - Main framework
- **TypeScript** - Programming language
- **RxJS** - Reactive programming

### UI/UX:
- **TailwindCSS 4.1.4** - CSS framework
- **FontAwesome** - Icons
- **SweetAlert2** - Modals and notifications
- **ngx-toastr** - Toast notifications
- **Swiper** - Carousel component

### Charts & Visualization:
- **Chart.js** - Charts library
- **ng2-charts** - Angular wrapper for Chart.js

### Rich Text Editor:
- **Quill** - Rich text editor
- **ngx-quill** - Angular integration

### File Processing:
- **jsPDF** - PDF generation
- **jsPDF-AutoTable** - Tables in PDF
- **html2canvas** - Screenshot capture
- **xlsx** - Excel file processing

### Authentication:
- **angular-oauth2-oidc** - OAuth2/OIDC
- **ngx-cookie-service** - Cookie management

### Backend Integration:
- **Firebase** - Backend as a Service
- **@angular/fire** - Angular Firebase integration

### Development Tools:
- **Angular CLI** - Development tools
- **Karma & Jasmine** - Testing
- **Docker** - Containerization

## 📋 System Requirements

- **Node.js**: >= 18.x
- **npm**: >= 9.x
- **Angular CLI**: >= 19.x
- **Docker** (optional): >= 20.x

## 🚀 Installation

### 1. Clone repository

```bash
git clone <repository-url>
cd findjob_angular
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Install Angular CLI (if not already installed)

```bash
npm install -g @angular/cli
```

### 4. Environment configuration

Create configuration files in `src/environments/`:

```bash
# Create environment.ts and environment.prod.ts files
# Configure Firebase, API endpoints, etc.
```

## 🏃‍♂️ Running the Application

### Development server

```bash
# Run on localhost:4200
ng serve

# Run with specific host
ng serve --host 127.0.0.1 --disable-host-check

# Run on different port
ng serve --port 4201
```

Open your browser and navigate to `http://localhost:4200/`

### Production build

```bash
# Build for production
ng build

# Build with optimization
ng build --configuration production
```

## 🐳 Docker

### Running with Docker Compose

```bash
# Build and run container
docker-compose up -d

# View logs
docker-compose logs -f frontend

# Stop container
docker-compose down
```

### Running Docker manually

```bash
# Build image
docker build -t findjob-angular .

# Run container
docker run -p 4200:4200 findjob-angular
```

## 📁 Project Structure

```
src/
├── app/
│   ├── _components/          # Shared components
│   │   ├── activity-chart/   # Activity chart component
│   │   ├── apply-card/       # Application card component
│   │   ├── chatbot/          # Chatbot component
│   │   ├── job-post/         # Job post component
│   │   └── ...
│   ├── _configs/             # Application configurations
│   │   ├── constants.ts      # Constants
│   │   └── firebase-config.ts # Firebase configuration
│   ├── _guard/               # Route guards
│   │   └── auth.guard.ts     # Authentication guard
│   ├── _interceptors/        # HTTP interceptors
│   │   ├── error.interceptor.ts
│   │   ├── loading.interceptor.ts
│   │   └── ngrok-header.interceptor.ts
│   ├── _models/              # Data models/interfaces
│   ├── _services/            # Business logic services
│   │   ├── authentication.service.ts
│   │   ├── job.service.ts
│   │   ├── company.service.ts
│   │   └── ...
│   ├── _utils/               # Utility functions
│   │   ├── dateHelper.ts
│   │   ├── func-utils.ts
│   │   └── sweetalert2-modal.ts
│   ├── layouts/              # Layout components
│   │   ├── default-layout/
│   │   ├── employer-layout/
│   │   ├── job-seeker-layout/
│   │   └── chat-layout/
│   ├── pages/                # Page components
│   │   ├── auth-pages/       # Authentication pages
│   │   ├── employer-pages/   # Employer pages
│   │   ├── job-seeker-pages/ # Job seeker pages
│   │   ├── chat-pages/       # Chat pages
│   │   └── default-pages/    # Public pages
│   ├── app.component.*       # Root component
│   ├── app.config.ts         # App configuration
│   └── app.routes.ts         # Routing configuration
├── assets/                   # Static assets
├── environments/             # Environment configurations
├── index.html               # Main HTML file
├── main.ts                  # Application entry point
└── styles.css               # Global styles
```

## 🔧 API and Services

### Authentication Service
- Login/Registration
- Token management
- OAuth2 integration

### Job Service
- CRUD operations for job posts
- Job search and filtering
- Application management

### Company Service
- Company information management
- Logo and image upload
- Company following

### Firebase Service
- Real-time database
- File storage
- Push notifications

### Chat Service
- Real-time messaging
- Chat history
- File sharing

## 🧪 Testing

### Unit Tests

```bash
# Run unit tests
ng test

# Run tests with coverage
ng test --code-coverage

# Run tests once
ng test --watch=false
```

### E2E Tests

```bash
# Install Cypress (if needed)
npm install cypress --save-dev

# Run E2E tests
ng e2e
```

## 🚀 Deployment

### Production Build

```bash
# Build optimized
ng build --configuration production

# Build with base href
ng build --base-href /findjob/
```

### Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy
firebase deploy
```

### Deploy to Nginx

```bash
# Copy dist folder to nginx
cp -r dist/findjob_angular/* /var/www/html/

# Configure nginx for SPA
# Add try_files $uri $uri/ /index.html;
```

## 🤝 Contributing

### Contribution Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Create a Pull Request

### Coding Standards

- Use TypeScript strict mode
- Follow Angular style guide
- Write unit tests for components and services
- Use meaningful commit messages
- Code review before merging

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push branch
git push origin feature/new-feature

# Create Pull Request on GitHub/GitLab
```

## 📝 Available Scripts

```bash
# Development
npm start              # ng serve
npm run build          # ng build
npm run watch          # ng build --watch
npm test               # ng test

# Linting & Formatting
npm run lint           # ESLint
npm run format         # Prettier

# Docker
docker-compose up      # Run with Docker
docker-compose down    # Stop containers
```

## 🔧 Troubleshooting

### Common Issues

1. **Node modules conflicts**
   ```bash
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

2. **Angular CLI version mismatch**
   ```bash
   npm uninstall -g @angular/cli
   npm install -g @angular/cli@latest
   ```

3. **Port already in use**
   ```bash
   ng serve --port 4201
   ```

4. **Memory issues**
   ```bash
   node --max_old_space_size=8192 node_modules/@angular/cli/bin/ng serve
   ```

## 📞 Contact

- **Email**: [your-email@example.com]
- **GitHub**: [your-github-profile]
- **LinkedIn**: [your-linkedin-profile]

## 📄 License

This project is distributed under the MIT License. See the `LICENSE` file for more details.

---

**Version**: 0.0.0
**Last Updated**: 2025-07-30
**Angular Version**: 19.0.0


