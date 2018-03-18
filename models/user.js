var shemas = require("./schemas/user.schema");
var _ = require("lodash");

var User = function (data) {
    this.data = this.sanitize(data);
}

User.prototype.sanitize = function (data) {
    data = data || {};
    schema = shemas.user;
    return _.pick(_.defaults(data, schema), _.keys(schema));
}

module.exports = User;