var shemas = require("./schemas/recipe.schema");
var _ = require("lodash");

var Recipe = function (data) {
    this.data = this.sanitize(data);
}

Recipe.prototype.sanitize = function (data) {
    data = data || {};
    schema = shemas.recipe;
    return _.pick(_.defaults(data, schema), _.keys(schema));
}

module.exports = Recipe;