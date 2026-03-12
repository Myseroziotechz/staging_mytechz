# MytechZ.in - Premier Technology Solutions & Job Portal
## CEO: Ravi Kumara H S

### 🚀 PROJECT OVERVIEW

**MytechZ.in** is a comprehensive technology job portal and solutions platform founded by . The platform connects talented professionals with leading technology companies across India.

### 📋 FEATURES

- **Job Portal**: Private and government job listings
- **Internship Programs**: Technology internship opportunities  
- **Webinar Platform**: Educational webinars and workshops
- **College Admissions**: Educational institution partnerships
- **Resume Builder**: Professional resume templates
- **Portfolio Showcase**: Developer portfolio management
- **Mentorship Program**: Career guidance and mentoring
- **Facility Management**: Technology infrastructure services

### 🛠️ TECHNOLOGY STACK

#### **Frontend (Client)**
- **React 19.1.0** - Modern UI framework
- **React Router DOM 7.6.3** - Client-side routing
- **Axios 1.10.0** - HTTP client for API calls
- **Vite 7.0.0** - Fast build tool and dev server
- **CSS3** - Responsive styling

#### **Backend (Server)**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Token authentication
- **Nodemailer** - Email service integration
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### 📁 PROJECT STRUCTURE

```
Job_Application_Website/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/               # React source code
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   └── main.jsx       # Application entry point
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite configuration
├── server/                # Backend Node.js application
│   ├── config/            # Database configuration
│   ├── controllers/       # Business logic controllers
│   ├── middleware/        # Authentication & validation
│   ├── models/            # MongoDB data models
│   ├── routes/            # API route definitions
│   ├── utils/             # Utility functions
│   ├── uploads/           # File upload storage
│   ├── .env               # Environment variables
│   ├── package.json       # Backend dependencies
│   └── server.js          # Server entry point
└── README.md              # Project documentation
```

### ⚙️ INSTALLATION & SETUP

#### **Prerequisites**
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

#### **1. Clone Repository**
```bash
git clone <repository-url>
cd Job_Application_Website
```

#### **2. Backend Setup**
```bash
cd server
npm install
```

Create `.env` file in server directory:
```bash
MONGO_URI=mongodb+srv://Ravi Kumara H Srajaparimala000:Ravi Kumara H S%4018@cluster0.dt63zvk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=yourSuperSecretKey
REACT_APP_API_BASE_URL=http://localhost:5010
CLIENT_URL=http://localhost:5173
PORT=5010
EMAIL_USER=mytechza1@gmail.com
EMAIL_PASS=iwnlpiekzmpbwtzp
ADMIN_EMAIL=mytechza1@gmail.com
NODE_ENV=development
```

#### **3. Frontend Setup**
```bash
cd ../client
npm install
```

### 🚀 RUNNING THE APPLICATION

#### **Development Mode**

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Server runs on http://localhost:5010
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Client runs on http://localhost:5173
```

#### **Production Mode**

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm run build
npm run preview
```

### 🌐 DEPLOYMENT

#### **Environment Variables for Production**
```bash
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
REACT_APP_API_BASE_URL=https://api.mytechz.in
CLIENT_URL=https://mytechz.in
PORT=5010
EMAIL_USER=mytechza1@gmail.com
EMAIL_PASS=iwnlpiekzmpbwtzp
ADMIN_EMAIL=mytechza1@gmail.com
NODE_ENV=production
```

#### **Render Deployment**
1. **Backend**: Deploy server folder to Render
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add all environment variables

2. **Frontend**: Deploy client folder to Render/Netlify/Vercel
   - Build Command: `npm run build`
   - Publish Directory: `dist`

### 📧 EMAIL CONFIGURATION

The application uses Gmail SMTP for email notifications:
- **Email Service**: Gmail SMTP
- **Port**: 587 (TLS)
- **Authentication**: App Password required
- **Fallback**: Non-blocking email service (app continues if email fails)

#### **Gmail Setup**
1. Enable 2-Factor Authentication
2. Generate App Password
3. Use app password in `EMAIL_PASS`

### 🔐 AUTHENTICATION

- **JWT Token**: 100-day expiration
- **Admin Access**: `Ravi Kumara H S@mytechz.in` / `admin123`
- **User Registration**: Open registration for job seekers
- **Password Security**: Bcrypt hashing with salt rounds

### 📊 API ENDPOINTS

#### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset
- `GET /api/auth/profile` - User profile

#### **Applications**
- `GET /api/applications/jobs` - Get job listings
- `POST /api/applications/apply` - Apply for jobs
- `GET /api/applications/my-applications` - User applications
- `GET /api/applications/all` - Admin: All applications

#### **Admin**
- `GET /api/admin/dashboard` - Admin dashboard data
- `POST /api/admin/jobs` - Create job posting
- `PUT /api/admin/jobs/:id` - Update job posting
- `DELETE /api/admin/jobs/:id` - Delete job posting

### 🧪 TESTING

#### **Test Email Service**
```bash
# Check email configuration
curl http://localhost:5010/api/test/email-config

# Send test email
curl -X POST http://localhost:5010/api/test/test-email
```

#### **Test API Endpoints**
```bash
# Test server health
curl http://localhost:5010/

# Test job listings
curl http://localhost:5010/api/applications/jobs
```

### 🔧 TROUBLESHOOTING

#### **Common Issues**

1. **MongoDB Connection Error**
   - Check MONGO_URI in .env
   - Verify network access to MongoDB Atlas
   - Ensure IP whitelist includes your IP

2. **Email Service Fails**
   - Verify Gmail app password
   - Check EMAIL_USER and EMAIL_PASS
   - Applications will still work without email

3. **CORS Errors**
   - Update CORS origins in server.js
   - Check API base URL in frontend

4. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing processes: `lsof -ti:5010 | xargs kill -9`

### 📈 SEO OPTIMIZATION

The application includes comprehensive SEO optimization:
- **Meta Tags**: Optimized titles and descriptions
- **Structured Data**: Schema.org markup for organization and CEO
- **Sitemap**: XML sitemap for search engines
- **Robots.txt**: Search engine crawling directives
- **Open Graph**: Social media sharing optimization

### 🔒 SECURITY FEATURES

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: Bcrypt with salt
- **CORS Protection**: Configured origins
- **Input Validation**: Server-side validation
- **Error Handling**: Secure error responses
- **File Upload Security**: Multer with restrictions

### 👥 USER ROLES

#### **Admin (CEO Ravi Kumara H S R)**
- Full dashboard access
- Manage job postings
- View all applications
- User management
- System configuration

#### **Regular Users**
- Job applications
- Profile management
- Application tracking
- Resume building
- Portfolio creation

### 📞 SUPPORT & CONTACT

- **Website**: https://mytechz.in
- **Email**: mytechza1@gmail.com
- **CEO**: Ravi Kumara H S R
- **Company**: MytechZ.in

### 📄 LICENSE

This project is proprietary software owned by MytechZ.in and CEO Ravi Kumara H S R.

### 🎯 FUTURE ENHANCEMENTS

- Mobile application development
- Advanced job matching algorithms
- Video interview integration
- Payment gateway for premium services
- Multi-language support
- Advanced analytics dashboard

---

**Developed with ❤️ by  Ravi Kumara H S - MytechZ.in**
**Premier Technology Solutions & Job Portal**
