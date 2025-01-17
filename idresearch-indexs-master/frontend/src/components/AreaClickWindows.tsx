import {useEffect, useState} from 'react';
import {AreaModalParam} from '../common/TypesModel';
import Window from '../internals/floating-window-ui/Window';
import Research from './areamodal/Research';
import Statistik from './areamodal/Statistik';
import Terkini from './areamodal/Terkini';

interface IAreaClickModalProps {
  modalParam: AreaModalParam | null;
  showModal: boolean;
  onCloseModal: () => void;
}

const AreaClickWindows = ({
  showModal = false,
  modalParam = null,
  onCloseModal = () => {},
}: IAreaClickModalProps) => {
  const [windows, setWindows] = useState<JSX.Element[]>([]);
  const [clock, setClock] = useState<number>(0);

  useEffect(() => {
    setInterval(() => {
      if (localStorage.getItem('link')) {
        const idd = new Date().getTime().toString();
        const newArticleWindow = (
          <Window
            id={idd}
            height={400}
            width={400}
            top={70}
            resizable={true}
            titleBar={{
              title: `(Literatur) ${localStorage.getItem('link')}`,
              buttons: {
                minimize: true,
                close: () => {
                  document?.getElementById(idd)?.remove();
                },
              },
            }}
          >
            <div className="h-screen">
              <a target="_blank" href={localStorage.getItem('link') || ''}>
                Buka di tab baru
              </a>
              <iframe
                className="w-full h-screen"
                src={localStorage.getItem('link') ?? ''}
              >
                Loading...
              </iframe>
            </div>
          </Window>
        );

        setWindows((windows) => [...windows, newArticleWindow]);
        localStorage.removeItem('link');
      }
    }, 500);
  }, [0]);

  useEffect(() => {
    if (modalParam) {
      if (localStorage.getItem('modal_mode') === 'window') {
        const newWindowResearch = (
          <Window
            id={genResearchModalId()}
            height={400}
            width={400}
            top={70}
            resizable={true}
            titleBar={{
              title: `(Research) ${modalParam.areaLabel}`,
              buttons: {
                minimize: true,
                close: () => {
                  document?.getElementById(genResearchModalId())?.remove();
                },
              },
            }}
          >
            <div className="h-screen">
              <Research
                areaParam={modalParam}
                onLiteratureClicked={(link) => {}}
              />
            </div>
          </Window>
        );

        const newWindowStatistik = (
          <Window
            id={genStatistikModalId()}
            height={400}
            width={400}
            top={100}
            resizable={true}
            titleBar={{
              title: `(Statistik)  ${modalParam.areaLabel}`,
              buttons: {
                minimize: true,
                close: () => {
                  document?.getElementById(genStatistikModalId())?.remove();
                },
              },
            }}
          >
            <div className="h-screen">
              <Statistik areaParam={modalParam} />
            </div>
          </Window>
        );

        const newWindowNews = (
          <Window
            id={genNewsModalId()}
            height={400}
            width={400}
            top={130}
            resizable={true}
            titleBar={{
              title: `(Berita)  ${modalParam.areaLabel}`,
              buttons: {
                minimize: true,
                close: () => {
                  document?.getElementById(genNewsModalId())?.remove();
                },
              },
            }}
          >
            <div className="h-screen">
              <Terkini areaParam={modalParam} />
            </div>
          </Window>
        );

        const finale = windows.concat([
          newWindowResearch,
          newWindowStatistik,
          newWindowNews,
        ]);

        setWindows(finale);

        console.log('windows total', modalParam);
        onCloseModal();
      }
    }
  }, [modalParam]);

  const genResearchModalId = () => {
    return `${modalParam?.areaCode}-${modalParam?.areaLabel}-${
      modalParam?.areaLevel
    }-${localStorage.getItem('keyword')}-${localStorage.getItem(
      'topic_id',
    )}-research`;
  };

  const genStatistikModalId = () => {
    return `${modalParam?.areaCode}-${modalParam?.areaLabel}-${
      modalParam?.areaLevel
    }-${localStorage.getItem('keyword')}-${localStorage.getItem(
      'topic_id',
    )}-statistik`;
  };

  const genNewsModalId = () => {
    return `${modalParam?.areaCode}-${modalParam?.areaLabel}-${
      modalParam?.areaLevel
    }-${localStorage.getItem('keyword')}-${localStorage.getItem(
      'topic_id',
    )}-news`;
  };

  return (
    <div
      id="drawer-information"
      style={{zIndex: 10000, marginTop: '70px'}}
      className={`fixed w-full px-4 py-1  dark:bg-gray-800 `}
    >
      {windows}
    </div>
  );
};

export default AreaClickWindows;
