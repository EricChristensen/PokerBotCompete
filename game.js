import Player from './player';
import {Deck} from 'pokery';
import {Hand} from 'pokery';
import { PokerBot } from '../poker/janda/build/bot.js';

export default class Game {
    
    constructor(/*player1, player2*/) {
        // this.player1 = player1;
        // this.player2 = player2;
    }


    run(times) {
		const SB = 1;
        
        for (var i = 0; i < times; i++) {
            let deck = new Deck().draw(52);
            let p1Preflop = deck.splice(0,2);
            let p2Preflop = deck.splice(0,2);
            let flop = deck.splice(0,3);
            let turn = deck.splice(0,1);
            let river = deck.splice(0,1);

            let player1 = new Player(p1Preflop, "tight");
            let player2 = new PokerBot(p2Preflop[0], p2Preflop[1], 200);

            player2.stackSize -= SB * 2;
            player1.stackSize -= SB;
            let potSize = 3 * SB;

            console.log("Player 1 preflop: " + p1Preflop + " Player 2 preflop: " + p2Preflop);
            var p1pfResponse = player1.preflopResponse(player1.sb);
            console.log("Player 1 PF response: " + p1pfResponse);
            if (p1pfResponse == -1) {
                console.log("player 1 folds");
                break;
            }
			/* Responses
				0 - check or call
				1-inf - bet
				-1 - fold
			*/

			var botState = {
				vb: p1pfResponse > 0 ? p1pfResponse: 0,
				v: player1.stackSize,
				p: potSize
			};
            var p2pfResponse = player2.bot(botState);
            console.log(" Player 2 PF response: " + p2pfResponse);
            if (p2pfResponse == -1) {
                console.log("player 2 folds");
                break;
            }
            var i = 0;
            while (p1pfResponse != -1 && p2pfResponse != 0 && p2pfResponse != -1) {
                p1pfResponse = player1.preflopResponse(p2pfResponse);
                if (p1pfResponse == 0) {
                    console.log("p1 just called");
                    break;
                }
                console.log("Player 1 PF response: " + p1pfResponse);
                p2pfResponse = player2.preflopResponse(p1pfResponse);
                console.log(" Player 2 PF response: " + p2pfResponse);
                console.log("p1 stack size: " + player1.stackSize + " p2 stackSize: " + player2.stackSize);
                console.log("i: " + i);
                i += 1;
            }

            
            
            // player1.setFlop(flop);
            // player2.setFlop(flop);
            // let p1FlopEquity = player1.equity();
            // let p2FlopEquity = player2.equity();
            // console.log("Flop: " + flop);
            // console.log("Player 1 flop decision: " + player1.decisionResponse(p1FlopEquity.winPercentage, p1FlopEquity.losePercentage, 0, 0));
            // console.log("Player 2 flop decision: " + player2.decisionResponse(p2FlopEquity.winPercentage, p2FlopEquity.losePercentage, 0, 0));

            // player1.setTurn(turn);
            // player2.setTurn(turn);
            // console.log("Turn: " + turn);
            // let p1TurnEquity = player1.equity();
            // let p2TurnEquity = player2.equity();

            // console.log("Player 1 turn decision: " + player1.decisionResponse(p1TurnEquity.winPercentage, p1TurnEquity.losePercentage, 0, 0));
            // console.log("Player 2 turn decision: " + player2.decisionResponse(p2TurnEquity.winPercentage, p2TurnEquity.losePercentage, 0, 0));

            // player1.setRiver(river);
            // player2.setRiver(river);
            // console.log("River: " + river);

            // let p1RiverEquity = player1.equity();
            // let p2RiverEquity = player2.equity();

            // console.log("Player 1 river decision: " + player1.decisionResponse(p1RiverEquity.winPercentage, p1RiverEquity.losePercentage, 0, 0));
            // console.log("Player 2 river decision: " + player2.decisionResponse(p2RiverEquity.winPercentage, p2RiverEquity.losePercentage, 0, 0));

            // let p1Hand = new Hand(player1.getCards());
            // let p2Hand = new Hand(player2.getCards());
            // let winner = p1Hand.vs(p2Hand);
            // console.log("player 1: " + p1Preflop + " player 2: " + p2Preflop);
            // console.log("cards: " + flop + " " + turn + " " + river);
            // if (winner == 1) {
            //     console.log("player 1 wins");
            // } else {
            //     console.log("player 2 wins");
            // }

        }
    }
}
