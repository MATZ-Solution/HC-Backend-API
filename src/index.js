const express = require('express');
const app = express();
const dotenv = require('dotenv');
const passport=require('passport')
const cors = require('cors');
const session=require('express-session')
// const rateLimit = require('express-rate-limit');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const privacyRoute = require('./routes/privacy');
const meetRoute = require('./routes/meet_Route');
const databaseConnection = require('./utils/db');
const regionRoute = require('./routes/region');
const healthCareRoute = require('./routes/healthCareRoute');
const geoLocationRoute = require('./routes/geoPlacesRoute');
const branchRoute = require('./routes/branchRoutes');
const branchManagerRoute = require('./routes/branchManagerRoutes');
const errorMiddleware = require('./middleware/error');
const s3Rotue = require('./routes/s3Routes');
const services = require('./routes/service_routes');
const cloudinary = require('./routes/cloundinaryRoutes');
const appointmentRoute = require('./routes/appointmentRoutes');
const vital = require('./routes/vitalRoutes');
const branchRequestRoute = require('./routes/branchRequestRoute');
const advisorRoute = require('./routes/advisorRoutes');
const corporateRoutes = require('./routes/corporateRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const favoriteRoutes = require('./routes/favourateRoutes');
const fcmRoute = require('./routes/fcmRoute');
const notificationRoute = require('./routes/notiRoutes');
const noOfCallsMadeRoute = require('./routes/noOfCallMadeRoutes');
//=========blog route=======================================
const blogRoutes = require('./routes/blogRoutes');
//=========invoice route====================================
const getInvoice = require('./routes/invoiceRoute');
//=========webReviews route====================================
const webReviewsRoutes = require('./routes/webReviews');


// ============google route =============
// const googleRoutes = require('./routes/googleRoutes')

// "=======================passport require=========="
require('./utils/passport')
dotenv.config();
app.use(session({
  secret:"maaz rehman",
  resave:false,
  saveUninitialized:true
}))

app.use(cors());

// app.use(cors({
//   origin: 'https://infosenior.care',
//   credentials: true,
// }));

// const corsOptions = {
//   origin: ["http://127.0.0.1:5500", "https://infosenior.care"],
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
//   optionsSuccessStatus: 204,
// };

// app.use(cors(corsOptions));
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json()); // Parse incoming JSON data

// Connect to the MongoDB database
databaseConnection.connect();


// const limiter = rateLimit({
//   windowMs: 60 * 1000,
//   max: 10,
//   message: 'Too many requests from this IP, please try again later.',
// });

// limiter middleware to your routes
// app.use('/api', limiter);

//routes
app.use('/api/auth', authRoute); // Route for authentication
app.use('/api/user', userRoute); // Route for user-related operations
app.use('/api/privacy', privacyRoute); //Route for Privacy
app.use('/api/meetSchedule', meetRoute); //Route for Privacy
app.use('/api/regionRoute', regionRoute);
app.use('/api/healthCareRoute', healthCareRoute);
app.use('/api/geoLocation', geoLocationRoute);
app.use('/api/branch', branchRoute);
app.use('/api/branchManager', branchManagerRoute);
app.use('/api/s3Route', s3Rotue);
app.use('/api/services', services);
app.use('/api/cloudinary', cloudinary);
app.use('/api/appointment', appointmentRoute);
app.use('/api/vital', vital);
app.use('/api/branchRequest', branchRequestRoute);
app.use('/api/advisor', advisorRoute);
app.use('/api/corporate', corporateRoutes);
app.use('/api/superAdmin', superAdminRoutes);
app.use('/api/favoriteRoutes', favoriteRoutes);
app.use('/api/fcmRoutes/', fcmRoute);
app.use('/api/notificationHistory', notificationRoute);
app.use('/api/noOfCallsMade', noOfCallsMadeRoute);
//=========WEB Routes===================

app.use('/api/webReviews',webReviewsRoutes)
//=========Blog Routes===================
app.use('/api/blogs', blogRoutes);
//=======================================
//==========Invoice Routes================
app.use('/api/invoice', getInvoice);

app.use(errorMiddleware);
// app.use("/", googleRoutes);

app.get('/', (req, res) => {
  res.send('Hello World 10/19/23 11:06PM');
});
// Start the server and listen for incoming requests
app.listen(5000, () => {
  console.log('Backend server is running on 5000!');
});
