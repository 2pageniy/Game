class WhoWon {
    constructor(move, computerMove, choices) {
        this.move = move;
        this.computerMove = computerMove;
        this.choices = choices;
    }

    winner() {
        let flag = false;
        let half = (this.choices.length - 1) / 2;
        if(this.move === this.computerMove) {
            console.log('Draw.');
        } else {
            for (let i = 0; i <= half; i++) {
                if((this.move + i)%choices.length === this.computerMove) {
                    flag = true;
                    break;
                }
            } flag ? console.log('You win!') : console.log('Computer win!');
        }
    }
}

class GenerateTable {

    tableWhoWin(choices) {
        let map = {};
        choices.forEach(function (choice, index) {
            map[choice] = {};
            for(let j = 0, half = (choices.length - 1) / 2; j < choices.length; j++) {
                let opposition = (index+j)%choices.length;
                if(!j) map[choice][choice] = 'draw';
                else if(j <= half) map[choice][choices[opposition]] = `${choice} win`;
                else map[choice][choices[opposition]] = `${choices[opposition]} win`;
            }
        })
        console.table(map);
    }
}

class  GenerateKey {

    createKey() {
        this.key = crypto.randomBytes(256).toString('hex');
        this.createHashKey(this.key);
    }

    createHashKey(key) {
        this.hashKey = crypto.createHash('sha256')
            .update(key)
            .digest('hex');
    }
}

class HMAC_Generation extends GenerateKey{
    constructor(computerMove) {
        super();
        this.createKey();
        this.move = computerMove;
    }

    generateHMAC() {
        console.log(`HMAC: ${crypto.createHmac('sha256', this.hashKey)
                                .update(this.move)
                                .digest('hex')}`);
    }

    keyHMAC() {
        console.log(`HMAC key: ${this.hashKey}`);
    }
}

function hasDuplicatesElement(array) {
    return array.some(function(value) {
        return array.indexOf(value) !== array.lastIndexOf(value);
    })
}


const readline = require('readline-sync');
const crypto = require('crypto');

const choices = process.argv.slice(2);

if(choices.length % 2 === 0 || choices.length < 3 || hasDuplicatesElement(choices)) {
    console.log('Error, please enter correct. Example: rock paper scissors.')
} else {

    let computerMove = Math.floor(Math.random()*choices.length);
    const hmac = new HMAC_Generation(choices[computerMove]);
    const generateTable = new GenerateTable();
    hmac.generateHMAC();
    console.log('Available moves:');
    choices.forEach((item, index) => console.log(`${index + 1} - ${item}`));
    console.log('0 - exit\n? - help');

    while (true) {
        let move = readline.question('Enter your move: ');
        if (move === '0') break;
        if (move === '?') {
            generateTable.tableWhoWin(choices);
        }
        else if(move >= 1 && move <= choices.length) {
            const whoWon = new WhoWon(move - 1, computerMove, choices);
            console.log(`You move: ${choices[move - 1]}`);
            console.log(`Computer move: ${choices[computerMove]}`);
            whoWon.winner();
            hmac.keyHMAC();
            break;
        } else {
            console.log('Error, enter correct number.');
        }
    }

}
