class Grid {
    constructor({rowCount, columnCount, parentNode, gridOptions, cellOptions}) {
        this.rowCount = rowCount;
        this.columnCount = columnCount;
        this.options = gridOptions;
        this.nodeReference = this._createGrid(cellOptions);
        parentNode.innerHTML = "";
        parentNode.appendChild(this.nodeReference);
    }
    _createGrid(cellOptions) {
        this.model = [];
        const gridNode = this._createGridNode();
        
        for (let row = 0; row < this.rowCount; row++) {
            this.model.push([]);
            for (let column = 0; column < this.columnCount; column++) {
                const cell = this._createCell({column, row, cellOptions});
                this.model[row][column] = cell;
                gridNode.appendChild(cell.nodeReference);
            }
        }
        return gridNode;
    }
    _createCell({column, row, cellOptions}) {
        return new Cell({column, row, cellOptions});
    }
    _createGridNode() {
        const gridNode = document.createElement("div");
        gridNode.style.display = 'grid';
        gridNode.style.gridTemplateRows = `repeat(${this.rowCount}, 1fr)`;
        gridNode.style.gridTemplateColumns = `repeat(${this.columnCount}, 1fr)`;
        gridNode.classList.add('grid');
        if (this.options && this.options.classList) {
            gridNode.classList.add(...this.options.classList);
        }
        gridNode.style.setProperty('--row-count', this.rowCount);
        gridNode.style.setProperty('--column-count', this.columnCount);
        gridNode.addEventListener('click', this.handleClick.bind(this));
        return gridNode;
    }
    getCellByPosition(row, column) {
        return this.model[row][column] || null;
    }
    resetClickedStatuses() {
        this.model.flat(2).forEach(cell => cell.setAsNotClicked());
    }
    getNeighborsOf(cell) {
        const neighborsList = [];
        for (let row = cell.row - 1; row < cell.row + 2; row++) {
            for (let column = cell.column - 1; column < cell.column + 2; column++) {
                const neighborCell = this.model[row][column];
                if (neighborCell && !(row === cell.row && column === cell.column)) {
                    neighborsList.push(neighborCell);
                }
            }
        }
        return neighborsList;
    }
    handleClick(event) {
        const cellNode = event.target;
        if (!(cellNode.classList.contains('cell'))) return;
        
        this.onClick(cellNode.cellInstance);
    }
    onClick(cell) {
        // Override this in child class
        cell.toggleClickedStatus();
    }
}

class Cell {
    constructor({row, column, cellOptions}) {
        this.row = row;
        this.column = column;
        this.options = cellOptions;
        this.nodeReference = this._createCellNode();
        this.clicked = false;
    }
    _createCellNode() {
        const cellNode = document.createElement('div');
        cellNode.classList.add('cell');
        if (this.options && this.options.classList) {
            cellNode.classList.add(...this.options.classList);
        }
        cellNode.dataset.row = this.row;
        cellNode.dataset.column = this.column;
        cellNode.cellInstance = this;
        return cellNode;
    }
    swapStyle(oldClasses, newClasses) {
        Array.isArray(oldClasses)
            ? this.nodeReference.classList.remove(...oldClasses)
            : this.nodeReference.classList.remove(oldClasses);
        Array.isArray(newClasses) 
            ? this.nodeReference.classList.add(...newClasses)
            : this.nodeReference.classList.add(newClasses);
    }
    toggleClickedStatus() {
        this.clicked
            ? this.setAsNotClicked()
            : this.setAsClicked()
    }
    setAsClicked() {
        this.clicked = true;
        this.nodeReference.classList.add("clicked");
    }
    setAsNotClicked() {
        this.clicked = false;
        this.nodeReference.classList.remove("clicked");
    }
}
