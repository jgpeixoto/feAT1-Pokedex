function generateCards() {
    const curPage = getCurPage();
    for (let i = 1 + 12*(curPage-1); i <= (12*curPage); i++)
    {
        if (i <= 1025)
            getPokemon(i);
        else
            getPokemon(i+8976);
    }
}

function getCurPage() {
    return Number(document.getElementById('page-count').textContent);
}

function updatePage(page) {
    const prev = document.getElementById('prev-page');
    if (page > 1) prev.style.display = "block";
    else prev.style.display = "none";
    document.querySelector('#pokemon-search-bar input').value = '';
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


const searchBar = document.querySelector('#pokemon-search-bar input');
searchBar.addEventListener('input', function() {
    clearNotFound();
    clearPokemon();
    if (!this.value)
    {
        generateCards();
    }
    else if (!isNaN(this.value) && (Number(this.value) <= 1025 || (Number(this.value) >= 10001 && Number(this.value) <= 10325)))
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

generateCards();