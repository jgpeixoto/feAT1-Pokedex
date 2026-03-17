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
        const pokemon = this.parentElement.pokemon;
        const image = document.getElementById('sprite' + pokemon.id);
        if (this.checked) {
            image.src = pokemon.image_shiny;
        } else {
            image.src = pokemon.image;
        }
    });

    const shinySwitchLabel = document.createElement('label');
    shinySwitchLabel.for = 'shinySwitch' + pokemon.id;
    shinySwitchLabel.textContent = 'Shiny';

    const text = document.createElement('h3');
    text.textContent = pokemon.id + " - " + pokemon.name;
    
    card.appendChild(image);
    card.appendChild(text);
    card.appendChild(shinySwitch);
    card.appendChild(shinySwitchLabel);

    container.appendChild(card);
}

function clearPokemon() {
    const container = document.getElementById('pokemon-card-container');
    for (let i = container.children.length-1; i >= 0; i--)
        container.children.item(i).remove();
}

async function getPokemon(idOrName, callbackOnFail=(() => {})) {
    try {
        let json = await (await fetch('https://pokeapi.co/api/v2/pokemon/'+idOrName)).json();
        const pokemon = new Pokemon(json);
        createCard(pokemon);
    }
    catch {
        callbackOnFail();
    }
}

const searchBar = document.querySelector('#pokemon-search-bar input');
searchBar.addEventListener('input', function() {
    const error = document.getElementById('errorMessage');
    if (error) error.remove();
    clearPokemon();
    if (!this.value)
    {
        for (let i = 1; i <= 18; i++)
        {
            getPokemon(i);
        }
    }
    else if (!isNaN(this.value) && Number(this.value) <= 1025)
    {
        getPokemon(Number(this.value));
    }
    else {
        getPokemon(this.value.toLowerCase(), function() {
            if (!error) {
                const container = document.getElementById('pokemon-card-container');
                const text = document.createElement('h2');
                text.style = 'text-align: center';
                text.textContent = 'No pokemon found with that name or ID.';
                text.id = 'errorMessage'
                document.body.insertBefore(text, container);
            }
        });
    }
});
for (let i = 1; i <= 18; i++)
{
    getPokemon(i);
}