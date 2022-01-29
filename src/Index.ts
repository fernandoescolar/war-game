import MapGenerator from "./MapGenerator";

const width = 360;
const height = 640 ;
const hexagonSize = 30;
const numberOfAreas = 42;
const areaSizeVariance = 0.5;
const useDistortion = true;
const showCentersAndConnection = true;
const useCompactShapes = true;
const generator = new MapGenerator();
generator.createHexagonPattern(
    width,
    height,
    hexagonSize,
    useDistortion
);

generator.generate(
    numberOfAreas,
    areaSizeVariance,
    useCompactShapes
);

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
// canvas.width = width;
// canvas.height = height;
// canvas.style.width = width + 'px';
// canvas.style.height = height  + 'px';
// document.body.appendChild(canvas);
// canvas.onclick = function (event)
// {
//     if ((event as any).region) {
//         alert('You clicked ' + (event as any).region);
//     }
// }

const context = canvas.getContext("2d");

//window.requestAnimationFrame(draw);
draw();
function draw(): void {
    context.clearRect(0, 0, width, height);

    const areas = generator.getAreas();
    for(let i = 0; i < areas.length; i++) {
        const area = areas[i];
        context.beginPath();
        context.moveTo(area.outline[0].x, area.outline[0].y);
        for(let j = 1; j < area.outline.length; j++) {
            context.lineTo(area.outline[j].x, area.outline[j].y);
        }
        context.lineTo(area.outline[0].x, area.outline[0].y);
        context.closePath();
        context.fillStyle = "rgba(0, 255, 0, 1)";
        context.strokeStyle = "rgba(0, 0, 0, 1)";
        context.stroke();
        context.fill();
        // context.isPointInPath()
        // (context as any).addHitRegion({id: area.id});
    }
}
// generator.getAreas().forEach(area => {
//     debugger;
//     context.beginPath();
//     context.fillStyle = 'gray';
//     context.strokeStyle = 'black';
//     context.moveTo(area.outline[0].x, area.outline[0].y);
//     area.outline.forEach(point => {
//         context.lineTo(point.x, point.y);
//     });
//     context.closePath();
//     context.fill();

// });