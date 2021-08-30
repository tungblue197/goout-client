import { GetServerSidePropsContext } from "next";

export const protectPage = (ctx: GetServerSidePropsContext) => {
    const { uid } = ctx.req.cookies;
    if(uid){
        return true;
    }
    return false;
}