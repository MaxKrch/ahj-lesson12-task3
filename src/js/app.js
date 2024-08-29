import WidgetNews from './api/WidgetNews';
import VARIABLE from './state/VARIABLE';

import askUserAboutUpdate from './ui/askUserAboutUpdate';

window.addEventListener('load', async () => {
  try {
    if (navigator.serviceWorker) {
      const registrationWorker = await navigator.serviceWorker.register(
        new URL(
          /* webpackChunkName: 'service-worker' */
          './service-worker.js',
          import.meta.url,
        ),
      );

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

      if (registrationWorker.waiting) {
        askUserAboutUpdate(registrationWorker.waiting);
      }
    }
  } catch (err) {
    console.log(err);
  }
});

const widgetNews = new WidgetNews(VARIABLE);
widgetNews.initWidget();
navigator.serviceWorker.addEventListener('message', (event) => {
  widgetNews.onMessageFromServiceWorker(event);
});
widgetNews.startWidget();
