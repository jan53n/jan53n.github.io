class CellMap {

    constructor(height, width) {
        this.width = width;
        this.height = height;
        this.length = width * height;
        this.cells = new Array(this.length).fill(0);
    }

    setCell(x, y) {
        const [w, h] = [this.width, this.height];
        let xoleft, xoright, yoabove, yobelow;
        const cell = (y * w) + x;

        if (x === 0) {
            xoleft = w - 1;
        } else {
            xoleft = -1;
        }

        if (y === 0) {
            yoabove = this.length - w;
        } else {
            yoabove = -w;
        }

        if (x === (w - 1)) {
            xoright = -(w - 1);
        } else {
            xoright = 1;
        }

        if (y === (h - 1)) {
            yobelow = -(this.length - w);
        } else {
            yobelow = w;
        }

        this.cells[cell] |= 0x01;
        this.cells[(cell + yoabove + xoleft)] += 2;
        this.cells[(cell + yoabove)] += 2;
        this.cells[(cell + yoabove + xoright)] += 2;
        this.cells[(cell + xoleft)] += 2;
        this.cells[(cell + xoright)] += 2;
        this.cells[(cell + yobelow + xoleft)] += 2;
        this.cells[(cell + yobelow)] += 2;
        this.cells[(cell + yobelow + xoright)] += 2;
    }

    clearCell(x, y) {
        const [w, h] = [this.width, this.height];
        let xoleft, xoright, yoabove, yobelow;
        const cell = (y * w) + x;

        if (x === 0) {
            xoleft = w - 1;
        } else {
            xoleft = -1;
        }

        if (y === 0) {
            yoabove = this.length - w;
        } else {
            yoabove = -w;
        }

        if (x === (w - 1)) {
            xoright = -(w - 1);
        } else {
            xoright = 1;
        }

        if (y === (h - 1)) {
            yobelow = -(this.length - w);
        } else {
            yobelow = w;
        }

        this.cells[cell] &= ~0x01;
        this.cells[(cell + yoabove + xoleft)] -= 2;
        this.cells[(cell + yoabove)] -= 2;
        this.cells[(cell + yoabove + xoright)] -= 2;
        this.cells[(cell + xoleft)] -= 2;
        this.cells[(cell + xoright)] -= 2;
        this.cells[(cell + yobelow + xoleft)] -= 2;
        this.cells[(cell + yobelow)] -= 2;
        this.cells[(cell + yobelow + xoright)] -= 2;
    }

    getCellState(x, y) {
        const cell = (y * this.width) + x;
        return this.cells[cell] & 0x01;
    }

    *nextGeneration() {
        const cells = [...this.cells];
        const [w, h] = [this.width, this.height];
        let cell = 0;

        for (let y = 0; y < h; y++) {
            let x = 0;
            loop1:
            do {

                while (cells[cell] == 0) {
                    cell++;
                    if (++x >= w) continue loop1;
                }

                const count = cells[cell] >> 1;

                if (cells[cell] & 0x01) {

                    if (count != 2 && count != 3) {
                        this.clearCell(x, y);
                        yield [x, y, false];
                    }
                } else {
                    if (count == 3) {
                        this.setCell(x, y);
                        yield [x, y, true];
                    }
                }

                cell++;

            } while (++x < w);
        }
    }
}

function draw(x, y, on = true) {
    self.postMessage([x, y, on]);
}

self.addEventListener('message', (e) => {
    const {
        width,
        height,
        interval
    } = e.data;

    const map = new CellMap(width, height);

    const baseState = [
        [9, 9],
        [10, 10],
        [10, 11],
        [9, 11],
        [8, 11],
    ];

    baseState.forEach(([x, y]) => {
        map.setCell(x, y);
        draw(x, y);
    });

    setInterval(() => {
        const iter = map.nextGeneration();

        for (const [x, y, on] of iter) {
            draw(x, y, on);
        }
    }, interval);

}, false);