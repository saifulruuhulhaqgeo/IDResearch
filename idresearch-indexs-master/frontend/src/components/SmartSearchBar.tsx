import {any} from '@amcharts/amcharts4/.internal/core/utils/Array';
import {geoJSON, GeoJSON} from 'leaflet';
import {useEffect, useState} from 'react';
import {useMap} from 'react-leaflet';
import {
  AreaModalParam,
  SearchDaerahResult,
  SearchKeywordResult,
  SearchTopicResult,
} from '../common/TypesModel';
import {getGeoJson, searchSmartSearch} from '../repositories/Search';
import Research from './areamodal/Research';
import Statistik from './areamodal/Statistik';
import Terkini from './areamodal/Terkini';
import LoadingInline from './LoadingInline';
import LoadingModal from './LoadingModal';

interface IAreaClickModalProps {
  modalParam: AreaModalParam | null;
  showModal: boolean;
  onCloseModal: () => void;
}

const daerahLevel: string[] = ['', 'Prov', 'Kab/Kota', 'Kec', 'Desa'];

let daerahOutline: GeoJSON;

const SmartSearchBar = ({
  showModal = false,
  modalParam = null,
  onCloseModal = () => {},
}: IAreaClickModalProps) => {
  const mainMap = useMap();
  const [showSearchPanel, setShowSearchPanel] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const [searchResultTopic, setSearchResultTopic] =
    useState<Array<SearchTopicResult>>();
  const [searchResultKeyword, setSearchResultKeyword] =
    useState<Array<SearchKeywordResult>>();
  const [searchResultDaerah, setSearchResultDaerah] =
    useState<Array<SearchDaerahResult>>();

  const [loadingModal, setLoadingModal] = useState<boolean>(false);

  const [onLoading, setOnLoading] = useState<boolean>(false);

  useEffect(() => {
    if (searchKeyword === '') {
      setShowSearchPanel(false);
    } else {
      setShowSearchPanel(true);
    }
  }, [searchKeyword]);

  const startSearch = () => {
    console.log(searchKeyword);
    setOnLoading(true);
    searchSmartSearch(searchKeyword)
      .then((response) => {
        console.log(response.data);
        setSearchResultTopic(response.data.data?.topic);
        setSearchResultKeyword(response.data.data?.keyword);
        setSearchResultDaerah(response.data.data?.daerah);
        console.log(searchResultTopic);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setOnLoading(false));
  };

  const disableMap = () => {
    mainMap.scrollWheelZoom.disable();
    mainMap.doubleClickZoom.disable();
    mainMap.dragging.disable();
    setShowSearchPanel(true);
  };

  const enableMap = () => {
    mainMap.scrollWheelZoom.enable();
    mainMap.doubleClickZoom.enable();
    mainMap.dragging.enable();
    setShowSearchPanel(false);
  };

  const gotoDaerahBound = (daerahCode: number, daerahLevel: number) => {
    if (daerahOutline) {
      daerahOutline.removeFrom(mainMap);
    }
    console.log(`Searching for ${daerahCode} and level ${daerahLevel}`);
    setLoadingModal(true);
    getGeoJson(daerahLevel, daerahCode)
      .then((response) => {
        let layerTarget: any = {
          type: 'FeatureCollection',
          features: [] as any,
        };
        response.data?.data.forEach((v: any) => {
          layerTarget.features.push({
            type: 'Feature',
            properties: {},
            geometry: JSON.parse(v.Geom),
          });
        });
        console.log(layerTarget);

        daerahOutline = geoJSON(layerTarget, {});

        mainMap.flyToBounds(daerahOutline.getBounds());

        daerahOutline
          .setStyle({
            weight: 5,
            color: 'black',
            opacity: 1,
            fillOpacity: 0,
            fillColor: 'white',
          })
          .addTo(mainMap);

        daerahOutline.bringToFront();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoadingModal(false);
      });
  };

  return (
    <div className={`mt-28 md:mt-20 leaflet-top leaflet-right mr-2 w-3/4 md:w-6/12`}>
      <div
        className="leaflet-control w-3/4 md:w-6/12"
        onMouseEnter={() => {
          console.log('onhover');
          disableMap();
        }}
        onMouseLeave={() => {
          console.log('onleave');
          enableMap();
          //disableMap()
        }}
      >
        <span className="flex h-4 w-4 absolute z-[1000]">
          <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
        </span>
        <div>
          <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
            Search
          </label>
          <div className="smart-search relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <input
              type="search"
              onChange={(e) => {
                setSearchKeyword(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  startSearch();
                }
              }}
              autoComplete="off"
              id="default-search"
              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search by topic, keyword, or region"
              required
            />
          </div>

          <div
            className={`bg-white drop-shadow-md h-72 overflow-y-auto ${
              showSearchPanel ? '' : 'hidden'
            }`}
          >
            <div className="bg-gray-500 text-white px-2 py-1">Topic</div>
            <div className="topik-search-section">
              {onLoading ? (
                <LoadingInline />
              ) : (
                <ul>
                  {searchResultTopic?.map((v, i) => (
                    <li
                      key={i}
                      onClick={() => {
                        localStorage.setItem('topic_id', v.id);
                        localStorage.setItem('topic_name', v.name);
                        setLoadingModal(true);
                        window.location.reload();
                      }}
                      className="px-2 py-1 hover:bg-gray-200"
                    >
                      {v.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="bg-gray-500 text-white px-2 py-1">Keyword</div>
            <div className="keyword-search-section">
              {onLoading ? (
                <LoadingInline />
              ) : (
                <ul>
                  {searchResultKeyword?.map((v, i) => (
                    <li
                      onClick={() => {
                        localStorage.setItem('keyword', v.label);
                        setLoadingModal(true);
                        window.location.reload();
                      }}
                      key={i}
                      className="px-2 py-1 hover:bg-gray-200"
                    >
                      {v.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="bg-gray-500 text-white px-2 py-1">Region</div>
            <div className="daerah-search-section">
              {onLoading ? (
                <LoadingInline />
              ) : (
                <ul>
                  {searchResultDaerah?.map((v, i) => (
                    <li
                      onClick={() => {
                        gotoDaerahBound(
                          Number(v.daerah_code),
                          Number(v.daerah_level),
                        );
                      }}
                      key={i}
                      className="px-2 py-1 hover:bg-gray-200"
                    >
                      {daerahLevel[Number(v.daerah_level)]} {v.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <LoadingModal modalOpen={loadingModal} />
    </div>
  );
};

export default SmartSearchBar;
