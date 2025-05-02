const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');
let width, height;

function resizeCanvas() 
{
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function hsvToRgb(h, s, v) 
{
    let f = (n, k = (n + h * 6) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
    return [f(5)*255, f(3)*255, f(1)*255];
}

class HarmonicArt 
{
    constructor() {
        this.reset();
    }

    reset() 
    {
        this.baseFreq = Math.random() * 0.02 + 0.01;
        this.amp = Math.random() * 100 + 50;
        this.harmonics = Math.floor(Math.random() * 6 + 3);
        this.phase = Math.random() * Math.PI * 2;
        this.t = 0;
        this.lineWidth = Math.floor(Math.random() * 4 + 1);
        this.speed = Math.random() * 0.08 + 0.02;
        this.colorMode = ['analogous', 'complementary', 'triadic'][Math.floor(Math.random()*3)];
        this.baseHue = Math.random();
        this.points = [];
    }

    update() 
    {
        this.t += this.speed;
        this.points = [];
        for (let x = 0; x < width; x += 5) 
        {
            let y = height / 2;
            for (let i = 1; i <= this.harmonics; i++) 
            {
                const freq = this.baseFreq * i;
                const amp = this.amp / i;
                y += amp * Math.sin(freq * x + this.phase * i + this.t);
            }
            this.points.push([x, y]);
        }
    }

    draw(ctx) 
    {
        for (let i = 0; i < this.points.length - 1; i++) 
        {
            const progress = i / this.points.length;
            let hue;
            if (this.colorMode === 'analogous') hue = (this.baseHue + 0.1 * progress) % 1.0;
            else if (this.colorMode === 'complementary') hue = (this.baseHue + 0.5 * progress) % 1.0;
            else hue = (this.baseHue + 0.3 * progress) % 1.0;

            const [r, g, b] = hsvToRgb(hue, 0.8, 0.9);
            ctx.strokeStyle = `rgb(${r},${g},${b})`;
            ctx.lineWidth = this.lineWidth;
            ctx.beginPath();
            ctx.moveTo(...this.points[i]);
            ctx.lineTo(...this.points[i + 1]);
            ctx.stroke();
        }
    }
}

let art = new HarmonicArt();
let showFPS = true;
let lastTime = performance.now();

document.getElementById('generateBtn').addEventListener('click', () => art.reset());
document.addEventListener('keydown', e => 
{
    if (e.code === 'Space') art.reset();
    else if (e.code === 'KeyF') showFPS = !showFPS;
});

function animate() 
{
    ctx.fillStyle = '#12121a';
    ctx.fillRect(0, 0, width, height);

    art.update();
    art.draw(ctx);

    if (showFPS) 
    {
        const now = performance.now();
        const delta = now - lastTime;
        lastTime = now;
        const fps = Math.round(1000 / delta);
        ctx.fillStyle = 'white';
        ctx.font = '16px sans-serif';
        ctx.fillText(`FPS: ${fps}`, 10, 20);
    }

    requestAnimationFrame(animate);
}
animate();
