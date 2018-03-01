var shemas = require("./schemas/ingredient.schema");
var _ = require("lodash");

var Ingredient = function (data) {
    this.data = this.sanitize(data);
}

Ingredient.prototype.sanitize = function (data) {
    data = data || {};
    schema = shemas.ingredient;
    return _.pick(_.defaults(data, schema), _.keys(schema));
}

Ingredient.prototype.update = function (callback) {
    let self = this;
    this.data = this.sanitize(this.data);
    return (null,"not finish")
}

module.exports = Ingredient;