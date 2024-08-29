export default function createNewsBlank() {
  const newsBlank = document.createElement(`li`);
  newsBlank.classList.add(`news-item`, `news-item_blank`);
  newsBlank.innerHTML = `
		<div class="blank news-item__date news-item__date_blank"></div>
		<div class="news-item__preview news-item__preview_blank">
			<div class="blank news-item__preview-img news-item__preview-img_blank"></div>
			<div class="news-item__preview-teaser news-item__preview-teaser_blank">
				<p class="blank news-item__preview-teaser_blank-p news-item__preview-teaser_blank-p1"></p>
				<p class="blank news-item__preview-teaser_blank-p news-item__preview-teaser_blank-p2"></p>
				<p class="blank news-item__preview-teaser_blank-p news-item__preview-teaser_blank-p3"></p>
				</div>
			</div>
		</li>
	`;
  return newsBlank;
}
