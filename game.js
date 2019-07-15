import Player from './player';
import {Deck} from 'pokery';
import {Hand} from 'pokery';
import { PokerBot } from '../PokerBot/global_ext/janda/build/bot.js';

export default class Game {

    constructor() {
        this.SB = 1;
		this.STARTING_STACK = 200;
		this.mazBbWin = 0;
		this.ericBbWin = 0;
		// this.mazSbWin = 0;
		// this.ericSbWin = 0;
    }

    ericSmallBlind(sbCards, bbCards, flop, turn, river) {
        let ericSB = new Player(sbCards, "cutOff");
            let mazBB = new PokerBot(bbCards[0], bbCards[1], this.STARTING_STACK);
            mazBB.stackSize -= this.SB * 2;
            ericSB.stackSize -= this.SB;
			var mazFoldBb = false;
            var ericFoldSb = false;
            let mazInBBPot = 3 * this.SB;
            
            var ericSbWin = 0;
            var mazBbWin = 0;
			

            ////// Eric Small blind minus showdown START
			var ericInSbResponse = ericSB.preflopResponse(this.SB);
			if (ericInSbResponse > 0) {
				mazInBBPot += ericInSbResponse;
			} else if (ericInSbResponse == 0) { //limp
				mazInBBPot += this.SB;
			} else if (ericInSbResponse < 0) {
                ericFoldSb = true;
                mazInBBPot -= (this.STARTING_STACK - mazBB.stackSize);
				mazBbWin += mazInBBPot;
				ericSbWin -= mazInBBPot;
			}
			//console.log("Eric SB: ", ericInSbResponse, "mazInBBPot", mazInBBPot, "ericInBBPot", ericInBBPot);

            if (ericInSbResponse >= 0) {
				//console.log("Maz BB: eric from sb bet " + ericInSbResponse);
				var botState = {
					vb: ericInSbResponse > 0 ? ericInSbResponse: 0,
					v: ericSB.stackSize,
					p: mazInBBPot
				};
				var mazInBbResponse = mazBB.bot(botState);
				if (mazInBbResponse > 0) {
					mazInBBPot += mazInBbResponse;
                    //mazBB.stackSize -= mazInBbResponse;
                    let oldEricStackSize = ericSB.stackSize;
                    ericInSbResponse = ericSB.preflopResponse(mazInBbResponse);
                    if (ericFoldSb >= 0) {
                        mazInBBPot += oldEricStackSize;
                    }
				}
				if (mazInBbResponse == 0) {
					//TODO: investigate this logic
					// As the BB, we put already put in 2, where SB only put 1
					mazInBBPot += ericInSbResponse - 1; //Calling maz's SB bet
				}
				else if (mazInBbResponse < 0) { // incorrect folder is losing more
                    mazFoldBb = true;
                    mazInBBPot -= (this.STARTING_STACK - ericSB.stackSize);
					ericSbWin += mazInBBPot;
					mazBbWin -= mazInBBPot;
				}
				//console.log("Maz BB: ", mazInBbResponse, "mazInBBPot", mazInBBPot);
            }
            
            let sbHand2 = new Hand(sbCards.concat(flop).concat(turn).concat(river));
            let bbHand2 = new Hand(bbCards.concat(flop).concat(turn).concat(river));

			// if winner == 1, sb won
            let winner2 = sbHand2.vs(bbHand2);

            if (winner2 == 1) {
                //console.log("sb wins");
				if (!ericFoldSb && !mazFoldBb) {
                    //console.log("Showdown with Eric in small blind.");
                    mazBbWin -= mazInBBPot - (this.STARTING_STACK);
					ericSbWin += mazInBBPot - (this.STARTING_STACK);
				}
            } else if (winner2 == -1) { // BB won
				if (!mazFoldBb && !ericFoldSb) {
                    //console.log("Showdown with Maz in small blind.");
					mazBbWin += mazInBBPot - (this.STARTING_STACK);
					ericSbWin -= mazInBBPot - this.STARTING_STACK;
				}
            } else {
                //console.log("hand comparison is 0");
            }
            /// Eric small blind minus showdown END
            return {ericSbWin, mazBbWin}
    }

    mazSmallBlind(sbCards, bbCards, flop, turn, river) {
        /// Maz small blind minus showdown START

        let mazSB = new PokerBot(sbCards[0], sbCards[1], this.STARTING_STACK);
        let ericBB = new Player(bbCards, "cutOff");
        ericBB.stackSize -= this.SB * 2;
        mazSB.stackSize -= this.SB;
        var ericFoldBb = false;
        var mazFoldSb = false;
        let ericInBBPot = 3 * this.SB;

        var ericBbWin = 0;
        var mazSbWin = 0;
        
        var botState2 = {
            vb: 2, // eric is in BB, is yet to act
            v: ericBB.stackSize,
            p: ericInBBPot
        };

        var mazInSbResponse = mazSB.bot(botState2);
        if (mazInSbResponse > 0) {
            ericInBBPot += mazInSbResponse;
            //mazSB.stackSize -= mazInSbResponse;
        } else if (mazInSbResponse == 0) { // will never happen
            ericInBBPot += this.SB;
            //mazSB.stackSize -= this.SB;
        } else if (mazInSbResponse < 0) {
            mazFoldSb = true;
            ericInBBPot -= (this.STARTING_STACK - ericBB.stackSize);
            ericBbWin += ericInBBPot;
            mazSbWin -= ericInBBPot;
        }
        //console.log("Maz SB: ", mazInSbResponse, "mazInBBPot", mazInBBPot, "ericInBBPot", ericInBBPot);

        if (mazInSbResponse >= 0) {
            // Maz all in or folds his sb so only 1 response necessary 
            var ericInBbResponse = ericBB.preflopResponse(mazInSbResponse);

            if (ericInBbResponse > 0) {
                ericInBBPot += ericInBbResponse + mazInSbResponse - 1;
            } else if (ericInBbResponse == 0) {
                // BB calls sb bet -1
                ericInBBPot += mazInSbResponse - 1; //Calling maz's SB bet
            }
            else if (ericInBbResponse < 0) { // Correct
                ericFoldBb = true;
                ericInBBPot -= (this.STARTING_STACK - mazSB.stackSize);
                mazSbWin += ericInBBPot;
                ericBbWin -= ericInBBPot;
            }
        }
        

        // See who won (if there was a showdown)

        let sbHand = new Hand(sbCards.concat(flop).concat(turn).concat(river));
        let bbHand = new Hand(bbCards.concat(flop).concat(turn).concat(river));

        // if winner == 1, sb won
        let winner = sbHand.vs(bbHand);
        //console.log("cards were: ", flop.concat(turn).concat(river));

        if (winner == 1) {
            //console.log("sb wins");

            if (!mazFoldSb && !ericFoldBb) {
                //console.log("Showdown with Maz in small blind.");
                ericBbWin -= ericInBBPot - (this.STARTING_STACK);
                mazSbWin += ericInBBPot - (this.STARTING_STACK); // investigate this descrepency
            }
        } else if (winner == -1) { // BB (eric) won // Correct
            if (!ericFoldBb && !mazFoldSb) {
                //console.log("Showdown with Maz in small blind.");
                //ericTotalWin += ericInBBPot - (STARTING_STACK);
                ericBbWin += ericInBBPot - (this.STARTING_STACK);
                mazSbWin -= ericInBBPot - (this.STARTING_STACK);
            }
        } else { //Tie
            // Nobody wins in a tie
            //console.log("there was a tie with the maz in the small blind");
        }
        return {mazSbWin, ericBbWin};
    }

    run(times) {
		

        var mazTotalWin = 0;
        var mazTotalBBWin = 0;
        var mazTotalSBWin = 0;

        var ericTotalWin = 0;
        var ericTotalBBWin = 0;
        var ericTotalSBWin = 0;

        for (var i = 0; i < times; i++) {
			if (i%100 == 0) {
            	console.log("On run ", i, " of ", times);
			}

            let deck = new Deck().draw(52);

            let sbCards = deck.splice(0,2);
            let bbCards = deck.splice(0,2);
			// console.log("BB cards: ", bbCards);
			// console.log("SB cards: ", sbCards);

            let flop = deck.splice(0,3);
            let turn = deck.splice(0,1);
            let river = deck.splice(0,1);

            
            const {ericSbWin, mazBbWin} = this.ericSmallBlind(sbCards, bbCards, flop, turn, river);

            const {mazSbWin, ericBbWin} = this.mazSmallBlind(sbCards, bbCards, flop, turn, river);
            
            mazTotalBBWin += mazBbWin;
            mazTotalSBWin += mazSbWin;
            ericTotalBBWin += ericBbWin;
            ericTotalSBWin += ericSbWin;

            mazTotalWin = mazTotalWin + mazSbWin + mazBbWin;
            ericTotalWin = ericTotalWin + ericSbWin + ericBbWin;
            /// Maz in SB END
        }

        // var mazTotalWin = this.mazBbWin + this.mazSbWin;
        // var ericTotalWin = this.ericBbWin + this.ericSbWin;

		console.log("WINNINGS REPORT - maz: " + mazTotalWin + " eric: " + ericTotalWin);
		console.log("Maz BB win: " + mazTotalBBWin);
		console.log("Eric BB win: " + ericTotalBBWin);
		console.log("Maz SB win: " + mazTotalSBWin);
		console.log("Eric SB win: " + ericTotalSBWin);
    }
}
