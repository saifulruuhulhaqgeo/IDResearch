import L from 'leaflet';
import React, {useEffect, useState} from 'react';
import {useMap, FeatureGroup, Circle} from 'react-leaflet';

import {EditControl} from '../leaflet-drawing';

const SelectZoom = () => {
  const map = useMap();

  const ref = React.useRef<L.FeatureGroup>(null);

  const onDoneSelectZoom = () => {
    const geo: any = ref.current?.toGeoJSON();
    console.log(geo.features);
    if (geo.features.length > 0) {
      const zoomTarget = L.geoJSON(geo.features[0], {});
      map.fitBounds(zoomTarget.getBounds());
    }
    ref.current?.clearLayers();
  };

  return (
    <FeatureGroup ref={ref}>
      <EditControl
        position="bottomright"
        onEdited={() => {}}
        onCreated={() => {}}
        onDeleted={() => {}}
        onDrawStart={() => {
          console.log('select zoom start');
        }}
        onDrawStop={() => {
          console.log('select zoom end');
          onDoneSelectZoom();
        }}
        draw={{
          rectangle: true,
          circle: false,
          polyline: false,
          polygon: false,
          marker: false,
          circlemarker: false,
        }}
      />
    </FeatureGroup>
  );
};

export default SelectZoom;
