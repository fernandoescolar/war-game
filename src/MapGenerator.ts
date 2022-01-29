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

    getTerritories(): Territory[] {
        this.map.areas.forEach((area, index) => area.id = index);
        const territories = this.map.areas.map(createTerritory);
        territories.forEach((territory, index) => {
            territory.neighbors = this.map.areas[index].neighbors.map((n, i) => territories[i]);
        });

        return territories;
    }

    createTerritory(area: Area): Territory {
        const p = new Path2D();
        for(let i = 0; i < area.outline.length; i++) {
            if (i === 0) {
                p.moveTo(area.outline[i].x, outline[i].y);
            } else {
                p.lineTo(area.outline[i].x, outline[i].y);
            }
        }

        return new Territory(area.id, p);
    }
}

class Territory {
    color: string;
    selected: boolean = false;
    active: boolean = true;
    weight: number = 0;
    neighbors: Territory[] = [];

    constructor(public readonly id: number, public readonly path: Path2D) {
    }
}