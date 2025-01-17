import L from 'leaflet';
import React, {useEffect, useState} from 'react';
import {useMap, FeatureGroup, Circle} from 'react-leaflet';
import australia from '../assets/australian-states.json';
import malaysia from '../assets/malaysia.json';
import pnew from '../assets/pnew.json';
import phipiphina from '../assets/philiphina.json';
import thailand from '../assets/thailand.json';
import vietname from '../assets/vietname.json';
import zee from '../assets/zee2.json';
import zee1 from '../assets/zee1.json';
import zee3 from '../assets/zee3.json';
import zee4 from '../assets/zee4.json';
import kontinen1 from '../assets/kontinen1.json';
import kontinen2 from '../assets/kontinen2.json';
import kontinen3 from '../assets/kontinen3.json';
import kontinen4 from '../assets/kontinen4.json';

const Toolbox = () => {
  const [topicId, setTopicId] = useState<string | null>(
    localStorage.getItem('topic_id'),
  );
  const [topicName, setTopicName] = useState<string | null>(
    localStorage.getItem('topic_name'),
  );
  const [keyword, setKeyword] = useState<string | null>(
    localStorage.getItem('keyword'),
  );

  const [startZoomPoint, setStartZoomPoint] = useState<L.LatLng | null>();
  const [cursorLatLng, setCursorLatLng] = useState<L.LatLng | null>();

  const map = useMap();

  useEffect(() => {
    const indonesiaBound = L.latLngBounds(
      L.latLng(-11.58403969992537, 95.9282184048987),
      L.latLng(5.363014817607512, 142.86911977644638),
    );

    map.setMinZoom(map.getBoundsZoom(indonesiaBound));
    map.setMaxBounds(indonesiaBound);

    const foreignShapes: Array<any> = [
      australia,
      malaysia,
      pnew,
      phipiphina,
      thailand,
      vietname,
    ];

    const zeeLine: Array<any> = [zee, zee1, zee3, zee4];
    zeeLine.forEach((line) => {
      L.geoJSON(line, {
        style: {
          color: 'green',
          weight: 1,
          opacity: 1,
          fillOpacity: 1,
          fillColor: 'white',
        },
      }).addTo(map);
    });

    const kontinenLine: Array<any> = [
      kontinen1,
      kontinen2,
      kontinen3,
      kontinen4,
    ];
    kontinenLine.forEach((line) => {
      L.geoJSON(line, {
        style: {
          color: 'orange',
          weight: 1,
          opacity: 1,
          fillOpacity: 1,
          fillColor: 'white',
        },
      }).addTo(map);
    });

    foreignShapes.forEach((shape) => {
      L.geoJSON(shape, {
        style: {
          color: 'white',
          weight: 1,
          opacity: 1,
          fillOpacity: 1,
          fillColor: 'white',
        },
      }).addTo(map);
    });

    L.control.scale({position: 'bottomright'}).addTo(map);
    L.control.zoom({position: 'bottomright'}).addTo(map);


    map.scrollWheelZoom.disable();
    map.doubleClickZoom.disable();
    map.dragging.disable();
  }, [0]);

  return (
    <div className={`mt-20 leaflet-top leaflet-left`}>
      <div className="leaflet-control leaflet-bar">
        <div className="map-information bg-white rounded-md py-1 px-4">
          Show Map with Topic :{' '}
          {topicName ? topicName : 'All Topic'} | Keyword :{' '}
          {keyword ? keyword : 'Without Keyword'}
          {topicName || keyword ? (
            <span
              onClick={() => {
                localStorage.removeItem('topic_id');
                localStorage.removeItem('topic_name');
                localStorage.removeItem('keyword');
                window.location.reload();
              }}
              className="ml-2 text-blue-500 font-bold cursor-pointer"
            >
              <u>reset</u>
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Toolbox;
