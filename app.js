
const express = require('express');
const  app = express();
const path = require('path');

const indexRouter = require('./routes/index');


// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');
const expressHBS = require('express-handlebars');
app.engine('.hbs', expressHBS({
    layoutsDir: __dirname + '/views/layouts',
    extname: '.hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    },
    defaultLayout: 'main'
}))
app.set('view engine', '.hbs');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/',indexRouter);
app.listen(process.env.PORT || 3000);