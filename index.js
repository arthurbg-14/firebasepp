"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sumQueryField = exports.countQuery = void 0;
var firestore_1 = require("@angular/fire/firestore");
var countQuery = function (query) {
    return (0, firestore_1.getCountFromServer)(query).then(function (doc) { return doc.data().count; });
};
exports.countQuery = countQuery;
var sumQueryField = function (field) {
    return function (query) {
        return (0, firestore_1.getAggregateFromServer)(query, { sum: (0, firestore_1.sum)(field) }).then(function (doc) { return doc.data().sum; });
    };
};
exports.sumQueryField = sumQueryField;
