import { Query, DocumentData, getCountFromServer, getAggregateFromServer, sum, getDoc, FieldPath, DocumentReference, getDocs, query, where } from '@angular/fire/firestore'

export const countQuery = <M, DB extends DocumentData>(query_ref: Query<M, DB>) => 
    getCountFromServer(query_ref).then(doc => doc.data().count)

export const sumQueryField = <M, DB extends DocumentData>(field: string) => 
    (query_ref: Query<M, DB>) => 
        getAggregateFromServer(query_ref, {sum: sum(field)}).then(doc => doc.data().sum)

export const getRefField = <M, DB extends DocumentData>(doc_ref: DocumentReference<M, DB>) => 
    (field: string | FieldPath) => getDoc(doc_ref).then(doc => doc.get(field))

export const getData = <M, DB extends DocumentData>(doc_ref: DocumentReference<M, DB>) => 
    getDoc(doc_ref).then(doc => doc.data())

export const getQueryData = <M, DB extends DocumentData>(query_ref: Query<M, DB>) => 
    getDocs(query_ref).then(query => query.docs.map(doc => doc.data()))

export const querySubstring = <M, DB extends DocumentData>(query_ref: Query<M, DB>) => 
    (field: string) => (text: string) => query(query_ref, where(field, '>=', text), where(field, '<=', text + '\uf8ff'))