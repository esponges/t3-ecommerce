import { PageContainer } from '@/components/layouts/pageContainer';
import { Container } from '@/components/molecules/container';
import { env } from '@/env/client.mjs';
import Head from 'next/head';

const DataDeletionPolicy = () => {
  return (
    <PageContainer verticallyCentered heading={{ title: 'Política de eliminación de datos' }}>
      <Head>
        <title>Política de eliminación de datos</title>
        <meta
          name="description"
          content="Política de eliminación de datos"
        />
      </Head>
      <Container>
        <p>
          Esta política describe cómo se maneja la eliminación de datos personales en esta página web. Se espera que los
          usuarios comprendan que la eliminación de datos personales puede afectar su uso de esta página web y cualquier
          producto o servicio asociado.
        </p>
        <h2>Solicitud de eliminación de datos</h2>
        <p>
          Los usuarios tienen derecho a solicitar la eliminación de sus datos personales. Para solicitar la eliminación
          de sus datos personales, contáctenos a
          <a href={`mailto:${env.NEXT_PUBLIC_CONTACT_EMAIL}`}> {env.NEXT_PUBLIC_CONTACT_EMAIL}</a>. Se puede solicitar
          la eliminación de datos personales en cualquier momento.
        </p>
        <h2>Proceso de eliminación de datos</h2>
        <p>
          Una vez que se recibe una solicitud de eliminación de datos personales, se tomarán medidas para eliminar la
          información personal del usuario de la página web y cualquier base de datos asociada. La eliminación de datos
          puede tardar un tiempo en completarse dependiendo del tamaño de los datos y la complejidad del proceso de
          eliminación.
        </p>
        <h2>Excepciones</h2>
        <p>Se pueden hacer excepciones a la eliminación de datos personales en los siguientes casos:</p>
        <ul>
          <li>Cuando se requiere por ley.</li>
          <li>Cuando se necesita para cumplir con las obligaciones contractuales.</li>
          <li>Cuando la información es necesaria para fines legales.</li>
          <li>Cuando la información se utiliza para identificar y resolver problemas técnicos o de seguridad.</li>
        </ul>
        <h2>Cambios en la política de eliminación de datos</h2>
        <p>
          Esta política de eliminación de datos puede actualizarse periódicamente para reflejar cambios en las prácticas
          de eliminación de datos personales en esta página web. Los usuarios deben revisar esta política con
          regularidad para estar informados sobre cómo se maneja la eliminación de datos personales en esta página web.
        </p>
      </Container>
    </PageContainer>
  );
};

export default DataDeletionPolicy;
