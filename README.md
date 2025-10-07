# Personal Blog Website

A responsive personal blog website with a minimalist design and admin panel. Built with Next.js frontend and Node.js/Express backend.

## Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Blog Management**: Create, edit, and manage blog posts
- **Category System**: Organize posts by categories
- **Search & Filter**: Find posts by title, content, or category
- **Markdown Support**: Write posts in Markdown format
- **Admin Panel**: Secure authentication and content management
- **Minimalist UI**: Clean, modern design focused on content

## Tech Stack

### Frontend

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- React Markdown
- Axios for API calls

### Backend

- Node.js with Express
- TypeScript
- SQLite database
- JWT authentication
- bcryptjs for password hashing

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd blog
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the backend server**

   ```bash
   cd ../backend
   npm run dev
   ```

   The backend will run on http://localhost:3001

5. **Start the frontend development server**
   ```bash
   cd ../frontend
   npm run dev
   ```
   The frontend will run on http://localhost:3000

### Default Admin Credentials

- Username: `admin`
- Password: `admin123`

## Project Structure

```
blog/
├── backend/
│   ├── src/
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Authentication middleware
│   │   ├── utils/           # Utility functions
│   │   └── server.ts        # Main server file
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js app router pages
│   │   ├── components/      # React components
│   │   ├── lib/             # API client and utilities
│   │   ├── hooks/           # Custom React hooks
│   │   └── types/           # TypeScript type definitions
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Admin login
- `POST /api/auth/verify` - Verify JWT token

### Posts

- `GET /api/posts` - Get all posts (with optional filters)
- `GET /api/posts/:slug` - Get post by slug
- `POST /api/posts` - Create new post (admin only)
- `PUT /api/posts/:id` - Update post (admin only)
- `DELETE /api/posts/:id` - Delete post (admin only)

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug
- `POST /api/categories` - Create new category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

## Deployment

### Option 1: Docker Deployment

1. **Build and run with Docker Compose**

   ```bash
   docker-compose up -d
   ```

2. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

### Option 2: Manual Deployment

#### Backend Deployment

1. Build the backend:

   ```bash
   cd backend
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

#### Frontend Deployment

1. Build the frontend:

   ```bash
   cd frontend
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Environment Variables

### Backend (.env)

```
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
NODE_ENV=production
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Free Hosting Options

### Frontend (Vercel - Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on every push

### Backend (Railway/Render)

1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### Database

- SQLite file is included and works well for small to medium blogs
- For production, consider upgrading to PostgreSQL

## Customization

### Styling

- Modify `frontend/src/app/globals.css` for global styles
- Update Tailwind configuration in `tailwind.config.js`
- Customize components in `frontend/src/components/`

### Content

- Default categories and sample posts are created automatically
- Use the admin panel to manage content
- Modify sample data in `backend/src/utils/sampleData.ts`

## Security Notes

- Change default admin credentials in production
- Use a strong JWT secret
- Consider adding rate limiting for production
- Enable HTTPS in production
- Regularly backup your database

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
