/* @flow */
'use strict'

import { List } from 'immutable'

export type Task = {
  id: number,
  name: string,
  description: string,
  creationTime: string,
  status: TaskStatus,
  employees?: List<Employee>,
  section?: Section,
  dueTime?: number,
  urgent: boolean,
  appeal: boolean,
  creator?: Employee
}

export type TaskStatus = 'new' | 'doing' | 'done'

export type Role = 'USER' | 'ADMIN'

export type Employee = {
  name: string,
  username: string,
  rank: Rank,
  tasks: List<Task>,
  createdTasks: List<Task>,
  email: string,
  password: string
}

export type Section = {
  id: number,
  name: string
}

export type Rank = 'worker' | 'manager'

export type App = {
  view: ViewState,
  page: PageState
}

export type ViewState = 'current' | 'completed'
export type PageState = 'main' | 'new-user'

export type NotifType = 'CREATE' | 'UPDATE' | 'DELETE'

export type Notif = {
  type: 'CREATE' | 'UPDATE',
  body: Task,
  initiator: actionInitiator
} | {
  type: 'DELETE',
  body: number,
  initiator: actionInitiator
}

export type actionInitiator = {
  username: string
}

export type TaskFilter = {
  name?: string,
  description?: string,
  creationTime?: {
    earliestTime?: number,
    latestTime?: number
  },
  status?: TaskStatus,
  employee?: Employee,
  section?: Section,
  dueTime?: {
    earliestTime?: number,
    latestTime?: number
  }
}
