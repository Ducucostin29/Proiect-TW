
/**
 @typedef Drepturi
 @type {Object}
 @property {Symbol} vizualizareUtilizatori Dreptul de a intra pe  pagina cu tabelul de utilizatori.
 @property {Symbol} stergereUtilizatori Dreptul de a sterge un utilizator
 @property {Symbol} cumparareProduse Dreptul de a cumpara
 @property {Symbol} vizualizareGrafice Dreptul de a vizualiza graficele de vanzari
 @property {Symbol} adaugareProduse Dreptul de a adăuga produse.
 @property {Symbol} modificareProduse Dreptul de a modifica produsele existente.
 @property {Symbol} vizualizareRapoarte Dreptul de a vizualiza rapoartele.
 @property {Symbol} stergereProduse Dreptul de a șterge produse.
 @property {Symbol} adaugareUtilizatori Dreptul de a adăuga utilizatori.
 */


/**
 * @name module.exports.Drepturi
 * @type Drepturi
 */
const Drepturi = {
	vizualizareUtilizatori: Symbol("vizualizareUtilizatori"),
	stergereUtilizatori: Symbol("stergereUtilizatori"),
	cumparareProduse: Symbol("cumparareProduse"),
	vizualizareGrafice: Symbol("vizualizareGrafice"),
	adaugareProduse: Symbol("adaugareProduse"),
    modificareProduse: Symbol("modificareProduse"),
    vizualizareRapoarte: Symbol("vizualizareRapoarte"),
    stergereProduse: Symbol("stergereProduse"),
    adaugareUtilizatori: Symbol("adaugareUtilizatori")
}

module.exports=Drepturi;