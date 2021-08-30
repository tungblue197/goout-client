import http from "http/http";
import { Session } from "types/global";

export const insertSession = (s: Session) => {
    return http.post('/session', { session: s }).then(({data}) => data);
}

export const getSessions = () => {
    return http.get('/session').then(({data}) => data);
}

export const getSesssionById = (id: string) => {
    return http.get('/session/' + id).then(({data}) => data);
}