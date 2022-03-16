const express = require('express')
const cors = require("cors");
const app = express()
/* const port = process.env.PORT || 8000 */
const mysql      = require('mysql');
const {forEach} = require("react-bootstrap/ElementChildren");
const connection = mysql.createConnection({
    host     : 'localhost',
    database: 'todo',
    user     : 'root',
    password : 'root',
    dateStrings: 'date'
});

app.listen(4567, () => {})
//app.use(function(req,res,next){setTimeout(next,1000)});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 *API Todos
 */

app.get('/api/todos', (req, res) => {
    connection.query(`SELECT * FROM todo`, function(err, rows, fields) {
        res.json(rows)
    });
})

app.post('/api/todos', (req, res) =>{
    const { titre } = req.query;
    const { description } = req.query;
    const { date } = req.query;
    const { label } = req.query;
    const today = new Date();
    const creationdate = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
    if(!titre || !description || !date || !label){
        res.status(400).json(
            { error: 'one or more parameters is required!' }
        )
    }
    connection.query(
            `INSERT INTO todo (\`id\`, \`titre\`, \`description\`, \`due_date\`, \`label_id\`, \`creation_date\`)
            VALUES (NULL, '${titre}', '${description}', '${date}', '${label}', '${creationdate}');`,
        function(err, rows, fields) {
        res.json({rows})
    });
});


app.patch('/api/todos', (req, res ) =>{
    const { id } = req.query;
    const { body } = req;
    if(!id || !body){
        res.status(400).json(
            { error: 'one or more parameters is required!' }
        )
    }

    let setString = ""
    for (const [key, value] of Object.entries(body)) {
        if(setString === ""){
            setString += `\`${key}\` = \'${value}\'`;
        }
        else {
            setString += `, \`${key}\` = \'${value}\'`;
        }
    }
        connection.query(`UPDATE todo SET ${setString} WHERE \`todo\`.\`id\` = ${id};`,
        function(err, rows, fields) {
            res.json({rows})
        });
});

app.delete('/api/todos', (req, res ) =>{
    const { id } = req.query;
    if(!id){
        res.status(400).json(
            { error: 'id parameters is required!' }
        )
    }
    connection.query(`DELETE FROM todo WHERE \`todo\`.\`id\` = ${id}`,
        function(err, rows, fields) {
            res.json({rows})
        });
});

/**
 *API Label
 */

app.get('/api/labels', (req, res) => {
    connection.query(`SELECT * FROM label`, function(err, rows, fields) {
        res.json(rows)
    });
})

app.get('/api/labels/getColor', (req, res) => {
    const { id } = req.query;
    connection.query(`SELECT couleur FROM label WHERE \`id\` = ${id}`, function(err, rows, fields) {
        console.log(fields)
        res.json(rows['couleur'])
    });
})


app.post('/api/labels', (req, res) =>{
    const { nom } = req.query;
    const { couleur } = req.query;
    if(!nom || !couleur){
        res.status(400).json(
            { error: 'one or more parameters is required!' }
        )
    }
    connection.query(
        `INSERT INTO label (\`id\`, \`nom\`, \`couleur\`)
        VALUES (NULL, '${nom}', '${couleur}');`,
        function(err, rows, fields) {
            res.json({rows})
        });
});

app.delete('/api/labels', (req, res ) =>{
    const { id } = req.query;
    if(!id){
        res.status(400).json(
            { error: 'id parameters is required!' }
        )
    }
    connection.query(`DELETE FROM label WHERE \`label\`.\`id\` = ${id}`,
        function(err, rows, fields) {
            res.json({rows})
        });
});