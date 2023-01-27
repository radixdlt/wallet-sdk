import { filter } from 'rxjs'
import { SubjectsType } from '../subjects'

export const messageEvents = (subjects: SubjectsType, interactionId: string) =>
  subjects.messageLifeCycleEventSubject.pipe(
    filter((message) => message.interactionId === interactionId)
  )
