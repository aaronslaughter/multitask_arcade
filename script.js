let sounds =
{
  click: document.getElementById('audio_click'),
  ding: document.getElementById('audio_ding'),
  buzzer: document.getElementById('audio_buzzer')
}
sounds.buzzer.volume = 0.2;

///////// CONNECT 4 //////////////////////////////////////

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
    sounds.click.play();
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

      let smartColumn = this.chooseSmartColumn()

      // let randomColumn = Math.floor(Math.random() * connectFourConstants.NUM_COLS);

      // while(this.findLowestBlankRow(randomColumn) < 0)
      // {
      //   randomColumn = Math.floor(Math.random() * connectFourConstants.NUM_COLS);
      // }
  
      let lowestBlankRow = this.findLowestBlankRow(smartColumn);
      sounds.click.play();
      let animatePos = 0;
      let animateDrop = window.setInterval(() =>
      {
        if (lowestBlankRow > animatePos)
        {
          this.buttons[animatePos][smartColumn].style.backgroundColor = 'black';

          if (animatePos > 0)
          {
            this.buttons[animatePos - 1][smartColumn].style.backgroundColor = '';
          }
          animatePos++;
        }
        else
        {
          window.clearInterval(animateDrop);

          if (animatePos > 0)
          {
            this.buttons[animatePos - 1][smartColumn].style.backgroundColor = '';
          }

          this.buttons[lowestBlankRow][smartColumn].style.backgroundColor = 'black';
          this.grid[lowestBlankRow][smartColumn] = connectFourConstants.BLACK;
          this.playersTurn = true;
          document.querySelector('#game1-turn').innerText = 'Player\'s Turn';
          document.querySelector('#game1-turn').style.color = 'red';
          this.checkWin(this.grid[lowestBlankRow][smartColumn]);

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
          this.resetGame([this.buttons[i][j], this.buttons[i+1][j], this.buttons[i+2][j], this.buttons[i+3][j]]);

          if (potentialWinner === connectFourConstants.RED)
          {
            sounds.ding.pause();
            sounds.ding.currentTime = 0;
            sounds.ding.play();
            score += 10;
          }
          else
          {
            sounds.buzzer.pause();
            sounds.buzzer.currentTime = 0;
            sounds.buzzer.play();
            score -= 10;
          }

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
          this.resetGame([this.buttons[i][j], this.buttons[i][j+1], this.buttons[i][j+2], this.buttons[i][j+3]]);

          if (potentialWinner === connectFourConstants.RED)
          {
            sounds.ding.pause();
            sounds.ding.currentTime = 0;
            sounds.ding.play();
            score += 10;
          }
          else
          {
            sounds.buzzer.pause();
            sounds.buzzer.currentTime = 0;
            sounds.buzzer.play();
            score -= 10;
          }
          
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
          this.resetGame([this.buttons[i][j], this.buttons[i+1][j+1], this.buttons[i+2][j+2], this.buttons[i+3][j+3]]);

          if (potentialWinner === connectFourConstants.RED)
          {
            sounds.ding.pause();
            sounds.ding.currentTime = 0;
            sounds.ding.play();
            score += 10;
          }
          else
          {
            sounds.buzzer.pause();
            sounds.buzzer.currentTime = 0;
            sounds.buzzer.play();
            score -= 10;
          }

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
          this.resetGame([this.buttons[i][j], this.buttons[i-1][j+1], this.buttons[i-2][j+2], this.buttons[i-3][j+3]]);

          if (potentialWinner === connectFourConstants.RED)
          {
            sounds.ding.pause();
            sounds.ding.currentTime = 0;
            sounds.ding.play();
            score += 10;
          }
          else
          {
            sounds.buzzer.pause();
            sounds.buzzer.currentTime = 0;
            sounds.buzzer.play();
            score -= 10;
          }

          return true;
        }
      }
    }

    return false;
  }

  // used by the AI to look for good spots
  checkWinLogic = (grid, potentialWinner) =>
  {
    // checks the verticals
    for (let i = 0; i < connectFourConstants.NUM_ROWS-3; i++)
    {
      for (let j = 0; j < connectFourConstants.NUM_COLS; j++)
      {
        if (grid[i][j] === potentialWinner &&
        grid[i+1][j] === potentialWinner &&
        grid[i+2][j] === potentialWinner &&
        grid[i+3][j] === potentialWinner)
        {
          return true;
        }
      }
    }

    // checks the horizontals
    for (let i = 0; i < connectFourConstants.NUM_ROWS; i++)
    {
      for (let j = 0; j < connectFourConstants.NUM_COLS-3; j++)
      {
        if (grid[i][j] === potentialWinner &&
        grid[i][j + 1] === potentialWinner &&
        grid[i][j + 2] === potentialWinner &&
        grid[i][j + 3] === potentialWinner)
        {
          return true;
        }
      }
    }

    // checks the ascending diagonals, 'ascending' from the perspective of the origin in the top left
    for (let i = 0; i < connectFourConstants.NUM_ROWS-3; i++)
    {
      for (let j = 0; j < connectFourConstants.NUM_COLS-3; j++)
      {
        if (grid[i][j] === potentialWinner &&
        grid[i + 1][j + 1] === potentialWinner &&
        grid[i + 2][j + 2] === potentialWinner &&
        grid[i + 3][j + 3] === potentialWinner)
        {
          return true;
        }
      }
    }

    // checked the descending diagonals, 'descending' from the perspective of the origin in the top left
    for (let i = 3; i < connectFourConstants.NUM_ROWS; i++)
    {
      for (let j = 0; j < connectFourConstants.NUM_COLS-3; j++)
      {
        if (grid[i][j] === potentialWinner &&
        grid[i - 1][j + 1] === potentialWinner &&
        grid[i - 2][j + 2] === potentialWinner &&
        grid[i - 3][j + 3] === potentialWinner)
        {
          return true;
        }
      }
    }

    return false;
  }

  resetGame = (winningSlots) =>
  {

    this.gameOver = true;
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

  // AI Goals:
  // 1. Complete 4 in a row
  // 2. Block the players 4 in a row
  // 3. Otherwise choose a random column
  chooseSmartColumn()
  {

    // duplicate the existing grid
    let tempGrid = new Array();
    for (let i = 0; i < connectFourConstants.NUM_ROWS; i++)
    {
      tempGrid[i] = new Array(connectFourConstants.NUM_COLS);
      for (let j = 0; j < connectFourConstants.NUM_COLS; j++)
      {
        tempGrid[i][j] = this.grid[i][j];
      }
    }


    // for each column, add a computer piece to the column and see if it's a winner
    for (let i = 0; i < connectFourConstants.NUM_COLS; i++)
    {
      let lowestBlankRow = this.findLowestBlankRow(i);

      if (lowestBlankRow >= 0)
      {
        tempGrid[lowestBlankRow][i] = connectFourConstants.BLACK;

        if (this.checkWinLogic(tempGrid, connectFourConstants.BLACK))
        {
          return i;
        }
        else
        {
          tempGrid[lowestBlankRow][i] = connectFourConstants.BLANK;
        }
      }
    }

    // for each column, add a player piece to the column and see if it's a winner
    for (let i = 0; i < connectFourConstants.NUM_COLS; i++)
    {
      let lowestBlankRow = this.findLowestBlankRow(i);
      if (lowestBlankRow >= 0)
      {
        tempGrid[lowestBlankRow][i] = connectFourConstants.RED;

        if (this.checkWinLogic(tempGrid, connectFourConstants.RED))
        {
          return i;
        }
        else
        {
          tempGrid[lowestBlankRow][i] = connectFourConstants.BLANK;
        }
      }
    }

    // no good column found so just pick a random one
    let randomColumn = Math.floor(Math.random() * connectFourConstants.NUM_COLS);

    while(this.findLowestBlankRow(randomColumn) < 0)
    {
      randomColumn = Math.floor(Math.random() * connectFourConstants.NUM_COLS);
    }

    return randomColumn;
  }
}

//////////////////////////////////////////////////////////

///////// MATH CLASS /////////////////////////////////////

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
  turnTimer;
  secondsRemaining = 10;

  constructor()
  {
    this.initButtons();
    this.initListeners();
    this.initEquation();
    this.createEquation();
    this.displayEquation();

    this.turnTimer = window.setInterval(() => 
    {
      if (!this.roundOver)
      {
        document.querySelector('#game2footer').innerText = Math.ceil(this.secondsRemaining);
      }
      else
      {
        document.querySelector('#game2footer').innerText = 'Calculating...';
      }
      
      if (this.secondsRemaining <= 0.0)
      {
        this.roundOver = true;
        this.secondsRemaining = 10;
        sounds.buzzer.pause();
        sounds.buzzer.currentTime = 0;
        sounds.buzzer.play();
        score--;
        this.correctButton.style.backgroundColor = 'green';
        
        window.setTimeout( () =>
        {
          this.resetBoard();
        }, 2000)
      }
      else if (this.secondsRemaining < 5)
      {
        document.querySelector('#game2footer').style.color = 'red';
      }
      else
      {
        document.querySelector('#game2footer').style.color = 'rgb(224, 219, 209)';
      }

      if (!this.roundOver)
      {
        this.secondsRemaining -= 0.1;
      }
    }, 100)
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

        if (this.buttons[i] === this.correctButton && !this.roundOver)
        {
          this.roundOver = true;
          this.buttons[i].style.backgroundColor = 'green';
          this.secondsRemaining = 10;
          sounds.ding.pause();
          sounds.ding.currentTime = 0;
          sounds.ding.play();
          score++;
          window.setTimeout( () => {this.resetBoard()}, 2000);
        }
        else if (this.buttons[i] != this.correctButton && !this.roundOver)
        {
          this.roundOver = true;
          this.buttons[i].style.backgroundColor = 'red';
          this.correctButton.style.backgroundColor = 'green';
          this.secondsRemaining = 10;
          sounds.buzzer.pause();
          sounds.buzzer.currentTime = 0;
          sounds.buzzer.play();
          score--;
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

    if (this.currentOperator === '+')
    {
      this.wrongAnswers.push(this.parameter1 + (this.parameter2 * -1));
      this.wrongAnswers.push((this.parameter1 * -1) + this.parameter2); 
      this.wrongAnswers.push((this.parameter1 * -1) + (this.parameter2 * -1));
    }
    else if (this.currentOperator === '-')
    {
      this.wrongAnswers.push(this.parameter1 - (this.parameter2 * -1));
      this.wrongAnswers.push((this.parameter1 * -1) - this.parameter2);
      this.wrongAnswers.push((this.parameter1 * -1) - (this.parameter2 * -1)); 
    }

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

    if (this.range < 20)
    {
      this.range ++;
    }
    
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

let score = 0;
let scoreRefresh = window.setInterval( () =>
{
  document.querySelector('score').innerText = "Score: " + score;
}, 100)


const connectFour = new ConnectFour();
const mathClass = new MathClass();

