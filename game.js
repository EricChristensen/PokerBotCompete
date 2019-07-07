import Player from './player';
import {Deck} from 'pokery';
import {Hand} from 'pokery';
import { PokerBot } from '../poker/janda/build/bot.js';

export default class Game {
    
    run(times) {
		const SB = 1;
		const STARTING_STACK = 200;
        var mazTotalWin = 0;
        var ericTotalWin = 0;

        for (var i = 0; i < times; i++) {
			if (!i%100) {
            	console.log("On run ", i, "of ", times);
			}

            let deck = new Deck().draw(52);

            let sbCards = deck.splice(0,2);
            let bbCards = deck.splice(0,2);

            let flop = deck.splice(0,3);
            let turn = deck.splice(0,1);
            let river = deck.splice(0,1);

            let ericSB = new Player(sbCards, "tight");
            let mazSB = new PokerBot(bbCards[0], bbCards[1], STARTING_STACK);

            let ericBB = new Player(bbCards, "tight");
            let mazBB = new PokerBot(sbCards[0], sbCards[1], STARTING_STACK);

            ericBB.stackSize -= SB * 2;
            mazBB.stackSize -= SB * 2;

            ericSB.stackSize -= SB;
            mazSB.stackSize -= SB;

			var mazFoldBb = false;
			var ericFoldBb = false;
			var mazFoldSb = false;
			var ericFoldSb = false;

			// Pot size
			let ericInBBPot = 3 * SB;
			let mazInBBPot = 3 * SB;

			var ericInSbResponse = ericSB.preflopResponse(SB);
			if (ericInSbResponse > 0) {
				mazInBBPot += ericInSbResponse;
			}
			else if (ericInSbResponse == 0) {
				mazInBBPot += SB;
			}
			else if (ericInSbResponse < 0) {
				ericFoldSb = true;
				// Maz in BB wins current pot!
				mazTotalWin += mazInBBPot - (STARTING_STACK - mazBB.stackSize); // take closer look
			}
			console.log("Eric SB: ", ericInSbResponse, "mazTotalWin", mazTotalWin, "ericTotalWin", ericTotalWin);

			var botState = {
				vb: 2, // eric is in BB, is yet to act
				v: ericBB.stackSize,
				p: ericInBBPot
			};

            var mazInSbResponse = mazSB.bot(botState);
			if (mazInSbResponse > 0) {
				ericInBBPot += mazInSbResponse;
			}
			else if (mazInSbResponse == 0) {
				ericInBBPot += SB;
			}
			else if (mazInSbResponse < 0) {
				mazFoldSb = true;
				// Eric in BB wins current pot! All is well in the world
				ericTotalWin += ericInBBPot - (STARTING_STACK - ericBB.stackSize);
			}
			console.log("Maz SB: ", mazInSbResponse, "mazTotalWin", mazTotalWin, "ericTotalWin", ericTotalWin);

			if (mazInSbResponse >= 0) {
				// Maz all in or folds his sb so only 1 response necessary 
				var ericInBbResponse = ericBB.preflopResponse(mazInSbResponse);

				if (ericInBbResponse >= 0) {
					ericInBBPot += ericInBbResponse;
				}
				if (ericInBbResponse == 0) {
					ericInBBPot += mazInSbResponse; //Calling maz's SB bet
				}
				else if (ericInBbResponse < 0) {
					ericFoldBb = true;
					// Maz in SB wins current pot!
					mazTotalWin += ericInBBPot - (STARTING_STACK - mazSB.stackSize);
				}
				console.log("Eric BB: ", ericInBbResponse, "mazTotalWin", mazTotalWin, "ericTotalWin", ericTotalWin);
			}

			if (ericInSbResponse >= 0) {
				botState = {
					vb: ericInSbResponse > 0 ? ericInSbResponse: 0,
					v: ericSB.stackSize,
					p: mazInBBPot
				};
				var mazInBbResponse = mazBB.bot(botState);
				if (mazInBbResponse > 0) {
					mazInBBPot += mazInBbResponse;
				}
				if (mazInBbResponse == 0) {
					mazInBBPot += ericInSbResponse; //Calling maz's SB bet
				}
				else if (mazInBbResponse < 0) {
					mazFoldBb = true;
					// Eric in SB wins current pot!
					ericTotalWin += mazInBBPot - (STARTING_STACK - ericSB.stackSize);
				}
				console.log("Maz BB: ", mazInBbResponse, "mazTotalWin", mazTotalWin, "ericTotalWin", ericTotalWin);
			}

			// See who won (if there was a showdown)

            let sbHand = new Hand(sbCards.concat(flop).concat(turn).concat(river));
            let bbHand = new Hand(sbCards.concat(flop).concat(turn).concat(river));

			// if winner == 1, sb won
            let winner = sbHand.vs(bbHand);

            if (winner == 1) {
                console.log("sb wins");
				if (!mazFoldSb && !ericFoldBb) {
					console.log("maz sb wins at showdown", mazTotalWin, ericInBBPot);
					mazTotalWin += ericInBBPot;
				}
				if (!ericFoldSb && !mazFoldBb) {
					console.log("eric sb wins at showdown", ericTotalWin, mazInBBPot);
					ericTotalWin += mazInBBPot;
				}
            } else { //BB won
				if (!mazFoldBb && !ericFoldSb) {
					console.log("Maz bb wins at showdown", mazTotalWin, ericInBBPot);
					mazTotalWin += mazInBBPot;
				}
				if (!ericFoldBb && !mazFoldSb) {
					console.log("eric bb wins at showdown", ericTotalWin, mazInBBPot);
					ericTotalWin += ericInBBPot;
				}
            }
        }
		console.log("WINNINGS REPORT - maz: " + mazTotalWin + " eric: " + ericTotalWin);
    }
}
