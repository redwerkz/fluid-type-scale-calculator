import { STATUS_CODES as REASON_PHRASES } from 'http';
import { constants as HTTP_STATUS_CODES } from 'http2';
import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import ErrorPage from '../components/ErrorPage/ErrorPage';
import FluidTypeScaleCalculator from '../components/FluidTypeScaleCalculator/FluidTypeScaleCalculator';
import { initialFormState } from '../components/FluidTypeScaleCalculator/FluidTypeScaleCalculator.context';
import { FormState } from '../components/FluidTypeScaleCalculator/FluidTypeScaleCalculator.types';
import HeroBanner from '../components/HeroBanner/HeroBanner';
import Info from '../components/Info/Info';
import Layout from '../components/Layout/Layout';
import site from '../data/site.json';
import { schema } from '../schema/schema';
import { QueryParamId, UserSuppliedQueryParams } from '../schema/schema.types';
import { validateQueryParams } from '../schema/schema.validators';
import { HTTPError, WithFonts } from '../types';
import { getGoogleFontFamilies } from '../utils';

type CalculatePageProps = WithFonts & {
  /** The initial state with which to populate the app from query params. */
  initialState: FormState;
  /** A server-side error. */
  error?: HTTPError;
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<CalculatePageProps>> => {
  const query = context.query as UserSuppliedQueryParams;
  const fonts = await getGoogleFontFamilies();

  try {
    // Validate the query params first
    validateQueryParams({ query, fonts });

    // Then transform the query params to state
    const initialState: FormState = {
      min: {
        fontSize: schema[QueryParamId.minFontSize].parse(query),
        screenWidth: schema[QueryParamId.minWidth].parse(query),
        ratio: schema[QueryParamId.minRatio].parse(query),
      },
      max: {
        fontSize: schema[QueryParamId.maxFontSize].parse(query),
        screenWidth: schema[QueryParamId.maxWidth].parse(query),
        ratio: schema[QueryParamId.maxRatio].parse(query),
      },
      typeScaleSteps: {
        all: schema[QueryParamId.allSteps].parse(query),
        base: schema[QueryParamId.baseStep].parse(query),
      },
      namingConvention: schema[QueryParamId.namingConvention].parse(query),
      shouldIncludeFallbacks: schema[QueryParamId.shouldIncludeFallbacks].parse(query),
      shouldUseRems: schema[QueryParamId.shouldUseRems].parse(query),
      remValueInPx: schema[QueryParamId.remValueInPx].parse(query),
      roundingDecimalPlaces: schema[QueryParamId.roundingDecimalPlaces].parse(query),
      preview: {
        fontFamily: schema[QueryParamId.previewFont].parse(query),
        text: schema[QueryParamId.previewText].parse(query),
        width: schema[QueryParamId.previewWidth].parse(query),
      },
    };
    return {
      props: {
        initialState,
        fonts,
      },
    };
  } catch (e) {
    // TypeScript doesn't support type annotations on catch
    const error = e as Error;
    const statusCode = HTTP_STATUS_CODES.HTTP_STATUS_BAD_REQUEST;
    const description =
      error.message ??
      'One or more query parameters are invalid. Please check the URL you entered.';
    return {
      props: {
        fonts,
        initialState: initialFormState,
        error: {
          code: statusCode,
          reasonPhrase: REASON_PHRASES[statusCode] as string,
          description,
        },
      },
    };
  }
};

const Calculate: NextPage<CalculatePageProps> = (props) => {
  if (props.error) {
    return <ErrorPage {...props.error} />;
  }
  return (
    <Layout isBlockedFromIndexing={true}>
      <HeroBanner title={site.title} subtitle={site.description} />
      <FluidTypeScaleCalculator initialState={props.initialState} fonts={props.fonts} />
      <Info />
    </Layout>
  );
};

export default Calculate;
