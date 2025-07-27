# Agora - Community Platform

A comprehensive community platform built with Astro, featuring discussion forums, chess games, task management, digital archives, and more. Designed with a clean, minimalist aesthetic focused on clarity and functionality.

## 🌟 Features

### 🗨️ Discussion & Community
- **Comment System**: Nested comments with gratitude/upvoting system
- **Star Ratings**: Interactive 5-star rating system with distribution histograms
- **User Profiles**: Individual user pages with activity history
- **Search**: Vector search with embeddings trained with a custom word2vec model search across posts and comments
- **Tags**: Categorization system for posts and comments

### ♟️ Chess Platform
- **Game Management**: Create and join chess games
- **Real-time Updates**: Live game state tracking
- **Leaderboards**: Player rankings and statistics
- **Game History**: Complete game archives and analysis

### 📋 Task Management
- **Task Tracking**: Create, update, and monitor tasks
- **Status Management**: Track task progress and completion
- **Time Tracking**: Monitor time spent on tasks
- **Task Categories**: Organize tasks by type and priority

### 📚 Digital Archive
- **File Upload**: Secure file storage and management
- **Document Organization**: Categorize and tag uploaded files
- **Search & Filter**: Find documents quickly
- **Download Management**: Controlled access to archived materials

### 📅 Calendar & Events
- **Event Management**: Create and manage calendar events
- **Epistemic Calendar**: Specialized calendar for knowledge tracking
- **Event Categories**: Organize events by type and importance
- **Reminder System**: Never miss important events

### 📖 Book Management
- **Reading Lists**: Track books by category
- **Annotations**: Add notes and highlights to books
- **Progress Tracking**: Monitor reading progress
- **Book Discussions**: Comment and discuss books

### 🎯 Master Tracker
- **Skill Tracking**: Monitor progress in various skills
- **Goal Setting**: Set and track personal goals
- **Progress Visualization**: Visual representation of improvement
- **Achievement System**: Celebrate milestones and accomplishments

### 🔐 Authentication & Security
- **User Registration**: Secure account creation
- **Password Management**: Reset and update passwords
- **Session Management**: Secure login/logout system
- **Profile Management**: Update user information and preferences

## 🎨 Design Philosophy

Built following minimalist design principles:
- **Minimalism**: Clean, uncluttered interfaces
- **Functionality**: Every element serves a purpose
- **Accessibility**: Keyboard navigation and screen reader support
- **Information Density**: Efficient use of space
- **Neutral Aesthetics**: Focus on content over decoration

## 🎭 UI Influences

This platform's design draws inspiration from several thoughtful communities and platforms:

- **[LessWrong](https://lesswrong.com/)** - Epistemic rationality and clean, information-dense interfaces
- **[Gwern.net](https://gwern.net/)** - Comprehensive research presentation and minimalist aesthetics
- **[Uli.rocks](https://uli.rocks/)** - Experimental web design and creative layouts
- **[Mogutable](https://mogutable.com/)** - Community-driven knowledge sharing and discussion
- **[Reddit](https://reddit.com/)** - Community moderation and threaded discussions
- **[Bitchat](https://bitchats.app/)** - Decentralized communication and peer-to-peer networking concepts

## 🛠️ Technical Stack

- **Frontend**: Astro with React components
- **Styling**: CSS with minimalist design system
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase real-time subscriptions
- **Deployment**: Static site generation with API routes

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file with your Supabase credentials:
   ```env
   PUBLIC_SUPABASE_URL=your_supabase_url
   PRIVATE_SUPABASE_ROLE_KEY=your_supabase_role_key
   ```

4. **Database Setup**
   - Set up your Supabase project
   - Create the necessary tables (comments, posts, users, etc.)
   - Configure authentication settings

5. **Run Development Server**
   ```bash
   npm run dev
   ```

6. **Build for Production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
src/
├── components/          # React and Astro components
│   ├── CommentsTree.jsx # Comment system with ratings
│   ├── Header.astro     # Site navigation
│   ├── Sidebar.astro    # Side navigation
│   └── ...
├── pages/              # Astro pages and API routes
│   ├── api/            # Backend API endpoints
│   ├── chess/          # Chess game pages
│   ├── dashboard.astro # Main dashboard
│   └── ...
├── layouts/            # Page layout templates
├── styles/             # Global CSS and component styles
└── lib/                # Utility functions and configurations
```

## 🔧 Key Components

### CommentsTree.jsx
Advanced comment system featuring:
- Nested comment threading
- Interactive star ratings (1-5 stars)
- Rating distribution histograms
- Gratitude/upvoting system
- Real-time updates

### API Endpoints
- `/api/auth/` - Authentication and user management
- `/api/auth/get_comments` - Comment retrieval
- `/api/auth/update_comment_rating` - Rating management
- `/api/auth/get_comment_ratings` - Rating statistics
- `/api/game_request` - Chess game management
- `/api/tasks/` - Task management

## 📱 Mobile Responsive

Fully responsive design with:
- Mobile-first approach
- Touch-friendly interfaces
- Optimized layouts for all screen sizes
- Proper viewport handling

## 🎯 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🤝 Support

For questions or support, please open an issue in the repository or contact the development team.

---

**Agora** - Where communities thrive through thoughtful discussion, shared knowledge, and collaborative growth.
