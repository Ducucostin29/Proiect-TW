// Initializăm lista de produse de comparat din localStorage sau o creăm goală dacă nu există
let produseDeComparat = JSON.parse(localStorage.getItem('produseDeComparat')) || [];

// Funcție pentru adăugarea unui produs la lista de comparare
function adaugaLaComparare(idProdus, numeProdus) {
    // Verificăm dacă lista are mai puțin de 2 produse
    if (produseDeComparat.length < 2) {
        // Adăugăm produsul la lista de comparare
        produseDeComparat.push({ id: idProdus, nume: numeProdus });
        // Actualizăm containerul de comparare
        actualizeazaContainerComparare();
    } else {
        // Afișăm un mesaj de alertă dacă lista are deja 2 produse
        alert("Ștergeți un produs din lista de comparare pentru a adăuga altul.");
    }

    // Dezactivăm butoanele de comparare dacă lista are 2 sau mai multe produse
    if (produseDeComparat.length >= 2) {
        dezactiveazaButoaneleCompara();
    }

    // Salvăm lista de produse de comparat în localStorage
    localStorage.setItem('produseDeComparat', JSON.stringify(produseDeComparat));
}

// Funcție pentru ștergerea unui produs din lista de comparare
function stergeProdusComparare(index) {
    // Eliminăm produsul din listă pe baza indexului
    produseDeComparat.splice(index, 1);
    // Actualizăm containerul de comparare
    actualizeazaContainerComparare();
    // Activăm butoanele de comparare
    activeazaButoaneleCompara();
    // Salvăm lista actualizată în localStorage
    localStorage.setItem('produseDeComparat', JSON.stringify(produseDeComparat));
}

// Funcție pentru actualizarea containerului de comparare
function actualizeazaContainerComparare() {
    // Obținem referințele către elementele DOM
    const container = document.getElementById('container-comparare');
    const produseContainer = document.getElementById('produse-comparare');

    // Dacă există produse în lista de comparare
    if (produseDeComparat.length > 0) {
        container.style.display = 'block'; // Afișăm containerul de comparare
        produseContainer.innerHTML = ''; // Golim conținutul curent
        // Adăugăm fiecare produs în container
        produseDeComparat.forEach((produs, index) => {
            produseContainer.innerHTML += `
                <div>
                    <span>${produs.nume}</span>
                    <button onclick="stergeProdusComparare(${index})">Șterge</button>
                </div>
            `;
        });

        // Dacă sunt exact 3 produse, adăugăm un buton pentru afișarea comparației
        if (produseDeComparat.length === 3) {
            produseContainer.innerHTML += `<button onclick="afiseazaComparare()">Afișează</button>`;
        }
    } else {
        container.style.display = 'none'; // Ascundem containerul dacă nu sunt produse în listă
    }
}

// Funcție pentru dezactivarea butoanelor de comparare
function dezactiveazaButoaneleCompara() {
    const butoane = document.querySelectorAll('.compara-btn');
    // Dezactivăm fiecare buton și setăm titlul
    butoane.forEach(buton => {
        buton.disabled = true;
        buton.title = 'Ștergeți un produs din lista de comparare';
    });
}

// Funcție pentru activarea butoanelor de comparare
function activeazaButoaneleCompara() {
    const butoane = document.querySelectorAll('.compara-btn');
    // Activăm fiecare buton și resetăm titlul
    butoane.forEach(buton => {
        buton.disabled = false;
        buton.title = '';
    });
}

// Funcție pentru afișarea paginii de comparare
function afiseazaComparare() {
    // Verificăm dacă lista are exact 2 produse
    if (produseDeComparat.length === 2) {
        const url = `/compara?produs1=${produseDeComparat[0].id}&produs2=${produseDeComparat[1].id}`;
        window.open(url, '_blank'); // Deschidem URL-ul într-o fereastră nouă
    } else {
        alert("Adăugați două produse pentru comparare."); // Afișăm o alertă dacă nu sunt exact 2 produse
    }
}

// Adăugăm un event listener care rulează când DOM-ul este complet încărcat
document.addEventListener('DOMContentLoaded', function() {
    // Obținem produsele salvate din localStorage
    const savedComparare = localStorage.getItem('produseDeComparat');
    if (savedComparare) {
        produseDeComparat = JSON.parse(savedComparare); // Parsem produsele și le atribuim variabilei
        actualizeazaContainerComparare(); // Actualizăm containerul de comparare
        // Dezactivăm butoanele dacă sunt 2 sau mai multe produse
        if (produseDeComparat.length >= 2) {
            dezactiveazaButoaneleCompara();
        }
    }

    // Salvăm produsele în localStorage înainte de a închide sau reîncărca pagina
    window.addEventListener('beforeunload', function() {
        localStorage.setItem('produseDeComparat', JSON.stringify(produseDeComparat));
    });

    // Setăm un interval care rulează la fiecare 60 de secunde
    setInterval(function() {
        const lastUpdate = localStorage.getItem('lastUpdate');
        // Verificăm dacă ultima actualizare a fost acum mai mult de 24 de ore
        if (lastUpdate && (Date.now() - new Date(lastUpdate)) > 86400000) {
            localStorage.removeItem('produseDeComparat'); // Ștergem produsele din localStorage
            produseDeComparat = []; // Resetăm lista de produse
            actualizeazaContainerComparare(); // Actualizăm containerul de comparare
        }
    }, 60000);

    // Actualizăm timpul ultimei modificări în localStorage
    localStorage.setItem('lastUpdate', new Date());
});
