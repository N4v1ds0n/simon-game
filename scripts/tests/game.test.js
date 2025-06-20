/**
 * @jest-environment jsdom
 */

const { afterEach, expect } = require('@jest/globals');
const { game, newGame, showScore, addTurn, lightsOn, showTurns, playerTurn } = require('../game');

jest.spyOn(window, "alert").mockImplementation(() => {});

beforeAll(() => {
    let fs = require('fs');
    let fileContents = fs.readFileSync('index.html', 'utf8');
    document.open();
    document.write(fileContents);
    document.close();
});

describe('game object contains correct keys', () => {
    test('score key exists', () => {
        expect('score' in game).toBe(true);
    });
    test('currentGame key exists', () => {
        expect('currentGame' in game).toBe(true);
    });
    test('playerMoves key exists', () => {
        expect('playerMoves' in game).toBe(true);
    });
    test('choices key exists', () => {
        expect('choices' in game).toBe(true);
    });
    test('choices contains correct ids', () => {
        expect(game.choices).toEqual(['button1', 'button2', 'button3', 'button4']);
    });
    test('turnNumber key exists', () => {
        expect('turnNumber' in game).toBe(true);
    });
    test('lastButton key exists', () => {
        expect('lastButton' in game).toBe(true);
    });
    test('turnInProgress key is false by default', () => {
        expect(game.turnInProgress).toBe(false);
    });

});

describe('newGame works correctly', () => {
    beforeAll(() => {
        game.score =42;
        game.currentGame = ['button1', 'button2'];
        game.playerMoves = ['button1'];
        document.getElementById('score').innerText = '42';
        newGame();
    });
    test('score is set to 0', () => {
        expect(game.score).toEqual(0);
    });
    test('currentGame is reset to an empty array', () => {
        expect(game.currentGame.length).toBe(1);
    });
    test('playerMoves is reset to an empty array', () => {
        expect(game.playerMoves.length).toBe(0);
    });
    test('should display 0 for the element with id of score', () => {
        expect(document.getElementById('score').innerText).toEqual(0);
    });
    test('expect data-listener to be true', () => {
        const elements = document.getElementsByClassName('circle');
        for (let element of elements) {
            expect(element.getAttribute('data-listener')).toEqual('true');
        }
    });
});

describe('gameplay works corrrectly', () => {
    beforeEach(() => {
        game.score = 0;
        game.currentGame = [];
        game.playerMoves = [];
        addTurn();
    });
    afterEach(() => {
        game.score = 0;
        game.currentGame = [];
        game.playerMoves = [];
    });
    test('addTurn adds a new turn to the game', () => {
        addTurn();
        expect(game.currentGame.length).toBe(2);
    });
    test('should add correct class to light up buttons', () => {
        let button = document.getElementById(game.currentGame[0]);
        lightsOn(game.currentGame[0]);
        expect(button.classList).toContain('light');
    });
    test('showTurns should update game.turnNumber', () => {
        game.turnNumber = 42;
        showTurns();
        expect(game.turnNumber).toBe(0);
    });
    test('should increment score if turn is correct', () => {
        game.playerMoves.push(game.currentGame[0]);
        playerTurn();
        expect(game.score).toBe(1);
    });
    test('should call an alert if the move is wrong', () => {
        game.playerMoves.push('meeep');
        playerTurn();
        expect(window.alert).toBeCalledWith('Wrong move!');
    });
    test('should check if computer turn is in progress', () => {
        showTurns();
        expect(game.turnInProgress).toBe(true);
    })
    test('should set turnInProgress to false after showing turns', () => {
        showTurns();
        setTimeout(() => {
            expect(game.turnInProgress).toBe(false);
        }, 800);
    });
    test('clicking during computer turn should fail silently', () => {
        showTurns();
        game.lastButton ='';
        document.getElementById('button2').click();
        expect(game.lastButton).toEqual('');
    });
});
