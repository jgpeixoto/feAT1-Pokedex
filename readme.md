
# jgpeixoto's Pokedex

A simple pokedex for viewing stats, moves and other information from most pokemon (generations I through IX).

> This repository was made as a learning experience within the internship
> "Full-Stack Journey: React.js" at Compass UOL,
> by the trainee **João Gabriel de Araújo Peixoto**.
## Features

- Favorite system
- Searching by ID and name
- Automatic caching
- Switching between regular and shiny forms


## Tech Stack
- HTML5, CSS3 and JavaScript
- Data and resources provided by [PokéAPI](https://pokeapi.co/)

## Run Locally (w/ Live Server)

1. Clone the project

```bash
  git clone https://github.com/jgpeixoto/feAT1-Pokedex
```

2. Go to the project directory

```bash
  cd feAT1-Pokedex
```

3. Open the project in VSCode

```bash
  code ./
```

4. Install [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for VSCode
![live server screenshot](https://github.com/jgpeixoto/feat1-pokedex/blob/main/.screenshots/1.png?raw=true)

5. Click 'Go Live' on the bottom right corner
![live server screenshot](https://github.com/jgpeixoto/feat1-pokedex/blob/main/.screenshots/2.png?raw=true)

## Screenshots
![main screen](https://github.com/jgpeixoto/feat1-pokedex/blob/main/.screenshots/3.png?raw=true)
![about screen](https://github.com/jgpeixoto/feat1-pokedex/blob/main/.screenshots/4.png?raw=true)

## Final Considerations
Likely the two greatest challenges I faced were figuring out how to store/cache information within LocalStorage and get the custom font to work properly. For the first one, some parsing and stringifying had to be done in JSON to store any significant amount of information; and for the latter simply converting the custom font from .ttf (truetype) to .woff did the trick.
