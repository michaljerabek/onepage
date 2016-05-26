(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        module.exports = factory();

    } else {

        root.Languages = factory();
    }

}(this, function () {

    var languages = [{
        "code": "ab",
        "name": "Abcházština",
        "nativeName": "Аҧсуа"
    }, {
        "code": "aa",
        "name": "Afarština",
        "nativeName": "Afaraf"
    }, {
        "code": "af",
        "name": "Afrikánština",
        "nativeName": "Afrikaans"
    }, {
        "code": "ay",
        "name": "Ajmarština",
        "nativeName": "aymar aru"
    }, {
        "code": "ak",
        "name": "Akanština",
        "nativeName": "Akan"
    }, {
        "code": "sq",
        "name": "Albánština",
        "nativeName": "Shqip"
    }, {
        "code": "am",
        "name": "Amharština",
        "nativeName": "አማርኛ"
    }, {
        "code": "en",
        "name": "Angličtina",
        "nativeName": "English"
    }, {
        "code": "ar",
        "name": "Arabština",
        "nativeName": "‫العربية‬"
    }, {
        "code": "an",
        "name": "Aragonština",
        "nativeName": "Aragonés"
    }, {
        "code": "hy",
        "name": "Arménština",
        "nativeName": "Հայերեն"
    }, {
        "code": "as",
        "name": "Ásámština",
        "nativeName": "অসমীয়া"
    }, {
        "code": "av",
        "name": "Avarština",
        "nativeName": "авар мацӀ; магӀарул мацӀ"
    }, {
        "code": "ae",
        "name": "Avestánština",
        "nativeName": "avesta"
    }, {
        "code": "az",
        "name": "Ázerbájdžánština",
        "nativeName": "azərbaycan dili"
    }, {
        "code": "bm",
        "name": "Bambarština",
        "nativeName": "bamanankan"
    }, {
        "code": "my",
        "name": "Barmština",
        "nativeName": "မ္ရန္‌မာစကား (Myanma zaga)"
    }, {
        "code": "eu",
        "name": "Baskičtina",
        "nativeName": "euskara"
    }, {
        "code": "ba",
        "name": "Baškirština",
        "nativeName": "башҡорт теле"
    }, {
        "code": "be",
        "name": "Běloruština",
        "nativeName": "Беларуская"
    }, {
        "code": "bn",
        "name": "Bengálština",
        "nativeName": "বাংলা"
    }, {
        "code": "bh",
        "name": "Bihárština",
        "nativeName": "भोजपुरी"
    }, {
        "code": "bi",
        "name": "Bislamština",
        "nativeName": "Bislama"
    }, {
        "code": "nb",
        "name": "Bokmål",
        "nativeName": "Norsk (bokmål)"
    }, {
        "code": "bs",
        "name": "Bosenština",
        "nativeName": "bosanski jezik"
    }, {
        "code": "br",
        "name": "Bretonština",
        "nativeName": "brezhoneg"
    }, {
        "code": "bg",
        "name": "Bulharština",
        "nativeName": "български език"
    }, {
        "code": "ch",
        "name": "Chamorro",
        "nativeName": "Chamoru"
    }, {
        "code": "hr",
        "name": "Chorvatština",
        "nativeName": "Hrvatski"
    }, {
        "code": "ce",
        "name": "Čečenština",
        "nativeName": "нохчийн мотт"
    }, {
        "code": "cs",
        "name": "Čeština",
        "nativeName": "čeština"
    }, {
        "code": "ny",
        "name": "Čičevština",
        "nativeName": "chiCheŵa; chinyanja"
    }, {
        "code": "zh",
        "name": "Čínština",
        "nativeName": "中文、汉语、漢語"
    }, {
        "code": "za",
        "name": "Čuangština",
        "nativeName": "Saɯ cueŋƅ; Saw cuengh"
    }, {
        "code": "cv",
        "name": "Čuvaština",
        "nativeName": "чӑваш чӗлхи"
    }, {
        "code": "tn",
        "name": "Čwanština",
        "nativeName": "seTswana"
    }, {
        "code": "da",
        "name": "Dánština",
        "nativeName": "dansk"
    }, {
        "code": "dv",
        "name": "Divehi",
        "nativeName": "‫ދިވެހި‬"
    }, {
        "code": "dz",
        "name": "Dzongkha",
        "nativeName": "རྫོང་ཁ"
    }, {
        "code": "eo",
        "name": "Esperanto",
        "nativeName": "Esperanto"
    }, {
        "code": "et",
        "name": "Estonština",
        "nativeName": "Eesti keel"
    }, {
        "code": "ee",
        "name": "Eveština",
        "nativeName": "Ɛʋɛgbɛ"
    }, {
        "code": "fo",
        "name": "Faerština",
        "nativeName": "Føroyskt"
    }, {
        "code": "fj",
        "name": "Fidžijština",
        "nativeName": "vosa Vakaviti"
    }, {
        "code": "fi",
        "name": "Finština",
        "nativeName": "Suomen kieli"
    }, {
        "code": "fr",
        "name": "Francouzština",
        "nativeName": "français; langue française"
    }, {
        "code": "ff",
        "name": "Fulbština",
        "nativeName": "Fulfulde"
    }, {
        "code": "gl",
        "name": "Galicijština",
        "nativeName": "Galego"
    }, {
        "code": "lg",
        "name": "Gandština",
        "nativeName": "Luganda"
    }, {
        "code": "kl",
        "name": "Grónština",
        "nativeName": "kalaallisut; kalaallit oqaasii"
    }, {
        "code": "ka",
        "name": "Gruzínština",
        "nativeName": "ქართული"
    }, {
        "code": "gn",
        "name": "Guaraní",
        "nativeName": "Avañe'ẽ"
    }, {
        "code": "gu",
        "name": "Gudžarátština",
        "nativeName": "ગુજરાતી"
    }, {
        "code": "ht",
        "name": "Haitština",
        "nativeName": "Kreyòl ayisyen"
    }, {
        "code": "ha",
        "name": "Hauština",
        "nativeName": "‫هَوُسَ‬"
    }, {
        "code": "he",
        "name": "Hebrejština",
        "nativeName": "‫עברית‬"
    }, {
        "code": "hz",
        "name": "Hererština",
        "nativeName": "Otjiherero"
    }, {
        "code": "hi",
        "name": "Hindština",
        "nativeName": "हिन्दी"
    }, {
        "code": "ho",
        "name": "Hiri motu",
        "nativeName": "Hiri Motu"
    }, {
        "code": "io",
        "name": "Ido",
        "nativeName": "Ido"
    }, {
        "code": "ig",
        "name": "Igbo",
        "nativeName": "Igbo"
    }, {
        "code": "id",
        "name": "Indonéština",
        "nativeName": "Bahasa Indonesia"
    }, {
        "code": "ia",
        "name": "Interlingua",
        "nativeName": "Interlingua"
    }, {
        "code": "ie",
        "name": "Interlingue",
        "nativeName": "Interlingue"
    }, {
        "code": "iu",
        "name": "Inuitština",
        "nativeName": "ᐃᓄᒃᑎᑐᑦ"
    }, {
        "code": "ik",
        "name": "Inupiaq",
        "nativeName": "Iñupiaq; Iñupiatun"
    }, {
        "code": "ga",
        "name": "Irština",
        "nativeName": "Gaeilge"
    }, {
        "code": "is",
        "name": "Islandština",
        "nativeName": "Íslenska"
    }, {
        "code": "it",
        "name": "Italština",
        "nativeName": "Italiano"
    }, {
        "code": "ja",
        "name": "Japonština",
        "nativeName": "日本語 (にほんご)"
    }, {
        "code": "jv",
        "name": "Javánština",
        "nativeName": "basa Jawa"
    }, {
        "code": "yi",
        "name": "Jidiš",
        "nativeName": "‫ייִדיש‬"
    }, {
        "code": "nr",
        "name": "Jižní ndebelština",
        "nativeName": "Ndébélé"
    }, {
        "code": "yo",
        "name": "Jorubština",
        "nativeName": "Yorùbá"
    }, {
        "code": "kn",
        "name": "Kannadština",
        "nativeName": "ಕನ್ನಡ"
    }, {
        "code": "kr",
        "name": "Kanurijština",
        "nativeName": "Kanuri"
    }, {
        "code": "ks",
        "name": "Kašmírština",
        "nativeName": "कश्मीरी; ‫كشميري‬"
    }, {
        "code": "ca",
        "name": "Katalánština",
        "nativeName": "Català"
    }, {
        "code": "kk",
        "name": "Kazaština",
        "nativeName": "Қазақ тілі"
    }, {
        "code": "qu",
        "name": "Kečuánština",
        "nativeName": "Runa Simi; Kichwa"
    }, {
        "code": "km",
        "name": "Khmerština",
        "nativeName": "ភាសាខ្មែរ"
    }, {
        "code": "ki",
        "name": "Kikujština",
        "nativeName": "Gĩkũyũ"
    }, {
        "code": "rn",
        "name": "Kirundština",
        "nativeName": "kiRundi"
    }, {
        "code": "kv",
        "name": "Komijština",
        "nativeName": "коми кыв"
    }, {
        "code": "kg",
        "name": "Konžština",
        "nativeName": "KiKongo"
    }, {
        "code": "ko",
        "name": "Korejština",
        "nativeName": "한국어 (韓國語); 조선말 (朝鮮語)"
    }, {
        "code": "kw",
        "name": "Kornština",
        "nativeName": "Kernewek"
    }, {
        "code": "co",
        "name": "Korsičtina",
        "nativeName": "corsu; lingua corsa"
    }, {
        "code": "cr",
        "name": "Kríjština",
        "nativeName": "ᓀᐦᐃᔭᐍᐏᐣ"
    }, {
        "code": "kj",
        "name": "Kuanyama",
        "nativeName": "Kuanyama"
    }, {
        "code": "ku",
        "name": "Kurdština",
        "nativeName": "Kurdî; ‫كوردی‬"
    }, {
        "code": "ky",
        "name": "Kyrgyzština",
        "nativeName": "кыргыз тили"
    }, {
        "code": "lo",
        "name": "Laoština",
        "nativeName": "ພາສາລາວ"
    }, {
        "code": "la",
        "name": "Latina",
        "nativeName": "latine; lingua latina"
    }, {
        "code": "li",
        "name": "Limburština",
        "nativeName": "Limburgs"
    }, {
        "code": "lt",
        "name": "Litevština",
        "nativeName": "lietuvių kalba"
    }, {
        "code": "lv",
        "name": "Lotyština",
        "nativeName": "latviešu valoda"
    }, {
        "code": "lu",
        "name": "Lubština",
        "nativeName": "luba"
    }, {
        "code": "lb",
        "name": "Lucemburština",
        "nativeName": "Lëtzebuergesch"
    }, {
        "code": "ve",
        "name": "Luvendština",
        "nativeName": "tshiVenḓa"
    }, {
        "code": "hu",
        "name": "Maďarština",
        "nativeName": "Magyar"
    }, {
        "code": "mk",
        "name": "Makedonština",
        "nativeName": "македонски јазик"
    }, {
        "code": "ml",
        "name": "Malajámština",
        "nativeName": "മലയാളം"
    }, {
        "code": "ms",
        "name": "Malajština",
        "nativeName": "bahasa Melayu; ‫بهاس ملايو‬"
    }, {
        "code": "mg",
        "name": "Malgaština",
        "nativeName": "Malagasy fiteny"
    }, {
        "code": "mt",
        "name": "Maltština",
        "nativeName": "Malti"
    }, {
        "code": "gv",
        "name": "Manština",
        "nativeName": "Ghaelg"
    }, {
        "code": "mi",
        "name": "Maorština",
        "nativeName": "te reo Māori"
    }, {
        "code": "mr",
        "name": "Maráthština",
        "nativeName": "मराठी"
    }, {
        "code": "mh",
        "name": "Maršálština",
        "nativeName": "Kajin M̧ajeļ"
    }, {
        "code": "mo",
        "name": "Moldavština",
        "nativeName": "лимба молдовеняскэ"
    }, {
        "code": "mn",
        "name": "Mongolština",
        "nativeName": "Монгол"
    }, {
        "code": "na",
        "name": "Nauruština",
        "nativeName": "Ekakairũ Naoero"
    }, {
        "code": "nv",
        "name": "Navažština",
        "nativeName": "Diné bizaad; Dinékʼehǰí"
    }, {
        "code": "ng",
        "name": "Ndonga",
        "nativeName": "Owambo"
    }, {
        "code": "de",
        "name": "Němčina",
        "nativeName": "Deutsch"
    }, {
        "code": "ne",
        "name": "Nepálština",
        "nativeName": "नेपाली"
    }, {
        "code": "ln",
        "name": "Ngalština",
        "nativeName": "Lingála"
    }, {
        "code": "nl",
        "name": "Nizozemština",
        "nativeName": "Nederlands"
    }, {
        "code": "no",
        "name": "Norština",
        "nativeName": "Norsk"
    }, {
        "code": "nn",
        "name": "Nynorsk",
        "nativeName": "Nynorsk"
    }, {
        "code": "oj",
        "name": "Odžibvejština",
        "nativeName": "ᐊᓂᔑᓈᐯᒧᐎᓐ"
    }, {
        "code": "oc",
        "name": "Okcitánština",
        "nativeName": "Occitan"
    }, {
        "code": "om",
        "name": "Oromština",
        "nativeName": "Afaan Oromoo"
    }, {
        "code": "os",
        "name": "Osetština",
        "nativeName": "Ирон æвзаг"
    }, {
        "code": "pi",
        "name": "Páli",
        "nativeName": "पाऴि"
    }, {
        "code": "pa",
        "name": "Paňdžábština",
        "nativeName": "ਪੰਜਾਬੀ; ‫پنجابی‬"
    }, {
        "code": "ps",
        "name": "Paštština",
        "nativeName": "‫پښتو‬"
    }, {
        "code": "fa",
        "name": "Perština",
        "nativeName": "‫فارسی‬"
    }, {
        "code": "pl",
        "name": "Polština",
        "nativeName": "Polski"
    }, {
        "code": "pt",
        "name": "Portugalština",
        "nativeName": "Português"
    }, {
        "code": "rm",
        "name": "Rétorománština",
        "nativeName": "rumantsch grischun"
    }, {
        "code": "ro",
        "name": "Rumunština",
        "nativeName": "română"
    }, {
        "code": "ru",
        "name": "Ruština",
        "nativeName": "русский язык"
    }, {
        "code": "rw",
        "name": "Rwandština",
        "nativeName": "Kinyarwanda"
    }, {
        "code": "el",
        "name": "Řečtina",
        "nativeName": "Ελληνικά"
    }, {
        "code": "sm",
        "name": "Samojština",
        "nativeName": "gagana fa'a Samoa"
    }, {
        "code": "sg",
        "name": "Sangština",
        "nativeName": "yângâ tî sängö"
    }, {
        "code": "sa",
        "name": "Sanskrt",
        "nativeName": "संस्कृतम्"
    }, {
        "code": "sc",
        "name": "Sardština",
        "nativeName": "sardu"
    }, {
        "code": "nd",
        "name": "Severní ndebelština",
        "nativeName": "isiNdebele"
    }, {
        "code": "se",
        "name": "Severní sámština",
        "nativeName": "Davvisámegiella"
    }, {
        "code": "sd",
        "name": "Sindhština",
        "nativeName": "सिन्धी; ‫سنڌي، سندھی‬"
    }, {
        "code": "si",
        "name": "Sinhálština",
        "nativeName": "සිංහල"
    }, {
        "code": "gd",
        "name": "Skotská gaelština",
        "nativeName": "Gàidhlig"
    }, {
        "code": "sk",
        "name": "Slovenština",
        "nativeName": "slovenčina"
    }, {
        "code": "sl",
        "name": "Slovinština",
        "nativeName": "slovenščina"
    }, {
        "code": "so",
        "name": "Somálština",
        "nativeName": "Soomaaliga; af Soomaali"
    }, {
        "code": "st",
        "name": "Sotština",
        "nativeName": "seSotho"
    }, {
        "code": "sh",
        "name": "Srbochorvatština",
        "nativeName": "Српскохрватски"
    }, {
        "code": "sr",
        "name": "Srbština",
        "nativeName": "српски језик"
    }, {
        "code": "cu",
        "name": "Staroslověnština",
        "nativeName": "словѣньскъ ѩꙁꙑкъ"
    }, {
        "code": "su",
        "name": "Sundština",
        "nativeName": "Basa Sunda"
    }, {
        "code": "sw",
        "name": "Svahilština",
        "nativeName": "Kiswahili"
    }, {
        "code": "ss",
        "name": "Svazijština",
        "nativeName": "SiSwati"
    }, {
        "code": "sn",
        "name": "Šonština",
        "nativeName": "chiShona"
    }, {
        "code": "es",
        "name": "Španělština",
        "nativeName": "español; castellano"
    }, {
        "code": "sv",
        "name": "Švédština",
        "nativeName": "Svenska"
    }, {
        "code": "tg",
        "name": "Tádžičtina",
        "nativeName": "тоҷикӣ; toğikī; ‫تاجیکی‬"
    }, {
        "code": "tl",
        "name": "Tagalština",
        "nativeName": "Tagalog"
    }, {
        "code": "ty",
        "name": "Tahitština",
        "nativeName": "Reo Mā`ohi"
    }, {
        "code": "ta",
        "name": "Tamilština",
        "nativeName": "தமிழ்"
    }, {
        "code": "tt",
        "name": "Tatarština",
        "nativeName": "татарча; tatarça; ‫تاتارچا‬"
    }, {
        "code": "te",
        "name": "Telugština",
        "nativeName": "తెలుగు"
    }, {
        "code": "th",
        "name": "Thajština",
        "nativeName": "ไทย"
    }, {
        "code": "bo",
        "name": "Tibetština",
        "nativeName": "བོད་ཡིག"
    }, {
        "code": "ti",
        "name": "Tigriňňa",
        "nativeName": "ትግርኛ"
    }, {
        "code": "to",
        "name": "Tonžština",
        "nativeName": "faka Tonga"
    }, {
        "code": "ts",
        "name": "Tsonga",
        "nativeName": "xiTsonga"
    }, {
        "code": "tr",
        "name": "Turečtina",
        "nativeName": "Türkçe"
    }, {
        "code": "tk",
        "name": "Turkmenština",
        "nativeName": "Türkmen; Түркмен"
    }, {
        "code": "tw",
        "name": "Ťwiština",
        "nativeName": "Twi"
    }, {
        "code": "ug",
        "name": "Ujgurština",
        "nativeName": "Uyƣurqə; ‫ئۇيغۇرچ ‬"
    }, {
        "code": "uk",
        "name": "Ukrajinština",
        "nativeName": "українська мова"
    }, {
        "code": "ur",
        "name": "Urdština",
        "nativeName": "‫اردو‬"
    }, {
        "code": "or",
        "name": "Urijština",
        "nativeName": "ଓଡ଼ିଆ"
    }, {
        "code": "uz",
        "name": "Uzbečtina",
        "nativeName": "O'zbek; Ўзбек; ‫أۇزبېك‬"
    }, {
        "code": "wa",
        "name": "Valonština",
        "nativeName": "Walon"
    }, {
        "code": "cy",
        "name": "Velština",
        "nativeName": "Cymraeg"
    }, {
        "code": "vi",
        "name": "Vietnamština",
        "nativeName": "Tiếng Việt"
    }, {
        "code": "vo",
        "name": "Volapük",
        "nativeName": "Volapük"
    }, {
        "code": "wo",
        "name": "Volofština",
        "nativeName": "Wollof"
    }, {
        "code": "xh",
        "name": "Xhoština",
        "nativeName": "isiXhosa"
    }, {
        "code": "ii",
        "name": "Yi",
        "nativeName": "ꆇꉙ"
    }, {
        "code": "fy",
        "name": "Západofríština",
        "nativeName": "Frysk"
    }, {
        "code": "zu",
        "name": "Zulština",
        "nativeName": "isiZulu"
    }];
    return {

        find: function (code) {

            var l = languages.length - 1;

            for (l; l >= 0; l--) {

                if (languages[l].code === code) {

                    return languages[l];
                }
            }

            return null;
        },

        getAll: function () {

            return languages;
        },

        getName: function (code) {

            var lang = this.find(code);

            return lang ? lang.name : null;
        },

        getNativeName: function (code) {

            var lang = this.find(code);

            return lang ? lang.nativeName : null;
        },

        getCodes: function () {

            var codes = [],

                l = languages.length - 1;

            for (l; l >= 0; l--) {

                codes.unshift(languages[l].code);
            }

            return codes;
        }
    };

}));
