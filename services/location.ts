import http from "http/http";
import { Location } from "types/global";

export const insertLocations = ({locations, sessionId}: {locations: Location[], sessionId: string}) => {
    return http.post('/location', { locations, sessionId }).then(({data}) => data);
}