// import * as api from './api';

import {api} from "./api";
import {getSurahName, getSurahNameArabic} from "./quran";
const quran = require('./quran');
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quran API</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            padding: 20px;
            width: 80%;
            max-width: 600px;
            text-align: center;
        }
        .select-container {
            margin-bottom: 20px;
        }
        .details {
            text-align: left;
        }
        .verses {
            margin-top: 20px;
        }
        .verse {
            margin-bottom: 15px;
        }
        .verse-content {
            font-size: 18px;
        }
        .verse-url {
            font-size: 14px;
            color: #007BFF;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="select-container">
            <label for="chapterSelect">Select Chapter:</label>
            <select id="chapterSelect">
                <option value="">--Select a Chapter--</option>
            </select>
        </div>
        <div class="details" id="details">
            <!-- Chapter details will be shown here -->
        </div>
        <div class="verses" id="verses">
            <!-- Verses will be shown here -->
        </div>
    </div>

    <script>
        const chapterSelect = document.getElementById('chapterSelect');
        const detailsDiv = document.getElementById('details');
        const versesDiv = document.getElementById('verses');

        // Populate the select box with chapter numbers
        for (let i = 1; i <= 114; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = \`Chapter \${i}\`;
            chapterSelect.appendChild(option);
        }

        chapterSelect.addEventListener('change', async function() {
            const chapterNumber = this.value;
            if (chapterNumber) {
                const response = await fetch(\`/api/v1/chapter/\${chapterNumber}\`);
                const data = await response.json();

                if (data.error) {
                    detailsDiv.innerHTML = \`<p>\${data.error}</p>\`;
                    versesDiv.innerHTML = '';
                } else {
                    // Display chapter details
                    detailsDiv.innerHTML = \`
                        <h2>\${data.data.name} (\${data.data.nameArabic})</h2>
                        <p><strong>English:</strong> \${data.data.chapterDetails.english}</p>
                        <p><strong>Turkish:</strong> \${data.data.chapterDetails.turkish}</p>
                        <p><strong>French:</strong> \${data.data.chapterDetails.french}</p>
                        <p><strong>Place:</strong> \${data.data.chapterDetails.place}</p>
                        <p><strong>Juz:</strong> \${data.data.chapterDetails.juz.name} (Number: \${data.data.chapterDetails.juz.number})</p>
                        <p><a href="\${data.data.chapterDetails.chapterUrl}" target="_blank">Chapter URL</a></p>
                    \`;

                    // Display verses
                    versesDiv.innerHTML = data.data.verses.map(verse => \`
                        <div class="verse">
                            <p class="verse-content">\${verse.content}</p>
                            <p class="verse-url"><a href="\${verse.verseUrl}" target="_blank">Verse URL</a></p>
                        </div>
                    \`).join('');
                }
            } else {
                detailsDiv.innerHTML = '';
                versesDiv.innerHTML = '';
            }
        });
    </script>
</body>
</html>
`;

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);

		if (url.pathname === '/') {
			return new Response(htmlContent, {
				headers: { 'Content-Type': 'text/html' }
			});
		} else if (url.pathname.startsWith('/api/v1/')) {
			const endpoint = url.pathname.replace('/api/v1/', '');
			const lang = url.searchParams.get('lang');
			const data = await api(endpoint, lang);
			if (data) {
				return new Response(JSON.stringify(data), {
					headers: { 'Content-Type': 'application/json' }
				});
			}
		} else {
			return new Response('Not Found', { status: 404 });
		}
	}
};
