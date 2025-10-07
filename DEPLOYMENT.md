# Deployment Guide

This guide provides step-by-step instructions for deploying your personal blog website to free hosting platforms.

## Prerequisites

- GitHub account
- Node.js 18+ installed locally
- Git installed

## Step 1: Prepare Your Code

1. **Initialize Git repository** (if not already done):

   ```bash
   cd /Users/mac/Desktop/blog
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub repository**:

   - Go to GitHub.com and create a new repository
   - Name it something like `personal-blog`
   - Don't initialize with README (since you already have files)

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy Frontend to Vercel (Free)

Vercel is the best option for Next.js applications and offers generous free hosting.

1. **Go to Vercel.com** and sign up with your GitHub account

2. **Import your repository**:

   - Click "New Project"
   - Select your blog repository
   - Choose the `frontend` folder as the root directory

3. **Configure build settings**:

   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Set environment variables**:

   - Go to Project Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-backend-url.com/api`

5. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Your frontend will be available at `https://your-project.vercel.app`

## Step 3: Deploy Backend to Railway (Free)

Railway offers free hosting for Node.js applications with a generous free tier.

1. **Go to Railway.app** and sign up with GitHub

2. **Create new project**:

   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your blog repository

3. **Configure the service**:

   - Root Directory: `backend`
   - Build Command: `npm run build`
   - Start Command: `npm start`

4. **Set environment variables**:

   - Go to Variables tab
   - Add the following:
     ```
     NODE_ENV=production
     PORT=3001
     JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
     ADMIN_USERNAME=admin
     ADMIN_PASSWORD=admin123
     ```

5. **Deploy**:
   - Railway will automatically deploy your backend
   <!-- mansurbek.up.railway.app -->
   - Note the generated URL (e.g., `https://your-app.railway.app`)

## Step 4: Update Frontend Environment

1. **Go back to Vercel**:

   - Update the `NEXT_PUBLIC_API_URL` environment variable
   - Set it to your Railway backend URL + `/api`
   - Example: `https://your-app.railway.app/api`

2. **Redeploy frontend**:
   - Vercel will automatically redeploy when you update environment variables

## Step 5: Alternative Backend Hosting (Render)

If Railway doesn't work, try Render:

1. **Go to Render.com** and sign up with GitHub

2. **Create new Web Service**:

   - Connect your GitHub repository
   - Choose "Web Service"

3. **Configure settings**:

   - Root Directory: `backend`
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Environment: Node

4. **Set environment variables**:

   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```

5. **Deploy**:
   - Render will build and deploy your backend
   - Note the generated URL

## Step 6: Get a Free Domain (Optional)

### Option 1: Freenom (Free .tk, .ml, .ga domains)

1. Go to freenom.com
2. Search for available domains
3. Register a free domain
4. Point DNS to your hosting providers

### Option 2: GitHub Pages with Custom Domain

1. Use a subdomain from a free service
2. Configure DNS to point to your Vercel deployment

### Option 3: Use Vercel's Free Subdomain

- Vercel provides free subdomains like `your-blog.vercel.app`
- This is often sufficient for personal blogs

## Step 7: Configure Custom Domain (If Applicable)

1. **In Vercel**:

   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update environment variables**:
   - Update `NEXT_PUBLIC_API_URL` if needed

## Step 8: Security Considerations

1. **Change default credentials**:

   - Update `ADMIN_USERNAME` and `ADMIN_PASSWORD` in production
   - Use a strong, unique JWT secret

2. **Enable HTTPS**:

   - Both Vercel and Railway provide HTTPS by default
   - Ensure your custom domain uses HTTPS

3. **Backup your database**:
   - SQLite database is stored on the server
   - Consider regular backups for important content

## Step 9: Testing Your Deployment

1. **Test frontend**:

   - Visit your Vercel URL
   - Check that the homepage loads
   - Test navigation and search

2. **Test admin panel**:

   - Go to `/admin/login`
   - Login with your credentials
   - Create a test post

3. **Test API**:
   - Visit `https://your-backend-url.com/api/health`
   - Should return `{"status":"OK"}`

## Troubleshooting

### Common Issues:

1. **Frontend can't connect to backend**:

   - Check `NEXT_PUBLIC_API_URL` environment variable
   - Ensure backend is deployed and running
   - Check CORS settings in backend

2. **Build failures**:

   - Check build logs in hosting platform
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

3. **Database issues**:
   - SQLite database is created automatically
   - Check file permissions on hosting platform
   - Ensure database file is writable

### Getting Help:

1. **Check hosting platform logs**:

   - Vercel: Project → Functions tab
   - Railway: Deployments → View logs
   - Render: Logs tab

2. **Test locally first**:
   - Ensure everything works locally before deploying
   - Use the same environment variables locally

## Cost Breakdown

- **Frontend (Vercel)**: Free
- **Backend (Railway/Render)**: Free tier available
- **Domain**: Free with Freenom or use provided subdomain
- **Total Cost**: $0/month

## Maintenance

1. **Regular updates**:

   - Keep dependencies updated
   - Monitor hosting platform for any issues

2. **Backup strategy**:

   - Export database regularly
   - Keep code in version control

3. **Monitoring**:
   - Set up uptime monitoring (free with UptimeRobot)
   - Monitor error logs

## Next Steps

1. **Customize your blog**:

   - Update the design and branding
   - Add more features as needed

2. **SEO optimization**:

   - Add meta tags
   - Implement sitemap
   - Optimize images

3. **Analytics**:
   - Add Google Analytics
   - Monitor visitor statistics

Your blog should now be live and accessible to the world! 🎉
