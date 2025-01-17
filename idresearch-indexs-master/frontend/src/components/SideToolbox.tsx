import {info} from 'console';
import {Tooltip} from 'flowbite-react';
import {latLng, latLngBounds, TileLayer, tileLayer} from 'leaflet';
import {useEffect, useState} from 'react';
import {useMap} from 'react-leaflet';
import BaseMapsModal from './BaseMapsModal';

import {Steps, Hints} from 'intro.js-react';
import 'reactjs-windows/dist/index.css';
import Swal from 'sweetalert2';

const baseMaps = [
  {
    url: 'https://b.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}@1x.png',
  },
  {
    url: 'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@1x.png',
  },
  {
    url: 'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@1x.png',
  },

  {
    url: 'http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
  },
  {
    url: 'http://mt2.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
  },
];

const SideToolbox = () => {
  const mainMap = useMap();

  const [currentBaseMapIdx, setCurrentBaseMapIdx] = useState<number>(0);
  const [currentBaseMap, setCurrentBaseMap] = useState<TileLayer>(
    tileLayer(baseMaps[0].url, {}),
  );

  const [helpEnabled, setHelpEnabled] = useState<boolean>(false);

  useEffect(() => {
    setCurrentBaseMapIdx(1);
    mainMap.addLayer(currentBaseMap);
    console.log(currentBaseMap);

    if (!localStorage.getItem('onboarded')) {
      setHelpEnabled(true);
      localStorage.setItem('onboarded', 'true');
    }
  }, [0]);

  return (
    <div className={`mt-28 leaflet-top leaflet-left mr-2 w-40`}>
      <div className="leaflet-control">
        <div className="rounded-md p-1 my-4  h-6"></div>

        <Tooltip content="Zoom to Layer" placement="left-start">
          <div
            onClick={() => {
              mainMap.flyToBounds(
                latLngBounds(
                  latLng(-11.58403969992537, 95.9282184048987),
                  latLng(5.363014817607512, 142.86911977644638),
                ),
              );
            }}
            className="home-zoom bg-white rounded-md p-1 my-4 hover:bg-gray-800 hover:text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
        </Tooltip>

        <Tooltip content="My Location" placement="right">
          <div
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                  mainMap.setView(
                    latLng(position.coords.latitude, position.coords.longitude),
                    12,
                  );
                });
              } else {
                alert('Geolocation is not supported by this browser.');
              }
            }}
            className="my-location bg-white rounded-md p-1 my-4 hover:bg-gray-800 hover:text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
          </div>
        </Tooltip>

        <Tooltip content="Window / Panel Mode" placement="left-start">
          <div
            onClick={() => {
              if (localStorage.getItem('modal_mode')) {
                if (localStorage.getItem('modal_mode') === 'window') {
                  localStorage.setItem('modal_mode', 'panel');
                } else {
                  localStorage.setItem('modal_mode', 'window');
                }
              } else {
                localStorage.setItem('modal_mode', 'panel');
              }
              Swal.fire(
                'Informasi !',
                `Mode tampilan data "${localStorage.getItem(
                  'modal_mode',
                )}" aktif`,
                'info',
              );
            }}
            className="bg-white rounded-md p-1 my-4 hover:bg-gray-800 hover:text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              ></path>
            </svg>
          </div>
        </Tooltip>

        <Steps
          enabled={helpEnabled}
          options={{
            nextLabel: 'Next',
            prevLabel: 'Prev',
            doneLabel: 'Selesai',
            exitOnOverlayClick: true,
            skipLabel: 'skip',
          }}
          steps={[
            {
              element: '.map-onboard',
              title: 'Onboarding',
              intro: `Welcome, for convenience, please follow the initial tour with map instructions`,
            },
            {
              element: '.map-information',
              title: 'Map View Information',
              intro:
                'Displays data information being presented on the map, based on or without search results',
            },
            {
              element: '.smart-search',
              title: 'Smart Search',
              intro:
                'Extensive search based on keywords, topics and/or regional locations, searches display recommendations based on Smart Search',
            },

            {
              element: '.map-legend',
              title: 'Map Legend',
              intro:
                'Displays a guide legend for reading the map using the color palette',
            },
            {
              element: '.home-zoom',
              title: 'Full Zoom Out',
              intro: 'Zoom to outer Indonesia map view',
            },
            {
              element: '.my-location',
              title: 'My Location',
              intro: 'Go to my location using Geolocation',
            },
            {
              element: '.basemap-switcher',
              title: 'Base Map',
              intro: 'Change Base Map View',
            },
            {
              element: '.leaflet-draw-draw-rectangle',
              intro: 'Selection Zoom',
              title: 'Select Drag Zoom Map View',
            },
            {
              element: '.leaflet-control-scale',
              title: 'Scala',
              intro: 'Map Scaling Calculation',
            },
            {
              element: '.leaflet-control-zoom',
              title: 'Zoom control',
              intro: 'Control zoom manualy',
            },
            {
              element: '.leaflet-z',
              title: 'Interaktif Map',
              intro:
                'Interactive maps can accept user gestures, hover over colored areas to get brief information, scroll or pinch the map to zoom, Click and drag to move, Click on colored areas to view detailed information',
            },
          ]}
          initialStep={0}
          onExit={() => {
            setHelpEnabled(false);
          }}
        />
        <Tooltip content="Base Map Layer" placement="left-start">
          <div
            onClick={() => {
              mainMap.removeLayer(currentBaseMap);
              if (currentBaseMapIdx > baseMaps.length - 1) {
                window.location.reload();
              }

              setCurrentBaseMapIdx(currentBaseMapIdx + 1);
              setCurrentBaseMap(tileLayer(baseMaps[currentBaseMapIdx].url, {}));
              // delete tile layer
              mainMap.addLayer(tileLayer(baseMaps[currentBaseMapIdx].url, {}));
              console.log('change basemap to ', currentBaseMapIdx);
            }}
            className="basemap-switcher bg-white rounded-md p-1 my-4 hover:bg-gray-800 hover:text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              ></path>
            </svg>
          </div>
        </Tooltip>

        <Tooltip content="Help" placement="left-start">
          <div
            onClick={() => {
              setHelpEnabled(true);
            }}
            className="bg-white rounded-md p-1 my-4 hover:bg-gray-800 hover:text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default SideToolbox;
