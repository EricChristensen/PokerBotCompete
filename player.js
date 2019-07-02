import c from './constants';
import Simulator from 'pokery';

export default class Player {

    constructor(preFlop, playerType) {
        this.preFlop = preFlop;
        this.simplePreflop = this.simplifiedPreflop(preFlop)
        this.cards = [];
        this.cards.concat(preFlop);
        this.playerType = playerType;
        this.setRanges(playerType)
    }

    setFlop(cards) {
        this.flop = cards;
        this.cards.concat(cards);
    }

    rangey() {
        let result = new Simulator([this.simplePreflop, '22'], this.flop).run();
        console.log(result);
    }

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

    simplifiedPreflop(cards) { // need to convert things like QAo or 79 to AQo and 97
        if (cards[0].charAt(0) == cards[1].charAt(0)) {
            return String(cards[0].charAt(0)) + String(cards[1].charAt(0)) ;
        } else if (cards[0].charAt(1) == cards[1].charAt(1)) { 
            return String(cards[0].charAt(0)) + String(cards[1].charAt(0)) + "s";
        } else {
            return String(cards[0].charAt(0)) + String(cards[1].charAt(0)) + "o";
        }
    }

    preflopResponse() {
        if (this.callRange.includes(this.simplePreFlop)) {
            return "call";
        } else if (this.raiseRange.includes(this.simplePreFlop)) {
            return "raise";
        } else if (this.threeBetRange.includes(this.simplePreFlop)) {
            return "3 bet";
        } else {
            return "check fold";
        }
    }

}