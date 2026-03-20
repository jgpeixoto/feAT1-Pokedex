
function insertInformation(pokemon) {
    const container = document.getElementById('pokemon-details-container');
    container.pokemon = pokemon;

    document.getElementById('pokemon-name').textContent = pokemon.name;
    document.getElementById('pokemon-id').textContent = pokemon.id;
    document.getElementById('pokemon-sprite').src = pokemon.image;
    document.getElementById('pokemon-weight').textContent = pokemon.weight + ' kg';
    document.getElementById('pokemon-height').textContent = pokemon.height + ' meter(s)';
    document.getElementById('pokemon-types').textContent = pokemon.typeList;
    const moves = pokemon.moveList.split(', ');
    const parsedMoves = [];
    if (moves.length > 40) {
        for (let i = 0; i < 40; i++)
            parsedMoves.push(moves[i]);
        parsedMoves.push('and ' + (moves.length - 40) + ' others...');
        document.getElementById('pokemon-moves').textContent = parsedMoves.join(', ');
    }
    else
        document.getElementById('pokemon-moves').textContent = pokemon.moveList;
    document.getElementById('pokemon-hp').textContent = pokemon.base_hp;
    document.getElementById('pokemon-att').textContent = pokemon.base_att;
    document.getElementById('pokemon-def').textContent = pokemon.base_def;
    document.getElementById('pokemon-sp-att').textContent = pokemon.base_satt;
    document.getElementById('pokemon-sp-def').textContent = pokemon.base_sdef;
    document.getElementById('pokemon-speed').textContent = pokemon.base_speed;
    document.getElementById('shinySwitch').addEventListener('change', function() {
        const pokemon = document.getElementById('pokemon-details-container').pokemon;
        const image = document.getElementById('pokemon-sprite');
        if (this.checked) {
            image.src = pokemon.image_shiny;
        } else {
            image.src = pokemon.image;
        }
    });

    const favButton = document.getElementById('favorite-button');
    favButton.pokemonId = pokemon.id;
    favButton.checked = false;
    const fav = JSON.parse(localStorage.getItem('favorites'));
    if (fav[favButton.pokemonId]) {
        favButton.checked = true;
        favButton.style.backgroundImage = "url('./public/fav-button-filled.png')";
    }       
    favButton.addEventListener('click', function() {
        if (!this.checked)
        {
            const favorites = JSON.parse(localStorage.getItem('favorites'));
            favorites[this.pokemonId] = true;
            localStorage.setItem('favorites', JSON.stringify(favorites));
            this.checked = true;
            this.style.backgroundImage = "url('./public/fav-button-filled.png')";
        }
        else {
            const favorites = JSON.parse(localStorage.getItem('favorites'));
            favorites[this.pokemonId] = undefined;
            localStorage.setItem('favorites', JSON.stringify(favorites));
            this.checked = false;
            this.style.backgroundImage = "url('./public/fav-button.png')";
        }
    });
}

async function getPokemonDetails(id) {
    let num = Number(id);
    const cachedPoke = localStorage.getItem(id);
    if (!cachedPoke) {
        let json = await (await fetch('https://pokeapi.co/api/v2/pokemon/'+id)).json();
        const pokemon = new Pokemon(json);
        localStorage.setItem(pokemon.id, JSON.stringify(pokemon));
        localStorage.setItem(json.name, JSON.stringify(pokemon));
        insertInformation(pokemon);
    }
    else {
        const pokemon = JSON.parse(cachedPoke);
        insertInformation(pokemon);
    }
}

getPokemonDetails(Number(new URLSearchParams(document.location.search).get('id')));