const { Deta } = require("deta");
const express = require("express");

var app = express();

const deta = Deta("b0aauvrg_g9oz6MqRoKMm31ukBJbtrorLbZEzQM4U");
const drive = deta.Drive("Item_Visualizations");

// Static Files (css/js/img)
app.use(express.static('public'));

// Set View's (html)
app.set('views', './views');
app.set('view engine', 'ejs');

app.get('', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
 })

app.get("/download_photo", async (req, res) => {
    const img = await drive.get(req.query.file);
    const buffer = await img.arrayBuffer();
    res.send(Buffer.from(buffer));
 })

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 3000
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || 'localhost'
app.listen(server_port, server_ip_address, () => {
    console.log( "Listening on " + server_ip_address + ", port " + server_port )
});