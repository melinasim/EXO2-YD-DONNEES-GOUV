import Dom from "./Dom.js";
export default class CommuneArt extends Dom {
    constructor(name, codePostal, population) {
        super();
        this.name = name;
        this.codePostal = codePostal;
        this.population = population
        this.render();
    }
    render() {
        const communeArticle = this.createMarkup("article", "", document.querySelector("#communeList"),[{name:"class", value:"border p-3 col-md-3"}]);
        this.createMarkup("h2", this.name, communeArticle);
        this.createMarkup("p", this.codepostal, communeArticle);
        this.createMarkup("p", this.population, communeArticle);
    }
}