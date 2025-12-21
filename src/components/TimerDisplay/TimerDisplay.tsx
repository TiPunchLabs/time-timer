import { useMemo } from 'react'
import { ClockCircle } from '../ClockCircle'
import { getCirclesData } from '../../utils/time'
import { CIRCLE_SIZES } from '../../constants/design'

interface TimerDisplayProps {
  /** Total duration in minutes */
  totalMinutes: number
  /** Remaining time in seconds */
  remainingSeconds: number
  /** Whether the timer is paused */
  isPaused?: boolean
  /** Custom color for circles */
  color?: string
}

export function TimerDisplay({
  totalMinutes,
  remainingSeconds,
  isPaused = false,
  color,
}: TimerDisplayProps) {
  const circlesData = useMemo(
    () => getCirclesData(totalMinutes, remainingSeconds),
    [totalMinutes, remainingSeconds]
  )

  // Determine circle size based on count (max 4 circles)
  const circleSize = useMemo(() => {
    const count = circlesData.length
    if (count === 1) return CIRCLE_SIZES.xl
    if (count === 2) return CIRCLE_SIZES.lg
    return CIRCLE_SIZES.md // 3-4 circles
  }, [circlesData.length])

  // Grid configuration based on circle count (max 4 circles)
  const gridClass = useMemo(() => {
    const count = circlesData.length
    if (count === 1) return 'grid-cols-1'
    return 'grid-cols-2' // 2, 3, or 4 circles in 2-column grid
  }, [circlesData.length])

  if (circlesData.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-400">
        Configurez une durée pour commencer
      </div>
    )
  }

  return (
    <div className={`grid ${gridClass} gap-4 md:gap-6 place-items-center p-2 md:p-4`}>
      {circlesData.map((circle) => (
        <div
          key={circle.index}
          className="flex flex-col items-center"
        >
          <ClockCircle
            fillPercentage={circle.fillPercentage}
            maxFillPercentage={circle.maxFillPercentage}
            size={circleSize}
            isActive={circle.isActive}
            isPaused={isPaused}
            isEmpty={circle.state === 'empty'}
            color={color}
          />
          {/* Circle number label */}
          <span className="text-xs text-gray-400 mt-1">
            {circle.index + 1}
          </span>
        </div>
      ))}
    </div>
  )
}
