const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require("express-session");
const methodOverride = require('method-override');
const mongoDBSession = require('connect-mongodb-session')(session);
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
require('dotenv').config();
const initializePassport = require('./config/passport-config');
initializePassport(passport);

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'NodeS3 API',
            version: '1.0.0',
            description: 'NodeJS project that can perform operations similar to AWS S3 bucket'
        },
        servers: [
            {
                url: 'http://localhost:3000'
            }
        ]
    },
    apis: ['./routes/*.js']
};
const swaggerSpecs = swaggerJsDoc(options);

const db = process.env.DB;
const app = express();

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

mongoose.connect(db)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));
const mongoDBStore = new mongoDBSession({
    uri: db,
    collection: 'sessions'
})
app.use(express.json());
app.use(methodOverride('_method'));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 86400000
    },
    store: mongoDBStore
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));


const objectRoutes = require('./routes/object');
const bucketRoutes = require('./routes/bucket');
const authRoutes = require('./routes/auth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/auth', authRoutes);
app.use('/objects', objectRoutes);
app.use('/buckets', bucketRoutes);

const port = 3000 || process.env.PORT;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})