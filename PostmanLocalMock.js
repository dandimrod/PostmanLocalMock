var express = require('express');
var https = require("https");
var opn = require("opn");
var bodyParser = require('body-parser');
var url = require("url");
let version="0.0.2";

var argumentData = {};
for (let index = 2; index < process.argv.length; index++) {
    const argument = process.argv[index];
    if (argument.split("=")[1]) {
        argumentData[argument.split("=")[0]] = argument.split("=")[1];
    } else {
        argumentData[argument] = true;
    }
}

let appInterface = express();
appInterface.use( bodyParser.json() );
let app;
let httpServer;

let cofigPageBody = function(){
    let body=`
    <head>
    <title>Postman Local Server</title>
    <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous">
    <style>
        details{
            padding:2.5vh 5%;
            border-radius:5px;
            border:1px solid rgb(0, 0, 0, 0.08);
            box-shadow:0px 0px 0px rgb(0, 0, 0, 0);
            margin:2vh 20px;
            transition:0.4s ease-in-out;
            background:white;
            word-wrap: break-word;
            color: black;
        }

        details:hover{
            cursor: pointer;
            border:1px solid rgb(0, 0, 0, 0);
            box-shadow:0px 15px 35px rgb(0, 0, 0, 0.06);
        }

        button{
            background-color: #FF6C37; /* Green */
            border: none;
            color: white;
            padding: 20px;
            text-align: center;
            text-decoration: none;
            font-size: 16px;
            cursor: pointer;
            transition: background-color .3s ease-in-out,background .3s ease-in-out,box-shadow .3s ease-in-out,color .3s ease-in-out,-webkit-box-shadow .3s ease-in-out;
            border-radius: 4px;
        }

        button:hover{
            background-color: #ff916a;
        }

        .version-tray{
            padding: 5px;
            display: grid;
            border-radius:10px;
        }
        .onupgrade-version-tray{
            grid-template-rows: 1fr 1fr;
        }

        .version{
            border-radius: 5px;
            background:white;
            word-wrap: break-word;
            color: black;
            border-top-left-radius:5px;
            text-align: center;
        }

        .version div{
            text-align: center;
            position: relative;
            top: 50%;
            -ms-transform: translateY(-50%);
            -webkit-transform: translateY(-50%);
            transform: translateY(-50%);
        }
        .onupgrade-version{
            border-radius:0;
            border-top-left-radius:5px;
            border-top-right-radius:5px;
        }
        .upgrade{
            background-color: #29c23b;
            border: none;
            color: white;
            padding: 5px;
            text-align: center;
            text-decoration: none;
            font-size: 16px;
            cursor: pointer;
            transition: background-color .3s ease-in-out,background .3s ease-in-out,box-shadow .3s ease-in-out,color .3s ease-in-out,-webkit-box-shadow .3s ease-in-out;
            border-radius:0;
            border-bottom-left-radius:5px;
            border-bottom-right-radius:5px;
        }
        .upgrade:hover{
            background-color:#36ff4d;
        }

        .button-tray{
            padding: 5px;
            display: grid;
            grid-template-columns: 3fr 1fr;
            grid-template-rows: 1fr;
            grid-template-areas: "server-status close-button";
            border-radius:10px;
        }
        .close-button { grid-area: close-button; padding: 5px; border-radius:0; border-bottom-right-radius:5px; border-top-right-radius:5px;}

        .server-status {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            grid-template-areas: "status-data status-data" "start-server stop-server";
            grid-area: server-status;
        }

        .start-server { grid-area: start-server; padding: 10px; border-radius:0; border-bottom-left-radius:5px; }

        .stop-server { grid-area: stop-server; padding: 10px; border-radius:0; }

        .status-data { 
            grid-area: status-data; 
            background:white;
            word-wrap: break-word;
            color: black;
            border-top-left-radius:5px;
            text-align: center;
        }

        .status-data div{
            text-align: center;
            position: relative;
            top: 50%;
            -ms-transform: translateY(-50%);
            -webkit-transform: translateY(-50%);
            transform: translateY(-50%);
        }


        body{
            margin: 0;
            font-family: 'Roboto';
            background: whitesmoke;
        }
        .container {
            height: 100%;
            width: 100%;
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 10fr;
            grid-template-areas: "nav" "container-body";
        }

        .container-body {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-areas: "form console" "container-history container-history";
            grid-area: container-body;
        }

        .form { 
            grid-area: form;     
            padding:2.5vh 5%;
            border-radius:5px;
            border:1px solid rgb(0, 0, 0, 0.08);
            box-shadow:0px 0px 0px rgb(0, 0, 0, 0);
            margin:2vh 20px;
            transform:scale(1);
            transition:0.4s ease-in-out;
            background: white;
        }

        .console { 
            grid-area: console;
            background: black;
            color: white;
            padding:2.5vh 5%;
            border-radius:5px;
            border:1px solid rgb(0, 0, 0, 0.08);
            box-shadow:0px 0px 0px rgb(0, 0, 0, 0);
            margin:2vh 20px;
            transform:scale(1);
            transition:0.4s ease-in-out;
        }

        .container-history { 
            grid-area: container-history; 
            padding:2.5vh 5%;
            border-radius:5px;
            border:1px solid rgb(0, 0, 0, 0.08);
            box-shadow:0px 0px 0px rgb(0, 0, 0, 0);
            margin:2vh 20px;
            margin-top: 0;
            transform:scale(1);
            transition:0.4s ease-in-out;    
            background: white;
        }

        .nav { 
            grid-area: nav; 
            background-color: #282828; 
            display: grid;
            grid-template-columns: 8fr 1fr 2fr;
            position: sticky;
        }
        .title{
            margin-left: 10px;
            color: white;
        }
        .apply-button{
            position: absolute;
            bottom: 0;
            margin: 20px;
            right: 0;
        }
        .clean-history-button{
            position: absolute;
            top: 0;
            right: 0;
            margin: 20px;
        }


    </style>
</head>
<body>
    <div class="container">
        <div class="nav">
            <h1 class="title">
                POSTMAN LOCAL SERVICE
            </h1>
            <div class="version-tray">
                <div class="version"></div>
            </div>
            <div class="button-tray">
                <div class="server-status">
                    <div class="status-data">
                        <div><i class="far fa-dot-circle" style="color: red;"></i> Server stopped</div>
                    </div>
                    <button onClick="startServer();" class="start-server"><i class="fas fa-play-circle"></i></button>
                    <button hidden id="serverStopper" class="stop-server" onClick="stopServer();"><i class="fas fa-stop-circle"></i></button>
                </div>
                <button onClick="closeProgram();" class="close-button"><i class="fas fa-times-circle"></i></button>
            </div>
        </div>
        <div class="container-body">
                <div class="form">
                    <h2>Server settings</h2>
                    <label for="url">Postman Collection URL:</label><br/>
                    <input type="text" name="url" onChange="saveData();"></input><br/>
                    <label for="port">Port for deployment:</label><br/>
                    <input type="number" name="port" value="8080" onChange="saveData();"></input><br/>
                    <label for="code">HTTP Codes (IF MULTIPLE, USE ","):</label><br/>
                    <input type="text" name="code" value="200" onChange="saveData();"></input><br/>
                    <label for="mode">If different codes are specified, how to switch between them:</label><br/>
                    <select name="mode" value="random" onChange="saveData();">
                        <option value="random">Randomly</option>
                        <option value="order">In order</option>
                    </select><br/>
                    <button class="apply-button" onClick="startServer();">Apply</button>
                </div>
                <div class="console">
                    <div id="server_resp"></div>
                </div>
                <div class="container-history">
                    <div>
                        <h2>History</h2><button class="clean-history-button" hidden id="cleanHistory" onClick="cleanHistory();"><i class="fas fa-trash"></i></button>
                    </div>
                    <div id="history"></div>
                </div>
        </div>
    </div>
    <script>
        (function() {
            var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'shortcut icon';
            link.href = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAQACAYAAAB/HSuDAAAgAElEQVR4XuzdCZhcZZX/8d+51d2QBVBCEkAQRIQhCBo6XcUiCKKgzowbRhwXRMRM6KpGNldEGlEQBSJ2VRMDCoozOoPyn78jjoojyqhQ1QQQBFH5KypbAmRUlkAvdf5PdUcEDKSXW1X33vfbz+MTHr33fc/5nFfS9evquia+EEAAAQQQQAABBBBAAAEEEEAg8wKW+Q5pEAEEEEAAAQQQQAABBBBAAAEERADAIUAAAQQQQAABBBBAAAEEEEAgAAECgACGTIsIIIAAAggggAACCCCAAAIIEABwBhBAAAEEEEAAAQQQQAABBBAIQIAAIIAh0yICCCCAAAIIIIAAAggggAACBACcAQQQQAABBBBAAAEEEEAAAQQCECAACGDItIgAAggggAACCCCAAAIIIIAAAQBnAAEEEEAAAQQQQAABBBBAAIEABAgAAhgyLSKAAAIIIIAAAggggAACCCBAAMAZQAABBBBAAAEEEEAAAQQQQCAAAQKAAIZMiwgggAACCCCAAAIIIIAAAggQAHAGEEAAAQQQQAABBBBAAAEEEAhAgAAggCHTIgIIIIAAAggggAACCCCAAAIEAJwBBBBAAAEEEEAAAQQQQAABBAIQIAAIYMi0iAACCCCAAAIIIIAAAggggAABAGcAAQQQQAABBBBAAAEEEEAAgQAECAACGDItIoAAAggggAACCCCAAAIIIEAAwBlAAAEEEEAAAQQQQAABBBBAIAABAoAAhkyLCCCAAAIIIIAAAggggAACCBAAcAYQQAABBBBAAAEEEEAAAQQQCECAACCAIdMiAggggAACCCCAAAIIIIAAAgQAnAEEEEAAAQQQQAABBBBAAAEEAhAgAAhgyLSIAAIIIIAAAggggAACCCCAAAEAZwABBBBAAAEEEEAAAQQQQACBAAQIAAIYMi0igAACCCCAAAIIIIAAAgggQADAGUAAAQQQQAABBBBAAAEEEEAgAAECgACGTIsIIIAAAggggAACCCCAAAIIEABwBhBAAAEEEEAAAQQQQAABBBAIQIAAIIAh0yICCCCAAAIIIIAAAggggAACBACcAQQQQAABBBBAAAEEEEAAAQQCECAACGDItIgAAggggAACCCCAAAIIIIAAAQBnAAEEEEAAAQQQQAABBBBAAIEABAgAAhgyLSKAAAIIIIAAAggggAACCCBAAMAZQAABBBBAAAEEEEAAAQQQQCAAAQKAAIZMiwgggAACCCCAAAIIIIAAAggQAHAGEEAAAQQQQAABBBBAAAEEEAhAgAAggCHTIgIIIIAAAggggAACCCCAAAIEAJwBBBBAAAEEEEAAAQQQQAABBAIQIAAIYMi0iAACCCCAAAIIIIAAAggggAABAGcAAQQQQAABBBBAAAEEEEAAgQAECAACGDItIoAAAggggAACCCCAAAIIIEAAwBlAAAEEEEAAAQQQQAABBBBAIAABAoAAhkyLCCCAAAIIIIAAAggggAACCBAAcAYQQAABBBBAAAEEEEAAAQQQCECAACCAIdMiAggggAACCCCAAAIIIIAAAgQAnAEEEEAAAQQQQAABBBBAAAEEAhAgAAhgyLSIAAIIIIAAAggggAACCCCAAAEAZwABBBBAAAEEEEAAAQQQQACBAAQIAAIYMi0igAACCCCAAAIIIIAAAgggQADAGUAAAQQQQAABBBBAAAEEEEAgAAECgACGTIsIIIAAAggggAACCCCAAAIIEABwBhBAAAEEEEAAAQQQQAABBBAIQIAAIIAh0yICCCCAAAIIIIAAAggggAACBACcAQQQQAABBBBAAAEEEEAAAQQCECAACGDItIgAAggggAACCCCAAAIIIIAAAQBnAAEEEEAAAQQQQAABBBBAAIEABAgAAhgyLSKAAAIIIIAAAggggAACCCBAAMAZQAABBBBAAAEEEEAAAQQQQCAAAQKAAIZMiwgggAACCCCAAAIIIIAAAggQAHAGEEAAAQQQQAABBBBAAAEEEAhAgAAggCHTIgIIIIAAAggggAACCCCAAAIEAJwBBBBAAAEEEEAAAQQQQAABBAIQIAAIYMi0iAACCCCAAAIIIIAAAggggAABAGcAAQQQQAABBBBAAAEEEEAAgQAECAACGDItIoAAAggggAACCCCAAAIIIEAAwBlAAAEEEEAAAQQQQAABBBBAIAABAoAAhkyLCCCAAAIIIIAAAggggAACCBAAcAYQQAABBBBAAAEEEEAAAQQQCECAACCAIdMiAggggAACCCCAAAIIIIAAAgQAnAEEEEAAAQQQQAABBBBAAAEEAhAgAAhgyLSIAAIIIIAAAggggAACCCCAAAEAZwABBBBAAAEEEEAAAQQQQACBAAQIAAIYMi0i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z2ICBAgQIECAAAECBAgQINANAQVAN+5JSgIECBAgQIAAAQIECBAgMJKAAmAkPosJECBAgAABAgQIECBAgEA3BBQA3bgnKQkQIECAAAECBAgQIECAwEgCCoCR+CwmQIAAAQIECBAgQIAAAQLdEFAAdOOepCRAgAABAgQIECBAgAABAiMJKABG4rOYAAECBAgQIECAAAECBAh0Q0AB0I17kpIAAQIECBAgQIAAAQIECIwkoAAYic9iAgQIECBAgAABAgQIECDQDQEFQDfuSUoCBAgQIECAAAECBAgQIDCSgAJgJD6LCRAgQIAAAQIECBAgQIBANwQUAN24JykJECBAgAABAgQIECBAgMBIAgqAkfgsJkCAAAECBAgQIECAAAEC3RBQAHTjnqQkQIAAAQIECBAgQIAAAQIjCSgARuKzmAABAgQIECBAgAABAgQIdENAAdCNe5KSAAECBAgQIECAAAECBAiMJKAAGInPYgIECBAgQIAAAQIECBAg0A0BBUA37klKAgQIECBAgAABAgQIECAwkoACYCQ+iwkQIECAAAECBAgQIECAQDcEFADduCcpCRAgQIAAAQIECBAgQIDASAIKgJH4LCZAgAABAgQIECBAgAABAt0QUAB0456kJECAAAECBAgQIECAAAECIwkoAEbis5gAAQIECBAgQIAAAQIECHRDQAHQjXuSkgABAgQIECBAgAABAgQIjCSgABiJz2ICBAgQIECAAAECBAgQINANAQVAN+5JSgIECBAgQIAAAQIECBAgMJKAAmAkPosJECBAgAABAgQIECBAgEA3BBQA3bgnKQkQIECAAAECBAgQIECAwEgCCoCR+CwmQIAAAQIECBAgQIAAAQLdEFAAdOOepCRAgAABAgQIECBAgAABAiMJKABG4rOYAAECBAgQIECAAAECBAh0Q0AB0I17kpIAAQIECBAgQIAAAQIECIwkoAAYic9iAgQIECBAgAABAgQIECDQDQEFQDfuSUoCBAgQIECAAAECBAgQIDCSgAJgJD6LCRAgQIAAAQIECBAgQIBANwQUAN24JykJECBAgAABAgQIECBAgMBIAgqAkfgsJkCAAAECBAgQIECAAAEC3RBQAHTjnqQkQIAAAQIECBAgQIAAAQIjCSgARuKzmAABAgQIECBAgAABAgQIdENAAdCNe5KSAAECBAgQIECAAAECBAiMJKAAGInPYgIECBAgQIAAAQIECBAg0A0BBUA37klKAgQIECBAgAABAgQIECAwkoACYCQ+iwkQIECAAAECBAgQIECAQDcEFADduCcpCRAgQIAAAQIECBAgQIDASAIKgJH4LCZAgAABAgQIECBAgAABAt0QUAB0456kJECAAAECBAgQIECAAAECIwkoAEbis5gAAQIECBAgQIAAAQIECHRDQAHQjXuSkgABAgQIECBAgAABAgQIjCSgABiJz2ICBAgQIECAAAECBAgQINANAQVAN+5JSgIECBAgQIAAAQIECBAgMJKAAmAkPosJECBAgAABAgQIECBAgEA3BBQA3bgnKQkQIECAAAECBAgQIECAwEgCCoCR+CwmQIAAAQIECBAgQIAAAQLdEFAAdOOepCRAgAABAgQIECBAgAABAiMJKABG4rOYAAECBAgQIECAAAECBAh0Q0AB0I17kpIAAQIECBAgQIAAAQIECIwkoAAYic9iAgQIECBAgAABAgQIECDQDQEFQDfuSUoCBAgQIECAAAECBAgQIDCSgAJgJD6LCRAgQIAAAQIECBAgQIBANwQUAN24JykJECBAgAABAgQIECBAgMBIAgqAkfgsJkCAAAECBAgQIECAAAEC3RBQAHTjnqQkQIAAAQIECBAgQIAAAQIjCSgARuKzmAABAgQIECBAgAABAgQIdENAAdCNe5KSAAECBAgQIECAAAECBAiMJKAAGInPYgIECBAgQIAAAQIECBAg0A0BBUA37klKAgQIECBAgAABAgQIECAwkoACYCQ+iwkQIECAAAECBAgQIECAQDcEFADduCcpCRAgQIAAAQIECBAgQIDASAIKgJH4LCZAgAABAgQIECBAgAABAt0QUAB0456kJECAAAECBAgQIECAAAECIwkoAEbis5gAAQIECBAgQIAAAQIECHRDQAHQjXuSkgABAgQIECBAgAABAgQIjCSgABiJz2ICBAgQIECAAAECBAgQINANAQVAN+5JSgIECBAgQIAAAQIECBAgMJKAAmAkPosJECBAgAABAgQIECBAgEA3BP4vopDdO2m1MmIAAAAASUVORK5CYII=';
            document.getElementsByTagName('head')[0].appendChild(link);
        })();
        
        (function(){
            let version="${version}";
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    let data = JSON.parse(this.responseText);
                    if(data["tag_name"]!==version){
                        let downloadUrl="";
                        if(navigator.platform.indexOf("Linux")>-1){
                            downloadUrl=data["assets"].find(function(asset){
                                return asset.name==="PostmanLocalMock-linux";
                            })["browser_download_url"];
                        }
                        if(navigator.platform.indexOf("Win")>-1){
                            downloadUrl=data["assets"].find(function(asset){
                                return asset.name==="PostmanLocalMock-win.exe";
                            })["browser_download_url"];
                        }
                        if(navigator.platform.indexOf("Mac")>-1){
                            downloadUrl=data["assets"].find(function(asset){
                                return asset.name==="PostmanLocalMock-macos";
                            })["browser_download_url"];
                        }
                        let versionTray=document.getElementsByClassName("version-tray")[0];
                        let versionElement = document.getElementsByClassName("version")[0];
                        let upgradeButton = document.createElement("button");
                        upgradeButton.className="upgrade";
                        upgradeButton.innerHTML='<a href="'+downloadUrl+'" style="color:white;text-decoration: none;">Download update</a>';
                        versionTray.appendChild(upgradeButton);
                        versionTray.classList.add("onupgrade-version-tray");
                        versionElement.classList.add("onupgrade-version");
                    }
                }
            };
            xhttp.open('GET', 'https://api.github.com/repos/dandimrod/PostmanLocalMock/releases/latest', true);
            xhttp.send();
            document.getElementsByClassName("version")[0].innerHTML='<div><i class="fas fa-code-branch"></i> '+version+'</div>';
        })();
        let historyLoop;
        let historyCounter=0;
        let data;
        function saveData(){
            data = {
                url:document.getElementsByName("url")[0].value,
                port:document.getElementsByName("port")[0].value,
                code:document.getElementsByName("code")[0].value,
                mode:document.getElementsByName("mode")[0].value
            }
            localStorage.setItem("cacheData",JSON.stringify(data));
        }
        function retrieveData(){
            if(localStorage["cacheData"]){
                data = JSON.parse(localStorage["cacheData"]);
                document.getElementsByName("url")[0].value=data.url;
                document.getElementsByName("port")[0].value=data.port;
                document.getElementsByName("code")[0].value=data.code;
                document.getElementsByName("mode")[0].value=data.mode;
            }
        }
        retrieveData();
        function startServer(){
            data = {
                url:document.getElementsByName("url")[0].value,
                port:document.getElementsByName("port")[0].value,
                code:document.getElementsByName("code")[0].value,
                mode:document.getElementsByName("mode")[0].value
            }
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
              if (this.readyState == 4 && this.status == 200) {
                    let data=JSON.parse(this.responseText);
                    if(data.error){
                        document.getElementById("server_resp").innerHTML ='<div style="color:red;">'+data.error+'</div>';
                    }else{
                    let serverResp='<div>Server up on: <a href="'+data.url+'">'+data.url+'</a><br/> The usable calls are:<br/>';
                    for (const path in data.data) {
                        if (data.data.hasOwnProperty(path)) {
                            const element = data.data[path];
                            serverResp+='<details><summary>'+path+'</summary>Method:'+element.method;
                            for (let index = 0; index < element.calls.length; index++) {
                                const element2 = element.calls[index];
                                serverResp+='<details><summary>Call #'+index+'</summary>Headers to comply:'+JSON.stringify(element2.header)+
                                '<br/>Query elements to comply: '+JSON.stringify(element2.queryParams)+'<br/></details>'
                            }
                            serverResp+='</details>';
                        }
                    }
                    serverResp+='</div>';
                    document.getElementById("server_resp").innerHTML = serverResp;
                    document.getElementById("serverStopper").hidden=false;
                    historyLoop=setInterval(history, 1000);
                    document.getElementById("cleanHistory").hidden=false;
                    document.getElementsByClassName("status-data")[0].innerHTML='<div><i class="far fa-dot-circle" style="color: green;"></i> Server online</div>';
                    }
                }
            };
            xhttp.open("POST", "/?data="+encodeURIComponent(JSON.stringify(data)), true);
            xhttp.send();
        }
        function stopServer(){
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
              if (this.readyState == 4 && this.status == 200) {
                if(this.responseText==="OK"){
                    document.getElementById("serverStopper").hidden=true;
                    document.getElementById("server_resp").innerHTML = '<div>Server Stopped</div>';
                    clearInterval(historyLoop);
                    document.getElementById("cleanHistory").hidden=false;
                    document.getElementsByClassName("status-data")[0].innerHTML='<div><i class="far fa-dot-circle" style="color: red;"></i> Server stopped</div>';
                }
              }
            };
            xhttp.open("POST", "/serverStop", true);
            xhttp.send();
        }

        function closeProgram(){
            if(!confirm("Are you sure you want to end this program?")){
                return;
            }
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    if(this.responseText==="OK"){
                        window.close();
                    }
                }
            };
            xhttp.open("POST", "/close", true);
            xhttp.send();
        }
        function history(){
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    let data = JSON.parse(this.responseText);
                    for (let index = historyCounter; index < data.length; index++) {
                        const element = data[index];
                        let div = document.createElement("div");
                        div.innerHTML=element;
                        document.getElementById("history").appendChild(div);
                        historyCounter++;
                    }
                }
            };
            xhttp.open("POST", "/history", true);
            xhttp.send();
        }
        function cleanHistory(){
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    if(this.responseText==="OK"){
                        document.getElementById("history").innerHTML="";
                        historyCounter=0;
                        console.log("History cleared");
                    }
                }
            };
            xhttp.open("POST", "/cleanHistory", true);
            xhttp.send();
        }
    </script>
</body> `
    return body;
}();

let history=[];

appInterface.get("/",function(req,res){
    res.set('Content-Type', 'text/html');
    res.send(cofigPageBody);
});

appInterface.post("/",function(req,res){
    let data= JSON.parse(decodeURIComponent(req.url.substr(7)));
    runServer(data,res);
});

appInterface.post("/history",function(req,res){
    res.send(JSON.stringify(history));
})

appInterface.post("/serverStop",function(req,res){
    stopServer();
    res.send("OK");
})

appInterface.post("/cleanHistory",function(req,res){
    history=[];
    res.send("OK");
})

appInterface.post("/close",function(req,res){
    res.send("OK");
    process.exit(0);
})

if(argumentData.port){
    appInterface.listen(argumentData.port,function(){
        console.log("Configuration server started on http://localhost:"+argumentData.port)
    });
    opn("http://localhost:"+argumentData.port);
}else{
    appInterface.listen(8800,function(){
        console.log("Configuration server started on http://localhost:8800")
    });
    opn("http://localhost:8800");
}

function runServer(argumentData,req){
    if(app){
        httpServer.close();
        httpServer=undefined;
        app=undefined;
    }
    try{
        if(argumentData.url){
            https.get(argumentData.url, (res) => {
                const { statusCode } = res;
                if (statusCode !== 200) {
                    req.send('{"error":"Error reading the collection. Request returned '+statusCode+'."}');
                }
        
                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk) => { rawData += chunk; });
                res.on('end', () => {
                    let postman=JSON.parse(rawData);
                    let parse=parsePostman(postman);
                    buildServer(parse)
                });
            }).on('error', (e) => {
                console.error(`Got error: ${e.message}`);
            });
        }else{
            req.send('{"error":"Error, URL not specified"}');
        }
        
        function parsePostman(postman){
            let parse={};
            for (let index = 0; index < postman.requests.length; index++) {
                const element = postman.requests[index];
                let urlData=new url.URL(element.url);
                let path=urlData.pathname?urlData.pathname:"/";
                if(parse[path]&&parse[path].method===element.method){
                    parse[path].calls.push({
                        header:element.headerData?element.headerData:[],
                        queryParams:element.queryParams?element.queryParams:[],
                        responses:[]
                    });
                }else{
                    parse[path]={
                        method:element.method?element.method:"GET",
                        calls:[
                            {
                                header:element.headerData?element.headerData:[],
                                queryParams:element.queryParams?element.queryParams:[],
                                responses:[]
                            }
                        ]
                    }
                }
                if(element.responses){
                    for (let index2 = 0; index2 < element.responses.length; index2++) {
                        const element2 = element.responses[index2];
                        let response = {
                            body:element2.text?element2.text:"Test",
                            code:element2.responseCode?element2.responseCode.code:200,
                            header:element2.headers?element2.headers:[],
                        }
                        parse[path].calls[parse[path].calls.length-1].responses.push(response);
                    }
                }
            }
            if(Object.keys(parse)===[]){
                req.send('{"error":"Error, the collection is empty"}'); 
                return;
            }
            return parse;
        }
        
        function buildServer(data){
            app=express();
            for (const path in data) {
                if (data.hasOwnProperty(path)) {
                    const element = data[path];
                    app[element.method.toLowerCase()](path,function(element,argumentData){
                        return function(req,res){
                            function getPropperCall(element, req){
                                let call=element.calls.find(function(call){
                                    let match=0;
                                    if(call.queryParams){
                                        for (let index = 0; index < call.queryParams.length; index++) {
                                            const element = call.queryParams[index];
                                            if(element.enabled){
                                                if(req.query){
                                                    if(req.query[element.key]){
                                                        if(req.query[element.key]===element.value){
                                                            match++;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if(call.header){
                                        for (let index = 0; index < call.header.length; index++) {
                                            const element = call.header[index];
                                            if(element.enabled){
                                                if(req.headers){
                                                    if(req.headers[element.key.toLowerCase()]){
                                                        if(req.headers[element.key.toLowerCase()]===element.value){
                                                            match++;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if(call.queryParams.length+call.header.length===0){
                                        return false;
                                    }else{
                                        if(call.queryParams.length+call.header.length===match){
                                            return true;
                                        }else{
                                            return false;
                                        }
                                    }
                                });
                                //If not found, try to use default
                                if(!call){
                                    call=element.calls.find(function(call){
                                        if(call.queryParams.length+call.header.length===0){
                                            return true;
                                        }
                                    })
                                }
                                return call;
                            }
                            let call=getPropperCall(element,req);
                            if(call){
                                if(call.responses){
                                    let permitList=[];
                                    let result;
                                    let permitAny=false;
                                    if(argumentData.code){
                                        for (let index = 0; index < call.responses.length; index++) {
                                            const element = call.responses[index];
                                            if(argumentData.code.split(",").filter(function(code){
                                                return code.trim()===element.code.toString();
                                            }).length!==0){
                                                permitList.push(element)
                                            }
                                        }
                                    }else{
                                        permitAny=true;
                                    }
                                    if(!permitAny&&(permitList.length===0)){
                                        history.push(`<details><summary>Called ${req.url}</summary>
                                        Response code: 404<br/>
                                        Response body: No call matches requirements
                                        </details>`)
                                        res.statusCode=404;
                                        res.send("No call matches requirements");
                                        return;
                                    }
                                    if(argumentData.mode){
                                        if(argumentData.mode==="order"){
                                            //TODO: ADD ORDER
                                            if(!permitAny){
                                                result=permitList[0];
                                            }else{
                                                result=call.responses[0];
                                            }
                                        }else{
                                            if(!permitAny){
                                                result=permitList[Math.floor(Math.random() * permitList.length)];
                                            }else{
                                                result=call.responses[Math.floor(Math.random() * call.responses.length)];
                                            }
                                        }
                                    }else{
                                        if(!permitAny){
                                            result=permitList[Math.floor(Math.random() * permitList.length)];
                                        }else{
                                            result=call.responses[Math.floor(Math.random() * call.responses.length)];
                                        }
                                    }
                                    res.statusCode=result.code;
                                    for (let index = 0; index < result.header.length; index++) {
                                        const element = result.header[index];
                                        res.set(element.key,element.value);
                                    }
                                    history.push(`<details><summary>Called ${req.url}</summary>
                                    Response code: ${result.code}<br/>
                                    Response body: ${result.body}
                                    </details>`)
                                    res.send(result.body);
                                }else{
                                    history.push(`<details><summary>Called ${req.url}</summary>
                                    Response code: 500<br/>
                                    Response body: No responses specified
                                    </details>`)
                                    res.send(result.body);
                                    res.statusCode=500;
                                    res.send("No responses specified");
                                }
                            }else{
                                history.push(`<details><summary>Called ${req.url}</summary>
                                    Response code: 404<br/>
                                    Response body: Call not matched
                                    </details>`)
                                res.statusCode=404;
                                res.send("Call not matched");
                            }
                        }
                    }(element,argumentData));
                }
            }
            let port = argumentData.port?parseInt(argumentData.port):3000;
            httpServer = require('http').createServer(app);
            httpServer.listen(port);
            req.send('{"url":"http://localhost:'+argumentData.port+'","data":'+JSON.stringify(data) +'}');
        }
    }catch(error){
        req.send('{"error":"'+error+'"}');
    }
}

function stopServer(){
    if(app){
        httpServer.close();
        httpServer=undefined;
        app=undefined;
    }
}