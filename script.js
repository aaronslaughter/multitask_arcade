///////// CONNECT 4 ////////////

const connectFourConstants =
{
  BLANK: 0,
  RED: 1,
  BLACK: 2,
  NUM_ROWS: 6,
  NUM_COLS: 7
}
Object.freeze(connectFourConstants);

class ConnectFour
{
  grid = new Array(connectFourConstants.NUM_ROWS);
  buttons = new Array(connectFourConstants.NUM_ROWS);
  playersTurn = true;
  gameOver = false;
  secondsRemaining = 10;

  constructor()
  {    
    this.initGrid();  
    this.initButtons();
    this.initListeners();

    this.turnTimer = window.setInterval(() => 
    {
      if (this.playersTurn)
      {
        document.querySelector('#game1-timer').innerText = Math.ceil(this.secondsRemaining);
      }
      else
      {
        document.querySelector('#game1-timer').innerText = 'Thinking...'
      }
      
      if (this.secondsRemaining <= 0.0)
      {
        this.playersTurn = false;
        this.secondsRemaining = 10;
        document.querySelector('#game1-turn').innerText = 'Computer\'s Turn';
        document.querySelector('#game1-turn').style.color = 'black';
        
        window.setTimeout( () =>
        {
          this.computerTurn();
        }, 2000)
      }
      else if (this.secondsRemaining < 5)
      {
        document.querySelector('#game1-timer').style.color = 'red';
      }
      else
      {
        document.querySelector('#game1-timer').style.color = 'black';
      }

      if (this.playersTurn)
      {
        this.secondsRemaining -= 0.1;
      }
    }, 100)
  }

  initGrid = () =>
  {
    for (let i = 0; i < connectFourConstants.NUM_ROWS; i++)
    {
      this.grid[i] = new Array(connectFourConstants.NUM_COLS);
      for (let j = 0; j < connectFourConstants.NUM_COLS; j++)
      {
        this.grid[i][j] = connectFourConstants.BLANK;
      }
    }
  }

  initButtons = () =>
  {
    for (let i = 0; i < connectFourConstants.NUM_ROWS; i++)
    {
      this.buttons[i] = new Array(connectFourConstants.NUM_COLS);
      for (let j = 0; j < connectFourConstants.NUM_COLS; j++)
      {
        // In order to allow for the .top-row:hover CSS to work,
        // the top row of slots needed to be last in the container.
        // Thus the "last" row of buttons need to be the first in the buttons array
        if (i === 0)
        {
          this.buttons[i][j] = document.querySelectorAll('.slot')[((connectFourConstants.NUM_ROWS-1)*connectFourConstants.NUM_COLS) + j];
        }
        else
        {
          this.buttons[i][j] = document.querySelectorAll('.slot')[((i-1)*connectFourConstants.NUM_COLS) + j];
        }
      }
    }
  }

  initListeners = () =>
  {
    for (let i = 0; i < connectFourConstants.NUM_ROWS; i++)
    {
      for (let j = 0; j < connectFourConstants.NUM_COLS; j++)
      {
        this.buttons[i][j].addEventListener('click', () =>
        {
          
          let lowestBlankRow = this.findLowestBlankRow(j);
          if (!(lowestBlankRow < 0) && !this.gameOver)
          {
            if (this.playersTurn)
            {
              this.playerTurn(lowestBlankRow, j)
            }
          }
        })
      }
    }
  }

  findLowestBlankRow = (column) =>
  {
    let lowestOpenRow = -1;

    for (let i = 0; i < connectFourConstants.NUM_ROWS; i++)
    {
      if (this.grid[i][column] === connectFourConstants.BLANK)
      {
        lowestOpenRow++;
      }
    }

    return lowestOpenRow;
  }

  playerTurn = (lowestBlankRow, column) =>
  {
    // stop the turn timer here
    this.playersTurn = false;
    // animate the token dropping
    let animatePos = 0;
    let animateDrop = window.setInterval(() =>
    {
      if (lowestBlankRow > animatePos)
      {
        this.buttons[animatePos][column].style.backgroundColor = 'red';

        if (animatePos > 0)
        {
          this.buttons[animatePos - 1][column].style.backgroundColor = '';
        }
        animatePos++;
      }
      else
      {
        window.clearInterval(animateDrop);

        if (animatePos > 0)
        {
          this.buttons[animatePos - 1][column].style.backgroundColor = '';
        }

        // token actually gets placed
        this.buttons[lowestBlankRow][column].style.backgroundColor = 'red';
        this.grid[lowestBlankRow][column] = connectFourConstants.RED;
        
        this.secondsRemaining = 10;
        document.querySelector('#game1-turn').innerText = 'Computer\'s Turn';
        document.querySelector('#game1-turn').style.color = 'black';
        
        // checkWin will flip the gameOver boolean if a win is found.
        this.checkWin(this.grid[lowestBlankRow][column])
        
        window.setTimeout( () =>
        {
          this.computerTurn();
        }, 2000)
      }
    }, 75)
  }

  computerTurn = () =>
  {
    if (!this.gameOver)
    {
      let randomColumn = Math.floor(Math.random() * connectFourConstants.NUM_COLS);

      while(this.findLowestBlankRow(randomColumn) < 0)
      {
        randomColumn = Math.floor(Math.random() * connectFourConstants.NUM_COLS);
      }
  
      let lowestBlankRow = this.findLowestBlankRow(randomColumn);
      let animatePos = 0;
      let animateDrop = window.setInterval(() =>
      {
        if (lowestBlankRow > animatePos)
        {
          this.buttons[animatePos][randomColumn].style.backgroundColor = 'black';

          if (animatePos > 0)
          {
            this.buttons[animatePos - 1][randomColumn].style.backgroundColor = '';
          }
          animatePos++;
        }
        else
        {
          window.clearInterval(animateDrop);

          if (animatePos > 0)
          {
            this.buttons[animatePos - 1][randomColumn].style.backgroundColor = '';
          }

          this.buttons[lowestBlankRow][randomColumn].style.backgroundColor = 'black';
          this.grid[lowestBlankRow][randomColumn] = connectFourConstants.BLACK;
          this.playersTurn = true;
          document.querySelector('#game1-turn').innerText = 'Player\'s Turn';
          document.querySelector('#game1-turn').style.color = 'red';
          this.checkWin(this.grid[lowestBlankRow][randomColumn]);

        }
      }, 75)
    }
  }

  checkWin = (potentialWinner) =>
  {
    // checks the verticals
    for (let i = 0; i < connectFourConstants.NUM_ROWS-3; i++)
    {
      for (let j = 0; j < connectFourConstants.NUM_COLS; j++)
      {
        if (this.grid[i][j] === potentialWinner &&
        this.grid[i+1][j] === potentialWinner &&
        this.grid[i+2][j] === potentialWinner &&
        this.grid[i+3][j] === potentialWinner)
        {
          this.gameOver = true;
          this.resetGame([this.buttons[i][j], this.buttons[i+1][j], this.buttons[i+2][j], this.buttons[i+3][j]]);
          return true;
        }
      }
    }

    // checks the horizontals
    for (let i = 0; i < connectFourConstants.NUM_ROWS; i++)
    {
      for (let j = 0; j < connectFourConstants.NUM_COLS-3; j++)
      {
        if (this.grid[i][j] === potentialWinner &&
        this.grid[i][j + 1] === potentialWinner &&
        this.grid[i][j + 2] === potentialWinner &&
        this.grid[i][j + 3] === potentialWinner)
        {
          this.gameOver = true;
          this.resetGame([this.buttons[i][j], this.buttons[i][j+1], this.buttons[i][j+2], this.buttons[i][j+3]]);
          return true;
        }
      }
    }

    // checks the ascending diagonals, 'ascending' from the perspective of the origin in the top left
    for (let i = 0; i < connectFourConstants.NUM_ROWS-3; i++)
    {
      for (let j = 0; j < connectFourConstants.NUM_COLS-3; j++)
      {
        if (this.grid[i][j] === potentialWinner &&
        this.grid[i + 1][j + 1] === potentialWinner &&
        this.grid[i + 2][j + 2] === potentialWinner &&
        this.grid[i + 3][j + 3] === potentialWinner)
        {
          this.gameOver = true;
          this.resetGame([this.buttons[i][j], this.buttons[i+1][j+1], this.buttons[i+2][j+2], this.buttons[i+3][j+3]]);
          return true;
        }
      }
    }

    // checked the descending diagonals, 'descending' from the perspective of the origin in the top left
    for (let i = 3; i < connectFourConstants.NUM_ROWS; i++)
    {
      for (let j = 0; j < connectFourConstants.NUM_COLS-3; j++)
      {
        if (this.grid[i][j] === potentialWinner &&
        this.grid[i - 1][j + 1] === potentialWinner &&
        this.grid[i - 2][j + 2] === potentialWinner &&
        this.grid[i - 3][j + 3] === potentialWinner)
        {
          this.gameOver = true;
          this.resetGame([this.buttons[i][j], this.buttons[i-1][j+1], this.buttons[i-2][j+2], this.buttons[i-3][j+3]]);
          return true;
        }
      }
    }

    return false;
  }

  resetGame = (winningSlots) =>
  {
    for (let i = 0; i < 4; i++)
    {
      window.setTimeout(() =>
      {
        if (!this.playersTurn)
        {
          winningSlots[i].style.backgroundColor = 'green';
        }
        else
        {
          winningSlots[i].style.backgroundColor = 'green';
        }
      }, 500 * i)
      
    }

    window.setTimeout(() => 
    {
      for (let i = 0; i < connectFourConstants.NUM_ROWS; i++)
      {
        for (let j = 0; j < connectFourConstants.NUM_COLS; j++)
        {
          this.grid[i][j] = connectFourConstants.BLANK;
          this.buttons[i][j].style.backgroundColor = '';
        }
      }

      this.gameOver = false;
      this.playersTurn = true;
      this.secondsRemaining = 10;
      document.querySelector('#game1-turn').innerText = 'Player\'s Turn';
      document.querySelector('#game1-turn').style.color = 'red';
    }, 4000)
  }
}

/////////////////////////////////

///////// MATH CLASS ////////////

class MathClass {
  parameter1;
  parameter2;
  operators = ['+', '-'];
  currentOperator;
  correctAnswer;
  correctButton;
  wrongAnswers = new Array();
  buttons = new Array();
  range = 10;
  equation = new Array();
  roundOver = true;

  constructor()
  {
    this.initButtons();
    this.initListeners();
    this.initEquation();
    this.createEquation();
    this.displayEquation();
  }

  initButtons()
  {
    for (let i = 0; i < document.querySelectorAll('.answer-button').length; i++)
    {
      this.buttons.push(document.querySelectorAll('.answer-button')[i]);
    }
  }

  initListeners()
  {
    for (let i = 0; i < this.buttons.length; i++)
    {
      this.buttons[i].addEventListener('click', () =>
      {
        // TODO
        // check answer is correct
        // award points, etc.

        if (this.buttons[i] === this.correctButton && !this.roundOver)
        {
          this.roundOver = true;
          this.buttons[i].style.backgroundColor = 'green';
          window.setTimeout( () => {this.resetBoard()}, 2000);
        }
        else if (this.buttons[i] != this.correctButton && !this.roundOver)
        {
          this.roundOver = true;
          this.buttons[i].style.backgroundColor = 'red';
          this.correctButton.style.backgroundColor = 'green';
          window.setTimeout( () => {this.resetBoard()}, 2000);
          
        }
      })
    }
  }

  initEquation()
  {
    for (let i = 0; i < 5; i++)
    {
      this.equation.push(document.querySelectorAll('.equation')[i]);
    }
  }

  createEquation()
  {
    this.parameter1 = Math.floor((Math.random() * (this.range * 2)) - this.range);
    if (this.parameter1 === 0)
    {
      this.parameter1++;
    }

    this.parameter2 = Math.floor((Math.random() * (this.range * 2)) - this.range);
    if (this.parameter2 === 0)
    {
      this.parameter2++;
    }

    if (this.parameter1 === this.parameter2 || Math.abs(this.parameter1) === (Math.abs(this.parameter2)))
    {
      this.parameter2++;
    }

    this.currentOperator = this.operators[Math.floor(Math.random() * 2)]

    if (this.currentOperator === '+')
    {
      this.correctAnswer = this.parameter1 + this.parameter2;
    }
    else if (this.currentOperator === '-')
    {
      this.correctAnswer = this.parameter1 - this.parameter2;
    }

    if (this.currentOperator === '+') // -2
    {
      this.wrongAnswers.push(this.parameter1 + (this.parameter2 * -1)); // 16
      this.wrongAnswers.push((this.parameter1 * -1) + this.parameter2); // 
      this.wrongAnswers.push((this.parameter1 * -1) + (this.parameter2 * -1));
    }
    else if (this.currentOperator === '-')
    {
      this.wrongAnswers.push(this.parameter1 - (this.parameter2 * -1)); // -1
      this.wrongAnswers.push((this.parameter1 * -1) - this.parameter2); // 1
      this.wrongAnswers.push((this.parameter1 * -1) - (this.parameter2 * -1)); 
    }

    console.log(this.wrongAnswers);
  }

  displayEquation()
  {
    window.setTimeout( () => {this.equation[0].innerText = this.parameter1}, 500);
    window.setTimeout( () => {this.equation[1].innerText = this.currentOperator}, 1500);
    window.setTimeout( () => {this.equation[2].innerText = this.parameter2}, 2500);
    window.setTimeout( () => {this.displayAnswers()}, 3500);
  }

  displayAnswers()
  {
    let usedWrongAnswerIndexes = [];
    let answerIndex = Math.floor(Math.random() * 4);

    this.buttons[answerIndex].innerText = this.correctAnswer;
    this.correctButton = this.buttons[answerIndex];

    for (let i = 0; i < 4; i++)
    {
      if (i != answerIndex)
      {
        let randomIndex = Math.floor(Math.random() * 3);
        
        while (usedWrongAnswerIndexes.includes(randomIndex))
        {
          randomIndex = Math.floor(Math.random() * 3);
        }

        this.buttons[i].innerText = this.wrongAnswers[randomIndex];
        usedWrongAnswerIndexes.push(randomIndex);
      }
    }

    this.range ++;
    this.roundOver = false;
    
  }

  resetBoard()
  {
    this.equation[0].innerText = '';
    this.equation[1].innerText = '';
    this.equation[2].innerText = '';

    this.wrongAnswers = [];

    for (let i = 0; i < this.buttons.length; i++)
    {
      this.buttons[i].innerText = '';
      this.buttons[i].style.backgroundColor = '';
    }

    this.createEquation();
    this.displayEquation();
    
  }
}

const connectFour = new ConnectFour();
const mathClass = new MathClass();

