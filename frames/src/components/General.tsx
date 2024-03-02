import { Button, type ButtonResetProps, type ButtonLinkProps} from 'frog'
import { kodaUrl } from '../utils'

export type ButtonProps = {
  children?: string
  action?: string | undefined
  value?: string | undefined
}

export type NoProps = {}

export function Reset(props: ButtonResetProps) {
  return Button.Reset({...props, children: 'Reset'})
}

export function ArrowNext(props: ButtonProps) {
  return Button({...props, children: '→' })
}

export function ArrowPrevious(props: ButtonProps) {
  return Button({...props, children: '←' })
}

export function Random(props: ButtonProps | NoProps) {
  return Button({...props, children: '🎲' })
}

type GalleryLinkProps = ButtonProps & {
  chain: string
  collection: string
  token?: string
  redirect?: boolean
}

export function GalleryLink(props: GalleryLinkProps) {
  const href = kodaUrl(props.chain, props.collection, props.token)
  if (props.redirect) {
    return Button.Redirect({...props, location: href, children: '🖼️💚'})
  }

  return Button.Link({...props, href, children: '🖼️'})
}
