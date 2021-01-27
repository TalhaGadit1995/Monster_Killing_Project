const ATTACK_VALUE = 10; //Global Value 
const STRONG_ATTACK_VALUE = 18; //Global Value
const MONSTER_ATTACK_VALUE = 17; //Global Value
const HEAL_VALUE = 20; //Global Value



const MODE_ATTACK = 'Attack';
const MODE_STRONG_ATTACK = 'Strong_Attack';

const LOG_EVENT_PLAYER_ATTACK = 'Player_Attack';
const LOG_EVENT_PLAYER_STRONG_ATTACK= 'Player_Strong_Attack';
const LOG_EVENT_MONSTER_ATTACK = 'Monster_Attack';
const LOG_EVENT_PLAYER_HEAL = 'Player_Heal';
const LOG_EVENT_GAME_OVER = 'Game_Over';


const enteredValue = prompt('Set the maximum life for Health and Monster', '100');

let chooseMaxLife = parseInt(enteredValue);
let battleLog = [];
let lastLogEntry;

if (isNaN(chooseMaxLife) || chooseMaxLife <= 0){
  chooseMaxLife =  100;
}

let currentMonsterHealth = chooseMaxLife;
let currentPlayerHealth = chooseMaxLife;
let hasBonusLife = true;

adjustHealthBars(chooseMaxLife);

function writeTolog(ev, val, monsterHealth, playerHealth){
  let logEntry = {
    event: ev,
    value: val,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth
  };
  switch(ev){
    case LOG_EVENT_PLAYER_ATTACK:
      logEntry.target = 'Monster';
      break;
    case LOG_EVENT_PLAYER_STRONG_ATTACK:
      logEntry ={
        event: ev,
        value: val,
        target: 'Monster',
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
      };
      break;
    case LOG_EVENT_MONSTER_ATTACK:
      logEntry ={
        event: ev,
        value: val,
        target: 'Player',
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
      };
      break;
    case LOG_EVENT_PLAYER_HEAL:
      logEntry ={
        event: ev,
        value: val,
        target: 'Player',
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
      };
      break;
    case LOG_EVENT_GAME_OVER:
        logEntry ={
          event: ev,
          value: val,
          finalMonsterHealth: monsterHealth,
          finalPlayerHealth: playerHealth
        };
        break;
        default:
          logEntry = {};
  }
  // if(ev === LOG_EVENT_PLAYER_ATTACK){
  //   logEntry.target = 'Monster';
  // } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK){
  //     logEntry ={
  //     event: ev,
  //     value: val,
  //     target: 'Monster',
  //     finalMonsterHealth: monsterHealth,
  //     finalPlayerHealth: playerHealth
  //   };
    
  // } else if (ev === LOG_EVENT_MONSTER_ATTACK){
  //     logEntry ={
  //     event: ev,
  //     value: val,
  //     target: 'Player',
  //     finalMonsterHealth: monsterHealth,
  //     finalPlayerHealth: playerHealth
  //   };
    
  // } else if (ev === LOG_EVENT_PLAYER_HEAL){
  //     logEntry ={
  //     event: ev,
  //     value: val,
  //     target: 'Player',
  //     finalMonsterHealth: monsterHealth,
  //     finalPlayerHealth: playerHealth
  //   };
   
  // } else if ( ev === LOG_EVENT_GAME_OVER){
  //     logEntry ={
  //     event: ev,
  //     value: val,
  //     finalMonsterHealth: monsterHealth,
  //     finalPlayerHealth: playerHealth
  //   };
    
  // }
  battleLog.push(logEntry);
}
function reset(){
  currentMonsterHealth = chooseMaxLife;
  currentPlayerHealth = chooseMaxLife;
  resetGame(chooseMaxLife);
}

function endRound (){
  let initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage (MONSTER_ATTACK_VALUE)
  currentPlayerHealth -= playerDamage;
  writeTolog (
    LOG_EVENT_MONSTER_ATTACK, 
    playerDamage, 
    currentMonsterHealth, 
    currentPlayerHealth
    );

  if ( currentPlayerHealth <= 0 && hasBonusLife){
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    alert("You would almost dead but the bonus life save you")
    setPlayerHealth(initialPlayerHealth);
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0){
    alert('You Won');
    writeTolog (
      LOG_EVENT_GAME_OVER, 
      'Player Won', 
      currentMonsterHealth, 
      currentPlayerHealth
      );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0){
    alert('You Lost');
    writeTolog (
      LOG_EVENT_GAME_OVER, 
      'Monster Won', 
      currentMonsterHealth, 
      currentPlayerHealth
      );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0 ) {
    alert('Match Draw');
    writeTolog (
      LOG_EVENT_GAME_OVER, 
      'Draw', 
      currentMonsterHealth, 
      currentPlayerHealth
      );
  }

  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0){
    reset();
  }
}

function attackMonster(mode){
  const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  const logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;
  // if (mode === MODE_ATTACK){
  //   maxDamage = ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_ATTACK;
  // } else if (mode === MODE_STRONG_ATTACK){
  //   maxDamage = STRONG_ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  // }
  const damage = dealMonsterDamage (maxDamage)
  currentMonsterHealth -= damage;
  writeTolog (
    logEvent, 
    damage, 
    currentMonsterHealth, 
    currentPlayerHealth
    );
  endRound();
}

function onAttack(){
  attackMonster(MODE_ATTACK);
}

function onStrongAttack(){
  attackMonster(MODE_STRONG_ATTACK);
}

function onPlayerHeal (){
  let healvalue;
  if (currentPlayerHealth >= chooseMaxLife - HEAL_VALUE){
    alert("You can't heal more that you starting health");
    healvalue = chooseMaxLife - currentPlayerHealth;
  } else {
    healvalue =HEAL_VALUE;
  }
  increasePlayerHealth(HEAL_VALUE);
  currentPlayerHealth += HEAL_VALUE
  writeTolog (
    LOG_EVENT_PLAYER_HEAL, 
    healvalue, 
    currentMonsterHealth, 
    currentPlayerHealth
    );
  endRound();

}

function onBattleLog (){
  // for (let i = 0; i< battleLog.length; i++){
  //   console.log(battleLog[i]);
  // }
  let i = 0;
  // for( const logEntry of battleLog){
  //   console.log(logEntry);
  
  //   console.log(i);
  //   i++;
  // }
  for (const logEntry of battleLog){
    if((!lastLogEntry && lastLogEntry !==0) || lastLogEntry < i){
      console.log (`#${i}`);
      for (const key in logEntry){
        console.log(`${key} => ${logEntry[key]}`);
      }
      lastLogEntry = i;
      break;
    }
    i++;
  }

}

attackBtn.addEventListener('click', onAttack);
strongAttackBtn.addEventListener('click', onStrongAttack);
healBtn.addEventListener('click', onPlayerHeal);
logBtn.addEventListener('click',onBattleLog);
