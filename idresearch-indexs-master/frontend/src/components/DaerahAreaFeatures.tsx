import {geoJSON, GeoJSONOptions, GeoJSON, Layer, LeafletEvent} from 'leaflet';
import {useEffect, useState} from 'react';
import {useMapEvents} from 'react-leaflet';
import {AreaModalParam} from '../common/TypesModel';
import {getDaerahGeoJson} from '../repositories/DaerahGeojson';

let daerahLayer: GeoJSON;

const DaerahAreaFeatures = ({
  onInformationTooltipChanged = (info: string) => {
    return info;
  },
  onOpenAreaModal = (modalParam: AreaModalParam) => {
    return modalParam;
  },
  onOpenAreaWindow = (modalParam: AreaModalParam) => {
    return modalParam;
  },
  onLayerLoading = (isLoading: boolean) => {
    return isLoading;
  },
}) => {
  const [layers, setLayers] = useState<Array<Layer>>(new Array<Layer>());
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const updateLayer = (targetLayer: GeoJSON, layers: Layer[], newData: any) => {
    layers.forEach((layer) => {
      targetLayer.removeLayer(layer);
    });
    targetLayer.addData(newData);
  };

  const getAreaColor = (countTotal: number): string => {
    let color: string = '#fc0328';
    if (countTotal === 0) {
      return '#fc0328';
    } else if (countTotal > 0 && countTotal <= 100) {
      color = '#ead287';
    } else if (countTotal > 100 && countTotal <= 5000) {
      color = '#a103fc';
    } else if (countTotal > 5000 && countTotal <= 10000) {
      color = '#1403fc';
    } else if (countTotal > 10000) {
      color = '#03fc5e';
    }
    return color;
  };

  const setEachFeatureStyle = (f: any) => {
    //console.log(f.properties);
    const styled = {
      fillColor: getAreaColor(
        f.properties.total_informations + f.properties.self_total_informations,
      ),
      color: 'gray',
      weight: 2,
      fillOpacity: 0.5,
      borderColor: 'gray',
    };
    //console.log(styled);
    return styled;
  };

  const resetHighlight = (e: any) => {
    onInformationTooltipChanged('');
    daerahLayer.resetStyle(e.target);
  };

  const highlightFeature = (e: any) => {
    var layer = e.target;
    console.log(layer.feature.properties);

    layer.setStyle({
      weight: 2,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7,
    });

    const levelWilRef = ['', 'Provinsi', 'Kabupaten/Kota', 'Kecamatan', 'Desa'];
    let levelWil = levelWilRef[layer.feature.properties.level];

    onInformationTooltipChanged(
      `(${levelWil}) ${layer.feature.properties.label} (${
        layer.feature.properties.self_total_informations +
        layer.feature.properties.total_informations
      } data)`,
    );
    //console.log(layer.feature.properties);
    layer.bringToFront();
  };

  const openAreaModal = (e: LeafletEvent) => {
    const geoProps = e.target.feature.properties;

    if (localStorage.getItem('modal_mode') === 'window') {
      onOpenAreaWindow({
        areaLevel: geoProps.level,
        areaCode: geoProps.code,
        areaLabel: geoProps.label,
      } as AreaModalParam);
    } else {
      onOpenAreaModal({
        areaLevel: geoProps.level,
        areaCode: geoProps.code,
        areaLabel: geoProps.label,
      } as AreaModalParam);
    }
  };

  const onEachFeatureAreaWilayah = (_: any, layer: Layer) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: openAreaModal,
    });
  };

  const getLayerOption = (): GeoJSONOptions<any> => {
    return {
      onEachFeature: onEachFeatureAreaWilayah,

      style: setEachFeatureStyle,
    };
  };

  const initTopLayer = () => {
    onLayerLoading(true);
    getDaerahGeoJson(map.getZoom(), map.getBounds())
      .then((response) => {
        //console.log(response.data);

        daerahLayer = geoJSON(response.data, getLayerOption());

        setLayers(daerahLayer.getLayers());
        map.addLayer(daerahLayer);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => onLayerLoading(false));
  };

  const map = useMapEvents({
    moveend: () => {
      if (!isFetching) {
        setIsFetching(true);
        onLayerLoading(true);
        getDaerahGeoJson(map.getZoom(), map.getBounds())
          .then((response) => {
            updateLayer(daerahLayer, layers, response.data);
            setLayers(daerahLayer.getLayers());
            //console.log('total feature', response.data.features.length);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setIsFetching(false);
            onLayerLoading(false);
          });
      }
    },
  });

  useEffect(() => {
    console.log('initializing feature layer daerah');
    console.log(map.getBounds());
    initTopLayer();
  }, [0]);

  return null;
};

export default DaerahAreaFeatures;
