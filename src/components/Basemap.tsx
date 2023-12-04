'use client';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import useSWR from 'swr';

import { Protocol } from 'pmtiles';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Map, { NavigationControl } from 'react-map-gl/maplibre';

const STYLESPATH = '/styles/';
const STYLES = {
  black: 'black.json',
  contrast: 'contrast.json',
  dark: 'dark.json',
  grayscale: 'grayscale.json',
  light: 'light.json',
  white: 'white.json',
};
type STYLE = keyof typeof STYLES;

const BasemapWrapper = () => {
  const [styleChoice, setStyleChoice] = useState<STYLE>('light');
  return (
    <section>
      <h2>
        Basemap (<code>@/src/components/Basemap</code>)
      </h2>

      <Select styleChoice={styleChoice} setStyleChoice={setStyleChoice} />
      <BaseMap styleUrl={STYLESPATH + STYLES[styleChoice]} />
    </section>
  );
};

const Select = ({
  styleChoice,
  setStyleChoice,
}: {
  styleChoice: STYLE;
  setStyleChoice: Dispatch<SetStateAction<STYLE>>;
}) => {
  return (
    <div style={{ margin: '1rem 0' }}>
      <label htmlFor="styles">Choose a style:</label>
      <select
        name="styles"
        id="styles"
        value={styleChoice}
        onChange={(e) => setStyleChoice(e.target.value as STYLE)}
        style={{ margin: '0 1rem 0 0.5rem' }}
      >
        {Object.keys(STYLES).map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
      <a href={STYLESPATH + STYLES[styleChoice]} target="_blank">
        See style json
      </a>
    </div>
  );
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const BaseMap = ({ styleUrl }: { styleUrl: string }) => {
  const { data: styles } = useSWR(styleUrl, fetcher);

  useEffect(() => {
    const protocol = new Protocol();
    maplibregl.addProtocol('pmtiles', protocol.tile);
    return () => maplibregl.removeProtocol('pmtiles');
  }, []);

  if (!styles) return <p>Loading...</p>;

  return (
    <Map
      initialViewState={{
        longitude: -63.1872,
        latitude: 46.4974,
        zoom: 7.25,
      }}
      minZoom={7.25}
      maxZoom={12}
      maxBounds={[-64.60505, 45.91017, -61.15594, 47.89282]}
      style={{ width: '100%', height: 400 }}
      mapStyle={styles}
      // onMove={(e) => console.log({ e })}
      attributionControl={false}
    >
      <NavigationControl showCompass={false} />
    </Map>
  );
};

export default BasemapWrapper;
