import type { NextApiRequest, NextApiResponse } from 'next'
import { pool } from 'db';
import { Session } from 'types/global';
import { v4 as uuidv4 } from 'uuid';
type Data = {
    success: boolean,
    message?: string,
    value?: any
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    try {
        if (req.method === 'POST') {
            const { session } = req.body as { session: Session };
            if (session) {
                session.id = uuidv4();
                const { id, createdBy, title, content, timeout } = session;
                const queryStr = `insert into sessions(id, "createdBy", title, content, timeout) values($1, $2, $3, $4, $5)`;
                const result = await pool.query(queryStr, [id, createdBy, title, content, timeout]);
                if (result.rowCount) {
                    return res.status(200).json({
                        success: true,
                        message: 'insert success',
                        value: session
                    })
                }
                return res.status(500).json({
                    success: false,
                    message: 'insert false'
                });
            }
            return res.status(500).json({
                success: false,
                message: 'no data'
            });
        } else if (req.method === 'GET') {
            const { createdBy } = req.query;
            if(createdBy){
                const queryStr = `select * from sessions where "createdBy" = $1`;
                const result = await pool.query(queryStr, [createdBy]);
                if(result){
                    return res.status(200).json({
                        success: true,
                        value: result.rows
                    })
                }

            }
            const queryStr = `select * from sessions`;
            const result = await pool.query(queryStr);
            if (result) {
                return res.status(200).json({ success: true, value: { data: result.rows } })
            }
        }
        return res.status(200).json({ success: false, message: 'api not found' })
    } catch (error) {
        console.log('error : ', error);
        return res.status(500).json({ success: false, message: 'server error'});
    }

}