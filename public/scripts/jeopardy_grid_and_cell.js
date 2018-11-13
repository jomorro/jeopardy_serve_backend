class JeopardyGrid extends Grid {
    constructor(parentNode, categoryObjectsList, moneyIncrement = 100) {
        super({
            rowCount: 6,
            columnCount: 6,
            parentNode: parentNode,
            cellOptions: {
                moneyIncrement,
                categoryObjectsList
            }
        })
        this.moneyIncrement = moneyIncrement;
        this.categoryObjectsList = categoryObjectsList.list;
    }
    _createCell({column, row, cellOptions}) {
        return new JeopardyCell({column, row, cellOptions});
    }
    onClick(cell) {
        cell.handleClick();
    }
}

class JeopardyCell extends Cell {
    constructor({row, column, cellOptions}) {
        super({row, column, cellOptions});
        this.dollarAmount = this.row * cellOptions.moneyIncrement;
        this.categoryListPromise = cellOptions.categoryObjectsList.list;
        if (row > 0) {
            this.questionObject =this._selectQuestion(this.categoryListPromise, column);
            this.isAQuestionCell = true;
        } else {
            this.isAQuestionCell = false;
        }
        this.categoryTitle = this._getCategoryTitle(this.categoryListPromise, column);

        this._appendTextToCellNode();
        this.hasBeenClicked = false;
    }
    async _getCategoryTitle(categoryListPromise, column) {
        const categoryObjectList = await categoryListPromise;
        const categoryObject = categoryObjectList[column];
        return categoryObject.title;
    }
    async _selectQuestion(categoryObjectPromise, column) {
        const categoryObjectList = await categoryObjectPromise;
        const categoryObject = categoryObjectList[column];

        const possibleQuestionArray = categoryObject.clues.filter(clueObject => clueObject.value === this.dollarAmount && clueObject.question.length > 0 &&clueObject.answer.length > 0);

        const questionObject = possibleQuestionArray[Math.floor(Math.random() * possibleQuestionArray.length)];

        return questionObject;
    }
    async _appendTextToCellNode() {
        if (this.row > 0) {
            this.nodeReference.appendChild(document.createTextNode("$" + this.dollarAmount));
        } else {
            const categoryText = await this.categoryTitle;
            this.nodeReference.appendChild(document.createTextNode(categoryText));
        }
    }
    async handleClick() {
        if (this.hasBeenClicked || !this.isAQuestionCell) {
            return;
        } else {
            const questionObject = await this.questionObject;
            new QuestionCell(questionObject, this.row, this.column);
            this.nodeReference.innerHTML = "";
            this.hasBeenClicked = true;
        }
    }
}

class QuestionCell extends Cell {
    constructor(questionObject, row, column) {
        super({row, column, cellOptions: null});
        this.questionObject = questionObject;
        this._appendTextToQuestionNode(row, column);
        this.hasBeenClicked = false;
    }
    _appendTextToQuestionNode(row, column) {
        const questionNode = this.nodeReference;
        questionNode.style.setProperty('--top-multiplier', row);
        questionNode.style.setProperty('--left-multiplier', column);
        questionNode.classList.add('question-cell');
        questionNode.appendChild(document.createTextNode(this.questionObject.question));
        document.getElementsByClassName('grid')[0].appendChild(questionNode);
    }
    handleClick() {
        if (this.hasBeenClicked) {
            this.nodeReference.parentNode.removeChild(this.nodeReference);
        } else {
            this.nodeReference.innerText = this.questionObject.answer;
            this.hasBeenClicked = true;
        }
    }
}

class CategoryObjectsList {
    constructor(categoryList) {
        const categoryPromises = categoryList.map(id => fetch(`http://localhost:3000/api/category/${id}`).then(res => res.json()));
        this.list = Promise.all(categoryPromises).then(categoryObjects => categoryObjects);
    }
}

async function generateJeopardy(parentNode, categoryList, moneyIncrement) {
    const categoryObjectsList = await(new CategoryObjectsList(categoryList));
    const grid = new JeopardyGrid(parentNode, categoryObjectsList, moneyIncrement);
    return grid;
}