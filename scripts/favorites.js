function generateCardsFavs() {
    const fav = localStorage.getItem('favorites');
    console.log(fav);
    const favs = JSON.parse(fav);
    const favList = Object.keys(favs);
    console.log(favList.length);
    for (let i = 0; i < favList.length; i++)
        getPokemon(favList[i]);
}

generateCardsFavs();