import Simulator from 'pokery';
import {Deck} from 'pokery';
import {Card} from 'pokery';
import Player from './player';
import Game from './game';

let game = new Game();
game.run(10000);

// let deck = new Deck().draw(52);

// let player1Preflop = deck.splice(0, 2);
// let player2Preflop = deck.splice(0, 2);



// let flop = deck.splice(0, 3);
// let turn = deck.splice(0, 1)
// let river = deck.splice(0, 1)

// let player1real = new Player(player1Preflop, "tight");
// console.log("Initial p1 preflop: " + player1Preflop);
// console.log("Modified p1 preflop: " + player1real.simplePreFlop);
// console.log(player1real.preflopResponse());

// let player2real = new Player(player2Preflop, "loose");
// console.log("Initial p2 preflop: " + player2Preflop);
// console.log("Modified p2 preflop: " + player2real.simplePreFlop);
// console.log(player2real.preflopResponse());

// console.log("flop: " + flop)

// player1real.setFlop(flop);
// player2real.setFlop(flop);

// var p1Equity = player1real.equity();
// var p2Equity = player2real.equity();

// var potSize = 100;
// var callSize = 50;

// console.log("player1 flop decision with potSize of " + potSize + " and a call size of " + 0 + ":" + player1real.decisionResponse(p1Equity.winRate / 100, p1Equity.looseRate / 100, potSize, 0));
// console.log("player1 flop decision with potSize of " + potSize + " and a call size of " + callSize + ":" + player1real.decisionResponse(p1Equity.winRate / 100, p1Equity.looseRate / 100, potSize, callSize));

// player1real.setTurn(turn);
// player2real.setTurn(turn);

// player1real.equity();
// player2real.equity();

// player1real.setRiver(river);
// player2real.setRiver(river);

// player1real.equity();
// player2real.equity();

