import {useEffect, useState} from 'react';
import {ResearchFilter, ResearchTopic} from '../common/TypesModel';
import {getAllTopic} from '../repositories/Research';

const FilterModal = ({
  modalOpen = false,
  onModalClosed = () => {},
  onFilterApplied = (filter: ResearchFilter) => {},
}) => {
  const [startYear, setStartYear] = useState<number>(0);
  const [endYear, setendyear] = useState<number>(3000);
  const [isAnyYear, setIsAnyYear] = useState<boolean>(true);
  const [isAnyTopic, setisAnyTopic] = useState<boolean>(true);
  const [topicId, setTopicId] = useState<string>('');

  const [topics, setTopics] = useState<Array<ResearchTopic>>([]);

  useEffect(() => {
    getAllTopic()
      .then((response) => {
        console.log(response.data.data);
        setTopics(response.data.data as Array<ResearchTopic>);
        console.log(topics);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [0, modalOpen]);

  const applyFilter = () => {
    const filter = {
      anyTopic: isAnyTopic,
      anyYear: isAnyYear,
      startYear: startYear,
      endYear: endYear,
      topicId: topicId,
    } as ResearchFilter;
    console.log(filter);
    onFilterApplied(filter);
    onModalClosed();
  };

  return (
    <div
      id="filterModal"
      style={{zIndex: 20000, backgroundColor: '#21233c7d'}}
      aria-hidden="true"
      className={`${
        modalOpen ? 'block' : 'hidden'
      } flex items-center overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full text-xs drop-shadow-xl`}
    >
      <div className="flex-auto"></div>

      <div className="flex-none relative p-4 w-full max-w-2xl h-full md:h-auto">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Filter
            </h3>
            <button
              onClick={() => onModalClosed()}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="filterModal"
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex">
              <div className={` ${isAnyYear ? 'hidden' : ''} mr-2`}>
                <label className="block mb-2 text-xs font-medium text-gray-900 dark:text-gray-300">
                  Tahun awal
                </label>
                <input
                  type="number"
                  value={startYear}
                  onChange={(e) => setStartYear(Number(e.target.value))}
                  disabled={isAnyYear}
                  id="first_name"
                  className={`bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5`}
                  required
                />
              </div>
              <div className={` ${isAnyYear ? 'hidden' : ''} mr-2`}>
                <label className="block mb-2 text-xs font-medium text-gray-900 dark:text-gray-300">
                  Tahun akhir
                </label>
                <input
                  type="number"
                  onChange={(e) => setendyear(Number(e.target.value))}
                  value={endYear}
                  disabled={isAnyYear}
                  id="first_name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                  required
                />
              </div>
              <div className={` ${isAnyTopic ? 'hidden' : ''} mr-2 flex-auto`}>
                <label className="block mb-2 text-xs font-medium text-gray-900 dark:text-gray-300">
                  Topik
                </label>
                <select
                  id="countries"
                  onChange={(e) => setTopicId(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                >
                  <option value="any" selected>
                    Semua topik
                  </option>
                  {topics?.map((v, i) => (
                    <option key={i} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="remember"
                  checked={isAnyYear}
                  onChange={(e) => {
                    console.log(e.currentTarget.checked);
                    setIsAnyYear(e.currentTarget.checked);
                    if (e.currentTarget.checked) {
                      setStartYear(0);
                      setendyear(0);
                    }
                  }}
                  type="checkbox"
                  value=""
                  className="w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-primary-300"
                  required
                />
              </div>
              <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-400">
                Semua Tahun
              </label>

              <div className="ml-5 flex items-center h-5">
                <input
                  id="remember"
                  checked={isAnyTopic}
                  onChange={(e) => {
                    console.log(e.currentTarget.checked);
                    setisAnyTopic(e.currentTarget.checked);
                  }}
                  type="checkbox"
                  value=""
                  className="w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-primary-300"
                  required
                />
              </div>
              <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-400">
                Semua Topik
              </label>
            </div>
          </div>
          <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
            <div className="flex-auto"></div>
            <div className="flex-none">
              <button
                onClick={() => applyFilter()}
                data-modal-toggle="defaultModal"
                type="button"
                className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Aplikasikan
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-auto"></div>
    </div>
  );
};
export default FilterModal;
