let mongoose = require('mongoose');
const server = 'ds113845.mlab.com:13845'
const database = 'conuhacks2019';
const user = 'eco';
const password = 'ecoeco1';
// mongodb://<dbuser>:<dbpassword>@ds018308.mlab.com:18308/node-js-tutorial
mongoose.connect(`mongodb://${user}:${password}@${server}/${database}`, { useNewUrlParser: true });

let DistanceSchema  = new mongoose.Schema({
    name: String,
    medium: String,
    date: Number,
    distance: Number
})

module.exports = mongoose.model('Distance', DistanceSchema);