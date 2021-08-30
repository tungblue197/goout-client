import http from "http/http"
import { User } from "types/global"

export const updateUser = async (user: User, id: string) => {
    return await http.put('/user', { user, id }).then(({data}) => data);
}