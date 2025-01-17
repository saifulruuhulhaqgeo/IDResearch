import {useEffect, useState} from 'react';
import Swal from 'sweetalert2';
import {AreaModalParam, NewsData} from '../../common/TypesModel';
import {getTerkiniData} from '../../repositories/Research';
import ResearchSkeleton from './ResearchSkeleteon';

interface TerkiniComponentProps {
  areaParam: AreaModalParam;
}

const Terkini = ({areaParam}: TerkiniComponentProps) => {
  const [terkiniItems, setTerkiniItems] = useState<Array<NewsData>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    getTerkiniData(areaParam)
      .then((response) => {
        console.log(response.data.data);
        setTerkiniItems(response.data.data as Array<NewsData>);
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
  }, [areaParam]);

  return (
    <>
      {isLoading ? <ResearchSkeleton /> : null}
      <div className="h-screen overflow-y-auto">
        {terkiniItems?.map((v, i) => (
          <div className="bg-gray-50 p-4 my-2 rounded-md drop-shadow-md mx-1">
            <div className="flex">
              <div className="flex-auto">
                <a
                  target="_blank"
                  href={`https://${v.link}`}
                  className="font-bold w-10/12"
                >
                  {v.title}
                </a>
                <p className="text-xs text-green-500 w-10/12">
                  {v.site} | {v.date}
                </p>
              </div>
              <div className="flex-none w-10"></div>
            </div>
            <button
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
              simpan
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Terkini;
