const name=['Rat Lv.1', 'Rat Lv.3', 'Crow Lv.6', 'Wolf Lv.9', 'Scorpion Lv.12', 'Cobra Lv.14', 'Worm Lv.14', 'Goblin Lv.15', 'Mummy Lv.25', 'Pharaoh Lv.35', 'Assasin Lv.45', 'Assasin Lv.50', 'Assasin Ninja Lv.55', 'Zombie Lv.65', 'Skeleton Lv.75', 'Skeleton Archer Lv.80', 'Skeleton Warrior Lv.90', 'Vampire Lv.100', 'Vampire Lv.110', 'Drow Assasin Lv.125', 'Drow Ranger Lv.120', 'Drow Mage Lv.130', 'Drow Fighter Lv.135', 'Drow Sorceress Lv.140', 'Lizard Warrior Lv.150', 'Lizard Archer Lv.160', 'Lizard Shaman Lv.170', 'Lizard Captain Lv.180', 'Lizard High-Shaman Lv.190', 'Djinn Lv.150', 'Dead Eyes Lv.170', 'Gargoyle Lv.190', 'Minotaur Lv.225', 'Minotaur Lv.250', 'Minotaur Lv.275', 'Dragon Lv.250', 'Dragon Hatchling Lv.240', 'Dragon Warden Lv.280', 'Ice Elemental Lv.300', 'Ice Dragon Lv.320', 'Yeti Lv.350'];
const def=[4, 7, 13, 17, 18, 18, 19, 21, 36, 51, 71, 81, 91, 106, 121, 101, 146, 171, 186, 221, 191, 191, 246, 221, 301, 271, 276, 361, 326, 301, 276, 326, 511, 591, 681, 501, 331, 626, 676, 726, 826, -1, -1, -1];
const hp=[25, 35, 40, 50, 50, 50, 55, 60, 80, 100, 120, 140, 160, 200, 300, 300, 375, 450, 530, 620, 600, 600, 680, 650, 600, 815, 740, 640, 600, 740, 4250, 5000, 5750, 20000, 10000, 30000, 40000, 50000, 60000, 65000, -1, -1];
let tempHp=new Array(41).fill(0);
function rng(min, max){
	return parseInt(Math.floor(Math.random()*(max-min+1))+min);
}
function option(target, task){
	let id=document.querySelector('#manual');
	id=id.querySelectorAll('option');
	if(task==='disableA'){
		id[target].disabled=true;
		id[target].innerHTML=name[target]+' (too strong)';
	}
	else if(task==='disableB'){
		id[target].disabled=true;
		id[target].innerHTML=name[target]+' (too weak)';
	}
	else if(task==='enable'){
		id[target].disabled=false;
		id[target].innerHTML=name[target];
	}
}
function findBest(arr1, arr2, arr3, arr4, nth){
//let max1, max2, min3, max4, count=0;
//	max1=Math.max(...arr1), max2=Math.max(...arr2), min3=Math.min(...arr3), max4=Math.max(...arr4);
//	for(let i=0; i<41; i++){
//		if(arr1[i]==max1 && arr2[i]==max2 && arr3[i]==min3 && arr4[i]==max4){
//			if(count===nth){
//				console.log(`${i}`);
//				return i;
//			}
//			count++;
//		}
//	}
//	return -1;
//}
	let score=new Array(41), sorted=new Array(41);
	for(let i=0; i<41; i++){
		if(arr2[i]>3550){
			continue;
		}
		else{
			score[i]=arr1[i]+arr2[i]+arr4[i];
			score[i]-=arr3[i];
			if(arr2[i]>3100){
				score[i]+=500;
			}
			if(arr2[i]<2500){
				score[i]-=500;
			}
			if(arr4[i]>=90 && arr4[i]<=270){
				score[i]+=500;
			}
			if(arr4[i]<90 || arr4[i]>270){
				score[i]-=500;
			}
		}
	}
	
	sorted.splice(0, score.length, ...score);
	sorted.sort((a, b)=>b-a);
	for(let i=0; i<41; i++){
		if(score[i]===sorted[nth]){
			if(score[i]===-1){
				return -1;
			}
			else{
				return i;
			}
		}
	}
}
function handleSubmitInfo(event, levelInput){
	event.preventDefault();
	const level=parseInt(levelInput.value);
	let exp=level**(level/1000+3);
	let exp2=(level+1)**((level+1)/1000+3);
	let hp=100+(level*15);
	let mp=100+(level*10);
	let speed=200+(level/2);
	exp=parseInt(exp), exp2=parseInt(exp2), hp=parseInt(hp), mp=parseInt(mp), speed=parseInt(speed);
	document.getElementById('info-res').classList.add('highlight');
	document.getElementById('exp-res').textContent=`Experience: ${exp} to ${exp2}`;
	document.getElementById('hp-res').textContent=`Max health: ${hp}`;
	document.getElementById('mp-res').textContent=`Max mana: ${mp}`;
	document.getElementById('speed-res').textContent=`Speed (no buff): ${speed}`;
	document.getElementById('exp-res').innerHTML=document.getElementById('exp-res').textContent;
	document.getElementById('hp-res').innerHTML=document.getElementById('hp-res').textContent;
	document.getElementById('mp-res').innerHTML=document.getElementById('mp-res').textContent;
	document.getElementById('speed-res').innerHTML=document.getElementById('speed-res').textContent;
	document.getElementById('info-res').style.display="block";
}
function handleSubmitDmg(event, levelInput, statInput, atkInput, index){
	event.preventDefault();
	const mode=document.querySelector('input[name="dmg-mode"]:checked').value;
	const type=document.querySelector('input[name="dmg-type"]:checked').value;
	const level=parseInt(levelInput.value), stat=parseInt(statInput.value), atk=parseInt(atkInput.value);
	let minDmg, maxDmg, chance, ohko;
	minDmg=(stat*atk/20)+(level/4), maxDmg=(stat*atk/10)+(level/4);
	if(mode==='special'){	
		if(type!='magic'){
			minDmg*=1.5, maxDmg*=1.5;
		}
		else{
			minDmg=1.5*((1.05*stat*atk/20)+(9*level/32)), maxDmg=1.5*((1.05*stat*atk/10)+(9*level/32));
		}
	}
	minDmg-=def[index], maxDmg-=def[index];
	minDmg=parseInt(minDmg), maxDmg=parseInt(maxDmg);
	chance=maxDmg/(maxDmg-minDmg)*100;
	ohko=(maxDmg-hp[index]+1)/(maxDmg-minDmg+1)*100;
	if(chance>100){
		chance=100;
	}
	else if(chance<0){
		chance=0;
	}
	if(ohko>100){
		ohko=100;
	}
	else if(ohko<0){
		ohko=0;
	}
	document.getElementById('dmg-res').classList.add('highlight');
	document.getElementById('dmg-mode-res').textContent=`Mode: ${mode} attack`;
	document.getElementById('dmg-type-res').textContent=`Type: ${type}`;
	document.getElementById('minDmg-res').textContent=`Minimum damage: ${minDmg}`;
	document.getElementById('maxDmg-res').textContent=`Maximum damage: ${maxDmg}`;
	document.getElementById('chance-res').textContent=`Chance of damage: ${chance}%`;
	document.getElementById('ohko-res').textContent=`Chance of OHKO: ${ohko}%`;
	document.getElementById('dmg-mode-res').innerHTML=document.getElementById('dmg-mode-res').textContent;
	document.getElementById('dmg-type-res').innerHTML=document.getElementById('dmg-type-res').textContent;
	document.getElementById('minDmg-res').innerHTML=document.getElementById('minDmg-res').textContent;
	document.getElementById('maxDmg-res').innerHTML=document.getElementById('maxDmg-res').textContent;
	document.getElementById('chance-res').innerHTML=document.getElementById('chance-res').textContent;
	document.getElementById('ohko-res').innerHTML=document.getElementById('ohko-res').textContent;
	document.getElementById('dmg-res').style.display="block";
}
document.querySelector('#train-form').addEventListener('submit', function handleSelectTrain(event){
	event.preventDefault();
	document.getElementById('name').textContent=``;
	document.getElementById('tick').textContent=``;
	document.getElementById('tick3600').textContent=``;
	document.getElementById('elapsed').textContent=``;
	document.getElementById('dps').textContent=``;
	document.getElementById('arrow').textContent=``;
	document.getElementById('mana').textContent=``;
	const level=document.getElementById('train-lvl').value;
	const stat=document.getElementById('train-stat').value;
	const atk=document.getElementById('train-atk').value;
	let sim=document.getElementById('train-sim').value;
	let minDmg=new Array(41).fill(0), maxDmg=new Array(41).fill(0), dps=new Array(42).fill(0), tick=new Array(42).fill(0), tick3600=new Array(42).fill(0), elapsed=new Array(42).fill(0), arrow=new Array(42).fill(0), mana=new Array(41).fill(0);
	let dmgRoll, tenSecond;
	for(let i=0; i<41; i++){
		minDmg[i]=(stat*atk/20)+(level/4)-def[i];
		maxDmg[i]=(stat*atk/10)+(level/4)-def[i];
		dps[41]=tick[41]=elapsed[41]=arrow[41]=0;
		if(minDmg[i]>hp[i]){
			dps[i]=minDmg[i];
			tick[i]=1;
			elapsed[i]=1;
			arrow[i]=1;
			mana[i]=4;
			//console.log(`dmg: TOO STRONG\ni: ${i}\nhp: ${hp[i]}\nminDmg: ${minDmg[i]}\nmaxDmg: ${maxDmg[i]}\nDPS: ${dps[i]}\ntick: ${tick[i]}\ntick3600: ${tick3600[i]}\nelapsed: ${elapsed[i]}\narrow: ${arrow[i]}\nmana: ${mana[i]}`);
			continue;
		}
		else if(maxDmg[i]<1){
			dps[i]=-1;
			tick[i]=-1;
			elapsed[i]=-1;
			arrow[i]=-1;
			mana[i]=-4;
			//console.log(`dmg: TOO WEAK\ni: ${i}\nhp: ${hp[i]}\nminDmg: ${minDmg[i]}\nmaxDmg: ${maxDmg[i]}\nDPS: ${dps[i]}\ntick: ${tick[i]}\ntick3600: ${tick3600[i]}\nelapsed: ${elapsed[i]}\narrow: ${arrow[i]}\nmana: ${mana[i]}`);	
			continue;
		}
		for(var j=0; j<sim; j++){
			tempHp[i]=hp[i];
			tenSecond=0;
			while(tempHp[i]>0){
				dmgRoll=rng(minDmg[i], maxDmg[i]);
				//console.log(`j: ${j}\ndamage log ${elapsed[41]}: ${dmgRoll}`);
				if(dmgRoll<0){
					dmgRoll=0;
				}
				else{
					tenSecond=10;
				}
				if(tenSecond>0){
					tick[41]++;
					tenSecond--;
				}
				tempHp[i]-=dmgRoll;
				dps[41]+=dmgRoll;
				elapsed[41]++;
				arrow[41]++;
			}
			dps[i]+=dps[41], tick[i]+=tick[41], elapsed[i]+=elapsed[41], arrow[i]+=arrow[41];
			dps[i]/=sim, tick[i]/=sim, elapsed[i]/=sim, arrow[i]/=sim;
			tick[i]=parseInt(tick[i]), elapsed[i]=parseInt(elapsed[i]), arrow[i]=parseInt(arrow[i]);
			tick3600[i]=3600/elapsed[i]*tick[i];
			mana[i]=arrow[i]*4;
			mana[i]=(mana[i]/4)*4;
			dps[i]=parseInt(dps[i]), mana[i]=parseInt(mana[i]);
		}
		//console.log(`dmg: NORMAL\ni: ${i}\nhp: ${hp[i]}\nminDmg: ${minDmg[i]}\nmaxDmg: ${maxDmg[i]}\nDPS: ${dps[i]}\ntick: ${tick[i]}\ntick3600: ${tick3600[i]}\nelapsed: ${elapsed[i]}\narrow: ${arrow[i]}\nmana: ${mana[i]}`);
	}
	//console.log('simulation done.');
	for(let i=0; i<41; i++){
		if(minDmg[i]>hp[i]){
			option(i, 'disableA');
		}
		else if(maxDmg[i]<1){
			option(i, 'disableB');
		}
		else{
			option(i, 'enable');
		}	
	}
	document.getElementById('train-mob').options[0].selected=true;
	document.getElementById('train-mob').removeAttribute('disabled');
	document.getElementById('train-mob').addEventListener('change', function handleSelectTrain(){
		let index=parseInt(document.getElementById('train-mob').value);
		if(index===41){
			index=findBest(tick, tick3600, dps, elapsed, 0);
			document.getElementById('name').textContent=`Mob name: ${name[index]}`;
			if(tick[index]===-1){
				document.getElementById('name').textContent=`No good recommendation found, try changing your weapon attack or search manually that fits you.`;
			}
		}
		else if(index===42){
			index=findBest(tick, tick3600, dps, elapsed, 1);
			document.getElementById('name').textContent=`Mob name: ${name[index]}`;
			if(tick[index]===-1){
				document.getElementById('name').textContent=`No good recommendation found, try changing your weapon attack or search manually that fits you.`;
			}
		}
		else if(index===43){
			index=findBest(tick, tick3600, dps, elapsed, 2);
			document.getElementById('name').textContent=`Mob name: ${name[index]}`;
			if(tick[index]===-1){
				document.getElementById('name').textContent=`No good recommendation found, try changing your weapon attack or search manually that fits you.`;
			}
		}	
		else{
			document.getElementById('name').textContent=``;
		}
		//console.log(`Index: ${index}`);
		document.getElementById('tick').textContent=`Tickrate per mob: ${tick[index]} ticks`;
		document.getElementById('tick3600').textContent=`Tickrate per hour: ${tick3600[index]}/3600 ticks`;
		document.getElementById('elapsed').textContent=`Average time per kill: ${Math.floor(elapsed[index]/60)} min ${elapsed[index]%60} sec`;
		document.getElementById('dps').textContent=`Average DPS per kill: ${dps[index]} DPS`;
		document.getElementById('arrow').textContent=`Average arrow per kill: ${arrow[index]} arrows`;
		document.getElementById('mana').textContent=`Average mana per kill: ${mana[index]} MP`;
	});
});
function handleSubmitOff(event, statInput, statGoal, timeInput){
	event.preventDefault();
	const stat=parseInt(statInput.value);
	const goal=parseInt(statGoal.value);
	const time=timeInput.value;
	let exp, expGoal, expNeeded;
	if(stat<55){
		exp=stat**((stat/1000)+2.171);
	}
	else if(stat>=55){
		exp=stat**((stat/1000)+2.373);
	}
	if(goal<55){
		expGoal=goal**((goal/1000)+2.171);
	}
	else if(goal>=55){
		expGoal=goal**((goal/1000)+2.373);
	}
	expNeeded=expGoal-exp;
	exp=parseInt(exp), expNeeded=parseInt(expNeeded);
	document.getElementById('off-res').classList.add('highlight');
	document.getElementById('exp').textContent=`EXP needed: ${expNeeded}`;
	document.getElementById('exp-gain').textContent=`EXP gained (600/hr): ${time*600}`;
	document.getElementById('exp300').textContent=`EXP gained (300/hr): ${time*300}`;
	document.getElementById('exp200').textContent=`EXP gained (200/hr): ${time*200}`;
	document.getElementById('time').textContent=`Time needed (600/hr): ${Math.floor(expNeeded/600)} hr ${parseInt((expNeeded/600-(Math.floor(expNeeded/600)))*60)} min`;
	document.getElementById('time300').textContent=`Time needed (300/hr): ${Math.floor(expNeeded/300)} hr ${parseInt((expNeeded/300-(Math.floor(expNeeded/300)))*60)} min`;
	document.getElementById('time200').textContent=`Time needed (200/hr): ${Math.floor(expNeeded/200)} hr ${parseInt((expNeeded/200-(Math.floor(expNeeded/200)))*60)} min`;
	document.getElementById('exp').innerHTML=document.getElementById('exp').textContent;
	document.getElementById('exp-gain').innerHTML=document.getElementById('exp-gain').textContent;
	document.getElementById('exp300').innerHTML=document.getElementById('exp300').textContent;
	document.getElementById('exp200').innerHTML=document.getElementById('exp200').textContent;
	document.getElementById('time').innerHTML=document.getElementById('time').textContent;
	document.getElementById('time300').innerHTML=document.getElementById('time300').textContent;
	document.getElementById('time200').innerHTML=document.getElementById('time200').textContent;
	document.getElementById('off-res').style.display="block";
//	<p id="exp"></p>
//	<p id="exp-gain"></p>
//	<p id="exp300"></p>
//	<p id="exp200"></p>
//	<p id="time"></p>
//	<p id="time300"></p>
//	<p id="time200"></p>
}
function handleSubmitPk(event, levelInput){
	event.preventDefault();
	const level=parseInt(levelInput.value);
	let pk1=level*150;
	let pk2=level*450+pk1;
	let pk3=level*1350+pk2;
	let pk4=level*4050+pk3;
	document.getElementById('pk-res').classList.add('highlight');
	document.getElementById('pk1-res').textContent=`White & Gold Skull: ${pk1} gold`;
	document.getElementById('pk2-res').textContent=`Orange Skull: ${pk2} gold`;
	document.getElementById('pk3-res').textContent=`Red Skull: ${pk3} gold`;
	document.getElementById('pk4-res').textContent=`Black Skull: ${pk4} gold`;
	document.getElementById('pk1-res').innerHTML=document.getElementById('pk1-res').textContent;
	document.getElementById('pk2-res').innerHTML=document.getElementById('pk2-res').textContent;
	document.getElementById('pk3-res').innerHTML=document.getElementById('pk3-res').textContent;
	document.getElementById('pk4-res').innerHTML=document.getElementById('pk4-res').textContent;
	document.getElementById('pk-res').style.display="block";
}
document.getElementById('info-form').addEventListener('submit', (event)=>{
	handleSubmitInfo(event, document.getElementById('info-base-lvl'));
});
document.querySelector('#dmg-form').addEventListener('submit', (event)=>{
	const index=parseInt(document.getElementById('dmg-mob').value);
	handleSubmitDmg(event, document.getElementById('dmg-lvl'), document.getElementById('dmg-stat'), document.getElementById('dmg-atk'), index);
});
document.getElementById('off-form').addEventListener('submit', (event)=>{
	handleSubmitOff(event, document.getElementById('off-stat'), document.getElementById('off-goal'), document.getElementById('off-time'));
});
document.getElementById('pk-form').addEventListener('submit', (event)=>{
	handleSubmitPk(event, document.getElementById('pk-base-lvl'));
});
