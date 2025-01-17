import {useState} from 'react';
import {useLocation} from 'react-router-dom';
import MainLogo from '../assets/logo-putih.png';
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import {initializeApp} from 'firebase/app';
import {FIREBASE_CONFIG} from '../common/Constant';
import {authLoginGoogle, getIsPremiumUser} from '../repositories/Auth';
import Swal from 'sweetalert2';
import LoadingModal from './LoadingModal';
import {getTokenPayload} from '../common/Jwt';
import MyCollectionManagementModal from './MyCollectionManagementModal';

const Navbar = () => {
  const location = useLocation();

  const [burgerOpen, setBurgertOpen] = useState<boolean>(false);

  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [accountToken, setAccountToken] = useState<string | undefined | null>(
    localStorage.getItem('auth_token'),
  );
  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const [myCollectionManagementModal, setMyCollectionManagementModal] =
    useState<boolean>(false);

  const openMyCollectioonModal = () => {
    setMyCollectionManagementModal(true);
  };

  const handleOnLogedin = (user: any) => {
    setLoadingModal(true);
    const credential = GoogleAuthProvider.credentialFromResult(user);
    const token = credential?.accessToken;
    const authRequest = JSON.stringify({
      token: token,
      email: user.user.email,
    });
    console.log(authRequest);

    authLoginGoogle(authRequest)
      .then((response) => {
        localStorage.setItem('auth_token', response.data.data);
        localStorage.setItem('avatar', user.user.photoURL);
        localStorage.setItem('user_name', user.user.displayName);
        setAccountToken(response.data.data);
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
        window.location.reload();
      });
  };

  const openLoginGoogleDialog = () => {
    setAuthModalOpen(false);

    const app = initializeApp(FIREBASE_CONFIG);
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
    provider.addScope('https://www.googleapis.com/auth/userinfo.email');

    signInWithPopup(getAuth(app), provider)
      .then((result) => {
        console.log(result);
        handleOnLogedin(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <header>
      <nav
        style={{backgroundColor: '#ffc200', zIndex: 10000}}
        className={`bg-white border-gray-200 px-4 lg:px-6 dark:bg-gray-800 ${
          location.pathname !== '/klkl' ? 'fixed' : ''
        } w-full drop-shadow-md`}
      >
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <a href="/" className="flex items-center">
            <img
              src={MainLogo}
              className="mr-3 h-10 sm:h-16 my-1"
              alt="IDRESEARCH Logo"
            />
            <span className="main-logo self-center text-xl font-semibold whitespace-nowrap dark:text-white"></span>
          </a>

          <div className="flex items-center lg:order-2">
            <div
              onClick={() => {
                setBurgertOpen(!burgerOpen);
              }}
              className="flex lg:hidden mr-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </div>

            <a href="/#/" className="text-black mr-8">
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                ></path>
              </svg>
            </a>

            {accountToken ? (
              <div
                onClick={() => {
                  setAuthModalOpen(true);
                }}
                className="ml-4 rounded-full h-10 w-10 border-2 border-gray-500 self-center"
                style={{
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundImage: `url("${localStorage.getItem('avatar')}")`,
                }}
              >
                <svg
                  className="w-9 h-9"
                  style={{color: '#00000024'}}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthModalOpen(true);
                }}
                className="text-[#ffc200] font-extrabold bg-black hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
              >
                Login
              </button>
            )}
          </div>

          <div
            className={`${
              burgerOpen ? '' : 'hidden'
            } justify-between items-center w-full lg:flex lg:w-auto lg:order-1`}
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <a
                  href="/#/peta"
                  className="block py-2 pl-3 pr-4 text-black rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-500 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Map
                </a>
              </li>

              <li>
                <a
                  href="https://ijddi.net"
                  className="block py-2 pl-3 pr-4 text-black rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-500 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  IJDDI
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div
        style={{zIndex: 20000, backgroundColor: '#21233c7d'}}
        aria-hidden="true"
        className={`${
          authModalOpen ? 'block' : 'hidden'
        } flex items-center overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full drop-shadow-lg`}
      >
        <div className="flex-auto"></div>

        <div className="flex-none relative p-4 w-full max-w-md h-full md:h-auto">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button
              type="button"
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
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
              <span className="sr-only">Tutup</span>
            </button>
            <div className="py-6 px-6 lg:px-8">
              {!localStorage.getItem('auth_token') ? (
                <form className="space-y-6" action="#">
                  <a
                    onClick={() => openLoginGoogleDialog()}
                    className="cursor-default my-5 flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                  >
                    <span className="flex-1 whitespace-nowrap">
                      Login/Register with Google
                    </span>
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </a>
                </form>
              ) : (
                <form className="space-y-6" action="#">
                  <a
                    onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}
                    className="cursor-default my-5 flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                  >
                    <span className="flex-1 whitespace-nowrap">Logout</span>
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      ></path>
                    </svg>
                  </a>
                  {getTokenPayload()?.role !== 'ADM' ? (
                    <a
                      onClick={() => {
                        getIsPremiumUser(getTokenPayload()?.email as string)
                          .then((res) => {
                            if (res.data?.data) {
                              openMyCollectioonModal();
                            } else {
                              Swal.fire(
                                'information',
                                'anda tidak memiliki akses untuk menggunakan fitur ini',
                              );
                            }
                          })
                          .catch((err) => {
                            Swal.fire('Gagal', 'Gagal mendapatkan user info');
                          });
                      }}
                      className="cursor-default my-5 flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                    >
                      <span className="flex-1 whitespace-nowrap">
                        Koleksi Saya
                      </span>
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        ></path>
                      </svg>
                    </a>
                  ) : (
                    <a
                      onClick={() => {
                        window.location.href = '/#/statistik';
                        setAuthModalOpen(false);
                      }}
                      className="cursor-default my-5 flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                    >
                      <span className="flex-1 whitespace-nowrap">
                        Admin Dashboard
                      </span>
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        ></path>
                      </svg>
                    </a>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
        <div className="flex-auto"></div>
      </div>
      <LoadingModal modalOpen={loadingModal} />
      <MyCollectionManagementModal
        modalOpen={myCollectionManagementModal}
        onModalClosed={() => {
          setMyCollectionManagementModal(false);
        }}
      />
    </header>
  );
};

export default Navbar;
