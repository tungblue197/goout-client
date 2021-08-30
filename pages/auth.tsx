import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { useState } from 'react'
import Image from 'next/image'
import { loginWithGoogle } from 'firebaseCf';
import { useRouter } from 'next/dist/client/router';
import { useCookies } from 'react-cookie';
import { login, register as uRegister } from 'services/auth';
import { useForm } from 'react-hook-form';
import { User } from 'types/global';
import { protectPage } from 'helpers/auth';

export default function AuthPage({

}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [showLogin, setShowLogin] = useState(true);

    const router = useRouter();
    const [, setCookie] = useCookies();
    const { register, handleSubmit, formState: { errors } } = useForm<User>();
    const regsiterForm = useForm<User>();



    const handleSigningWithGoogle = (e: any) => {
        e.preventDefault();
        loginWithGoogle((user, err) => {
            if (user) {
                const providerData = user.providerData[0];
                setCookie('displayName', providerData.displayName);
                setCookie('email', providerData.email);
                setCookie('photoURL', providerData.photoURL);
                setCookie('uid', providerData.uid);
                router.replace('/user');
                login({
                    username: '',
                    password: '',
                    type: 'google',
                    id: providerData.uid,
                    photoURL: providerData.photoURL,
                    location: undefined,
                    locationName: undefined,
                    name: providerData.displayName
                }).then(res => {
                    if(res.value.locationId) setCookie('locationId', res.value.locationId);
                });

            }
        })
    }

    const mormalLogin = (user: User) => {
        login({ ...user, type: 'normal' })
            .then(result => {
                const { value } = result;
                if(result.success){
                    setCookie('displayName', value.name);
                    setCookie('email', '');
                    if(value.photoURL) setCookie('photoURL', value.photoURL);
                    setCookie('uid', value.id);
                    if(value.locationId) setCookie('locationId', value.locationId);
                    router.replace('/user');
                }
            }).catch(err => {
                alert('Tài khoản hoạc mật khẩu không chính xác')
            })
    }

    const handleRegister = (user: User) => {
        uRegister(user).then(data => {
            if (data.success) {
                setCookie('uid', data.value.id);
                setCookie('displayName', data.value.name);
                setCookie('type', data.value.type);
                setCookie('photoURL', '');
                setCookie('locationId', '');
                router.replace('/user');
            }
        })
    }

    return (
        <div className="flex items-center justify-center h-screen px-2 bg-red-50">
            {
                showLogin ? (
                    <form action="" className="flex flex-col rounded-xl shadow-2xl  px-6 py-8 w-full sm:w-3/6 lg:w-4/12 bg-white " >
                        <div className='mb-4 text-center'>
                            <Image src='/assets/images/imgbin_computer-icons-avatar-user-login-png.png' className="w-24 mx-auto  rounded-full" alt="user login" objectFit='contain' width={90} height={90} />
                        </div>
                        <span className="text-xl text-center uppercase text-gray-500 ">Đăng nhập</span>
                        <div className="mt-2">
                            <input {...register('username', { required: 'Điền đầy đủ tên tài khoản' })} placeholder="Tài khoản" type="text" className="w-full outline-none px-4 py-2 border-gray-300 border rounded placeholder-gray-300 text-sm focus:border-blue-300 my-2" />
                            <span className='h-3 block text-xs text-red-500 vertical-middle'>{!!errors.username && errors.username.message}</span>
                            <input {...register('password', { required: 'Điền đầy đủ mật khẩu' })} placeholder="Mật khẩu" type="password" className="w-full outline-none px-4 py-2 border-gray-300 border rounded placeholder-gray-300 text-sm focus:border-blue-300 my-2" />
                            <span className='h-3 block text-xs text-red-500 vertical-middle'>{!!errors.password && errors.password.message}</span>
                            <div className="flex justify-center my-4">
                                <button
                                    onClick={e => {
                                        e.preventDefault();
                                        handleSubmit(mormalLogin)();
                                    }}
                                    className="px-4 w-full py-2 text-sm bg-purple-500 text-purple-50 rounded shadow-sm hover:bg-purple-400">
                                    Đăng nhập</button>
                            </div>
                            <span className="block text-gray-500 text-left text-sm">Chưa có tài khoản? <a href="#" onClick={e => {
                                e.preventDefault();
                                setShowLogin(false);
                            }} className="text-bold text-blue-600">Đăng ký</a></span>
                        </div>
                        <div className="w-full border-b mx-auto my-4 relative">
                            <span className="absolute -top-3 bg-white left-1/2 text-gray-400 text-xs p-1">Or</span>
                        </div>
                        <div>
                            <button onClick={handleSigningWithGoogle} className="px-4 w-full py-2 text-sm bg-white text-gray-500 rounded shadow-sm border border-gray-100 mt-2 hover:bg-gray-100">Đăng nhập bằng google</button>
                        </div>
                    </form>
                ) : (<form className="flex flex-col rounded-xl shadow-2xl  px-6 py-8 w-full sm:w-3/6 lg:w-4/12 bg-white">
                    <span className="text-xl text-center text-gray-500 uppercase">Đăng ký nhanh</span>
                    <div className="mt-2">
                        <input {...regsiterForm.register('username', { required: 'Bắt buộc nhập tên tài khoản' })} type="text" placeholder="Tên tài khoản" className="w-full outline-none px-4 py-2 border-gray-300 border rounded placeholder-gray-300 text-sm focus:border-blue-300 my-2" />
                        <span className='h-3 block text-xs text-red-500 vertical-middle'>{!!regsiterForm.formState.errors.username && regsiterForm.formState.errors.username.message}</span>
                        <input {...regsiterForm.register('password', { required: 'Mật khẩu là bắt buộc' })} type="password" placeholder="Mật khẩu" className="w-full outline-none px-4 py-2 border-gray-300 border rounded placeholder-gray-300 text-sm focus:border-blue-300 my-2" />
                        <span className='h-3 block text-xs text-red-500 vertical-middle'>{!!regsiterForm.formState.errors.password && regsiterForm.formState.errors.password.message}</span>
                        <input {...regsiterForm.register('name', { required: 'Tên là bắt buộc' })} type="text" placeholder="Tên của bạn" className="w-full outline-none px-4 py-2 border-gray-300 border rounded placeholder-gray-300 text-sm focus:border-blue-300 my-2" />
                        <span className='h-3 block text-xs text-red-500 vertical-middle'>{!!regsiterForm.formState.errors.name && regsiterForm.formState.errors.name.message}</span>

                        <div className="flex justify-center my-4">
                            <button onClick={e => {
                                e.preventDefault();
                                regsiterForm.handleSubmit(handleRegister)();
                            }} className="px-4 w-full py-2 text-sm bg-purple-500 text-purple-50 rounded shadow-sm hover:bg-purple-400">Đăng ký</button>
                        </div>
                        <div className="flex justify-center my-4">
                            <button onClick={e => {
                                e.preventDefault();
                                setShowLogin(true);
                            }} className="px-4 w-full py-2 text-sm bg-white text-gray-400 rounded border shadow hover:border-purple-500">Quay về đăng nhập</button>
                        </div>
                    </div>

                </form>)
            }


        </div>
    )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const isLogin = protectPage(ctx);
    if (isLogin) return {
        redirect: {
            permanent: false,
            destination: "/session",
        },
        props: {

        }
    }
    return {
        props: {
            
        },
        
    }
}