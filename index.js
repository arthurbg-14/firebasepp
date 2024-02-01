"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.querySubstring = exports.observeQueryData = exports.getQueryData = exports.observeData = exports.getData = exports.observeRefField = exports.getRefField = exports.sumQueryField = exports.countQuery = void 0;
const firestore_1 = require("@angular/fire/firestore");
const rxjs_1 = require("rxjs");
const countQuery = (query_ref) => (0, firestore_1.getCountFromServer)(query_ref).then(doc => doc.data().count);
exports.countQuery = countQuery;
const sumQueryField = (field) => (query_ref) => (0, firestore_1.getAggregateFromServer)(query_ref, { sum: (0, firestore_1.sum)(field) }).then(doc => doc.data().sum);
exports.sumQueryField = sumQueryField;
const getRefField = (doc_ref) => (field) => (0, firestore_1.getDoc)(doc_ref).then(doc => doc.get(field));
exports.getRefField = getRefField;
const observeRefField = (doc_ref) => (field) => (0, firestore_1.docSnapshots)(doc_ref).pipe((0, rxjs_1.map)(doc => doc.get(field)));
exports.observeRefField = observeRefField;
const getData = (doc_ref) => (0, firestore_1.getDoc)(doc_ref).then(doc => doc.data());
exports.getData = getData;
const observeData = (doc_ref) => (0, firestore_1.docSnapshots)(doc_ref).pipe((0, rxjs_1.map)(doc => doc.data()));
exports.observeData = observeData;
const getQueryData = (query_ref) => (0, firestore_1.getDocs)(query_ref).then(query => query.docs.map(doc => doc.data()));
exports.getQueryData = getQueryData;
const observeQueryData = (query_ref) => (0, firestore_1.collectionSnapshots)(query_ref).pipe((0, rxjs_1.map)(docs => docs.map(doc => doc.data())));
exports.observeQueryData = observeQueryData;
const querySubstring = (query_ref) => (field) => (text) => (0, firestore_1.query)(query_ref, (0, firestore_1.where)(field, '>=', text), (0, firestore_1.where)(field, '<=', text + '\uf8ff'));
exports.querySubstring = querySubstring;
