const express = require('express');
const app  = express();

const compression = require('compression');
const morgan = require('morgan');
const bodyParser = require('body-parser');



require('dotenv').config()




app.use(morgan('dev')); // เเสดงการทำงาน


app.use(bodyParser.urlencoded({extended : false})); // false ใช้อัลกอในการ map json ธรรมดา ,true = high
app.use(bodyParser.json());
app.use(compression());

//---------------Access-Control-Allow-Origin----------
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Orgin, X-Requested-With, Content-Type, Accept,Authorization,authorization,content-type');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next(); // ไปต่อ
})


const MongoClient  = require('mongodb').MongoClient ;
const URL_MONGODB_IOT = process.env.URL_MONGODB +process.env.DATABASE_DATA_IOT ;



app.get('/get/dataInvitation',(req , res , next) =>{  // path /

    MongoClient.connect(URL_MONGODB_IOT, function(err, db) 
    {
        if (err) throw err;
        let dbo = db.db(process.env.DATABASE_DATA_IOT);
        var mysort = { dateTime : -1 };
        dbo.collection('Sheet1')
        .find()
        .toArray(function(err, result) 
        {
            //console.log(moment(result[0].dateTime).format(' D/MM/YYYY h:mm:ss'))
           
            if (err) {
                //console.log(err);  
                let data = {
                    status : "error",
                    data : "query command error"
                }   
                res.json(data);
            }
            else
            {
                let data = {
                    status : "success",
                    data : result[0]
                }
                res.json(data);
            }

            db.close();
        });
    });

  

})




//set path

module.exports = app ;