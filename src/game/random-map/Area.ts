import Hexagon from "../primitives/Hexagon";
import Line from "../primitives/Line";
import Point from "../primitives/Point";
import Random from "./Random";

export default class Area {
    id!: number;
    hexagons: Hexagon[] = [];
    neighbours: Area[] = [];
    outline: Point[] = [];
    inlines: Line[] = [];
    center!: Point;
    boundingBox!: {min: Point, max: Point};
    holeLines!: Line[];

    getRandomneighbourHexagon(useCompactShapes: boolean): Hexagon {
        if (useCompactShapes) {
            while (true) {
                const hexagon = this.hexagons[Random.next(0, this.hexagons.length - 1)];
                const neighbourHexagon = hexagon.neighbours[Random.next(0, hexagon.neighbours.length - 1)];
                if (!neighbourHexagon.used)
                    return neighbourHexagon;
            }
        }
        else {
            const neighbourHexagons: Hexagon[] = [];
            for (let i = 0; i < this.hexagons.length; i++) {
                for (let j = 0; j < this.hexagons[i].neighbours.length; j++) {
                    if (!this.hexagons[i].neighbours[j].used) {
                        if (neighbourHexagons.indexOf(this.hexagons[i].neighbours[j]) < 0) {
                            neighbourHexagons.push(this.hexagons[i].neighbours[j]);
                        }
                    }
                }
            }

            return neighbourHexagons[Random.next(0, neighbourHexagons.length -1)];
        }
    }

    getPointField(points: Point[], lineLength: number): Point[] {
        const connectedPoints: Point[] = [];
        let isConnected = true;

        connectedPoints.push(points[0]);
        points.splice(0, 1);

        while (isConnected) {
            isConnected = false;
            for (let i = 0; i < connectedPoints.length; i++) {
                for (let j = 0; j < points.length; j++) {
                    if (connectedPoints[i].distance(points[j]) < lineLength) {
                        connectedPoints.push(points[j]);
                        points.splice(j, 1);
                        isConnected = true;
                        break;
                    }
                }

                if (isConnected) {
                    break;
                }
            }
        }

        return connectedPoints;
    }

    getHexagonField(hexagons: Hexagon[]): Hexagon[] {
        const connectedHexagons: Hexagon[] = [];
        let isConnected = true;

        connectedHexagons.push(hexagons[0]);
        hexagons.splice(0, 1);

        while (isConnected) {
            isConnected = false;
            for (let i = 0, ii = connectedHexagons.length; i < ii; i++) {
                for (let j = 0, jj = hexagons.length; j < jj; j++) {
                    if (hexagons[j].neighbours.indexOf(connectedHexagons[i]) >= 0) {
                        connectedHexagons.push(hexagons[j]);
                        hexagons.splice(j, 1);
                        isConnected = true;
                        break;
                    }
                }

                if (isConnected) {
                    break;
                }
            }
        }

        return connectedHexagons;
    }

    generateOutline(): void {
        // lineArray containing only outlines
        let outLines: Line[] = [];
        for (let i = 0, ii = this.hexagons.length; i < ii; i++) {
            for (let j = 0; j < 6; j++) {
                const line = this.hexagons[i].lines[j];
                const index = outLines.indexOf(line);
                if (index >= 0) {
                    outLines.splice(index, 1);
                    this.inlines.push(line);
                }
                else {
                    outLines.push(line);
                }
            }
        }

        // getting line on the outside
        let line = outLines[outLines.length - 1];
        let lineIndex = outLines.length - 1;
        for (let i = 0; i < outLines.length; i++) {
            if (outLines[i].points[0].x < line.points[0].x) {
                line = outLines[i];
                lineIndex = i;
            }
        }

        // creating the outline and bounding box
        this.outline.push(line.points[0]);
        this.outline.push(line.points[1]);
        outLines.splice(lineIndex, 1);

        const startPoint = line.points[0];
        let point = line.points[1];

        this.boundingBox = {
            min: new Point(Math.min(startPoint.x, point.x), Math.min(startPoint.y, point.y)),
            max: new Point(Math.max(startPoint.x, point.x), Math.max(startPoint.y, point.y))
        };

        while (startPoint != point) {
            for (let i = 0; i < outLines.length; i++) {
                let isNewPoint = false;
                if (outLines[i].points[0] === point) {
                    point = outLines[i].points[1];
                    this.outline.push(outLines[i].points[1]);
                    outLines.splice(i, 1);
                    isNewPoint = true;
                }
                else if (outLines[i].points[1] === point) {
                    point = outLines[i].points[0];
                    this.outline.push(outLines[i].points[0]);
                    outLines.splice(i, 1);
                    isNewPoint = true;
                }

                if (isNewPoint) {
                    this.boundingBox.min.x = Math.min(this.boundingBox.min.x, point.x);
                    this.boundingBox.min.y = Math.min(this.boundingBox.min.y, point.y);

                    this.boundingBox.max.x = Math.max(this.boundingBox.max.x, point.x);
                    this.boundingBox.max.y = Math.max(this.boundingBox.max.y, point.y);
                }
            }
        }

        if (outLines.length > 0)
            this.holeLines = outLines;
    }

    getCenter(): void {
        this.center = this.calculateCenter();
    }

    private calculateCenter(): Point {
        // triplePoints are points in the inside of a area / a triplePoint is part of 3 hexagons
        const triplePoints: Point[] = [];
        const points: Point[] = [];
        for (let i = 0, ii = this.inlines.length; i < ii; i++) {
            for (let j = 0; j < 2; j++) {
                const point = this.inlines[i].points[j];
                if (points.indexOf(point) >= 0) {
                    if (triplePoints.indexOf(point) < 0) {
                        triplePoints.push(point);
                    }
                }
                else {
                    points.push(point);
                }
            }
        }

        let sumX = 0;
        let sumY = 0;
        const line = this.hexagons[0].lines[0];
        const lineLength = line.points[0].distance(line.points[1]) * 1.1;

        // no triplePoints: set center in middle of a hexagon
        if (triplePoints.length < 1) {
            for (let  i = 0, ii = this.hexagons.length; i < ii; i++) {
                let inAreaneighbours = 0;
                for (let j = 0; j < 6; j++) {
                    if (this.hexagons.indexOf(this.hexagons[i].neighbours[j]) >= 0) {
                        inAreaneighbours++;

                        // use a hexagon as center with 3 neighbours
                        if (inAreaneighbours === 3) {
                            for (let k = 0; k < 6; k++) {
                                sumX += this.hexagons[i].lines[k].points[0].x + this.hexagons[i].lines[k].points[1].x;
                                sumY += this.hexagons[i].lines[k].points[0].y + this.hexagons[i].lines[k].points[1].y;
                            }

                            return new Point(sumX / 12, sumY / 12);
                        }
                    }
                }
            }

            // if there is no hexagon with 3 neighbours, use first
            for (let i = 0; i < 6; i++) {
                sumX += this.hexagons[0].lines[i].points[0].x + this.hexagons[0].lines[i].points[1].x;
                sumY += this.hexagons[0].lines[i].points[0].y + this.hexagons[0].lines[i].points[1].y;
            }

            return new Point(sumX / 12, sumY / 12);
        }

        // a pointField consists of connected triplePoints
        const pointFields : Point[][] = [];
        while (triplePoints.length > 0) {
            pointFields.push(this.getPointField(triplePoints, lineLength));
        }

        // get the biggest pointField
        let pointField = pointFields[0];
        for (let i = 1; i < pointFields.length; i++) {
            if (pointFields[i].length > pointField.length) {
                pointField = pointFields[i];
            }
        }

        // inLineHexagons are hexagons completely on the inside of an area
        const inlineHexagons: Hexagon[] = [];
        for (let i = 0, ii = this.hexagons.length; i < ii; i++) {
            let containsHex = true;
            for (let j = 0; j < 6; j++) {
                if (pointField.indexOf(this.hexagons[i].lines[j].points[0]) < 0 ||
                    pointField.indexOf(this.hexagons[i].lines[j].points[1]) < 0) {

                    containsHex = false;
                    break;
                }
            }

            if (containsHex) {
                inlineHexagons.push(this.hexagons[i]);
            }
        }

        // no inlineHexagons: set center to average triplePoint in pointField
        if (inlineHexagons.length < 1) {
            for (let i = 0, ii = pointField.length; i < ii; i++) {
                sumX += pointField[i].x;
                sumY += pointField[i].y;
            }

            const centerPoint = new Point(sumX / pointField.length, sumY / pointField.length);
            let minDistance = Infinity;
            let j = 0;
            if (pointField.length < 7) {
                return centerPoint;
            }

            for (let i = 0, ii = pointField.length; i < ii; i++) {
                let pointDistance = centerPoint.distance(pointField[i]);
                if (pointDistance < minDistance) {
                    j = i;
                    minDistance = pointDistance;
                    if (minDistance < lineLength / 2) {
                        break;
                    }
                }
            }

            return pointField[j];
        }

        // a hexagonField is a field consisting of inlineHexagons
        const hexagonFields: Hexagon[][] = [];
        while (inlineHexagons.length > 0) {
            hexagonFields.push(this.getHexagonField(inlineHexagons));
        }

        // get the biggest hexagonField
        let hexagonField = hexagonFields[0];
        for (let i = 1; i < hexagonFields.length; i++) {
            if (hexagonFields[i].length > hexagonField.length) {
                hexagonField = hexagonFields[i];
            }
        }

        const hexagonCenters: Point[] = [];
        for (let i = 0, ii = hexagonField.length; i < ii; i++) {
            let x = 0;
            let y = 0;
            for (let j = 0; j < 6; j++) {
                x += hexagonField[i].lines[j].points[0].x + hexagonField[i].lines[j].points[1].x,
                y += hexagonField[i].lines[j].points[0].y + hexagonField[i].lines[j].points[1].y;
            }

            sumX += x /= 12;
            sumY += y /= 12;
            hexagonCenters.push(new Point(x, y));
        }

        const centerPoint = new Point(sumX / hexagonField.length, sumY / hexagonField.length);
        let minDistance = Infinity;
        let j = 0;
        if (hexagonField.length < 7) {
            return centerPoint;
        }

        for (let i = 0, ii = hexagonField.length; i < ii; i++) {
            const hexDistance = centerPoint.distance(hexagonCenters[i]);
            if (hexDistance < minDistance) {
                j = i;
                minDistance = hexDistance;
                if (minDistance < lineLength * 2 / 3) {
                    break;
                }
            }
        }

        return new Point(hexagonCenters[j].x, hexagonCenters[j].y);
    }
}