export const app_domain = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_APP_DOMAIN;

export const server_domain = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : process.env.NEXT_PUBLIC_SERVER_URL;