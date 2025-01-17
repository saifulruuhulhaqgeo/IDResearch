import {useEffect, useMemo, useState} from 'react';
import {useMap} from 'react-leaflet';
import Swal from 'sweetalert2';
import {CollectionPayload} from '../common/TypesModel';
import {
  createCollectionFolder,
  getMyFolders,
  saveCollectionToFolder,
} from '../repositories/CollectionFolder';
import LoadingModal from './LoadingModal';
import OnComponentLoading from './OnComponentLoading';

const MyCollectionModal = ({
  modalOpen = false,
  onModalClosed = () => {},
  collectionPayload = {} as CollectionPayload,
}) => {
  const [modalCreateMode, setModalCreateMode] = useState<boolean>(false);
  const [folderName, setFolderName] = useState<string>('');
  const [folderDesc, setFolderDesc] = useState<string>('');
  const [folderIsPublic, setFolderIsPublic] = useState<boolean>(false);
  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const [folders, setFolders] = useState<Array<any>>([]);
  const [isFoldersLoading, setIsFoldersLoading] = useState<boolean>(true);

  useEffect(() => {
    setModalCreateMode(false);
  }, [modalOpen]);

  useEffect(() => {
    if (!modalCreateMode && modalOpen) {
      getMyCollectionFolders();
    }
  }, [0, modalCreateMode, modalOpen]);

  const saveCollection = (folderId: string) => {
    setLoadingModal(true);

    saveCollectionToFolder(collectionPayload, folderId)
      .then((response) => {
        onModalClosed();
        Swal.fire('Success', 'Berhasil menyimpan ke koleksi', 'success');
      })
      .catch((err) => {
        console.log(err);
        Swal.fire(
          'Oops..',
          'Terjadi error, silahkan refresh halaman atau tunggu beberapa saat lagi',
          'warning',
        );
      })
      .finally(() => {
        setLoadingModal(false);
        disableMap();
      });
  };

  const getMyCollectionFolders = () => {
    setIsFoldersLoading(true);
    getMyFolders()
      .then((response) => {
        console.log(response.data.data);
        setFolders(response.data.data);
      })
      .catch((err) => {
        console.log(err);
        Swal.fire(
          'Oops..',
          'Terjadi error, silahkan refresh halaman atau tunggu beberapa saat lagi',
          'warning',
        );
      })
      .finally(() => {
        setIsFoldersLoading(false);
      });
  };

  const createNewFolder = () => {
    if (folderName === '') {
      Swal.fire('Oops..', 'Judul harus diisi', 'warning');
    } else {
      setLoadingModal(true);
      createCollectionFolder(folderName, folderDesc, folderIsPublic)
        .then((response) => {
          console.log(response.data);
        })
        .catch((err) => {
          console.log(err);
          Swal.fire(
            'Oops..',
            'Terjadi error, silahkan refresh halaman atau tunggu beberapa saat lagi',
            'warning',
          );
        })
        .finally(() => {
          setLoadingModal(false);
          setModalCreateMode(false);
        });
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

  return (
    <>
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
                {modalCreateMode ? 'Buat koleksi baru' : 'Simpan ke koleksi'}
              </h3>
              <button
                onClick={() => {
                  disableMap();

                  onModalClosed();
                }}
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
            {modalCreateMode ? (
              <div className="p-5 space-y-5">
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Judul Koleksi
                  </label>
                  <input
                    onChange={(e) => setFolderName(e.target.value)}
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Deskripsi
                  </label>
                  <textarea
                    onChange={(e) => setFolderDesc(e.target.value)}
                    rows={4}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  ></textarea>
                </div>

                <div className="mb-6 flex">
                  <div className="flex-none">
                    <button
                      onClick={() => setModalCreateMode(false)}
                      type="button"
                      className="py-2 px-3 text-xs font-medium text-center text-white bg-gray-700 rounded-lg hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                    >
                      batal
                    </button>
                  </div>
                  <div className="flex-auto"></div>
                  <div className="flex-none">
                    <button
                      onClick={() => createNewFolder()}
                      type="button"
                      className="py-2 px-3 text-xs font-medium text-center text-[#ffc200] bg-black rounded-lg hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 space-y-5">
                <div className="flex w-full">
                  <div
                    onClick={() => setModalCreateMode(true)}
                    className="w-full text-[#ffc200] flex text-sm items-center bg-black p-4 my-2 rounded-md drop-shadow-sm hover:drop-shadow-lg mx-1 cursor-default"
                  >
                    <svg
                      className="w-6 h-6 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                    Buat koleksi baru
                  </div>
                </div>
                <div className="w-full overflow-y-scroll h-52">
                  <OnComponentLoading isLoading={isFoldersLoading} />
                  {!isFoldersLoading
                    ? folders?.map((v, i) => (
                        <div
                          onClick={() => {
                            saveCollection(v.id);
                          }}
                          key={i}
                          className="text-sm w-full bg-gray-50 p-4 my-2 rounded-md drop-shadow-sm hover:drop-shadow-lg mx-1 cursor-default"
                        >
                          {v.name}
                        </div>
                      ))
                    : null}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex-auto"></div>
      </div>
      <LoadingModal modalOpen={loadingModal} />
    </>
  );
};
export default MyCollectionModal;
