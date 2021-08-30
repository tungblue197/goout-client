import pool from 'db';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    success: boolean,
    message?: string,
    value?: any
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const { id } = req.query;
    try {
        const queryStr = `select * from users where id = $1`;
        const result = await pool.query(queryStr, [id]);
        if(result){
            return res.status(200).json({ success: true, message: 'done', value: result.rows[0]});
        }
        return res.status(500).json({ message: 'empty', success: true });
    } catch (error) {
        return res.status(500).json({ message: 'server error', success: true});
    }
}