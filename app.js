// showMoves


function chess () {

  /*
    CREATE AND POPULATE BOARD
  */

  function createPiece (i, j) {
    const piece = document.createElement('img');

    // Determine piece type and side
    let type, side;
    if (i === 2 || i === 7) type = 'p';
    else type = 'rnbqkbnr'[j-97];

    if (i <= 2) side = 'l';
    else side = 'd';

    piece.src = `./img/${type}${side}.png`;
    piece.className = `piece ${type} ${side}`;

    return piece;
  }

  function square (i, j) {
    const white = (i + j) % 2;
    const notation = String.fromCharCode(j) + i;

    const square = document.createElement('div');
    square.id = notation;

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
      for (let j = 97; j < 105; j++) {
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

    console.log(game.turn, game.piece);
  }

  function showMoves () {
    game.piece.type = game.piece.square.firstElementChild.classList[1];

    const sq = game.piece.square.id.split('');

    if (game.piece.type === 'p') {
      const moves = [sq[0] + (Number(sq[1]) + 1)];
      if (sq[1] == 2) moves.push(sq[0] + (Number(sq[1]) + 2));

      game.piece.moves = moves.map(move =>
        document.getElementById(`${move}`)
      );
      game.piece.moves.forEach(move => {
        move.classList.add('moves');
      });
    }
  }



  document.querySelector('.board').addEventListener('click', selectSquare);
}

chess();


  // // resetActiveSquares();
  // if (!game.piece.active) {
  //   selectSquare(e.target.parentNode);
  //   showMoves();
  // }




      // // If clicked square is new, deactivate previous square
      //   // NOTE: clean up?
      // // if (game.piece.square instanceof Node
      // //   && game.piece.square != square ) {
      // //     resetActiveSquares();
      // //   }
      //
      // game.piece.square = square;
      // if (square.classList.contains('active')) {
      //   square.classList.remove('active');
      //   game.piece.active = 'false';
      // } else {
      //   square.classList.add('active');
      //   game.piece.active = 'true';
      // }
