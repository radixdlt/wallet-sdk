import { filter } from 'rxjs'
import { Subjects } from '../subjects'

export const messageEvents = (subjects: Subjects, interactionId: string) =>
  subjects.messageLifeCycleEventSubject.pipe(
    filter((message) => message.interactionId === interactionId)
  )
