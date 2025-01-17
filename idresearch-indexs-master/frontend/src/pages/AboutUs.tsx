import moment from 'moment';
import React, {useEffect, useState} from 'react';
import MainLogo from '../assets/logo-kuning.png';
import AmcoLogo from '../assets/logo-amcolabora-HD.png';
import AmcolaboraLogo from '../assets/logo-amcolabora-HD.png';
import SmartSearchBar from '../components/SmartSearchBar';
import SmartSearchBarNoLeaflet from '../components/SmartSearchBarNoLeaflet';
import BgMap from '../assets/red-map.png';

const AboutUs = () => {
  const [scrolledToBottom, setScrolledToBottom] = useState<boolean>(false);

  useEffect(() => {
    window.onscroll = function () {
      if (
        window.innerHeight + Math.ceil(window.pageYOffset) >=
        document.body.offsetHeight
      ) {
        setScrolledToBottom(true);
      } else {
        setScrolledToBottom(false);
      }
    };
  }, [0]);

  return (
    <>
      <div className="flex">
        <div className="flex-none"></div>
        <div className="felx-auto mt-24 w-full">
          <div className="flex">
            <div className="flex-auto"></div>
            <div className="flex-none w-3/4 md:w-1/2">
              <h2 className="text-2xl font-bold mb-2">About US</h2>
              <p>
                <b>ID Research Network</b> is a webGIS based search engine
                portal for local and international scientific works, which is
                affiliated and powered by <b>Amcolabora Institute</b>, as our
                contribution to the scientific and development of the research.{' '}
                <b>ID Research Network</b>
                also provides a simple way to broadly search scientific
                literature. From one place, as our mission is to simplify and
                bring the scholarly gap closer, so you can search a variety of
                disciplines and sources: articles, theses, books, abstracts and
                court opinions, from academic publishers, professional
                communities, online repositories, universities and other
                websites easier, related to our Motto{' '}
                <b>“Bridge That Gap with Research”</b>
              </p>
              <div className="h-10"></div>
              <h2 className="text-2xl font-bold mb-2">Document Rank</h2>
              <p>
                <b>ID Research Network</b> ranks documents as researchers do, by
                whom they are indexed, considering the full text of each
                document, where it was published, by whom it was written, and
                how often and how recently it is cited in other scientific
                literature
              </p>

              <div className="h-10"></div>
              <h2 className="text-2xl font-bold mb-2">
                ID Research Network Features
              </h2>
              <ul>
                <li>
                  {' '}
                  ● Search all scholarly literature indexed nationally and
                  internationally, and (even) not indexed{' '}
                </li>
                <li>
                  {' '}
                  ● Explore related works, citations, authors, and publications{' '}
                </li>
                <li> ● Save your last recent explore </li>
                <li> ● Map Scraping </li>
                <li> ● GIS Mapping (Indonesia based) </li>
                <li> ● Print favorite citations or documents </li>
              </ul>
            </div>

            <div className="flex-auto"></div>
          </div>
          <div className="p-4"></div>
        </div>
      </div>

      <footer className="px-4  dark:bg-gray-900 bg-gray-500">
        <div className="md:flex md:justify-between">
          <img
            src={MainLogo}
            className="mr-3 h-24  md:hidden "
            alt="ID Research Logo"
          />
          <div className="mb-6 md:mb-0 flex  items-center w-full mr-6 ">
            <a href="https://explore.idresearch.net/" className=" ">
              <img
                src={MainLogo}
                className="mr-3 w-52  hidden md:block"
                alt="ID Research Logo"
              />
            </a>
            <div className="text-white ml-4 border-r-[#ffc200] md:border-r-4 md:border-t-0 md:border-l-0 md:border-b-0 h-16">
              ID Research Network is a WebGIS based search engine portal for
              local and international scientific works, which is affiliated and
              powered by Amcolabora Institute, as our contribution to the
              scientific and development of the research
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:gap-6 sm:grid-cols-1">
            <div className="ml-4 md:ml-0">
              <ul className="inline-flex  w-full mt-14">
                <li>
                  <a
                    target="_blank"
                    href="https://instagram.com/amcolabora?igshid=YmMyMTA2M2Y="
                  >
                    <img
                      className="cursor-pointer"
                      alt="svgImg"
                      src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMzAiIGhlaWdodD0iMzAiCnZpZXdCb3g9IjAsMCwyNTYsMjU2IgpzdHlsZT0iZmlsbDojMDAwMDAwOyI+CjxnIGZpbGw9IiNmY2M0MTkiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxnIHRyYW5zZm9ybT0ic2NhbGUoOC41MzMzMyw4LjUzMzMzKSI+PHBhdGggZD0iTTkuOTk4MDUsM2MtMy44NTksMCAtNi45OTgwNSwzLjE0MTk1IC02Ljk5ODA1LDcuMDAxOTV2MTBjMCwzLjg1OSAzLjE0MTk1LDYuOTk4MDUgNy4wMDE5NSw2Ljk5ODA1aDEwYzMuODU5LDAgNi45OTgwNSwtMy4xNDE5NSA2Ljk5ODA1LC03LjAwMTk1di0xMGMwLC0zLjg1OSAtMy4xNDE5NSwtNi45OTgwNSAtNy4wMDE5NSwtNi45OTgwNXpNMjIsN2MwLjU1MiwwIDEsMC40NDggMSwxYzAsMC41NTIgLTAuNDQ4LDEgLTEsMWMtMC41NTIsMCAtMSwtMC40NDggLTEsLTFjMCwtMC41NTIgMC40NDgsLTEgMSwtMXpNMTUsOWMzLjMwOSwwIDYsMi42OTEgNiw2YzAsMy4zMDkgLTIuNjkxLDYgLTYsNmMtMy4zMDksMCAtNiwtMi42OTEgLTYsLTZjMCwtMy4zMDkgMi42OTEsLTYgNiwtNnpNMTUsMTFjLTIuMjA5MTQsMCAtNCwxLjc5MDg2IC00LDRjMCwyLjIwOTE0IDEuNzkwODYsNCA0LDRjMi4yMDkxNCwwIDQsLTEuNzkwODYgNCwtNGMwLC0yLjIwOTE0IC0xLjc5MDg2LC00IC00LC00eiI+PC9wYXRoPjwvZz48L2c+Cjwvc3ZnPg=="
                    />
                  </a>
                </li>

                <li>
                  <a target="_blank" href="https://m.facebook.com/amcolabora/">
                    <img
                      alt="svgImg"
                      src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMzAiIGhlaWdodD0iMzAiCnZpZXdCb3g9IjAsMCwyNTYsMjU2IgpzdHlsZT0iZmlsbDojMDAwMDAwOyI+CjxnIGZpbGw9IiNmY2M0MTkiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxnIHRyYW5zZm9ybT0ic2NhbGUoOC41MzMzMyw4LjUzMzMzKSI+PHBhdGggZD0iTTE1LDNjLTYuNjI3LDAgLTEyLDUuMzczIC0xMiwxMmMwLDYuMDE2IDQuNDMyLDEwLjk4NCAxMC4yMDYsMTEuODUydi04LjY3MmgtMi45Njl2LTMuMTU0aDIuOTY5di0yLjA5OWMwLC0zLjQ3NSAxLjY5MywtNSA0LjU4MSwtNWMxLjM4MywwIDIuMTE1LDAuMTAzIDIuNDYxLDAuMTQ5djIuNzUzaC0xLjk3Yy0xLjIyNiwwIC0xLjY1NCwxLjE2MyAtMS42NTQsMi40NzN2MS43MjRoMy41OTNsLTAuNDg3LDMuMTU0aC0zLjEwNnY4LjY5N2M1Ljg1NywtMC43OTQgMTAuMzc2LC01LjgwMiAxMC4zNzYsLTExLjg3N2MwLC02LjYyNyAtNS4zNzMsLTEyIC0xMiwtMTJ6Ij48L3BhdGg+PC9nPjwvZz4KPC9zdmc+"
                    />
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    href="https://twitter.com/amcolabora?s=21&t=C6pr60gZsTYUlZktRyfjSA"
                  >
                    <img
                      className="cursor-pointer"
                      alt="svgImg"
                      src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMzAiIGhlaWdodD0iMzAiCnZpZXdCb3g9IjAsMCwyNTYsMjU2IgpzdHlsZT0iZmlsbDojMDAwMDAwOyI+CjxnIGZpbGw9IiNmY2M0MTkiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxnIHRyYW5zZm9ybT0ic2NhbGUoOC41MzMzMyw4LjUzMzMzKSI+PHBhdGggZD0iTTI4LDYuOTM3Yy0wLjk1NywwLjQyNSAtMS45ODUsMC43MTEgLTMuMDY0LDAuODRjMS4xMDIsLTAuNjYgMS45NDcsLTEuNzA1IDIuMzQ1LC0yLjk1MWMtMS4wMywwLjYxMSAtMi4xNzIsMS4wNTUgLTMuMzg4LDEuMjk1Yy0wLjk3MywtMS4wMzcgLTIuMzU5LC0xLjY4NSAtMy44OTMsLTEuNjg1Yy0yLjk0NiwwIC01LjMzNCwyLjM4OSAtNS4zMzQsNS4zMzRjMCwwLjQxOCAwLjA0OCwwLjgyNiAwLjEzOCwxLjIxNWMtNC40MzMsLTAuMjIyIC04LjM2MywtMi4zNDYgLTEwLjk5NSwtNS41NzRjLTAuNDU4LDAuNzg4IC0wLjcyMSwxLjcwNCAtMC43MjEsMi42ODNjMCwxLjg1IDAuOTQxLDMuNDgzIDIuMzcyLDQuNDM5Yy0wLjg3NCwtMC4wMjggLTEuNjk3LC0wLjI2OCAtMi40MTYsLTAuNjY3YzAsMC4wMjMgMCwwLjA0NCAwLDAuMDY3YzAsMi41ODUgMS44MzgsNC43NDEgNC4yNzksNS4yM2MtMC40NDcsMC4xMjIgLTAuOTE5LDAuMTg3IC0xLjQwNiwwLjE4N2MtMC4zNDMsMCAtMC42NzgsLTAuMDM0IC0xLjAwMywtMC4wOTVjMC42NzksMi4xMTkgMi42NDksMy42NjIgNC45ODMsMy43MDVjLTEuODI1LDEuNDMxIC00LjEyNSwyLjI4NCAtNi42MjUsMi4yODRjLTAuNDMsMCAtMC44NTUsLTAuMDI1IC0xLjI3MywtMC4wNzVjMi4zNjEsMS41MTMgNS4xNjQsMi4zOTYgOC4xNzcsMi4zOTZjOS44MTIsMCAxNS4xNzYsLTguMTI4IDE1LjE3NiwtMTUuMTc3YzAsLTAuMjMxIC0wLjAwNSwtMC40NjEgLTAuMDE1LC0wLjY5YzEuMDQzLC0wLjc1MyAxLjk0OCwtMS42OTIgMi42NjMsLTIuNzYxeiI+PC9wYXRoPjwvZz48L2c+Cjwvc3ZnPg=="
                    />
                  </a>
                </li>
                <li className="cursor-pointer">
                  <a
                    target="_blank"
                    href="https://www.youtube.com/c/AMCOLABORA"
                  >
                    {' '}
                    <img
                      className="cursor-pointer"
                      alt="svgImg"
                      src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMzAiIGhlaWdodD0iMzAiCnZpZXdCb3g9IjAsMCwyNTYsMjU2IgpzdHlsZT0iZmlsbDojMDAwMDAwOyI+CjxnIGZpbGw9IiNmY2M0MTkiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxnIHRyYW5zZm9ybT0ic2NhbGUoOC41MzMzMyw4LjUzMzMzKSI+PHBhdGggZD0iTTE1LDRjLTQuMTg2LDAgLTkuNjE5MTQsMS4wNDg4MyAtOS42MTkxNCwxLjA0ODgzbC0wLjAxMzY3LDAuMDE1NjNjLTEuOTA2NTIsMC4zMDQ5MSAtMy4zNjcxOSwxLjk0MzE3IC0zLjM2NzE5LDMuOTM1NTV2NnYwLjAwMTk1djUuOTk4MDV2MC4wMDE5NWMwLjAwMzg0LDEuOTY1NjQgMS40MzUzLDMuNjM3MTkgMy4zNzY5NSwzLjk0MzM2bDAuMDAzOTEsMC4wMDU4NmMwLDAgNS40MzMxNCwxLjA1MDc4IDkuNjE5MTQsMS4wNTA3OGM0LjE4NiwwIDkuNjE5MTQsLTEuMDUwNzggOS42MTkxNCwtMS4wNTA3OGwwLjAwMTk1LC0wLjAwMTk1YzEuOTQzODksLTAuMzA1NTQgMy4zNzY4MywtMS45Nzk1MSAzLjM3ODkxLC0zLjk0NzI3di0wLjAwMTk1di01Ljk5ODA1di0wLjAwMTk1di02Yy0wLjAwMjg4LC0xLjk2NjM4IC0xLjQzNDU3LC0zLjYzOTAzIC0zLjM3Njk1LC0zLjk0NTMxbC0wLjAwMzkxLC0wLjAwNTg2YzAsMCAtNS40MzMxNCwtMS4wNDg4MyAtOS42MTkxNCwtMS4wNDg4M3pNMTIsMTAuMzk4NDRsOCw0LjYwMTU2bC04LDQuNjAxNTZ6Ij48L3BhdGg+PC9nPjwvZz4KPC9zdmc+"
                    />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      <footer className="px-4 py-2  bg-[#212121]">
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-white sm:text-center dark:text-white hidden md:block">
            © {moment().year()}{' '}
            <a href="https://www.amcolabora.or.id" className="hover:underline">
              Amcolabora
            </a>
            . All Rights Reserved.
          </span>

          <div>
            <div className="inline-flex justify-center w-full">
              <div className="flex-auto"></div>

              <div className="flex-none">
                <ul className="text-white dark:text-gray-400 inline-flex">
                  <li className="mb-0 mx-2">
                    <a
                      href="/#/about-us"
                      className="hover:underline hover:text-[#ffc200]"
                    >
                      About Us
                    </a>
                  </li>
                  <li className="mb-0 mx-2">
                    <a
                      href="/#/privacy-policy"
                      className="hover:underline hover:text-[#ffc200]"
                    >
                      Privacy Policy
                    </a>
                  </li>

                  <li className="mb-0 mx-2">
                    <a
                      href="https://www.amcolabora.or.id/contact/"
                      className="hover:underline hover:text-[#ffc200]"
                    >
                      Help
                    </a>
                  </li>
                </ul>
              </div>

              <div className="flex-auto"></div>
            </div>
          </div>

          <span className="text-sm text-white text-center dark:text-white block md:hidden">
            © {moment().year()}{' '}
            <a href="https://www.amcolabora.or.id" className="hover:underline">
              Amcolabora
            </a>
            . All Rights Reserved.
          </span>

          <div className="flex mt-1 md:mt-0">
            <div className="flex-auto md:hidden"></div>

            <span className="text-white text-sm flex-none mr-1 mt-1">
              {' '}
              Powered by
            </span>
            <img
              src={AmcoLogo}
              className="mr-3 h-7  md:block flex-none mt-0"
              alt="ID Research Logo"
            />
            <div className="flex-auto md:hidden"></div>
          </div>
        </div>
      </footer>

      <button
        onClick={() => {
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        }}
        className={`${
          scrolledToBottom ? '' : 'hidden'
        } fixed animate-bounce top-20 right-10  md:right-20  bg-black text-[#ffc200] p-2 rounded-full hover:bg-gray-500  m-2`}
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
            d="M5 11l7-7 7 7M5 19l7-7 7 7"
          ></path>
        </svg>
      </button>

      <button
        onClick={() => {
          window.scrollTo(0, document.body.scrollHeight);
        }}
        className={`${
          scrolledToBottom ? 'hidden' : ''
        } fixed animate-bounce bottom-10 right-10  md:right-20 bg-black text-[#ffc200] p-2 rounded-full hover:bg-gray-500  m-2`}
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
            d="M19 13l-7 7-7-7m14-8l-7 7-7-7"
          ></path>
        </svg>
      </button>
    </>
  );
};

export default AboutUs;
