import React, { CSSProperties } from 'react'

interface PasswordStrengthBarItemProps {
  score: number
  itemNum: number
  barColors: string[]
  inputCount: number
}

const itemStyle: CSSProperties = {
  flexBasis: 0,
  flexGrow: 1,
  position: 'relative',
  maxWidth: '100%',
  width: '100%',
  height: 2,
}

const Item: React.FunctionComponent<PasswordStrengthBarItemProps> = ({
  score,
  itemNum,
  barColors,
  inputCount,
}) => {
  let bgColor = '#ddd'
  if (inputCount == 0) {
    bgColor = '#ddd'
  } else if (score == 0 && itemNum <= 1) {
    console.log(inputCount)
    bgColor = '#ED2015'
  } else if (score >= itemNum) {
    bgColor = barColors[score]
  }

  return (
    <div
      style={{
        ...itemStyle,
        backgroundColor: bgColor,
      }}
    />
  )
}

export default Item
