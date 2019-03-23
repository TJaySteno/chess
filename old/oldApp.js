(function chess () {

  /*
    CREATE AND POPULATE BOARD
  */

  function createPiece (i, j) {
    const piece = document.createElement('img');

    // Determine piece type and side
    let type, side;
    if (i === 2 || i === 7) type = 'p';
    else type = 'rnbqkbnr'[j-1];

    if (i <= 2) side = 'l';
    else side = 'd';

    piece.src = `./img/${type}${side}.png`;
    piece.className = `piece ${type} ${side}`;

    return piece;
  }

  function stringifyNotation (x, y) {
    return String(x) + '|' + y;
  }

  function parseNotation (string) {
    return string.split('|').map(n => Number(n));
  }

  function square (i, j) {
    const white = (i + j) % 2;
    const address = stringifyNotation(j, i);

    const square = document.createElement('div');
    square.id = address;

    if (white) square.className = 'square light';
    else square.className = 'square dark';

    if (i <= 2 || i >= 7) square.appendChild(createPiece(i, j));

    return square;
  }

  function createBoard () {
    const board = document.createElement('div');
    board.className = 'board';

    // Create rows
    for (let i = 8; i > 0; i--) {
      // Create squares in rows
      for (let j = 1; j < 9; j++) {
        board.appendChild(square(i, j));
      }
    }

    return board;
  }

  document.body.appendChild(createBoard());

  /*
    INITIATE GAME
  */

  const game = {
    turn: 0,
    board: {
      a: ['r','n','b','q','k','b','n','r'],
      b: ['p','p','p','p','p','p','p','p'],
      c: [], d: [], e: [], f: [],
      g: ['p','p','p','p','p','p','p','p'],
      h: ['r','n','b','q','k','b','n','r'],
    },
    piece: {
      active: false,
      type: '',
      square: {},
      moves: []
    }
  }

  /*
    PIECE LOGIC
  */

  // Reset board state
  function resetActiveSquares () {
    if (game.piece.moves.length) {
      game.piece.moves.forEach(move => {
        move.classList.remove('moves');
      });
    }
    if ( game.piece.square instanceof Node ) {
      game.piece.square.classList.remove('active');
    }

    game.piece.type = '';
    game.piece.square = {}
    game.piece.moves = [];
  }

  function addMove (square) {

  }

  function movePiece (newSquare) {
    const piece = game.piece.square.firstElementChild;
    newSquare.appendChild(piece);
    resetActiveSquares();
    game.piece.active = 'false';
    game.turn = (game.turn + 1) % 2;
  }

  // Activate or deactivate a square
  function selectSquare (e) {

    if (e.target.classList.contains('moves')) {

      movePiece(e.target);

    } else if ( !e.target.classList.contains('piece')
      || (game.turn === 0 && !e.target.classList.contains('l'))
      || (game.turn === 1 && !e.target.classList.contains('d'))) {
      // case 4, click on enemy piece or empty board
      resetActiveSquares();
      game.piece.active = 'false';

    } else {
      const square = e.target.parentNode;

      if (!game.piece.active) {
        // case 1, !active: make this sq active
        game.piece.active = 'true';
        square.classList.add('active');
        game.piece.square = square;
        showMoves();

      } else if (square != game.piece.square) {
        // case 2, active and something else is active: stay active, change values
        resetActiveSquares();
        square.classList.add('active');
        game.piece.square = square;
        showMoves();

      } else {
        // case 3, active and this is active: deactivate and clear
        resetActiveSquares();
        game.piece.active = 'false';
      }
    }
  }

  function showMoves () {

    game.piece.type = game.piece.square.firstElementChild.classList[1];

    let sq = parseNotation(game.piece.square.id);

    if (game.piece.type === 'p') {

      const p = {
        dir: [1, -1],
        start: [2, 7]
      }

      // Pawn movement
        // Determine direction (white v black)
      const fwdOne = Number(sq[1]) + p.dir[game.turn];

        // Move 1-2 forward
      const moves = [stringifyNotation(sq[0], fwdOne)];
      if (sq[1] == p.start[game.turn]) {
        moves.push(stringifyNotation(sq[0], fwdOne + p.dir[game.turn]));
      }

        // Diagonal attack
      const attack = [];
      if (sq[0] - 1 >= 1) attack.push(stringifyNotation(sq[0] - 1, fwdOne));
      if (sq[0] + 1 <= 8) attack.push(stringifyNotation(sq[0] + 1, fwdOne));

      // Show moves
      game.piece.moves = moves.map(move =>
        document.getElementById(move) );
      game.piece.moves.forEach(square => {
        const hasPiece = square.firstElementChild.classList.contains('piece');
        if (!square.firstElementChild) square.classList.add('moves');
      });

      // Show attacks
      attack.forEach(id => {
        const square = document.getElementById(id);
        const enemyPiecePresent = square.firstElementChild
          && square.firstElementChild.classList.contains('d');
        console.log(square, enemyPiecePresent);
        if (enemyPiecePresent) {
          square.classList.add('moves');
          game.piece.moves.push(square);
        }
      });

      // en pesant
    }
  }

  document.querySelector('.board').addEventListener('click', selectSquare);

})();
