window.onload = function() {
    const selectElement = document.getElementById('tip-echipament');
    for (let option of selectElement.options) {
        option.selected = true;
    }
}

window.addEventListener("load",function(){
    console.log(document.getElementById("produse").innerHTML)
})

window.addEventListener("load",function(){
    document.getElementById("inp-pret-min").onchange=function(){
        document.getElementById("infoRangeMin").innerHTML=`(${this.value})`
    }
    document.getElementById("inp-pret-max").onchange=function(){
        document.getElementById("infoRangeMax").innerHTML=`(${this.value})`
    }


    //document.getElementById("filtrare").addEventListener("click",function(){})
    document.addEventListener("DOMContentLoaded", function() {
        document.getElementById("filtrare").onclick = function() {
            var inpNume = document.getElementById("inp-nume").value.toLowerCase().trim();
            var materiale = document.getElementById("materiale").value.toLowerCase().trim().split(",").map(item => item.trim());
            var inpPretMin = parseInt(document.getElementById("inp-pret-min").value);
            var inpPretMax = parseInt(document.getElementById("inp-pret-max").value);
    
            var radioMasura = document.getElementsByName("gr_rad");
            var inpMasura;
            for (let rad of radioMasura) {
                if (rad.checked) {
                    inpMasura = rad.value;
                    break;
                }
            }
            var minMasura, maxMasura;
            if (inpMasura != "toate") {
                var vInl = inpMasura.split(":");
                minMasura = parseInt(vInl[0]);
                maxMasura = parseInt(vInl[1]);
            }
    
            var asambalt = document.getElementById("garan").checked;
            var neasambalt = document.getElementById("no_garan").checked;
    
            var produse = document.getElementsByClassName("produs");
    
            for (let produs of produse) {
                let valNume = produs.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase().trim();
                let cond1 = matchPattern(valNume, inpNume);
    
                let valMasura = parseInt(produs.getElementsByClassName("val-masura")[0].innerHTML);
                let cond2 = (inpMasura == "toate" || (valMasura >= minMasura && valMasura < maxMasura));
    
                let valPret = parseInt(produs.getElementsByClassName("val-pret")[0].innerHTML);
                let cond3 = (valPret >= inpPretMin && valPret <= inpPretMax);
    
                let valGarantie = produs.getElementsByClassName("val-garantie")[0].innerHTML.toLowerCase().trim() == "da";
                let cond4 = (asambalt && valGarantie) || (neasambalt && !valGarantie) || (asambalt && neasambalt);
    
                let valMateriale = produs.getElementsByClassName("val-materiale")[0].innerHTML.toLowerCase().split(",").map(item => item.trim());
                let cond5 = materiale.every(mat => valMateriale.includes(mat) || mat == "");
    
                if (cond1 && cond2 && cond3 && cond4 && cond5) {
                    produs.style.display = "block";
                } else {
                    produs.style.display = "none";
                }
            }
        };
    
        document.getElementById("resetare").onclick = function() {
            document.getElementById("inp-nume").value = "";
            document.getElementById("materiale").value = "";
            document.getElementById("inp-pret-min").value = 0;
            document.getElementById("inp-pret-max").value = 1000;
            document.getElementById("i_rad4").checked = true;
            document.getElementById("garan").checked = true;
            document.getElementById("no_garan").checked = true;
    
            var produse = document.getElementsByClassName("produs");
            for (let produs of produse) {
                produs.style.display = "block";
            }
        };
    
        document.getElementById("inp-pret-min").oninput = function() {
            document.getElementById("infoRangeMin").innerHTML = `(${this.value})`;
        };
    
        document.getElementById("inp-pret-max").oninput = function() {
            document.getElementById("infoRangeMax").innerHTML = `(${this.value})`;
        };
    
        function matchPattern(string, pattern) {
            var regex = new RegExp("^" + pattern.split("*").map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join(".*") + "$", "gi");
            return string.match(regex);
        }
    });
    
    document.getElementById("resetare").onclick = function() {
        var confirmReset = confirm("Ești sigur că vrei să resetezi filtrele?");
    
        if (confirmReset) {
            document.getElementById("inp-nume").value = ""; 
            document.getElementById("materiale").value="";
            document.getElementById("inp-pret-min").value=document.getElementById("inp-pret-min").min;
            document.getElementById("inp-pret-max").value=document.getElementById("inp-pret-max").max;
            document.getElementById("inpCateg").value="toate"               
            document.getElementById("i_rad4").checked = true;        
            var produse = document.getElementsByClassName("produs");        
            document.getElementById("infoRangeMin").innerHTML = "(0)";
            document.getElementById("infoRangeMax").innerHTML="(3000)";        
            for (let prod of produse) {            
                prod.style.display = "block";        
            }
            var rads=document.getElementsByName("gr_rad");
            for(let rad of rads){
                if(rad.checked) {
                    rad.checked;
                }
            }
            rads[3].checked;
        }
    }

    function sorteaza(semn){
        var produse=document.getElementsByClassName("produs");
        var v_produse=Array.from(produse)
        v_produse.sort(function(a,b){
            let pret_a=parseInt(a.getElementsByClassName("val-pret")[0].innerHTML)
            let pret_b=parseInt(b.getElementsByClassName("val-pret")[0].innerHTML)
            if(pret_a==pret_b){
                let nume_a=a.getElementsByClassName("val-nume")[0].innerHTML
                let nume_b=b.getElementsByClassName("val-nume")[0].innerHTML
                return semn*nume_a.localeCompare(nume_b);
            }
            return semn*(pret_a-pret_b);
        })
        console.log(v_produse)
        for(let prod of v_produse){
            prod.parentNode.appendChild(prod)
        }
    }

    document.getElementById("sortCrescNume").onclick=function(){
        sorteaza(1)
    }

    document.getElementById("sortDescrescNume").onclick=function(){
        sorteaza(-1)
    }

    document.getElementById("b-suma").onclick=function(){
        var suma=0;
        var produse=document.getElementsByClassName("produs");
        for (let produs of produse){
            var stil=getComputedStyle(produs)
            if (stil.display!="none"){
                suma+=parseFloat(produs.getElementsByClassName("val-pret")[0].innerHTML)
            }
        }
        if (!document.getElementById("par_suma")){
            let p= document.createElement("div")
            p.innerHTML=suma;
            p.id="par_suma";
            container=document.getElementById("produse")
            container.insertBefore(p,container.children[0])
            setTimeout(function(){
                var pgf=document.getElementById("par_suma")
                if(pgf)
                    pgf.remove()
            }, 2000)
        }
    }
function matchPattern(str, pattern) {
    // Înlocuim caracterul "*" din șablon cu o expresie regulată care să înlocuiască orice caractere
    var regexPattern = pattern.replace(/\*/g, ".*");

    // Creăm o expresie regulată pe baza șablonului modificat
    var regex = new RegExp(regexPattern);

    // Verificăm dacă șirul se potrivește cu expresia regulată
    return regex.test(str);
}


})
