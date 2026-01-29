# 🚀 LeadFinder - Local Business Lead Generation SaaS

A **compliant, ethical** lead generation platform for finding local businesses using Google Maps API.

## ✨ Features

- 🔍 **Google Maps API Integration** - Official API (40,000 free searches/month)
- 📧 **Email Templates** - Professional templates with personalization
- 📊 **CRM & Lead Management** - Track leads, add notes, manage status
- 📈 **Export Tools** - CSV/PDF export for your leads
- 🎨 **Premium UI** - Dark mode with glassmorphism and GSAP scroll animations
- ⚡ **Fast & Responsive** - Built with React + Vite

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite** - Fast, modern development
- **React Router** - Client-side routing
- **GSAP ScrollTrigger** - Premium scroll animations
- **Axios** - HTTP client
- **React Icons** - Beautiful icons

### Backend
- **Node.js** + **Express** - RESTful API
- **PostgreSQL** - Relational database
- **JWT** - Authentication
- **Google Maps Services** - Official Google Maps API client

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL installed and running
- Google Maps API key ([Get one here](https://developers.google.com/maps/documentation/javascript/get-api-key))

### Installation

1. **Clone the repository**
```bash
cd local-lead-finder
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd server
npm install
cd ..
```

4. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=leadfinder

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this

# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

5. **Create PostgreSQL database**
```bash
# Using psql
psql -U postgres
CREATE DATABASE leadfinder;
\q
```

6. **Initialize database tables**

The tables will be created automatically when you start the server for the first time.

### Running the Application

**Development mode:**

1. Start the backend server:
```bash
cd server
npm run dev
```

2. In a new terminal, start the frontend:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

The backend API will be running on `http://localhost:5000`

## 📖 API Documentation

### Health Check
```
GET /api/health
```

### Authentication (Coming Soon)
```
POST /api/auth/register - Register new user
POST /api/auth/login - Login user
GET /api/auth/me - Get current user
```

### Leads (Coming Soon)
```
GET /api/leads/search - Search businesses via Google Maps API
POST /api/leads/save - Save a lead
GET /api/leads - Get user's saved leads
PATCH /api/leads/:id - Update lead
DELETE /api/leads/:id - Delete lead
GET /api/leads/export - Export leads to CSV
```

### Email Templates (Coming Soon)
```
GET /api/templates - Get user's templates
POST /api/templates - Create template
PATCH /api/templates/:id - Update template
DELETE /api/templates/:id - Delete template
```

## 🎨 Scroll Animations

This project uses **GSAP ScrollTrigger** for premium scroll animations.

### ScrollReveal Component

```jsx
import ScrollReveal from './components/ScrollReveal';

<ScrollReveal animation="fade-up" delay={0.2}>
  <div>Your content</div>
</ScrollReveal>
```

Available animations:
- `fade-up` - Fade in from bottom
- `fade-in` - Simple fade in
- `slide-left` - Slide from left
- `slide-right` - Slide from right
- `scale` - Scale up
- `rotate-in` - Rotate while fading in

### ParallaxSection Component

```jsx
import ParallaxSection from './components/ParallaxSection';

<ParallaxSection speed={0.5} direction="up">
  <div>Your parallax content</div>
</ParallaxSection>
```

## 🔐 Legal & Compliance

✅ **100% Legal** - Uses official Google Maps API  
✅ **GDPR Compliant** - User data stored securely  
✅ **No Spam** - Template-based emails, user-controlled sending  
✅ **Ethical** - Respects Google's TOS and anti-spam laws  

## 📊 Database Schema

```sql
-- Users
users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  api_quota_used INT DEFAULT 0,
  api_quota_limit INT DEFAULT 1000,
  created_at TIMESTAMP
)

-- Leads
leads (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  business_name VARCHAR(255),
  address TEXT,
  phone VARCHAR(50),
  website VARCHAR(255),
  rating DECIMAL(2,1),
  status VARCHAR(50) DEFAULT 'New',
  tags TEXT[],
  notes TEXT,
  created_at TIMESTAMP
)

-- Email Templates
email_templates (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  name VARCHAR(255),
  subject VARCHAR(255),
  body TEXT,
  created_at TIMESTAMP
)
```

## 🎯 Roadmap

- [x] Project setup
- [x] Design system with scroll animations
- [x] Landing page with GSAP effects
- [ ] Authentication system
- [ ] Google Maps search interface
- [ ] Lead management CRM
- [ ] Email template system
- [ ] Export functionality
- [ ] User dashboard with analytics
- [ ] Team collaboration features

## 📝 License

MIT License - Feel free to use this for your projects!

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a PR.

---

Built with ❤️ for ethical marketing
