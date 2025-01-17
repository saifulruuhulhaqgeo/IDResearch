import moment from 'moment';
import React from 'react';
import MainLogo from '../assets/logo-footer.png';
import AmcoLogo from '../assets/logo-amcolabora-HD.png';
import BgMap from '../assets/bg-map.png';
import AmcolaboraLogo from '../assets/logo-amcolabora-HD.png';
import SmartSearchBar from '../components/SmartSearchBar';
import SmartSearchBarNoLeaflet from '../components/SmartSearchBarNoLeaflet';

const Landing2 = () => {
  return (
    <>
      <div className="flex bg-gray-500">
        <div className="flex-none h-screen"></div>
        <div className="felx-auto mt-40 w-full">
          <div className="flex hidden md:inline-flex">
            <div className="flex-none ml-8 w-7/12">
              <div className=" w-10/12 text-white text-xl">
                <p>
                  ID Research Network is a WEBGIS search portal, national and
                  international indexed scientific works,
                </p>{' '}
                <p>which is affiliated and empowered by AMCOLABORA</p>{' '}
                <p>
                  as an effort to participate in academia and related research
                </p>
              </div>
              <img className="w-9/12 ml-4 mt-8" src={BgMap} />
            </div>
            <div className="flex-auto"></div>

            <div className="flex-none w-3/4 md:w-1/3 mr-8 mt-20">
              <div className="flex">
                <div className="flex-auto"></div>
                <img src={MainLogo} className="w-52 mb-[-25px]" />
                <div className="flex-auto"></div>
              </div>
            </div>
          </div>

          <div className="flex md:hidden px-4">
            <div className="flex-none w-full mt-5">
              <div className="flex">
                <div className="flex-auto"></div>
                <img src={MainLogo} className="w-52 mb-[-25px]" />
                <div className="flex-auto"></div>
              </div>

              <p className=" w-full text-white mt-5">
                ID Research Network is a WEBGIS search portal, national and
                international indexed scientific works, which is affiliated and
                empowered by AMCOLABORA as an effort to participate in academia
                and related research
              </p>
              <img className="w-full ml-4 mt-8" src={BgMap} />
            </div>
          </div>

          <div className="p-4"></div>
        </div>
      </div>

      <footer className="p-4 sm:p-6 dark:bg-black bg-[#262424]">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0 flex w-2/3"></div>
          <div className="grid grid-cols-3 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-white uppercase dark:text-white">
                Resources
              </h2>
              <ul className="text-white dark:text-gray-400">
                <li className="mb-2">
                  <a href="https://ijddi.net/" className="hover:underline">
                    IJDDI
                  </a>
                </li>
                <li className="mb-2">
                  <a href="https://amcolabora.org" className="hover:underline">
                    Amcolabora
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="https://www.amcolabora.or.id/about-us/"
                    className="hover:underline"
                  >
                    About Us
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-6 text-sm font-semibold text-white uppercase dark:text-white">
                Resources
              </h2>
              <ul className="text-white dark:text-gray-400">
                <li className="mb-2">
                  <a href="#" className="hover:underline">
                    Privacy Policy
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="https://www.amcolabora.or.id/organization/"
                    className="hover:underline"
                  >
                    Organization
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="https://www.amcolabora.or.id/contact/"
                    className="hover:underline"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-white uppercase dark:text-white">
                Follow us
              </h2>
              <ul className="text-white dark:text-gray-400">
                <li className="mb-2">
                  <a
                    href="https://instagram.com/amcolabora?igshid=YmMyMTA2M2Y="
                    className="hover:underline "
                  >
                    Instagram
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="https://m.facebook.com/amcolabora/"
                    className="hover:underline "
                  >
                    Facebook
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="https://twitter.com/amcolabora?s=21&t=C6pr60gZsTYUlZktRyfjSA"
                    className="hover:underline "
                  >
                    Twitter
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="https://www.youtube.com/c/AMCOLABORA"
                    className="hover:underline "
                  >
                    Youtube
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-0 border-gray-200 sm:mx-auto dark:border-gray-700 mt-2" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-white sm:text-center dark:text-white">
            © {moment().year()}{' '}
            <a href="https://www.amcolabora.or.id" className="hover:underline">
              Amcolabora
            </a>
            . All Rights Reserved.
          </span>
          <div className="flex">
            <span className="text-white text-sm flex-none mr-1 mt-1">
              {' '}
              Powered by
            </span>
            <img
              src={AmcoLogo}
              className="mr-3 h-7 hidden md:block flex-none mt-0"
              alt="ID Research Logo"
            />
          </div>
        </div>
      </footer>
    </>
  );
};

export default Landing2;
