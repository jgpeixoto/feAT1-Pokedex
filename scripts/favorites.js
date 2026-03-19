function generateCardsFavs() {
    const favList = Object.keys(JSON.parse(localStorage.getItem('favorites')));
    for (let i = 0; i < favList.length; i++)
        getPokemon(favList[i]);
}

generateCardsFavs();