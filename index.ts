import { Query, DocumentData, getCountFromServer, getAggregateFromServer, sum, getDoc, FieldPath, DocumentReference, getDocs, query, where, docSnapshots, collectionSnapshots, QueryDocumentSnapshot, documentId, collection, CollectionReference, getFirestore } from '@angular/fire/firestore'
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

export const idConverter = <A>() => ({
    toFirestore(appModel:  A & {id: string}): Omit<A, 'id'> {
        const {id, ...rest} = appModel
        return rest
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): A & {id: string} {
      const data = snapshot.data()! as A
      return {...data, id: snapshot.id}
    }
  });

const chunkfy = <T>(arr: T[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

export const getDocsByIds = <M, DB extends DocumentData>(query_ref: Query<M, DB>) => (ids: string[]) => 
  Promise.all(
    chunkfy(ids, 30).map(chunk => getDocs(query(query_ref, where(documentId(), 'in', chunk))))
  )
  
export const getDocsDataByIds = <M, DB extends DocumentData>(query_ref: Query<M, DB>) => (ids: string[]) => 
  getDocsByIds(query_ref)(ids).then(queries => 
    queries.map(query => query.docs.map(doc => doc.data())).flat())

export const getDocsByIdsUnique = async <M, DB extends DocumentData>(query_ref: Query<M, DB>) => (ids: string[]) => 
  getDocsDataByIds(query_ref)([...new Set(ids)])

export const getDocsDataByIdsUnique = async <M, DB extends DocumentData>(query_ref: Query<M, DB>) => (ids: string[]) => 
  getDocsDataByIds(query_ref)([...new Set(ids)])

export const injectCollection = <Model>(path: string) => collection(getFirestore(), path) as CollectionReference<Model, DocumentData>
export const injectCollectionWithId = <Model>(path: string) => injectCollection<Model>(path).withConverter(idConverter<Model>())
