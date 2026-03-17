function capitalize(input) {
    return input.charAt(0).toUpperCase() + input.slice(1);
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
        this.base_att=rawPokemon.stats[1].base_stat;
        this.base_def=rawPokemon.stats[2].base_stat;
        this.base_satt=rawPokemon.stats[3].base_stat;
        this.base_sdef=rawPokemon.stats[4].base_stat;
        this.base_speed=rawPokemon.stats[5].base_stat;
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

document.getElementById('pokemon').textContent = "TESTE JAVASCRIPT"; 