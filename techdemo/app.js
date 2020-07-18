var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
//var logger = require('morgan');

const prom = require('prom-client'),
      url = require('url')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(logger('dev'));

const http = require ('http'),
      https = require ('https'),
// https://nodejs.org/docs/latest-v7.x/api/http.html#http_new_agent_options
// An Agent is responsible for managing connection persistence and reuse for HTTP clients
// It maintains a queue of pending requests for a given host and port, reusing a single socket connection for each until the queue is empty,
      agent_http = process.env.CONNECTION_AGENT ? new http.Agent(JSON.parse(process.env.CONNECTION_AGENT)): new http.Agent(),
      agent_https = process.env.CONNECTION_AGENT ? new https.Agent(JSON.parse(process.env.CONNECTION_AGENT)): new https.Agent()



const promPrefix = "nodedep_"
const req_counter = new prom.Counter({
  name: 'nodedep_http_requests_total',
  help: 'Counter for total requests received',
  labelNames: ['route', 'method', 'status']
});

const req_duration = new prom.Histogram({
  name: 'nodedep_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['route', 'method', 'status'],
  buckets: [0.05, 0.1, 0.2, 0.3, 0.4, 0.6, 1, 3, 5, 10]
});

const dependency_duration = new prom.Histogram({
  name: 'nodedep_http_dependency_duration_seconds',
  help: 'Duration of dependency HTTP requests in seconds',
  labelNames: ['url', 'statusCode', 'customAgent'],
  buckets: [0.05, 0.1, 0.2, 0.3, 0.4, 0.6, 1, 3, 5, 10]
})

const agent_free_sockets = new prom.Gauge({
  name: 'nodedep_http_dependency_agent_free_sockets',
  help: 'Sockets currently awaiting use by the agent (when keepAlive is enabled)',
  labelNames: ['mode', 'type']
})

const agent_request_queue_length = new prom.Gauge({
  name: 'nodedep_http_dependency_agent_request_queue_length',
  help: 'Number of requests waiting in the queue that have not yet been assigned to sockets',
  labelNames: ['mode', 'type']
});


function setupProm ({req_counter, req_duration}) {
  console.log ('setup prom lsteners')

  return function (req, res, next) {
    // Implement the middleware function based on the options object
    const route = url.parse(req.originalUrl)

    if (route.pathname !== '/metrics') {
      const startAt = Date.now()
      
      res.on('finish', function() {
        const labels = { route : route.pathname , method : req.method, status: res.statusCode };
        req_counter.inc(labels)
        req_duration.observe(labels, (Date.now() - startAt) / 1000);
      })
    }

    next()
  }
}

app.use(setupProm({req_counter, req_duration}))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter({agent_http,agent_https, dependency_duration}));
app.use('/users', usersRouter);

app.get('/metrics', async (req, res, next) => {
  /*
  agent_free_sockets.set({mode: "http", type: "customAgent"}, agent_http.freeSockets.length)
  agent_free_sockets.set({mode: "https", type: "customAgent"}, agent_https.freeSockets.length)
  agent_free_sockets.set({mode: "http", type: "globalAgent"}, http.globalAgent.freeSockets.length)
  agent_free_sockets.set({mode: "https", type: "globalAgent"}, https.globalAgent.freeSockets.length)

  agent_request_queue_length.set({mode: "http", type: "customAgent"}, agent_http.requests.length)
  agent_request_queue_length.set({mode: "https", type: "customAgent"}, agent_https.requests.length)
  agent_request_queue_length.set({mode: "http", type: "globalAgent"}, http.globalAgent.requests.length)
  agent_request_queue_length.set({mode: "https", type: "globalAgent"}, https.globalAgent.requests.length)
*/
  res.set('Content-Type', prom.register.contentType);
  return res.end(prom.register.metrics());

})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
