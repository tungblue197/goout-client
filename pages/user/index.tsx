import MainLayout from 'layouts/MainLayout'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query';
import { User } from 'types/global';
import { useCookies } from 'react-cookie';
import { protectPage } from 'helpers/auth';
import Modal from 'react-modal';
import Map from 'components/map';
import { useState } from 'react';
import { modalStyle } from 'consts/modal';
import { Location } from 'types/global';
import http from 'http/http';
import { useRouter } from 'next/dist/client/router'; 
import ReactLoading from "react-loading";


export default function UserPage({

}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter();
    const [cookies, setCookie] = useCookies();
    const { handleSubmit, register, formState: { errors }, clearErrors } = useForm<User>({
        defaultValues: {
            name: cookies.displayName
        }
    });
    const [locations, setLocations] = useState<Location[]>();
    const [showMap, setShowMap] = useState(false);

    const updateUser = (user: User) => {
        return http.put('/user', { user }).then(({ data }) => data);
    }
    const { mutate, isLoading } = useMutation(updateUser, {
        onSuccess: (e, ctx) => {
            if (locations?.length) {
                setCookie('log', locations[0].longitude);
                setCookie('lat', locations[0].latitude);
            }
            setCookie('locationId', ctx.locationId);
            setCookie('locationName', ctx.locationName);
            setCookie('displayName', ctx.name);
            router.push('/session/create');
        },
    })

    const handleSubmitUser = (user: User) => {
        const id = cookies.uid;
        user.id = id;
        if (locations?.length) {
            user.locationId = locations[0].id;
            user.locationName = locations[0].name;
        }
        mutate(user);
    }
    return (
        <>
            <div className="w-11/12 border mx-auto my-4 shadow-xl bg-white rounded-xl p-2">
                <div className="flex w-full justify-between items-center">
                    <span className="text-sm text-gray-500 block ml-4 ">Nhập thông tin của bạn</span>
                    <div className="">
                        <button
                            onClick={e => {
                                if(isLoading) return;
                                handleSubmit(handleSubmitUser)();
                            }}
                            className="px-4 w-full py-2 text-sm bg-purple-500 text-purple-50 rounded shadow-sm hover:bg-purple-400"> {!isLoading ? <span>Tiếp
                                tục <i className="fas fa-arrow-right ml-1" aria-hidden={'true'}></i></span> : <div className='bg-purple-400'> < ReactLoading color={'#eee'} type='bubbles' width={20} height={20}  /></div>  }  </button>
                    </div>
                </div>
                <form action="" className="flex  px-4 my-6 flex-wrap">
                    <div className="flex items-center w-full flex-wrap md:space-x-2 ">
                        <label className="block text-gray-500 text-sm self-start pt-2 w-full md:w-5/12 lg:w-4/12 xl:w-3/12 ">
                            Tên của bạn <span className="text-xs text-red-400">(*)</span>
                        </label>
                        <div className='flex flex-col flex-1'>
                            <input placeholder="VD: TungPV" type="text"
                                className="w-full outline-none px-4 py-2 border-gray-300 border rounded placeholder-gray-300 text-sm focus:border-blue-300 my-2" {...register('name', { required: 'Bạn bắt buộc phải nhập tên' })} />
                            <div className="error text-red-300 text-xs w-full h-6 align-middle">{errors.name?.message}</div>
                        </div>
                    </div>
                    <div className="flex items-between w-full md:space-x-2  flex-wrap">
                        <div className="block w-full md:w-5/12 lg:w-4/12 xl:w-3/12 self-start mt-2" >
                            <button
                                onClick={e => {
                                    e.preventDefault();
                                    setShowMap(true);
                                }}
                                className="px-4 w-full py-2 text-sm bg-purple-500 text-purple-50 rounded shadow-sm hover:bg-purple-400">Chọn địa điểm của bạn <i className="fas fa-map-marked-alt ml-1" aria-hidden={'true'}></i></button>
                        </div>
                        <div className='flex-1 flex flex-wrap'>
                            <input type="text" value={locations?.length ? locations[0].name : undefined} readOnly {...register('locationName')} className="w-full outline-none px-4 py-2 border-gray-300 border rounded placeholder-gray-300 text-sm focus:border-blue-300 my-2" />
                            <div className="error text-red-300 text-xs w-full h-6 align-middle">{errors.locationName?.message}</div>
                        </div>
                    </div>
                </form>
            </div>
            <Modal ariaHideApp={false} style={modalStyle} isOpen={showMap}>
                <Map onMapClose={() => setShowMap(false)} _pickedLocations={locations} onLocationsChanged={(loc) => {
                    setLocations(loc);
                    setShowMap(false);
                    clearErrors('locationName');
                }} />
            </Modal>
        </>
    )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const isLogin = protectPage(ctx);
    if (!isLogin) return {
        redirect: {
            permanent: false,
            destination: "/auth",
        },
        props: {

        }
    }

    return {
        props: {

        },
    }
}