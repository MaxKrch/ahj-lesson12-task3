import { Subject, scan, shareReplay } from 'rxjs';

export default class State {
  constructor(state) {
    this.state$ = new Subject().pipe(
      scan((oldState, newState) => {
        if (newState) {
          return newState;
        }
        return oldState;
      }, state),
      shareReplay(1),
    );
    this.subscriptions = new Set();
  }

  updateState(newState) {
    this.state$.next(newState);
  }

  subscribeOnState(callback) {
    const subscription = this.state$.subscribe({
      next: callback,
    });
    this.subscriptions.add(subscription);
  }

  unSubscribeFromState(subscription) {
    subscription.unsubscribe();
    this.subscriptions.delete(subscription);
  }

  clearSubscriptionsOfState() {
    this.subscriptions.forEach((subscription) => {
      this.unsubscribe(subscription);
    });
  }

  addNewsListToState(newsList) {
    this.state$.next(newsList);
  }
}
