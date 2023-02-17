import { PageContainer } from "@/components/layouts/pageContainer";
import Head from "next/head";
import { useRouter } from "next/router";

import { trpc } from "@/lib/trpc";

const AdminProductDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  
  // remove starting '/' from name product of the table redirection
  const idWithoutSlash = id?.toString().replace('/', '') ?? '';

  const { data, isLoading } = trpc.product.getBy.useQuery({ id: idWithoutSlash }, {
    enabled: !!id,
  });
  console.log(idWithoutSlash, data, isLoading);

  return (
    <PageContainer heading={{ title: idWithoutSlash ?? ''}}>
      <Head>
        {/* no index */}
        <meta name="robots" content="noindex" />
        <title>{id}</title>
      </Head>
      <h1>Product: {id}</h1>
    </PageContainer>
  );
};

AdminProductDetails.requireAuth = true;

export default AdminProductDetails;
