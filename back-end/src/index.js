const express = require('express');
const app = express();
const distance = require('gps-distance');
let bodyParser = require('body-parser');

let DistanceModel = require('./models/distance.model');

app.use(bodyParser.json());

app.get('/', (req, res) =>{
    res.send('hey');
})

// app.get('/position/:name/lastmonth', (req, res) => {
//     DistanceModel.find({name: req.params.name}).then(doc => {


//         res.json(doc);
//     }).catch(err => {
//         res.status(500).json(err);
//     })
// })

app.get('/position/:name', (req, res) => {
    var dbQuery = {name: req.params.name};
    if(!!req.query.startDate && !!req.query.endDate){
        dbQuery.date = {
            $gte: req.query.startDate,
            $lte: req.query.endDate
        }
    }

    DistanceModel.find(dbQuery).then(doc => {
        res.json(doc);
    }).catch(err => {
        res.status(500).json(err);
    })
})


app.post('/position', (req, res) => {
    // && !req.body.date && !req.body.position
    if(!req.body.name || !req.body.medium || !req.body.date || !req.body.coords) return res.status(400).send('There is data not send');

    

    var distance = {
        name: req.body.name,
        medium: req.body.medium,
        date: req.body.date
    }
    distance.distance = getDist(req.body);


    let model = new DistanceModel(distance);
    model.save().then(doc => {
        if(!doc || doc.length == 0){
            return res.status(500).send(doc);
        }
        res.status(201).send(doc);
    }).catch(err => {
        res.status(500).json(err);
    })

})

function getDist(json){
    let arr = [];
    
	for(let i=0;i<(json.coords).length;i++){
		arr.push([json.coords[i].lat, json.coords[i].long]);
    }
    return distance(arr);
}

// PORT
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`));