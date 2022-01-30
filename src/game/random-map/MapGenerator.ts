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

    getTerritories(offsetX: number, offsetY: number): Territory[] {
        this.map.areas.forEach((area, index) => area.id = index);
        const territories = this.map.areas.map(a => this.createTerritory(a, offsetX, offsetY));
        territories.forEach((territory, index) => {
            territory.neighbours = this.map.areas[index].neighbours.map(n => territories[n.id]);
        });

        // get min y in map areas outline
        const minY = Math.min(...this.map.areas.map(a => Math.min(...a.outline.map(p => p.y))));
        console.log(minY);
        debugger;
        offsetY = offsetY - minY;
        return territories;
    }

    createTerritory(area: Area, offsetX: number, offsetY: number): Territory {
        const p = new Path2D();
        for(let i = 0; i < area.outline.length; i++) {
            if (i === 0) {
                p.moveTo(area.outline[i].x + offsetX, area.outline[i].y + offsetY);
            } else {
                p.lineTo(area.outline[i].x + offsetX, area.outline[i].y + offsetY);
            }
        }



        return new Territory(area.id, p, new Point(area.center.x + offsetX, area.center.y + offsetY));
    }
}
