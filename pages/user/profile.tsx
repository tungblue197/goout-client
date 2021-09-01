import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { protectPage } from "helpers/auth";
import MainLayout from "layouts/MainLayout";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import Image from 'next/image';
import { useCookies } from "react-cookie";
import { faCamera, faEdit, faSave } from '@fortawesome/free-solid-svg-icons'
import { ChangeEventHandler, DetailedHTMLProps, InputHTMLAttributes, RefObject, useRef } from "react";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { faMapMarkedAlt, faTimes } from '@fortawesome/free-solid-svg-icons'
import firebaseCf from "firebaseCf";
import { useState } from "react";
import { User } from "types/global";
import { app_domain } from "consts/domain";
import axios from "axios";

export default function ProfilePage({
    user
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [cookies] = useCookies();
    const imagPickerRef = useRef<any>();
    const [userCols, setUserCols] = useState<(User & { isEdit?: boolean, label?: string }[])>([
        {
            name: user?.name,
            isEdit: false,
            label: 'Tên của bạn'
        },
    ]);

    const onUploadButtonClick = () => {
        if (imagPickerRef.current) {
            imagPickerRef.current.click();
        }
    }



    const handleUploadImage = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const storage = getStorage(firebaseCf);
            const storageRef = ref(storage, `images/${file.name}`);
            uploadBytes(storageRef, file).then(snapshot => {
                console.log(snapshot, 'uploaded', storageRef)
            })
        }
    }
    console.log('cookies.photoURL : ', cookies.photoURL, user);
    return (
        <>
            <div className="w-11/12 border mx-auto my-4 shadow-xl bg-white rounded-xl p-2">
                <div className='w-full border-b border-purple-300'>
                    <span className='block text-center text-purple-500 font-semibold uppercase'>Thông tin của bạn</span>
                </div>
                <div className='py-4'>
                    <div className='w-full flex justify-center'>
                        <div className='user-avatar text-center relative inline-block mx-auto border pt-2 shadow-2xl'>
                            <Image src={cookies.photoURL || '/assets/images/imgbin_computer-icons-avatar-user-login-png.png'} width={120} height={120} alt='image' />
                            <button className='w-full bg-gray-500' onClick={onUploadButtonClick}>
                                <input type='file' onChange={handleUploadImage} className='hidden' ref={imagPickerRef} />
                                <FontAwesomeIcon color="#eee" icon={faCamera} />
                            </button>
                        </div>
                    </div>
                    <div className=''>
                        {
                            userCols.map((col: any) => {
                                return (<div key={col.label} className='flex items-cetner my-4'>
                                    <div className='w-3/12 text-purple-500  font-semibold'>
                                        Tên của bạn:
                                    </div>
                                    <div className='flex-1 text-gray-500 flex'>
                                        {
                                            col.isEdit ? (<div>
                                                <input value={col.name} className='border-b-2 border-purple-300 px-2 outline-none'
                                                    onChange={e => {
                                                        const value = e.target.value;
                                                        const newCols = userCols.map(_col => {
                                                            if (_col.label === col.label) {
                                                                return ({ ..._col, name: value });
                                                            }
                                                            return _col;
                                                        });
                                                        setUserCols(newCols);
                                                    }}
                                                />
                                            </div>) : <div>{col.name}</div>

                                        }

                                        <button className='ml-4 curser-pointer' onClick={e => {
                                            const newCols = userCols.map(_col => {
                                                if (_col.label === col.label) {
                                                    return ({ ..._col, isEdit: !_col.isEdit })
                                                }
                                                return _col;
                                            })
                                            setUserCols(newCols);
                                        }}>
                                            {
                                                col.isEdit ? <FontAwesomeIcon icon={faSave} className='text-blue-500' /> : <FontAwesomeIcon icon={faEdit} className='text-red-400' />
                                            }
                                        </button>
                                    </div>
                                </div>)

                            })
                        }


                    </div>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const appDomain = app_domain;
    const isLogin = protectPage(ctx);
    if (!isLogin) return {
        redirect: {
            permanent: false,
            destination: "/auth",
        },
        props: {

        }
    }
    const userId = ctx.req.cookies.uid;
    const { data } = await axios.get(appDomain + '/api/user/' + userId);
    console.log(userId, data);

    return {
        props: {
            user: data.value as User
        }
    }
}