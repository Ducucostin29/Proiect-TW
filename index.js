const express = require("express");//include biblioteca express
const fs= require('fs');//include biblioteca fs sistemul de fisiere poate sa fac chesti primeasca citeasca etc
const path=require('path');// se uita la cai
const sharp=require('sharp');
const sass=require('sass');
const ejs=require('ejs');
const Client  = require("pg").Client;


var client= new Client({database:"cti_2024",
        user:"alexandru",
        password:"alexandru",
        host:"localhost",
        port:5432});
client.connect();

client.query("select * from unnset(enum_range(null::categ_prajituri))",function(err,rez){
    console.log(rez);
})



obGlobal = {
    obErori: null,
    obImagini: null,
    folderScss:path.join(__dirname,"resurse/SCSS"),
    folderCss:path.join(__dirname,"resurse/CSS"),
    folderBackup:path.join(__dirname,"backup")
}

vect_foldere = ["temp", "temp1", "backup"];
for (let folder of vect_foldere) {
    let caleFolder = path.join(__dirname, folder)
    if (!fs.existsSync(caleFolder)) {
        fs.mkdirSync(caleFolder);
    }
}

app= express();//apeleaza o functie din express , iar app va astepta o valoare
console.log("Folder proiect", __dirname);//Folderul aplicatiei
console.log("Cale fisier", __filename);//calea fisier
console.log("Director de lucru", process.cwd());//Curent working directory , folderul de unde rulam aplicatia

app.set("view engine","ejs");//motorul de temp

app.use("/resurse", express.static(__dirname+"/resurse"));//fac un alias
app.use("/node_modules", express.static(__dirname+"/resurse"));//fac un alias


//app.get("/",function(req,res){
//    res.sendFile(__dirname+"/index.html")
//})

app.get(["/","/home","/index"], function(req, res){
    res.render("pagini/index", {ip: req.ip, imagini:obGlobal.obImagini.imagini});
});

app.get("/cerere", function(req,res){
    res.send("<b>Hello</b><span style='color:red'> world !</span>");
});

app.get("/data", function(req,res,next){
    res.write("Data: ");
    next();
});

app.get("/data", function(req,res){
    res.write(""+new Date());
    res.end();
});


app.get("/suma/:a/:b", function(req,res){
    var suma=parseInt(req.params.a)+parseInt(req.params.b)
    res.send(""+suma);
});

app.get("/favicon.ico", function(req, res){
    res.sendFile(path.join(__dirname, "resurse/favicon/favicon.ico"))
})

//---------------------Produse------------------//\

app.get("/produse",function(req,res){
    console.log(req.query)
    var conditieQuery="";
    if(req.query.tip){
        conditieQuery=`where tip_produs='${req.query.tip}'`
    }
    client.query("select * from unnset(enum_range(null::categ_prajituri))",function(err,rezOptiune){
        client.query(`select * from prajituri ${conditieQuery}`,function(err,rez){
        if(err){
            console,log(err);
            afisareEroare(res, 2);
        }
        else{
        res.render("pagini/produse",{produse:rez.rows,optiuni:[]})
       }
        })
    })
})

app.get("/produs/:id",function(req,res){
    client.query(`select * from prajituri where id=${req.params.id}`,function(err,rez){
        if(err){
            console.log(err);
            afisareEroare(res, 2);
        }
        else{
        res.render("pagini/produs",{prod:rez.rows[0]})
    }
    })
})


app.get("/*.ejs", function (req, res) {
    afisareEroare(res, 400);
})

app.get(new RegExp("^\/[A-Za-z\/0-9]*\/$"), function (req, res) {
    afisareEroare(res, 403);
})


app.get("/*", function (req, res) {
    //console.log(req.url)
    try {
        res.render("pagini" + req.url, function (err, rezHtml) {
            // console.log(rezHtml);
            // console.log("Eroare:" + err)
            if (err) {
                if (err.message.startsWith("Failed to lookup view")) {
                    afisareEroare(res, 404);
                    console.log("Nu a gasit pagina: ", req.url)
                }
            }
        });
    }
    catch (err1) {
        if (err1.message.startsWith("Cannot find module")) {
            afisareEroare(res, 404);
            console.log("Nu a gasit resursa: ", req.url)
        }
        else {
            afisareEroare(res);
            console.log("Eroare:" + err1)
        }
    }
})
        

function initErori(){
    var continut=fs.readFileSync(path.join(__dirname,"resurse/json/erori.json")).toString("utf-8")
    console.log(continut);

    obGlobal.obErori=JSON.parse(continut);
    for (let eroare of obGlobal.obErori.info_erori){
        eroare.imagine=path.join(obGlobal.obErori.cale_baza,eroare.imagine)
    }
    obGlobal.obErori.eroare_default=path.join(obGlobal.obErori.cale_baza,obGlobal.obErori.eroare_default.imagine)
    console.log(obGlobal.obErori);
}

initErori()

function afisareEroare(res, _identificator, _titlu, _text, _imagine){
    let eroare=obGlobal.obErori.info_erori.find(
        function(elem){
            return elem.identificator=_identificator
        }
    )
    if(!eroare){
        let eroare_default=obGlobal.obErori.eroare_default;
        res.render("eroare", {
            titlu: _titlu || eroare_default.titlu,
            text: _text || eroare_default.text,
            imagine: _imagine || eroare_default.imagine
        })//al doilea arg este locals
        return;
    }
    else{
        if(eroare.status)
            res.status(eroare.identificator)
        res.render("pagini/eroare", {
            titlu: _titlu || eroare.titlu,
            text: _text || eroare.text,
            imagine: _imagine || eroare.imagine
        })
    }
}

function initImagini(){
    var continut= fs.readFileSync(__dirname+"/resurse/json/galerie.json").toString("utf-8");


    obGlobal.obImagini=JSON.parse(continut);
    let vImagini=obGlobal.obImagini.imagini;

    let caleAbs=path.join(__dirname,obGlobal.obImagini.cale_galerie);
    let caleAbsMediu=path.join(__dirname,obGlobal.obImagini.cale_galerie, "mediu");
    if (!fs.existsSync(caleAbsMediu))
        fs.mkdirSync(caleAbsMediu);

    //for (let i=0; i< vErori.length; i++ )
    for (let imag of vImagini){
        [numeFis, ext]=imag.fisier.split(".");
        let caleFisAbs=path.join(caleAbs,imag.fisier);
        let caleFisMediuAbs=path.join(caleAbsMediu, numeFis+".webp");
        sharp(caleFisAbs).resize(300).toFile(caleFisMediuAbs);
        imag.fisier_mediu=path.join("/", obGlobal.obImagini.cale_galerie, "mediu",numeFis+".webp" )
        imag.fisier=path.join("/", obGlobal.obImagini.cale_galerie, imag.fisier )
        
    }
}
initImagini();

function compileazaScss(caleScss, caleCss){
    console.log("cale:",caleCss);
    if(!caleCss){

        let numeFisExt=path.basename(caleScss);//arata calea de baza
        let numeFis=numeFisExt.split(".")[0]   /// "a.scss"  -> ["a","scss"]
        caleCss=numeFis+".css";
    }
    
    if (!path.isAbsolute(caleScss))//daca nu e cale absoluta
        caleScss=path.join(obGlobal.folderScss,caleScss )//o sa-l concatenez la folderul scss
    if (!path.isAbsolute(caleCss))//daca nu e cale absoluta
        caleCss=path.join(obGlobal.folderCss,caleCss )//o sa-l concatenez la folderul css
    

    let caleBackup=path.join(obGlobal.folderBackup, "resurse/css");//creem calea de backup pt css
    if (!fs.existsSync(caleBackup)) {//daca nu exista
        fs.mkdirSync(caleBackup,{recursive:true})//o creem recursive:true=creeaza recursiv folderele
    }
    
    // la acest punct avem cai absolute in caleScss si  caleCss
    let numeFisCss=path.basename(caleCss);//primea o cale si returna numele fisierului cu tot cu extensia
    if (fs.existsSync(caleCss)){//daca exista
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, "resurse/css",numeFisCss ))// +(new Date()).getTime()
    }//il copiez de unde era in backup resurse css
    rez=sass.compile(caleScss, {"sourceMap":true});//va compila in css 
    fs.writeFileSync(caleCss,rez.css)//textul care e scris il pune la cale
    //console.log("Compilare SCSS",rez);
}
//compileazaScss("a.scss");
vFisiere=fs.readdirSync(obGlobal.folderScss);//citeste toate fisierele si le pune intr-un vector
for( let numeFis of vFisiere ){
    if (path.extname(numeFis)==".scss"){
        compileazaScss(numeFis);
    }
}


fs.watch(obGlobal.folderScss, function(eveniment, numeFis){//verifica daca s-a modificat fisierul
    console.log(eveniment, numeFis);
    if (eveniment=="change" || eveniment=="rename"){
        let caleCompleta=path.join(obGlobal.folderScss, numeFis);//concatem calea numelui de fisier cu cel refacut
        if (fs.existsSync(caleCompleta)){//exista
            compileazaScss(caleCompleta);
        }
    }
})


app.listen(8080);//port de ascultare
console.log("Serverul a pornit");