const { Deta } = require("deta");
const express = require("express");

var app = express();

const deta = Deta("b0aauvrg_g9oz6MqRoKMm31ukBJbtrorLbZEzQM4U");
const drive = deta.Drive("Item_Visualizations");

// Static Files (css/js/img)
app.use(express.static('public'));
// Set View's (html)
app.set('views', './views');

app.get('', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
 })

app.get("/download_photo", async (req, res) => {
    const img = await drive.get(req.query.file);
    const buffer = await img.arrayBuffer();
    res.send(Buffer.from(buffer));
 })

const PORT = process.env.PORT || 5000
app.listen(PORT);