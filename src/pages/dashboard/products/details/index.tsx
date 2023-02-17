import { PageContainer } from "@/components/layouts/pageContainer";
import Head from "next/head";
import { useRouter } from "next/router";

import { trpc } from "@/lib/trpc";
import type {
  Category,
  Product,
  ProductSpecs
} from "@prisma/client";
import { useForm } from "react-hook-form";
import type { DropdownProps } from "semantic-ui-react";
import { Form, Dropdown } from "semantic-ui-react";
import { InputMessage } from "@/components/atoms/inputMessage";
import { useCallback } from "react";

interface FormValues extends Product, Omit<ProductSpecs, 'productId'> {}

const formDefaultValues: Partial<FormValues> = {
  id: "",
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

const AdminProductDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  
  // remove starting '/' from name product of the table redirection
  const idWithoutSlash = id?.toString().replace('/', '') ?? '';

  const { data, isLoading } = trpc.product.getBy.useQuery({ id: idWithoutSlash }, {
    enabled: !!id,
  });
  const { data: categoryOptions } = trpc.category.getAll.useQuery(undefined, {
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
    formState: { errors },
  } = useForm<Partial<FormValues>>({
    defaultValues: formDefaultValues,
  });

  const handleCategoryChange = (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    if (data.value && typeof data.value === 'number') {
      setValue('categoryId', data.value);
      setError('categoryId', {});
    }
  };

  const onSubmit = handleSubmit(/* async */ (values) => {
    console.log('onsubmit', values);
  });

  console.log(idWithoutSlash, data, isLoading, categoryOptions, errors);

  return (
    <PageContainer heading={{ title: idWithoutSlash ?? ''}}>
      <Head>
        {/* no index */}
        <meta name="robots" content="noindex" />
        <title>{id}</title>
      </Head>
      <h1>Product: {id}</h1>
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <label>Name</label>
          <input
            placeholder="Name"
            {...register("name", { required: 'Este valor es requerido' })}
          />
          {errors.name?.message && <InputMessage type="error" message={errors.name.message} />}
        </Form.Field>
        <Form.Field>
          <label>Description</label>
          <input
            placeholder="Description"
            {...register("description", { required: 'Este valor es requerido' })}
          />
          {errors.description?.message && <InputMessage type="error" message={errors.description.message} />}
        </Form.Field>
        <Form.Field>
          <label>Discount</label>
          <input
            placeholder="Discount"
            {...register("discount", { required: 'Este valor es requerido' })}
          />
          {errors.discount?.message && <InputMessage type="error" message={errors.discount.message} />}
        </Form.Field>
        <Form.Field>
          {/* categoryId */}
          <label>Category</label>
          <Dropdown
            placeholder="Category"
            fluid
            selection
            disabled={!categoryOptions}
            options={categoryOptions}
            {...register("categoryId", { required: 'Este valor es requerido' })}
            onChange={handleCategoryChange}
          />
          {errors.categoryId?.message && <InputMessage type="error" message={errors.categoryId.message} />}
        </Form.Field>
        <Form.Field>
          {/* price - float */}
          <label>Price</label>
          <input
            placeholder="Price"
            type="number"
            {...register("price", { required: 'Este valor es requerido' })}
          />
          {errors.price?.message && <InputMessage type="error" message={errors.price.message} />}
        </Form.Field>
        <Form.Field>
          {/* image */}
          <label>Image</label>
          <input
            placeholder="Image"
            {...register("image", { required: 'Este valor es requerido' })}
          />
          {errors.image?.message && <InputMessage type="error" message={errors.image.message} />}
        </Form.Field>
        {/* stock */}
        <Form.Field>
          <label>Stock</label>
          <input
            placeholder="Stock"
            type="number"
            {...register("stock", { required: 'Este valor es requerido' })}
          />
          {errors.stock?.message && <InputMessage type="error" message={errors.stock.message} />}
        </Form.Field>
        {/* score */}
        <Form.Field>
          <label>Score</label>
          <input
            placeholder="Score"
            type="number"
            {...register("score", { required: 'Este valor es requerido' })}
          />
          {errors.score?.message && <InputMessage type="error" message={errors.score.message} />}
        </Form.Field>
        {/* favScore */}
        <Form.Field>
          <label>FavScore</label>
          <input
            placeholder="FavScore"
            type="number"
            {...register("favScore", { required: 'Este valor es requerido' })}
          />
          {errors.favScore?.message && <InputMessage type="error" message={errors.favScore.message} />}
        </Form.Field>
        {/* capacity */}
        <Form.Field>
          <label>Capacity</label>
          <input
            placeholder="Capacity"
            {...register("capacity", { required: 'Este valor es requerido' })}
          />
          {errors.capacity?.message && <InputMessage type="error" message={errors.capacity.message} />}
        </Form.Field>
        {/* volume */}
        <Form.Field>
          <label>Volume</label>
          <input
            placeholder="Volume"
            type="number"
            {...register("volume", { required: 'Este valor es requerido' })}
          />
          {errors.volume?.message && <InputMessage type="error" message={errors.volume.message} />}
        </Form.Field>
        {/* age */}
        <Form.Field>
          <label>Age</label>
          <input
            placeholder="Age"
            type="number"
            {...register("age", { required: 'Este valor es requerido' })}
          />
          {errors.age?.message && <InputMessage type="error" message={errors.age.message} />}
        </Form.Field>
        {/* country */}
        <Form.Field>
          <label>Country</label>
          <input
            placeholder="Country"
            {...register("country", { required: 'Este valor es requerido' })}
          />
          {errors.country?.message && <InputMessage type="error" message={errors.country.message} />}
        </Form.Field>
        {/* year */}
        <Form.Field>
          <label>Year</label>
          <input
            placeholder="Year"
            type="number"
            {...register("year", { required: 'Este valor es requerido' })}
          />
          {errors.year?.message && <InputMessage type="error" message={errors.year.message} />}
        </Form.Field>
        {/* variety */}
        <Form.Field>
          <label>Variety</label>
          <input
            placeholder="Variety"
            {...register("variety", { required: 'Este valor es requerido' })}
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