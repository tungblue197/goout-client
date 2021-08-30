import pool from 'db'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    message?: string,
    success:boolean,
    value?: any
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    const { sessionId } = req.body;
    if(req.method === 'POST'){
        if(!sessionId) return res.status(200).json({  success: true, message: 'empty', value: { data : [] }})
        const slQueryStr = `select loc.* from session_location as sl left join locations as loc on sl."locationId" = loc.rid where sl."sessionId" = $1`;
        const result = await pool.query(slQueryStr, [sessionId]);
        return res.status(200).json({ success: true, value: { data : result.rows } });
    }
    return res.status(500).json({ success: false,message: 'server error' });
}