export default class Dom {
    createMarkup(markup_name, text, parent, attributes = []) {
        const markup = document.createElement(markup_name);
        markup.textContent = text;
        parent.appendChild(markup);
        attributes.forEach((attribute) => {
            if (attribute && attribute.hasOwnProperty("name") && attribute.hasOwnProperty("value")) {
                markup.setAttribute(attribute.name, attribute.value);
            }
        })
    return markup;
    }
}