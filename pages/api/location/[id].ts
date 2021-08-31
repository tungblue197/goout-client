import pool from 'db';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    value?: any,
    success: boolean,
    message?: string
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    if(req.method === 'GET'){
        const { id } = req.query;
        if(id){
            const queryStr = `select * from locations where id = $1 limit 1`;
            const result = await pool.query(queryStr, [id]);
            if(result.rowCount){
                return res.status(200).json({ value: result.rows[0], success: true , message: 'done'});
            }
            return res.status(404).json({ value: null , success: false });
        }
    }
    return res.status(404).json({ value: null , success: false, message: 'api notfound' });
}