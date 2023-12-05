'use client';
import { useEffect } from 'react';

import { Protocol } from 'pmtiles';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Map, { Layer, NavigationControl, Source } from 'react-map-gl/maplibre';

const BasemapWrapper = () => {
  return (
    <section>
      <h2>Electoral</h2>
      <p>
        Path:
        <i>@/src/components/Electoral.tsx</i> || <i>@/public/electoral.html</i>
      </p>

      <Electoral />
    </section>
  );
};

const Electoral = () => {
  useEffect(() => {
    const protocol = new Protocol();
    maplibregl.addProtocol('pmtiles', protocol.tile);
    return () => maplibregl.removeProtocol('pmtiles');
  }, []);

  return (
    <Map
      initialViewState={{
        longitude: -94.35,
        latitude: 63,
        zoom: 2.5,
      }}
      renderWorldCopies={false}
      style={{ width: '100%', height: 600, border: '1px solid black' }}
      attributionControl={false}
    >
      <NavigationControl showCompass={false} />
      <Source
        id="electoralCanada"
        type="vector"
        url="pmtiles://data/pmtiles/electoralCanada.pmtiles"
      >
        <Layer
          type="fill"
          source="electoralCanada"
          source-layer="geojson"
          paint={{
            'fill-color': 'lightgray',
            'fill-outline-color': 'black',
          }}
        />
      </Source>
    </Map>
  );
};

export default BasemapWrapper;
