import { Query, DocumentData, getCountFromServer, getAggregateFromServer, sum } from '@angular/fire/firestore'

export const countQuery = <T, J extends DocumentData>(query: Query<T, J>) => 
    getCountFromServer(query).then(doc => doc.data().count)

export const sumQueryField = <T, J extends DocumentData>(field: string) => 
    (query: Query<T, J>) => 
        getAggregateFromServer(query, {sum: sum(field)}).then(doc => doc.data().sum)
