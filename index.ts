import { Query, DocumentData, getCountFromServer, getAggregateFromServer, sum, getDoc, FieldPath, DocumentReference, getDocs, query, where, docSnapshots, collectionSnapshots, QueryDocumentSnapshot } from '@angular/fire/firestore'
import { map } from 'rxjs'

export const countQuery = <M, DB extends DocumentData>(query_ref: Query<M, DB>) => 
    getCountFromServer(query_ref).then(doc => doc.data().count)

export const sumQueryField = <M, DB extends DocumentData>(field: string) => 
    (query_ref: Query<M, DB>) => 
        getAggregateFromServer(query_ref, {sum: sum(field)}).then(doc => doc.data().sum)

export const getRefField = <M, DB extends DocumentData>(doc_ref: DocumentReference<M, DB>) => 
    (field: string | FieldPath) => getDoc(doc_ref).then(doc => doc.get(field))

export const observeRefField = <M, DB extends DocumentData>(doc_ref: DocumentReference<M, DB>) => 
    (field: string | FieldPath) => docSnapshots(doc_ref).pipe(map(doc => doc.get(field)))

export const getData = <M, DB extends DocumentData>(doc_ref: DocumentReference<M, DB>) => 
    getDoc(doc_ref).then(doc => doc.data())

export const observeData = <M, DB extends DocumentData>(doc_ref: DocumentReference<M, DB>) => 
    docSnapshots(doc_ref).pipe(map(doc => doc.data()))

export const getQueryData = <M, DB extends DocumentData>(query_ref: Query<M, DB>) => 
    getDocs(query_ref).then(query => query.docs.map(doc => doc.data()))

export const observeQueryData = <M, DB extends DocumentData>(query_ref: Query<M, DB>) => 
    collectionSnapshots(query_ref).pipe(map(docs => docs.map(doc => doc.data())))

export const querySubstring = <M, DB extends DocumentData>(query_ref: Query<M, DB>) => 
    (field: string) => (text: string) => query(query_ref, where(field, '>=', text), where(field, '<=', text + '\uf8ff'))

export const idConverter = {
    toFirestore<A extends DocumentData & {id: string}>(appModel: A): Omit<A, 'id'> {
        const {id, ...rest} = appModel
        return rest
    },
    fromFirestore<A extends {id: string}>(snapshot: QueryDocumentSnapshot): A {
      const data = snapshot.data()! as A
      return {...data, id: snapshot.id}
    }
  };
  