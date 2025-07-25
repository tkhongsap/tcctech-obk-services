import React, { Fragment, CSSProperties, ReactNode } from 'react'

// components
import Item from './item'
import zxcvbn from 'zxcvbn'

export interface PasswordFeedback {
  warning?: string
  suggestions?: string[]
}

interface PasswordIndicatorBarState {
  score: number
}

export interface PasswordIndicatorProps {
  className?: string
  style?: CSSProperties
  scoreWordClassName?: string
  scoreWordStyle?: CSSProperties
  password: string
  userInputs?: string[]
  barColors?: string[]
  scoreWords?: ReactNode[]
  minLength?: number
  shortScoreWord?: ReactNode
  onChangeScore?: (
    score: PasswordIndicatorBarState['score'],
    feedback: PasswordFeedback
  ) => void
}

const rootStyle: CSSProperties = {
  position: 'relative',
}

const wrapStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  margin: '5px 0 0',
}

const spaceStyle: CSSProperties = {
  width: 1,
}

const descStyle: CSSProperties = {
  margin: '5px 0 0',
  color: '#898792',
  fontSize: 14,
  textAlign: 'right',
}

class PasswordIndicatorBar extends React.Component<
  PasswordIndicatorProps,
  PasswordIndicatorBarState
> {
  public static defaultProps: PasswordIndicatorProps = {
    className: undefined,
    style: undefined,
    scoreWordClassName: undefined,
    scoreWordStyle: undefined,
    password: '',
    userInputs: [],
    barColors: ['#ED2015', '#ED2015', '#1EACFF', '#34C759', '#1E7735'],
    scoreWords: ['VeryWeak', 'VeryWeak', 'Medium', 'Strong', 'VeryStrong'],
    minLength: 1,
    shortScoreWord: '',
    onChangeScore: undefined,
  }

  public state = {
    score: 0,
  }

  public componentDidMount(): void {
    this.setScore()
  }

  public componentDidUpdate(prevProps: PasswordIndicatorProps): void {
    const { password } = this.props
    if (prevProps.password !== password) {
      this.setScore()
    }
  }

  private setScore = (): void => {
    const { password, minLength, userInputs, onChangeScore } = this.props
    let result = null
    let score = 0
    let feedback: PasswordFeedback = {}
    if (password.length >= minLength!) {
      result = zxcvbn(password, userInputs)
      ;({ score, feedback } = result)
    }
    this.setState(
      {
        score,
      },
      () => {
        if (onChangeScore) {
          onChangeScore(score, feedback)
        }
      }
    )
  }

  public render(): ReactNode {
    const {
      className,
      style,
      scoreWordClassName,
      scoreWordStyle,
      password,
      barColors,
      scoreWords,
      minLength,
      shortScoreWord,
    } = this.props
    const { score } = this.state
    const newShortScoreWord =
      password.length >= minLength! ? scoreWords![score] : shortScoreWord

    return (
      <div className={className} style={{ ...rootStyle, ...style }}>
        <div style={wrapStyle}>
          {[1, 2, 3].map((el: number) => (
            <Fragment key={`password-strength-bar-item-${el}`}>
              {el > 0 && <div style={spaceStyle} />}
              <Item
                inputCount={password.length}
                score={score}
                itemNum={el}
                barColors={barColors as string[]}
              />
            </Fragment>
          ))}
        </div>
        <p
          className={scoreWordClassName}
          style={{ ...descStyle, ...scoreWordStyle }}
        >
          {newShortScoreWord}
        </p>
      </div>
    )
  }
}

export default PasswordIndicatorBar
