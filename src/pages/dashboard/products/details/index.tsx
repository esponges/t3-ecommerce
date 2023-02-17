import { PageContainer } from "@/components/layouts/pageContainer";
import Head from "next/head";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import type { DropdownProps } from "semantic-ui-react";
import { Form, Dropdown } from "semantic-ui-react";
import { InputMessage } from "@/components/atoms/inputMessage";

import type { Category, ProductSpecs } from "@prisma/client";
import type { Product } from "@/types";

import { trpc } from "@/lib/trpc";

import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
  InferGetServerSidePropsType
} from 'next';
import superjson from 'superjson';
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "@/server/trpc/router";
import { createContext } from "@/server/trpc/context";

interface FormValues extends Product, Omit<ProductSpecs, 'productId'> {}

const formDefaultValues: Partial<FormValues> = {
  name: "",
  description: "",
  discount: 0,
  image: "",
  stock: 1000,
  score: 0,
  favScore: 0,
  capacity: '750ml',
  volume: "",
  age: "",
  country: "",
  year: "",
  variety: "",
};

const validation = {
  name: {
    required: 'Este valor es requerido',
  },
  description: {
    minLength: {
      value: 10,
      message: 'Debe tener al menos 10 caracteres',
    },
  },
  discount: {
    min: {
      value: 0,
      message: 'No puede ser menor a 0',
    },
    max: {
      value: 100,
      message: 'No puede ser mayor a 100',
    },
  },
  price: {
    required: 'Este valor es requerido',
    min: {
      value: 0,
      message: 'No puede ser menor a 0',
    },
  },
  image: {
    // must a valid url
    pattern: {
      value: /^https?:\/\/.+/,
      message: 'Debe ser una url válida',
    },
  },
  stock: {
    min: {
      value: 0,
      message: 'No puede ser menor a 0',
    },
  },
  score: {
    min: {
      value: 0,
      message: 'No puede ser menor a 0',
    },
    max: {
      value: 10,
      message: 'No puede ser mayor a 10',
    },
  },
  favScore: {
    min: {
      value: 0,
      message: 'No puede ser menor a 0',
    },
    max: {
      value: 10,
      message: 'No puede ser mayor a 10',
    },
  },
  capacity: {
    // patern for 750ml, 1.5L, 3L, 5L etc
    pattern: {
      value: /^\d+(?:\.\d+)?(?:ml|L)$/,
      message: 'Debe ser una capacidad válida',
    },
  },
  volume: {
    minLength: {
      value: 1,
      message: 'Debe tener al menos 1 caracter',
    },
  },
  age: {
    minLength: {
      value: 1,
      message: 'Debe tener al menos 1 caracter',
    },
  },
  country: {
    minLength: {
      value: 1,
      message: 'Debe tener al menos 1 caracter',
    },
  },
  year: {
    minLength: {
      value: 1,
      message: 'Debe tener al menos 1 caracter',
    },
  },
  variety: {
    minLength: {
      value: 1,
      message: 'Debe tener al menos 1 caracter',
    },
  },
};



const AdminProductDetails = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { id } = props;

  const { data: productDetails, isLoading } = trpc.product.getBy.useQuery({ id, specs: true }, {
    select: useCallback((product: Product) => {
      return {
        ...product,
        ...product.productSpecs,
      };
    }, []),
  });
  const { data: categoryOptions, isLoading: loadingCats } = trpc.category.getAll.useQuery(undefined, {
    select: useCallback((categories: Category[]) => {
      return categories.map((category) => ({
        key: category.id,
        text: category.name,
        value: category.id,
      }));
    }, []),
  });

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    getValues,
    formState: { errors },
  } = useForm<Partial<FormValues>>({
    defaultValues: !id ? formDefaultValues : productDetails,
  });

  console.log('errors', errors);

  const handleCategoryChange = useCallback((_: unknown, data: DropdownProps) => {
    if (data.value && typeof data.value === 'number') {
      setValue('categoryId', data.value);
      setError('categoryId', {});
    }
  }, [setValue, setError]);

  const onSubmit = handleSubmit(/* async */ (values) => {
    console.log('onsubmit', values);
  });

  return (
    <PageContainer heading={{ title: id ?? ''}}>
      <Head>
        {/* no index */}
        <meta name="robots" content="noindex" />
        <title>{id}</title>
      </Head>
      <h1>{productDetails?.name || 'Nuevo Producto'}</h1>
      <Form onSubmit={onSubmit}>
        <Form.Field required>
          <label>Nombre</label>
          <input
            placeholder="Name"
            {...register("name", validation.name)}
          />
          {errors.name?.message && <InputMessage type="error" message={errors.name.message} />}
        </Form.Field>
        <Form.Field>
          <label>Descripción</label>
          <input
            placeholder="Descripción"
            {...register("description", validation.description)}
          />
          {errors.description?.message && <InputMessage type="error" message={errors.description.message} />}
        </Form.Field>
        <Form.Field>
          <label>Descuento</label>
          <input
            placeholder="Descuento"
            type="number"
            {...register("discount", validation.discount)}
          />
          {errors.discount?.message && <InputMessage type="error" message={errors.discount.message} />}
        </Form.Field>
        <Form.Field required>
          {/* categoryId */}
          <label>Tipo de producto</label>
          <Dropdown
            placeholder="Tipo de producto"
            fluid
            selection
            disabled={!categoryOptions}
            options={categoryOptions}
            defaultValue={productDetails?.categoryId}
            {...register("categoryId", { required: 'Debe seleccionar una categoría'})}
            onChange={handleCategoryChange}
          />
          {errors.categoryId?.message && <InputMessage type="error" message={errors.categoryId.message} />}
        </Form.Field>
        <Form.Field required>
          {/* price - float */}
          <label>Precio</label>
          <input
            placeholder="Precio"
            type="number"
            step="0.01"
            {...register("price", validation.price)}
          />
          {errors.price?.message && <InputMessage type="error" message={errors.price.message} />}
        </Form.Field>
        <Form.Field required>
          {/* image */}
          <label>Imagen</label>
          <input
            placeholder="Url completa de la imagen"
            {...register("image", validation.image)}
          />
          {errors.image?.message && <InputMessage type="error" message={errors.image.message} />}
        </Form.Field>
        {/* stock */}
        <Form.Field>
          <label>Stock</label>
          <input
            placeholder="Stock"
            type="number"
            {...register("stock", validation.stock)}
          />
          {errors.stock?.message && <InputMessage type="error" message={errors.stock.message} />}
        </Form.Field>
        {/* score */}
        <Form.Field>
          <label>Puntaje</label>
          <input
            placeholder="Puntaje"
            type="number"
            step="0.1"
            {...register("score", validation.score)}
          />
          {errors.score?.message && <InputMessage type="error" message={errors.score.message} />}
        </Form.Field>
        {/* favScore */}
        <Form.Field>
          <label>Puntaje de favorito</label>
          <input
            placeholder="Puntaje de favorito"
            type="number"
            step="0.1"
            {...register("favScore", validation.favScore)}
          />
          {errors.favScore?.message && <InputMessage type="error" message={errors.favScore.message} />}
        </Form.Field>
        {/* capacity */}
        <Form.Field required>
          <label>Capacidad</label>
          <input
            placeholder="Capacidad"
            {...register("capacity", validation.capacity)}
          />
          {errors.capacity?.message && <InputMessage type="error" message={errors.capacity.message} />}
        </Form.Field>
        {/* volume */}
        <Form.Field required>
          <label>Volumen Alc.</label>
          <input
            placeholder="Volumen Alc."
            {...register("volume", validation.volume)}
          />
          {errors.volume?.message && <InputMessage type="error" message={errors.volume.message} />}
        </Form.Field>
        {/* age */}
        <Form.Field>
          <label>Añada</label>
          <input
            placeholder="Añada"
            {...register("age", validation.year)}
          />
          {errors.age?.message && <InputMessage type="error" message={errors.age.message} />}
        </Form.Field>
        {/* country */}
        <Form.Field>
          <label>País</label>
          <input
            placeholder="País"
            {...register("country", validation.country)}
          />
          {errors.country?.message && <InputMessage type="error" message={errors.country.message} />}
        </Form.Field>
        {/* year */}
        <Form.Field>
          <label>Año de producción</label>
          <input
            placeholder="Año de producción"
            {...register("year", validation.year)}
          />
          {errors.year?.message && <InputMessage type="error" message={errors.year.message} />}
        </Form.Field>
        {/* variety */}
        <Form.Field>
          <label>Uva (variedad)</label>
          <input
            placeholder="Uva (variedad)"
            {...register("variety", validation.variety)}
          />
          {errors.variety?.message && <InputMessage type="error" message={errors.variety.message} />}
        </Form.Field>
        <Form.Button type="submit">Submit</Form.Button>
      </Form>
    </PageContainer>
  );
};

AdminProductDetails.requireAuth = true;

export default AdminProductDetails;

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

  const id = ctx.query?.id as string;
  const idWithoutSlash = id?.toString().replace('/', '') ?? null;

  await ssg.product.getBy.prefetch({ id: idWithoutSlash, specs: true });
  await ssg.category.getAll.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id: idWithoutSlash,
    },
  };
};

