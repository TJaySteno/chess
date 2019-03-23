const assert = require('assert');
const { Game } = require('./app.js');

const game = new Game;

describe('Utility Functions', () => {
  describe('.getFile()', () => {
    it('should return "a" for index "0"', () => {
      assert.equal(game.getFile(0), 'a');
    });
    it('should return "h" for index "7"', () => {
      assert.equal(game.getFile(7), 'h');
    });
  });

  describe('.letterToIndex()', () => {
    it('should return "0" for letter "a"', () => {
      assert.equal(game.letterToIndex('a'), 0);
    });
    it('should return "7" for letter "h"', () => {
      assert.equal(game.letterToIndex('h'), 7);
    });
  });

  describe('.printFileLabels()', () => {
    before(() => {
      game.player === 'white';
    });

    it('should label a-h for white', () => {
      assert.equal(game.printFileLabels(), '        a|b|c|d|e|f|g|h\n');
    });

    before(() => {
      game.player === 'black';
    });

    it('should label a-h for white', () => {
      assert.equal(game.printFileLabels(), '        h|g|f|e|d|c|b|a\n');
    });
  });

  describe('.sayTurn()', () => {
    it('should label file names for index 0', () => {
      assert.equal(game.sayTurn('w'), '\nTHE TURN IS: white\n');
    });
    it('should label rank 7 for index 7', () => {
      assert.equal(game.sayTurn('b'), '\nTHE TURN IS: BLACK\n');
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
});
