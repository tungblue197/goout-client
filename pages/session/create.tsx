import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import MainLayout from 'layouts/MainLayout'
import { useRouter } from 'next/dist/client/router'
import Modal from 'react-modal';
import Map from 'components/map';
import { modalStyle } from 'consts/modal';
import { useState } from 'react';
import { Location, Session } from 'types/global';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { insertSession } from 'services/session';
import { useCookies } from 'react-cookie';
import { insertLocations } from 'services/location';
import { protectPage } from 'helpers/auth';

export default function CreatePage({

}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter();
    const [cookies] = useCookies();
    const [showMap, setShowMap] = useState(false);
    const [locations, setLocations] = useState<Location[]>([]);
    const {
        register,
        handleSubmit
    } = useForm<Session>();

    const handleSubmitSession = (value: Session) => {
        value.createdBy = cookies.uid;
        value.timeout = Number(value.timeout);
        session.mutate(value);
    }



    const session = useMutation(insertSession, {
        onSettled: ({ value }: any, ctx) => {
            locationM.mutate({locations,sessionId: value.id});
            router.replace('/session/' + value.id);
        },
    });

    const locationM = useMutation(insertLocations);

    return (
        <MainLayout>
            <div className="w-11/12 border mx-auto my-4 shadow-xl bg-white rounded-xl p-2">
                <div className="flex w-full justify-between items-center ">
                    <div>
                        <button
                            onClick={e => router.replace('/user')}
                            className="px-4 w-full py-2 text-sm bg-white text-purple-500 rounded border border-purple-300 shadow-sm hover:bg-purple-400 hover:text-gray-50">
                            <i className="fas fa-arrow-left mr-1"></i> Trở lại</button>
                    </div>

                    <div className="">
                        <button
                            onClick={e => {
                                e.preventDefault()
                                handleSubmit(handleSubmitSession)();
                            }}
                            className="px-4 w-full py-2 text-sm bg-purple-500 text-purple-50 rounded shadow-sm hover:bg-purple-400">
                            Tạo nhóm <i className="fas fa-plus ml-1"></i></button>
                    </div>
                </div>
                <form action="" className="px-4 my-6">
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between flex-wrap">
                            <label className="text-sm text-gray-600 w-full sm:w-4/12 md:w-2/12 ">
                                Têu đề <span className="text-red-300">(*)</span>
                            </label>
                            <input {...register('title', { required: 'Dữ liệu bắt buộc' })} placeholder="Đi chơi đâu đó?"
                                className="flex-1 w-full outline-none px-4 py-2 border-gray-300 border rounded placeholder-gray-300 text-sm focus:border-blue-300 my-2 ml-0 md:ml-2" />
                        </div>
                        <div className="flex items-center justify-between flex-wrap">
                            <label className="text-sm text-gray-600 w-full sm:w-4/12 md:w-2/12 self-auto sm:self-start mt-3">
                                Nội dung <span className="text-red-300">(*)</span>
                            </label>
                            <textarea
                                {...register('content', { required: 'Dữ liệu bắt buộc' })}
                                placeholder="Lý do tại sao đi"
                                className="flex-1 w-full outline-none px-4 py-2 border-gray-300 border rounded placeholder-gray-300 text-sm focus:border-blue-300 my-2 ml-0 md:ml-2 h-20"></textarea>
                        </div>
                        <div className="flex items-center justify-between flex-wrap">
                            <label className="text-sm text-gray-600 w-full sm:w-4/12 md:w-2/12 self-auto sm:self-start mt-3">
                                Thời gian vote <span className="text-red-300">(*)</span> (phút)
                            </label>
                            <div className='flex justify-start flex-1 ml-2'>
                                <input {...register('timeout', { required: 'Dữ liệu bắt buộc' })} type="number" max={30} min={1} className='border outline-none px-1 py-1 w-20 rounded self-start' placeholder='0' />
                            </div>
                        </div>
                        <div className="flex items-center justify-between flex-wrap">
                            <div className="w-full sm:w-4/12 md:w-2/12 mb-2 sm:mb-0 self-start mt-2">
                                <button
                                    onClick={e => {
                                        e.preventDefault();
                                        setShowMap(true);
                                    }}
                                    className="px-4 w-full py-2 text-sm bg-purple-500 text-purple-50 rounded shadow-sm hover:bg-purple-400">
                                    Chọn địa điểm <i className="fas fa-map-marked-alt ml-1"></i></button>
                            </div>
                            <div className="flex-1 w-full ml-0 md:ml-2">
                                {
                                    !locations.length ? (
                                        <div className="">
                                            <div className="flex flex-col items-center text-gray-400 py-4">
                                                <i className="fas fa-map text-3xl"></i>
                                                <span className="text-sm">Chưa có địa điểm nào</span>
                                            </div>
                                        </div>
                                    ) : locations.map((loc) => {
                                        return (
                                            <div key={loc.rid} className="flex justify-between items-center p-1 border-b border-purple-300 mb-2 ">
                                                <div className="flex-1">
                                                    <i className="fas fa-map-marker-alt text-pink-400"></i>
                                                    <span className="ml-2 text-gray-500 texm-sm">{loc.name}</span>
                                                </div>
                                                <div>
                                                    <button><i className="fas fa-map-marked text-blue-400"></i></button>
                                                    <button><i className="fas fa-trash-alt text-red-400 ml-2"></i></button>
                                                </div>
                                            </div>
                                        )
                                    })
                                }


                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <Modal ariaHideApp={false} style={modalStyle} isOpen={showMap}>
                <Map onMapClose={() => setShowMap(false)} _pickedLocations={locations} onLocationsChanged={(loc) => {
                    setLocations(loc);
                    setShowMap(false);
                }} />
            </Modal>
        </MainLayout>
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