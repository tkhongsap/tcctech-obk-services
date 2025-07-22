export const IconCell = ({
  value,
  IconComponent,
  color,
}: {
  value: any
  IconComponent: React.ElementType
  color: string
}) => (value ? <IconComponent style={{ color }} /> : null)
