import http from "http/http";
import { User } from "types/global";

export const login = (user: User) => {
    return http.post('/auth', { user, authType: 'login' })
    .then(({data}) => {
       return data;
    })    
}

export const register = (user: User) => {
    return http.post('/auth', { user, authType: 'register' })
    .then(({data}) => {
       return data;
    }) 
}