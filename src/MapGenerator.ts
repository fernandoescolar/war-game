import Area from './Area';
import Map from './Map';

export default class MapGenerator {
    map: Map | undefined = undefined;

    createHexagonPattern(mapWidth: number, mapHeight: number, hexagonSize: number, useDistortion: boolean): void {
        this.map = new Map(mapWidth, mapHeight, hexagonSize);
        this.map.generateHexagonArray(useDistortion);
    }

    generate(numberOfAreas: number, areaSizeVariance: number, useCompactShapes: boolean) {
        if (this.map === undefined) {
            throw "call MapGenerator.createHexagonPattern() before generating";
        }
debugger;
        this.map.clear();
        this.map.normalGenerator(numberOfAreas, areaSizeVariance, useCompactShapes);
        this.map.calculateOutlines();
        this.map.deleteAreaHoles();
        this.map.calculateCenters();
        this.map.getAreaNeighbors();
    }

    getAreas(): Area[] {
        return this.map.areas;
    }
}