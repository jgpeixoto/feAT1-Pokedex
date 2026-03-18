const searchBar = document.querySelector('#pokemon-search-bar input');
searchBar.addEventListener('input', function() {
    clearNotFound();
    clearPokemon();
    if (!this.value)
    {
        generateCards();
    }
    else if (!isNaN(this.value) && Number(this.value) <= 1025)
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
const fav = localStorage.getItem('favorites');
    console.log(fav);