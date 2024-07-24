// import * as api from './api';

import {api} from "./api";
import {getSurahName, getSurahNameArabic} from "./quran";
const quran = require('./quran');

export default {
  async fetch(request, env, ctx, options) {
    const url = new URL(request.url);

    if (url.pathname === '/') {
      return new Response(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Quran API</title>
        </head>
        <body>
          <h1>Quran API</h1>
          <p>Welcome to Quran API</p>
          <h2>Endpoints</h2>
          <ul style="text-decoration: none">
            <li>/quran</li>
            <li>/juz/:juzNumber</li>
            <li>/verse/:surahNumber/:verseNumber</li>
          </ul>
        </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    } else if (url.pathname === '/api/v1' || url.pathname.startsWith('/api/v1/') ){
      const endpoint = url.pathname.replace('/api/v1/', '');
			// take language code in path parameter also to be used in the api function
			const lang = url.searchParams.get('lang');
			const data = api(endpoint, lang);
			if (data) {
				return new Response(JSON.stringify(data), {
					headers: { 'Content-Type': 'application/json' }
				});
			}
    } else {

			return new Response('Not Found', { status: 404 });
    }
  },




  // async error(request, env, ctx, error) {
  //   return new Response('Internal Server Error', { status: 500 });
  // }
};
