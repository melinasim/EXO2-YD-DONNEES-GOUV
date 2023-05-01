import Dom from "./Dom.js";
export default class CommuneArt extends Dom {
    constructor(nom, codePostal, population) {
        super();
        this.nom = nom;
        this.codePostal = codePostal;
        this.population = population
        this.render();
    }
    render() {
        console.log("inside Commune.js script");
        const communeArticle = this.createMarkup("article", "", document.querySelector("#communeList"),
        [{name:"class", value:"border p-3 col-md-3"}]);
        this.createMarkup("h2", this.nom, communeArticle);
        this.createMarkup("p", this.codepostal, communeArticle);
        this.createMarkup("p", this.population, communeArticle);
    }
}