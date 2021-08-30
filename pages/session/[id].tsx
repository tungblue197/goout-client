import axios from 'axios';
import { modalStyle } from 'consts/modal';
import MainLayout from 'layouts/MainLayout'
import { GetServerSidePropsContext, InferGetServerSidePropsType, GetStaticPaths } from 'next'
import { useRouter } from 'next/dist/client/router';
import { useState } from 'react';
import { useEffect } from 'react';
import { getSessions, getSesssionById } from 'services/session';
import { Location, Session, User } from 'types/global';
import Modal from 'react-modal';
import Map from 'components/map';
import { io, Socket } from 'socket.io-client';
import { useRef } from 'react';
import { useCookies } from 'react-cookie';
import { store } from 'react-notifications-component';
import { protectPage } from 'helpers/auth';
import { useBeforeunload} from 'react-beforeunload';
import Image from 'next/image';


var connectionOptions = {
    "force new connection": true,
    "reconnectionAttempts": "Infinity",
    "timeout": 10000,
    "transports": ["websocket"]
};
export default function SessionById({
    session,
    createdUser,
    plocations
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter();
    const [showMap, setShowMap] = useState(false);
    const [locations, setLocations] = useState<Location[]>();
    const [pickLocation, setPickLocation] = useState<Location>();
    const [currentViewLocation, setCurrentViewLocation] = useState<Location>();
    const [usersOnline, setUserOnline] = useState<User[]>([]);
    const [timer, setTimer] = useState<number>();
    const socketRef = useRef<Socket>();
    const [cookies] = useCookies();
    useEffect(() => {
        socketConnect();
        joinSession();
        sessionCountDown();
    }, []);
    const socketConnect = () => {
        socketRef.current = io(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000')
    }

    useBeforeunload(e => {
        leaveSession();
    })

    const joinSession = () => {
        const socket = socketRef.current;
        if (socket) {
            const _user: User = {
                id: cookies.uid,
                name: cookies.displayName,
                photoURL: cookies.photoURL
            }
            socket.emit('user-join-session', { user: _user, sId: session?.id }, (e: any) => {
                setUserOnline(e.room.users);
            });

            socket.on('user-joined-session', (e: any) => {
                
                setUserOnline(e.room.users);
                store.addNotification({
                    title: 'Thông báo',
                    insert: 'top',
                    container: 'top-right',
                    message: e.user.name + ' was join',
                    type: 'info',
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                        duration: 2000,
                    }
                })
            })
        }
    }

    const sessionCountDown = () => {
        const socket = socketRef.current;
        if (socket) {
            socket.on('count', (n) => {
                setTimer(n);
            })
        }
    }

    const leaveSession = () => {
        const socket = socketRef.current;
        if (socket) {
            const _user: User = {
                id: cookies.uid,
                name: cookies.displayName,
                photoURL: cookies.photoURL
            }
            socket.emit('user-leave-room', { user: _user, sId: session?.id});
        }
    }

    return (
        <MainLayout>
            <div className="w-11/12 border mx-auto my-4 shadow-xl bg-white rounded-xl p-2 flex flex-wrap">
                <div className="w-full md:w-4/12 md:border-r flex-wrap border-b border-gray-300">
                    <div className="w-full border-b border-gray-300  py-4">
                        <div className="w-full flex mb-1 flex-wrap">
                            <div className="w-full md:w-4/12 text-gray-500 text-sm font-semibold">
                                Người tạo
                            </div>
                            <div className="flex-1 text-sm text-red-400">
                                {createdUser?.name}
                            </div>
                        </div>
                        <div className="w-full flex  mb-1 flex-wrap">
                            <div className="w-full md:w-4/12 text-gray-500 text-sm font-semibold">
                                Tiêu đề:
                            </div>
                            <div className="flex-1 text-sm text-red-400">
                                {session?.title}
                            </div>
                        </div>
                        <div className="w-full flex  mb-1 flex-wrap">
                            <div className="w-full md:w-4/12 text-gray-500 text-sm font-semibold">
                                Nội dung:
                            </div>
                            <div className="flex-1 text-sm text-red-400">
                                {session?.content}
                            </div>
                        </div>
                    </div>
                    <div className="w-full py-4">
                        <span className="text-purple-400 font-semibold">Các thành viên đang online</span>
                        <ul className="flex flex-col my-2">
                            {
                                usersOnline.map(user => (
                                    <li key={user.id} className="flex items-center space-1-x">
                                        <Image className='rounded-full' src={user.photoURL || '/assets/images/imgbin_computer-icons-avatar-user-login-png.png'} width={40} height={40}  />
                                        <span className="text-sm m-2 text-gray-400">{user.name}</span>
                                    </li>
                                ))
                            }

                        </ul>
                    </div>
                </div>
                <div className="flex-1 py-2">
                    <div className="text-center">
                        <h3 className="text-4xl text-red-400">{timer !== undefined ? timer: null}</h3>
                        <span className="block text-sm text-purple-500">Chọn địa điểm bạn muốn đến</span>
                    </div>
                    <div className="flex flex-col">
                        {
                            !!plocations && plocations.map(loc => {
                                return (
                                    <div key={loc.rid} className="w-full border px-2 py-1 md:ml-1 cursor-pointer flex items-center mb-2">
                                        {/* <i className="fas fa-map-marker text-sm text-red-400 mr-2"></i> */}
                                        <span className="text-sm text-red-400 block flex-1">{loc.name}</span>
                                        <button onClick={e => {
                                            setLocations([loc]);
                                            setShowMap(true);
                                        }} className="text-purple-400 mx-2 text-sm border py-1 px-2 rounded shadow">
                                            Xem trên map
                                        </button>
                                        <button className="text-green-400 mx-2 text-sm border py-1 px-2 rounded shadow">
                                            Chọn
                                        </button>
                                    </div>
                                )
                            })
                        }


                    </div>
                </div>
            </div>
            <Modal ariaHideApp={false} style={modalStyle} isOpen={showMap}>
                <Map onMapClose={() => setShowMap(false)} _pickedLocations={locations} rectFromMe={true} />
            </Modal>
        </MainLayout>
    )
}



export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    console.log(process.env.NEXT_PUBLIC_APP_DOMAIN, '----');
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
    const { id } = ctx.params as { id: string };
    const { data } = await axios.get(process.env.NEXT_PUBLIC_APP_DOMAIN + '/api/session/' + id);
    const { createdBy } = data.value as Session;
    const userResult = await axios.get(process.env.NEXT_PUBLIC_APP_DOMAIN + '/api/user/' + createdBy);
    const { name, locationId, photoURL } = userResult.data.value as User;
    const lsResult = await axios.post(process.env.NEXT_PUBLIC_APP_DOMAIN + '/api/location/location_by_session', { sessionId: data.value.id });

    return {
        props: {
            session: data.value as Session,
            createdUser: { name, locationId, photoURL, id: userResult.data.value },
            plocations: lsResult.data.value.data as Location[]
        }
    }
}


