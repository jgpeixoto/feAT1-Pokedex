function capitalize(input) {
    if (input)
        return input.charAt(0).toUpperCase() + input.slice(1);
    else 
        return undefined;
}

class Pokemon {
    id;
    name;
    height;
    weight;
    base_hp;
    base_def;
    base_att;
    base_sdef;
    base_satt;
    base_speed;
    moveList;
    typeList;
    image;
    image_shiny;

    constructor(rawPokemon) {
        this.id = rawPokemon.id;
        this.name = capitalize(rawPokemon.name);
        this.height = rawPokemon.height/10;
        this.weight = rawPokemon.weight/10;
        this.base_hp = rawPokemon.stats[0].base_stat;
        this.base_att= rawPokemon.stats[1].base_stat;
        this.base_def= rawPokemon.stats[2].base_stat;
        this.base_satt= rawPokemon.stats[3].base_stat;
        this.base_sdef= rawPokemon.stats[4].base_stat;
        this.base_speed= rawPokemon.stats[5].base_stat;
        this.moveList = [];
        for (let i = 0; rawPokemon.moves[i]; i++) {
            this.moveList.push(capitalize(rawPokemon.moves[i].move.name));
        }
        this.typeList = [];
        for (let i = 0; rawPokemon.types[i]; i++) {
            this.typeList.push(capitalize(rawPokemon.types[i].type.name));
        }
        this.image = rawPokemon.sprites.other['official-artwork'].front_default ?? rawPokemon.sprites.front_default;
        this.image_shiny = rawPokemon.sprites.other['official-artwork'].front_shiny ?? rawPokemon.sprites.front_shiny;
    }
}

function createCard(pokemon)
{
    const container = document.getElementById('pokemon-card-container');
    const card = document.createElement('div');
    card.pokemon = pokemon;
    card.classList.add('pokemon-card');
    
    const image = document.createElement('img');
    image.src = pokemon.image;
    image.id = 'sprite' + pokemon.id;

    const shinySwitch = document.createElement('input');
    shinySwitch.type = 'checkbox';
    shinySwitch.pokemonId = pokemon.id;
    shinySwitch.id = 'shinySwitch' + pokemon.id;
    shinySwitch.name = 'shinySwitch' + pokemon.id;
    shinySwitch.value = 'Shiny';
    shinySwitch.addEventListener('change', function() {
        const pokemon = this.parentElement.parentElement.pokemon;
        const image = document.getElementById('sprite' + pokemon.id);
        if (this.checked) {
            image.src = pokemon.image_shiny;
        } else {
            image.src = pokemon.image;
        }
    });
    
    const flexbox = document.createElement('div');
    flexbox.style.display = 'flex';
    flexbox.style.justifyContent = 'center';
    flexbox.style.verticalAlign = 'center';

    const shinySwitchLabel = document.createElement('label');
    shinySwitchLabel.for = 'shinySwitch' + pokemon.id;
    shinySwitchLabel.textContent = 'Shiny';

    const favButton = document.createElement('div');
    favButton.pokemonId = pokemon.id;
    favButton.checked = false;
    const fav = JSON.parse(localStorage.getItem('favorites'));
    try {
        if (fav[favButton.pokemonId]) {
            favButton.checked = true;
            favButton.style.backgroundImage = "url('./public/fav-button-filled.png')";
        }
    }
    catch {}
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
            favorites[this.pokemonId] = false;
            localStorage.setItem('favorites', JSON.stringify(favorites));
            this.checked = false;
            this.style.backgroundImage = "url('./public/fav-button.png')";
        }
    });
    favButton.classList.add('fav-button');

    const text = document.createElement('h3');
    text.textContent = pokemon.id + " - " + pokemon.name;
    
    card.appendChild(image);
    card.appendChild(text);
    flexbox.appendChild(shinySwitch);
    flexbox.appendChild(shinySwitchLabel);
    flexbox.appendChild(favButton);
    card.appendChild(flexbox);

    container.appendChild(card);
}

function clearPokemon() {
    const container = document.getElementById('pokemon-card-container');
    for (let i = container.children.length-1; i >= 0; i--)
        container.children.item(i).remove();
}

function clearNotFound() {
    const error = document.getElementsByClassName('errorMessage');
    if (error) {
        for (let i = 0; i < error.length; i++)
        {
            error[i].remove();
        }
    }
}

async function getPokemon(idOrName, callbackOnFail=(() => {})) {
    try {
        const cachedPoke = localStorage.getItem(idOrName);
        if (!cachedPoke) {
            let json = await (await fetch('https://pokeapi.co/api/v2/pokemon/'+idOrName)).json();
            const pokemon = new Pokemon(json);
            localStorage.setItem(pokemon.id, JSON.stringify(pokemon));
            localStorage.setItem(json.name, JSON.stringify(pokemon));
            createCard(pokemon);
        }
        else {
            const pokemon = JSON.parse(cachedPoke);
            createCard(pokemon);
        }
    }
    catch (e) {
        callbackOnFail();
    }
}

function generateCards() {
    const curPage = getCurPage();
    for (let i = 1 + 12*(curPage-1); i <= (12*curPage); i++)
        getPokemon(i);
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