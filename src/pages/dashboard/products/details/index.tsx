import { useCallback, useState } from 'react';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import type { DropdownProps} from 'semantic-ui-react';
import { Message } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
import { Form, Dropdown } from 'semantic-ui-react';
import superjson from 'superjson';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';

import { InputMessage } from '@/components/atoms/inputMessage';
import { PageContainer } from '@/components/layouts/pageContainer';

import type { Category, ProductSpecs } from '@prisma/client';
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
  InferGetServerSidePropsType
} from 'next';
import type { Product } from '@/types';

import { trpc } from '@/lib/trpc';
import { PageRoutes } from '@/lib/routes';
import { adminProductDetailsSchema as validation } from '@/lib/products';

import { appRouter } from '@/server/trpc/router';
import { createContext } from '@/server/trpc/context';

interface FormValues extends Product, Omit<ProductSpecs, 'productId'> {}

const formDefaultValues: Partial<FormValues> = {
  name: '',
  description: '',
  discount: 0,
  image: '',
  stock: 1000,
  score: 0,
  favScore: 0,
  capacity: '750ml',
  volume: '',
  age: '',
  country: '',
  year: '',
  variety: '',
};

const AdminProductDetails = ({ id }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [isEditing, setIsEditing] = useState(!id);
  const trpcUtils = trpc.useContext();
  const router = useRouter();


  const { data: productDetails } = trpc.product.getBy.useQuery(
    getFetchByIdPrefetchOpts(id),
    {
      select: useCallback((product: Product) => {
        return {
          ...product,
          ...product.productSpecs,
        };
      }, []),
      enabled: !!id,
    }
  );

  const { data: categoryOptions } = trpc.category.getAll.useQuery(undefined, {
    select: useCallback((categories: Category[]) => {
      return categories.map((category) => ({
        key: category.id,
        text: category.name,
        value: category.id,
      }));
    }, []),
  });

  const { mutateAsync: mutateAsyncUpdateProduct, status: updateStatus } = trpc.product.update.useMutation({
    onSuccess: (_values) => {
      setIsEditing(false);
    },
  });

  const { mutateAsync: mutateAsyncCreateProduct } = trpc.product.create.useMutation({
    onSuccess: (values) => {
      // invalidate product.getAll query
      trpcUtils.product.getAll.invalidate();
      // redirect to product details
      router.push(`${PageRoutes.AdminProductsDetails}?id=${values.id}`);
    },
  });

  const isNewProduct = !id;
  const isUpdatingProduct = updateStatus === 'loading';
  const isProductUpdatedSuccess = updateStatus === 'success';

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: !id ? formDefaultValues : productDetails,
  });

  const handleCategoryChange = useCallback(
    (_: unknown, data: DropdownProps) => {
      if (data.value && typeof data.value === 'number') {
        setValue('categoryId', data.value);
        setError('categoryId', {});
      }
    },
    [setValue, setError]
  );

  const handleSetIsEditing = () => {
    setIsEditing(prev => !prev);
  };

  const onSubmit = handleSubmit(
    async (values) => {
      const submitData = {
        name: values.name,
        description: values.description,
        price: values.price,
        discount: values.discount,
        categoryId: values.categoryId,
        image: values.image,
        stock: values.stock,
        score: values.score,
        favScore: values.favScore,
        productSpecs: {
          capacity: values?.capacity,
          volume: values?.volume,
          age: values?.age,
          country: values?.country,
          year: values?.year,
          variety: values?.variety,
        },
      };

      if (isNewProduct) {
        await mutateAsyncCreateProduct(submitData);
      } else {
        await mutateAsyncUpdateProduct({ id, ...submitData });
      }
    }
  );

  return (
    <PageContainer heading={{ title: productDetails?.name || 'Nuevo Producto' }}>
      <Head>
        <meta name="robots" content="noindex" />
        <title>{id}</title>
      </Head>
      <div className='mb-4'>
        {!!id ? (
          <Button
            color='yellow'
            onClick={handleSetIsEditing}
          >
            Editar
          </Button>
        ): null}
      </div>
      <Form onSubmit={onSubmit}>
        <Form.Field required>
          <label>Nombre</label>
          <input
            placeholder="Name"
            disabled={!isEditing}
            {...register("name", validation.name)}
          />
          {errors.name?.message && <InputMessage type="error" message={errors.name.message} />}
        </Form.Field>
        <Form.Field>
          <label>Descripción</label>
          <input
            placeholder="Descripción"
            disabled={!isEditing}
            {...register("description", validation.description)}
          />
          {errors.description?.message && <InputMessage type="error" message={errors.description.message} />}
        </Form.Field>
        <Form.Field>
          <label>Descuento</label>
          <input
            placeholder="Descuento"
            type="number"
            disabled={!isEditing}
            {...register("discount", { ...validation.discount, valueAsNumber: true })}
          />
          {errors.discount?.message && <InputMessage type="error" message={errors.discount.message} />}
        </Form.Field>
        <Form.Field required>
          <label>Tipo de producto</label>
          <Dropdown
            placeholder="Tipo de producto"
            fluid
            selection
            disabled={!categoryOptions || !isEditing}
            options={categoryOptions}
            defaultValue={productDetails?.categoryId}
            {...register("categoryId", { required: 'Debe seleccionar una categoría'})}
            onChange={handleCategoryChange}
          />
          {errors.categoryId?.message && <InputMessage type="error" message={errors.categoryId.message} />}
        </Form.Field>
        <Form.Field required>
          <label>Precio</label>
          <input
            placeholder="Precio"
            type="number"
            step="0.01"
            disabled={!isEditing}
            {...register("price", { ...validation.price, valueAsNumber: true })}
          />
          {errors.price?.message && <InputMessage type="error" message={errors.price.message} />}
        </Form.Field>
        <Form.Field required>
          <label>Imagen</label>
          <input
            placeholder="Url completa de la imagen"
            disabled={!isEditing}
            {...register("image", validation.image)}
          />
          {errors.image?.message && <InputMessage type="error" message={errors.image.message} />}
        </Form.Field>
        <Form.Field>
          <label>Stock</label>
          <input
            placeholder="Stock"
            type="number"
            disabled={!isEditing}
            {...register("stock", { ...validation.stock, valueAsNumber: true })}
          />
          {errors.stock?.message && <InputMessage type="error" message={errors.stock.message} />}
        </Form.Field>
        <Form.Field>
          <label>Puntaje</label>
          <input
            placeholder="Puntaje"
            type="number"
            step="0.1"
            disabled={!isEditing}
            {...register("score", { ...validation.score, valueAsNumber: true })}
          />
          {errors.score?.message && <InputMessage type="error" message={errors.score.message} />}
        </Form.Field>
        <Form.Field>
          <label>Puntaje de favorito</label>
          <input
            placeholder="Puntaje de favorito"
            type="number"
            step="0.1"
            disabled={!isEditing}
            {...register("favScore", { ...validation.favScore, valueAsNumber: true })}
          />
          {errors.favScore?.message && <InputMessage type="error" message={errors.favScore.message} />}
        </Form.Field>
        <Form.Field required>
          <label>Capacidad</label>
          <input
            placeholder="Capacidad"
            disabled={!isEditing}
            {...register("capacity", validation.capacity)}
          />
          {errors.capacity?.message && <InputMessage type="error" message={errors.capacity.message} />}
        </Form.Field>
        <Form.Field required>
          <label>Volumen Alc.</label>
          <input
            placeholder="Volumen Alc."
            disabled={!isEditing}
            {...register("volume", validation.volume)}
          />
          {errors.volume?.message && <InputMessage type="error" message={errors.volume.message} />}
        </Form.Field>
        <Form.Field>
          <label>Añada</label>
          <input
            placeholder="Añada"
            disabled={!isEditing}
            {...register("age", validation.year)}
          />
          {errors.age?.message && <InputMessage type="error" message={errors.age.message} />}
        </Form.Field>
        <Form.Field>
          <label>País</label>
          <input
            placeholder="País"
            disabled={!isEditing}
            {...register("country", validation.country)}
          />
          {errors.country?.message && <InputMessage type="error" message={errors.country.message} />}
        </Form.Field>
        <Form.Field>
          <label>Año de producción</label>
          <input
            placeholder="Año de producción"
            disabled={!isEditing}
            {...register("year", validation.year)}
          />
          {errors.year?.message && <InputMessage type="error" message={errors.year.message} />}
        </Form.Field>
        <Form.Field>
          <label>Uva (variedad)</label>
          <input
            placeholder="Uva (variedad)"
            disabled={!isEditing}
            {...register("variety", validation.variety)}
          />
          {errors.variety?.message && <InputMessage type="error" message={errors.variety.message} />}
        </Form.Field>
        <Form.Button 
          type="submit"
          color="green"
          loading={isUpdatingProduct} 
          disabled={!isEditing || isUpdatingProduct}
        >
          {isNewProduct ? 'Crear producto' : 'Actualizar producto'}
        </Form.Button>
        {/* go back */}
        <Link href={PageRoutes.AdminProducts} className="mt-2">
          <Button
            type="button"
            
            disabled={isUpdatingProduct}
          >
            Regresar
          </Button>
        </Link>
      </Form>
      {isProductUpdatedSuccess ? (
        <Message
          success
          header="Producto actualizado"
          content="El producto se actualizó correctamente"
        />
      ) : null}
    </PageContainer>
  );
};

AdminProductDetails.requireAuth = true;
AdminProductDetails.requireAdmin = true;

export default AdminProductDetails;

const getFetchByIdPrefetchOpts = (id: string) => ({
  id,
  specs: true,
});

// product details must be prefetched since react-hook-form
// caches the initial values and therefore the form will
// not be updated if the product details are not prefetched first
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext({
      req: ctx.req as NextApiRequest,
      res: ctx.res as NextApiResponse,
    }),
    transformer: superjson,
  });

  // new product won't have any query params
  const id = ctx.query?.id as string || '';

  if (!!id) {
    await ssg.product.getBy.prefetch(getFetchByIdPrefetchOpts(id));
  }
  await ssg.category.getAll.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id
    },
  };
};
