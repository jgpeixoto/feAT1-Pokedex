function generateCardsFavs() {
    const favList = Object.keys(JSON.parse(localStorage.getItem('favorites')));
    if (favList.length === 0) {
        const noFavs = document.createElement('h2');
        noFavs.textContent = 'You do not have any pokemons favorited.';
        noFavs.style.textAlign = 'center';
        const cont = document.getElementById('pokemon-card-container');
        document.body.insertBefore(noFavs, cont);
    } else 
        for (let i = 0; i < favList.length; i++)
            getPokemon(favList[i]);
    document.getElementById('first-load').remove();
}

generateCardsFavs();