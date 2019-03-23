// this.turn
  // add .checkMove() to validate moves
    // this might allow for alg notation for moves
// this.board[1]
  // if k|K moves, remove kq|KQ
  // if r|R moves, ...
// this.board[2]
  // ?
// this.board[3] (HM clock)
  // before .movePiece()
  // if old sq has 'p' OR new sq has piece, then 0
  // else + 1
// this.board[4] (turn clock)
  // after .movePiece()
  // if this.board[0] === 'w', then it's 'b' now
  // else it's 'w' now, and +1 this.board[4]

const readline = require('readline');

function Game () {

  /*
    GAME STATE
  */

  this.player = 'white';
  this.inPlay = true;

  this.board = [
    ['w','KQkq','-','0','1'],
    // turn castles en-pesante halfmove-clock fullmove-number
      // HM clock: # of halfmoves since last capture or pawn advance
      // FM number: turn number (advance after black move)
    ['r','n','b','q','k','b','n','r'],
    ['p','p','p','p','p','p','p','p'],
    ['-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-'],
    ['-','-','-','-','-','-','-','-'],
    ['P','P','P','P','P','P','P','P'],
    ['R','N','B','Q','K','B','N','R']
    // key: this.board[num][String.fromCharCode(x+97)]
      // t -> b: 1-8
      // l -> r; a-h
  ];

  this.begin = () => {
    this.printBoard();
    this.turn();
  }

  /*
    ^ game state ^
      -----
    UTILITY FUNCTIONS
  */

  this.getFile = i => String.fromCharCode(i+97);

  this.letterToIndex = l => l.charCodeAt(0) - 97;

  // Aid for testing/dev
  this.printFileLabels = () => {
    let labels = 'a|b|c|d|e|f|g|h';
    return this.player === 'white'
      ? `\n        ${labels}\n`
      : `\n        ${labels.reverse()}\n`;
  }

  this.printRankNumber = r => `     ${r}  `;


  this.stringifyRank = rank => rank.reduce((a,c) => a + ' ' + c);

  this.sayTurn = turn =>
    turn === 'w'
      ? '\nTHE TURN IS: white\n'
      : '\nTHE TURN IS: BLACK\n';

  this.printBoard = () => {
    // Determine orientation of board
    const white = this.player === 'white';
    let r = white ? 9 : 0;
    const dir = white ? -1 : 1;

    // Print board and labels
    for (;; r += dir) {
      if (r < 0 || r > 9) break;
      if (r === 0 || r === 9) {
        const labels = this.printFileLabels();
        console.log(labels);
      } else {
        let rank = this.printRankNumber(r);
        rank += this.stringifyRank(game.board[r]);
        console.log(rank);

      }
    }
  }

  /*
    ^ utility functions ^
      -----
    TURN LOGIC
  */

  this.turn = async () => {
    while (game.inPlay) {
      let move = await this.awaitMove("WHAT'S YOUR MOVE?\n(e.g. \"e2 e4\")\n");
      move = this.parseMove(move.toLowerCase());
      console.log(move);
      // move = this.checkMove(move);
        //
      this.movePiece(move);
      this.printBoard();
    }
  }

  this.awaitMove = query => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise(resolve => {
      rl.question(query, ans => {
        rl.close();
        resolve(ans);
      });
    });
  }

  this.parseMove = string =>
    string.split('')
      .reverse()
      .map(char => {
        if (char === ' ') return '';
        else if (isNaN(char)) return this.letterToIndex(char);
        else return char;
      })
      .join('');

  this.movePiece = mv => {
    // move format: 4 num, xN|yN|xS|yS
      // e.g. "5746" -> game.board[5][7] = game.board[4][6]
    game.board[mv[0]][mv[1]] = game.board[mv[2]][mv[3]];
    game.board[mv[2]][mv[3]] = '-';
  }

  /*
    ^ turn logic ^
      -----
    GAMEPIECE LOGIC
  */

  this.pawn = {};

}

const game = new Game();
game.begin();

module.exports.Game = Game;
