// html elements
const board = document.getElementById('board');
const scoreBoard = document.getElementById('scoreBoard');
const startButton = document.getElementById('start');
const gameOverSign = document.getElementById('gameOver');
const starWars = document.getElementById('datoStarWars')
const lista = document.querySelector(`#posts`)


// game settings
const boardSize = 10;
const gameSpeed = 100;
const squareTypes = {
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2
};
const directions = {
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowRight: 1,
    ArrowLeft: -1,
};

//  game variables
let snake;
let score = [];
let direction;
let boardSquares;
let emptySquares;
let moveInterval;

const drawSnake = () => {
    snake.forEach(square => drawSquare(square, 'snakeSquare'));
}



const drawSquare = (square, type) => {
    const [row, column] = square.split('');
    boardSquares[row][column] = squareTypes[type];
    const squareElement = document.getElementById(square);
    squareElement.setAttribute('class', `square ${type}`);

    if (type === 'emptySquare') {
        emptySquares.push(square);
    } else {
        if (emptySquares.indexOf(square) !== -1) {
            emptySquares.splice(emptySquares.indexOf(square), 1);
        }
    }
}

const moveSnake = () => {
    const newSquare = String(
        Number(snake[snake.length - 1]) + directions[direction])
        .padStart(2, '0');
    const [row, column] = newSquare.split('');


    if (newSquare < 0 ||
        newSquare > boardSize * boardSize ||
        (direction === 'ArrowRight' && column == 0) ||
        (direction === 'ArrowLeft' && column == 9 ||
            boardSquares[row][column] === squareTypes.snakeSquare)) {
        gameOver();
    } else {
        snake.push(newSquare);
        if (boardSquares[row][column] === squareTypes.foodSquare) {
            addFood();
        } else {
            const emptySquare = snake.shift();
            drawSquare(emptySquare, 'emptySquare');
        }
        drawSnake();
    }
}

const addFood = () => {
    score++;
    updateScore();
    createRandomFood();
}


const setDirection = newDirection => {
    direction = newDirection;
}

const directionEvent = key => {
    switch (key.code) {
        case 'ArrowUp':
            direction != 'ArrowDown' && setDirection(key.code)
            break;
        case 'ArrowDown':
            direction != 'ArrowUp' && setDirection(key.code)
            break;
        case 'ArrowLeft':
            direction != 'ArrowRight' && setDirection(key.code)
        case 'ArrowRight':
            direction != 'ArrowLeft' && setDirection(key.code)
            break;
    }
}

const createRandomFood = () => {
    const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    drawSquare(randomEmptySquare, 'foodSquare');
}

const updateScore = () => {
    scoreBoard.innerText = score;
}

const createBoard = () => {
    boardSquares.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => {
            const squareValue = `${rowIndex}${columnIndex}`;
            const squareElement = document.createElement('div');
            squareElement.setAttribute('class', 'square emptySquare');
            squareElement.setAttribute('id', squareValue);
            board.appendChild(squareElement);
            emptySquares.push(squareValue);
        })
    })
}

const setGame = () => {
    snake = ['00', '01', '02', '03'];
    score = 0;
    direction = 'ArrowRight';
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare));
    console.log(boardSquares);
    board.innerHTML = '';
    emptySquares = [];
    createBoard();
}



const startGame = () => {
    setGame();
    score = 0;
    startButton.disbled = true;
    drawSnake();
    updateScore();
    createRandomFood();
    document.addEventListener('keydown', directionEvent);
    moveInterval = setInterval(() => moveSnake(), gameSpeed);

}

const gameOver = () => {
    Swal.fire('Game Over')
    clearInterval(moveInterval);
    startButton.disabled = false;
}

startButton.addEventListener('click', startGame);

fetch('https://swapi.dev/api/planets/')
    .then((resp) => resp.json())
    .then((data) => {
        console.log(data)
        
        data.results.forEach((post) => {
            const li = document.createElement('li')
            li.innerHTML = `
                <h3>Nombre: ${post.name}</h3>
                <p>Periodo de rotacion: ${post.rotation_period} hs</p>
            `

            lista.append(li)
        })
    })
    .catch((error) => {
        console.log(error)
    })




// fetch("https://swapi.dev/api/planets/?page=2")
//     .then((resp) => resp.json())
//     .then((data) => {
//         console.log(data)
//     })
