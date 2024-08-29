import { fromEvent, merge, throttleTime } from 'rxjs';
import createNewsItem from './createNewsItem';
import createNewsBlank from './createNewsBlank';

export default class Render {
  constructor(container, CONTENT) {
    this.CONTENT = CONTENT;
    this.container = container;
    this.widget = {
      main: {
        container: null,
        update: null,
        title: null,
        newses: null,
      },
      modal: {
        container: null,
        networkError: {
          container: null,
          main: {
            container: null,
            title: null,
            description: null,
          },
          buttons: {
            container: null,
            confirm: null,
            cancel: null,
          },
        },
      },
    };
    this.streams = {
      clicksToUpdateNews: {
        stream$: null,
        subscriptions: new Set(),
      },
      clicksToCloseNetworkError: {
        stream$: null,
        subscriptions: new Set(),
      },
    };
  }

  renderWidget() {
    this.widget.container = document.createElement(`div`);
    this.widget.container.classList.add(`widget`, `news-feed`);
    this.widget.container.dataset.id = `newsFeed`;

    this.createMain();
    this.createModal();

    this.widget.container.append(
      this.widget.main.container,
      this.widget.modal.container,
    );

    this.container.append(this.widget.container);
  }

  createMain() {
    this.widget.main.container = document.createElement(`main`);
    this.widget.main.container.classList.add(`container`, `main-container`);

    this.createMainUpdate();
    this.createMainTitle();
    this.createMainNewsList();

    this.widget.main.container.append(
      this.widget.main.update,
      this.widget.main.title,
      this.widget.main.newses,
    );
  }

  createModal() {
    this.widget.modal.container = document.createElement(`aside`);
    this.widget.modal.container.classList.add(
      `modal`,
      `modal-container`,
      `hidden-item`,
    );

    this.createModalNetworkError();

    this.widget.modal.container.append(
      this.widget.modal.networkError.container,
    );
  }

  createMainUpdate() {
    this.widget.main.update = document.createElement(`button`);
    this.widget.main.update.classList.add(`button`, `news-feed__update`);
    this.widget.main.update.dataset.id = `newsUpdate`;
    this.widget.main.update.textContent = this.CONTENT.NEWS_FEED_UPDATE;
  }

  createMainTitle() {
    this.widget.main.title = document.createElement(`h1`);
    this.widget.main.title.classList.add(`news-feed__title`);
    this.widget.main.title.textContent = this.CONTENT.NEWS_FEED_TITLE;
  }

  createMainNewsList() {
    this.widget.main.newses = document.createElement(`ul`);
    this.widget.main.newses.classList.add(`news-feed__list`);
    this.widget.main.newses.dataset.id = `newsList`;
  }

  createModalNetworkError() {
    this.widget.modal.networkError.container =
      document.createElement(`article`);
    this.widget.modal.networkError.container.classList.add(
      `modal-body`,
      `modal-network-error`,
      `hidden-item`,
    );
    this.widget.modal.networkError.container.dataset.id = `modalNetworkError`;

    this.createModalNetworkErrorMain();
    this.createModalNetworkErrorButtons();

    this.widget.modal.networkError.container.append(
      this.widget.modal.networkError.main.container,
      this.widget.modal.networkError.buttons.container,
    );
  }

  createModalNetworkErrorMain() {
    this.widget.modal.networkError.main.container =
      document.createElement(`main`);
    this.widget.modal.networkError.main.container.classList.add(
      `modal-main`,
      `modal-network-error__main`,
    );

    this.createModalNetworkErrorMainTitle();
    this.createModalNetworkErrorMainDescription();

    this.widget.modal.networkError.main.container.append(
      this.widget.modal.networkError.main.title,
      this.widget.modal.networkError.main.description,
    );
  }

  createModalNetworkErrorButtons() {
    this.widget.modal.networkError.buttons.container =
      document.createElement(`div`);
    this.widget.modal.networkError.buttons.container.classList.add(
      `modal-buttons`,
      `modal-network-error__buttons`,
    );

    this.createModalNetworkErrorButtonsConfirm();
    this.createModalNetworkErrorButtonsCancel();

    this.widget.modal.networkError.buttons.container.append(
      this.widget.modal.networkError.buttons.confirm,
      this.widget.modal.networkError.buttons.cancel,
    );
  }

  createModalNetworkErrorMainTitle() {
    this.widget.modal.networkError.main.title = document.createElement(`h2`);
    this.widget.modal.networkError.main.title.classList.add(
      `modal-title`,
      `modal-network-error__title`,
    );
    this.widget.modal.networkError.main.title.dataset.id = `ModalNetworkErrorTitle`;
    this.widget.modal.networkError.main.title.textContent =
      this.CONTENT.MODAL_NETWORK_ERROR_TITLE;
  }

  createModalNetworkErrorMainDescription() {
    this.widget.modal.networkError.main.description =
      document.createElement(`p`);
    this.widget.modal.networkError.main.description.classList.add(
      `modal-descr`,
      `modal-network-error__descr`,
    );
    this.widget.modal.networkError.main.description.dataset.id = `ModalNetworkErrorDescr`;
    this.widget.modal.networkError.main.description.textContent =
      this.CONTENT.MODAL_NETWORK_ERROR_DESCR;
  }

  createModalNetworkErrorButtonsConfirm() {
    this.widget.modal.networkError.buttons.confirm =
      document.createElement(`button`);
    this.widget.modal.networkError.buttons.confirm.classList.add(
      `button`,
      `modal-button`,
      `modal-network-error__button`,
      `modal-network-error__button-confirm`,
    );
    this.widget.modal.networkError.buttons.confirm.dataset.id = `modalNetworkErrorConfirm`;
    this.widget.modal.networkError.buttons.confirm.textContent =
      this.CONTENT.MODAL_NETWORK_ERROR_CONFIRM;
  }

  createModalNetworkErrorButtonsCancel() {
    this.widget.modal.networkError.buttons.cancel =
      document.createElement(`button`);
    this.widget.modal.networkError.buttons.cancel.classList.add(
      `button`,
      `modal-button`,
      `modal-network-error__button`,
      `modal-network-error__button-cancel`,
    );
    this.widget.modal.networkError.buttons.cancel.dataset.id = `modalNetworkErrorCancel`;
    this.widget.modal.networkError.buttons.cancel.textContent =
      this.CONTENT.MODAL_NETWORK_ERROR_CANCEL;
  }

  renderBlankNewsFeed(count) {
    this.disableScrollBody();
    const blankNewsArray = [];

    for (let i = 0; i < count; i += 1) {
      const newsEl = createNewsBlank();
      blankNewsArray.push(newsEl);
    }

    this.widget.main.newses.append(...blankNewsArray);
  }

  renderNewsFeed() {
    this.enableScrollBody();
  }

  enableScrollBody() {
    document.body.classList.remove('no-scroll');
  }

  disableScrollBody() {
    document.body.classList.add('no-scroll');
  }

  addActiveBgMainUpdate() {
    this.widget.main.update.classList.add(`blank`);
  }

  removeActiveBgMainUpdate() {
    this.widget.main.update.classList.remove(`blank`);
  }

  createStreams() {
    this.streams.clicksToUpdateNews.stream$ = merge(
      fromEvent(this.widget.main.update, `click`),
      fromEvent(this.widget.modal.networkError.buttons.confirm, `click`),
    ).pipe(throttleTime(250));

    this.streams.clicksToCloseNetworkError.stream$ = fromEvent(
      this.widget.modal.networkError.buttons.cancel,
      `click`,
    ).pipe(throttleTime(250));

    this.subscribeOnClicksCloseNetworkError(
      this.hideModalNetworkError.bind(this),
    );
  }

  subscribeOnStream(stream, callback) {
    const targetStream = this.streams[stream];
    const subscription = targetStream.stream$.subscribe({
      next: callback,
    });
    targetStream.subscriptions.add(subscription);
  }

  unSubscribeFromStream(stream, subscription) {
    subscription.unsubscribe();
    stream.subscriptions.delete(subscription);
  }

  clearSubscriptionsStream(stream) {
    const targetStream = this.streams[stream];
    targetStream.subscriptions.forEach((subscription) => {
      this.unSubscribeFromStream(targetStream, subscription);
    });
  }

  showModalNetworkError() {
    this.showModal();
    this.widget.modal.networkError.container.classList.remove(`hidden-item`);
  }

  hideModalNetworkError() {
    this.hideModal();
    this.widget.modal.networkError.container.classList.add(`hidden-item`);
  }

  showModal() {
    this.disableScrollBody();
    this.widget.modal.container.classList.remove(`hidden-item`);
  }

  hideModal() {
    if (this.chekNewsOnPage()) {
      this.enableScrollBody();
    }

    this.widget.modal.container.classList.add(`hidden-item`);
  }

  updateNewsFeed(newsList) {
    this.enableScrollBody();
    this.clearNewsFeed();

    const newsListArray = JSON.parse(newsList);
    this.createNewsFeed(newsListArray);
  }

  chekNewsOnPage() {
    const chek = this.widget.main.newses.querySelector(`.blank`);

    if (chek) {
      return false;
    }
    return true;
  }

  clearNewsFeed() {
    this.widget.main.newses.innerHTML = '';
  }

  createNewsFeed(newsList) {
    const newsListItems = [];
    newsList.forEach((news) => {
      const newsItem = createNewsItem(news);
      newsListItems.push(newsItem);
    });
    this.widget.main.newses.append(...newsListItems);
  }

  subscribeOnClicksUpdateNews(callback) {
    this.subscribeOnStream(`clicksToUpdateNews`, callback);
  }

  subscribeOnClicksCloseNetworkError(callback) {
    this.subscribeOnStream(`clicksToCloseNetworkError`, callback);
  }
}
