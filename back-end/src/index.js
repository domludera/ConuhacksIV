const express = require('express');
const app = express();
const distance = require('gps-distance');
let bodyParser = require('body-parser');

let DistanceModel = require('./models/distance.model');

app.use(bodyParser.json());

const CAR_STRING = "car";
const WALK_STRING = "walk";
const BUS_STRING = "bus";
const BIKE_STRING = "bike";


app.get('/', (req, res) =>{
    res.send('Hi');
})

function getEmis(dist, engSize){
	if(engSize<=1.4){
		return dist*0.17;
	}else if(engSize<=2.1){
		return dist*0.22;
	}else{
		return dist*0.27;
	}
}
/* return 
{
    "car": {
        "distance": 1111.7794800671247,
        "emission": 300.1804596181237
    },
    "walk": {
        "distance": 1111.7794800671247,
        "emission": 0
    },
    "bus": {
        "distance": 0,
        "emission": 0
    },
    "bike": {
        "distance": 0,
        "emission": 0
    },
    "total": {
        "distance": 2223.5589601342494,
        "emission": 300.1804596181237
    }
}
THE API DO : /position/:name/lastmonth?engSize=NUMBER
*/
app.get('/position/:name/lastmonth', (req, res) => {
    DistanceModel.find({name: req.params.name}).select({ medium: 1, distance: 1 }).then(doc => {
        var engSize = req.query.engSize || 2.5;
        var sendData = {
            "car": { 
                "distance": 0, "emission": 0
            },
            "walk": {
                "distance": 0, "emission": 0
            } ,
            "bus": {
                "distance": 0, "emission": 0
            } ,
            "bike": {
                "distance": 0, "emission": 0
            } ,
            "total": {
                "distance": 0, "emission": 0
            } 
        }

        distanceSum = 0.0;

        doc.forEach((value) => {
            if(!value.medium || !value.distance) return;
            switch(value.medium){
                case (CAR_STRING):
                    sendData.car.emission += getEmis(value.distance, engSize);
                    sendData.car.distance += value.distance;
                    sendData.total.emission += getEmis(value.distance, engSize);
                    sendData.total.distance += value.distance;
                break;
                case (WALK_STRING):
                    sendData.walk.distance += value.distance;
                    sendData.total.distance += value.distance;
                break;
                case (BUS_STRING):
                    sendData.bus.emission += 0;
                    sendData.bus.distance += value.distance;
                    sendData.total.emission += 0;
                    sendData.total.distance += value.distance;
                break;
                case (BIKE_STRING):
                    sendData.bike.emission += 0;
                    sendData.bike.distance += value.distance;
                    sendData.total.emission += 0;
                    sendData.total.distance += value.distance;
                break;
            }

        });

        res.json(sendData);
    }).catch(err => {
        res.status(500).json(err);
    })
})

/*

THE API DO : /position/:name?startDate=STARTTIMESTAMP&endDate=ENDTIMESTAMP
RETURNS [
    {
        "_id": "5c4d4c1aeabe06485cdd872f",
        "name": "333",
        "medium": "test",
        "date": 2,
        "distance": 3.312321412412312,
        "__v": 0
    }]
*/

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

/*
API DO : /position
with JSON : {
    {
	"name":"333",
	"medium": "walk",
	"date" : "12",
	"coords": [{
		"lat": "1",
		"long": "11"
	},{
		"lat": "1",
		"long": "1"
	},{
		"lat": "1",
		"long": "1"
	}]
}
}
RETURNS : 
{
    "_id": "5c4d668eac725c04ccf866fa",
    "name": "333",
    "medium": "walk",
    "date": 12,
    "distance": 1111.7794800671247,
    "__v": 0
}
*/
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