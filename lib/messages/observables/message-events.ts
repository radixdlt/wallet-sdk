import { filter } from 'rxjs'
import { SubjectsType } from '../subjects'

export const messageEvents = (subjects: SubjectsType, requestId: string) =>
  subjects.messageLifeCycleEventSubject.pipe(
    filter((message) => message.requestId === requestId)
  )
