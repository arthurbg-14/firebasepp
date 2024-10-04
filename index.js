"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectCollectionWithId = exports.injectCollection = exports.getDocsDataByIds = exports.getDocsByIds = exports.idConverter = exports.querySubstring = exports.observeQueryData = exports.getQueryData = exports.observeData = exports.getData = exports.observeRefField = exports.getRefField = exports.sumQueryField = exports.countQuery = void 0;
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
const idConverter = () => ({
    toFirestore(appModel) {
        const { id } = appModel, rest = __rest(appModel, ["id"]);
        return rest;
    },
    fromFirestore(snapshot) {
        const data = snapshot.data();
        return Object.assign(Object.assign({}, data), { id: snapshot.id });
    }
});
exports.idConverter = idConverter;
const chunkfy = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size));
const getDocsByIds = (query_ref, ids) => __awaiter(void 0, void 0, void 0, function* () {
    const chunks = chunkfy(ids, 30);
    const queries = chunks.map(chunk => (0, firestore_1.getDocs)((0, firestore_1.query)(query_ref, (0, firestore_1.where)((0, firestore_1.documentId)(), 'in', chunk))));
    return Promise.all(queries);
});
exports.getDocsByIds = getDocsByIds;
const getDocsDataByIds = (query_ref, ids) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, exports.getDocsByIds)(query_ref, ids).then(queries => queries.map(query => query.docs.map(doc => doc.data())).flat());
});
exports.getDocsDataByIds = getDocsDataByIds;
const injectCollection = (path) => (0, firestore_1.collection)((0, firestore_1.getFirestore)(), path);
exports.injectCollection = injectCollection;
const injectCollectionWithId = (path) => (0, exports.injectCollection)(path).withConverter((0, exports.idConverter)());
exports.injectCollectionWithId = injectCollectionWithId;
