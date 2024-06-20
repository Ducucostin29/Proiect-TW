const {Client, Pool} = require("pg"); // Importă clasele Client și Pool din pachetul pg pentru a lucra cu PostgreSQL

// Definirea clasei AccesBD ca singleton
class AccesBD {
    // Proprietăți statice private
    static #instanta = null;
    static #initializat = false;

    // Constructorul este protejat pentru a preveni instanțierea directă
    constructor() {
        if(AccesBD.#instanta){
            throw new Error("Deja a fost instantiat"); // Aruncă eroare dacă instanța deja există
        } else if(!AccesBD.#initializat){
            throw new Error("Trebuie apelat doar din getInstanta; fara sa fi aruncat vreo eroare"); // Aruncă eroare dacă nu este inițializat corect
        }
    }

    // Metodă pentru inițializarea conexiunii locale la baza de date
    initLocal(){
        this.client = new Client({
            database: "cti_2024",
            user: "alexandru",
            password: "alexandru",
            host: "localhost",
            port: 5432
        });
        // Se poate folosi și Pool pentru conexiuni multiple
        // this.client2 = new Pool({
        //     database: "laborator",
        //     user: "irina",
        //     password: "irina",
        //     host: "localhost",
        //     port: 5432
        // });
        this.client.connect(); // Conectează clientul la baza de date
    }

    // Metodă pentru a obține clientul conectat
    getClient(){
        if(!AccesBD.#instanta){
            throw new Error("Nu a fost instantiata clasa"); // Aruncă eroare dacă clasa nu a fost instanțiată
        }
        return this.client;
    }

    /**
     * @typedef {object} ObiectConexiune - obiect primit de functiile care realizeaza un query
     * @property {string} init - tipul de conexiune ("init", "render" etc.)
     */

    /**
     * Returneaza instanta unica a clasei
     *
     * @param {ObiectConexiune} init - un obiect cu datele pentru query
     * @returns {AccesBD}
     */
    static getInstanta({init = "local"} = {}){
        console.log(this); // this-ul e clasa, nu instanța, pt că metoda e statică
        if(!this.#instanta){
            this.#initializat = true;
            this.#instanta = new AccesBD();

            // Inițializarea poate arunca erori
            // Adăugăm cazurile de inițializare pentru baza de date cu care vrem să lucrăm
            try{
                switch(init){
                    case "local":
                        this.#instanta.initLocal();
                }
                // Dacă ajunge aici, înseamnă că nu s-a produs eroare la inițializare
            } catch (e){
                console.error("Eroare la initializarea bazei de date!");
            }
        }
        return this.#instanta;
    }

    /**
     * @typedef {object} ObiectQuerySelect - obiect primit de functiile care realizeaza un query
     * @property {string} tabel - numele tabelului
     * @property {string[]} campuri - o lista de stringuri cu numele coloanelor afectate de query; poate cuprinde si elementul "*"
     * @property {string[]} conditiiAnd - lista de stringuri cu conditii pentru where
     */

    /**
     * Callback pentru query-uri.
     * @callback QueryCallBack
     * @param {Error} err Eventuala eroare în urma query-ului
     * @param {Object} rez Rezultatul query-ului
     */
    /**
     * Selectează înregistrări din baza de date
     *
     * @param {ObiectQuerySelect} obj - un obiect cu datele pentru query
     * @param {QueryCallBack} callback - o funcție callback cu 2 parametri: eroare și rezultatul query-ului
     */
    select({tabel = "", campuri = [], conditiiAnd = []} = {}, callback, parametriQuery = []){
        let conditieWhere = "";
        if(conditiiAnd.length > 0)
            conditieWhere = `where ${conditiiAnd.join(" and ")}`;
        let comanda = `select ${campuri.join(",")} from ${tabel} ${conditieWhere}`;
        console.error(comanda);
        // Execută comanda SQL
        this.client.query(comanda, parametriQuery, callback);
    }

    // Metodă asincronă pentru selectarea înregistrărilor din baza de date
    async selectAsync({tabel = "", campuri = [], conditiiAnd = []} = {}){
        let conditieWhere = "";
        if(conditiiAnd.length > 0)
            conditieWhere = `where ${conditiiAnd.join(" and ")}`;
        
        let comanda = `select ${campuri.join(",")} from ${tabel} ${conditieWhere}`;
        console.error("selectAsync:", comanda);
        try {
            let rez = await this.client.query(comanda);
            console.log("selectasync: ", rez);
            return rez;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    // Metodă pentru inserarea înregistrărilor în baza de date
    insert({tabel = "", campuri = {}} = {}, callback){
        /*
        campuri={
            nume: "savarina",
            pret: 10,
            calorii: 500
        }
        */
        console.log("-------------------------------------------");
        console.log(Object.keys(campuri).join(","));
        console.log(Object.values(campuri).join(","));
        let comanda = `insert into ${tabel}(${Object.keys(campuri).join(",")}) values (${Object.values(campuri).map((x) => `'${x}'`).join(",")})`;
        console.log(comanda);
        // Execută comanda SQL
        this.client.query(comanda, callback);
    }

    /**
     * @typedef {object} ObiectQueryUpdate - obiect primit de functiile care realizeaza un query
     * @property {string} tabel - numele tabelului
     * @property {object} campuri - un obiect cu perechi de valori campuri/valori
     * @property {string[]} conditiiAnd - lista de stringuri cu conditii pentru where
     */
    // Metodă pentru actualizarea înregistrărilor din baza de date
    update({tabel = "", campuri = {}, conditiiAnd = []} = {}, callback, parametriQuery){
        let campuriActualizate = [];
        for(let prop in campuri)
            campuriActualizate.push(`${prop}='${campuri[prop]}'`);
        let conditieWhere = "";
        if(conditiiAnd.length > 0)
            conditieWhere = `where ${conditiiAnd.join(" and ")}`;
        let comanda = `update ${tabel} set ${campuriActualizate.join(", ")} ${conditieWhere}`;
        console.log(comanda);
        // Execută comanda SQL
        this.client.query(comanda, callback);
    }

    // Metodă parametrizată pentru actualizarea înregistrărilor din baza de date
    /*updateParametrizat({tabel = "", campuri = [], valori = [], conditiiAnd = []} = {}, callback, parametriQuery){
        if(campuri.length != valori.length)
            throw new Error("Numarul de campuri difera de nr de valori");
        let campuriActualizate = [];
        for(let i = 0; i < campuri.length; i++)
            campuriActualizate.push(`${campuri[i]}=$${i+1}`);
        let conditieWhere = "";
        if(conditiiAnd.length > 0)
            conditieWhere = `where ${conditiiAnd.join(" and ")}`;
        let comanda = `update ${tabel} set ${campuriActualizate.join(", ")} ${conditieWhere}`;
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1111", comanda);
        // Execută comanda SQL
        this.client.query(comanda, valori, callback);
    }*/

    // Metodă pentru ștergerea înregistrărilor din baza de date
    delete({tabel = "", conditiiAnd = []} = {}, callback){
        let conditieWhere = "";
        if(conditiiAnd.length > 0)
            conditieWhere = `where ${conditiiAnd.join(" and ")}`;
        
        let comanda = `delete from ${tabel} ${conditieWhere}`;
        console.log(comanda);
        // Execută comanda SQL
        this.client.query(comanda, callback);
    }

    // Metodă generală pentru executarea unei comenzi SQL
    query(comanda, callback){
        this.client.query(comanda, callback);
    }
}

// Exportă clasa AccesBD pentru a fi utilizată în alte module
module.exports = AccesBD;
