import Area from './Area';
import Map from './Map';
import Territory from '../Territory';
import Point from '../primitives/Point';

export default class MapGenerator {
    map!: Map;

    createHexagonPattern(mapWidth: number, mapHeight: number, hexagonSize: number, useDistortion: boolean): void {
        this.map = new Map(mapWidth, mapHeight, hexagonSize);
        this.map.generateHexagonArray(useDistortion);
    }

    generate(numberOfAreas: number, areaSizeVariance: number, useCompactShapes: boolean) {
        if (this.map === undefined) {
            throw "call MapGenerator.createHexagonPattern() before generating";
        }

        this.map.clear();
        this.map.normalGenerator(numberOfAreas, areaSizeVariance, useCompactShapes);
        this.map.calculateOutlines();
        this.map.deleteAreaHoles();
        this.map.calculateCenters();
        this.map.getAreaneighbours();
    }

    getTerritories(): Territory[] {
        this.map.areas.forEach((area, index) => area.id = index);
        const territories = this.map.areas.map(a => this.createTerritory(a));
        territories.forEach((territory, index) => {
            territory.neighbours = this.map.areas[index].neighbours.map(n => territories[n.id]);
        });
        return territories;
    }

    createTerritory(area: Area): Territory {
        return new Territory(area.id, area.outline, new Point(area.center.x, area.center.y));
    }
}
