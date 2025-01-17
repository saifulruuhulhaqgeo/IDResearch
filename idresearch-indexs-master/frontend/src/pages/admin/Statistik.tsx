import Sidebar from '../../components/Sidebar';
import React, {useEffect, useState} from 'react';
import SourceLiteratureChart from '../../components/SourceLiteratureChart';
import {formatDecimal} from '../../common/IndonesianFormat';
import {getScrapedStats} from '../../repositories/Research';
import {MapContainer, TileLayer} from 'react-leaflet';
import {latLng, latLngBounds} from 'leaflet';
import DaerahAreaFeatures from '../../components/DaerahAreaFeatures';
import {MouseTooltip} from '../../components/MouseBinding';
import OnMapLoading from '../../components/OnMapLoading';
import PetaLegend from '../../components/PetaLegend';
import {AreaModalParam} from '../../common/TypesModel';

const TopicChart = React.lazy(() => import('../../components/TopicChart'));
const ProvinsiChart = React.lazy(
  () => import('../../components/ProvinsiChart'),
);

const Statistik = () => {
  const [cardStats, setCardStats] = useState({} as any);
  const [infoTooltip, setInfoTooltip] = useState('');
  const [mapLoading, setMapLoading] = useState<boolean>(false);
  const [daerahNow, setDaerahNow] = useState<AreaModalParam>();

  useEffect(() => {
    getScrapedStats()
      .then((res) => {
        setCardStats(res.data?.data);
      })
      .catch((err) => console.log(err));
  }, [0]);

  return (
    <div className="flex">
      <div className="flex-none h-screen">
        <Sidebar />
      </div>
      <div className="felx-auto mt-20 w-full">
        <div className="p-4">
          <div className="flex px-4 gap-4">
            <div className="flex-auto bg-gray-100 p-4 rounded-xl drop-shadow-md">
              <p className="text-xs">Total Region Params</p>
              {formatDecimal(cardStats?.Daerah?.toString())}
            </div>
            <div className="flex-auto bg-gray-100 p-4 rounded-xl drop-shadow-md">
              <p className="text-xs">Total Topic Params</p>
              {formatDecimal(cardStats?.Topik?.toString())}
            </div>
            <div className="flex-auto bg-gray-100 p-4 rounded-xl drop-shadow-md">
              <p className="text-xs">Total data scraped</p>
              {formatDecimal(cardStats?.Scraped?.toString())}
            </div>
          </div>
        </div>
        <h1>{daerahNow?.areaLabel}</h1>
        <div className="p-8">
          <MapContainer
            style={{height: '500px'}}
            bounds={latLngBounds(
              latLng(13.710035342476681, 153.41308593750003),
              latLng(-13.795406203132826, 90.13183593750001),
            )}
            zoom={13}
            zoomControl={true}
            scrollWheelZoom={false}
            attributionControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            />
            <DaerahAreaFeatures
              onInformationTooltipChanged={(info) => {
                setInfoTooltip(info);
                return info;
              }}
              onOpenAreaModal={(modalParam) => {
                setDaerahNow(modalParam);
                return modalParam;
              }}
              onLayerLoading={(isLoading) => {
                setMapLoading(isLoading);
                return isLoading;
              }}
            />
            <OnMapLoading showLoading={mapLoading} />
            <PetaLegend />
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
                  background: '#c2410b',
                  color: 'white',
                  margin: '5px',
                  fontSize: 'x-small',
                }}
              >
                {infoTooltip}
              </span>
            </MouseTooltip>
          </div>
        </div>

        <div className="p-4">
          <SourceLiteratureChart />
        </div>
        <div className="p-4">
          <TopicChart
            areaCode={daerahNow?.areaCode}
            daerahLabel={daerahNow?.areaLabel}
          />
        </div>

        <div className="p-4">
      {/*<ProvinsiChart />*/}
        </div>
      </div>
    </div>
  );
};

export default Statistik;
