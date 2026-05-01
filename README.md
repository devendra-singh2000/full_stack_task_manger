# Team Task Manager (Full-Stack)

A premium, full-stack web application built for managing projects, assigning tasks, and tracking team progress with role-based access control.

## 🚀 Features

- **Authentication (Signup/Login)**: Secure JWT-based authentication using NextAuth.js.
- **Role-Based Access Control**: Admins can create projects and view all data. Members can only view projects they are assigned to.
- **Project & Team Management**: Create projects, invite members, and organize tasks efficiently.
- **Task Tracking**: Create, assign, and track tasks (To Do, In Progress, Done, Overdue).
- **Dashboard**: Real-time summary of total tasks, status, and overdue items.
- **Premium UI/UX**: Built with custom Vanilla CSS featuring glassmorphism, dynamic gradients, and micro-animations.

## 🛠️ Technology Stack

- **Framework**: Next.js (App Router)
- **Database ORM**: Prisma
- **Database**: MySQL (Hosted on Railway)
- **Authentication**: NextAuth.js (Credentials Provider)
- **Styling**: Vanilla CSS (Premium Glassmorphism Aesthetic)
- **Validation**: Zod
- **Deployment**: Railway

## 🌐 Live Demo & Deployment

This application is configured for seamless deployment on **Railway**.

### Deployment Steps (Railway)

1. Connect your Railway account to this GitHub repository.
2. Railway will automatically detect the **Next.js** environment.
3. In the Railway dashboard, configure the following environment variables:
   - `DATABASE_URL`: Your MySQL connection string (e.g., `mysql://root:password@host:port/railway`)
   - `NEXTAUTH_SECRET`: A secure random string (e.g., generate via `openssl rand -base64 32`)
   - `NEXTAUTH_URL`: Your live Railway app URL (e.g., `https://your-app.up.railway.app`)
4. During the build phase, Railway will automatically run `prisma generate` and `prisma db push` to initialize your database schema, followed by `next build`.
5. Your app will be live and fully functional!

## 💻 Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/devendra-singh2000/full_stack_task_manger.git
   cd full_stack_task_manger
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your variables:
   ```env
   DATABASE_URL="mysql://USER:PASSWORD@host:port/database_name"
   NEXTAUTH_SECRET="your_secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize Database:**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Start Development Server:**
   ```bash
   npm run dev
   ```
