import { useCallback } from "react";
import { useRouter } from "next/router";

import PageLayout from "Base/layout/PageLayout";
import MapHeader from "Map/features/MapHeader";
import MapList from "Map/features/MapList";
import { Map } from "Map/data/MapRepository";

const MapPage = () => {
  const router = useRouter();

  const navigateToCreateMap = useCallback(
    () => router.push("/map/create"),
    [router]
  );

  return (
    <PageLayout>
      {{
        header: <MapHeader navigateToCreateMap={navigateToCreateMap} />,
        content: <MapList />,
      }}
    </PageLayout>
  );
};

/* export const getServerSideProps = withAuth<User>(async (ctx, user) => {
  if (user.role === "USER") {
    // eslint-disable-next-line no-console
    console.log("You dont have permission on  :>> ", ctx.resolvedUrl);
    return {
      redirect: {
        permanent: false,
        destination: `/`,
      },
    };
  }
  return {
    props: {
      user,
    },
  };
}); */

export default MapPage;
