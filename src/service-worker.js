const VERSION_SW = `v2`;
const KEY_LAST_CACHE = `les12-task3_${VERSION_SW}`;
const KEY_LAST_CACHE_DYNAMIC = `${KEY_LAST_CACHE}_dynamic`;
const KEY_LAST_CACHE_IMAGES = `${KEY_LAST_CACHE}_images`;

const KEYS_CURRENT_CACHE = [
	KEY_LAST_CACHE,
	KEY_LAST_CACHE_DYNAMIC,
	KEY_LAST_CACHE_IMAGES
]

const REPEAT_REQUESTS = {
	NEWS: {
		timer: null,
		next: 0,
		delay: 5000,
		count: 0,
		limit: 10
	}
}

const FILES_FOR_CACHE = [
	'/ahj-lesson12-task3/',	
	'/images/ui',
	'/app.js',
	'/app.css',
	'/index.html',
	'/service-worker.js'
]

self.addEventListener('install', event => {
	event.waitUntil(onInstall())
})

self.addEventListener('activate', event => {
	event.waitUntil(onActivate())
})

self.addEventListener('message', event => {
	onMessage(event);
})

self.addEventListener('fetch', async event => {
	onFetch(event);
})

const onInstall = async (event) => {
	await saveFilesToCache(KEY_LAST_CACHE, FILES_FOR_CACHE);
}

const onActivate = async (event) => {
	await removeOldCache();
}

const onMessage = async (event) => {
	if(event.data === 'skipWaiting') {
		self.skipWaiting();
	}
}

const onFetch = async (event) => {
	const requestUrl = new URL(event.request.url);

	if(requestUrl.hostname === 'loremflickr.com') {
		event.respondWith(onRequestImage(event));
		return;
	}

	if(requestUrl.pathname.startsWith('/news')) {
		event.respondWith(onRequestNews(event));
		return;
	}
}



const onRequestNews = async (event) => {
	const response = await fetch(event.request)
	.catch(err => {
		postMessageToApp({
			type: 'Error',
			text: "Error Request News" ,
			data: err
		})
	})

	if(response?.status >= 200 && response?.status < 300) {
		event.waitUntil(saveRequestToCache(event.request, response.clone(), KEY_LAST_CACHE_DYNAMIC));
		console.log('response from server')
		return response;
	}
		
	clearRepeatRequestNews()
	repeatRequestNews(event.request);

	const cachedResponse = await getResponseFromCache(event.request, KEY_LAST_CACHE_DYNAMIC);
		
	if(cachedResponse) {
		console.log('response from cache');
		return cachedResponse;
	} 

	return response;	
}

const	onRequestImage = async (event) => {
	const cachedResponse = await getResponseFromCache(event.request, KEY_LAST_CACHE_IMAGES);

	if(cachedResponse) {	
		console.log('image loaded from cache')
		return cachedResponse;
	}

	const response = await fetch(event.request)
	.catch(err => {
		postMessageToApp({
			type: 'Error',
			text: "Error Request Image" ,
			data: err
		});

		return; 
	})

	event.waitUntil(saveRequestToCache(event.request, response.clone(), KEY_LAST_CACHE_IMAGES))
	
	return response;
}

const saveFilesToCache = async (key, files) => {
	const cache = await caches.open(key)
	await cache.addAll(files);
}

const removeOldCache = async () => {
	const allCashes = await caches.keys();
	return Promise.all(
		allCashes.filter(cache => !KEYS_CURRENT_CACHE.includes(cache))
		.map(cache => caches.delete(cache))
	)
}

const saveRequestToCache = async (request, response, key) => {
	const cache = await caches.open(key);
	await cache.put(request, response);
}

const getResponseFromCache = async (request, key) => {
	const cache = await caches.open(key);
	const cachedResponse = await cache.match(request);

	if(cachedResponse) {
		return cachedResponse;
	}

	return false;
}

const saveImageToCache = async (url, key) => {
	const cache = await caches.open(key)
	await cache.add(url);
}

const postMessageToApp = async (message) => {
	const clientsArray = await clients.matchAll()
	clientsArray.forEach(client => client.postMessage(message))
}

const repeatRequestNews = async (request) => {
	if(REPEAT_REQUESTS.NEWS.timer) {
		clearTimeout(REPEAT_REQUESTS.NEWS.timer);
	}

	if(REPEAT_REQUESTS.NEWS.count >= REPEAT_REQUESTS.NEWS.limit) {
		clearRepeatRequestNews()
		return;
	}

	const response = await fetch(request).catch(err => console.log(err));

	if(response?.status >= 200 && response?.status < 300) {
		await saveRequestToCache(request, response,	KEY_LAST_CACHE_DYNAMIC);
		clearRepeatRequestNews()
		postMessageToApp({
			type: 'Upload',
			text: 'Upload New Newses',
		})
		return;
	}

	REPEAT_REQUESTS.NEWS.next += REPEAT_REQUESTS.NEWS.delay;
	REPEAT_REQUESTS.NEWS.count += 1;

	REPEAT_REQUESTS.NEWS.timer = setTimeout((request) => {
		repeatRequestNews(request)
	}, REPEAT_REQUESTS.NEWS.next, request);
}

const clearRepeatRequestNews = () => {
	REPEAT_REQUESTS.NEWS.count = 0;
	REPEAT_REQUESTS.NEWS.next = 0;
}
