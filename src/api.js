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
		lang = lang || "en";
		const surahNumber = parseInt(endpoint);
		if (surahNumber > 114 || surahNumber <= 0) {
			throw "No Surah found with given surahNumber";
		}

	  let verseData =	getChapterAndItsVerses(surahNumber).verses.map((verse) => {
			verse.aya_number_in_surah = verse.verse_number;
			verse.is_sajdah = checkSajdah(verse.verse_number, surahNumber);
			verse.verseUrl = getVerseURL(surahNumber, verse.verse_number);
			verse.translation =  getVerseTranslation(surahNumber, verse.verse_number, lang) || "";
			return verse;
		})

		surahData[surahNumber - 1].chapterUrl = getSurahURL(surahNumber);
		surahData[surahNumber - 1].juz = getJuzNumber(surahNumber,surahData[surahNumber - 1].aya);

		return {
			surahNumber: surahNumber,
			data :{
				name: getSurahName(surahNumber),
				nameArabic: getSurahNameArabic(surahNumber),
				chapterDetails:  surahData[surahNumber - 1],
				verses:verseData,

			}
		};
	}

}


export { api };
