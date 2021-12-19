'use strict';

const assert = require('assert');



class Cell {

    constructor() {

        this.changed = false;

        this.state = this.generate();

    }



    generate() {

        const states = ['live', 'dead'];

        const rand = (values) => Math.floor(Math.random() * (values.length));

        const index = () => rand(states);

        // const limit = () => Math.max(10, Math.floor(Math.random() * (100)));

        // const shuffle = new Array(limit()).fill(null).map(_ => states[index()]);

        return states[index()];

    }

}



assert.ok((new Cell()) instanceof Cell, 'Instance missing the Cell constructor');



for (let i = 0; i <= 100; i += 1) {

    const cell = new Cell();

    const cellState = cell.state;

    assert.ok(cellState === 'live' ? true : (cellState === 'dead' ? true : false));

}



class Grid {

    constructor(width, height, slot=null) {

        if (typeof slot === 'string' && slot === 'cell') {

            slot = () => new Cell();

        }

        this.slots = this.produce(width, () => this.produce(height, slot));

    }



    produce(size, value=null) {

        let matrix = new Array(size)

        if (typeof value === 'function') {

            return matrix.fill(null).map(_ => value());

        } else {

            return matrix.fill(value);

        }

    }

}



assert.ok((new Grid()) instanceof Grid, 'Instance missing the Grid constructor');

const nullGrid = new Grid(3, 3);

assert.deepEqual(nullGrid.slots, [

    [null, null, null],

    [null, null, null],

    [null, null, null],

]);



// let cellGrid = new Grid(10, 10, 'cell');

// for (let i = 0; i < cellGrid.slots.length; i += 1) {

//     const line = cellGrid.slots[i];

//     for (let j = 0; j < line.length; j += 1) {

//         const cell = line[j];

//         assert.ok(cell instanceof Cell);

//     }

// }



function mutateCells(grid) {

    for (let i = 0; i < grid.slots.length; i += 1) {

        const line = grid.slots[i];

        for (let j = 0; j < line.length; j += 1) {

            const cell = line[j];

            const backCellInLine = line[j - 1];

            const nextCellInLine = line[j + 1];

            const backCellInColumn = grid.slots[i - 1] !== undefined && grid.slots[i - 1][j];

            const nextCellInColumn = grid.slots[i + 1] !== undefined && grid.slots[i + 1][j];

            const neighboors = [backCellInLine, nextCellInLine, backCellInColumn, nextCellInColumn];

            if (

                cell.state === 'live' && (

                    neighboors.filter(v => v !== undefined).filter(n => n.state === 'dead').length === 1

                )

            ) {

                // cell die

                cell.state = 'dead';

                cell.changed = true;

            } else if (

                cell.state === 'live' && (

                    neighboors.filter(v => v !== undefined).filter(n => n.state === 'live').length === 2 ||

                    neighboors.filter(v => v !== undefined).filter(n => n.state === 'live').length === 3

                )

            ) {

                // cell live

                cell.state = 'live';

                cell.changed = true;

            } else if (

                cell.state === 'live' && (

                    neighboors.filter(v => v !== undefined).filter(n => n.state === 'live').length > 3

                )

            ) {

                // cell die

                cell.state = 'dead';

                cell.changed = true;

            } else if (

                cell.state === 'dead' && (

                    neighboors.filter(v => v !== undefined).filter(n => n.state === 'live').length === 3

                )

            ) {

                // cell live

                cell.state = 'live';

                cell.changed = true;

            } else {

                cell.changed = false;

            }

        }

    }

    return grid;

}



window.Cell = Cell;

window.Grid = Grid;

window.mutateCells = mutateCells;



console.log('bundle');



// console.log(cellGrid.slots);

// cellGrid = mutateCells(cellGrid);

// console.log(cellGrid.slots);



// for (let i = 0; i <= 100; i += 1) {

// for (;;) {

//     for (let j = 0; j < cellGrid.slots.length; j += 1) {

//         const line = cellGrid.slots[j];

//         console.log(line.map(c => c.state === 'live' ? '.' : '').join(' '));

//     }

//     cellGrid = mutateCells(cellGrid);

//     console.log(new Array(10).fill('-').join(''));

//     for (let j = 0; j < cellGrid.slots.length; j += 1) {

//         const line = cellGrid.slots[j];

//         console.log(line.map(c => c.state === 'live' ? '.' : '').join(' '));

//     }

// }
