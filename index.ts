import { Query, DocumentData, getCountFromServer, getAggregateFromServer, sum, getDoc, doc, Firestore, FieldPath, DocumentReference } from '@angular/fire/firestore'

export const countQuery = <M, DB extends DocumentData>(query: Query<M, DB>) => 
    getCountFromServer(query).then(doc => doc.data().count)

export const sumQueryField = <M, DB extends DocumentData>(field: string) => 
    (query: Query<M, DB>) => 
        getAggregateFromServer(query, {sum: sum(field)}).then(doc => doc.data().sum)

export const getRefField = <M, DB extends DocumentData>(doc_ref: DocumentReference<M, DB>) => 
    (field: string | FieldPath) => getDoc(doc_ref).then(doc => doc.get(field))