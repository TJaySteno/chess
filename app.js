'use strict'

const readline = require('readline');

function Game() {

  /*
    GAME STATE
  */

  this.state = {
    pov: false,
    inPlay: true,
    turn: true,
    castles: 'KQkq',
    enPessant: null,
    enPesSwitch: false,
    hmCounter: '0',
    turnNum: '1',
  };

  this.removeCastleOption = side => this.state.castles.split(side).join('');

  this.board = [
    null,
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
  ];

  this.init = async () => {
    while (!this.state.pov) {
      console.log('THIS.INIT()');
      const side = await this.awaitMove('  Which side would you like to play,'
                                    + '\n          white or black?');
      if (/^wh?i?t?e?$/.test(side.toLowerCase())) {
        this.print('  You have chosen white');
        this.state.pov = 'w';
      } else if (/^bl?a?c?k?$/.test(side.toLowerCase())) {
        this.print('  You have chosen black');
        this.state.pov = 'b';
      } else {
        this.print('  Sorry, I didn\'t get that');
      }
    }
    this.printBoard();
  }

  /*
    ^ game state ^
      -----
    DISPLAY FUNCTIONS
  */

  // Convert values to printable strings
  this.printRankNumber = rank => `   ${rank}   `;
  this.stringifyRank = array => array.reduce((a,c) => a + ' ' + c);
  this.reverseStr = str => str.split('').reverse().join('');

  this.printFileLabels = () => {
    let labels = '   *   a|b|c|d|e|f|g|h   *   ';
    return this.state.pov === 'w'
      ? `\n${labels}\n`
      : `\n${this.reverseStr(labels)}\n`;
  }

  this.getTurnText = () =>
    this.state.turn
      ? '  WHITE (lowercase) TO MOVE'
      : '  BLACK (UPPERCASE) TO MOVE';

  this.printBoard = () => {
    // Determine orientation of board
    const pov = this.state.pov === 'w'
      ? { rank: 9, dir: -1 }
      : { rank: 0, dir:  1 };

    // Print board and labels
    for (;; pov.rank += pov.dir) {
      if (pov.rank < 0 || pov.rank > 9) break;
      if (pov.rank === 0 || pov.rank === 9) {
        this.print(this.printFileLabels());
      } else {
        let rank = this.printRankNumber(pov.rank);
        rank += this.stringifyRank(this.board[pov.rank]);
        rank += this.printRankNumber(pov.rank);
        this.print(rank);
      }
    }

    this.print(this.getTurnText());
    this.turn();
  }

  this.help = () => {
    this.print('\n     Help is on it\'s way!', '\n       .....later.....');
  }

  /* Stand in for the real output! :) */
  this.print = msg => console.log(msg);

  /*
    ^ display functions ^
      -----
    UTILITY FUNCTIONS
  */

  this.getFileIndex = file => file.charCodeAt(0) - 97;
  this.direction = d => (this.state.turn ? 1 : -1) * (d || 1);
  this.down = (r,d) => r - this.direction(d);

  this.checkForPiece = (rank, file, piece) => this.board[rank][file] === piece;

  this.reject = msg => {
    this.print('\n', msg, '\n');
    return false;
  }

  /*
    ^ utility functions ^
      -----
    TURN LOGIC
  */

  this.awaitMove = query => {
    console.log('THIS.AWAITMOVE()');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const msg = '\n' + (query || '') + '\n';

    return new Promise(resolve => {
      rl.question(msg, ans => {
        rl.close();
        resolve(ans);
      });
    });
  }

  // Loop through turns until inPlay state is false
  this.turn = async () => {
    while (this.state.inPlay) {
      try {
        console.log('THIS.TURN()');
        const move = await this.awaitMove();

        // Evaluate input for valid patterns
        if (move === '') continue;
        if (/(help)|^\?$/.test(move)) {
          this.help();
          continue;
        }
        const valid = this.validateMove(move.toLowerCase());

        if (!valid) this.print('\n   ERR: MAKE A VALID MOVE\n    Type "help" for aid');
        else {
          // Check board state to see if the move is legal
          const moved = this.interpretNotation(move);
          if (moved) this.printBoard();
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  // Update state of active player, half moves, and turn number
  this.advanceTurn = (def, atk) => {
    console.log('THIS.ADVANCETURN()');

    // Alternate turn and increment turn number
    if (!this.state.turn) this.state.turnNum++;
    this.state.turn = !this.state.turn;

    // Halfmove counter
    const resetHalfMoves = def !== '-' || atk === 'p';
    resetHalfMoves ? this.state.hmCounter = 0 : this.state.hmCounter++;
    // console.log('en pessant', this.state.enPessant, this.state.enPesSwitch);

    // En pessant reset
    if (this.state.enPesSwitch) this.state.enPesSwitch = false;
    else this.state.enPessant = null;
    // console.log('en pessant', this.state.enPessant, this.state.enPesSwitch);
  }

  /*
    ^ turn logic ^
      -----
    PARSE NOTATION
  */

  this.validateMove = move => /^([rnbqk]?[a-z]?[1-8]?x?[a-h][1-8]=?[rnbqk]?)$|^o-o-?o?$/.test(move);

  // Return indeces in the form of a string
    // a1 -> 01
  this.getSqFromNotation = mv => {
    console.log('THIS.GETSQFROMNOTATION()');
    let sq = /[a-h][1-8]$/.exec(mv)[0];
    return this.getFileIndex(sq[0]) + sq[1];
  }

  // Return everything before the new square and removes the trailing x
  this.getPrefaceFromNotation = mv => mv.split(/[a-h][1-8]$/)[0].split('x')[0];

  // Return an array of the piece and disambiguation characters
    // BUG: bxc4 will mess up Bxc4
  this.parsePreface = (pre, orig) => {
    console.log('THIS.PARSEPREFACE');
    if (/^[a-h]$/.test(pre) && orig[0] !== 'B') return ['p', pre];
    if (/^[nbrqk][a-h]?[1-8]?$/.test(pre)) return pre.split('');
  }

  // Interpret notation syntax
  this.interpretNotation = move => {
    console.log('THIS.INTERPRETNOTATION()');
    const mv = move.toLowerCase();

    // Castles
    if (/^o-o-?o?$/.test(mv)) return this.castles(mv);

    const sq = this.getSqFromNotation(mv);

    // Pawn advancement
    if (mv.length === 2) return this['p'](sq);

    // Everything else
    const preface = this.getPrefaceFromNotation(mv);
    const pieceInfo = this.parsePreface(preface, move);
    return this[pieceInfo[0]](sq, pieceInfo);
  }

  /*
    ^ parse notation ^
      -----
    MOVE LOGIC
  */

  // Update this.board values and advance turn
  this.movePiece = (rNew,fNew,rOld,fOld) => {
    console.log('THIS.MOVEPIECE()');
    const defender = this.board[rNew][fNew];
    const attacker = this.board[rOld][fOld];

    this.board[rNew][fNew] = attacker;
    this.board[rOld][fOld] = '-';
    this.advanceTurn(defender, attacker);
    return true;
  }

  // Pawn attacks
  this.pawnAttack = (sq,from) => {
    console.log('THIS.PAWNATTACK');
    const p = this.state.turn
      ? { piece: 'p', enemy: /[PNBRQ]/ }
      : { piece: 'P', enemy: /[pnbrq]/ };

    const file = Number(sq[0]);
    const rank = Number(sq[1]);
    const file2 = this.getFileIndex(from[1]);

    if (Math.abs(file - file2) !== 1) return this.reject('ERR: Pawns must attack diagonally');

    const myPiecePresent = this.checkForPiece(this.down(rank), file2, p.piece);

    // console.log(myPiecePresent, this.state.enPessant, this.state.enPessant === sq);
    // En pessant
    if (myPiecePresent && this.state.enPessant === sq) {
      this.board[this.down(rank)][file] = '-';
      return String(this.down(rank)) + file2;
    }

    if (!myPiecePresent || !p.enemy.test(this.board[rank][file])) {
      return this.reject('ERR: Pieces not in position for pawn attack'); }

    return String(this.down(rank)) + file2;
  }

  // Pawn advancement
  this.pawnAdvance = sq => {
    console.log('THIS.PAWNADVANCE()');
    const p = this.state.turn
      ? { piece: 'p', dblMv: 4 }
      : { piece: 'P', dblMv: 5 };

    const file = Number(sq[0]);
    const rank = Number(sq[1]);

    const piecePresent = this.checkForPiece(this.down(rank), file, p.piece);
    if (piecePresent) return String(this.down(rank)) + file;

    const squareNotFilled = this.checkForPiece(rank, file, '-');
    console.log(squareNotFilled);
    // if !squareNotFilled, throw a fit. I mean error.

    const dblMvAvail = rank === p.dblMv &&
      this.checkForPiece(this.down(rank, 2), file, p.piece);
    if (dblMvAvail) {
      // console.log(file, this.down(rank));
      this.state.enPessant = `${file}${this.down(rank)}`;
      this.state.enPessant = true;
      return String(this.down(rank,2)) + file;
    }
  }

  // Find all knights capable of moving to a given square
  this.knightMoves = (rank,file,piece) => {
    console.log('THIS.KNIGHTMOVES()');
    const knights = [];

    // Up 2
    for (let i = -2; i < 3; i += 4) {
      // Over 1
      for (let j = -1; j < 2; j += 2) {

        // Rank must be in range or an error is thrown
        const definedUD = rank + i >= 1 && rank + i <= 8;
        if (definedUD) {
          const presentUD = this.checkForPiece(rank + i, file + j, piece);
          if (presentUD) knights.push(`${rank + i}${file + j}`);
        }

        const definedLR = rank + j >= 1 && rank + j <= 8;
        if (definedLR) {
          const presentLR = this.checkForPiece(rank + j, file + i, piece);
          if (presentLR) knights.push(`${rank + j}${file + i}`);
        }
      }
    }

    return knights;
  }

  // Find all of a given piece capable of moving to a given square diagonally
  this.diagonal = (rank,file,piece,king) => {
    console.log('THIS.DIAGONAL()');
    const pieces = [];

    for (let i = -1; i < 2; i += 2) {
      for (let j = -1; j < 2; j += 2) {

        let r = rank + i;
        let f = file + j;

        while (r >= 1 && r <= 8) {
          const sq = this.board[r][f];

          if (sq !== '-') break;

          if (sq === piece) {
            pieces.push(String(f) + r);
            break;
          }

          // Only check first square for the king
          if (king) break;

          r += i;
          f += j;
        }
      }
    }

    return pieces;
  }

  // Find all of a given piece capable of moving horiz. or vert. to a given square
  this.straight = (rank,file,piece,king) => {
    console.log('THIS.STRAIGHT()');
    const rooks = [];

    for (let i = -1; i < 2; i += 2) {

      let x = file + i;
      let y = rank + i;

      // Check up/down
      while (y >= 1 && y <= 8) {
        const sq = this.board[y][file];

        if (sq === piece) {
          rooks.push(String(file) + y);
          break;
        }
        // Only check first square for the king
        if (king || sq !== '-') break;

        y += i;
      }

      // Check left/right
      while (x >= 0 && x <= 7) {
        const sq = this.board[rank][x];

        if (sq === piece) {
          rooks.push(String(x) + rank);
          break;
        }

        // Only check first square for the king
        if (king || sq !== '-') break;

        x += i;
      }
    }

    return rooks;
  }

  this.castlesMove = (rank, rook) => {
    console.log('THIS.CASTLESMOVE');
    this.state.turn ? this.removeCastleOption('kq') : this.removeCastleOption('KQ');

    const kingFile = 4 + (2 * rook.dir);
    const rookFile = kingFile - (1 * rook.dir);

    this.movePiece(rank, kingFile, rank, 4);
    return this.movePiece(rank, rookFile, rank, rook.file);
  }

  // this.checkForCheck()
  // this.checkmate()

  /*
    ^ move logic ^
      -----
    MAKE (money) MOVES
  */


  this.p = (sq, from) => {
    console.log('THIS.P()');
    let pawns = [];

    if (from) pawns.push(this.pawnAttack(sq,from));
    else pawns.push(this.pawnAdvance(sq,from));

    if (pawns.length === 0) return this.reject('ERR: This move is invalid, please try again');
    if (pawns.length  >  1) return this.reject('ERR: Please specify which pawn to attack with');
    if (pawns.length === 1) return this.movePiece(sq[1],sq[0],pawns[0][0],pawns[0][1]);
  };

  // Move knight
  this.n = (sq, pre) => {
    console.log('THIS.N()');
    const p = this.state.turn
      ? { piece: 'n', openSq: /[PNBRQ-]/ }
      : { piece: 'N', openSq: /[pnbrq-]/ };

    const file = Number(sq[0]);
    const rank = Number(sq[1]);

    const defender = this.board[rank][file];
    if (!p.openSq.test(defender)) return this.reject('ERR: Your knight cannot move to this square');

    const knights = this.knightMoves(rank,file,p.piece);

    if (knights.length === 0) return this.reject('ERR: This move is invalid, please try again');
    if (knights.length  >  1) return this.reject('ERR: Please specify which knight to move');
    if (knights.length === 1) return this.movePiece(rank,file,Number(knights[0][0]),Number(knights[0][1]));
  };

  this.b = (sq, pre) => {
    console.log('THIS.B()');
    const p = this.state.turn
      ? { piece: 'b', openSq: /[PNBRQ-]/ }
      : { piece: 'B', openSq: /[pnbrq-]/ }

    const file = Number(sq[0]);
    const rank = Number(sq[1]);

    const defender = this.board[rank][file];

    // Ensure square is empty or an enemy
    if (!p.openSq.test(defender)) return this.reject('ERR: Your bishop cannot move to this square');

    const bishops = this.diagonal(rank,file,p.piece);

    if (bishops.length === 0) return this.reject('ERR: This move is invalid, please try again');
    if (bishops.length  >  1) return this.reject('ERR: Please specify which bishop to move');
    if (bishops.length === 1) return this.movePiece(rank,file,Number(bishops[0][1]),Number(bishops[0][0]));
  };

  this.r = (sq, pre) => {
    console.log('THIS.R()');
    const p = this.state.turn
      ? { piece: 'r', openSq: /[PNBRQ-]/, castles: ['01','q','71','k'] }
      : { piece: 'R', openSq: /[pnbrq-]/, castles: ['08','Q','78','K'] };

    const file = Number(sq[0]);
    const rank = Number(sq[1]);

    const defender = this.board[rank][file];

    // Ensure square is empty or an enemy
    if (!p.openSq.test(defender)) return this.reject('ERR: Your rook cannot move to this square');

    const rooks = this.straight(rank,file,p.piece);

    if (rooks.length === 0) return this.reject('ERR: This move is invalid, please try again');
    if (rooks.length  >  1) return this.reject('ERR: Please specify which rook to move');
    if (rooks.length === 1) {
      if (rooks[0] === p.castle[0]) this.state.castles = this.removeCastleOption(p.castles[1]);
      if (rooks[0] === p.castle[2]) this.state.castles = this.removeCastleOption(p.castles[3]);
      return this.movePiece(rank,file,Number(rooks[0][1]),Number(rooks[0][0]));
    }
  };

  this.q = (sq, pre) => {
    console.log('THIS.Q()');
    const p = this.state.turn
      ? { piece: 'q', openSq: /[PNBRQ-]/ }
      : { piece: 'Q', openSq: /[pnbrq-]/ };

    const file = Number(sq[0]);
    const rank = Number(sq[1]);

    const defender = this.board[rank][file];

    // Ensure square is empty or an enemy
    if (!p.openSq.test(defender)) return this.reject('ERR: Your queen cannot move to this square');

    const queens = this.straight(rank,file,p.piece)
            .concat(this.diagonal(rank,file,p.piece));

    if (queens.length === 0) return this.reject('ERR: This move is invalid, please try again');
    if (queens.length  >  1) return this.reject('ERR: Please specify which queen to move');
    if (queens.length === 1) return this.movePiece(rank,file,Number(queens[0][1]),Number(queens[0][0]));
  };

  this.k = (sq, pre) => {
    console.log('THIS.K()');
    const p = this.state.turn
      ? { piece: 'k', openSq: /[PNBRQ-]/, castles: ['41','kq'] }
      : { piece: 'K', openSq: /[pnbrq-]/, castles: ['48','KQ'] };

    const file = Number(sq[0]);
    const rank = Number(sq[1]);

    const defender = this.board[rank][file];

    // Ensure square is empty or an enemy
    if (!p.openSq.test(defender)) return this.reject('ERR: Your king cannot move to this square');

    const kings = this.straight(rank,file,p.piece,true)
          .concat(this.diagonal(rank,file,p.piece,true));

    if (kings.length === 0) return this.reject('ERR: This move is invalid, please try again');
    if (kings.length === 1) {
      // this.checkForCheck(sq);
      if (kings[0] === p.castle[0]) this.state.castles = this.removeCastleOption(p.castles[1]);
      return this.movePiece(rank,file,Number(kings[0][1]),Number(kings[0][0]));
    }
  };

  this.castles = mv => {
    console.log('THIS.CASTLES()');
    const p = this.state.turn
      ? { rank: 1, 'o-o-o': { file: 0, dir: -1 }, 'o-o': { file: 7, dir: 1 } }
      : { rank: 8, 'o-o-o': { file: 0, dir: -1 }, 'o-o': { file: 7, dir: 1 } };

    // this.checkForCheck(String(p.file) + p.rank);

    for (let i = 1; i < 4; i++) {
      const dir = i * p[mv]['dir'];
      const sq = this.board[p.rank][4 + dir];

      // Ensure square is empty
      if (sq !== '-') return this.reject('ERR: There is a piece blocking your castling');

      // Ensure squares that the king passes through aren't being attacked
      if (i >= 3 && this.checkForCheck(sq)) return this.reject('ERR: There is a check preventing your castling');

      // If kingside and starting to check h file, break out
      if (i >= 2 && mv === 'o-o') break;
    }

    return this.castlesMove(p.rank, p[mv]);
  }

}

const game = new Game();
game.init();

module.exports.Game = Game;
