import React, { RefObject } from 'react'
import axios from 'axios';
import ReactMapGL, { Marker, Source, Layer, } from 'react-map-gl';
import { useState } from 'react';
import { Location } from 'types/global';
import { useEffect } from 'react';
import { useRef } from 'react';
import { m2km } from 'helpers/math';
import { useCookies } from 'react-cookie';
import { v4 as uuidv4 } from 'uuid';
import { faMapMarkedAlt,faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const defaultViewPort = {
    latitude: 21.028511,
    longitude: 105.804817,
    zoom: 11
}

export interface IMapProps {
    onLocationsChanged?: (l: Location[]) => any;
    onMapClose?: () => any;
    _pickedLocations?: Location[];
    pickOnce?: boolean;
    rectFromMe?: boolean;
}


const Map: React.FC<IMapProps> = ({ _pickedLocations, onLocationsChanged, onMapClose = () => null, pickOnce, rectFromMe }) => {
    const [textSearch, setTextSearch] = useState('');
    const [listLocations, setListLocations] = useState<Location[]>([]);
    const [pickedLocations, setPickedLocations] = useState<Location[]>([]);
    const [viewport, setViewport] = useState(defaultViewPort);
    const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
    const [openViewLoc, setOpenViewLoc] = useState(true);
    const [coordinates, setCoordinates] = useState<number[][]>();
    const [distance, setDistance] = useState<number>(0);
    const [cookies] = useCookies();
    useEffect(() => {
        if (!currentLocation) return;
        const { longitude, latitude } = currentLocation;
        setViewport({
            latitude: latitude || viewport.latitude,
            longitude: longitude || viewport.longitude,
            zoom: viewport.zoom
        })
    }, [currentLocation])

    useEffect(() => {
        if (_pickedLocations) {
            if (rectFromMe) {
                if (cookies.log && cookies.lat && _pickedLocations.length) {
                    const newLocation: Location = { id: uuidv4(), longitude: Number(cookies.log), latitude: Number(cookies.lat), name: cookies.locationName };
                    setPickedLocations([..._pickedLocations, newLocation]);
                    calculateRoute({ longitude: Number(cookies.log), latitude: Number(cookies.lat) }, _pickedLocations[0]);

                }
            } else {
                setPickedLocations(_pickedLocations);
            }
        }
    }, [_pickedLocations])




    const searchLocations = (text: string) => {
        setTextSearch(text);
        if (!text) {
            setListLocations([]);
            return;
        }
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?proximity=105.777909,21.028412&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;
        axios.get(url).then(({ data }) => {
            const _list = data.features.map((loc: any) => {
                const location: Location = {
                    id: loc.id,
                    name: loc.place_name,
                    latitude: loc.center[1],
                    longitude: loc.center[0]
                }
                return location;
            });
            setListLocations(_list);
        })
    }

    const handlePickLocation = (loc: Location) => {
        setTextSearch('');
        setListLocations([]);
        if (pickOnce) {
            setPickedLocations([loc]);
            return;
        }
        const isLocationPicked = pickedLocations.some(_l => _l.id === loc.id);
        if (isLocationPicked) return;
        setPickedLocations([...pickedLocations, loc]);
        setCurrentLocation(loc);
    }

    const handleRemovePickedLoation = (loc: Location) => {
        const _l = pickedLocations.filter(_loc => _loc.id !== loc.id);
        setPickedLocations(_l);
        if (_l.length) setCurrentLocation(_l[_l.length - 1]);
        else setCurrentLocation(null);
    }

    const calculateRoute = (lMe: { longitude: number, latitude: number }, lNe: Location) => {
        axios.get(`https://api.mapbox.com/directions/v5/mapbox/walking/${lMe.longitude}%2C${lMe.latitude}%3B${lNe.longitude}%2C${lNe.latitude}?alternatives=true&geometries=geojson&steps=true&access_token=pk.eyJ1IjoidHVuZ3B2OTciLCJhIjoiY2tzb3IzNzE1M3U2bTJ3bzJzdmxpc3VxeCJ9.bWom9lqXVp6IMGcWH0Aw_A`)
            .then(({ data }) => {
                setCoordinates(data.routes[0].geometry.coordinates);
                setDistance(+m2km(data.routes[0].distance).toFixed(2));
            })
    }

    return (
        <div className='w-full h-full bg-white  flex flex-col'>
            <div className='px-4 py-2 flex relative items-center shadow-xl border-b'>
                <div className='flex-1'>
                    {rectFromMe ? <span>Khoảng cách từ <span className='text-xs'>{pickedLocations[0]?.name} {'đến'} {pickedLocations[1]?.name} là</span>  {distance} km</span> : <span className='text-sm'>Chọn địa điểm bạn muốn đến</span>}
                </div>
                <div className='mx-4'>
                    <button onClick={e => {
                        if (onLocationsChanged) {
                            onLocationsChanged(pickedLocations)
                        }
                    }} className="px-4 w-full py-2 text-sm bg-purple-500 text-purple-50 rounded shadow-sm hover:bg-purple-400">Save <i className="fas fa-save text-white ml-1"></i></button>
                </div>
                <div>
                    <button onClick={e => onMapClose()} className='text-red-500 text-xl cursor-pointer'>
                        <FontAwesomeIcon icon={faTimes} className='text-red-500 text-2xl' />
                    </button>
                </div>
            </div>
            <div className='flex-1 w-full flex relative'>
                <div className='absolute top-2 left-2 z-10  w-96 bg-white'>
                    {
                        !rectFromMe && (
                            <>
                                <input type="text" value={textSearch} onChange={(e) => { searchLocations(e.target.value) }} className="w-full outline-none px-4 py-2 border-gray-300 border rounded placeholder-gray-300 text-sm focus:border-blue-300 pr-8 " />
                                {
                                    !textSearch ? <button className='absolute right-0 top-0 text-gray-600 px-2 h-full'><i className="fas fa-search-location"></i></button> : <button onClick={e => {
                                        setTextSearch('');
                                        searchLocations('');
                                    }} className='absolute right-2 top-0 text-gray-600 px-2 h-full'><i className="fas fa-times"></i></button>
                                }
                                {
                                    !!listLocations.length && (
                                        <div className='shadow-xl rounded absolute top-10 left-0 right-0 bg-white p-2'>
                                            {
                                                listLocations.map((loc: Location) => (
                                                    <div onClick={e => handlePickLocation(loc)} className='w-full border-b border-gray-100 text-sm text-gray-600 py-1 px-1 hover:bg-red-300 hover:text-red-50 cursor-pointer last:border-0' key={loc.id}><i className="fas fa-map-marker-alt text-red-400"></i> - {loc.name}</div>
                                                ))
                                            }
                                        </div>
                                    )
                                }
                            </>
                        )
                    }

                </div>
                <div className='flex-1'>
                    <ReactMapGL
                        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                        {...viewport}
                        width="100%"
                        height="100%"
                        mapStyle='mapbox://styles/mapbox/outdoors-v11'
                        onViewportChange={(viewport: React.SetStateAction<{ latitude: number; longitude: number; zoom: number; }>) => setViewport(viewport)}
                    >
                        {
                            coordinates && (
                                <Source id="polylineLayer" type="geojson"
                                    data={{
                                        'type': 'Feature',
                                        'properties': {},
                                        'geometry': {
                                            'type': 'LineString',
                                            'coordinates': coordinates
                                        }
                                    }}
                                >
                                    <Layer
                                        id="lineLayer"
                                        type="line"
                                        source="my-data"
                                        layout={{
                                            "line-join": "round",
                                            "line-cap": "round"
                                        }}
                                        paint={{
                                            "line-color": "rgba(3, 170, 238,1)",
                                            "line-width": 5
                                        }}
                                    />
                                </Source>
                            )
                        }

                        {
                            pickedLocations.map(({ longitude, latitude, id }: Location) => (
                                <Marker longitude={longitude} key={id} latitude={latitude}>
                                    <FontAwesomeIcon icon={faMapMarkedAlt} className='text-red-500'/>
                                </Marker>
                            ))

                        }

                    </ReactMapGL>
                </div>
                <div className={`absolute right-0 top-0 button-0 z-10 bg-white rounded shadow h-full border-r-0 transition ${openViewLoc ? 'w-1/6' : 'w-0'}`}>
                    <button onClick={e => setOpenViewLoc(!openViewLoc)} className='absolute bg-white border w-8 h-8 rounded text-red-400 border-r-0 -left-8 hover:bg-red-400 hover:text-red-50'>{openViewLoc ? <i className="fas fa-times"></i> : <i className="fas fa-bars"></i>}</button>
                    <div className="px-4 py-2 border-b text-gray-600 uppercase font-semibold">
                        <span className='text-center block '>Địa điểm của bạn</span>
                    </div>
                    <ul className='text-sm text-gray-600 py-2 px-2'>
                        {
                            pickedLocations.map((loc: Location, index: number) => <li className={`border-b py-1 text-xs cursor-pointer ${loc.id === currentLocation?.id ? 'text-red-400' : ''}`} key={loc.id}><span onClick={e => setCurrentLocation(loc)}>({index + 1}) - {loc.name} - </span><i onClick={e => handleRemovePickedLoation(loc)} className="fas fa-trash-alt text-sm text-red-500 curser-pointer"></i></li>)
                        }
                    </ul>
                </div>
            </div>







        </div>
    )
}

export default Map
