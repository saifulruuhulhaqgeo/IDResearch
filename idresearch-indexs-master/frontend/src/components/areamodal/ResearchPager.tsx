import {useEffect, useState} from 'react';

const ResearchPager = ({
  pageNow = 1,
  totalPage = 1,
  onPageChanged = (page: number) => {},
  onSourceChanged = (source: string) => {},
}) => {
  const [pages, setPages] = useState<Array<number | string>>([]);

  useEffect(() => {
    let defaultPages = [];
    let limiting = 5;
    if (pageNow > 5) {
      limiting = limiting + (pageNow - limiting);
    }
    let x;
    for (pageNow > 5 ? (x = pageNow - 5) : (x = 0); x < limiting; x++) {
      defaultPages.push(x + 1);
    }
    defaultPages.push('...');

    if (totalPage < 6) {
      defaultPages = [];
      for (x = 0; x < totalPage; x++) {
        defaultPages.push(x + 1);
      }
    }

    if (totalPage > 5) {
      defaultPages.push(totalPage);
    }
    setPages(defaultPages);
  }, [pageNow, totalPage]);

  return (
    <div className="inline-flex w-full">
      <ul className="inline-flex items-center -space-x-px mt-2 cursor-default">
        <li>
          <a
            onClick={() => {
              onPageChanged(Number(pageNow - 1));
            }}
            className="block py-1 px-3 ml-0 leading-tight bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg
              aria-hidden="true"
              className="w-3 h-3"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </a>
        </li>
        {pages.map((v, i) => (
          <li key={i}>
            <a
              onClick={() => {
                if (v !== '...') {
                  onPageChanged(Number(v));
                }
              }}
              className={`block py-0.5 px-2 leading-tight bg-white border ${
                v === pageNow
                  ? 'border-primary-700 border-2'
                  : 'border-gray-200'
              } hover:bg-gray-200 hover:text-gray-700`}
            >
              {v}
            </a>
          </li>
        ))}

        <li>
          <a
            onClick={() => {
              onPageChanged(Number(pageNow + 1));
            }}
            className="block py-1 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg
              aria-hidden="true"
              className="w-3 h-3"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </a>
        </li>
      </ul>
      <ul className="inline-flex items-center -space-x-px mt-2 cursor-default gap-1">
        <li
          onClick={() => onSourceChanged('all')}
          className="bg-black border-2 border-black rounded-md px-2  text-[#ffc200] hover:bg-gray-800 ml-4"
        >
          All
        </li>
        <li
          onClick={() => onSourceChanged('Google Scholar')}
          className="bg-black border-2 border-black rounded-md px-2 mr-2 text-[#ffc200] hover:bg-gray-800"
        >
          Scholar
        </li>

        <li
          onClick={() => onSourceChanged('Doaj')}
          className="bg-black border-2 border-black rounded-md px-2 mr-2 text-[#ffc200] hover:bg-gray-800"
        >
          Doaj
        </li>
        <li
          onClick={() => onSourceChanged('Crossref')}
          className="bg-black border-2 border-black rounded-md px-2 mr-8 text-[#ffc200] hover:bg-gray-800 mx-2"
        >
          Crossref
        </li>
      </ul>
    </div>
  );
};

export default ResearchPager;
