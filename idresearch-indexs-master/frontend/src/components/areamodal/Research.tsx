import {useEffect, useState} from 'react';
import {useMap} from 'react-leaflet';
import Swal from 'sweetalert2';
import {getTokenPayload} from '../../common/Jwt';
import {
  AreaModalParam,
  CollectionPayload,
  ResearchData,
  ResearchFilter,
} from '../../common/TypesModel';
import {getIsPremiumUser} from '../../repositories/Auth';
import {getResearchData} from '../../repositories/Research';
import CitationModal from '../CitationModal';
import ErrorModal from '../ErrorModal';
import FilterModal from '../FilterModal';
import MyCollectionModal from '../MyCollectioModal';
import ResearchPager from './ResearchPager';
import ResearchSkeleton from './ResearchSkeleteon';

interface ResearchComponentProps {
  areaParam: AreaModalParam;
  onLiteratureClicked: (link: string) => void;
}

const Research = ({areaParam, onLiteratureClicked}: ResearchComponentProps) => {
  const [researchItems, setResearchItems] = useState<Array<ResearchData>>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [totalFound, setTotalFound] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [filter, setFilter] = useState<ResearchFilter>({
    anyYear: true,
    startYear: 0,
    endYear: 5050,
    anyTopic: true,
    topicId: '',
    dataSource: 'all',
  });
  const [dataSource, setDataSource] = useState<string>('all');
  const [pageNow, setPageNow] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);
  const [collectionModalOpen, setCollectionModalOpen] =
    useState<boolean>(false);
  const [collectionPayload, setCollectionPayload] = useState<CollectionPayload>(
    {} as CollectionPayload,
  );

  const [citationModalOpen, setCitationModalOpen] = useState<boolean>(false);
  const [articleId, setArticleId] = useState<string>('');

  const fetcResearchs = () => {
    setIsLoading(true);

    let filterCustom: ResearchFilter = {
      anyYear: true,
      startYear: 0,
      endYear: 5050,
      anyTopic: localStorage.getItem('topic_id') === null,
      topicId: localStorage.getItem('topic_id') ?? '',
      dataSource: dataSource,
    };
    let customKeyword = localStorage.getItem('keyword') ?? '';

    if (areaParam) {
      getResearchData(pageNow, areaParam, filterCustom, customKeyword)
        .then((response) => {
          console.log(response.data.data);
          setPageNow(response.data.data.page_now);
          setTotalFound(response.data.data.total_found);
          setTotalPage(response.data.data.total_page);

          setResearchItems(response.data.data.lists as Array<ResearchData>);
        })
        .catch((error) => {
          console.log(error);
          Swal.fire(
            'Oops..',
            'Terjadi error, silahkan refresh halaman atau tunggu beberapa saat lagi',
            'warning',
          );
        })
        .finally(() => setIsLoading(false));
    }
  };
  const mainMap = useMap();
  const disableMap = () => {
    mainMap.scrollWheelZoom.disable();
    mainMap.doubleClickZoom.disable();
    mainMap.dragging.disable();
  };

  const enableMap = () => {
    mainMap.scrollWheelZoom.enable();
    mainMap.doubleClickZoom.enable();
    mainMap.dragging.enable();
  };

  useEffect(() => {
    fetcResearchs();
  }, [pageNow, filter, areaParam, dataSource]);

  return (
    <>
      <div className="flex">
        <div className="bg-white rounded-md py-1">
          Showing data by topic :{' '}
          {localStorage.getItem('topic_name') ?? 'All Topic'} | Keyword :{' '}
          {localStorage.getItem('keyword') ?? 'No Keyword'}
        </div>
      </div>
      <ResearchPager
        pageNow={pageNow}
        totalPage={totalPage}
        onPageChanged={(page) => {
          if (!isLoading) {
            setPageNow(page);
          }
        }}
        onSourceChanged={(source) => {
          setDataSource(source);
        }}
      />
      {isLoading ? <ResearchSkeleton /> : null}

      {researchItems?.length === 0 || !researchItems ? (
        <div className="flex h-5/6 mt-10">
          <div className="m-auto">
            <h3>Data tidak di temukan</h3>
          </div>
        </div>
      ) : null}

      <div
        onMouseEnter={() => {
          console.log('onhover');
          disableMap();
        }}
        onMouseLeave={() => {
          console.log('onleave');
          enableMap();
          //disableMap()
        }}
        className="h-screen overflow-y-auto"
      >
        {researchItems?.map((v, i) => (
          <div
            key={i}
            className="bg-gray-50 p-4 my-2 rounded-md drop-shadow-md mx-1 cursor-default"
          >
            <div className="flex">
              <div className="flex-auto">
                <a
                  target="_blank"
                  onClick={() => {
                    localStorage.removeItem('link');
                    console.log('add window');
                    localStorage.setItem('link', v.links[0]);
                    onLiteratureClicked(v.links[0]);
                  }}
                  className="font-bold w-10/12"
                >
                  {v.title}
                </a>
                <p className="text-xs text-green-500 w-10/12">
                  {v.author}, {v.year} | {new URL(v.links[0]).host}
                </p>
                <p className="text-xs xl:w-10/12">{v.description}</p>
              </div>
              <div className="flex-none w-10"></div>
              <div className="flex-none">
                <button
                  data-tooltip-target="tooltip-default"
                  type="button"
                  className="text-gray-800 bg-[#ffc200] hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-xs px-2 py-2 text-center "
                >
                  {v.source}
                </button>
                <div
                  id="tooltip-default"
                  role="tooltip"
                  className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700"
                >
                  sumber: {v.source}
                  <div className="tooltip-arrow" data-popper-arrow></div>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                if (localStorage.getItem('auth_token')) {
                  getIsPremiumUser(getTokenPayload()?.email as string)
                    .then((res) => {
                      if (res.data?.data) {
                        setCollectionPayload({
                          collectionType: '',
                          collectionData: v,
                        } as CollectionPayload);
                        setCollectionModalOpen(true);
                      } else {
                        Swal.fire(
                          'Information',
                          'Anda tidak memiliki akses untuk menggunakan fitur ini',
                        );
                      }
                    })
                    .catch((err) => {
                      Swal.fire(
                        'Information',
                        'Gagal mendapatkan info user, pastikan anda telah login dan terdaftar',
                      );
                    });
                } else {
                  Swal.fire(
                    'Login',
                    'Untuk menyimpan silahkan login terlebih dahulu',
                    'warning',
                  );
                }
              }}
              type="button"
              className="mt-1 text-gray-800 focus:ring-0 focus:outline-none focus:ring-gray-500 font-light rounded-lg text-xs py-1 text-center inline-flex items-center mr-2 "
            >
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                ></path>
              </svg>
              Save
            </button>
            <button
              onClick={() => {
                setArticleId(v.id);
                setCitationModalOpen(true);
              }}
              type="button"
              className="mt-1 text-gray-800 focus:ring-0 focus:outline-none focus:ring-gray-500 font-light rounded-lg text-xs py-1 text-center inline-flex items-center mr-2 "
            >
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                ></path>
              </svg>
              Citation
            </button>
          </div>
        ))}
        <div className="h-80"></div>
      </div>
      <FilterModal
        modalOpen={filterModalOpen}
        onModalClosed={() => setFilterModalOpen(false)}
        onFilterApplied={(filter) => setFilter(filter)}
      />
      <MyCollectionModal
        modalOpen={collectionModalOpen}
        onModalClosed={() => setCollectionModalOpen(false)}
        collectionPayload={collectionPayload}
      />
      <CitationModal
        modalOpen={citationModalOpen}
        onModalClosed={() => {
          setCitationModalOpen(false);
        }}
        articleId={articleId}
      />
    </>
  );
};

export default Research;
