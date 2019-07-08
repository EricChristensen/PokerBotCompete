import Player from './player';
import {Deck} from 'pokery';
import {Hand} from 'pokery';
import { PokerBot } from '../poker/janda/build/bot.js';

export default class Game {

    run(times) {
		const SB = 1;
		const STARTING_STACK = 200;
		var mazBbWin = 0;
		var ericBbWin = 0;
		var mazSbWin = 0;
		var ericSbWin = 0;

        for (var i = 0; i < times; i++) {
			if (!i%100) {
            	console.log("On run ", i, "of ", times);
			}

            let deck = new Deck().draw(52);

            let sbCards = deck.splice(0,2);
            let bbCards = deck.splice(0,2);
			console.log("BB cards: ", bbCards);
			console.log("SB cards: ", sbCards);

            let flop = deck.splice(0,3);
            let turn = deck.splice(0,1);
            let river = deck.splice(0,1);

            let ericSB = new Player(sbCards, "tight"); //can also be "tight"
            let mazSB = new PokerBot(sbCards[0], sbCards[1], STARTING_STACK);

            let ericBB = new Player(bbCards, "tight"); //can also be "tight"
            let mazBB = new PokerBot(bbCards[0], bbCards[1], STARTING_STACK);

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
				//ericSB.stackSize -= ericInSbResponse;
			}
			else if (ericInSbResponse == 0) { //limp
				mazInBBPot += SB;
				//ericSB.stackSize -= SB;
			}
			else if (ericInSbResponse < 0) {
				ericFoldSb = true;
				// Maz in BB wins current pot!
				//mazTotalWin += mazInBBPot - (STARTING_STACK - mazBB.stackSize); // take closer look
				mazBbWin += mazInBBPot - (STARTING_STACK - mazBB.stackSize); // take closer look
				ericSbWin -= mazInBBPot - (STARTING_STACK - ericBB.stackSize); // take closer look
			}
			console.log("Eric SB: ", ericInSbResponse, "mazInBBPot", mazInBBPot, "ericInBBPot", ericInBBPot);

			var botState = {
				vb: 2, // eric is in BB, is yet to act
				v: ericBB.stackSize,
				p: ericInBBPot
			};

            var mazInSbResponse = mazSB.bot(botState);
			if (mazInSbResponse > 0) {
				ericInBBPot += mazInSbResponse;
				//mazSB.stackSize -= mazInSbResponse;
			}
			else if (mazInSbResponse == 0) {
				ericInBBPot += SB;
				//mazSB.stackSize -= SB;
			}
			else if (mazInSbResponse < 0) {
				mazFoldSb = true;
				// Eric in BB wins current pot! All is well in the world
				//ericTotalWin += ericInBBPot - (STARTING_STACK - ericBB.stackSize);
				ericBbWin += ericInBBPot - (STARTING_STACK - ericBB.stackSize); // take closer look
				mazSbWin -= ericInBBPot - (STARTING_STACK - ericBB.stackSize); // take closer look
			}
			console.log("Maz SB: ", mazInSbResponse, "mazInBBPot", mazInBBPot, "ericInBBPot", ericInBBPot);

			if (mazInSbResponse >= 0) {
				// Maz all in or folds his sb so only 1 response necessary 
				var ericInBbResponse = ericBB.preflopResponse(mazInSbResponse);

				if (ericInBbResponse > 0) {
					ericInBBPot += ericInBbResponse;
					//ericBB.stackSize -= ericInBbResponse;
				}
				else if (ericInBbResponse == 0) {
					// BB calls sb bet -1
					ericInBBPot += mazInSbResponse - 1; //Calling maz's SB bet
				}
				else if (ericInBbResponse < 0) {
					ericFoldBb = true;
					// Maz in SB wins current pot!
					//mazTotalWin += ericInBBPot - (STARTING_STACK - mazSB.stackSize);
					mazSbWin += ericInBBPot - (STARTING_STACK - mazBB.stackSize);
					ericBbWin -= ericInBBPot - (STARTING_STACK - mazBB.stackSize);
				}
			console.log("Eric BB: ", ericInBbResponse, "ericInBBPot", ericInBBPot, "mazInBBPot", mazInBBPot);
			}

			if (ericInSbResponse >= 0) {
				console.log("Maz BB: eric from sb bet " + ericInSbResponse);
				botState = {
					vb: ericInSbResponse > 0 ? ericInSbResponse: 0,
					v: ericSB.stackSize,
					p: mazInBBPot
				};
				var mazInBbResponse = mazBB.bot(botState);
				if (mazInBbResponse > 0) {
					mazInBBPot += mazInBbResponse;
					//mazBB.stackSize -= mazInBbResponse;
				}
				if (mazInBbResponse == 0) {
					//TODO: investigate this logic
					// As the BB, we put already put in 2, where SB only put 1
					mazInBBPot += ericInSbResponse - 1; //Calling maz's SB bet
				}
				else if (mazInBbResponse < 0) {
					mazFoldBb = true;
					// Eric in SB wins current pot!
					//ericTotalWin += mazInBBPot - (STARTING_STACK - ericSB.stackSize);
					ericSbWin += mazInBBPot - (STARTING_STACK - ericBB.stackSize); // take closer look
					mazBbWin -= mazInBBPot - (STARTING_STACK - ericBB.stackSize); // take closer look
				}
				console.log("Maz BB: ", mazInBbResponse, "mazInBBPot", mazInBBPot);
			}

			// See who won (if there was a showdown)

            let sbHand = new Hand(sbCards.concat(flop).concat(turn).concat(river));
            let bbHand = new Hand(sbCards.concat(flop).concat(turn).concat(river));

			// if winner == 1, sb won
            let winner = sbHand.vs(bbHand);
			console.log("cards were: ", flop.concat(turn).concat(river));

            if (winner == 1) {
                console.log("sb wins");

				if (!mazFoldSb && !ericFoldBb) {
					//console.log("maz sb wins at showdown", mazTotalWin, ericInBBPot);
					mazTotalWin += ericInBBPot - (STARTING_STACK);
					ericBbWin -= ericInBBPot - (STARTING_STACK);
					mazSbWin += ericInBBPot;
				}
				if (!ericFoldSb && !mazFoldBb) {
					//console.log("eric sb wins at showdown", ericTotalWin, mazInBBPot);
					ericTotalWin += mazInBBPot - (STARTING_STACK);
					mazBbWin -= mazInBBPot - (STARTING_STACK);
					ericSbWin += mazInBBPot - (STARTING_STACK);
				}
            } 
			else if (winner == -1) { // BB won
				if (!mazFoldBb && !ericFoldSb) {
					//mazTotalWin += mazInBBPot - (STARTING_STACK);
					mazBbWin += mazInBBPot - (STARTING_STACK);
					ericSbWin -= mazInBBPot - STARTING_STACK;
				}
				if (!ericFoldBb && !mazFoldSb) {
					//ericTotalWin += ericInBBPot - (STARTING_STACK);
					ericBbWin += ericInBBPot - (STARTING_STACK);
					mazSbWin -= ericInBBPot - (STARTING_STACK);
				}
            }

			else { //Tie
				// Nobody wins in a tie
			}
        }

        var mazTotalWin = mazBbWin + mazSbWin;
        var ericTotalWin = ericBbWin + ericSbWin;

		console.log("WINNINGS REPORT - maz: " + mazTotalWin + " eric: " + ericTotalWin);
		console.log("Maz BB win: " + mazBbWin);
		console.log("Eric BB win: " + ericBbWin);
		console.log("Maz SB win: " + mazSbWin);
		console.log("Eric SB win: " + ericSbWin);
    }
}
