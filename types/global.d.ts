declare type User = {
    id?: string,
    username?: string;
    password?: string;
    tId?: string;
    name?: string;
    photoURL?: string;
    location?: Location,
    locationName?: string,
    type?: 'normal' | 'google',
    locationId?: string 
}

export type Location = {
    rid?: string, 
    longitude: number,
    latitude: number,
    id: string,
    name: string,
}

export type Session = {
    createdBy?: string,
    id?: string,
    title?: string,
    content?: string,
    done?: boolean,
    winner?: string,
    timeout?: number
}



export type SessionLocation = {
    id?: string,
    sessionId?: string,
    locationId?: string
}

