import {useEffect, useState} from 'react';
import {useMap} from 'react-leaflet';
import {AreaModalParam} from '../common/TypesModel';
import Research from './areamodal/Research';
import Statistik from './areamodal/Statistik';
import Terkini from './areamodal/Terkini';

interface IAreaClickModalProps {
  modalParam: AreaModalParam | null;
  showModal: boolean;
  onCloseModal: () => void;
  onLiteratureClick: (link: string) => void;
}

const menus = [
  {
    label: 'Research',
    alias: 'Research',
    icon: (
      <svg
        className="mr-2 w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeWidth="2"
          d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
        ></path>
      </svg>
    ),
  },
  {
    label: 'Statistik',
    alias: 'Statistics',
    icon: (
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeWidth="2"
          d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
        ></path>
        <path
          strokeWidth="2"
          d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
        ></path>
      </svg>
    ),
  },

  {
    label: 'Terkini',
    alias: 'News',
    icon: (
      <svg
        className="mr-2 w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeWidth="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        ></path>
      </svg>
    ),
  },
];

const AreaClickModal = ({
  showModal = false,
  modalParam = null,
  onCloseModal = () => {},
  onLiteratureClick,
}: IAreaClickModalProps) => {
  const [currentMenu, setCurrentMenu] = useState<string>('Research');

  const mainMap = useMap();

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!showModal) {
      mainMap.scrollWheelZoom.enable();
      mainMap.doubleClickZoom.enable();
      mainMap.dragging.enable();
    } else {
      mainMap.scrollWheelZoom.disable();
      mainMap.doubleClickZoom.disable();
      mainMap.dragging.disable();
    }
  }, [showModal]);

  const renderMenuView = (areaParam: AreaModalParam) => {
    if (currentMenu === 'Terkini') {
      return <Terkini areaParam={areaParam} />;
    } else if (currentMenu === 'Research') {
      return (
        <Research
          areaParam={areaParam}
          onLiteratureClicked={(link) => onLiteratureClick(link)}
        />
      );
    } else if (currentMenu === 'Statistik') {
      return <Statistik areaParam={areaParam} />;
    }
  };

  return (
    <div
      id="drawer-information"
      style={{zIndex: 10000, marginTop: '70px'}}
      className={`fixed w-full px-4 py-1 bg-white dark:bg-gray-800 ${
        showModal ? 'block' : 'hidden'
      }`}
      aria-labelledby="drawer-bottom-label"
    >
      <button
        type="button"
        onClick={() => {
          onCloseModal();
        }}
        data-drawer-dismiss="drawer-bottom-example"
        aria-controls="drawer-information"
        className="text-gray-400 mr-2- bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
      >
        <svg
          aria-hidden="true"
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
        <span className="sr-only">Close menu</span>
      </button>
      <div
        className="w-full mb-2 text-sm text-gray-500 dark:text-gray-400"
        style={{height: '100vh'}}
      >
        <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
          <ul
            className="flex flex-wrap -mb-px text-sm font-medium text-center"
            id="myTab"
            data-tabs-toggle="#myTabContent"
            role="tablist"
          >
            {menus.map((v, i) => (
              <li key={i} className="mr-2" role="presentation">
                <button
                  className={`flex p-2 ${
                    v.label === currentMenu ? 'text-primary-700' : ''
                  } rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 dark:border-transparent text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-700`}
                  onClick={() => {
                    setCurrentMenu(v.label);
                  }}
                  type="button"
                >
                  {v.icon}
                  {v.alias}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>{renderMenuView(modalParam!!)}</div>
      </div>
    </div>
  );
};

export default AreaClickModal;
