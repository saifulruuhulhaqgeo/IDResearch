import {Tooltip} from 'flowbite-react';
import React, {useEffect, useState} from 'react';
import {useMap} from 'react-leaflet';
import Swal from 'sweetalert2';
import {getCitation} from '../repositories/Research';

const CitationModal = ({
  modalOpen = false,
  onModalClosed = () => {},
  articleId = '',
}) => {
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

  const [citations, setCitations] = useState<any>();

  useEffect(() => {
    if (articleId != '') {
      getCitation(articleId)
        .then((res) => {
          console.log(res.data);
          setCitations(res.data?.data);
        })
        .catch((err) => {
          console.log(err);
          Swal.fire('Gagal', 'Gagala mendapatkan data sitasi', 'error');
        });
    }
  }, [modalOpen]);

  return (
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
      id="citeModal"
      style={{zIndex: 20005, backgroundColor: '#21233c7d'}}
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
              Citation
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
          {citations ? (
            <div className="h-52 overflow-y-auto">
              <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                <div className="flex-none font-bold w-16">MLA</div>
                <div className="flex-auto">{citations['MLA']}</div>
                <div className="flex-none font-bold w-16">
                  <Tooltip content="Copy" placement="bottom">
                    <button
                      className="ml-4"
                      onClick={() => {
                        navigator.clipboard.writeText(citations['MLA']);
                      }}
                    >
                      <svg
                        className="w-6 h-6 hover:bg-yellow-200 rounded-md"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </button>
                  </Tooltip>
                </div>
              </div>
              <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                <div className="flex-none font-bold w-16">APA</div>
                <div className="flex-auto">{citations['APA']}</div>
                <div className="flex-none font-bold w-16">
                  <Tooltip content="Copy" placement="bottom">
                    <button
                      className="ml-4"
                      onClick={() => {
                        navigator.clipboard.writeText(citations['APA']);
                      }}
                    >
                      <svg
                        className="w-6 h-6 hover:bg-yellow-200 rounded-md"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </button>
                  </Tooltip>
                </div>
              </div>
              <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                <div className="flex-none font-bold w-16">Chicago</div>
                <div className="flex-auto">{citations['Chicago']}</div>
                <div className="flex-none font-bold w-16">
                  <Tooltip content="Copy" placement="bottom">
                    <button
                      className="ml-4"
                      onClick={() => {
                        navigator.clipboard.writeText(citations['Chicago']);
                      }}
                    >
                      <svg
                        className="w-6 h-6 hover:bg-yellow-200 rounded-md"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </button>
                  </Tooltip>
                </div>
              </div>
              <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                <div className="flex-none font-bold w-16">Harvard</div>
                <div className="flex-auto">{citations['Harvard']}</div>
                <div className="flex-none font-bold w-16">
                  <Tooltip content="Copy" placement="bottom">
                    <button
                      className="ml-4"
                      onClick={() => {
                        navigator.clipboard.writeText(citations['Harvard']);
                      }}
                    >
                      <svg
                        className="w-6 h-6 hover:bg-yellow-200 rounded-md"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </button>
                  </Tooltip>
                </div>
              </div>

              <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                <div className="flex-none font-bold w-16">BibTeX</div>
                <div className="flex-auto">{citations['BibText']}</div>
                <div className="flex-none font-bold w-16">
                  <Tooltip content="Copy" placement="bottom">
                    <button
                      className="ml-4"
                      onClick={() => {
                        navigator.clipboard.writeText(citations['BibText']);
                      }}
                    >
                      <svg
                        className="w-6 h-6 hover:bg-yellow-200 rounded-md"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex-auto"></div>
    </div>
  );
};
export default CitationModal;
