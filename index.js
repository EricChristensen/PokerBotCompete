import Simulator from 'pokery';
import {Deck} from 'pokery';
import {Card} from 'pokery';
import Player from './player'

//let result1 = new Simulator(['AhAd', 'KK', 'JTs', '72o'], ['Qd']).run();
//console.log(result1)

let deck = new Deck().draw(52);

let player1Preflop = deck.splice(0, 2);
let player2Preflop = deck.splice(0, 2);

let flop = deck.splice(0, 3);
let turn = deck.splice(0, 1)
let river = deck.splice(0, 1)

let player1real = new Player(player1Preflop, "tight");
console.log(player1real.playerType);
console.log(player1real.preflopResponse());

let player2real = new Player(player2Preflop, "loose");
console.log(player2real.playerType);
console.log(player2real.preflopResponse());

player1real.setFlop(flop)
player2real.setFlop(flop)

player1real.rangey()
player2real.rangey()
