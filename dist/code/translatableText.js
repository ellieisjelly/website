// To add other languages, make sure that the json file matches
// the name of the English one, add 2 to this variable and add
// a fetch for both the global json and the generic one in fetchTranslations
const languageCount = 4;
// -------------------
let loadedLanguages = 0;
const elements = [];
let lang = localStorage.getItem("lang") || "en";
const translations = {};
// Always call this function to fetch translations
// I was going to make it hard-coded but decided that
// It's best if you can decide what files to use
// per page, so you won't have to cram everything
// into the same json file.
function fetchTranslations(fileName) {
  fetch("translations/en/" + fileName).then(function (val) {
    val.json().then(function (json) {
      translations["en"] = { ...translations["en"], ...json };
      loadedLanguages++;
    });
  });
  fetch("translations/pt/" + fileName).then(function (val) {
    val.json().then(function (json) {
      translations["pt"] = { ...translations["pt"], ...json };
      loadedLanguages++;
    });
  });
  fetch("translations/pt/global.json").then(function (val) {
    val.json().then(function (json) {
      translations["pt"] = { ...translations["pt"], ...json };
      loadedLanguages++;
    });
  });
  fetch("translations/en/global.json").then(function (val) {
    val.json().then(function (json) {
      translations["en"] = { ...translations["en"], ...json };
      loadedLanguages++;
    });
  });
}
// Gotta do this since it takes time to fetch the json files.
// Can't just await everything since this isn't a module
// and that would just error
function waitFor(conditionFunction) {
  const poll = (resolve) => {
    if (conditionFunction()) resolve();
    else setTimeout((_) => poll(resolve), 400);
  };

  return new Promise(poll);
}
async function update(transText) {
  let string;
  if (loadedLanguages != languageCount) {
    console.log(
      "Waiting for lang files to load \n This may cause text to not appear temporarily."
    );
    await waitFor(() => loadedLanguages == languageCount);
    update(transText);
    return;
  }
  string = translations[lang][transText.id];
  transText.innerText = string;
}
// Call this function to change the current language.
function changeLang(Lang) {
  lang = Lang;
  localStorage.setItem("lang", lang);
  elements.forEach(function (element) {
    update(element);
  });
}
class transText extends HTMLElement {
  constructor() {
    super();
  }
  async connectedCallback() {
    elements.push(this);
    this.innerText = "Waiting for translations to load.";
    update(this);
  }
}
customElements.define("trans-text", transText);
