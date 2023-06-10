const searchQueryElement = document.getElementById('search-query');
const suggestionContainer = document.querySelector('.suggestion-container');
const searchContainer = document.querySelector('.search-container');
const searchInputElement = document.querySelector('.search-input');
const formContainer = document.querySelector('.form');
const clearIconElement = document.querySelector('.clear-icon');
const feelLuckyBtn = document.querySelector('.feel-lucky');


const GOOGLE_IMAGE_FOR_DARK_THEME = './images/google-dark.png';
const GOOGLE_IMAGE_FOR_LIGHT_THEME = './images/google-light.png';

// Google Images updates when theme is changed
function updateGoogleImageByTheme(currentTheme) {
    const googleImageElement = document.querySelector('.google-img');
    if (currentTheme === 'dark') {
        googleImageElement.setAttribute('src', GOOGLE_IMAGE_FOR_DARK_THEME)
    } else {
        googleImageElement.setAttribute('src', GOOGLE_IMAGE_FOR_LIGHT_THEME)
    }
}

/*** theme functionality start ***/

// get current theme from localStorage and use the current theme
const htmlElement = document.getElementsByTagName('html')[0];
const darkModeToggle = document.querySelector('.darkmode-toggle');
const defaultTheme = window.matchMedia("(prefers-color-scheme:dark)").matches ? 'dark' : 'light';
const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : defaultTheme;

if (currentTheme) {
    htmlElement.dataset.theme = currentTheme;
    updateGoogleImageByTheme(currentTheme);
    localStorage.setItem('theme', currentTheme);
    darkModeToggle.checked = currentTheme === 'dark'
}

// whenever theme is changed, update value in localstorage also
const toggleTheme = (theme) => {
    htmlElement.dataset.theme = theme;
    updateGoogleImageByTheme(theme);
    localStorage.setItem('theme', theme);
}

darkModeToggle.addEventListener('change', (event) => {
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
    const remainingWord = text.slice(highlightLength, text.length);
    const spanElement = document.createElement('span');
    spanElement.appendChild(currentHighlightText);
    spanElement.appendChild(document.createTextNode(remainingWord));
    return spanElement;
}

const searchIcon = `<div class="search-icon">
                  <span style="height: 20px; line-height: 20px; width: 20px">
                    <svg
                      focusable="false"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                      ></path>
                    </svg>
                  </span>
                </div>`;

function addDividerElement(parentElement) {
    const dividerElement = document.createElement('div');
    dividerElement.classList.add('divider');
    parentElement.appendChild(dividerElement);
}

addDividerElement(suggestionContainer);


function clearSuggestionContainer() {
    const suggestionList = document.querySelector('.suggestion-list');
    if (suggestionList) {
        suggestionList.remove();
    }
}

const toggleActiveClassnameInput = (element, classname) => {
    element.classList.toggle(classname);
}

searchInputElement.addEventListener('focus', function (event) {
    searchContainer.classList.add('activeInput');
    addSuggestionList(event)
})

// when click on outside of form clear suggestion list and input style update 
window.onclick = function (event) {
    if (event.target.closest(".form") === null) {
        clearSuggestionContainer();
        suggestionContainer.style.display = "none";
        searchContainer.classList.remove('hide-input-border-bottom');
        searchContainer.classList.remove('activeInput');
    }
}

const addSuggestionList = (event) => {

    const value = event.target?.value || ""

    clearSuggestionContainer();

    if (value) {
        clearIconElement.style.visibility = 'visible';
    } else {
        clearIconElement.style.visibility = 'hidden';
    }

    const ulElement = document.createElement('ul');
    ulElement.classList.add('suggestion-list');

    const getSuggestionItems = getSuggestionList(wordsArray, value.toLowerCase());
    if (getSuggestionItems.length) {
        suggestionContainer.style.display = "flex";
        searchContainer.classList.add('hide-input-border-bottom');
    } else {
        suggestionContainer.style.display = "none";
        searchContainer.classList.remove('hide-input-border-bottom');
    }

    getSuggestionItems.forEach(word => {
        const liElement = document.createElement('li');
        liElement.classList.add('suggestion-item');
        liElement.insertAdjacentHTML('afterbegin', searchIcon);
        liElement.appendChild(getHighlightWord(word.toLowerCase(), value))
        ulElement.appendChild(liElement);
    });

    suggestionContainer.appendChild(ulElement);
}

searchQueryElement.addEventListener("keyup", addSuggestionList);

clearIconElement.addEventListener('click', function (event) {
    searchInputElement.value = ""
    clearIconElement.style.visibility = 'hidden';
    addSuggestionList(event)
})

const searchValue = (value) => {
    if (!value) {
        return true;
    }
    window.open(`https://www.google.com/search?q=${value}`, '_blank');
}

formContainer.addEventListener('submit', (event) => {
    event.preventDefault()
    const searchQuery = searchInputElement.value;
    if (!searchQuery) {
        return true;
    }
    searchValue(searchQuery)
})


const openDoodleLucky = () => window.open('https://www.google.com/doodles', '_blank');

feelLuckyBtn.addEventListener('click', openDoodleLucky)

// handle click on suggestion items
suggestionContainer.addEventListener('click', function (event) {

    // click on suggestion item
    const searchText = event.target.textContent.trim();
    if (event.target.closest(".search-cta-btn") === null) {
        searchInputElement.value = searchText;
        setTimeout(() => {
            searchValue(searchText)
        }, 100);
    }

    // user click on google search button
    if (event.target.matches('.google-search') && searchInputElement.value) {
        searchValue(searchInputElement.value)
    }

    // click on feel lucky button
    if (event.target.matches('.feel-lucky')) {
        openDoodleLucky()
    }
})

// clonse search cta button to append on suggestion list container
const cloneSearchCTAButton = () => {
    const searchCTABtn = document.querySelector('.search-cta-btn');
    return searchCTABtn.cloneNode(true);
}

suggestionContainer.appendChild(cloneSearchCTAButton())