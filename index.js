const app = require('express')(),
    config = require('config'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

// Models
mongoose.connect(config.mongoUri, { useNewUrlParser: true });
require('./models/produtos')

// Routes
app.use(bodyParser.json());

require('./routes/produtos')(app);

// Server
app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
})
