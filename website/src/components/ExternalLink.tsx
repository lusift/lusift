export function ExternalLink(props: any) {
  return <a {...props} rel="noopener" target={props.target || '_blank'} />;
}

