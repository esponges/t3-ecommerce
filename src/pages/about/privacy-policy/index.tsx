import { PageContainer } from '@/components/layouts/pageContainer';
import { Container } from '@/components/molecules/container';
import { env } from '@/env/client.mjs';

const PrivacyPolicy = () => {
  return (
    <PageContainer verticallyCentered heading={{ title: 'Política de Privacidad' }}>
      <Container>
        <p>
          Esta política de privacidad describe cómo se recopila, utiliza y protege la información personal que se
          proporciona en esta página web. Al utilizar este sitio web, se acepta y se consiente con el procesamiento de
          la información según lo descrito en esta política.
        </p>
        <h2>Recopilación de información</h2>
        <p>Esta página web recopila información personal de diferentes formas, incluyendo:</p>
        <ul>
          <li>
            Información que se proporciona de manera voluntaria al registrarse en el sitio web o al suscribirse a
            nuestro boletín informativo.
          </li>
          <li>
            Información recopilada automáticamente, como su dirección IP, tipo de navegador, tiempo de acceso y páginas
            visitadas.
          </li>
          <li>
            Cookies y tecnologías similares para recopilar información sobre cómo utiliza el sitio web y proporcionarle
            publicidad personalizada.
          </li>
        </ul>
        <h2>Uso de información</h2>
        <p>La información personal recopilada se utiliza para los siguientes propósitos:</p>
        <ul>
          <li>Proporcionar y mejorar nuestros productos y servicios.</li>
          <li>Personalizar la experiencia del usuario y brindar publicidad personalizada.</li>
          <li>Proporcionar comunicaciones de marketing y promociones especiales.</li>
          <li>Cumplir con cualquier requisito legal o regulatorio.</li>
        </ul>
        <h2>Protección de información</h2>
        <p>
          Esta página web se compromete a proteger la información personal que se recopila. Se utilizan medidas de
          seguridad apropiadas para proteger la información de acceso no autorizado, alteración, divulgación o
          destrucción.
        </p>
        <h2>Divulgación de información</h2>
        <p>
          La información personal recopilada no se vende, alquila o comparte con terceros para fines comerciales, a
          menos que se obtenga el consentimiento previo del usuario o se requiera por ley.
        </p>
        <p>
          Sin embargo, se puede compartir información con terceros que proporcionan servicios en nombre de esta página
          web, como procesamiento de pagos o análisis de datos. Estos terceros tienen acceso limitado a la información
          necesaria para realizar sus funciones, pero no tienen permiso para utilizarla para otros fines.
        </p>
        <h2>Enlaces a sitios web de terceros</h2>
        <p>
          Esta página web puede contener enlaces a otros sitios web. Esta política de privacidad no se aplica a estos
          sitios web, por lo que se recomienda leer las políticas de privacidad de estos sitios.
        </p>
        <h2>Derechos de los usuarios</h2>
        <p>
          Los usuarios tienen derecho a acceder, corregir y eliminar su información personal en cualquier momento. Para
          ejercer estos derechos, contáctenos a través de los medios indicados en esta página web.
        </p>
        <h2>Cambios en la política de privacidad</h2>
        <p>
          Esta política de privacidad se puede actualizar periódicamente para reflejar los cambios en la información que
          se recopila y cómo se utiliza. Se publicará una versión actualizada en esta página web
        </p>
        <p>
          Si tienes alguna pregunta o inquietud sobre esta política de privacidad, escríbenos por correo a{' '}
          <a href={`mailto:${env.NEXT_PUBLIC_CONTACT_EMAIL}`}>{env.NEXT_PUBLIC_CONTACT_EMAIL}</a> o por WhatsApp al{' '}
          <a href={`https://wa.me/${env.NEXT_PUBLIC_PHONE_NUMBER}`}>{env.NEXT_PUBLIC_PHONE_NUMBER}</a>.
        </p>
      </Container>
    </PageContainer>
  );
};

export default PrivacyPolicy;
