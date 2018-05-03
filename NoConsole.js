// Settings
var baseBet = 100; // In Ethos
var pctBet = 0.1; // Set more than 0 to activate percentage bet, it will overwrite basebet and use that percentage. Eg. 10 will use 10% of balance
var fixedbet = false; // Set to true to use base bet regardless of win or loss
var betIncrement = 2; // Each loss multiply by this number
var fixedMultiplier = false; // Set to true to use fixed multiplier(cashout) regardless of win or loss
var baseMultiplier = 1.08; // Target multiplier
var lossStreak1Multiplier = 1.25;
var lossStreak2Multiplier = 1.08;
var lossStreak3Multiplier = 1.08;
var lossStreak4Multiplier = 1.33;
var lossStreak5Multiplier = 1.33;
var lossStreak6Multiplier = 1.33;
var maximumBet = 999999; // Maximum bet the bot will do (in Ethos).
var randommode = false; // Randomly skip games. True or false
var randommin = 2; // Minimum random skip range limit
var randommax = 5; // Maximum random skip range limit

// Variables - do not change
var baseEthos = baseBet * 100; // Calculated
var currentBet = baseEthos;
var currentMultiplier = baseMultiplier;
var lossStreak = 0;
var randomgcount = Math.floor(Math.random() * (randommax - randommin)) + randommin;

// On a game starting, place the bet.
engine.on('game_starting', function(info) {

	if (randommode && randomgcount>0) { //if random mode is on, and within skip count, will not start game
	  randomgcount--;
	}
	else
	{
		if (engine.lastGamePlay() == 'LOST') { // If last game loss:
		lossStreak++;

		if (!fixedbet) currentBet *= betIncrement; // Change bet if it is not fixed.
		if (!fixedMultiplier){ // Change Multiplier if it is not fixed
		if (lossStreak == 1) {currentMultiplier = lossStreak1Multiplier;}
		if (lossStreak == 2) {currentMultiplier = lossStreak2Multiplier;}
		if (lossStreak == 3) {currentMultiplier = lossStreak3Multiplier;}
		if (lossStreak == 4) {currentMultiplier = lossStreak4Multiplier;}
		if (lossStreak == 5) {currentMultiplier = lossStreak5Multiplier;}
		if (lossStreak == 6) {currentMultiplier = lossStreak6Multiplier;}
		}
		
		}
		else { // Otherwise if win or first game:
		lossStreak = 0; // If it was a win, we reset the lossStreak.

		// Update bet.
		currentBet = baseEthos; // in Ethos
		var balnow = engine.getBalance();
		if (pctBet > 0) currentBet = (pctBet / 100) * balnow;	
		currentMultiplier = baseMultiplier;
		}

		if (currentBet <= engine.getBalance()) { // Ensure we have enough to bet
		    if (currentBet > (maximumBet * 100)) { // Ensure you only bet the maximum.
		        // Bet size exceeds maximum bet, lowering bet to maximumBet
		        currentBet = maximumBet;
            		}
		    engine.placeBet(Math.ceil(currentBet/100)*100, Math.round(currentMultiplier * 100), false);
				
    		}
    		else { // Otherwise insufficent funds...
        		if (engine.getBalance() < 100) {
     		 	// Insufficent funds to do anything... stopping
        		engine.stop();
        		}
        		else {
          		// Insufficent funds to bet , resetting to 1 Ethos basebet
          		baseBet = 1;
          		baseEthos = 100;
        		}
      		}

      		//set random count if random mode is on
   		if (randommode && randomgcount == 0) randomgcount = Math.floor(Math.random() * (randommax - randommin)) + randommin;
	}
});
