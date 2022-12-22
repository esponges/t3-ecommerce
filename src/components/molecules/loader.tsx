import {
  Dimmer,
  Segment,
  Loader as SemanticLoader,
  Image
} from 'semantic-ui-react'

interface Props {
  size?: 'mini' | 'small' | 'medium' | 'large' | 'big' | 'huge' | 'massive';
  text?: boolean;
  inline?: boolean;
  inverted?: boolean;
  active?: boolean;
  disabled?: boolean;
  extraClassName?: string;
}

export const Loader = ({
  size = 'medium',
  text = false,
  inline = false,
  inverted = false,
  active = true,
  disabled = false,
  extraClassName = '',
}: Props) => {
  if (disabled) {
    return null;
  }

  if (text) {
    <Segment className={extraClassName}>
      <Dimmer active>
        <SemanticLoader size="massive" active={active} inline={inline} inverted={inverted}>
          Loading
        </SemanticLoader>
      </Dimmer>

      <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" alt="p-skeleton" />
      <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" alt="p-skeleton" />
      <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" alt="p-skeleton" />
    </Segment>;
  }

  return <SemanticLoader active={active} inline={inline} inverted={inverted} size={size} className={extraClassName} />;
};
