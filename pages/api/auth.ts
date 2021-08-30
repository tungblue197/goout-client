import type { NextApiRequest, NextApiResponse } from 'next'
import { User } from 'types/global';
import {v4 as uuidv4} from 'uuid';
import bcrypt from 'bcrypt'
import db, { pool } from 'db';
type Data = {
    success: boolean,
    message?: string,
    value?:  any
}



export default async function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    if(req.method === 'POST'){
        const { user, authType } = req.body as { user: User, authType?: 'login' | 'register' };
        if(authType === 'login'){
            if(user.type === 'google'){
                const { id, photoURL, type, name } = user;
                const queryStr = `select id, "locationId" from users where id = $1 limit 1`;
                const loginResult = await db.query(queryStr, [id]);
                if(loginResult.rowCount){
                    return res.status(200).json({ success: true, message: 'login success', value: {locationId: loginResult.rows[0].locationId, id: loginResult.rows[0].id}});
                }else{
                    const queryStr = `insert into users(id, "photoURL", type, name) values($1, $2, $3, $4)`;
                    const loginResult = await db.query(queryStr, [id, photoURL, type, name]);
                    if(loginResult.rowCount){
                        return res.status(200).json({ success: true, message: 'login success', value: { id: loginResult.rows[0].id}});
                    }
                }
            }else if(user.type === 'normal'){
                const { username, password } = user;
                const queryStr = `select id, name,password, "photoURL", "locationId", type from users where username = $1 limit 1`;
                if(username && password){
                    const loginResult = await db.query(queryStr, [username]);
                    if(loginResult.rowCount){
                        const userInfo = loginResult.rows[0];
                        const isValidPassword = await bcrypt.compare(password,userInfo.password);
                        if(isValidPassword){
                            return res.status(200).json({ success: true, message: 'login success', value: { id: userInfo.id, photoURL: userInfo.photoURL, type: userInfo.type, name: userInfo.name, locationId: userInfo.locationId }});
                        }else{
                            return res.status(401).json({ success: false, message: 'Tài khoản hoạc mật khẩu không đúng'})
                        }
                    }else{
                        return res.status(401).json({ success: false, message: 'Tài khoản hoạc mật khẩu không đúng'})
                    }
                }
            }
        }else if(authType === 'register'){
            //regsiter code
            user.id = uuidv4();
            if(user.password) {
                user.password = await bcrypt.hash(user.password, 10)
            }
            const { id, username, password, name , type } = user;
            const queryStr = `insert into users (id, username, password, name, type) values($1, $2, $3, $4, $5)`;
            const result = await db.query(queryStr, [id, username, password, name, type]);
            if(result.rowCount){
                return res.status(201).json({ success: true , message: 'regsiter success',value: { id, name, type }})
            }else{
                return res.status(201).json({ success: false , message: 'regsiter false'})
            }
        }
    }
    
    return res.status(200).json({ success: false, message: 'do not thing' });
}