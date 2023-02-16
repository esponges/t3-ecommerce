import { PageContainer } from "@/components/layouts/pageContainer";
import { trpc } from "@/lib/trpc";
import { useRouter } from "next/router";

const AdminProductDetails = () => {
  const router = useRouter();
  const { name } = router.query;
  
  // remove starting '/' from name product of the table redirection
  const nameWithoutSlash = name?.toString().replace('/', '') ?? '';

  const { data, isLoading } = trpc.product.getBy.useQuery({ name: nameWithoutSlash }, {
    enabled: !!name,
  });
  console.log(data, isLoading);

  return (
    <PageContainer heading={{ title: nameWithoutSlash ?? ''}}>
      <h1>Product: {name}</h1>
    </PageContainer>
  );
};

AdminProductDetails.requireAuth = true;

export default AdminProductDetails;
