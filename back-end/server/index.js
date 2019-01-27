const express = require('express');
const distance = require('gps-distance');
const json = require('./data.json');

const app = express();

//const json = '{"medium": "car","coords": [{"lat": 122.55086689428897,"lon": 100.46649496120548,"timestamp": 1},{"lat": 77.6578575162358,"lon": 115.02846565712437,"timestamp": 2},{"lat": 111.85650311313133,"lon": 92.85303709974411,"timestamp": 3},{"lat": 74.07148265842007,"lon": 115.47674499425094,"timestamp": 4}]}';

//myCoords = JSON.parse(json);
function getDist(json){
	let arr = [];
	for(let i=0;i<(json.coords).length;i++){
		arr.push([json.coords[i].lat, json.coords[i].lon]);
	}
	console.log(distance(arr));
}

getDist(json);

app.get('/', (req, res) => {
	res.json(json);
})


app.post('/a', (req, res) => {
	console.log(req.body);
});

app.listen(5000, () => {
	console.log('Listening on http://localhost:5000');
});
