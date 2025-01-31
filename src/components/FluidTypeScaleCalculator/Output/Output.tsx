import outdent from 'outdent';
import type { TypeScale } from '../../../types';
import CopyToClipboardButton from '../../CopyToClipboardButton/CopyToClipboardButton';
import { useFormState } from '../FluidTypeScaleCalculator.context';
import styles from './Output.module.scss';

type Props = {
  /** The output type scale. */
  typeScale: TypeScale;
};

const Output = (props: Props) => {
  const { state } = useFormState();
  const { typeScale } = props;
  const fontSizes = Array.from(typeScale.entries());

  /** Helper to assemble a CSS custom property for a given font size step. */
  const getCustomPropertyName = (step: string) => `--${state.namingConvention}-${step}`;

  // We need the fluid variables in two scenarios, and in each scenario the indentation level is different
  const getFluidFontSizeVariables = (indentLevel = 0) => {
    const indentation = Array.from({ length: indentLevel }, () => '\t').join('');
    return fontSizes
      .map(([step, { min, max, preferred }]) => {
        return `${indentation}${getCustomPropertyName(step)}: clamp(${min}, ${preferred}, ${max});`;
      })
      .join('\n')
      .trim();
  };

  let code: string | undefined;

  // Include fallbacks with feature queries for browsers that don't support clamp
  if (state.shouldIncludeFallbacks) {
    const minFallbackVariables = fontSizes
      .map(([step, { min }]) => {
        return `\t\t${getCustomPropertyName(step)}: ${min};`;
      })
      .join('\n')
      .trim();

    const maxFallbackVariables = fontSizes
      .map(([step, { max }]) => {
        return `\t\t\t${getCustomPropertyName(step)}: ${max};`;
      })
      .join('\n')
      .trim();

    // Outdent to prevent the static code indentation from influencing the output string indentation
    code = outdent`
    /* Fluid font size variables, for browsers that support clamp */
    @supports (font-size: clamp(1rem, 1vw, 1rem)) {
      :root {
        ${getFluidFontSizeVariables(2)}
      }
    }
    /* Fallback variables for browsers that don't support clamp */
    @supports not (font-size: clamp(1rem, 1vw, 1rem)) {
      :root {
        ${minFallbackVariables}
      }
      @media screen and (min-width: ${state.max.screenWidth}px) {
        :root {
          ${maxFallbackVariables}
        }
      }
    }`;
  } else {
    code = getFluidFontSizeVariables();
  }

  return (
    <aside className={styles.output}>
      <div className={styles['output-wrapper']} role="region" tabIndex={0} aria-label="Output">
        <output className={styles['output-code']}>
          <code className={styles.code}>{code}</code>
        </output>
      </div>
      <CopyToClipboardButton text={code} />
    </aside>
  );
};

export default Output;
