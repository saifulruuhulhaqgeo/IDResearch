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
import ErrorModal from '../ErrorModal';
import FilterModal from '../FilterModal';
import ResearchPager from './ResearchPager';
import ResearchSkeleton from './ResearchSkeleteon';

interface ResearchComponentProps {
  areaParam: AreaModalParam;
  onLiteratureClicked: (link: string) => void;
}

const ResearchNoMap = ({
  areaParam,
  onLiteratureClicked,
}: ResearchComponentProps) => {
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
      anyTopic: true,
      topicId: '',
      dataSource: dataSource,
    };
    let customKeyword = localStorage.getItem('keyword_override') ?? '';

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
  useEffect(() => {
    fetcResearchs();
  }, [pageNow, filter, areaParam, dataSource]);

  return (
    <>
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
        }}
        onMouseLeave={() => {
          console.log('onleave');
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
          </div>
        ))}
        <div className="h-80"></div>
      </div>
      <FilterModal
        modalOpen={filterModalOpen}
        onModalClosed={() => setFilterModalOpen(false)}
        onFilterApplied={(filter) => setFilter(filter)}
      />
    </>
  );
};

export default ResearchNoMap;
