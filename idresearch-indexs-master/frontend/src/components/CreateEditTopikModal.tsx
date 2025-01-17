import {useEffect, useState} from 'react';
import Swal from 'sweetalert2';
import {Topic} from '../common/TypesModel';
import {createTopik, editTopik} from '../repositories/Research';

import LoadingModal from './LoadingModal';

const CreateEditTopikModal = ({
  modalOpen = false,
  editMode = false,
  onModalClosed = () => {},
  topic = {} as Topic,
}) => {
  const [loadingModal, setLoadingModal] = useState(false);
  const [title, settitle] = useState(topic.name);
  const [desc, setDesc] = useState(topic.description);

  useEffect(() => {
    settitle(topic.name);
    setDesc(topic.description);
  }, [topic]);

  const saveCreate = () => {
    setLoadingModal(true);
    onModalClosed();
    createTopik({
      name: title,
      description: desc,
    } as Topic)
      .then(() => {
        Swal.fire('Success adding topic!', '', 'success');
      })
      .catch((err) => {
        console.log(err);
        if (
          err.response.data.data ===
          'ERROR: duplicate key value violates unique constraint "topic_name" (SQLSTATE 23505)'
        ) {
          Swal.fire(
            'Failed topic!',
            `Topic already exist`,
            'error',
          );
        } else {
          Swal.fire(
            'Failed adding topic!',
            `${JSON.stringify(err.response.data.data)}`,
            'error',
          );
        }
      })
      .finally(() => setLoadingModal(false));
  };

  const saveEdit = () => {
    setLoadingModal(true);
    onModalClosed();
    editTopik({
      name: title,
      description: desc,
      id: topic.id,
    } as Topic)
      .then(() => {
        Swal.fire('Success edit topic!', '', 'success');
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoadingModal(false));
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

        <div className="flex-none relative p-4 w-full max-w-2xl h-full md:h-auto">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editMode ? 'Edit Topic' : 'Create Topic'} {editMode}
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
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-5 space-y-5">
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Topic
                </label>
                <input
                  onChange={(e) => settitle(e.target.value)}
                  type="text"
                  value={title}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                ></textarea>
              </div>

              <div className="mb-6 flex">
                <div className="flex-none">
                  <button
                    onClick={() => onModalClosed()}
                    type="button"
                    className="py-2 px-3 text-xs font-medium text-center text-white bg-gray-700 rounded-lg hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                  >
                    cancel
                  </button>
                </div>
                <div className="flex-auto"></div>
                <div className="flex-none">
                  <button
                    onClick={() => {
                      if (editMode) {
                        saveEdit();
                      } else {
                        saveCreate();
                      }
                    }}
                    type="button"
                    className="py-2 px-3 text-xs font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-auto"></div>
      </div>
      <LoadingModal modalOpen={loadingModal} />
    </>
  );
};
export default CreateEditTopikModal;
