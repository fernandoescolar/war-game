import Point from "../primitives/Point";
import Line from "../primitives/Line";
import Hexagon from "../primitives/Hexagon";
import Area from "./Area";
import Random from "./Random";

export default class Map {
    points: Point[] = [];
    lines: Line[] = [];
    hexagons: Hexagon[] = [];
    usedHexagons: Hexagon[] = [];
    areas: Area[] = [];

    constructor(public width: number, public height: number, public hexagonSize: number) {
    }

    clear(): void {
        if (this.areas.length > 0) {
            this.usedHexagons = [];
            this.areas = [];
            for (let i = 0, ii = this.hexagons.length; i < ii; i++) {
                this.hexagons[i].used = false;
            }
        }
    }

    generateHexagonArray(useDistortion: boolean): void {
        const hexagonWidth = Math.sqrt(3) * this.hexagonSize / 2;
        const numberOfHexagonsInARow = Math.floor((this.width / hexagonWidth) - 0.5);
        const numberOfHexagonsInAColumn = Math.floor(((4 * this.height) / (3 * this.hexagonSize)) - (1 / 3));
        const distortionAmount = 1;

        // pointArray
        for (let row = 0; row < numberOfHexagonsInAColumn + 1; row++) {
            for (let column = 0; column < numberOfHexagonsInARow + 1; column++) {
                let phi: number, r: number;
                let x = column * hexagonWidth;
                let y = row * this.hexagonSize * 0.75;
                if ((row % 2) === 0) {
                    y += 0.25 * this.hexagonSize;
                }

                if (useDistortion) {
                    phi = Math.random() * Math.PI * 2;
                    r = Math.random() * this.hexagonSize/4 * distortionAmount;
                    x += r * Math.cos(phi);
                    y += r * Math.sin(phi);
                }

                this.points.push(new Point(x, y));
                x = (column + 0.5) * hexagonWidth;
                y = row * this.hexagonSize * 0.75;
                if ((row % 2) === 1) {
                    y += 0.25 * this.hexagonSize;
                }

                if (useDistortion) {
                    phi = Math.random() * 2 * Math.PI;
                    r = Math.random() * this.hexagonSize/4 * distortionAmount;
                    x += r * Math.cos(phi);
                    y += r * Math.sin(phi);
                }

                this.points.push(new Point(x, y));
            }
        }

        // lineArray
        for (let row = 0; row < numberOfHexagonsInAColumn + 1; row++) {
            const number = numberOfHexagonsInARow * 2 + 2;
            for (let column = 0; column < numberOfHexagonsInARow * 2 + 1; column++) {
                const pointA = this.points[(row * number) + column];
                const pointB = this.points[(row * number) + column + 1];
                this.lines.push(new Line(pointA, pointB));
            }

            if (row < numberOfHexagonsInAColumn) {
                const oddrow = (row % 2) ? 1 : 0;
                for (let column = 0; column < numberOfHexagonsInARow + 1; column++) {
                    const pointA = this.points[(row * number) + column * 2 + oddrow];
                    const pointB = this.points[((row + 1) * number) + column * 2 + oddrow];
                    this.lines.push(new Line(pointA, pointB));
                }
            }
        }

        // hexagonArray
        const linesPerRow = numberOfHexagonsInARow * 3 + 2;
        for (let row = 0; row < numberOfHexagonsInAColumn; row++) {
            const oddrow = (row % 2) ? 1 : 0;
            for (let column = 0; column < numberOfHexagonsInARow; column++) {
                let number = linesPerRow * row + column * 2 + oddrow;
                const line1 = this.lines[number];
                const line2 = this.lines[number+1];

                number = linesPerRow * row + (numberOfHexagonsInARow * 2 + 1) + column;
                const line3 = this.lines[number];
                const line4 = this.lines[number+1];

                number = linesPerRow * (row + 1) + column * 2 + oddrow;
                const line5 = this.lines[number];
                const line6 = this.lines[number+1];

                this.hexagons.push(new Hexagon(line1, line2, line4, line6, line5, line3));
            }
        }

        // hexagonneighbours
        let leftBorder = true;
        let topBorder = true;
        let rightBorder = false;
        let bottomBorder = false;
        let index = 0;
        for (let i = 0; i < numberOfHexagonsInAColumn; i++) {
            leftBorder = true;
            if (i === (numberOfHexagonsInAColumn - 1)) {
                bottomBorder = true;
            }

            for (let j = 0; j < numberOfHexagonsInARow; j++) {
                if (j === (numberOfHexagonsInARow - 1)) {
                    rightBorder = true;
                }

                if (!leftBorder) {
                    this.hexagons[index].neighbours.push(this.hexagons[index - 1]);
                }

                if (!rightBorder) {
                    this.hexagons[index].neighbours.push(this.hexagons[index + 1]);
                }

                if (!topBorder) {
                    this.hexagons[index].neighbours.push(this.hexagons[index - numberOfHexagonsInARow]);
                    if ((i % 2) === 1) {
                        if (!rightBorder) {
                            this.hexagons[index].neighbours.push(this.hexagons[index + 1 - numberOfHexagonsInARow]);
                        }
                    } else {
                        if (!leftBorder) {
                            this.hexagons[index].neighbours.push(this.hexagons[index - 1 - numberOfHexagonsInARow]);
                        }
                    }
                }

                if (!bottomBorder) {
                    this.hexagons[index].neighbours.push(this.hexagons[index + numberOfHexagonsInARow]);
                    if ((i % 2) === 1) {
                        if (!rightBorder) {
                            this.hexagons[index].neighbours.push(this.hexagons[index + 1 + numberOfHexagonsInARow]);
                        }
                    } else {
                        if (!leftBorder) {
                            this.hexagons[index].neighbours.push(this.hexagons[index - 1 + numberOfHexagonsInARow]);
                        }
                    }
                }

                if (leftBorder) {
                    leftBorder = false;
                } else if (rightBorder) {
                    rightBorder = false;
                }

                index++;
            }

            if (topBorder) {
                topBorder = false;
            }
        }
    }

    holeChecker(hexagon: Hexagon, maximumHoleSize: number): boolean {
        const freeHexagons: Hexagon[] = [ hexagon ];
        for (let i = 0; i < freeHexagons.length; i++) {
            if (freeHexagons.length >= maximumHoleSize) {
                return false;
            }

            for (let j = 0; j < freeHexagons[i].neighbours.length; j++) {
                if (!freeHexagons[i].neighbours[j].used) {
                    if (freeHexagons.indexOf(freeHexagons[i].neighbours[j]) < 0) {
                        freeHexagons.push(freeHexagons[i].neighbours[j]);
                    }
                }
            }
        }

        if (freeHexagons.length < maximumHoleSize) {
            freeHexagons.forEach(hexagon => {
                if (this.usedHexagons.indexOf(hexagon) < 0) {
                    this.usedHexagons.push(hexagon);
                }
                hexagon.used = true;
            });

            return true;
        }

        return false;
    }

    generateArea(neighbourArea: Area | null, size: number, useCompactShapes: boolean): Area {
        const area = new Area();
        let startHexagon: Hexagon;
        if (neighbourArea != null) {
            do {
                startHexagon = neighbourArea.getRandomneighbourHexagon(true);
                if (!startHexagon) {
                    throw 'Epic Fail';
                }
            } while(this.holeChecker(startHexagon, size))
        }
        else {
            startHexagon = this.hexagons[Random.next(0, this.hexagons.length - 1)];
        }

        startHexagon.used = true;
        area.hexagons.push(startHexagon);
        this.usedHexagons.push(startHexagon);
        for (let i = 1; i < size; i++) {
            const newHexagon = area.getRandomneighbourHexagon(useCompactShapes);
            newHexagon.used = true;
            area.hexagons.push(newHexagon);
            this.usedHexagons.push(newHexagon);
        }

        return area;
    }

    normalGenerator(numberOfAreas: number, areaSizeVariance: number, useCompactShapes: boolean): void {
        const mapCoverage = 0.6;
        const averageAreaSize = Math.floor((this.hexagons.length - this.usedHexagons.length) * mapCoverage / numberOfAreas);
        if (areaSizeVariance < 0 || areaSizeVariance > 0.9) {
            areaSizeVariance = 0;
        }

        for (let i = 0; i < numberOfAreas; i++) {
            const areaSize = (averageAreaSize + Random.next(0, Math.floor(averageAreaSize * areaSizeVariance)) * (Random.next(0, 1) ? 1 : -1));
            if (this.areas.length > 0) {
                const globalArea = new Area();
                globalArea.hexagons = this.usedHexagons;
                this.areas.push(this.generateArea(globalArea, areaSize, useCompactShapes));
            } else {
                this.areas.push(this.generateArea(null, areaSize, useCompactShapes));
            }
        }
    }

    getAreaneighbours(): void {
        for (let i = 0, ii = this.areas.length; i < ii; i++) {
            const areaOutline = this.areas[i].outline;
            for (let j = i + 1; j < ii; j++) {
                const minXIndex = this.areas[i].boundingBox.min.x < this.areas[j].boundingBox.min.x ? i : j;
                const minYIndex = this.areas[i].boundingBox.min.y < this.areas[j].boundingBox.min.y ? i : j;
                if (this.areas[minXIndex].boundingBox.max.x >= this.areas[minXIndex === j ? i : j].boundingBox.min.x &&
                    this.areas[minYIndex].boundingBox.max.y > this.areas[minYIndex === j ? i : j].boundingBox.min.y) {

                    for (let k = 0, kk = this.areas[j].outline.length; k < kk; k += 2) {
                        if (areaOutline.indexOf(this.areas[j].outline[k]) >= 0) {
                            this.areas[i].neighbours.push(this.areas[j]);
                            this.areas[j].neighbours.push(this.areas[i]);
                            break;
                        }
                    }
                }
            }
        }
    }

    deleteAreaHoles(): void {
        for (let i = 0, ii = this.areas.length; i < ii; i++) {
            if (this.areas[i].holeLines !== undefined) {
                const area = this.areas[i];
                const holeHexagons: Hexagon[] = [];
                while (area.holeLines.length > 0) {
                    for (let j = 0, jj = this.hexagons.length; j < jj; j++) {
                        if (this.hexagons[j].lines.indexOf(area.holeLines[0]) >= 0 &&
                            area.hexagons.indexOf(this.hexagons[j]) < 0) {
                            holeHexagons.push(this.hexagons[j]);
                            break;
                        }
                    }

                    while (holeHexagons.length > 0) {
                        const hexagon = holeHexagons.pop() as Hexagon;
                        area.hexagons.push(hexagon);
                        for (let j = 0; j < 6; j++) {
                            if (area.inlines.indexOf(hexagon.lines[j]) < 0) {
                                area.inlines.push(hexagon.lines[j]);
                            }
                            const index = area.holeLines.indexOf(hexagon.lines[j]);
                            if (index >= 0) {
                                area.holeLines.splice(index, 0);
                            }
                        }

                        for (let j = 0, jj = hexagon.neighbours.length; j < jj; j++) {
                            if (area.hexagons.indexOf(hexagon.neighbours[j]) < 0) {
                                holeHexagons.push(hexagon.neighbours[j]);
                            }
                        }
                    }
                }
            }
        }
    }

    calculateOutlines(): void {
        for (let i = 0; i < this.areas.length; i++) {
            this.areas[i].generateOutline();
        }
    }

    calculateCenters(): void {
        for (let i = 0; i < this.areas.length; i++) {
            this.areas[i].getCenter();
        }
    }
}
