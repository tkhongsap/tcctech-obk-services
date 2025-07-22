import { CATEGORY_STATUS, USER_STATUS } from '@src/data/constants/status'
import clsx from 'clsx'
import React from 'react'

export const UserStatusBadge = ({ status }: { status: USER_STATUS }) => {
  const badgeClassName =
    'tw-rounded-[8px] tw-py-0.5 tw-px-2 tw-flex tw-justify-center tw-items-center tw-w-fit'
  switch (status) {
    case USER_STATUS.ACTIVE:
      return (
        <div
          className={clsx('tw-bg-[#EFF8E8] tw-text-[#59B413]', badgeClassName)}
        >
          Active
        </div>
      )
    case USER_STATUS.SUSPEND:
      return (
        <div
          className={clsx('tw-bg-[#FBE9E9] tw-text-[#CD1A1A]', badgeClassName)}
        >
          Suspend
        </div>
      )
  }
}

export const CategoryBadge = ({ status }: { status: CATEGORY_STATUS }) => {
  const badgeClassName =
    'tw-rounded-[8px] tw-py-0.5 tw-px-2 tw-flex tw-justify-center tw-items-center tw-w-fit'
  switch (status) {
    case CATEGORY_STATUS.ACTIVE:
      return (
        <div
          className={clsx('tw-bg-[#EFF8E8] tw-text-[#59B413]', badgeClassName)}
        >
          Active
        </div>
      )
    case CATEGORY_STATUS.INACTIVE:
      return (
        <div
          className={clsx('tw-bg-[#FBE9E9] tw-text-[#CD1A1A]', badgeClassName)}
        >
          Inactive
        </div>
      )
  }
}

export const PublicBadge = ({ isPublic }: { isPublic: boolean }) => {
  const badgeClassName =
    'tw-rounded-[8px] tw-py-0.5 tw-px-2 tw-flex tw-justify-center tw-items-center tw-w-fit'

  if (isPublic) {
    return (
      <div
        className={clsx('tw-bg-[#007bff] tw-text-[#eff0f3]', badgeClassName)}
      >
        Public
      </div>
    )
  } else {
    return (
      <div
        className={clsx('tw-bg-[#DCE1E5] tw-text-[#818181]', badgeClassName)}
      >
        Unpublic
      </div>
    )
  }
}
