const { request } = require('express');
const express = require('express');
const http = require('http');
const requests = require('requests');
const path = require('path');
const hbs = require('hbs');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.SERVER_PORT || 8000;

var publicPath = path.join(__dirname, 'public');
var templatePath = path.join(__dirname, 'templates/views');
var partialPath = path.join(__dirname, 'templates/partials');
hbs.registerPartials(partialPath);

app.use(express.json());
app.set(express.static(publicPath));
app.set('view engine', 'hbs');
app.set('views', templatePath);

_getMonthName = (month) => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    return monthNames[month];
}

_getWeekName = (week) => {
    const weekNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return weekNames[week];
}

_getIcon = (type) => {
    var resIcon = '';
    switch (type) {
        case (type == "Sunny"):
            resIcon = "<i class='fas  fa-sun' style='color: #eccc68;'></i>";
            break;
        
        case (type == "Clouds"):
            resIcon = "<i class='fas  fa-cloud' style='color: #f1f2f6;'></i>";
            break;

        case (type == "Rainy"):
            resIcon = "<i class='fas  fa-cloud-rain' style='color: #a4b0be;'></i>";
            break;
    
        default:
            resIcon = "<i class='fas  fa-cloud' style='color:#f1f2f6;'></i>";
            break;
    }

    return resIcon;
}

app.get('/', (req, res) => {
    var location_, country_, temp_, minTemp_, maxTemp_, icon_ = '';
    
    
    requests('http://api.openweathermap.org/data/2.5/weather?q=Kolkata&units=metric&appid=b14425a6554d189a2d7dc18a8e7d7263')
    .on('data', (chunk) => {
        let parse = JSON.parse(chunk);
        location_ = parse.name;
        country_ = parse.sys.country;
        temp_ = parse.main.temp;
        minTemp_ = parse.main.temp_min;
        maxTemp_ = parse.main.temp_max;
        icon_ = _getIcon(parse.weather[0].main);

        var dateNow = new Date();
        let date_ = dateNow.getDate();
        let month_ = _getMonthName(dateNow.getMonth());
        let day_ = _getWeekName(dateNow.getDay());
        let hours_ = dateNow.getHours();
        let mins_ = dateNow.getMinutes();      

        res.render('index', {
            location: location_,
            country: country_,
            tempval: temp_,
            tempmin: minTemp_,
            tempmax: maxTemp_,
            icon: icon_,
            date: date_,
            month: month_,
            week: day_,
            hours: hours_,
            mins: mins_,
        });
    })
    .on('end', (err) => {
        if (err) return console.log('connection closed due to errors', err);
    });
});

server.listen(PORT, () => {
    console.log(`Server Running on PORT ${PORT}`);
});