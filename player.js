import c from './constants';
import Simulator from 'pokery';
const { raceRange, rates, raceRangeForBoard } = require('pec')

export default class Player {

    constructor(preFlop, playerType) {
        this.bb = 2;
        this.sb = 1;
        this.stackSize = 100;
        this.preFlop = preFlop;
        this.simplePreFlop = this.simplifiedPreflop(preFlop);
        this.cards = [];
        this.board = [];
        this.cards = this.cards.concat(preFlop);
        this.playerType = playerType;
        this.setRanges(playerType);
    }

    setFlop(cards) {
        this.flop = cards;
        this.cards = this.cards.concat(cards);
        this.board = this.board.concat(cards);
    }

    setTurn(turn) {
        this.turn = turn;
        this.cards = this.cards.concat(turn);
        this.board = this.board.concat(turn);
    }

    setRiver(river) {
        this.river = river;
        this.cards = this.cards.concat(river);
        this.board = this.board.concat(river);
    }

    getCards() {
        return this.cards;
    }

    /*
    * Calculate the equity of this hand against a range.
    */
    equity() {
        let range = this.callRange.concat(this.threeBetRange).concat(this.raiseRange);
        var eRange = this.fullRange(range);
        let cards = this.cards;
        eRange = eRange.filter(function(value) {
            var result = true;
            cards.forEach(function(card) {
                if (result == true) {
                    result = value[0] != card && value[1] != card;
                }
            });
            return result;
        });
        
        const { win, loose, tie } = raceRangeForBoard(this.preFlop, eRange, 1000, true, this.board);
        const { winRate, looseRate, tieRate } = rates({ win, loose, tie });

        console.log('win: %d%% (%d times)', winRate, win)
        console.log('loose: %d%% (%d times)', looseRate, loose)
        console.log('tie: %d%% (%d times)', tieRate, tie)
        let winPercentage = winRate / 100;
        let losePercentage = looseRate / 100;
        return {winPercentage, losePercentage};
    }

    decisionResponse(winRate, loseRate, amountToWin, amountToLose) {
        console.log("win rate: " + winRate + " loseRate " + loseRate);
        var thresHold = this.threshold(winRate, loseRate, amountToWin, amountToLose);
        if (amountToLose == 0) {
            if (winRate > 0.33 && winRate < 0.66) {
                return "bet pot";
            } else if (winRate >= 0.66) {
                return "bet half pot";
            } else if (winRate <= 0.33) {
                return "check";
            }
        } else if (thresHold >= 0) {
            return "call";
        } else {
            return "fold";
        }
    }

    threshold(winRate, loseRate, amountToWin, amountToLose) {
        return winRate * amountToWin - loseRate * amountToLose;
    }

    /*
    * Set the ranges based on the type of player that this player is from
    * from the ranges in constants.js
    */
    setRanges(playerType) {
        if (playerType == "tight") {
            this.callRange = c.tightCallRange;
            this.threeBetRange = c.tightThreeBetRange;
            this.raiseRange = c.tightRaiseRange;
        } else if (playerType == "loose") {
            this.callRange = c.looseCallRange;
            this.threeBetRange = c.looseThreeBetRange;
            this.raiseRange = c.looseRaiseRange;
        }
    }

    /*
    * Given a range that has values like A2o return a range that has
    * all permutations of that like Ac2d, Ac2h, Ac2s, Ad2c, Ad2h, Ad2s, Ah2s
    */
    fullRange(oldRange) {
        var eRange = [];
        oldRange.forEach(function(element) {
            if (element.length == 2) { //suited or unsuited
                eRange.push([element[0] + "c", element[1] + "d"]);
                eRange.push([element[0] + "c", element[1] + "h"]);
                eRange.push([element[0] + "c", element[1] + "s"]);
                eRange.push([element[0] + "d", element[1] + "h"]);
                eRange.push([element[0] + "d", element[1] + "s"]);
                eRange.push([element[0] + "h", element[1] + "s"]);
                if (element[0] != element[1]) {
                    eRange.push([element[0] + "s", element[1] + "s"]);
                    eRange.push([element[0] + "h", element[1] + "h"]);
                    eRange.push([element[0] + "d", element[1] + "d"]);
                    eRange.push([element[0] + "c", element[1] + "c"]);
                }
    
            } else if (element.length == 3) {
                if (element[2] == 's') {
                    eRange.push([element[0] + "s", element[1] + "s"]);
                    eRange.push([element[0] + "h", element[1] + "h"]);
                    eRange.push([element[0] + "d", element[1] + "d"]);
                    eRange.push([element[0] + "c", element[1] + "c"]);
                } else if (element[2] == 'o') {
                    eRange.push([element[0] + "c", element[1] + "d"]);
                    eRange.push([element[0] + "c", element[1] + "h"]);
                    eRange.push([element[0] + "c", element[1] + "s"]);
                    eRange.push([element[0] + "d", element[1] + "h"]);
                    eRange.push([element[0] + "d", element[1] + "s"]);
                    eRange.push([element[0] + "h", element[1] + "s"]);
                }
            } else {
                console.log(element.length)
            }
        });
        return eRange;
    }

    /*
    * Go from [As, 2d] to A2o or [Ks, Kd] to KK
    */
    simplifiedPreflop(holeCards) {
        if (this.isPair(holeCards)) {
            return String(this.cardValues(holeCards));
        } else if (this.isSuited(holeCards)) { 
            return String(this.cardValues(holeCards) + "s");
        } else {
            return String(this.cardValues(holeCards) + "o");
        }
    }

    isPair(twoCards) {
        return twoCards[0].charAt(0) == twoCards[1].charAt(0);
    }

    isSuited(twoCards) {
        return twoCards[0].charAt(1) == twoCards[1].charAt(1);
    }

    /*
    * Go from [As,Ad] to AA or [Kc, 2c] to K2
    * Also go from [Jc, Qd] to QJ or [5d, 9c] to 95
    */
    cardValues(twoCards) {
        let firstCard = String(twoCards[0].charAt(0));
        let secondCard = String(twoCards[1].charAt(0));
        let finalFistCard = "";
        let finalSecondCard = "";

        if (secondCard == "A") {
            finalFistCard = secondCard;
            finalSecondCard = firstCard;
        } else if (secondCard == "K" && firstCard != "A") {
            finalFistCard = secondCard;
            finalSecondCard = firstCard;
        } else if (secondCard == "Q" && firstCard != "A" && firstCard != "K") {
            finalFistCard = secondCard;
            finalSecondCard = firstCard;
        } else if (secondCard == "J" && firstCard != "A" && firstCard != "K" && firstCard != "Q") {
            finalFistCard = secondCard;
            finalSecondCard = firstCard;
        } else if (secondCard == "T" && firstCard != "A" && firstCard != "K" && firstCard != "Q" && firstCard != "J") {
            finalFistCard = secondCard;
            finalSecondCard = firstCard;
        } else {
            if (firstCard == "A" || firstCard == "Q" || firstCard == "J" || firstCard == "T") {
                finalFistCard = firstCard;
                finalSecondCard = secondCard;
            } else {
                var firstCardNumber = parseInt(firstCard);
                var secondCardNumber = parseInt(secondCard);
                if (secondCardNumber > firstCardNumber) {
                    finalFistCard = secondCard;
                    finalSecondCard = firstCard;
                } else {
                    finalFistCard = firstCard;
                    finalSecondCard = secondCard;
                }
            }
        }
        return (finalFistCard + finalSecondCard);
    }

    preflopResponse(amount) {

        if (this.stackSize == 0) {
            return 0;
        }

        if (this.callRange.includes(this.simplePreFlop)) {
            this.stackSize = this.stackSize - amount;
            return 0;
        } else if (this.raiseRange.includes(this.simplePreFlop)) {
            if (amount == this.sb) {
                if (this.stackSize - this.sb < 0) { // you only have enough chips to almost call the sb but none for raising
                    var oldStackSize = this.stackSize;
                    this.stackSize = 0;
                    return 0;
                }
                this.stackSize = this.stackSize - this.sb;
                if (this.stackSize - (3 * this.bb) < 0) { // you've called the sb above now push the remaining chips for a raise
                    var oldStackSize = this.stackSize;
                    this.stackSize = 0;
                    return oldStackSize;
                }
                this.stackSize = this.stackSize - (3 * this.bb);
                return 3 * this.bb;
            } else if (amount > 0) {
                if (amount > this.stackSize) {
                    this.stackSize = 0;
                    return 0;
                }
                this.stackSize = this.stackSize - amount;
                if (amount > this.stackSize) {
                    var oldStackSize = this.stackSize;
                    this.stackSize = 0;
                    return oldStackSize;
                }
                this.stackSize = this.stackSize - amount;
                return amount;
            } else {
                if (this.stackSize < (this.bb * 3)) {
                    var oldStackSize = this.stackSize;
                    this.stackSize = 0;
                    return oldStackSize;
                }
                this.stackSize = this.stackSize - (this.bb * 3);
                return this.bb * 3;
            }
            
        } else if (this.threeBetRange.includes(this.simplePreFlop)) {
            if (amount == this.sb) {
                if (this.stackSize < this.sb) {
                    this.stackSize = 0;
                    return 0;
                }
                this.stackSize = this.stackSize - this.sb;
                if (this.stackSize < (3 * this.bb)) {
                    var oldStackSize = this.stackSize;
                    this.stackSize = 0;
                    return oldStackSize;
                }
                this.stackSize = this.stackSize - (3 * this.bb);
                return 3 * this.bb;
            } else if (amount > 0) {
                if (this.stackSize < amount) {
                    this.stackSize = 0;
                    return 0;
                }
                this.stackSize = this.stackSize - amount;
                if (this.stackSize < amount) {
                    var oldStackSize = this.stackSize;
                    this.stackSize = 0;
                    return oldStackSize;
                }
                this.stackSize = this.stackSize - amount;
                return amount;
            } else {
                if (this.stackSize < (3 * this.bb)) {
                    var oldStackSize = this.stackSize;
                    this.stackSize = 0;
                    return oldStackSize;
                } 
                this.stackSize = this.stackSize - (this.bb * 3);
                return this.bb * 3;
            }
        } else {
            if (amount > 0) {
                return -1;
            } else {
                return 0;
            }
        }
    }
    basicPreflopResponse(amount) {
        if (this.callRange.includes(this.simplePreFlop)) {
            return "all in";
        } else if (this.raiseRange.includes(this.simplePreFlop)) {
            return "all in";
        } else if (this.threeBetRange.includes(this.simplePreFlop)) {
            this.stackSize = this.stackSize - (this.bb * 3);
            return "all in";
        } else {
            return "check fold";
        }
    }
}