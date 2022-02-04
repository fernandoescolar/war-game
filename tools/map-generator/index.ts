import MapGenerator from "./MapGenerator";
import Random from "./Random";
import Territory from "./Territory";

const config = {
    mapWidth: 375,
    mapHeight: 630,
    hexagonSize: 30,
    useDistortion: true,
    numberOfAreas: 30,
    areaSizeVariance: 0.1,
    useCompactShapes: true,
    initialArmies: 20,
    maxArmiesPerTerrotory: 10,
    numberOfPlayers: Random.next(3, 6)
};
console.log("Creating map...");


var generator = new MapGenerator();
generator.createHexagonPattern(
    config.mapWidth,
    config.mapHeight,
    config.hexagonSize,
    config.useDistortion,
);
generator.generate(
    config.numberOfAreas,
    config.areaSizeVariance,
    config.useCompactShapes,
);

var territories = generator.getTerritories();
var minTerritoriesPerPlayer = Math.ceil(config.initialArmies / config.maxArmiesPerTerrotory);
var players: Territory[][] = Array(config.numberOfPlayers).fill(0).map(() => []);

territories.forEach(territory => {
    territory.playerId = Random.next(0, config.numberOfPlayers - 1);
    players[territory.playerId].push(territory);
});

while(players.find(x => x.length < minTerritoriesPerPlayer))
{
    var player = players.find(x => x.length < minTerritoriesPerPlayer);
    if (!player) throw 'Epic fail';

    var maxTerritories = players.map(x => x.length).reduce((a, b) => Math.max(a, b));
    var max = players.find(x => x.length === maxTerritories);
    if (!max) throw 'Epic fail';

    var territory = max[0];
    max.splice(0, 1);
    player.push(territory);
}

players.forEach(x => {
    var armies = config.initialArmies - x.length;
    x.forEach(territory => territory.armies = 1);

     while (armies > 0) {
        var territory = x[Random.next(0, x.length - 1)];
        if (territory.armies >= config.maxArmiesPerTerrotory) continue;
        territory.armies++;
        armies--;
     }
});

// shuffle players order
var playerArray = [ ...Array(config.numberOfPlayers).keys() ];
playerArray.sort(() => Math.random() - 0.5);



var json = {
    territories,
    numberOfPlayers: config.numberOfPlayers,
    maxArmiesPerTerrotory: config.maxArmiesPerTerrotory,
    playerOrder: playerArray
};

import fs from 'fs';
fs.writeFile("map.json", JSON.stringify(json), function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("'map.json' file was saved!");
    }
});
