import {any} from '@amcharts/amcharts4/.internal/core/utils/Array';
import {useEffect, useState} from 'react';
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
  onClickSuggestion: (keyword: string) => void;
}

const daerahLevel: string[] = ['', 'Prov', 'Kab/Kota', 'Kec', 'Desa'];

const SmartSearchBarNoLeaflet = ({
  showModal = false,
  modalParam = null,
  onCloseModal = () => {},
  onClickSuggestion = (keyword: string) => {},
}: IAreaClickModalProps) => {
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

  return (
    <div>
      <div>
        <div>
          <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
            Search
          </label>

          <div className="flex">
            <div className="flex-auto">
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
            </div>

            <div className="flex-none">
              <button
                onClick={() => {
                  localStorage.removeItem('topic');
                  localStorage.removeItem('topic_id');
                  localStorage.setItem('keyword', searchKeyword);
                  window.location.href = '/#/peta';
                }}
                className="bg-black text-[#ffc200] h-full rounded-md px-2 ml-1 text-sm hover:bg-gray-800"
              >
                Search on Map
              </button>
            </div>
          </div>

          <div
            className={`bg-white drop-shadow-md h-72 overflow-y-auto ${
              showSearchPanel ? '' : 'hidden'
            }`}
          >
            <div className="keyword-search-section">
              {onLoading ? (
                <LoadingInline />
              ) : (
                <ul>
                  {searchResultKeyword?.map((v, i) => (
                    <li
                      onClick={() => {
                        localStorage.setItem('keyword_override', v.label);
                        onClickSuggestion(v.label);
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
          </div>
        </div>
      </div>

      <LoadingModal modalOpen={loadingModal} />
    </div>
  );
};

export default SmartSearchBarNoLeaflet;
