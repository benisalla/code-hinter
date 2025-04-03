import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { ExerciseView } from 'src/sections/exercise/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Exercies - ${CONFIG.appName}`}</title>
      </Helmet>

      <ExerciseView />
    </>
  );
}
