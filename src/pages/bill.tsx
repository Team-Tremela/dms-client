import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { BillView } from 'src/sections/billing/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Users - ${CONFIG.appName}`}</title>
      </Helmet>

      <BillView />
    </>
  );
}
