
import quranData from './db/quran.json';



function api(endpoint){

	if (endpoint === 'quran') {

		return quranData;

	}

}


export { api };
