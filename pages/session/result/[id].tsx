import axios from 'axios';
import { protectPage } from 'helpers/auth';
import MainLayout from 'layouts/MainLayout';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import Modal from 'react-modal';
import Map from 'components/map';
import { modalStyle } from 'consts/modal';
import { useState } from 'react';
import { Location, Session, User } from 'types/global';
import { app_domain } from 'consts/domain';
export default function ResultPage({
    session,
    createdBy,
    location
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [showMap, setShowMap] = useState(false);
    return (
        <MainLayout>
            <div className='w-11/12 md:w-8/12 mx-auto border  my-4 shadow-2xl rounded-xl'>
                <div className='p-4 space-y-2'>
                    <div className='flex'>
                        <span className='w-3/12 text-sm text-purple-500'>Tạo bởi : </span>
                        <div className='text-sm text-gray-500'>{createdBy?.name}</div>
                    </div>
                    <div className='flex'>
                        <span className='w-3/12 text-sm text-purple-500'>Tiêu đề : </span>
                        <div className='text-sm text-gray-500'>{session?.title}</div>
                    </div>
                    <div className='flex'>
                        <span className='w-3/12 text-sm text-purple-500'>Nội dung : </span>
                        <div className='text-sm text-gray-500'>{session?.content}</div>
                    </div>
                </div>
                <div className='py-4'>
                    <div className='text-center'>
                        <span className='text-purple-500 uppercase font-semibold'>Địa điểm được chọn</span>
                        <div className='text-gray-500 font-semibold'>{location?.name}</div>
                        <button onClick={e => setShowMap(true)} className='px-4 py-2 rounded shadow-xl bg-purple-500 text-purple-50 text-sm hover:bg-purple-400 mt-2'>Xem địa điểm trên map</button>
                    </div>
                </div>
            </div>
            
            <Modal ariaHideApp={false} style={modalStyle} isOpen={showMap}>
                <Map onMapClose={() => setShowMap(false)} _pickedLocations={location ? [location] : []} rectFromMe={true} />
            </Modal>
        </MainLayout>
    )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const appDomain = app_domain;
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
    // //--------> get page result <----------
    const { id } = ctx.query;
    //lấy session với id
    if(id){
        const sessionResult = await axios.get(`${appDomain}/api/session/${id}`);
        const session = sessionResult.data.value as Session
        const userResult = await axios.get(`${appDomain}/api/user/${session?.createdBy}`);
        const createdBy = userResult.data.value as User;
        const locationResult = await axios.get(`${appDomain}/api/location/${session?.winner}`)
        console.log('user result : ', userResult.data.value);
        console.log('location result : ', locationResult.data);
        return {
            props: {
                session,
                createdBy,
                location: locationResult.data.value as Location
            }
        }
    }
    return {
        props: {
            
        }
    }
}