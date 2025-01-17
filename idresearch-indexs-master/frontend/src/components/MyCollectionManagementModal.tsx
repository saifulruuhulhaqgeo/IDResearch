import {useEffect, useMemo, useState} from 'react';
import Swal from 'sweetalert2';
import {CollectionPayload} from '../common/TypesModel';
import {
  createCollectionFolder,
  deleteCollectionFromFolder,
  deleteCollectionToFolder,
  getCollectionFromFolder,
  getMyFolders,
  saveCollectionToFolder,
} from '../repositories/CollectionFolder';
import CitationModal from './CitationModal';
import CitationModalOutsideMap from './CitationModalOutsideMap';
import LoadingModal from './LoadingModal';
import OnComponentLoading from './OnComponentLoading';
import ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';

import * as Excel from 'exceljs';
import moment from 'moment';

const logoBase64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAAA8CAMAAADR2113AAABxVBMVEVHcEz/xgD/xAwAAAABAAD/xQr/ExMEAAD9EhL/rQb/FRX4EhL/ExP/ExMAAAD/xAr/xwX/FRUEAAAAAAD/yAb/xgn/yAb/xwT/xwEAAAD/FBT/EhICAAD/xQj/xwT/xwb/FBT/EhP/xwP/xwIAAAAAAAAAAAD/xgD/xwL/xgX/xgD/xwH/FBT/xQv/ExP/FBT/xwIAAAAAAAAAAAD/FBT/xQX/ExP/xgD/xwMAAAAAAAAAAAD/FBT/xAb/xgD/ExP/xwH/FRX/xgD/FBQAAAAFBQT/FRUAAAAAAAD/xQr/FBT/FRX/FBT/FBT/FBT/xgD/xwP/xgAAAAD/wwv/FBT/yQ0AAAD/xwP/FRX/FBT/FRX/FRUAAAD/FBQAAAD/tCn/syz/xQj/yQ3/FRX/FRX/FRUAAAD7FBT/tif/wwn/tCz/FBSfDAz/si7/syz/sy0AAAAAAAA/BAT/tSf/tSn/si6kDQ3/sg3/xgD/yQz/si//yw3/zQ3/tgz/wQv/uxr/tibyvwztugz/yAaYeAktJAbltQynhAr3ww04LAbBmAr/sytpUwijgQqtiQp9YwjWqQyHagnSpgtgTAhCNQdJOgesiAqpH0CzAAAAd3RSTlMA+D8oCAUSMAUC1A5BGmMLmL8X/g83x9BzNpoKDxt8aSsWKhPxg7Pe2ljo9CUmOWmjH3Oiiy8x/atObHpGIV8f7OXkbUT/yI08sJ+nV46USoqCA1BM5Vm734Xw9MFiynWV8PXqufzceavA+IAmwfHT1ewq2WfsTQITQ6kAAAVASURBVFjD7Zf3VxpZFMcfdWboEClDH5qgSBVQwI6ADUsUNfaImrabmN3smYEcxBKTWGKSLX/vvmGEgCQ5ayA/rd8DnDkPzme+3HfvfXcAuNOd/gfClBrjtPSnkDWDJMmSWb/yDa9J9HQnSct4c91i7BnbZGPNoGVlMqm+YdvVTpIH+VcbTTjn9TDodkPdsnIYrhVL+Se/N+F6lkEv1m0kz1deLJ7nnxt+HG1x0hBWf92ioZ25YbH0hN2EbfbiVicr4qtzZ+lg0GSkeL+ZjWxTKmdgREJWpcvkYhvopDA4r9FkJ7vJDAxBl071FkVRD50yJXYdJVoq6+1pUoNBWrttxxRVoGgVFozT6qpp1+1tzjx2Oh8b+ypo2TFVI7qKtiLwY9h025rB+q8zwDnNLJgeUnUiyTG2SeYzhm7t2bVVvP7Dw+VdUi7QgagIXh+PWX9s0/p+y5eKNduEySDt3enp6bujU/oTwhelc1xat0Vv5PP5g2s0q79NGqJNvzt5c3L48a+/P59dnRWoh2y9xCHBYzH/91HivRG0toofQXSpkgMdapWaDu/rt6Mnr4/evD8sfHrzsUAZgeSeBGTvpb6PFibltWjpL7VoWuWcq6Bf/zP6qUD5yuje0RTgIrgf+BGOAvjTOBf48V6ciyTwXg4Xx/06eS68Zv7P6A+jf1LUGETHELtdMWe3I46E3c/pTTuQVABxILFdTsAWXQ2mAnjwpVwwL5cLq6m3WRNrMhJpRF9QVA9ER/UxB4ezn+KsB184okhwl2NfxYPp2D4SteFZu02SXkfkcrRbwK/avv8kf17JkEGTy+SrR1+OXhYoGROQe7G0LeVHkMC6zbG6i3M4iWDWDtH7CAxWdM4vlOfq0NJHBxUyOUP3PrpgCpejJwWIPjq8uDgsUKYyGrcFFet2wE0k9FlH6oUCKIL7MBp4wIYAzm4AKF7eQIMuVYXcQ5eGVQXJhx8u3h59vro6OzuD5AWLXrIa1euDDg4ewxPpLAdPKAK9OJJdD0hWs1EHDkCvHU8/02aEdWjQJ6MbcqR9lik6E9OXyiXJvGUYXTJzgPvH3sgzxbM1j14PwJxCgQKFHr6YYtIruJhOB+rRAAuZZo39XZXC76xvIZS6q1oT8p0MinqZ/BrQTn4lt2+gq7K6NPf7OyKDdeTjL6ODcC254wUiAugGxEC0sscX84ViAuUTgO/mA6FY7Ca6BWJCjDa2k8UIyWKxZtmqGjBJyqo/4ItEQ9siESHOiJYn4ytPzbnxgYkJ/qR3vjs85REJuqdy44KBp17hN6YQHw8YZhaqYDiVWLosVoxBg7WdpJdYXnIvJ+cfjIDl7fDT7bDHk9SCidz8yshkRivwjOgaw8EcJz1wkMEsmjGVWqVilZtWe0eHWqZk0OjUTlKcG4rHJ+MQbR7KeLenROEHWmxiaO2BF6CZoZzA3HiKMVnoY84SXpu1rW2WVa3TDg0P8OMAEDkBMbUkBqgHokFmSKRdChMC6Do5v+KlF/ZWxhtjrSkfgLUDAW/mS29haYBoGW5/eILvHo+7PWbBOAE84zpRRgcmM+bMvGgJup4ShLVL8Ubbs8OdThOv4W6VNsAm3HQYB1AgNLt1WNijAyiffsE1sxgQbjGGDriFBLxuPCa7lH31g5O6tif6ao5drMmJBEyzatHDfS0c5Wvj0YLh6dtoVivR/XXowVDryFhosDz9HpRKJdjVVdYWui5P7QfneVrnRU1Ln8hC7fAh5lqPW2maPjqHK+jnIdBiKcd+pcGvHlla/5gqZW9sbm4oeeBOd7rTT9S/r47iaBUonZ4AAAAASUVORK5CYII=';

const MyCollectionManagementModal = ({
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
  const [collectionListViewShow, setCollectionListViewShow] =
    useState<boolean>(false);

  const [citationModalOpen, setCitationModalOpen] = useState<boolean>(false);
  const [articleId, setArticleId] = useState<string>('');
  const [selectedCollectionName, setSelectedCollectionName] =
    useState<string>('');

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

  const getMyCollectionFromFolder = (folderId: string) => {
    setIsFoldersLoading(true);
    getCollectionFromFolder(folderId)
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
  return (
    <>
      <div
        style={{zIndex: 20000, backgroundColor: '#21233c7d'}}
        aria-hidden="true"
        className={`${
          modalOpen ? 'block' : 'hidden'
        } flex items-center overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full text-xs drop-shadow-xl`}
      >
        <div className="flex-auto"></div>

        <div className="flex-none relative p-4 w-full max-w-5xl h-full md:h-auto">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {modalCreateMode ? 'Buat koleksi baru' : 'Koleksi Saya'}
              </h3>
              <button
                onClick={() => {
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
                      className="py-2 px-3 text-xs font-medium text-center text-[#ffc200] bg-black rounded-lg hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
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
                    className={`flex-none ${
                      collectionListViewShow ? '' : 'hidden'
                    }`}
                  >
                    <div
                      onClick={() => {
                        setCollectionListViewShow(false);
                        getMyCollectionFolders();
                      }}
                      className="w-full text-white flex text-sm items-center bg-primary-700 p-2  rounded-md drop-shadow-sm hover:drop-shadow-lg mx-1 cursor-default"
                    >
                      <svg
                        className="w-5 h-5 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        ></path>
                      </svg>
                    </div>
                  </div>

                  <div
                    className={`flex-none ml-2 ${
                      collectionListViewShow ? '' : 'hidden'
                    }`}
                  >
                    <div
                      onClick={async () => {
                        const workbook = new ExcelJS.Workbook();
                        const sheet = workbook.addWorksheet('Meta Table', {
                          headerFooter: {
                            firstHeader: 'Hello Exceljs',
                            firstFooter: 'Hello World',
                          },
                        });

                        workbook.worksheets[0].mergeCells('D1:H1');
                        workbook.worksheets[0].getCell(
                          'D1',
                        ).value = `IDRESEARCH export koleksi: ${selectedCollectionName}`;

                        let wd = workbook.worksheets[0];

                        wd.getCell('D3').value = 'Tanggal';

                        wd.getCell('E3').value = moment().format('DD/MM/YYYY');

                        wd.getRow(7).getCell('C').value = 'No';
                        wd.getColumn('C').width = 5;

                        wd.getRow(7).getCell('D').value = 'Judul';
                        wd.getColumn('D').width = 40;
                        wd.getColumn('D').alignment = {wrapText: true};

                        wd.getRow(7).getCell('E').value = 'Author';
                        wd.getColumn('E').width = 32;
                        wd.getColumn('E').alignment = {wrapText: true};

                        wd.getRow(7).getCell('F').value = 'Tahun';
                        wd.getColumn('F').width = 10;

                        wd.getRow(7).getCell('G').value = 'Link';
                        wd.getColumn('G').width = 32;
                        wd.getColumn('G').alignment = {wrapText: true};

                        folders?.map((v, i) => {
                          wd.getRow(8 + i).getCell('C').value = i + 1;

                          wd.getRow(8 + i).getCell('D').value = JSON.parse(
                            v.information_payload,
                          ).title;

                          wd.getRow(8 + i).getCell('E').value = JSON.parse(
                            v.information_payload,
                          ).author;

                          wd.getRow(8 + i).getCell('F').value = JSON.parse(
                            v.information_payload,
                          ).year;

                          wd.getRow(8 + i).getCell('G').value = JSON.parse(
                            v.information_payload,
                          ).links[0];
                        });

                        const imageId2 = workbook.addImage({
                          base64: logoBase64,
                          extension: 'png',
                        });

                        workbook.worksheets[0].addImage(imageId2, 'A1:B5');

                        const buffer2 = await workbook.xlsx.writeBuffer();
                        const blob2 = new Blob([buffer2], {
                          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        });
                        saveAs(
                          blob2,
                          `${selectedCollectionName}-${moment()}-meta.xlsx`,
                        );
                      }}
                      className="w-full text-white flex text-sm items-center bg-primary-700 p-2  rounded-md drop-shadow-sm hover:drop-shadow-lg mx-1 cursor-default"
                    >
                      <svg
                        className="w-5 h-5 mx-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                        ></path>
                      </svg>
                      Download
                    </div>
                  </div>

                  <div className="flex-auto"></div>

                  <div className="flex-none">
                    <div
                      onClick={() => setModalCreateMode(true)}
                      className="w-full text-[#ffc200] flex text-sm items-center bg-black p-2  rounded-md drop-shadow-sm hover:drop-shadow-lg mx-1 cursor-default"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
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
                </div>
                {collectionListViewShow ? (
                  <div className="w-full overflow-y-scroll h-52">
                    <OnComponentLoading isLoading={isFoldersLoading} />
                    {folders.length > 0 ? '' : <p>Koleksi Kosong</p>}
                    {!isFoldersLoading
                      ? folders?.map((v, i) => (
                          <div
                            key={i}
                            className="text-sm w-full bg-gray-50 p-4 my-2 rounded-md drop-shadow-sm hover:drop-shadow-lg mx-1 cursor-default"
                          >
                            <div className="flex items-center">
                              <div
                                className="flex-none w-11/12"
                                onClick={() => {
                                  setCollectionListViewShow(true);
                                }}
                              >
                                <p className="w-11/12 font-bold underline">
                                  {JSON.parse(v.information_payload).title ??
                                    ''}
                                </p>
                                <p className="w-11/12 text-xs">
                                  {JSON.parse(v.information_payload)
                                    .description ?? ''}
                                </p>

                                <p className="w-11/12 text-xs">
                                  {JSON.parse(v.information_payload).year ?? ''}
                                  {JSON.parse(v.information_payload).author ??
                                    ''}
                                </p>

                                <button
                                  onClick={() => {
                                    setArticleId(
                                      JSON.parse(v.information_payload).id ??
                                        '',
                                    );
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
                                  Sitasi
                                </button>
                                <button
                                  onClick={() => {
                                    Swal.fire({
                                      title: 'Kondirmasi Hapus',
                                      text: 'Apakah anda yakin menghapus koleksi ?',
                                      icon: 'warning',
                                      showCancelButton: true,
                                      confirmButtonColor: '#3085d6',
                                      cancelButtonColor: '#d33',
                                      cancelButtonText: 'Batal',
                                      confirmButtonText: 'Hapus',
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                        setLoadingModal(true);
                                        deleteCollectionFromFolder(v.id)
                                          .then(() => {
                                            Swal.fire(
                                              'Terhapus!',
                                              'Koleksi berhasil dihapus',
                                              'success',
                                            );
                                          })
                                          .catch((err) => {
                                            Swal.fire(
                                              'Gagal!',
                                              'Koleksi gagal dihapus',
                                              'error',
                                            );
                                            console.log(err);
                                          })
                                          .finally(() => {
                                            getMyCollectionFromFolder(
                                              v.folder_id,
                                            );
                                            setLoadingModal(false);
                                          });
                                      }
                                    });
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
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    ></path>
                                  </svg>
                                  Hapus dari koleksi
                                </button>
                              </div>
                              <div className="flex-auto"></div>
                            </div>
                          </div>
                        ))
                      : null}
                  </div>
                ) : (
                  <div className="w-full overflow-y-scroll h-52">
                    <OnComponentLoading isLoading={isFoldersLoading} />
                    {!isFoldersLoading
                      ? folders?.map((v, i) => (
                          <div
                            key={i}
                            className="text-sm w-full bg-gray-50 p-4 my-2 rounded-md drop-shadow-sm hover:drop-shadow-lg mx-1 cursor-default"
                          >
                            <div className="flex items-center">
                              <div
                                className="flex-none hover:underline"
                                onClick={() => {
                                  setSelectedCollectionName(v.name);
                                  setCollectionListViewShow(true);
                                  getMyCollectionFromFolder(v.id);
                                }}
                              >
                                {v.name}
                              </div>
                              <div className="flex-auto"></div>
                              <div
                                onClick={() => {
                                  Swal.fire({
                                    title: 'Kondirmasi Hapus',
                                    text: 'Apakah anda yakin menghapus koleksi ?',
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    cancelButtonText: 'Batal',
                                    confirmButtonText: 'Hapus',
                                  }).then((result) => {
                                    if (result.isConfirmed) {
                                      setLoadingModal(true);
                                      deleteCollectionToFolder(v.id)
                                        .then(() => {
                                          Swal.fire(
                                            'Terhapus!',
                                            'Koleksi berhasil dihapus',
                                            'success',
                                          );
                                        })
                                        .catch((err) => {
                                          Swal.fire(
                                            'Gagal!',
                                            'Koleksi gagal dihapus',
                                            'error',
                                          );
                                          console.log(err);
                                        })
                                        .finally(() => {
                                          getMyCollectionFolders();
                                          setLoadingModal(false);
                                        });
                                    }
                                  });
                                }}
                                className="flex-none hover:bg-red-200 rounded-md"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  ></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        ))
                      : null}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex-auto"></div>
      </div>
      <LoadingModal modalOpen={loadingModal} />
      <CitationModalOutsideMap
        modalOpen={citationModalOpen}
        onModalClosed={() => {
          setCitationModalOpen(false);
        }}
        articleId={articleId}
      />
    </>
  );
};
export default MyCollectionManagementModal;
