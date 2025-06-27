# 🩺 IBS Tracker

A comprehensive web application for tracking IBS (Irritable Bowel Syndrome) symptoms, mood, diet, and wellness patterns. Built with Vue.js and Supabase for secure, real-time health data management.

![IBS Tracker](https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## ✨ Features

### 📊 Daily Logging
- **Mood Tracking**: Rate your daily mood on a 1-10 scale
- **Symptom Monitoring**: Track common IBS symptoms like cramping, bloating, gas, and more
- **Bowel Movement Logging**: Record frequency and Bristol Stool Scale classification
- **Water Intake**: Monitor daily hydration with visual progress tracking
- **Food Diary**: Log meals and identify potential trigger foods
- **Supplement Tracking**: Keep track of medications and supplements
- **Exercise Logging**: Record physical activity and its impact on symptoms
- **Notes**: Add detailed observations about your day

### 📈 Analytics & Insights
- **Trend Analysis**: Visualize patterns in mood, symptoms, and triggers over time
- **Food Correlation**: Identify potential trigger foods based on symptom patterns
- **Weekly/Monthly Reports**: Comprehensive summaries of your health data
- **Personalized Recommendations**: AI-driven insights for better symptom management

### 📱 User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Intuitive Interface**: Clean, modern design with smooth animations
- **Secure Authentication**: Email/password authentication with Supabase
- **Data Privacy**: Your health data is encrypted and secure
- **Offline Support**: Continue logging even without internet connection

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for database and authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ibs-tracker.git
   cd ibs-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**
   
   Run the database migrations:
   ```bash
   # The migrations are located in supabase/migrations/
   # Apply them through your Supabase dashboard or CLI
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 🏗️ Tech Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Vue Router** - Client-side routing
- **Vite** - Fast build tool and development server
- **Lucide Vue** - Beautiful icon library

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Authentication & authorization

### Styling
- **Custom CSS** - Modern glassmorphism design
- **CSS Grid & Flexbox** - Responsive layouts
- **CSS Animations** - Smooth micro-interactions

## 📁 Project Structure

```
ibs-tracker/
├── src/
│   ├── components/          # Reusable Vue components
│   │   └── AuthModal.vue   # Authentication modal
│   ├── composables/        # Vue composition functions
│   │   └── useAuth.ts      # Authentication logic
│   ├── lib/                # Utility libraries
│   │   └── supabase.ts     # Supabase client & database functions
│   ├── views/              # Page components
│   │   ├── Today.vue       # Daily logging interface
│   │   ├── History.vue     # Historical data view
│   │   ├── Insights.vue    # Analytics dashboard
│   │   └── Settings.vue    # User preferences
│   ├── App.vue             # Root component
│   ├── main.ts             # Application entry point
│   └── style.css           # Global styles
├── supabase/
│   └── migrations/         # Database schema migrations
├── public/                 # Static assets
├── package.json
├── vite.config.ts
└── README.md
```

## 🗄️ Database Schema

The application uses a PostgreSQL database with the following main tables:

- **profiles** - User profile information
- **daily_logs** - Core daily health data
- **symptoms** - Symptom tracking linked to daily logs
- **supplements** - Supplement/medication tracking
- **foods** - Food diary entries

All tables implement Row Level Security (RLS) to ensure users can only access their own data.

## 🔐 Security Features

- **Row Level Security**: Database-level access control
- **Authentication**: Secure email/password authentication
- **Data Encryption**: All data encrypted in transit and at rest
- **Privacy First**: No data sharing with third parties
- **GDPR Compliant**: Data export and deletion capabilities

## 🎨 Design Philosophy

The application follows modern design principles:

- **Glassmorphism**: Translucent elements with backdrop blur effects
- **Gradient Accents**: Subtle color gradients for visual hierarchy
- **Micro-interactions**: Smooth animations and hover effects
- **Accessibility**: High contrast ratios and keyboard navigation
- **Mobile-first**: Responsive design optimized for all screen sizes

## 📊 Data Privacy & Export

- **Data Ownership**: You own all your health data
- **Export Options**: Download your data in CSV format
- **Data Deletion**: Permanently delete all data when needed
- **No Tracking**: No analytics or tracking cookies

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

- **Issues**: [GitHub Issues](https://github.com/yourusername/ibs-tracker/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/ibs-tracker/discussions)
- **Email**: support@ibstracker.com

## 🙏 Acknowledgments

- **Medical Disclaimer**: This app is for tracking purposes only and should not replace professional medical advice
- **Icons**: [Lucide](https://lucide.dev/) for beautiful icons
- **Images**: [Pexels](https://pexels.com/) for stock photography
- **Inspiration**: Built with ❤️ for the IBS community

## 🔮 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics with ML insights
- [ ] Integration with wearable devices
- [ ] Medication reminders
- [ ] Doctor report generation
- [ ] Community features (anonymous)
- [ ] Multi-language support

---

**Disclaimer**: This application is designed for personal health tracking and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with a healthcare provider for medical concerns.