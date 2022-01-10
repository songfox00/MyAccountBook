const fs = require('fs');
const express = require('express');
const bodyParser=require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const data = fs.readFileSync('../database.json');
const conf = JSON.parse(data);
const mysql=require('mysql');
const request=require('request');
const cors=require('cors');

const connection = mysql.createConnection({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database,
    multipleStatements:true
})

connection.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({
    origin: 'http://10.0.2.2:8081',
    credentials: true
}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://10.0.2.2:8081');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, origin');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    (req.method === 'OPTIONS') ?
    res.sendStatus(200) :
    next();
})

app.get('/',(req,res)=>{
    res.json({message:'Hello World!'})
})

// read book
app.post('/list', (req,res)=>{
    var month=req.body.month;
    var query=connection.query('SELECT * FROM basic WHERE month=? ORDER BY day DESC, hour DESC, minute DESC, second DESC',[month], (err, rows, fields)=>{
        res.send(rows);
    })
})

//read asset
app.get('/assetList', (req,res)=>{
    var query=connection.query('SELECT * FROM asset1', (err, rows, fields)=>{
        res.send(rows);
    })
})

//create
app.post('/addBook', (req,res)=>{
    console.log("addBook");
    var date=req.body.date;
    var time=req.body.time;
    var money=req.body.money;
    var content=req.body.content;
    var payment=req.body.payment;
    var classi=req.body.classi;
    var memo=req.body.memo;
    var type=req.body.type;
    var dateString=req.body.dateString;

    money=money*1;

    var arr=date.split('/');
    var month=arr[0]*1;
    var day=arr[1]*1;
    var year=arr[2]*1;

    var arr2=time.split(':');
    var hour=arr2[0]*1;
    var minute=arr2[1]*1;
    var second=arr2[2]*1;
    
    var sql={year, month, day, second, minute,hour, money, content, payment, classi, memo, type, dateString};
    var query=connection.query('INSERT INTO basic SET?',sql, (err, rows, fields)=>{
        request.post('http://localhost:5000/updateAsset', {form:{
            name: payment,
            money: money,
            type: type
        }})
        res.send(rows);
    })
})

//create asset
app.post('/addAsset', (req,res)=>{
    console.log("addAsset");
    var money =req.body.money;
    var name = req.body.name;
    money=money*1;

    var sql={name, money};
    var query=connection.query('INSERT INTO asset1 SET?', sql, (err, rows, fields)=>{
        res.send(rows);
    })
})

//update asset
app.post('/updateAsset', (req,res)=>{
    console.log("updateAsset");
    var money =req.body.money;
    var name = req.body.name;
    var type=req.body.type;

    if(type!=null && type==0)
        money=money*-1;
    var sql=[money, name];

    if(type!=null){
        var query=connection.query('UPDATE asset1 SET money=money+? WHERE name=?', sql, (err, rows, fields)=>{
            res.send(rows);
        })
    }   
    else{
        var query=connection.query('UPDATE asset1 SET money=? WHERE name=?', sql, (err, rows, fields)=>{
            res.send(rows);
        })
    }
})

//update book
app.post('/updateBook', (req,res)=>{
    var id=req.body.id;
    var date=req.body.date;
    var dateString=req.body.dateString;
    var time=req.body.time;
    var money=req.body.money*1;
    var content=req.body.content;
    var payment=req.body.payment;
    var classi=req.body.classi;
    var memo=req.body.memo;
    var type=req.body.type;

    var arr=date.split('/');
    var month=arr[0]*1;
    var day=arr[1]*1;
    var year=arr[2]*1;

    console.log(money);
    var arr2=time.split(':');
    var hour=arr2[0]*1;
    var minute=arr2[1]*1;
    var second=arr2[2]*1;


    var sql=[year, month, day, hour, minute, second, money, content, payment, classi, memo, type, dateString, id];
    var query=connection.query('UPDATE basic SET year=?, month=?, day=?, hour=?, minute=?, second=?, money=?, content=?, payment=?, classi=?, memo=?, type=?, dateString=? WHERE id=?',sql,(err, rows, fields)=>{
        request.post('http://localhost:5000/updateAsset', {form:{
            name: payment,
            money: money,
            type: type
        }})
        res.send(rows);
    })
})

//deleteBook
app.post('/deleteBook', (req,res)=>{
    var id=req.body.id;

    var query=connection.query('DELETE FROM basic WHERE id=?',[id],(err, rows, fields)=>{
        res.send(rows);
    })
})

//deleteAsset
app.post('/deleteAsset', (req,res)=>{
    var id=req.body.id;
    var query=connection.query('DELETE FROM asset1 WHERE id=?',[id],(err, rows, fields)=>{
        res.send(rows);
    })
})

app.listen(port, () => console.log(`Listening on port ${port}`));