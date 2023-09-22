import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@jemtickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
