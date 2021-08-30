import React, { memo } from 'react';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Image from 'next/image';
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import Head from 'next/head';
export interface IMainLayout {
    children?: React.ReactNode
}

const MainLayout: React.FC<IMainLayout> = ({ children }) => {
    const [cookies] = useCookies();

    return (
        <div>
            <Head>
            <script src="https://kit.fontawesome.com/a5fc7a8497.js" crossOrigin="anonymous"></script>
            </Head>
            <ReactNotification />
            <header className="flex items-center justify-between shadow-xl h-12 w-full bg-white px-4 md:px-10">
                <div className="flex-1">
                    <div className="inline-block bg-purple-400 py-1 px-4 rounded cursor-pointer">
                        <span className="text-purple-50">Let Play Together</span>
                    </div>
                </div>
                <div className="flex-1 flex justify-end">
                    <div className="w-9 h-9 rounded-full relative">
                        <Image className='rounded-full' src={cookies.photoURL || '/assets/images/imgbin_computer-icons-avatar-user-login-png.png'} alt='user avatar' width={60} height={60}/>
                        <div className="absolute top-10 right-0 w-40 hidden">
                            <ul className="flex flex-col shadow-xl border bg-white">
                                <li className="px-4 py-2 block border-b border-gray-100 cursor-pointer hover:bg-red-300 hover:text-red-50 text-red-300"><i className="fas fa-sign-out-alt  mr-2 "></i>Đăng xuất</li>
                                <li className="px-4 py-2 block hover:bg-red-300 hover:text-red-50 text-red-300 cursor-pointer "><i className="fas fa-id-card mr-2"></i> Profile</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>
            <div>
                {children && children}
            </div>
        </div>
    )
}

export default memo(MainLayout);