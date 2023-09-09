const cookieSession = require('cookie-session');
const passportSetup = require('./passport');
const passport = require('passport');

const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const privacyRoute = require('./routes/privacy');
const meetRoute = require('./routes/meet_Route');
const databaseConnection = require('./utils/db');
const authsRoute = require('./routes/auths');
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
//=========blog route=======================================
const blogRoutes = require('./routes/blogRoutes');

dotenv.config();

app.use(cors());

app.use(
  cookieSession({ name: 'session', keys: ['lama'], maxAge: 24 * 60 * 60 * 100 })
);

app.use(passport.initialize());
app.use(passport.session());

//this is only for passport initialization

app.use(express.json()); // Parse incoming JSON data

// Connect to the MongoDB database
databaseConnection.connect();

//routes
app.use('/api/auth', authRoute); // Route for authentication
app.use('/api/user', userRoute); // Route for user-related operations
app.use('/api/privacy', privacyRoute); //Route for Privacy
app.use('/api/meetSchedule', meetRoute); //Route for Privacy
app.use('/auth', authsRoute);
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

//=========Blog Routes===================
app.use('/api/blogs', blogRoutes )

app.use(errorMiddleware);


app.get('/', (req, res) => {
  res.send('Hello World');
});
// Start the server and listen for incoming requests
app.listen(3000, () => {
  console.log('Backend server is running on 3000!');
});
