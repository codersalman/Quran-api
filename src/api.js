import {
	checkSajdah,
	getChapterAndItsVerses, getJuzNumber,
	getSurahAndVersesFromJuz,
	getSurahName,
	getSurahNameArabic, getSurahURL, getVerseTranslation,
	getVerseURL
} from "./quran";
import surahData from "./db/surah-data.json";


function api(endpoint , lang){


	if (endpoint === "quran") {
		return {
			totalMakkiSurahs: 89,
			totalMadaniSurahs: 25,
			totalJuzCount: 30,
			totalSurahCount: 114,
			totalVerseCount: 6236,
		};
	}
	else if (endpoint === "juz") {

		const juzNumber = parseInt(1);
		if (juzNumber > 30 || juzNumber <= 0) {
			throw "No Juz found with given juzNumber";
		}
		return getSurahAndVersesFromJuz(juzNumber);


	}else if (endpoint.startsWith("chapter")) {
		endpoint = endpoint.replace("chapter/", "");
		const surahNumber = parseInt(endpoint);
		if (surahNumber > 114 || surahNumber <= 0) {
			throw "No Surah found with given surahNumber";
		}
		// getVerseTranslation( surahNumber, lang);
	  let verseData =	getChapterAndItsVerses(surahNumber).verses.map((verse) => {
			verse.text = verse.content;
			verse.verse_number_in_surah = verse.verse_number;
			verse.is_sajdah = checkSajdah(verse.verse_number, surahNumber);
			verse.verse_url = getVerseURL(surahNumber, verse.verse_number);
			delete verse.content;
			delete verse.verse_number;
			delete verse.surah_number;
			return verse;
		})

		// surahData[surahNumber - 1].chapterUrl = getSurahURL(surahNumber);
		// surahData[surahNumber - 1].juzNumber = 1

		return {
			surahNumber: surahNumber,
			data :{
				name: getSurahName(surahNumber),
				nameArabic: getSurahNameArabic(surahNumber),
				chapterDetails:  surahData[surahNumber - 1],
				verses:verseData
			}
		};
	}

}


export { api };
