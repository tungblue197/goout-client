import pool from 'db';
import type { NextApiRequest, NextApiResponse } from 'next'
import { User } from 'types/global';

type Data = {
    name: string
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method === 'PUT') {
        const { user } = req.body as { user: User };
        const { locationId, name, id, locationName } = user;
        if (locationId && name) {
            const queryStr = `update users set "locationId" = $1, name = $2 ,"locationName" = $3 where id = $4`;
            const result = await pool.query(queryStr, [locationId, name, locationName, id]);
            if(result.rowCount){
                return res.status(200).json({ name: 'done'})
            }
        }
    }

    res.status(200).json({ name: 'Example' })
}