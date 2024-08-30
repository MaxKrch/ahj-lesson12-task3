import moment from 'moment';

export default function createNewsItem(news) {
  const newsEl = document.createElement(`li`);
  const newsDate = createNewsDate(news);
  const newsPreview = createNewsPreview(news);

  newsEl.classList.add(`news-item`);
  newsEl.dataset.name = `newsItem`;
  newsEl.dataset.id = news.id;

  newsEl.append(newsDate, newsPreview);

  return newsEl;
}

const createNewsDate = (news) => {
  const date = moment(news.date).locale('ru').format('DD.MM.yy HH:mm');
  const dateEl = document.createElement(`div`);

  dateEl.classList.add(`news-item__date`);
  dateEl.dataset.name = `newsDate`;
  dateEl.dataset.id = news.id;
  dateEl.textContent = date;

  return dateEl;
};

const createNewsPreview = (news) => {
  const poster = createNewsPreviewPoster(news);
  const teaser = createNewsPreviewTeaser(news);
  const newsPreview = document.createElement(`div`);

  newsPreview.classList.add(`news-item__preview`);
  newsPreview.dataset.name = `newsPreview`;
  newsPreview.dataset.id = news.id;

  newsPreview.append(poster, teaser);

  return newsPreview;
};

const createNewsPreviewPoster = (news) => {
  const poster = document.createElement(`div`);
  const altText = news.teaser.slice(0, 12);

  poster.classList.add(`news-item__preview-img`);
  poster.dataset.name = `newsPreviewImg`;
  poster.dataset.id = news.id;

  poster.innerHTML = `
		<img 
			src="${news.poster}" 
			alt="${altText}"
			class="news-item__preview-img__img"
		>
	`;

  return poster;
};

const createNewsPreviewTeaser = (news) => {
  const teaser = document.createElement(`div`);

  teaser.classList.add(`news-item__preview-teaser`);
  teaser.dataset.name = `newsPreviewTeaser`;
  teaser.dataset.id = news.id;
  teaser.textContent = news.teaser;

  return teaser;
};
