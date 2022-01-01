import { useEffect, useState } from 'react';
import Input from '../Input';
import RangeInput from '../RangeInput';
import clsx from 'clsx';
import styles from './styles.module.scss';

// No need to use a Head lib
const getFontLinkTag = (id) => {
  const existingLink = document.getElementById(id);
  if (existingLink) {
    document.head.removeChild(existingLink);
  }
  const link = document.createElement('link');
  link.removeEventListener('load', onLinkLoaded);
  link.id = id;
  link.rel = 'stylesheet';
  return link;
};

const onLinkLoaded = (fontFamily, previewText, setFont) => async () => {
  await document.fonts.load(`1em ${fontFamily}`, previewText);
  setFont(fontFamily);
};

const defaultFonts = ['Inter'];

const Preview = (props) => {
  const [previewText, setPreviewText] = useState('Almost before we knew it, we had left the ground');
  const [fonts, setFonts] = useState(defaultFonts);
  const [previewFont, setPreviewFont] = useState(defaultFonts[0]);
  const [screenWidth, setScreenWidth] = useState(props.baseSizes.max.screenWidth);

  useEffect(() => {
    // Since Slinkity uses SSR, this must be done on mount
    setScreenWidth(window.innerWidth);
    /* Set fonts from static props (async 11ty data) on mount, for several reasons:
    1. Don't want to fetch Google Fonts on mount because that would require using serverless functions. Without a cache, assuming decent traffic, this would quickly blow the Netlify limit.
    2. Don't want the initially server-side rendered HTML to return ~1k font family names, or this will start matching really absurd and irrelevant search queries (already seeing this in Google Search Console).
    3. This sends less HTML over the wire initially.
    */
    setFonts(props.fonts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFontSelected = async (fontFamily) => {
    const link = getFontLinkTag('user-selected-font');
    document.head.appendChild(link);
    link.addEventListener('load', onLinkLoaded(fontFamily, previewText, setPreviewFont));
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}&display=swap`;
  };

  return (
    <section className={styles.preview}>
      <h2>Preview your type scale</h2>
      <div className={styles['label-group']}>
        <RangeInput
          id="screen-width-range"
          label="Screen width (pixels)"
          value={screenWidth}
          onChange={(e) => setScreenWidth(Number(e.target.value))}
          min={0}
          // TODO: better pattern?
          max={1920}
        />
        <label className="label">
          <span className="label-title">Font family</span>
          <select defaultValue={previewFont} onChange={(e) => onFontSelected(e.target.value)}>
            {fonts.map((fontFamily) => (
              <option key={fontFamily} value={fontFamily}>
                {fontFamily}
              </option>
            ))}
          </select>
        </label>
        <label className="label">
          <span className="label-title">Preview text</span>
          <Input type="text" required defaultValue={previewText} onChange={(e) => setPreviewText(e.target.value)} />
        </label>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th scope="col">Step</th>
              <th scope="col" className={clsx(styles.numeric, 'nowrap')}>
                Min
              </th>
              <th scope="col" className={clsx(styles.numeric, 'nowrap')}>
                Max
              </th>
              <th scope="col" className={clsx(styles.numeric, 'nowrap')}>
                Rendered
              </th>
              <th scope="col" className={clsx(styles['preview-text'], 'nowrap')}>
                Preview
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(props.typeScale).map(([step, { min, max, getFontSizeAtScreenWidth }]) => {
              const fontSize = getFontSizeAtScreenWidth(screenWidth);
              return (
                <tr key={step}>
                  <td>{step}</td>
                  <td className={styles.numeric}>{min}</td>
                  <td className={styles.numeric}>{max}</td>
                  <td className={styles.numeric}>{getFontSizeAtScreenWidth(screenWidth)}</td>
                  <td className={clsx('nowrap', styles['preview-text'])} style={{ fontSize, fontFamily: previewFont }}>
                    {previewText}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
export default Preview;
