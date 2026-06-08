"use client"

import { type Task } from "../types"
import { WeeklyCalendarDesktop } from "./WeeklyCalendarDesktop"
import { WeeklyCalendarMobile } from "./WeeklyCalendarMobile"

type Props = {
  tasks: Task[]
}

export function WeeklyCalendar({ tasks }: Props) {
  return (
    <>
      <div className="hidden md:block">
        <WeeklyCalendarDesktop tasks={tasks} />
      </div>
      <div className="md:hidden">
        <WeeklyCalendarMobile tasks={tasks} />
      </div>
    </>
  )
}