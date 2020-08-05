const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const compression = require("compression");
const helmet = require("helmet");
const app = express();
const http = require('http')
const swaggerDoc = require("./swaggerDoc"); 

const admin = require('./routes/adminRouter');
const dealer = require('./routes/dealerRouter');
const vehicle = require('./routes/vehicleRouter');
const customer = require('./routes/customerRouter');
const promo = require('./routes/promoRouter');
const Advertisement = require('./routes/advertisementRouter');
const Mobile = require('./routes/mobileRouter');
const service = require('./routes/serviceRouter');

const config = require("./config");
const accessController = require("./custom/accessControl").accessController;

app.use(compression());
app.use(helmet());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(
  bodyParser.urlencoded({ limit: "10mb", extended: true, parameterLimit: 1000 })
);

app.use(morgan("combined", ));
app.use(accessController);
swaggerDoc(app);

app.use(config.server.api, admin);
app.use(config.server.api, dealer);
app.use(config.server.api, vehicle);
app.use(config.server.api, customer);
app.use(config.server.api, promo);
app.use(config.server.api, Advertisement);
app.use(config.server.api, Mobile);
app.use(config.server.api, service);



http.createServer( function (req, res) {
  app.handle(req, res);
}).listen(3000);

console.log(`App Started!`);