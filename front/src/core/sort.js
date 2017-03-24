/* flow */
'use strict'

export function sortTasks (
  tasks: List<Task>
): List<Task> {
  return tasks.sort((a, b) => a.urgent && !b.urgent
    ? -1
    : b.urgent && !a.urgent
      ? 1
      : a.status === 'new' && b.status !== 'new'
        ? -1
        : a.status !== 'new' && b.status === 'new'
          ? 1
          : a.dueTime && !b.dueTime
            ? -1
            : b.dueTime && !a.dueTime
              ? 1
              : !a.dueTime && !b.dueTime
                ? (b.creationTime - a.creationTime)
                : (a.dueTime - b.dueTime)
  )
}
