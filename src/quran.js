
import quranText from './db/quran.json';
import surahData from './db/surah-data.json';
import pageData from './db/page-data.json';
import juzData from './db/juz-data.json';
import sajdahVerses from './db/sajdah-verses.json';
import enClearQuran from './db/translations/enClearQuran.json';


const totalPagesCount = 604;
const totalMakkiSurahs = 89;
const totalMadaniSurahs = 25;
const totalJuzCount = 30;
const totalSurahCount = 114;
const totalVerseCount = 6236;
const basmala = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";
const sajdah = "سَجْدَةٌ";


function getPageData(pageNumber) {
	if (pageNumber < 1 || pageNumber > 604) {
		throw "Invalid page number. Page number must be between 1 and 604";
	}
	return pageData[pageNumber - 1];
}

function getSurahCountByPage(pageNumber) {
	if (pageNumber < 1 || pageNumber > 604) {
		throw "Invalid page number. Page number must be between 1 and 604";
	}
	return pageData[pageNumber - 1].length;
}

function getVerseCountByPage(pageNumber) {
	if (pageNumber < 1 || pageNumber > 604) {
		throw "Invalid page number. Page number must be between 1 and 604";
	}
	let totalVerseCount = 0;
	for (let i = 0; i < pageData[pageNumber - 1].length; i++) {
		totalVerseCount += parseInt(pageData[pageNumber - 1][i]["end"]);
	}
	return totalVerseCount;
}

function getJuzNumber(surahNumber, verseNumber) {
	for (const juz of juzData) {
		if (juz["verses"].hasOwnProperty(surahNumber)) {
			if (verseNumber >= juz["verses"][surahNumber][0] &&
				verseNumber <= juz["verses"][surahNumber][1]) {
				return parseInt(juz["id"]);
			}
		}
	}
	return -1;
}

function getSurahAndVersesFromJuz(juzNumber) {
	if (juzNumber > 30 || juzNumber <= 0) {
		throw "No Juz found with given juzNumber";
	}
	console.log(juzData[29]["verses"]);
	return juzData[juzNumber - 1]["verses"];
}

function getSurahName(surahNumber) {
	if (surahNumber > 114 || surahNumber <= 0) {
		throw "No Surah found with given surahNumber";
	}
	return surahData[surahNumber - 1]['name'];
}


function getSurahNameEnglish(surahNumber) {
	if (surahNumber > 114 || surahNumber <= 0) {
		throw "No Surah found with given surahNumber";
	}
	return surahData[surahNumber - 1]['english'];
}

function getSurahNameArabic(surahNumber) {
	if (surahNumber > 114 || surahNumber <= 0) {
		throw "No Surah found with given surahNumber";
	}
	return surahData[surahNumber - 1]['arabic'];
}

function getPageNumber(surahNumber, verseNumber) {
	if (surahNumber > 114 || surahNumber <= 0) {
		throw "No Surah found with given surahNumber";
	}

	for (let pageIndex = 0; pageIndex < pageData.length; pageIndex++) {
		for (let surahIndexInPage = 0;
				 surahIndexInPage < pageData[pageIndex].length;
				 surahIndexInPage++) {
			const e = pageData[pageIndex][surahIndexInPage];
			if (e['surah'] === surahNumber &&
				e['start'] <= verseNumber &&
				e['end'] >= verseNumber) {
				return pageIndex + 1;
			}
		}
	}

	throw "Invalid verse number.";
}

function getPlaceOfRevelation(surahNumber) {
	if (surahNumber > 114 || surahNumber <= 0) {
		throw "No Surah found with given surahNumber";
	}
	return surahData[surahNumber - 1]['place'];
}


function getVerseCount(surahNumber) {
	if (surahNumber > 114 || surahNumber <= 0) {
		throw "No verse found with given surahNumber";
	}
	return parseInt(surahData[surahNumber - 1]['aya']);
}


function getVerse(surahNumber, verseNumber, { verseEndSymbol = false } = {}) {
	let verse = "";
	for (const i of quranText) {
		if (i['surah_number'] === surahNumber && i['verse_number'] === verseNumber) {
			verse = i['content'];
			break;
		}
	}

	if (verse === "") {
		throw "No verse found with given surahNumber and verseNumber.\n\n";
	}

	return verse + (verseEndSymbol ? getVerseEndSymbol(verseNumber) : "");
}

function getJuzURL(juzNumber) {
	return `https://quran.com/juz/${juzNumber}`;
}

function getSurahURL(surahNumber) {
	return `https://quran.com/${surahNumber}`;
}

function getVerseURL(surahNumber, verseNumber) {
	return `https://quran.com/${surahNumber}/${verseNumber}`;
}

function getVerseEndSymbol(verseNumber, { arabicNumeral = true } = {}) {
	if (!arabicNumeral) return `\u06dd${verseNumber}`;

	const arabicNumbers = {
		"0": "٠",
		"1": "١",
		"2": "٢",
		"3": "٣",
		"4": "٤",
		"5": "٥",
		"6": "٦",
		"7": "٧",
		"8": "٨",
		"9": "٩"
	};

	return `\u06dd${verseNumber.toString().split("").map(digit => arabicNumbers[digit]).join("")}`;
}

function getSurahPages(surahNumber) {
	if (surahNumber > 114 || surahNumber <= 0) {
		throw "Invalid surahNumber";
	}

	const pagesCount = totalPagesCount;
	const pages = [];
	for (let currentPage = 1; currentPage <= pagesCount; currentPage++) {
		const pageData = getPageData(currentPage);
		for (const data of pageData) {
			const currentSurahNum = data['surah'];
			if (currentSurahNum === surahNumber) {
				pages.push(currentPage);
				break;
			}
		}
	}
	return pages;
}


const SurahSeperator = {
	none: 'none',
	surahName: 'surahName',
	surahNameArabic: 'surahNameArabic',
	surahNameEnglish: 'surahNameEnglish'
};

function getVersesTextByPage(
	pageNumber,
	{ verseEndSymbol = false, surahSeperator = SurahSeperator.none, customSurahSeperator = "" } = {}
) {
	if (pageNumber < 1 || pageNumber > totalPagesCount) {
		throw "Invalid page number. Page number must be between 1 and 604";
	}

	const pageData = getPageData(pageNumber);
	let versesText = "";

	pageData.forEach(page => {
		const surahNumber = page['surah'];
		const startVerse = parseInt(page['start']);
		const endVerse = parseInt(page['end']);

		// Add surah separator if required
		if (surahSeperator !== SurahSeperator.none) {
			switch (surahSeperator) {
				case SurahSeperator.surahName:
					versesText += getSurahName(surahNumber) + "\n";
					break;
				case SurahSeperator.surahNameArabic:
					versesText += getSurahNameArabic(surahNumber) + "\n";
					break;
				case SurahSeperator.surahNameEnglish:
					versesText += getSurahNameEnglish(surahNumber) + "\n";
					break;
				default:
					if (customSurahSeperator) {
						versesText += customSurahSeperator + "\n";
					}
					break;
			}
		}

		// Add the verses
		for (let verseNumber = startVerse; verseNumber <= endVerse; verseNumber++) {
			versesText += getVerse(surahNumber, verseNumber, { verseEndSymbol }) + " ";
		}
	});

	return versesText.trim();
}

function getChapterAndItsVerses(surahNumber) {

	const chapter = surahData[surahNumber - 1];
	const verses = quranText.filter(verse => verse.surah_number === surahNumber);

	return { chapter, verses  };


}

function checkSajdah(verseNumber, surahNumber) {

	return 	sajdahVerses[surahNumber] === verseNumber;

}

function getVerseTranslation(surahNumber, verseNumber, lang) {
	// const verse = quranText.find(verse => verse.surah_number === surahNumber && verse.verse_number === verseNumber);
	// return verse.translation;

	if (surahNumber > 114 || surahNumber <= 0) {
		throw "No verse found with given surahNumber";
	}
	if (verseNumber > getVerseCount(surahNumber) || verseNumber <= 0) {
		throw "No verse found with given verseNumber";
	}

	// if (lang === 'en') {
	// 	return quranText.find(verse => verse.surah_number === surahNumber && verse.verse_number === verseNumber).translation;
	// }

	// console.log("enClearQuran", enClearQuran);

}


module.exports = {
	getPageData,
	getSurahCountByPage,
	getVerseCountByPage,
	getJuzNumber,
	getSurahAndVersesFromJuz,
	getSurahName,
	getSurahNameEnglish,
	getSurahNameArabic,
	getPageNumber,
	getPlaceOfRevelation,
	getVerseCount,
	getVerse,
	getJuzURL,
	getSurahURL,
	getVerseURL,
	getVerseEndSymbol,
	getSurahPages,
	getChapterAndItsVerses,
	getVersesTextByPage,
	checkSajdah,
	getVerseTranslation
}
