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
  constructor()
  {
    this.grid = new Array(connectFourConstants.NUM_ROWS);
    this.initGrid();

    this.buttons = new Array(connectFourConstants.NUM_ROWS);
    this.initButtons();

    this.initListeners();

    this.playersTurn = true;
    this.gameOver = false;
    this.secondsRemaining = 10;

    this.turnTimer = window.setInterval(() => 
    {
      if (this.playersTurn)
      {
        document.querySelector('#game1-timer').innerText = parseInt(this.secondsRemaining);
      }
      else
      {
        document.querySelector('#game1-timer').innerText = 'Thinking...'
      }
      
      if (this.secondsRemaining <= 0.4)
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
    this.buttons[lowestBlankRow][column].style.backgroundColor = 'red';
    this.grid[lowestBlankRow][column] = connectFourConstants.RED;
    this.playersTurn = false;
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
  
      this.buttons[lowestBlankRow][randomColumn].style.backgroundColor = 'black';
      this.grid[lowestBlankRow][randomColumn] = connectFourConstants.BLACK;
      this.playersTurn = true;
      document.querySelector('#game1-turn').innerText = 'Player\'s Turn';
      document.querySelector('#game1-turn').style.color = 'red';
      this.checkWin(this.grid[lowestBlankRow][randomColumn]);
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
          winningSlots[i].style.backgroundColor = 'orange';
        }
        else
        {
          winningSlots[i].style.backgroundColor = 'darkgreen';
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

const connectFour = new ConnectFour();

