import { PrimeReactPTOptions } from 'primereact/api'
import { BadgePassThroughMethodOptions } from 'primereact/badge'
import { MessagePassThroughMethodOptions } from 'primereact/message'
import { TagPassThroughMethodOptions } from 'primereact/tag'
import { classNames } from 'primereact/utils'

export const passThrough: PrimeReactPTOptions = {
  message: {
    root: ({ props }: MessagePassThroughMethodOptions) => ({
      className: classNames('', {
        'bg-success text-success': props.severity == 'success',
        'bg-info text-info ':
          props.severity == 'info' ||
          props.severity == null ||
          props.severity == undefined,
        'bg-warning text-warning': props.severity == 'warn',
        'bg-danger text-danger ': props.severity == 'error',
      }),
    }),
  },
  badge: {
    root: ({ props }: BadgePassThroughMethodOptions) => ({
      className: classNames('', {
        'bg-success text-success': props.severity == 'success',
        'bg-info text-info ':
          props.severity == 'info' ||
          props.severity == null ||
          props.severity == undefined,
        'bg-warning text-warning': props.severity == 'warning',
        'bg-danger text-danger ': props.severity == 'danger',
      }),
    }),
  },
  tag: {
    root: ({ props }: TagPassThroughMethodOptions) => ({
      className: classNames('', {
        'bg-success text-success': props.severity == 'success',
        'bg-info text-info ':
          props.severity == 'info' ||
          props.severity == null ||
          props.severity == undefined,
        'bg-warning text-warning': props.severity == 'warning',
        'bg-danger text-danger ': props.severity == 'danger',
      }),
    }),
  },
}
