// doc dans classes: are they usefull?? don'tthink so
// voir autresa suppromier? eg global variables section_commune
// finir de commenter le pgm
// supprimer tous les console.log
// faire un cadre autour des données affichées


import createMarkup from "./utils/utils.js";
import CommuneArt from "./classes/Commune.js";

/**************************************************************************************** */
/*      GLOBAL VARIABLES
/**************************************************************************************** */
//const form = document.querySelector("form");

let regionMap = new Map();
let regionList = [];
let regioncode="";
let dptMap = new Map();
let dptList = [];
let dptcode ="";
let communeList = [];
let communeMap = new Map();
let communecode="";
let communeData=[];
let section_commune = document.querySelector("#communeList");

/************************************************************************************* */
/*  Create a map containing all French regions (nom+code)                              */
/************************************************************************************* */
/* - Use fetch function to get regions data from https://geo.api.gouv.fr API */
/* - fetch returns an Array of which each line is an object in the following format: */
/*      {nom: 'Île-de-France', code: '11'}                                 */
async function BuiltRegionListMap() {
    const fetchRegionArray = await fetch(`https://geo.api.gouv.fr/regions`)
        .then((response) => {
            if (response.status !== 200) {
                throw new Error("Le serveur geo.api.gouv.fr ne répond pas !");
            } else return response.json();
        })
        .then((data) => {
            return data;
        })
        .catch((error) => console.log(`Erreur attrapée : `, error));

    /* - read each line of the array returned from the fetched API to get the  */
    /*       name and the code of the region                                   */
    /* - insert the corresponding 'key-value' pair (ie nom-code) in a map      */
    /* - regionsMap contains all'key-value' pairs (nom-code) of French regions */
    for (let i = 0; i <= (fetchRegionArray.length) - 1; i++) {
        regionList[i] = fetchRegionArray[i].nom;
        regionMap.set(fetchRegionArray[i].nom, fetchRegionArray[i].code);
    }

    // juste pour verifier le resultat dans la console - a supprimer du pgm final
    console.log(regionList);
    console.log(regionMap.size);
    let regionMapList = "";
    for (const x of regionMap.entries()) {
        regionMapList += x;
        regionMapList += " | ";
    }
    console.log(regionMapList);
    console.log(regionMap.get("Occitanie"));
    // fin du block a supprimer
}
/************************************************************************************* */
/*  Create a map containing all departements (nom+code) of the selected region         */
/************************************************************************************* */
// - same as region map
// - Use fetch from https://geo.api.gouv.fr/regions/XX/departements where XX is the selected region

async function BuiltDptListMap(regioncode) {
    console.log('selectedregioncode:',regioncode);
    const fetchDptArray = await fetch(`https://geo.api.gouv.fr/regions/${regioncode}/departements`)
        .then((response) => {
            if (response.status !== 200) {
                throw new Error("Le serveur geo.api.gouv.fr ne répond pas !");
            } else return response.json();
        })
        .then((data) => {
            return data;
        })
        .catch((error) => console.log(`Erreur attrapée : `, error));

    for (let i = 0; i <= (fetchDptArray.length) - 1; i++) {
        dptList[i] = fetchDptArray[i].nom;
        dptMap.set(fetchDptArray[i].nom, fetchDptArray[i].code);
    }

    // juste pour verifier la map - a supprimer du pgm final
    //console.log(dptMap.size);
    let dptMapList = "";
    for (const x of dptMap.entries()) {
        dptMapList += x;
        dptMapList += " | ";
    }
    console.log(dptMapList);
    // fin du block a supprimer
}
/************************************************************************************* */
/*  Create a map containing all communes (nom+code) from the selected departement      */
/************************************************************************************* */
// - same as region map
// - Use fetch from https://geo.api.gouv.fr/departements/XX/communes where XX is the selected departement
async function BuiltCommuneListMap() {
    const fetchCommuneArray = await fetch(`https://geo.api.gouv.fr/departements/${dptcode}/communes`)
        .then((response) => {
            if (response.status !== 200) {
                throw new Error("Le serveur geo.api.gouv.fr ne répond pas !");
            } else return response.json();
        })
        .then((data) => {
            return data;
        })
        .catch((error) => console.log(`Erreur attrapée : `, error));

    for (let i = 0; i <= (fetchCommuneArray.length) - 1; i++) {
        communeList[i] = fetchCommuneArray[i].nom;
        communeMap.set(fetchCommuneArray[i].nom, fetchCommuneArray[i].code);
    }

    // juste pour verifier la map - a supprimer du pgm final
    //console.log(communeMap.size);
    /*
    let communeMapList = "";
    for (const x of communeMap.entries()) {
    communeMapList += x;
    communeMapList += " | ";
    }
    console.log(communeMapList);
    */
    // fin du block a supprimer
}
/************************************************************************************* */
/*  get requested data for the selected commune                                              */
/************************************************************************************* */
// - Use fetch from https://geo.api.gouv.fr/communes/XXXXX where XXXXX is the selected commune
// - The fetch will directly return an following data needs to be fetched from the API:
//   "nom":"Saussines","code":"34296","codesPostaux":["34160"],"population":1004}
async function GetCommuneData() {
    const fetchCommuneData = await fetch(`https://geo.api.gouv.fr/communes/${communecode}`)
        .then((response) => {
            if (response.status !== 200) {
                throw new Error("Le serveur geo.api.gouv.fr ne répond pas !");
            } else return response.json();
        })
        .then((data) => {
            return data;
        })
        .catch((error) => console.log(`Erreur attrapée : `, error));

        communeData = fetchCommuneData;
        // juste pour verifier les donnees dans la console - a supprimer du pgm final
        //console.log(communeData.nom);
        //console.log(communeData.code);
        //console.log(communeData.codesPostaux[0]);
        //console.log(communeData.population);
        // fin du block a supprimer
}

/**************************************************************************************** */
/*              PGM START                                                                 */
/**************************************************************************************** */
let regionSel = document.getElementById("region");
let dptSel = document.getElementById("dpt");
let communeSel = document.getElementById("commune");

/* get regions list from the gouv.fr API */
await BuiltRegionListMap();
for (let i in regionList) {
    regionSel.options[regionSel.options.length] = new Option(regionList[i], regionList[i]);
}

regionSel.onchange = async function () {
    /* get code of the selected region */
    regioncode = regionMap.get(regionSel.value);
    console.log(regionSel.value, ' | ', regioncode);
    /* empty 'departement' dropdown list */
    dptSel.length = 1;

    /* get 'departement' list from the gouv.fr API using the region code */
    await BuiltDptListMap(regioncode);
    /* display 'departement' dropdown list */
    for (let i in dptList) {
        dptSel.options[dptSel.options.length] = new Option(dptList[i],dptList[i]);
    }

    dptSel.onchange = async function () {
        /* get code of the selected 'departement' */
        dptcode = dptMap.get(dptSel.value);
        console.log(dptSel.value, ' | ', dptcode);
        /* empty 'commune' dropdown list */
        communeSel.length = 1;
        
        /* get commune' list from the gouv.fr API using the 'departement' code */
        await BuiltCommuneListMap(dptcode);
        /* display 'departement' dropdown list */
        for (let i in communeList) {
            communeSel.options[communeSel.options.length] = new Option(communeList[i],communeList[i]);
        }
   
        communeSel.onchange = async function () {
            /* get code of the selected 'commune'*/
            communecode = communeMap.get(communeSel.value);
            console.log(communeSel.value, ' | ', communecode);
                       
            /* get equested data from the selected 'commune' from the gouv.fr API using the 'commune' code */
            await GetCommuneData(communecode);
            console.log(communeData.nom, ' | ', communeData.code, ' | ', communeData.codesPostaux[0], ' | ', communeData.population);

            /* create the section where the data will be displayed */
            //const main = document.createElement('main');
            //document.body.appendChild(main);
            //const section_data = createMarkup('section', '',main);a_article);
          
            // On vide tous les éléments qui seraient déjà dans la section universities
            //section_data.innerHTML = "";

            /* display requested data from commune: nom, population, code postal */
            const main = document.createElement('main');
            document.body.appendChild(main);
            const data_section = createMarkup('section', '',main);

            const data_article = createMarkup("article", "", data_section, [
                { name: "class", value: "data-art-class" },
              ]);
            let articleTitle = createMarkup("h2", communeData.nom, data_article); 
            let articleData1 = createMarkup("h2", `Population : ${communeData.population}`, data_article);
            let articleData2 = createMarkup("h3", `Code postal : ${communeData.codesPostaux[0]}`, data_article);
            
            
            
        }
    }
}


