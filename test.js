const assert = require('assert');
const { Game } = require('./app.js');

const game = new Game;

describe('Utility Functions', () => {
  describe('.getFileLetter()', () => {
    it('should return "a" for index "0"', () => {
      assert.equal(game.getFileLetter(0), 'a');
    });
    it('should return "h" for index "7"', () => {
      assert.equal(game.getFileLetter(7), 'h');
    });
  });

  describe('.getFileIndex()', () => {
    it('should return "0" for letter "a"', () => {
      assert.equal(game.getFileIndex('a'), 0);
    });
    it('should return "7" for letter "h"', () => {
      assert.equal(game.getFileIndex('h'), 7);
    });
  });

  describe('.stringifyRank()', () => {
    it('should return "r n b q k b n r"', () => {
      assert.equal(game.stringifyRank(['r','n','b','q','k','b','n','r']), 'r n b q k b n r');
    });
    it('should return "P P P P P P P P"', () => {
      assert.equal(game.stringifyRank(['P','P','P','P','P','P','P','P']), 'P P P P P P P P');
    });
  });

  describe('.findNewSquare()', () => {
    it('should return "01" for "a1"', () => {
      assert.equal(game.findNewSquare('a1'), '01');
    });
    it('should return "74" for "h4"', () => {
      assert.equal(game.findNewSquare('h4'), '74');
    });
  });

  describe('.getPreface()', () => {
    it('should return "01" for "a1"', () => {
      assert.equal(game.getPreface('n'), 'n');
    });
    it('should return "74" for "h4"', () => {
      assert.equal(game.getPreface('nx'), 'n');
    });
    it('should return "74" for "h4"', () => {
      assert.equal(game.getPreface('nh3x'), 'nh3');
    });
  });

  describe('.parseTheRest()', () => {
    it('should be able to tell pawn from piece', () => {
      assert.deepEqual(game.parseTheRest('g', 'gxf4'), ['p', 'g']);
    });
    it('should be able to tell piece from pawn', () => {
      assert.deepEqual(game.parseTheRest('n', 'ne4'), ['n']);
    });
    it('should be able to tell b-pawn from bishop', () => {
      assert.deepEqual(game.parseTheRest('b', 'bxc4'), ['p', 'b']);
    });
    it('should be able to tell bishop from b-pawn', () => {
      assert.deepEqual(game.parseTheRest('b', 'Bxc4'), ['b']);
    });
    it('should be able to interpret file disamb.', () => {
      assert.deepEqual(game.parseTheRest('nd', 'ndf3'), ['n', 'd']);
    });
    it('should be able to interpret rank disamb.', () => {
      assert.deepEqual(game.parseTheRest('q8', 'q8xe3'), ['q', '8']);
    });
    it('should should be able to interpret rank & file disamb.', () => {
      assert.deepEqual(game.parseTheRest('qh4', 'qh4e1'), ['q', 'h', '4']);
    });
  });

  describe('.up()', () => {
    it('should return 1 forward for white from white POV', () => {
      game.state.turn = 'w'
      assert.equal(game.up(4), 5);
    });
    it('should return 1 forward for black from white POV', () => {
      game.state.turn = 'w';
      assert.equal(game.up(4), 5);
    });
    it('should return 1 forward from black POV', () => {
      game.state.turn = 'b';
      assert.equal(game.up(4), 3);
    });
    it('should return 2 forward from black POV', () => {
      game.state.turn = 'b';
      assert.equal(game.up(4,2), 2);
    });
  });

  describe('.down()', () => {
    it('should return 1 backwards from white POV', () => {
      game.state.turn = 'w';
      assert.equal(game.down(4), 3);
    });
    it('should return 1 backwards from black POV', () => {
      game.state.turn = 'b';
      assert.equal(game.down(4), 5);
    });
    it('should return 2 backwards from black POV', () => {
      game.state.turn = 'b';
      assert.equal(game.down(4,2), 6);
    });
  });
});
