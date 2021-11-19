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
          if (!(this.findLowestBlankRow(j) < 0))
          {
            if (this.grid[this.findLowestBlankRow(j)][j] === connectFourConstants.BLANK && this.playersTurn)
            {
            this.buttons[this.findLowestBlankRow(j)][j].style.backgroundColor = 'red';
            this.grid[this.findLowestBlankRow(j)][j] = connectFourConstants.RED;
            // TODO check win conditions
            this.playersTurn = false;
            this.computerTurn();
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

  computerTurn = () =>
  {
    let randomColumn = Math.floor(Math.random() * connectFourConstants.NUM_COLS);

    while(this.findLowestBlankRow(randomColumn) < 0)
    {
      randomColumn = Math.floor(Math.random() * connectFourConstants.NUM_COLS);
    }

    this.buttons[this.findLowestBlankRow(randomColumn)][randomColumn].style.backgroundColor = 'black';
    this.grid[this.findLowestBlankRow(randomColumn)][randomColumn] = connectFourConstants.BLACK;
    // TODO check win conditions
    this.playersTurn = true;
  }

}

const connectFour = new ConnectFour();

