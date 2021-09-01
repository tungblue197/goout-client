import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { app_domain } from 'consts/domain';
import { protectPage } from 'helpers/auth';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router';
import { Session } from 'types/global';

export default function indexPage({ sessions
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter();
    return (
        <div className='container w-11/12 md:w-8/12 shadow rounded mx-auto p-2'>
            <div className='w-full mb-2'>
                <button className='bg-purple-500 px-4 py-2 text-purple-50 rounded'>Tạo nhóm mới</button>
            </div>
            <table className="table-fixed border w-full">
                <thead>
                    <tr>
                        <th className="w-2/6 px-2 py-1 border bg-purple-500 text-purple-50">Tiêu đề</th>
                        <th className="w-3/6 px-2 py-1 border bg-purple-500 text-purple-50">Nội dung</th>
                        <th className="w-1/6 px-2 py-1 border bg-purple-500 text-purple-50">Views</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        sessions && sessions.map(s => (
                            <tr key={s.id}>
                                <td className='px-2 py-1 border'>{s.title}</td>
                                <td className='px-2 py-1 border'>{s.content}</td>
                                <td className='px-2 py-1 border text-purple-500 text-center'>
                                    <FontAwesomeIcon className='curser-pointer' icon={faEye} onClick={e => {
                                        router.push('/session/result/' + s.id);
                                    }} />
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
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
    const { uid } = ctx.req.cookies;
    const { data } = await axios.get(`${app_domain}/api/session?createdBy=${uid}`);
    return {
        props: {
            sessions: data.value as Session[]
        }
    }
}