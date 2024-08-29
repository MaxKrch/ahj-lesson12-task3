import Render from '../ui/Render';
import Connection from './Connection';
import State from '../state/State';

export default class WidgetNews {
  constructor({ APP_CONTAINER, SERVER_URL, INIT_STATE, TEXT_CONTENT }) {
    this.container = document.querySelector(APP_CONTAINER);
    this.render = new Render(this.container, TEXT_CONTENT);
    this.connection = new Connection(SERVER_URL);
    this.state = new State(INIT_STATE);
  }

  initWidget() {
    this.render.renderWidget();
    this.render.renderBlankNewsFeed(5);
    this.render.createStreams();
    this.subscribeToStreams();
  }

  startWidget() {
    this.connection.requestNews();
  }

  subscribeToStreams() {
    this.render.subscribeOnClicksUpdateNews(this.requestNewsFeed.bind(this));
    this.connection.subscribeOnResponse(this.processingResponse.bind(this));
    this.state.subscribeOnState(this.render.updateNewsFeed.bind(this.render));
  }

  requestNewsFeed() {
    this.render.addActiveBgMainUpdate();
    this.render.hideModalNetworkError();
    this.connection.requestNews();
  }

  processingResponse(response) {
    this.render.removeActiveBgMainUpdate();

    if (response.success === false) {
      this.render.showModalNetworkError();
      return;
    }

    if (response.data) {
      this.state.addNewsListToState(response.data);
      return;
    }
  }

  onMessageFromServiceWorker(message) {
    console.log(message);
  }
}
