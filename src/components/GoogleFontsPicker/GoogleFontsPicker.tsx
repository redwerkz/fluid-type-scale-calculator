import { useEffect, useRef, useState } from 'react';
import { QueryParamKey } from '../../api/api.constants';
import { Delay } from '../../constants';
import { WithFonts } from '../../types';
import { TYPE_SCALE_FORM_ID } from '../FluidTypeScaleCalculator/Form/Form.constants';
import Select, { SelectProps } from '../Select/Select';

export type GoogleFontsPickerProps = WithFonts &
  Omit<SelectProps, 'defaultValue'> & {
    /** The default selected font. */
    defaultValue?: string;
  };

const GoogleFontsPicker = (props: GoogleFontsPickerProps) => {
  const { defaultValue, fonts: allFonts, onChange } = props;
  const [fonts, setFonts] = useState([defaultValue]);
  const pickerRef = useRef<HTMLSelectElement>(null);

  /* Set fonts from static props on intersection, for several reasons:
    1. Scalability: Don't want to fetch Google Fonts on mount because that would require using serverless functions to keep the key private (unless we always do SSR). Without a cache, assuming decent traffic, this would quickly blow the Netlify limit.
    2. SEO: Don't want the initially server-side rendered HTML to return ~1k font family names, or this will start matching really absurd and irrelevant search queries (already seeing this in Google Search Console).
    3. Performance: This sends less HTML over the wire initially and on mount. */
  useEffect(() => {
    if (!pickerRef.current) return;
    const intersectionObserver = new IntersectionObserver(
      (entries, self) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setFonts(allFonts);
            self.unobserve(entry.target);
          }
        });
      },
      { rootMargin: `400px 0px 400px 0px` }
    );
    intersectionObserver.observe(pickerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Select
      form={TYPE_SCALE_FORM_ID}
      name={QueryParamKey.fontFamily}
      ref={pickerRef}
      defaultValue={defaultValue}
      onChange={onChange}
      delay={Delay.LONG}
    >
      {fonts.map((fontFamily) => (
        <option key={fontFamily} value={fontFamily}>
          {fontFamily}
        </option>
      ))}
    </Select>
  );
};

export default GoogleFontsPicker;
