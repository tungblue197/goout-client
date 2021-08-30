import pool from 'db';
import type { NextApiRequest, NextApiResponse } from 'next'
import { Location, SessionLocation } from 'types/global'
import { v4 as uuidv4 } from 'uuid';

type Data = {
    name: string
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    if(req.method === 'POST'){
        const { locations, sessionId } = req.body as { locations: Location[], sessionId: string };
        let session_location:SessionLocation[] = [];
        if(locations.length){
            const valueQueryStr = locations.map(loc => {
                loc.rid = uuidv4()
                const sessionLocation :SessionLocation = { id: uuidv4(), locationId: loc.rid, sessionId};
                session_location.push(sessionLocation);
                return `('${loc.rid}','${loc.id}', ${loc.latitude}, ${loc.longitude}, '${loc.name}')`;
            }).toString();
            const slvalueQueryStr = session_location.map(sl => {
                return `('${sl.id}','${sl.locationId}', '${sl.sessionId}')`;
            }).toString();
            const queryStr = `insert into locations(rid, id,latitude,longitude,name) values${valueQueryStr}`;
            const sl_queryStr = `insert into session_location(id, "locationId", "sessionId") values${slvalueQueryStr}`
            const result = await pool.query(queryStr);
            const slResult = await pool.query(sl_queryStr);
            if(result && slResult){
                return res.status(200).json({ name: 'done ne' })
            }
        }
    }
    return res.status(200).json({ name: 'Example' })
}