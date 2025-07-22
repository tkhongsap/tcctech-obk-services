import SvgCheck from '@assets/svg/check.svg'
import SvgUnCheck from '@assets/svg/uncheck.svg'
import SvgInterminate from '@assets/svg/indeterminate.svg'

export default function CheckboxIcon(props: any) {
  const { isIndeterminate, isChecked = false, ...rest } = props

  return (
    <>
      {isIndeterminate && <SvgInterminate {...rest} />}
      {isChecked && !isIndeterminate && <SvgCheck {...rest} />}
      {!isChecked && !isIndeterminate && <SvgUnCheck {...rest} />}
    </>
  )
}
