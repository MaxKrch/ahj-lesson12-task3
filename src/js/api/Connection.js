import { Subject, switchMap, catchError, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';

export default class Connection {
  constructor(SERVER_URL) {
    this.url = SERVER_URL;

    this.subscriptions = new Set();
    this.responses$ = new Subject().pipe(switchMap((value) => value));
  }

  subscribeOnResponse(callback) {
    const subscription = this.responses$.subscribe({
      next: callback,
    });
    this.subscriptions.add(subscription);
  }

  unSubscribeFromResponse(subscription) {
    subscription.unsubscribe();
    this.subscriptions.delete(subscription);
  }

  clearSubcriprionsOfResponses() {
    this.subscriptions.forEach((subscription) => {
      this.unSubscribeFromResponse(subscription);
    });
  }

  requestNews() {
    const newsUrl = `${this.url}/news`;
    const request = ajax.getJSON(newsUrl).pipe(
      catchError((error) => {
        return of({
          success: false,
          status: error.status,
        });
      }),
    );
    this.responses$.next(request);
  }
}
