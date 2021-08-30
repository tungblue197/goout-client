import { protectPage } from 'helpers/auth';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'

export default function indexPage({
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <div>
            all sesssions
        </div>
    )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const isLogin = protectPage(ctx);
    if (!isLogin) {
        return {
            redirect: {
                permanent: false,
                destination: "/auth",
            },
            props: {

            }
        }
    }
    
    return {
        props: {
          
        }
    }
}