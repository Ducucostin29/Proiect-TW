
sirAlphaNum="";
v_intervale=[[48,57],[65,90],[97,122]]//Definim un array pt codurile ascii
for(let interval of v_intervale){
    for(let i=interval[0]; i<=interval[1]; i++)
        sirAlphaNum+=String.fromCharCode(i) // Pentru fiecare interval, adaugăm caracterele corespunzătoare în sirAlphaNum
}

console.log(sirAlphaNum);

function genereazaToken(n){
    let token=""
    for (let i=0;i<n; i++){
         // Generăm un caracter aleatoriu din sirAlphaNum și îl adăugăm la token
        token+=sirAlphaNum[Math.floor(Math.random()*sirAlphaNum.length)]
    }
    return token;
}

module.exports.genereazaToken=genereazaToken;