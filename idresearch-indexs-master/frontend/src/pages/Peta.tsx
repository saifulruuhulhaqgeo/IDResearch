import {NmScale} from '@marfle/react-leaflet-nmscale';
import {latLng, latLngBounds} from 'leaflet';
import {useEffect, useState} from 'react';
import {
  FeatureGroup,
  MapContainer,
  TileLayer,
  Circle,
  AttributionControl,
} from 'react-leaflet';
import '../../node_modules/leaflet/dist/leaflet.css';
import {AreaModalParam} from '../common/TypesModel';
import AreaClickModal from '../components/AreaClickModal';
import DaerahAreaFeatures from '../components/DaerahAreaFeatures';
import {MouseTooltip} from '../components/MouseBinding';
import OnMapLoading from '../components/OnMapLoading';
import PetaLegend from '../components/PetaLegend';
import SideToolbox from '../components/SideToolbox';
import SmartSearchBar from '../components/SmartSearchBar';
import Toolbox from '../components/Toolbox';
import {EditControl} from 'react-leaflet-draw';
import SelectZoom from '../components/SelectZoom';
import AreaClickWindows from '../components/AreaClickWindows';
import MyCollectionModal from '../components/MyCollectioModal';
import {isMobile} from 'react-device-detect';
import Swal from 'sweetalert2';
import MainLogo from '../assets/logo-kuning.png';
import AmcoLogo from '../assets/logo-amcolabora-HD.png';
import moment from 'moment';

const Peta: React.FunctionComponent = () => {
  const [infoTooltip, setInfoTooltip] = useState<string>('');
  const [areaModalParam, setAreaModalParam] = useState<AreaModalParam | null>(
    null,
  );
  const [showAreaModal, setShowAreaModal] = useState<boolean>(false);
  const [showAreaWindow, setShowAreaWindow] = useState<boolean>(false);

  const [mapLoading, setMapLoading] = useState<boolean>(false);
  const [myCollectionModalOpen, setMyCollectionModalOpen] =
    useState<boolean>(false);

  useEffect(() => {
    if (isMobile) {
      Swal.fire(
        'Caution',
        'This application is not optimal for mobile because it displays a wide map, please use a desktop browser or a screen with a size of 10 inches and above',
        'warning',
      );
    }
  }, [0]);

  return (
    <div className="h-screen">
      <MapContainer
        style={{height: '100vh'}}
        bounds={latLngBounds(
          latLng(-11.58403969992537, 95.9282184048987),
          latLng(5.363014817607512, 142.86911977644638),
        )}
        zoom={11}
        zoomControl={false}
        scrollWheelZoom={true}
        attributionControl={false}
      >
        <Toolbox />

        <SelectZoom />
        <SmartSearchBar
          showModal={true}
          modalParam={areaModalParam}
          onCloseModal={() => {}}
        />

        <SideToolbox />
        <PetaLegend />

        <AreaClickWindows
          modalParam={areaModalParam}
          showModal={showAreaWindow}
          onCloseModal={() => {}}
        />

        <DaerahAreaFeatures
          onInformationTooltipChanged={(info) => {
            setInfoTooltip(info);
            return info;
          }}
          onOpenAreaModal={(modalParam) => {
            setShowAreaModal(true);
            setAreaModalParam(modalParam);
            return modalParam;
          }}
          onOpenAreaWindow={(modalParam) => {
            setShowAreaWindow(true);
            setAreaModalParam(modalParam);
            return modalParam;
          }}
          onLayerLoading={(isLoading) => {
            setMapLoading(isLoading);
            return isLoading;
          }}
        />

        <AreaClickModal
          showModal={showAreaModal}
          modalParam={areaModalParam}
          onCloseModal={() => setShowAreaModal(false)}
          onLiteratureClick={(link) => {
            console.log('LINKKAN', link);
            setShowAreaModal(false);
          }}
        />

        <MyCollectionModal
          modalOpen={myCollectionModalOpen}
          onModalClosed={() => {
            setMyCollectionModalOpen(false);
          }}
        />

        <OnMapLoading showLoading={mapLoading} />
      </MapContainer>
      <div>
        <MouseTooltip
          style={{
            zIndex: 1000,
          }}
          visible={true}
          offsetX={5}
          offsetY={5}
        >
          <span
            className="m-2"
            style={{
              background: 'white',
              color: 'black',
              fontSize: '12px',
              borderRadius: '5px',
            }}
          >
            {infoTooltip ? (
              <span className="my-2 mx-2">{infoTooltip}</span>
            ) : null}
          </span>
        </MouseTooltip>
      </div>

      <div className="flex w-full  bottom-14 fixed  z-[100000] justify-center">
        <div className="flex-none">
          <div
            className="map-legend flex-row items-center px-4 py-1 w-full  text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
            role="alert"
          >
            <p className="">Total Research Color Levels</p>

            <div className="hidden md:inline-flex">
              <div className="ml-2">
                <div className="flex justify-center">
                  <div className="h-0.5 w-4 bg-green-800 bg-opacity-60 mr-2 mt-2.5"></div>
                  <p className="w-10"> ZEE </p>
                </div>
              </div>
              <div className="ml-2">
                <div className="flex">
                  <div className="h-0.5 w-4 bg-orange-500 bg-opacity-60 mr-2 mt-2.5"></div>
                  <p className="w-16"> Teritorial</p>
                </div>
              </div>
              <div className="ml-2">
                <div className="flex">
                  <div className="h-4 w-4 bg-[#fc0328] bg-opacity-60 mr-2 mt-1.5"></div>
                  <p className="w-5">0</p>
                </div>
              </div>
              <div className="ml-2">
                <div className="flex">
                  <div className="h-4 w-4 bg-[#ead287] bg-opacity-60 mr-2 mt-1.5"></div>
                  <p className="w-16">0 - 100</p>
                </div>
              </div>
              <div className="ml-2">
                <div className="flex">
                  <div className="h-4 w-4 bg-[#a103fc] bg-opacity-60 mr-2 mt-1.5"></div>
                  <p className="w-24"> 100 - 5000</p>
                </div>
              </div>
              <div className="ml-2">
                <div className="flex">
                  <div className="h-4 w-4 bg-[#1403fc] bg-opacity-60 mr-2 mt-1.5"></div>
                  <p className="w-28"> 5000 - 10000</p>
                </div>
              </div>
              <div className="ml-2">
                <div className="flex">
                  <div className="h-4 w-4 bg-[#03fc5e] bg-opacity-60 mr-2 mt-1.5"></div>
                  <p className="w-16"> &gt; 10000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="px-4 py-2  bg-[#212121]  bottom-0 fixed  z-[10000] w-full">
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-white sm:text-center dark:text-white hidden md:block">
            © {moment().year()}{' '}
            <a href="https://www.amcolabora.or.id" className="hover:underline">
              Amcolabora
            </a>
            . All Rights Reserved.
          </span>

          <div>
            <div className="inline-flex justify-center w-full">
              <div className="flex-auto"></div>

              <div className="flex-none">
                <ul className="text-white dark:text-gray-400 inline-flex">
                  <li className="mb-0 mx-2">
                    <a
                      href="/#/about-us"
                      className="hover:underline hover:text-[#ffc200]"
                    >
                      About Us
                    </a>
                  </li>
                  <li className="mb-0 mx-2">
                    <a
                      href="/#/privacy-policy"
                      className="hover:underline hover:text-[#ffc200]"
                    >
                      Privacy Policy
                    </a>
                  </li>

                  <li className="mb-0 mx-2">
                    <a
                      href="https://www.amcolabora.or.id/contact/"
                      className="hover:underline hover:text-[#ffc200]"
                    >
                      Help
                    </a>
                  </li>
                </ul>
              </div>

              <div className="flex-auto"></div>
            </div>
          </div>

          <span className="text-sm text-white text-center dark:text-white block md:hidden">
            © {moment().year()}{' '}
            <a href="https://www.amcolabora.or.id" className="hover:underline">
              Amcolabora
            </a>
            . All Rights Reserved.
          </span>

          <a
            target="_blank"
            href="https://www.amcolabora.or.id/"
            className="flex mt-1 md:mt-0"
          >
            <div className="flex-auto md:hidden"></div>

            <span className="text-white text-sm flex-none mr-1 mt-1">
              {' '}
              Powered by
            </span>
            <img
              src={AmcoLogo}
              className="mr-3 h-7  md:block flex-none mt-0"
              alt="ID Research Logo"
            />
            <div className="flex-auto md:hidden"></div>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Peta;
