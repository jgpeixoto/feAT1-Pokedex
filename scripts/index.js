function generateCards() {
    const curPage = getCurPage();
    for (let i = 1 + PARAMS.PAGE_SIZE*(curPage-1); i <= (PARAMS.PAGE_SIZE*curPage); i++)
    {
        if (i <= PARAMS.LAST_POKE)
            getPokemon(i);
        else
            getPokemon(i+(PARAMS.FIRST_VARIANT-PARAMS.LAST_POKE-1));
    }    
}

function getCurPage() {
    return Number(document.getElementById('page-count').textContent);
}

function updatePage(page) {
    const prev = document.getElementById('prev-page');
    const next = document.getElementById('next-page');
    if (page > 1) 
        prev.style.display = "block";
    else 
        prev.style.display = "none";
    if (page < PARAMS.PAGE_COUNT()) 
        next.style.display = "block";
    else 
        next.style.display = "none";
    document.getElementById('pokemon-search-textbar').value = '';
    document.getElementById('page-count').textContent = page;
    clearPokemon();
    generateCards();
}

function prevPage() {
    const curPage = getCurPage();
    if (curPage > 1)
        updatePage(curPage-1);
}

function nextPage() {
    const curPage = getCurPage();
    updatePage(curPage+1);
}


const searchBar = document.getElementById('pokemon-search-textbar');
searchBar.addEventListener('input', function() {
    clearNotFound();
    clearPokemon();
    if (!this.value)
    {
        generateCards();
    }
    else if (!isNaN(this.value) && isValidId(this.value))
    {
        getPokemon(Number(this.value));
    }
    else {
        getPokemon(this.value.toLowerCase(), function() {
            const error = document.getElementById('errorMessage');
            const container = document.getElementById('pokemon-card-container');
            if (!error && container.children.length === 0) {
                const text = document.createElement('h2');
                text.style = 'text-align: center';
                text.textContent = 'No pokemon found with that name or ID.';
                text.className = 'errorMessage';
                text.id = 'errorMessage';
                document.body.insertBefore(text, container);
            }
        });
    }
});

let page = new URLSearchParams(document.location.search).get('page') ?? 1;
if (page < 1) page = 1;
else if (page > PARAMS.PAGE_COUNT()) page = PARAMS.PAGE_COUNT();
updatePage(page);
document.getElementById('first-load').remove();