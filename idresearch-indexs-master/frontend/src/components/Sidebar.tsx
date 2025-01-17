import {useLocation} from 'react-router-dom';
import {getTokenPayload} from '../common/Jwt';

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-52 mt-16" aria-label="Sidebar">
      <div className="overflow-y-auto py-4 px-3 bg-gray-50 rounded dark:bg-gray-800 h-screen fixed w-52 z-[1000]">
        <ul className="space-y-2">
          <li>
            <a
              href="/#/statistik"
              className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white ${
                location.pathname === '/statistik'
                  ? 'bg-primary-400'
                  : 'hover:bg-primary-400'
              } dark:hover:bg-primary-700`}
            >
              <svg
                aria-hidden="true"
                className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
              </svg>
              <span className="ml-3">Statistics</span>
            </a>
          </li>
          {getTokenPayload()?.role === 'ADM' ? (
            <>
              <li>
                <a
                  href="/#/admin/scraper"
                  className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white ${
                    location.pathname === '/admin/scraper'
                      ? 'bg-primary-400'
                      : 'hover:bg-primary-400'
                  } dark:hover:bg-primary-700`}
                >
                  <svg
                    aria-hidden="true"
                    className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path>
                    <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path>
                  </svg>
                  <span className="flex-1 ml-3 whitespace-nowrap">Scraper</span>
                </a>
              </li>
              <li>
                <a
                  href="/#/admin/literatures"
                  className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white ${
                    location.pathname === '/admin/literatures'
                      ? 'bg-primary-400'
                      : 'hover:bg-primary-400'
                  } dark:hover:bg-primary-700`}
                >
                  <svg
                    aria-hidden="true"
                    className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Literatures
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="/#/admin/topik"
                  className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white ${
                    location.pathname === '/admin/topik'
                      ? 'bg-primary-400'
                      : 'hover:bg-primary-400'
                  } dark:hover:bg-primary-700`}
                >
                  <svg
                    aria-hidden="true"
                    className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="flex-1 ml-3 whitespace-nowrap">Topic</span>
                </a>
              </li>
              <li>
                <a
                  href="/#/admin/users"
                  className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white ${
                    location.pathname === '/admin/users'
                      ? 'bg-primary-400'
                      : 'hover:bg-primary-400'
                  } dark:hover:bg-primary-700`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    ></path>
                  </svg>
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Users
                  </span>
                </a>
              </li>
            </>
          ) : null}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
