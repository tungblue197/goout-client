import pool from 'db';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    success: boolean,
    message?: string,
    value?: any
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    try {
        if (req.method === 'GET') {
            const { id } = req.query;
            if (id) {
                const queryStr = `select * from sessions where id = $1 limit 1`;
                const result = await pool.query(queryStr, [id]);
                if (result.rowCount) {
                    return res.status(200).json({ success: true, message: 'get result', value: result.rows[0] })
                }
                return res.status(404).json({ success: false, message: 'notfound item' });
            }
            return res.status(500).json({ success: false, message: 'not query' });
        }
        return res.status(404).json({ success: false, message: 'api notfound' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'server error' });
    }

}