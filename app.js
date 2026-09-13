const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');
const helmet = require('helmet');
const hpp = require('hpp');
const redis = require('redis');
const RedisStore = require('connect-redis').default;
const { generateCsrfToken } = require('./middlewares/csrf');
const logger = require('./logger');

dotenv.config();
// REDIS_URL (e.g. Upstash's rediss://default:PASSWORD@HOST:PORT) takes over in
// production - its scheme decides plain vs TLS, so no separate password field.
// Local dev keeps using REDIS_HOST/REDIS_PORT from docker-compose's .env.
const redisClient = process.env.REDIS_URL
  ? redis.createClient({ url: process.env.REDIS_URL })
  : redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    password: process.env.REDIS_PASSWORD,
  });
redisClient.connect().catch((err) => logger.error(err.stack));
const pageRouter = require('./routes/page.js');
const authRouter = require('./routes/auth.js');
const postRouter = require('./routes/post.js');
const userRouter = require('./routes/user.js');
const { sequelize } = require('./models/index.js');
const passportConfig = require('./passport');
const formatContent = require('./utils/formatContent');

const app = express();
passportConfig();
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
const nunjucksEnv = nunjucks.configure('views', {
  express: app,
  watch: true,
});
nunjucksEnv.addFilter('formatContent', formatContent);

// Schema is owned by the migrations in migrations/ (run `npm run db:migrate`),
// not by sync - sync would recreate columns/indexes on every boot and risks
// dropping data in a real deployment.
sequelize.authenticate()
  .then(()=>{
    console.log('db연결 성공');
  })
  .catch((err)=>{
    logger.error(err.stack);
  });

  if(process.env.NODE_ENV === 'production'){
    app.enable('trust proxy');
    app.use(morgan('combined'));
    app.use(
      helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: false,
      }),
    );
    app.use(hpp());
  }else {
    app.use(morgan('dev'));
  }
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
const sessionOptions = {
  resave: false,
  // CSRF protection below keys off req.sessionID, which must stay stable between
  // the GET that renders a form's token and the POST that submits it - including
  // for anonymous (not-yet-logged-in) visitors. false would only start a session
  // once something writes to it, giving anonymous visitors a fresh sessionID (and
  // therefore a mismatched CSRF token) on every request.
  saveUninitialized: true,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  store : new RedisStore({client : redisClient}),
};
if(process.env.NODE_ENV === 'production'){
sessionOptions.proxy = true;
//sessionOptions.cookie.secure = true ==>https 적용 했을 시 사용
}
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.csrfToken = generateCsrfToken(req, res);
  next();
});

app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;