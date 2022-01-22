(function($){
    var scorePlayer = document.getElementById("score-player");
    var scoreEnemy = document.getElementById("score-enemy");
    var betIDvar = document.getElementById('betID');
    var moneyIDvar = document.getElementById('moneyID');
       
/* Deal button, new game */
document.querySelector('#deal').addEventListener('click', newGameDeal);
    
function cardToDisplayPlayersTurn(card){
    $('.card-container-player').append("<div class='" + card + " card'></div>");
}
function cardToDisplayBack(){
    $('.card-container-enemy').append("<div class='back-card card'></div>");
}
function cardToDisplayBotTurn(card){
    $('.card-container-enemy').append("<div class='" + card + " card'></div>");
}
    let cardUsed = "";
    let cardNumLimit = 0;
    let cardPointLimitPlayer = 0;
    let cardPointLimitEnemy = 0;
    let executionOnceVal = 0;
    /* Money variables and functions */
    let playersMoney = 50;
    let betVal = 0;
   
    function displayPlayersMoney(moneyVal){
        moneyIDvar.innerHTML = moneyVal;
    }
    displayPlayersMoney(playersMoney);
    /* Pop-up asking for bet variables and functions*/
    
    function popAppear(elementVal){
        $(elementVal).removeClass('hide-element');
    };
    function disappearElement(elementVal){
        $(elementVal).addClass('hide-element');
    }
    function animateDisappear(elementVal){
        $(elementVal).removeClass('appearAnimate');
        $(elementVal).addClass('disappearAnimate');
    }
    function animateAppear(elementVal){
        $(elementVal).removeClass('disappearAnimate');
        $(elementVal).addClass('appearAnimate');
    }
    function animateDisappearOverlay(elementVal){
        $(elementVal).removeClass('appearAnimate-overlay');
        $(elementVal).addClass('appearAnimate-overlay-out');
    }
    function animateAppearOverlay(elementVal){
        $(elementVal).removeClass('appearAnimate-overlay-out');
        $(elementVal).addClass('appearAnimate-overlay');
    }
    function animateAppearBetBox(){
        animateAppearOverlay('div.overlay-text')
        animateAppear('.bet-box')
        animateAppear('.bet-box h2')
        animateAppear('.bet-box input')
        animateAppear('.bet-box h4')
        animateAppear('.bet-box button')
    }
    function animateDisappearBetBox(){
        animateDisappearOverlay('div.overlay-text')
        animateDisappear('.bet-box')
        animateDisappear('.bet-box h2')
        animateDisappear('.bet-box input')
        animateDisappear('.bet-box h4')
        animateDisappear('.bet-box button')
    }
    /* Pop-up Disappear */
    $('#close-btn-id').click(function (){
        disappearElement('.option-box');
    })

    $('#settings-btn-id').click(function (){
        popAppear('.option-box');
    })

    $('#sendBet').click(function popHidden(){
        betVal = $('#inputBet').val();
        if(playersMoney<=0){
            popAppear('div.overlay-text2');
        }else if(betVal<=0 || betVal>playersMoney){
            if(executionOnceVal<=0){
                popAppear('#alert-text');
                executionOnceVal++;
                console.log(executionOnceVal)
                console.log(betVal)
            }
        }else{
            animateDisappearBetBox()
            initialBotAction()
            executionOnceVal--
           // disappearElement('#alert-text');
            displayBetVal(betVal)
            playersMoney-=betVal;
            displayPlayersMoney(playersMoney)
        }
    });
    /* Display Bet Value */
    function displayBetVal(betValue){
        betIDvar.innerHTML = betValue;
    }
    /* Card Deck */
    const cardDeck = ["back",
                        /*heart*/"aceh","twoh","threeh","fourh","fiveh","sixh","sevenh","eighthh","nineh","tenh","jackh","queenh","kingh",
                        /*spade*/"aces","twos","threes","fours","fives","sixs","sevens","eighths","nines","tens","jacks","queens","kings",
                        /*diamond*/"aced","twod","threed","fourd","fived","sixd","sevend","eighthd","nined","tend","jackd","queend","kingd",
                        /*diamond*/"acec","twoc","threec","fourc","fivec","sixc","sevenc","eighthc","ninec","tenc","jackc","queenc","kingc"];

    $('#stand').click(function standBtn(){ 
        remover()
        botMind();
        winnerDecider()
        overlaying()
    })

    const standBtn = () =>{ 
        remover()
        botMind();
        winnerDecider()
        overlaying()
    }

    const overlaying = () =>{
        if(cardPointLimitEnemy<cardPointLimitPlayer){
            popAppear('#after-stand-win');
        }else if(cardPointLimitEnemy==cardPointLimitPlayer){
            popAppear('#after-stand-draw');
        }else{
            popAppear('#after-stand-lose');
        }
       
    }

    $('.overlay-text4').click(() => {
        disappearElement('.overlay-text4');
            if(playersMoney<=0){
                popAppear('.overlay-text2');   
            }else{
                newGameDeal()
            } 
    })

    const evaluateCardVal = (cardAlreadyUsed, cardToEvaluate) => {
        if(cardNumLimit<52){
            if(cardAlreadyUsed.indexOf(cardToEvaluate)!==-1){
                return false;
            }else{
                return true;
            }
        }else{
            return;
        }
       
    }
    
    $('#hit').click(function hitBtn(){ 
            if(cardNumLimit<52){
                if(cardPointLimitPlayer<22){
                        let randomIndex = Math.floor(Math.random()*52)+1;
                        console.log(randomIndex)
                        function cardVal(randomVal){
                            let valToAdd = 0;
                            if(randomVal>1 && randomVal<=10){
                                valToAdd = randomIndex;
                            }else if(randomVal>14 && randomVal<=22){
                                valToAdd = randomIndex-13;
                            }else if(randomVal>27 && randomVal<=35){
                                valToAdd = randomIndex-26;
                            }else if(randomVal>40 && randomVal<=48){
                                valToAdd = randomIndex-39;
                            }else if(randomVal>10 && randomVal<14){
                                valToAdd  = 10;
                            }else if(randomVal>22 && randomVal<27){
                                valToAdd  = 10;
                            }else if(randomVal>35 && randomVal<40){
                                valToAdd  = 10;
                            }else if(randomVal>48 && randomVal<53){
                                valToAdd  = 10;
                            }else if(randomVal==1 || randomVal==14 || randomVal==27 || randomVal==40){
                                if(cardPointLimitPlayer<11){
                                    valToAdd = 11;
                                }else{
                                    valToAdd = 1;
                                }  
                            }
                            return valToAdd;
                        }
                        let cardNumValToAdd = cardVal(randomIndex);
                        let cardTextToAdd = textToAdd(randomIndex);
                        let evaluateCard = evaluateCardVal(cardUsed, cardTextToAdd)
                        /* if evaluateCard is true the program should run*/
                        if(evaluateCard){
                            cardPointLimitPlayer += cardNumValToAdd; 
                            console.log("card point " + cardPointLimitPlayer);
                            if(cardPointLimitPlayer <=21){
                                textToAddInside(randomIndex, cardToDisplayPlayersTurn);
                                scorePlayer.innerHTML = cardPointLimitPlayer;
                            }else{
                                scorePlayer.innerHTML = "Busted!";
                                cardPointLimitEnemy = 50;
                                standBtn();
                            }
                        }else{
                            hitBtn();
                        }
                    }else{
                        return;
                    }
            }else{
                popAppear('div.overlay-text3');
            }
    })
    function randomCardEnemy(){ 
        if(cardPointLimitEnemy<22 && cardNumLimit<=52){
                let randomIndex = Math.floor(Math.random()*52)+1;
                
                function cardVal(randomVal){
                    let valToAdd = 0;
                    if(randomVal>1 && randomVal<=10){
                        valToAdd = randomIndex;
                    }else if(randomVal>14 && randomVal<=22){
                        valToAdd = randomIndex-13;
                    }else if(randomVal>27 && randomVal<=35){
                        valToAdd = randomIndex-26;
                    }else if(randomVal>40 && randomVal<=48){
                        valToAdd = randomIndex-39;
                    }else if(randomVal>10 && randomVal<14){
                        valToAdd  = 10;
                    }else if(randomVal>22 && randomVal<27){
                        valToAdd  = 10;
                    }else if(randomVal>35 && randomVal<40){
                        valToAdd  = 10;
                    }else if(randomVal>48 && randomVal<53){
                        valToAdd  = 10;
                    }else if(randomVal==1 || randomVal==14 || randomVal==27 || randomVal==40){
                        if(cardPointLimitPlayer<=11){
                            valToAdd = 11;
                        }else{
                            valToAdd = 1;
                        }
                        
                    }
                    return valToAdd;
                }
                pointTrackEnemy(randomIndex, cardVal, evaluateCardVal)
            }
        }

function pointTrackEnemy(ranIndex, caVal, evalcaVal){
    if(cardNumLimit<52){
        console.log(cardNumLimit)
        let cardNumValToAdd = caVal(ranIndex);
        let cardTextToAdd = textToAdd(ranIndex);
        let evaluateCard = evalcaVal(cardUsed, cardTextToAdd)
            if(evaluateCard){
                cardPointLimitEnemy += cardNumValToAdd; 
                console.log("card point " + cardPointLimitEnemy);
            if(cardPointLimitEnemy <=21){
                textToAddInside(ranIndex, cardToDisplayBotTurn);
                scoreEnemy.innerHTML = cardPointLimitEnemy;
            }else{
                scoreEnemy.innerHTML = "Busted!";
                cardPointLimitPlayer = 50;
            }
        }else{
            randomCardEnemy();
        }
    }else{
        return;
    }
      
}
function botMind(){
    for(let i=0; i<=4; i++){
        if(cardPointLimitEnemy <= 14){
            randomCardEnemy()
        }else{
            console.log("Fight")
        }
    }
}
    function initialBotAction(){
        randomCardEnemy()
        cardToDisplayBack()
    }
    function winnerDecider(){
        let WinLose = document.getElementById("status-declaration");

        if(cardPointLimitEnemy<cardPointLimitPlayer){
            WinLose.innerHTML = "You Win!"
            playersMoney = playersMoney+(betVal*2);
            moneyIDvar.innerHTML = playersMoney;
            betVal = 0;
            betIDvar.innerHTML = betVal;  
            console.log(playersMoney+=betVal);
        }else if(cardPointLimitEnemy==cardPointLimitPlayer){
            WinLose.innerHTML = "Draw"
            playersMoney = parseInt(playersMoney);
            betVal = parseInt(betVal);
            playersMoney+=betVal;
            moneyIDvar.innerHTML = playersMoney;
        }else{
            WinLose.innerHTML = "You Lose!"
            betVal = 0;
            betIDvar.innerHTML = betVal;
        }
    }
    function remover(){
        $('div').remove('.back-card');
    }   
    function newGameDeal(){
        let cardImageEnemy = document.querySelector('.card-container-enemy').querySelectorAll('div');
        let cardImagePlayer = document.querySelector('.card-container-player').querySelectorAll('div');
        for(let i=0; i<cardImageEnemy.length; i++){
            cardImageEnemy[i].remove();
        }
        for(let i=0; i<cardImagePlayer.length; i++){
            cardImagePlayer[i].remove();
        }
        scorePlayer.innerHTML = 0;
        scoreEnemy.innerHTML = 0;
        
        cardPointLimitPlayer = 0;
        cardPointLimitEnemy = 0;

        animateAppearBetBox()
    }
const textToAdd = randomNumVal =>{
        let textVal = "";
        textVal = cardDeck[randomNumVal]; 
        return textVal;
}
    const textToAddInside = (randomNumVal, cardToDisplayWhosTurn) => {
        
        if(cardNumLimit < 52){
                if(randomNumVal == 1){
                    if(cardUsed.indexOf(cardDeck[1])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[1];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[1])
                    }
                }
                if(randomNumVal == 2){
                    if(cardUsed.indexOf(cardDeck[2])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[2];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[2]);
                    } 
                }
                if(randomNumVal == 3){
                    if(cardUsed.indexOf(cardDeck[3])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[3];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[3]);
                    } 
                }
                if(randomNumVal==4){
                    if(cardUsed.indexOf(cardDeck[4])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[4];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[4]);
                    } 
                }
                if(randomNumVal==5){
                    if(cardUsed.indexOf(cardDeck[5])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[5];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[5]);
                    } 
                }
                if(randomNumVal==6){
                    if(cardUsed.indexOf(cardDeck[6])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[6];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[6]);
                    } 
                }
                if(randomNumVal==7){
                    if(cardUsed.indexOf(cardDeck[7])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[7];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[7]);
                    } 
                }
                if(randomNumVal==8){
                    if(cardUsed.indexOf(cardDeck[8])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[8];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[8]);
                    } 
                }
                if(randomNumVal==9){
                    if(cardUsed.indexOf(cardDeck[9])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[9];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[9]);
                    } 
                }
                if(randomNumVal==10){
                    if(cardUsed.indexOf(cardDeck[10])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[10];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[10]);
                    } 
                }
                if(randomNumVal==11){
                    if(cardUsed.indexOf(cardDeck[11])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[11];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[11]);
                    } 
                }
                if(randomNumVal==12){
                    if(cardUsed.indexOf(cardDeck[12])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[12];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[12]);
                    } 
                }
                if(randomNumVal==13){
                    if(cardUsed.indexOf(cardDeck[13])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[13];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[13]);
                    } 
                }
                //spade
                if(randomNumVal==14){
                    if(cardUsed.indexOf(cardDeck[14])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[14];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[14]);
                    } 
                }
                if(randomNumVal==15){
                    if(cardUsed.indexOf(cardDeck[15])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[15];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[15]);
                    } 
                }
                if(randomNumVal==16){
                    if(cardUsed.indexOf(cardDeck[16])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[16];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[16]);
                    } 
                }
                if(randomNumVal==17){
                    if(cardUsed.indexOf(cardDeck[17])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[17];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[17]);
                    } 
                }
                if(randomNumVal==18){
                    if(cardUsed.indexOf(cardDeck[18])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[18];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[18]);
                    } 
                }
                if(randomNumVal==19){
                    if(cardUsed.indexOf(cardDeck[19])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[19];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[19]);
                    } 
                }
                if(randomNumVal==20){
                    if(cardUsed.indexOf(cardDeck[20])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[20];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[20]);
                    } 
                }
                if(randomNumVal==21){
                    if(cardUsed.indexOf(cardDeck[21])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[21];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[21]);
                    } 
                }
                if(randomNumVal==22){
                    if(cardUsed.indexOf(cardDeck[22])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[22];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[22]);
                    } 
                }
                if(randomNumVal==23){
                    if(cardUsed.indexOf(cardDeck[23])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[23];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[23]);
                    } 
                }
                if(randomNumVal==24){
                    if(cardUsed.indexOf(cardDeck[24])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[24];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[24]);
                    } 
                }
                if(randomNumVal==25){
                    if(cardUsed.indexOf(cardDeck[25])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[25];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[25]);
                    } 
                }
                if(randomNumVal==26){
                    if(cardUsed.indexOf(cardDeck[25])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[25];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[25]);
                    } 
                }
                 //diamond
                 if(randomNumVal==27){
                    if(cardUsed.indexOf(cardDeck[27])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[27];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[27]);
                    } 
                }
                if(randomNumVal==28){
                    if(cardUsed.indexOf(cardDeck[28])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[28];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[28]);
                    } 
                }
                if(randomNumVal==29){
                    if(cardUsed.indexOf(cardDeck[29])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[29];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[29]);
                    } 
                }
                if(randomNumVal==30){
                    if(cardUsed.indexOf(cardDeck[30])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[30];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[30]);
                    } 
                }
                if(randomNumVal==31){
                    if(cardUsed.indexOf(cardDeck[31])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[31];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[31]);
                    } 
                }
                if(randomNumVal==32){
                    if(cardUsed.indexOf(cardDeck[32])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[32];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[32]);
                    } 
                }
                if(randomNumVal==33){
                    if(cardUsed.indexOf(cardDeck[33])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[33];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[33]);
                    } 
                }
                if(randomNumVal==34){
                    if(cardUsed.indexOf(cardDeck[34])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[34];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[34]);
                    } 
                }
                if(randomNumVal==35){
                    if(cardUsed.indexOf(cardDeck[35])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[35];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[35]);
                    } 
                }
                if(randomNumVal==36){
                    if(cardUsed.indexOf(cardDeck[36])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[36];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[36]);
                    } 
                }
                if(randomNumVal==37){
                    if(cardUsed.indexOf(cardDeck[37])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[37];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[37]);
                    } 
                }
                if(randomNumVal==38){
                    if(cardUsed.indexOf(cardDeck[38])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[38];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[38]);
                    } 
                }
                if(randomNumVal==39){
                    if(cardUsed.indexOf(cardDeck[39])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[39];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[39]);
                    } 
                }
                //clover
                 if(randomNumVal==40){
                    if(cardUsed.indexOf(cardDeck[40])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[40];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[40]);
                    } 
                }
                if(randomNumVal==41){
                    if(cardUsed.indexOf(cardDeck[41])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[41];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[41]);
                    } 
                }
                if(randomNumVal==42){
                    if(cardUsed.indexOf(cardDeck[42])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[42];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[42]);
                    } 
                }
                if(randomNumVal==43){
                    if(cardUsed.indexOf(cardDeck[43])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[43];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[43]);
                    } 
                }
                if(randomNumVal==44){
                    if(cardUsed.indexOf(cardDeck[44])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[44];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[44]);
                    } 
                }
                if(randomNumVal==45){
                    if(cardUsed.indexOf(cardDeck[45])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[45];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[45]);
                    } 
                }
                if(randomNumVal==46){
                    if(cardUsed.indexOf(cardDeck[46])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[46];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[46]);
                    } 
                }
                if(randomNumVal==47){
                    if(cardUsed.indexOf(cardDeck[47])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[47];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[47]);
                    } 
                }
                if(randomNumVal==48){
                    if(cardUsed.indexOf(cardDeck[48])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[48];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[48]);
                    } 
                }
                if(randomNumVal==49){
                    if(cardUsed.indexOf(cardDeck[49])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[49];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[49]);
                    } 
                }
                if(randomNumVal==50){
                    if(cardUsed.indexOf(cardDeck[50])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[50];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[50]);
                    } 
                }
                if(randomNumVal==51){
                    if(cardUsed.indexOf(cardDeck[51])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[51];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[51]);
                    } 
                }
                if(randomNumVal==52){
                    if(cardUsed.indexOf(cardDeck[52])!==-1){
                        hitBtn()
                    }else{
                        cardUsed = cardUsed + cardDeck[52];
                        cardNumLimit+=1;
                        console.log("cardNumLimit " + cardNumLimit);
                        cardToDisplayWhosTurn(cardDeck[52]);
                    } 
                }
            }
    }
})(jQuery);