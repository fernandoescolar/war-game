import Area from './Area';
import Map from './Map';
import Territory from '../Territory';

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
        const territories = this.map.areas.map(this.createTerritory);
        territories.forEach((territory, index) => {
            territory.neighbours = this.map.areas[index].neighbours.map(n => territories[n.id]);
        });

        return territories;
    }

    createTerritory(area: Area): Territory {
        const p = new Path2D();
        for(let i = 0; i < area.outline.length; i++) {
            if (i === 0) {
                p.moveTo(area.outline[i].x, area.outline[i].y);
            } else {
                p.lineTo(area.outline[i].x, area.outline[i].y);
            }
        }

        return new Territory(area.id, p, area.center);
    }
}
