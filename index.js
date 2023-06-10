
const searchQueryElement = document.getElementById('search-query');
const containerElement = document.getElementById('container');

/*** theme functionality start ***/

// get current theme from localStorage and use the current theme
const htmlElement = document.getElementsByTagName('html')[0];
const toggleThemeCheckbox = document.querySelector('.toggle-theme');
const defaultTheme = window.matchMedia("(prefers-color-scheme:dark)").matches ? 'dark' : 'light';
const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : defaultTheme;

if (currentTheme) {
    htmlElement.dataset.theme = currentTheme;
}

// whenever theme is changed, update value in localstorage also
const toggleTheme = (theme) => {
    htmlElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
}

toggleThemeCheckbox.addEventListener('change', (event) => {
    const { checked } = event.target;
    const theme = checked ? 'dark' : 'light';
    toggleTheme(theme)
});

/*** theme functionality end ***/

const wordsArray = ["apple", "banana", "cherry", "mango", "orange", "strawberry", "watermelon", 'Avocado'];

function createElement(tag, text) {
    const tagElement = document.createElement(tag);
    tagElement.textContent = text;
    return tagElement;
}

function getSuggestionList(listData, searchQuery) {
    const updateValue = listData.filter(value => value.toLowerCase().startsWith(searchQuery.toLowerCase()));
    return updateValue;
}

function getHighlightWord(text, highlightText) {
    const highlightLength = highlightText.length;
    const currentHighlightText = createElement('b', text.slice(0, highlightLength));
    const remainingWord = text.slice(highlightLength, -1);
    const spanElement = document.createElement('span');
    spanElement.appendChild(currentHighlightText);
    spanElement.appendChild(document.createTextNode(remainingWord));
    return spanElement;
}

searchQueryElement.addEventListener("keyup", (event) => {
    const { value } = event.target;

    const ulElement = document.createElement('ul');

    const getSuggestionItems = getSuggestionList(wordsArray, value.toLowerCase());

    console.log('getSuggestionItems', getSuggestionItems)

    const liItems = getSuggestionItems.map(word => {
        console.log('getHighlightWord addEventListener', getHighlightWord(word, value))
        const liElement = document.createElement('li');
        liElement.appendChild(getHighlightWord(word, value))
        console.log(liElement)
        ulElement.appendChild(liElement);
        return liElement;
    });

    console.log('liItems', ulElement);

    // containerElement.appendChild(ul)
    // console.log('addEventListener', ul, liItems);
});