const PARAMS = {
    LAST_POKE: 1025,
    FIRST_VARIANT: 10001,
    LAST_VARIANT: 10325,
    POKE_COUNT: () => {
        return PARAMS.LAST_POKE+PARAMS.LAST_VARIANT-PARAMS.FIRST_VARIANT+1;
    },
    PAGE_SIZE: 12,
    PAGE_COUNT: () => {
        const count = PARAMS.POKE_COUNT();
        return Math.floor(count/PARAMS.PAGE_SIZE)+(count%PARAMS.PAGE_SIZE==0?0:1);
    },
}

function capitalize(input, split=false) {
    if (input) {
        if (split) {
            const splits = input.split('-');
            for (let i = 0; i < splits.length; i++)
            {
                splits[i] = capitalize(splits[i]);
            }
            return splits.join(' ');
        }
        return input.charAt(0).toUpperCase() + input.slice(1);
    }
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
        this.name = capitalize(rawPokemon.name, true);
        this.height = rawPokemon.height/10;
        this.weight = rawPokemon.weight/10;
        this.base_hp = rawPokemon.stats[0].base_stat;
        this.base_att= rawPokemon.stats[1].base_stat;
        this.base_def= rawPokemon.stats[2].base_stat;
        this.base_satt= rawPokemon.stats[3].base_stat;
        this.base_sdef= rawPokemon.stats[4].base_stat;
        this.base_speed= rawPokemon.stats[5].base_stat;
        this.moveList = "";
        for (let i = 0; rawPokemon.moves[i]; i++) {
            this.moveList += capitalize(rawPokemon.moves[i].move.name, true) + (rawPokemon.moves[i+1]?", ":"");
        }
        this.typeList = "";
        for (let i = 0; rawPokemon.types[i]; i++) {
            this.typeList += capitalize(rawPokemon.types[i].type.name) + (rawPokemon.types[i+1]?", ":"");
        }
        this.image = rawPokemon.sprites.other['official-artwork'].front_default ?? rawPokemon.sprites.front_default;
        if (this.image == null) this.image = './public/missing-entry.png';
        this.image_shiny = rawPokemon.sprites.other['official-artwork'].front_shiny ?? rawPokemon.sprites.front_shiny ?? './public/missing-entry.png';
        if (this.image_shiny == null) this.image_shiny = './public/missing-entry.png';
    }
}

function createCard(pokemon, cardId)
{
    const container = document.getElementById('pokemon-card-container');
    const card = document.getElementById(cardId);
    card.pokemon = pokemon;
    card.classList.remove('card-loading');
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

    
    const shinySwitchLabel = document.createElement('label');
    shinySwitchLabel.for = 'shinySwitch' + pokemon.id;
    shinySwitchLabel.classList.add('shiny-switch');
    shinySwitchLabel.textContent = 'Shiny';
    
    const flexbox = document.createElement('div');
    flexbox.style.display = 'flex';
    flexbox.style.justifyContent = 'center';
    flexbox.style.verticalAlign = 'center';

    const favButton = document.createElement('div');
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
    favButton.classList.add('fav-button');

    const link = document.createElement('a');
    link.href = './about.html?id=' + pokemon.id;
    link.classList.add('pokemon-card-name');
    const text = document.createElement('h3');
    text.textContent = pokemon.id + " - " + pokemon.name;
    
    card.appendChild(image);
    link.appendChild(text);
    card.appendChild(link);
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

function isValidId(num) {
    return num > 0 && (num <= PARAMS.LAST_POKE || num >= PARAMS.FIRST_VARIANT && num <= PARAMS.LAST_VARIANT);
}

async function getPokemon(idOrName, callbackOnFail=(() => {})) {
    const card = document.createElement('div');
    card.id = 'card-' + idOrName;
    card.pokemonId = idOrName;
    card.classList.add('card-loading');
    document.getElementById('pokemon-card-container').appendChild(card);
    try {
        let num = Number(idOrName);
        
        if (!isNaN(num) && !isValidId(num)) {
            card.remove();
            callbackOnFail();
            return;
        }
        const cachedPoke = localStorage.getItem(idOrName);
        let pokemon;
        if (!cachedPoke) {
            let json = await (await fetch('https://pokeapi.co/api/v2/pokemon/'+idOrName)).json();
            pokemon = new Pokemon(json);
            localStorage.setItem(pokemon.id, JSON.stringify(pokemon));
            localStorage.setItem(json.name, JSON.stringify(pokemon));
        }
        else {
            pokemon = JSON.parse(cachedPoke);    
        }
        createCard(pokemon, card.id);
        clearNotFound();

    }
    catch {
        card.remove();
        callbackOnFail();
    }
}


if (!localStorage.getItem('favorites'))
    localStorage.setItem('favorites', '{}');