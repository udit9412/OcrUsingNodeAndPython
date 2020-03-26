const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const { spawn } = require("child_process");
const Mongoose = require("mongoose");
var folder = "uploads";
const port = 3000;
var sleep = require('system-sleep');
const myurl = "mongodb://localhost:27017";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

Mongoose.connect(
  "mongodb://localhost:27017/fileupload",
  { useNewUrlParser: true },
  err => {
    if (!err) {
      console.log("MongoDB Connection Succeeded.");
    } else {
      console.log("Error in DB connection : " + err);
    }
  }
);

var Schema = Mongoose.Schema;

const Model = Mongoose.model('Model',  Schema({
  EmpId: { type: String, required: false },
  Age: { type: String, required: false },
  Designation: { type: String, required: false },
  Income: { type: String, required: false },
  Mstatus: { type: String, required: false },
  Gender: { type: String, required: false },
  Education: { type: String, required: false },
  TravelTime: { type: String, required: false },
  ClaimType: { type: String, required: false },
  Status: { type: String, required: false },
  ClaimFrequency: { type: String, required: false },
  TotalClaimAmount: { type: String, required: false },
  ClaimAmount: { type: String, required: false },
  GST: { type: String, required: true },
  Date: { type: String, required: true },
  Price: { type: String, required: false },
  ClaimFlag: { type: String, required: false }
}),'file');

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({ storage: storage });

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

async function run(file_name, id) {
  var x = "uploads";
  var y = await callName(x, file_name, id);
  return y;
}
function runScript(first_name, second_name) {
  return spawn("python", ["-u", "./pytess.py", first_name, second_name]);
}

function runmodelScript(ID, AGE,Designation, INCOME, MSTATUS, GENDER,EDUCATION, TRAVTIME, Claim_TYPE, Status, CLM_FREQ,Total_CLM_AMT, CLM_AMT) {
  return spawn("python", ["-u", "./pythonmodel.py", ID, AGE,Designation, INCOME, MSTATUS, GENDER,EDUCATION, TRAVTIME, Claim_TYPE, Status, CLM_FREQ,Total_CLM_AMT, CLM_AMT]);
}

async function callName(first_name, second_name, id) {
  const subprocess = runScript(first_name, second_name);
  await  subprocess.stdout.on("data", async data => {
    let data3 = JSON.parse(data.toString());
    var myquery = { EmpId: id };
    var newvalues = {
      $set: { GST: data3.GST, Date: data3.Date, Price: data3.Price }
    };
    var resu = await Model.findOneAndUpdate(myquery, newvalues, {
      upsert: true,
      rawResult: true
    });
    console.log(`data:${data.toString()}`)
  });
  subprocess.stderr.on("data", data => {
    console.log(`error:${data}`);
  });
  subprocess.stderr.on("close", () => {
    console.log("Closed");
  });
}

async function callNameModel(id) {
  var person =  await Model.findOne({ EmpId: id }).exec();
  const subprocess = runmodelScript(person.EmpId,person.Age,person.Designation, person.Income,
     person.Mstatus, person.Gender,person.Education, person.TravelTime, person.ClaimType,
      person.Status, person.ClaimFrequency,person.TotalClaimAmount, person.ClaimAmount);
  await  subprocess.stdout.on("data", async data => {
    let data3 = JSON.parse(data.toString().replace(/'/g, '"'));
    // console.log(`date3:${data3.y_pred}`);
    var myquery = { EmpId: id };
    var newvalues = {
      $set: { ClaimFlag: data3.y_pred}
    };
    var resu = await Model.findOneAndUpdate(myquery, newvalues, {
      upsert: true,
      rawResult: true
    });
    console.log(`data:${data.toString()}`)
  });
  subprocess.stderr.on("data", data => {
    console.log(`error:${data}`);
  });
  subprocess.stderr.on("close", () => {
    console.log("Closed");
  });
}

app.post("/getbill", async (req, res) => {
  try {
  const id = req.body.id;
  console.log("req"+JSON.stringify(req.body))
  console.log("req"+req.body.id)
  await callNameModel(id);
  sleep(5000);
  var person =  await Model.findOne({ EmpId: id }).exec();
  res.send(person);
  } catch (error){
    res.status (500).send(error);
  }
});

app.post("/uploadfile", upload.single("myFile"), async (req, res, next) => {
  const file = req.file;
  const id = req.body.id;
  // console.log("from uplo"+req.body.id)
  var filename = req.file.originalname;
  let doc=run(filename, id);

  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  }
  sleep(4000);
  var person =  await Model.findOne({ EmpId: id }).exec();
  res.send(person);
});




app.use(function(err, req, res, next) {
  res.json({ error: err.message });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
