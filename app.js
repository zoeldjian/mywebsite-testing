//jshint esversion:6

const express = require ("express");
const bodyParser = require ("body-parser");
const request = require ("request");
const https = require ("https");


// Constants
const PORT = 8080;
const HOST = '0.0.0.0';


const app = express(); //express server js

app.use(bodyParser.urlencoded({extended:true})); //to get data from the post form

app.use(express.static("public")); //Static file to route to the local links (folder public)

app.get("/", function(req, res){
res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) //request post to mailchimp API

{

const firstName = req.body.fName;
const lastName = req.body.lName;
const email = req.body.email;


const data = {

            members:[
                {
            email_address: email,
            status: "subscribed",
            merge_fields: {
              FNAME: firstName,
              LNAME: lastName
                  }
                }
              ]
            };

const jsonData = JSON.stringify(data); //pass the data with JSON format because javascript is not a string, to send to the mailchimp


const url = "https://us17.api.mailchimp.com/3.0/lists/4f66884be2" ; //4f66884be2
const options = { method: "POST",
                  auth: "zoeldjian09:60c9c14f20e7a2cb2e73b68e4853a435-us17" }; ////60c9c14f20e7a2cb2e73b68e4853a435-us17


const request = https.request(url, options, function(response){

  if (response.statusCode === 200) {
     res.sendFile(__dirname + "/success.html");
  }

  else {
    res.sendFile(__dirname + "/failure.html");
  }

   response.on("data", function(data){  //response the data from JSON stringify on the line of 43
     console.log(JSON.parse(data));
   });
 });

request.write(jsonData); //viewing the data after passed with JSON strngify from the Mailchimp...
request.end();

});

//If the signup is failed! and will going to be called by the server and will redirect to the home route then send to the Signup.html page
app.post("/failure", function(req, res){

    res.redirect("/");

});


app.listen(PORT, HOST);{

  console.log("Server is running on http://${HOST}:${PORT}");

}

//List Id - 4f66884be2 TO SEND REQUEST TO THE MAILCHIMP SERVER
//API key c518a069827c78b4cee9ce806bb7d7a3-us17
