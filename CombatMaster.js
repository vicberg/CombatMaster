/* 
 * Version 2.0 Beta
 * Original By Robin Kuiper
 * Changes in Version 0.3.0 and greater by Victor B
 * Changes in this version and prior versions by The Aaron
 * Discord: Vic#5196
 * Roll20: https://app.roll20.net/users/3135709/victor-b
 * Github: https://github.com/vicberg/CombatMaster
*/
var CombatMaster = CombatMaster || (function() {
    'use strict';

    let round = 1,
	    version = '1.2.1 Alpha',
        timerObj,
        intervalHandle,
        debug = true,
        rotationInterval,
        paused = false,
        markers = [],
        observers = {
            tokenChange: []
        },
		whisper, handled = [],	
        extensions = {
            StatusInfo: true // This will be set to true automatically if you have StatusInfo
        },
        startImage = '4',
		pauseImage = '5',
        stopImage = '6',
        tagImage = '3',
        noTagImage = 'd',
        deleteImage = 'D',
        shuffleImage = ';',
        randomSingleImage = '`',
        randomLoopImage = '?',
        togetherImage = 'J',
        loopImage = 'r',
        sortImage = '1',
        lockImage = ')',
        unlockImage = '(',
        backImage = 'y',
        nextImage = ']',
        prevImage = '[',
        decreaseImage = '<',
        increaseImage = '>',
        timerImage = 't',
        favoriteImage = 'S',
        allConditionsImage = 'G',
        addImage = '&',		
        doneImage = '3',
        showImage = 'v',
        delayImage = '}',
        sortConditionsImage = '0';
    //Styling for the chat responses.
    const styles = {
        reset: 'padding: 0; margin: 0;',
        menu:  'background-color: #fff; border: 1px solid #000; padding: 5px; border-radius: 5px;',
 		title: 'font-size:14px;font-weight:bold;background-color:black;padding:3px;border-top-left-radius:3px;border-top-right-radius:3px',
 		titleText: 'color:white',
 		titleSpacer: 'font-weight: bold; border-bottom: 1px solid black;font-size: 100%;style="float:left;',
 		version:'font-size:10px;',
 		header: 'margin-top:10px;margin-bottom:5px;font-weight:bold;font-style:italic;display:inline-block;',
        button: 'background-color: #000; border: 1px solid #292929; border-radius: 3px; padding: 5px; color: #fff; text-align: center;width:100%',
        textButton: 'background-color:#fff; color: #000; text-align: center; float: right;',
        conditionButton: 'background-color:#fff; color: #000; text-align: center;',
 		linkButton: 'background-color:#fff; color: #000; text-align: center;vertical-align:middle',
 		textLabel: 'background-color:#fff;float:left;text-align:center;margin-top:8px',
 		bigButton: 'width:80%;border-radius:5px;text-align:center;margin-left:15px',
        bigButtonLink: 'background-color:#000000; border-radius: 5px; padding: 5px; color: #fff; text-align: center;width:100%',
        wrapBox: ' border: 1px solid #292929; border-radius: 3px;margin-top:3px;margin-bottom:3px',
 		body: 'background-color:#fff',
        list: 'list-style: none;padding:2px',
        float: {
            right: 'float: right;',
            left: 'float: left;'
        },
        overflow: 'overflow: hidden;',
        fullWidth: 'width: 100%;',
        underline: 'text-decoration: underline;',
        strikethrough: 'text-decoration: strikethrough',
        background: 'background-color:lightgrey'
    },
    // Styling for the chat responses.
    style = "overflow: hidden; background-color: #fff; border: 1px solid #000; padding: 5px; border-radius: 5px;",
    buttonStyle = "background-color: #000; border: 1px solid #292929; border-radius: 3px; padding: 5px; color: #fff; text-align: center; float: right;",
    conditionStyle = "background-color: #fff; border: 1px solid #000; padding: 5px; border-radius: 5px;",
    conditionButtonStyle = "text-decoration: underline; background-color: #fff; color: #000; padding: 0",
    listStyle = 'list-style: none; padding: 0; margin: 0;',

    icon_image_positions = {red:"#C91010",blue:"#1076C9",green:"#2FC910",brown:"#C97310",purple:"#9510C9",pink:"#EB75E1",yellow:"#E5EB75",dead:"X",skull:0,sleepy:34,"half-heart":68,"half-haze":102,interdiction:136,snail:170,"lightning-helix":204,spanner:238,"chained-heart":272,"chemical-bolt":306,"death-zone":340,"drink-me":374,"edge-crack":408,"ninja-mask":442,stopwatch:476,"fishing-net":510,overdrive:544,strong:578,fist:612,padlock:646,"three-leaves":680,"fluffy-wing":714,pummeled:748,tread:782,arrowed:816,aura:850,"back-pain":884,"black-flag":918,"bleeding-eye":952,"bolt-shield":986,"broken-heart":1020,cobweb:1054,"broken-shield":1088,"flying-flag":1122,radioactive:1156,trophy:1190,"broken-skull":1224,"frozen-orb":1258,"rolling-bomb":1292,"white-tower":1326,grab:1360,screaming:1394,grenade:1428,"sentry-gun":1462,"all-for-one":1496,"angel-outfit":1530,"archery-target":1564},
    ctMarkers = ['blue', 'brown', 'green', 'pink', 'purple', 'red', 'yellow', '-', 'all-for-one', 'angel-outfit', 'archery-target', 'arrowed', 'aura', 'back-pain', 'black-flag', 'bleeding-eye', 'bolt-shield', 'broken-heart', 'broken-shield', 'broken-skull', 'chained-heart', 'chemical-bolt', 'cobweb', 'dead', 'death-zone', 'drink-me', 'edge-crack', 'fishing-net', 'fist', 'fluffy-wing', 'flying-flag', 'frozen-orb', 'grab', 'grenade', 'half-haze', 'half-heart', 'interdiction', 'lightning-helix', 'ninja-mask', 'overdrive', 'padlock', 'pummeled', 'radioactive', 'rolling-bomb', 'screaming', 'sentry-gun', 'skull', 'sleepy', 'snail', 'spanner',   'stopwatch','strong', 'three-leaves', 'tread', 'trophy', 'white-tower'],
    shaped_conditions = ['blinded', 'charmed', 'deafened', 'frightened', 'grappled', 'incapacitated', 'invisible', 'paralyzed', 'petrified', 'poisoned', 'prone', 'restrained', 'stunned', 'unconscious'],
	
    script_name = 'CombatMaster',
    combatState = 'COMBATMASTER',

    inputHandler = function(msg_orig) {

        if (msg_orig.content.indexOf('!cm')!==0){
            return;
        }
        
        log(msg_orig)
        var msg = _.clone(msg_orig),cmdDetails,args,restrict,player,who
        
        if (playerIsGM(msg.playerid)) {
              who = 'gm'
        } else {
            who = getObj('player', msg.playerid).get('displayname');
        }
        
        // if (debug) {
        //     log ('Who:'+who)
        // }
        
		if(_.has(msg,'inlinerolls')) {//calculates inline rolls
			msg.content = inlineExtract(msg);
		}
        //splits the message contents into discrete arguments
		args = msg.content.split(/\s+--/);
	    if(args[0] === '!cm'){
            if(args[1]){
                _.each(_.rest(args,1),(cmd) =>{
                    cmdDetails = cmdExtract(cmd);
                    if (debug){
                        log(cmdDetails)
                    }
                    commandHandler(cmdDetails,msg,restrict,who)
                })    
            }
    	}
	},  
	//Extracts inline rolls
	inlineExtract = function(msg){
	    return _.chain(msg.inlinerolls)
				.reduce(function(m,v,k){
					m['$[['+k+']]']=v.results.total || 0;
					return m;
				},{})
				.reduce(function(m,v,k){
					return m.replace(k,v);
				},msg.content)
				.value();
	},
    //Extracts the command details from a command string passed from handleInput	
	cmdExtract = function(cmd){
	    var cmdSep = {
	        details:{}
	    },
	    vars,
	    temp,
	    details;

        //find the action and set the cmdSep Action
	    cmdSep.action = cmd.match(/turn|show|config|back|reset|main|remove|add|new|delete|import|export/);
        //the ./ is an escape within the URL so the hyperlink works.  Remove it
        cmd.replace('./', '');
        //split additional command actions

        if (cmdSep.action == 'import') {
            cmdSep.details['config'] = cmd.replace(cmdSep.action+',','')
        } else {
    	    _.each(cmd.replace(cmdSep.action+',','').split(','),(d)=>{
                vars=d.match(/(who|next|previous|delay|start|timer|stop|pause|show|all|favorites|setup|conditions|condition|sort|combat|turnorder|accouncements|timer|macro|status|list|export|import|type|key|value|setup|tracker|confirm|direction|duration|message|initiative|config|assigned|type|action|)(?:\:|=)([^,]+)/) || null;
                if(vars){
                    temp = (vars[2] === 'true') ? true : (vars[2] === 'false') ? false : vars[2]
                    cmdSep.details[vars[1]]=temp;
                }else{
                    cmdSep.details[d]=d;
                }
            });
        }    

//        cmdSep.details.delay = cmdSep.details.delay*1000 || 0;
        return cmdSep;
	},	    
	//Processes the commands based on Delay Time (if any)
	commandHandler = function(cmdDetails,msg,restrict,who){
	    if (debug){
	        log ('Command Handler')
	    }
	    
        if (cmdDetails.action == 'back'){
            if (cmdDetails.details.setup) {
                cmdDetails.action = 'show'
                cmdDetails.details['setup'] = true
            } else if (cmdDetails.details.tracker) {
                cmdDetails.action = 'main'
            } else {
                if (state[combatState].config.previousPage == 'main') {
                    cmdDetails.action = 'main'
                 } else {
	                cmdDetails.action = 'show'
	                cmdDetails.details['conditions'] = true  

                 }
            }           
        }    	        
        if (cmdDetails.action == 'main'){
            sendMainMenu(who)
        }     
        if (cmdDetails.action == 'turn'){
            if (cmdDetails.details.next) {
                nextTurn();
            }
            if (cmdDetails.details.delay) {
                delayTurn();
            }                
            if (cmdDetails.details.previous) {
                previousTurn()
            }      
            if (cmdDetails.details.start) {
                startCombat(msg.selected);
            }        
            if (cmdDetails.details.stop) {
                stopCombat();
            }   
            if (cmdDetails.details.timer == 'pause') {
                pauseTimer();
            }   
            if (cmdDetails.details.timer == 'stop') {
                stopTimer();
            }  
            if (cmdDetails.details.sort) {
                sortTurnorder();
            }    
        }
        if (cmdDetails.action == 'show'){
            if (cmdDetails.details.all) {
                editFavoriteState('all');
            }    
            if (cmdDetails.details.favorites) {
                editFavoriteState('favorites');
            } 
    
            if (cmdDetails.details.setup) {
                sendConfigMenu();
            }    
            if (cmdDetails.details.initiative) {
                sendInitiativeMenu();
            }   
            if (cmdDetails.details.turnorder) {
                sendTurnorderMenu();
            }  
            if (cmdDetails.details.timer) {
                sendTimerMenu();
            }    
            if (cmdDetails.details.announce) {
                sendAnnounceMenu();
            }   
            if (cmdDetails.details.macro) {
                sendMacroMenu();
            }  
            if (cmdDetails.details.status) {
                sendStatusMenu()
            }                   
            if (cmdDetails.details.conditions) {
                sendConditionsMenu()
            }   
            if (cmdDetails.details.export) {
                exportConditions()
            }      
            if (cmdDetails.details.condition) {
                sendConditionMenu(cmdDetails.details.condition)
            }    
            if (cmdDetails.details.assigned) {
                showConditions(msg.selected)
            }                
        }   
        if (cmdDetails.action == 'add') {
            if (cmdDetails.details.condition) {
                addCondition(cmdDetails, msg.selected)
            } else {
                addMacro(cmdDetails)
            }
        }
        if (cmdDetails.action == 'remove') {
            if (cmdDetails.details.condition) {
                removeCondition(cmdDetails, msg.selected)
            } else {
                removeMacro(cmdDetails)
            }                
        }            
        if (cmdDetails.action == 'config'){
            editCombatState(cmdDetails)   
        }    
        if (cmdDetails.action == 'new'){
            if (cmdDetails.details.condition) {
                newCondition(cmdDetails.details.condition)  
            } else if (cmdDetails.details.macro) {
                newSubstitution(cmdDetails)
            }                
        }  
        if (cmdDetails.action == 'delete'){
            if (cmdDetails.details.condition) {
                deleteCondition(cmdDetails.details.condition,cmdDetails.details.confirm)   
            } else if (cmdDetails.details.macro) {
                removeSubstitution(cmdDetails)
            }    
        }      
        if (cmdDetails.action == 'import') {
            importConditions(cmdDetails.details.config)
        }
        if (cmdDetails.action == 'reset') {
			state[combatState] = {};
			setDefaults(true);
			sendMainMenu(who)
        }
	},

//*************************************************************************************************************
//MENUS
//*************************************************************************************************************
    sendMainMenu = function(who) {
        let nextButton          = makeImageButton('!cm --turn,next',nextImage,'Next Turn','transparent',18),
            prevButton          = makeImageButton('!cm --turn,previous',prevImage,'Previous Turn','transparent',18),
            stopButton          = makeImageButton('!cm --turn,stop --main',stopImage,'Stop Combat','transparent',18),
            startButton         = makeImageButton('!cm --turn,start --main',startImage,'Start Combat','transparent',18),
            pauseTimerButton    = makeImageButton('!cm --turn,timer=pause',pauseImage,'Pause Timer','transparent',18),
            stopTimerButton     = makeImageButton('!cm --turn,timer=stop',timerImage,'Stop Timer','transparent',18),
            allConditionsButton = makeImageButton('!cm --show,all --main',allConditionsImage,'Show All Conditions','transparent',18),
            favoritesButton     = makeImageButton('!cm --show,favorites --main',favoriteImage,'Show Favorites','transparent',18),
            configButton        = makeImageButton('!cm --show,setup',backImage,'Show Setup','transparent',18),
            showButton          = makeImageButton('!cm --show,assigned',showImage,'Show Conditions','transparent',18),
            sortButton          = makeImageButton('!cm --turn,sort',sortImage,'Sort Turnorder','transparent',18),
            listItems           = [],
            titleText           = 'CombatMaster Menu<span style="' + styles.version + '"> (' + version + ')</span>',
            contents, key, condition, conditions, conditionButton, addButton, removeButton, favoriteButton, listContents, rowCount=1;

        if (debug) {
            log('Send Main Menu')
        }

        if (inFight() ) {
            contents = '<div style="background-color:green;width:100%;padding:2px;vertical-align:middle">'+stopButton + prevButton + nextButton + pauseTimerButton + stopTimerButton + showButton + sortButton 
        } else {
            contents = '<div style="background-color:red">'+startButton
        }
        
        if (['favorites',null].includes(state[combatState].config.status.showConditions)){
            contents += allConditionsButton
        } else {
            contents += favoritesButton
        } 

        contents += configButton
        contents += '</div>'
        
        conditions = sortObject(state[combatState].config.conditions)
        
        for (key in conditions) {
            condition       = getConditionByKey(key)
            conditionButton = makeImageButton('!cm --show,condition='+key,backImage,'Edit Condition','transparent',12)
            removeButton    = makeImageButton('!cm --remove,condition='+key,deleteImage,'Remove Condition','transparent',12)

            if (condition.override) {
                if (state[combatState].config.status.useMessage) {
                    addButton = makeImageButton('!cm --add,condition='+key +',duration=?{Duration|'+condition.duration+'},direction=?{Direction|'+condition.direction + '},message=?{Message}',addImage,'Add Condition','transparent',12)
                } else {  
                    addButton = makeImageButton('!cm --add,condition='+key +',duration=?{Duration|'+condition.duration+'},direction=?{Direction|'+condition.direction + '}',addImage,'Add Condition','transparent',12)
                }    
            } else {
                if (state[combatState].config.status.useMessage) {
                    addButton = makeImageButton('!cm --add,condition='+key+',duration='+condition.duration+',direction='+condition.direction+',message='+condition.message,addImage,'Add Condition','transparent',12)
                 } else {
                    addButton = makeImageButton('!cm --add,condition='+key+',duration='+condition.duration+',direction='+condition.direction,addImage,'Add Condition','transparent',12)
                 }    
            }

            if (condition.favorite) {
                favoriteButton = makeImageButton('!cm --config,condition='+key+',key=favorite,value='+!condition.favorite+' --tracker',favoriteImage,'Remove from Favorites','transparent',12)
            } else {
                favoriteButton = makeImageButton('!cm --config,condition='+key+',key=favorite,value='+!condition.favorite+' --tracker',allConditionsImage,'Add to Favorites','transparent',12)
            }
            
			if (rowCount == 1) {
                listContents = '<div>'
                rowCount = 2
			} else {
			   listContents = '<div style='+styles.background+'>'
			   rowCount = 1
			}   
            listContents += getDefaultIcon(condition.iconType,condition.icon,'display:inline-block;margin-right:3px')
            listContents += '<span style="vertical-align:middle">'+condition.name+'</span>'
            if (state[combatState].config.status.userChanges && who != 'gm') {
                listContents += '<span style="float:right;vertical-align:middle">'+addButton+removeButton+'</span>'
            } else {
                listContents += '<span style="float:right;vertical-align:middle">'+addButton+removeButton+favoriteButton+conditionButton+'</span>'
            }
            listContents += '</div>'
            
            if (state[combatState].config.status.showConditions == 'favorites') {
                if (condition.favorite) {
                    listItems.push(listContents);
                }    
            } else {
                listItems.push(listContents);
            }
        }

        //send menu 
        state[combatState].config.previousPage = 'main'
        if (who == 'gm') {
            makeAndSendMenu(contents+makeList(listItems),titleText,who);
        } else {
            makeAndSendMenu(makeList(listItems),titleText,who);
        }    
    },
    
    sortObject = function (obj) {
        return Object.keys(obj).sort().reduce(function (result, key) {
            result[key] = obj[key];
            return result;
        }, {});
    },    

    sendConfigMenu = function() {
		let configIntiativeButton       = makeBigButton('Initiative', '!cm --show,initiative'),
	     	configTurnorderButton       = makeBigButton('Turnorder', '!cm --show,turnorder'),
			configTimerButton           = makeBigButton('Timer', '!cm --show,timer'),
			configAnnouncementsButton   = makeBigButton('Announce', '!cm --show,announce'),
			configMacroButton           = makeBigButton('Macro & API', '!cm --show,macro'),
			configStatusButton          = makeBigButton('Status', '!cm --show,status'),
			configConditionButton       = makeBigButton('Conditions', '!cm --show,conditions'),
			exportButton                = makeBigButton('Export', '!cm --show,export'),
			importButton                = makeBigButton('Import', '!cm --import,config=?{Config}'),	
			resetButton                 = makeBigButton('Reset', '!cm --reset'),
			backToTrackerButton         = makeBigButton('Back', '!cm --back,tracker'),
			titleText                   = 'CombatMaster Setup<span style="' + styles.version + '"> (' + version + ')</span>',
			combatHeaderText            = '<div style="'+styles.header+'">Combat Setup</div>',
			statusHeadersText           = '<div style="'+styles.header+'">Status Setup</div>',
			resetHeaderText             = '<div style="'+styles.header+'">Reset CombatTracker</div>',	
			backToTrackerText           = '<div style="'+styles.header+'">Return</div>',	
			
		 	contents  = combatHeaderText
			contents += configIntiativeButton
			contents += configTurnorderButton			
			contents += configTimerButton
			contents += configAnnouncementsButton
			contents += configMacroButton
			contents += statusHeadersText 
			contents += configStatusButton
			contents += configConditionButton
			contents += exportButton
			contents += importButton
			contents += resetHeaderText
			contents += resetButton
		    contents += backToTrackerText
		    contents += backToTrackerButton

        makeAndSendMenu(contents, titleText, 'gm');
    },

    sendInitiativeMenu = function() {
        let backButton = makeBigButton('Back', '!cm --back,setup'),
            listItems = [], 
            initiative=state[combatState].config.initiative;
		
		listItems.push(makeTextButton('Roll Initiative', initiative.rollInitiative, '!cm --config,initiative,key=rollInitiative,value=?{Initiative|None,None|CombatMaster,CombatMaster|Group-Init,Group-Init} --show,initiative'))
        listItems.push(makeTextButton('Roll Each Round', initiative.rollEachRound, '!cm --config,initiative,key=rollEachRound,value='+!initiative.rollEachRound + ' --show,initiative')) 
        
        if (initiative.rollInitiative == 'CombatMaster') {
            listItems.push(makeTextButton('Initiative Attr', initiative.initiativeAttributes, '!cm --config,initiative,key=initiativeAttributes,value=?{Attribute|'+initiative.initiativeAttributes+'} --show,initiative'))
            listItems.push(makeTextButton('Initiative Die', 'd' + initiative.initiativeDie, '!cm --config,initiative,key=initiativeDie,value=?{Die (without the d)'+initiative.initiativeDie+'} --show,initiative'))
            listItems.push(makeTextButton('Show Initiative in Chat', initiative.showInitiative, '!cm --config,initiative,key=showInitiative,value='+!initiative.showInitiative + ' --show,initiative'))
        }
        
		if (initiative.rollInitiative == 'Group-Init') {	
			listItems.push(makeTextButton('Target Tokens', initiative.apiTargetTokens, '!cm --config,initiative,key=apiTargetTokens,value=?{Target Tokens|} --show,initiative'))
            if (!initiative.apiTargetTokens > '') {
                listItems.push('<div>'+initiative.apiTargetTokens+'</div>')
            }
		}

        makeAndSendMenu(makeList(listItems, backButton), 'Initiative Setup', 'gm');
    },

	sendTurnorderMenu = function() {
        let backButton = makeBigButton('Back', '!cm --back,setup'),
            listItems = [],
            turnorder = state[combatState].config.turnorder;
		    
		listItems.push(makeTextButton('Sort Turnorder',turnorder.sortTurnOrder, '!cm --config,turnorder,key=sortTurnOrder,value='+!turnorder.sortTurnOrder + ' --show,turnorder'))
    	listItems.push(makeTextButton('Center Map on Token', turnorder.centerToken, '!cm --config,turnorder,key=centerToken,value='+!turnorder.centerToken + ' --show,turnorder'))
    	listItems.push(makeTextButton('Marker Type',turnorder.markerType, '!cm --config,turnorder,key=markerType,value=?{Marker Type|External URL,External URL|Token Marker,Token Marker|Token Condition,Token Condition} --show,turnorder'))
        
        if (turnorder.markerType == 'External URL') {
            listItems.push(makeTextButton('Marker', '<img src="'+turnorder.externalMarkerURL+'" width="20px" height="20px" />', '!cm --config,turnorder,key=externalMarkerURL,value=?{Image Url} --show,turnorder'))
        }  else if (turnorder.markerType == 'Token Marker')	{
		    listItems.push(makeTextButton('Marker Name',turnorder.tokenMarkerName, '!cm --config,turnorder,key=tokenMarkerName,value=?{Marker Name|} --show,turnorder'))
            listItems.push(getDefaultIcon('Token Marker',turnorder.tokenMarkerName))
		}			
		
		listItems.push(makeTextButton('Use Next Marker',turnorder.nextMarkerType, '!cm --config,turnorder,key=nextMarkerType,value=?{Next Marker Type|External URL,External URL|Token Marker,Token Marker|Token Condition,Token Condition} --show,turnorder'))
		
		if (turnorder.nextMarkerType == 'External URL') {	
			 listItems.push(makeTextButton('Next Marker', '<img src="'+turnorder.nextExternalMarkerURL+'" width="20px" height="20px" />', '!cm --config,turnorder,key=nextExternalMarkerURL,value=?{Image Url} --show,turnorder'))
		} else if (turnorder.nextMarkerType == 'Token Marker')	{
		    listItems.push(makeTextButton('Next Marker Name',turnorder.nextTokenMarkerName, '!cm --config,turnorder,key=nextTokenMarkerName,value=?{Next Marker Name|} --show,turnorder'))
            listItems.push(getDefaultIcon('Token Marker', turnorder.nextTokenMarkerName))
		}	
        
		listItems.push('<div style="margin-top:3px"><i><b>Beginning of Each Round</b></i></div>' )
        listItems.push(makeTextButton('API',turnorder.roundAPI, '!cm --config,turnorder,key=roundAPI,value=?{API Command|} --show,turnorder'))
        listItems.push(makeTextButton('Roll20AM',turnorder.roundRoll20AM, '!cm --config,turnorder,key=roundRoll20AM,value=?{Roll20AM Command|} --show,turnorder'))
        listItems.push(makeTextButton('FX',turnorder.roundFX, '!cm --config,turnorder,key=roundFX,value=?{FX Command|} --show,turnorder'))
        listItems.push(makeTextButton('Characters Macro',turnorder.characterRoundMacro, '!cm --config,turnorder,key=characterRoundMacro,value=?{Macro Name|} --show,turnorder'))
        listItems.push(makeTextButton('All Tokens Macro',turnorder.allRoundMacro, '!cm --config,turnorder,key=allRoundMacro,value=?{Macro Name|} --show,turnorder'))
        
		listItems.push('<div style="margin-top:3px"><i><b>Beginning of Each Turn</b></i></div>' )
        listItems.push(makeTextButton('API',turnorder.turnAPI, '!cm --config,turnorder,key=turnAPI,value=?{API Command|} --show,turnorder'))
        listItems.push(makeTextButton('Roll20AM',turnorder.turnRoll20AM, '!cm --config,turnorder,key=turnRoll20AM,value=?{Roll20AM Command|} --show,turnorder'))
        listItems.push(makeTextButton('FX',turnorder.turnFX, '!cm --config,turnorder,key=turnFX,value=?{FX Command|} --show,turnorder'))
        listItems.push(makeTextButton('Macro',turnorder.turnMacro, '!cm --config,turnorder,key=turnMacro,value=?{Macro Name|} --show,turnorder'))

        makeAndSendMenu(makeList(listItems, backButton), 'Turnorder Setup', 'gm');
    },
	
    sendTimerMenu = function() {
        let backButton = makeBigButton('Back', '!cm --back,setup'),
            listItems = [],
            timer = state[combatState].config.timer,
            contents;
            
        listItems.push(makeTextButton('Turn Timer', timer.useTimer, '!cm --config,timer,key=useTimer,value='+!timer.useTimer + ' --show,timer'))
        
        if (timer.useTimer) {
            listItems.push(makeTextButton('Time', timer.time, '!cm --config,timer,key=time,value=?{Time|'+timer.time+'} --show,timer'))
            listItems.push(makeTextButton('Skip Turn', timer.skipTurn, '!cm --config,timer,key=skipTurn,value='+!timer.skipTurn + ' --show,timer'))
            listItems.push(makeTextButton('Send to Chat', timer.sendTimerToChat, '!cm --config,timer,key=sendTimerToChat,value='+!timer.sendTimerToChat + ' --show,timer'))
            listItems.push(makeTextButton('Show on Token', timer.showTokenTimer, '!cm --config,timer,key=showTokenTimer,value='+!timer.showTokenTimer + ' --show,timer'))
            listItems.push(makeTextButton('Token Font', timer.timerFont, '!cm --config,timer,key=timerFont,value=?{Font|Arial|Patrick Hand|Contrail|Light|Candal} --show,timer'))
            listItems.push(makeTextButton('Token Font Size',timer.timerFontSize, '!cm --config,timer,key=timerFontSize,value=?{Font Size|'+timer.timerFontSize+'} --show,timer'))
        }
            
        contents = makeList(listItems, backButton);	

		makeAndSendMenu(contents, 'Timer Setup', 'gm');
    },	
	
    sendAnnounceMenu = function() {
        let backButton = makeBigButton('Back', '!cm --back,setup'),
			announcements = state[combatState].config.announcements,
			listItems = [
				makeTextButton('Announce Rounds', announcements.announceRound, '!cm --config,announcements,key=announceRound,value='+!announcements.announceRound + ' --show,announce'),
				makeTextButton('Announce Turns', announcements.announceTurn, '!cm --config,announcements,key=announceTurn,value='+!announcements.announceTurn + ' --show,announce'),
				makeTextButton('Whisper GM Only', announcements.whisperToGM, '!cm --config,announcements,key=whisperToGM,value='+!announcements.whisperToGM + ' --show,announce'),
				makeTextButton('Shorten Long Names', announcements.handleLongName, '!cm --config,announcements,key=handleLongName,value='+!announcements.handleLongName + ' --show,announce'),
			],
			contents = makeList(listItems, backButton);	

        makeAndSendMenu(contents, 'Announcements Setup', 'gm');
    },
	
	sendMacroMenu = function() {
        let backButton = makeBigButton('Back', '!cm --back,setup'),
            addButton = makeBigButton('Add Substiution', '!cm --new,macro,type=?{Type|CharID,CharID|CharName,CharName|TokenID,TokenID|},action=?{Action|}'),
            substitutions = state[combatState].config.macro.substitutions,
            listItems=[], contents,deleteButton,listContents
  
        substitutions.forEach((substitution) => {
            deleteButton = makeImageButton('!cm --delete,macro,action='+substitution.action,backImage,'Delete Substitution','transparent',12)
            
            listContents ='<div>'
            listContents +='<span style="vertical-align:middle">'+substitution.type+ '-'+substitution.action+'</span>'
            listContents +='<span style="float:right;vertical-align:middle">'+deleteButton+'</span>'
            listContents +='</div>'
            
            listItems.push(listContents)
        }) 
       
        contents = makeList(listItems, backButton, addButton);	
        makeAndSendMenu(contents, 'Macro & API Setup', 'gm');
	},
	
	sendStatusMenu = function() {
        let backButton = makeBigButton('Back', '!cm --back,setup'),
            listItems = [
				makeTextButton('Whisper GM Only', state[combatState].config.status.sendOnlyToGM, '!cm --config,status,key=sendOnlyToGM,value='+!state[combatState].config.status.sendOnlyToGM+' --show,status'),
				makeTextButton('Player Allowed Changes', state[combatState].config.status.userChanges, '!cm --config,status,key=userChanges,value='+!state[combatState].config.status.userChanges+' --show,status'),
				makeTextButton('Send Changes to Chat', state[combatState].config.status.sendConditions, '!cm --config,status,key=sendConditions,value='+!state[combatState].config.status.sendConditions+' --show,status'),	
				makeTextButton('Clear Conditions on Close', state[combatState].config.status.clearConditions, '!cm --config,status,key=clearConditions,value='+!state[combatState].config.status.clearConditions + ' --show,status'),
				makeTextButton('Use Messages', state[combatState].config.status.useMessage, '!cm --config,status,key=useMessage,value='+!state[combatState].config.status.useMessage + ' --show,status'),
			],			
			contents = makeList(listItems, backButton);	

        makeAndSendMenu(contents, 'Status Setup', 'gm')		
	},
	
    sendConditionsMenu = function(message) {
        let key, duration, direction, override,	condition, conditionButton, favorite, icon,	output, rowCount=1,
            backButton = makeBigButton('Back', '!cm --back,setup'),
			addButton = makeBigButton('Add Condition', '!cm --new,condition=?{Name}'),
			listItems = [],
			listContents = '[',
            icons = [],
            check = true,
			contents = ''
			
        for (key in state[combatState].config.conditions) {
            condition       = getConditionByKey(key)
			conditionButton = makeImageButton('!cm --show,condition=' + key,backImage,'Edit Condition','transparent',12)
			
			if (rowCount == 1) {
                listContents = '<div>'
                rowCount = 2
			} else {
			   listContents = '<div style='+styles.background+'>'
			   rowCount = 1
			}    
			
            listContents += getDefaultIcon(condition.iconType,condition.icon,'display:inline-block;margin-right:3px')
            listContents += '<span style="vertical-align:middle">'+condition.name+'</span>'
            listContents += '<span style="float:right;vertical-align:middle">'+conditionButton+'</span>'
            listContents += '</div>'              

            listItems.push(listContents);

            if(check && icons.includes(condition.icon)){
                message = message || '' + '<br>Multiple conditions use the same icon';
                check = false;
            }
        }

        message = (message) ? '<p style="color: red">'+message+'</p>' : '';
        contents += message + makeList(listItems, backButton, addButton);
        
        state[combatState].config.previousPage = 'conditions'
        makeAndSendMenu(contents, 'Conditions Setup', 'gm');
    },

    sendConditionMenu = function(key) {
        let condition  = state[combatState].config.conditions[key], listItems = [], markerDropdown = ''

        if (debug) {
            log('Send Condition Menu')
            log('Key:'+key)
        }
        
        if (typeof condition.description == 'undefined') {
            condition.description = ' '
        }
        
	    let removeButton        = makeBigButton('Delete Condition', '!cm --delete,condition='+key+',value=?{Are you sure?|Yes,yes|No,no}'),
		    descriptionButton   = makeBigButton('Edit Description', '!cm --config,condition='+key+',key=description,value=?{Description|'+decodeURIComponent(condition.description)+'} --show,condition='+key),
		    backButton          = makeBigButton('Back', '!cm --back')	 

		listItems.push(makeTextButton('Name', condition.name, '!cm --config,condition='+key+',key=name,value=?{Name}'))
		listItems.push(makeTextButton('Icon Type', condition.iconType, '!cm --config,condition='+key+',key=iconType,value=?{Icon Type|Combat Master,Combat Master|Token Marker,Token Marker|Token Condition, Token Condition} --show,condition='+key))

        if (condition.iconType == 'Combat Master') {
    		markerDropdown = '?{Marker';		
            ctMarkers.forEach((marker) => {
                markerDropdown += '|'+ucFirst(marker).replace(/-/g, ' ')+','+marker
            })
            markerDropdown += '}';            
        } else if (condition.iconType == 'Token Marker') {
            if (markers.length == 0) {
    	        markers = getTokenMarkers();
            }
            
    		markerDropdown = '?{Marker';		
            markers.forEach((marker) => {
                markerDropdown += '|'+marker.name+','+marker.name
            })
            markerDropdown += '}';
        } else if (condition.iconType == 'Token Condition') {
            
        }    

	    listItems.push(makeTextButton('Icon', getDefaultIcon(condition.iconType,condition.icon), '!cm --config,condition='+key+',key=icon,value='+markerDropdown+' --show,condition='+key))				
		listItems.push(makeTextButton('Duration', condition.duration, '!cm --config,condition='+key+',key=duration,value=?{Duration|1} --show,condition='+key))
		listItems.push(makeTextButton('Direction', condition.direction, '!cm --config,condition='+key+',key=direction,value=?{Direction|0} --show,condition='+key))
		listItems.push(makeTextButton('Override', condition.override, '!cm --config,condition='+key+',key=override,value='+!condition.override+' --show,condition='+key))
		listItems.push(makeTextButton('Favorites', condition.favorite, '!cm --config,condition='+key+',key=favorite,value='+!condition.favorite+' --show,condition='+key))
		listItems.push(makeTextButton('Message', condition.message, '!cm --config,condition='+key+',key=message,value=?{Message}) --show,condition='+key))
        listItems.push('<div style="margin-top:3px"><i><b>Adding Condition</b></i></div>' )
		listItems.push(makeTextButton('Token Mod', condition.addAPI, '!cm --config,,condition='+key+',key=addAPI,value=?{API Command|} --show,condition='+key))
		listItems.push(makeTextButton('Roll20AM', condition.addRoll20AM, '!cm --config,,condition='+key+',key=addRoll20AM,value=?{Roll20AM Command|} --show,condition='+key))
		listItems.push(makeTextButton('FX', condition.addFX, '!cm --config,,condition='+key+',key=addFX,value=?{FX|} --show,condition='+key))
		listItems.push(makeTextButton('Macro', condition.addMacro, '!cm --config,,condition='+key+',key=addMacro,value=?{Macro|} --show,condition='+key))
        listItems.push('<div style="margin-top:3px"><i><b>Removing Condition</b></i></div>' )
		listItems.push(makeTextButton('Token Mod', condition.remAPI, '!cm --config,,condition='+key+',key=remAPI,value=?{API Command|} --show,condition='+key))
		listItems.push(makeTextButton('Roll20AM', condition.remRoll20AM, '!cm --config,,condition='+key+',key=remRoll20AM,value=?{Roll20AM Command|} --show,condition='+key))
		listItems.push(makeTextButton('FX', condition.remFX, '!cm --config,,condition='+key+',key=remFX,value=?{FX|} --show,condition='+key))
		listItems.push(makeTextButton('Macro', condition.remMacro, '!cm --config,,condition='+key+',key=remMacro,value=?{Macro|} --show,condition='+key))

		let contents = makeList(listItems)+'<hr>'+descriptionButton+'<b>Description:</b>'+decodeURIComponent(condition.description)+removeButton+'<hr>'+backButton 	
        makeAndSendMenu(contents, 'Condition Setup', 'gm');
    },
    
    showConditions = function (selectedTokens) {
        let tokenObj
        
        if (selectedTokens) {
            selectedTokens.forEach(token => {
                if (token._type == 'graphic') {
                    if (token._id != getOrCreateMarker(false).get('id') && token._id != getOrCreateMarker(true).get('id')) {
                        tokenObj = getObj('graphic', token._id);
                        announcePlayer(tokenObj,(tokenObj.layer === 'objects') ? '' : 'gm', false, false, true);
                    }    
                }
            })    
        }    
    },
    
    importConditions = function (config) {
        let json, 
            backButton = makeBigButton('Back', '!cm --back,setup');
        
        try{
            json = JSON.parse(config.replace('config=',''));
            
            if (json.command == 'cm') {
                state[combatState] = json
                setDefaults()
                makeAndSendMenu('Current Combat Master detected and imported.' + backButton, 'Import Setup');
            }
            if (json.config.command == 'condition') {
                state[combatState].config.conditions = json.conditions
                setDefaults()
                makeAndSendMenu('Prior Combat Tracker detected and conditions were imported.' + backButton, 'Import Setup');
            }
        } catch(e) {
            makeAndSendMenu('This is not a valid JSON string.' + backButton, 'Import Setup');
            return;
        }
    },
    
    exportConditions = function () {
        let backButton = makeBigButton('Back', '!cm --back,setup')
        makeAndSendMenu('<p>Copy the entire content above and save it on your pc.</p><pre>'+HE(JSON.stringify(state[combatState].config))+'</pre><div>'+backButton+'/div>', 'Export Configs');
    },

//*************************************************************************************************************
//SESSION STATE MAINTENANCE
//*************************************************************************************************************	
	editCombatState = function (cmdDetails) {
		if(cmdDetails.details.initiative){
			state[combatState].config.initiative[cmdDetails.details.key] = cmdDetails.details.value;
		}
		else if(cmdDetails.details.timer){
			state[combatState].config.timer[cmdDetails.details.key] = cmdDetails.details.value;
		}
		else if (cmdDetails.details.turnorder){
			if (cmdDetails.details.key === 'initiativeDie') {
				cmdDetails.details.value = parseInt(value);
			}
			
			state[combatState].config.turnorder[cmdDetails.details.key] = cmdDetails.details.value;
			log(state[combatState].config.turnorder)
		}	
		else if (cmdDetails.details.announcements){
			state[combatState].config.announcements[cmdDetails.details.key] = cmdDetails.details.value;
		}
// 		else if (cmdDetails.details.macro){
// 		    if (cmdDetails.details.)
// 			state[combatState].config.macro.substitutions[cmdDetails.details.key] = cmdDetails.details.value;
// 		}		
		else if (cmdDetails.details.status){
			state[combatState].config.status[cmdDetails.details.key] = cmdDetails.details.value;
		}    
		else {
    		if (cmdDetails.details.key === 'name' && cmdDetails.details.value.replace(/\s/g, '').toLowerCase() !== state[combatState].config.conditions[cmdDetails.details.condition]) { 

      			state[combatState].config.conditions[cmdDetails.details.value.toLowerCase()] = state[combatState].config.conditions[cmdDetails.details.condition];
      			state[combatState].config.conditions[cmdDetails.details.value.toLowerCase()].key = cmdDetails.details.value.toLowerCase()
      			state[combatState].config.conditions[cmdDetails.details.value.toLowerCase()].name = cmdDetails.details.value
      			delete state[combatState].config.conditions[cmdDetails.details.condition];
      			if (debug) {
      			    log('New Key:' + cmdDetails.details.value.toLowerCase())
      			    log('Old Key:' + cmdDetails.details.condition)
      			    log ('New Condition:' + state[combatState].config.conditions[cmdDetails.details.value.toLowerCase()])
      			}    
      			sendConditionMenu(cmdDetails.details.value.toLowerCase())
    	    } else {
    	        if (cmdDetails.details.key == 'description') {
    	            cmdDetails.details.value = encodeURIComponent(cmdDetails.details.value)
    	        }
		        state[combatState].config.conditions[cmdDetails.details.condition][cmdDetails.details.key] = cmdDetails.details.value;
    	    }      
		}
	},
//*************************************************************************************************************
//CONDITIONS 
//*************************************************************************************************************		
	newCondition = function (name) {
        if (debug) {
            log ('Create Condition')
            log('Name:'+name)
        }	
        
		if(!name){
			sendConditionsMenu('You didn\'t give a condition name, eg. <i>!condition add Prone</i>.');
		} else if (state[combatState].config.conditions[name.toLowerCase()]) {
			sendConditionsMenu('The condition `'+name+'` already exists.');
		} else {
			state[combatState].config.conditions[name.toLowerCase()] = {
				name: name,
				key: name.toLowerCase(),
				icon: 'red',
				iconType: 'Combat Master',
				description: ' ',
				duration: 1,
				direction: 0,
				message: 'None',
				addAPI: 'None',
				addRoll20AM: 'None',
				addFX: 'None',
				addMacro: 'None',
				remAPI: 'None',
				remRoll20AM: 'None',
				remFX: 'None',
				remMacro: 'None'				
			}	
			sendConditionMenu(name.toLowerCase());		
		}		
	},
	
	deleteCondition = function (key, confirm) {	
        if (debug) {
            log ('Delete Condition')
            log('Condition:'+key)
            log('Confirm:'+confirm)
        }	

		if (confirm === 'yes') {
			if(!name){
				sendConditionsMenu('You didn\'t give a condition name, eg. <i>!cm --delete,condition=Prone</i>.');
			} else if( !state[combatState].config.conditions[key.toLowerCase()]){
				sendConditionsMenu('The condition `'+key+'` does\'t exist.');
			} else {
				delete state[combatState].config.conditions[key.toLowerCase()];
				sendConditionsMenu('The condition `'+key+'` is removed.');
			}
		}	
		sendConditionsMenu('Condition was deleted')
	},

    getConditionByMarker = function (marker) {
        return getObjects(state[combatState].conditions, 'icon', marker).shift() || false;  
    },

    getConditionByKey = function(key) {
        return state[combatState].config.conditions[key];
    },
    
    getConditions = function () {
        return state[combatState].config.conditions;
    }, 	

    verifyCondition = function(token,key) {
        let condition  = getConditionByKey(key)
        
        if (debug) {
            log('Verify Condition')
        }
        
        if (typeof condition.direction == 'undefined' || typeof condition.duration == 'undefined') {
			makeAndSendMenu('The condition you are trying to use has not be setup yet', '', 'gm');
			return false;            
        }
		if (!key) {
			makeAndSendMenu('No condition name was given.', '', 'gm');
			return false;
		}
		if (!token || !token.length) {		
			makeAndSendMenu('No tokens were selected.', '', 'gm');
			return false;
        }
        if (token == getOrCreateMarker().get('id')) {
            return false;
        }
        if (token == getOrCreateMarker(true).get('id')) {
            return false;
        }      
        return true;
    },
    
    addCondition = function(cmdDetails,selectedTokens) {
        if (debug) {
            log('Add Condition')
        }
        
        if (selectedTokens) {
        	selectedTokens.forEach(token => {
        	    if (token._type == 'graphic') {
    			    addConditionToToken(getObj(token._type, token._id),cmdDetails.details.condition,cmdDetails.details.duration,cmdDetails.details.direction,cmdDetails.details.message)    
    			    doAddConditionCalls(token,cmdDetails.details.condition)
        	    }
        	});	 	
        } else {
            makeAndSendMenu('No tokens were selected.', '', 'gm');
        }   
    },

     removeCondition = function (cmdDetails,selectedTokens) {
        if (debug) {
            log('Remove Condition')
        }

        if (cmdDetails.details.id) {
            removeConditionFromToken(getObj('graphic', cmdDetails.details.id), cmdDetails.details.condition)  
        } else if (selectedTokens) {
        	selectedTokens.forEach(token => {
        	    if (token._type == 'graphic') {
    			    removeConditionFromToken(getObj(token._type, token._id), cmdDetails.details.condition)   
    			    doRemoveConditionCalls(token,cmdDetails.details.condition)
        	    }    
        	});	 	
        }	
    },
    
    addConditionToToken = function(tokenObj,key,duration,direction,message) {
	    let	defaultCondition, combatCondition, newCondition = {},statusMarkers

        if (debug) {
            log('Add Condition To Token')
        } 

        if (verifyCondition(tokenObj.get("_id"), key)) {
            
            removeConditionFromToken(tokenObj, key);   
           
            defaultCondition        = getConditionByKey(key)
            newCondition.id         = tokenObj.get("_id")
            newCondition.key        = key
            newCondition.name       = defaultCondition.name
            newCondition.icon       = defaultCondition.icon
            newCondition.iconType   = defaultCondition.iconType

            if (!defaultCondition.override) {
                newCondition.duration = parseInt(defaultCondition.duration)
            } else {
                if (!duration) {
                    newCondition.duration = parseInt(defaultCondition.duration)
                } else {
                    newCondition.duration = parseInt(duration)
                }    
            }
            if (!defaultCondition.override) {
                newCondition.direction = parseInt(defaultCondition.direction)
            } else {
                if (!direction) {
                    newCondition.direction = parseInt(defaultCondition.direction)
                } else {    
                    newCondition.direction = parseInt(direction)
                }    
            }   
            if (!defaultCondition.override) {
                newCondition.message = defaultCondition.message
            } else {
                if (!message) {
                   newCondition.message = defaultCondition.message
                } else {
                    newCondition.message = message
                }   
            }  
           
            state[combatState].conditions.push(newCondition)

            if (newCondition.key == 'dead' || newCondition.duration <= 1) {
                addMarker(tokenObj,newCondition.icon,newCondition.duration)
            } else {   
                if (newCondition.duration >= 10) {
                    addMarker(tokenObj,newCondition.icon,newCondition.duration)
                } else {
                    addMarker(tokenObj,newCondition.icon,newCondition.duration)
                }
            }  
            
            if (state[combatState].config.status.sendConditions) {
                sendConditionToChat(newCondition, decodeURIComponent(defaultCondition.description))
            }  
        }    
    },  

    removeConditionFromToken = function(tokenObj,key) {
        let statusMarkers = tokenObj.get('statusmarkers').split()
        
        if (debug) {
            log('Remove Condition From Token')
            log('Token ID' + tokenObj.get("_id"))
        } 

        if (state[combatState].conditions.length > 0) {
            state[combatState].conditions.forEach((condition, i) => {
                if (condition.key == key && condition.id == tokenObj.get("_id")) {
                    statusMarkers.forEach((marker, j) => {
                        if (marker.indexOf(condition.icon)) {
                            statusMarkers.splice(j,1)
                            tokenObj.set('statusmarkers', statusMarkers.join())
                        }
                    })
                    state[combatState].conditions.splice(i, 1);
                }
            })
        }  
        //log(state[combatState].conditions)
    },

    sendConditionToChat = function (condition,description) {
        let icon = getDefaultIcon(condition.iconType,condition.icon, 'margin-right: 5px; margin-top: 5px; display: inline-block;');
        makeAndSendMenu(description, icon+condition.name,(state[combatState].config.status.sendOnlyToGM) ? 'gm' : '');
    },
    
    getCombatConditionByName = function (tokenID, name) {
        state[combatState].conditions[tokenID].forEach((condition) => {
            if (condition.name == name) {
                return true
            }
        })
        return false;
    },    
    
	editFavoriteState = function (value) {
		state[combatState].config.status.showConditions = value;
	},  

//*************************************************************************************************************
//START/STOP COMBAT
//*************************************************************************************************************	
    verifySetup = function(selectedTokens, initiative) {
        let initAttributes, turnorder, attribute, whisper, character, verified=true, i, tokenObj
 
        if (debug) {
            log('Verify Setup')
            log(initiative.rollInitiative)
        }
        
        if (!selectedTokens || selectedTokens.length == 0) {
            makeAndSendMenu('No tokens selected.  Combat not started',' ', whisper);   
            return false
        }
        
        if (initiative.rollInitiative == 'None') {
            turnorder = getTurnorder()
            if (turnorder.length == 0) {
                makeAndSendMenu('Auto Roll Initiative has been set to false and your turn order is currently empty',' ', whisper);
                verified=false
                return
            }
        }

        if (initiative.rollInitiative == 'CombatMaster') {
            selectedTokens.forEach(token => {
                if (token._type == 'graphic') {
                    tokenObj        = getObj('graphic', token._id)
                    whisper         = (tokenObj.layer == 'gmlayer') ? 'gm ' : ''
                    character       = getObj('character', tokenObj.get('represents'))
        
    				if (!character) {
                         makeAndSendMenu('A token was found not assigned to a character sheet',' ', whisper);   
                         verified = false
                    } else {  
                        initAttributes  = initiative.initiativeAttributes.split(';')
                        initAttributes.forEach((attributes) => {
                             attribute  = getAttrByName(character.id,attributes,'current') 
                             if (!attribute) {
                                 makeAndSendMenu('Initiative Attribute ' + attributes + ' not found on character sheet',' ', whisper);  
                                 verified=false
                             }                       
                        })
                    }    
                }    
			})    
        }  
        
        return verified
    },

    startCombat = function (selectedTokens) {
        let verified, initiative = state[combatState].config.initiative, turnorder=state[combatState].config.turnorder
        
        if (debug) {
            log('Start Combat')
        }

        verified = verifySetup(selectedTokens, initiative)
        if (!verified) {
            return
        }

        paused = false;
        Campaign().set('initiativepage', Campaign().get('playerpageid'));
        
        if(initiative.rollInitiative == 'CombatMaster'){
            rollInitiative(selectedTokens, initiative);
        } else if (initiative.rollInitiative == 'Group-Init') {
            rollGroupInit(selectedTokens)
        }

        setTimeout(function() {
            doTurnorderCalls()
            doTurnorderChange();
        },500) 
    },
    
    stopCombat = function () {
//        let tokenObj, statusmarkers
        if (debug) {
            log('Stop Combat')
        }
        
        if(timerObj) timerObj.remove();

        if (state[combatState].config.status.clearConditions) {
            state[combatState].conditions.forEach((condition) => {
                if (condition.id != getOrCreateMarker(true).get('id') && condition.id != getOrCreateMarker(false).get('id')) {
                    removeConditionFromToken(getObj('graphic',condition.id), condition.key)
                }  
            }) 
        }   
        
        state[combatState].conditions = [];
        removeMarkers();
        stopTimer();
        paused = false;
        Campaign().set({
            initiativepage: false,
            turnorder: ''
        });
        state[combatState].turnorder = {};
        round = 1;
    },

    rollInitiative = function (selectedTokens, initiative) {
        let tokenObj, whisper, initiativeTemp, initiativeRoll, characterObj, initAttributes, initiativeMod, i, advantageAttrib, initiativeAdv1, initiativeAdv2
        
        //loop through selected tokens
        selectedTokens.forEach(token => {
            if (token._type == 'graphic') {
                tokenObj        = getObj('graphic', token._id)
                characterObj    = getObj('character', tokenObj.get('represents'))

                if (characterObj) {
                    whisper         = (tokenObj.get('layer') === 'gmlayer') ? 'gm ' : ''
                    initiativeRoll  = (initiative.initiativeDie) ? randomInteger(initiative.initiativeDie) : 0;
                    initAttributes  = initiative.initiativeAttributes.split(';')
                    initiativeMod   = 0

                    initAttributes.forEach((attributes) => {
                        initiativeTemp  = getAttrByName(characterObj.id,attributes,'current') 
                        initiativeMod  += parseFloat(initiativeTemp)                        
                    })

                    //check for advantage initiative rolling (OGL)
                    advantageAttrib   = getAttrByName(characterObj.id, 'initiative_style', 'current');  
                    if (typeof advantageAttrib != 'undefined') {
                        // roll advantage for initiative
                        initiativeAdv1 = (initiative.initiativeDie) ? randomInteger(initiative.initiativeDie) : 0; 
                        initiativeAdv2 = (initiative.initiativeDie) ? randomInteger(initiative.initiativeDie) : 0;
                        // this is the value if in OGL if rolling advantage
                        if (advantageAttrib == '{@{d20},@{d20}}kh1') {
                            //determine which value is higher
                            if (initiativeAdv1 >= initiativeAdv2) {
                                initiativeRoll = initiativeAdv1
                            } else {
                                initiativeRoll = initiativeAdv2
                            }
                            //pass in both values and modifier for display
                            if (initiative.showInitiative) {
                                sendInitiativeChat(tokenObj.get('name'),initiativeAdv1,initiativeMod,initiativeAdv2,whisper)                            
                            }
                        } else if (initiative.showInitiative) { 
                            // if not rolling advantage, use first roll
                            initiativeRoll = initiativeAdv1
                            sendInitiativeChat(tokenObj.get('name'),initiativeRoll,initiativeMod,null,whisper)                              
                        }    
                    }  else if (initiative.showInitiative) { 
                        // if everything else then pass in for display
                         sendInitiativeChat(tokenObj.get('name'),initiativeRoll,initiativeMod,null,whisper)   
                    }  
                    //add to turnorder 
                    if (Number.isInteger(initiativeMod+initiativeRoll)) {
                        addToTurnorder({id:tokenObj.id,pr:(initiativeMod+initiativeRoll),custom:'',pageid:tokenObj.get("pageid")});
                    } else {
                        addToTurnorder({id:tokenObj.id,pr:(initiativeMod+initiativeRoll).toFixed(2),custom:'',pageid:tokenObj.get("pageid")});
                    }    
                }   
            }    
        });
        // sort turnorder if set
        if(state[combatState].config.turnorder.sortTurnOrder){
            sortTurnorder();
        }
    },

    rollGroupInit = function (selectedTokens) {
        let giRoll = () => sendChat('',`/w gm <code>GroupInitiative.RollForTokenIDs()</code> is not supported.`);    	
        

    	if('undefined' !== typeof GroupInitiative && GroupInitiative.RollForTokenIDs){
			GroupInitiative.RollForTokenIDs(
				(selectedTokens||[]).map(s=>s._id),{manualBonus: 0}
			);   
    	} 	
    },
    
    sendInitiativeChat = function (name,rollInit,bonus,rollInit1,whisper) { 
        let contents = ''
        
        if (rollInit1) {
            contents = '<table style="width: 50%; text-align: left; float: left;"> \
                            <tr> \
                                <th>Modifier</th> \
                                <td>'+bonus+'</td> \
                            </tr> \
                        </table> \
                        <div style="text-align: center"> \
                            <b style="font-size: 14pt;"> \
                                <span style="border: 1px solid green; padding-bottom: 2px; padding-top: 4px;">[['+rollInit+'+'+bonus+']]</span><br><br> \
                            </b> \
                        </div> \
                        <div style="text-align: center"> \
                            <b style="font-size: 10pt;"> \
                                <span style="border: 1px solid red; padding-bottom: 2px; padding-top: 4px;">[['+rollInit1+'+'+bonus+']]</span><br><br> \
                            </b> \
                        </div>'   
        } else {
             contents = '<table style="width: 50%; text-align: left; float: left;"> \
                            <tr> \
                                <th>Modifier</th> \
                                <td>'+bonus+'</td> \
                            </tr> \
                        </table> \
                        <div style="text-align: center"> \
                            <b style="font-size: 14pt;"> \
                                <span style="border: 1px solid green; padding-bottom: 2px; padding-top: 4px;">[['+rollInit+'+'+bonus+']]</span><br><br> \
                            </b> \
                        </div>'
           
        }  
        
        makeAndSendMenu(contents, name + ' Initiative', whisper);    
    },
//*************************************************************************************************************
//MARKERS
//*************************************************************************************************************	    
    addMarker = function(token, status, duration) {
        let statusmarkers = token.get('statusmarkers').split()
        log(statusmarkers)
        
        if (statusmarkers[status]) {
            statusmarkers[status] = status+'@'+duration
        } else {
           statusmarkers.push(status+'@'+duration) 
        }
        token.set('statusmarkers', statusmarkers.join())
        log(statusmarkers)
    },

    resetMarker = function (next=false) {
        let marker = getOrCreateMarker(next),
            turnorder = state[combatState].config.turnorder;
        
        if (debug) {
            log('Reset Marker')
        }
        
        marker.set({
            name: (next) ? 'NextMarker' : 'Round ' + round,
            imgsrc: (next) ? turnorder.nextExternalMarkerURL : turnorder.externalMarkerURL,
            pageid: Campaign().get('playerpageid'),
            layer: 'gmlayer',
            left: 35, top: 35,
            width: 70, height: 70
        });

        return marker;
    },

    getOrCreateMarker = function (next=false) {
        let pageid    = Campaign().get('playerpageid'),	
			turnorder = state[combatState].config.turnorder,
			marker, markers, imgsrc;
		
        if (debug) {
            log('Get or Create Marker')
            log('Turnorder:' + turnorder.markerType)
        }	
		
		if (turnorder.markerType == 'External URL') {	
            imgsrc = (next) ? turnorder.nextExternalMarkerURL : turnorder.externalMarkerURL
		} else {
			imgsrc = (next) ? turnorder.nextTokenMarkerURL : turnorder.tokenMarkerURL		
		}
        
 		markers = (next) ? findObjs({pageid,imgsrc,name: 'NextMarker'}) : findObjs({pageid,imgsrc});
        
        markers.forEach((marker, i) => {
            if(i > 0 && !next) marker.remove();
        });

        marker = markers.shift();
        if(!marker) {
            marker = createObj('graphic', {
                name: (next) ? 'NextMarker' : 'Round 1',
                imgsrc,
                pageid,
                layer: 'gmlayer',
                showplayers_name: true,
                left: 35, top: 35,
                width: 70, height: 70
            });
        }
        
        if(!next) checkMarkerturn(marker);
        
        toBack(marker);

        return marker;
    },

    checkMarkerturn = function (marker) {
        let turnorder = getTurnorder(),
            hasTurn = false;
        
        if (debug) {
            log ('Check Marker Turn')
        }    
        
        turnorder.forEach(turn => {
            if(turn.id === marker.get('id')) hasTurn = true;
        });

        if(!hasTurn){
            turnorder.push({ id: marker.get('id'), pr: -1, custom: '', pageid: marker.get('pageid') });
            Campaign().set('turnorder', JSON.stringify(turnorder));
        }
    },
    
    removeMarkers = function () {
        stopRotate();
        getOrCreateMarker().remove();
        getOrCreateMarker(true).remove();
    },
    
   changeMarker = function (token, next=false)  {
        let marker = getOrCreateMarker(next);

        if (debug) {
            log('Change Marker')
        }
        
        if(!token){
            resetMarker(next);
            return;
        }

        let position = {
            top: token.get('top'),
            left: token.get('left'),
            width: token.get('width')+(token.get('width')*0.35),
            height: token.get('height')+(token.get('height')*0.35),
        };

        if(token.get('layer') !== marker.get('layer')) {
            if(marker.get('layer') === 'gmlayer') { 
                marker.set(position);
                setTimeout(() => {
                    marker.set({ layer: 'objects' });
                }, 500);
            } else { 
                marker.set({ layer: 'gmlayer' });
                setTimeout(() => {
                    marker.set(position);
                }, 500);
            }
        } else {
            marker.set(position);
        }

        toBack(marker);
    },

    centerToken = function (token) {
        if(state[combatState].config.centerToken) {
            if (token.get('layer') != 'gmlayer') {
                sendPing(token.get('left'), token.get('top'), token.get('pageid'), null, true);
            }    
        }    
    },
    
    handleStatusMarkerChange = function (obj, prev) {
        if (debug) {
            log ('Handle Status Marker Change')
        } 

        prev.statusmarkers = (typeof prev.get === 'function') ? prev.get('statusmarkers') : prev.statusmarkers;

        if(typeof prev.statusmarkers === 'string'){
            if(obj.get('statusmarkers') !== prev.statusmarkers){

                var prevstatusmarkers = prev.statusmarkers.split(",");
                var statusmarkers = obj.get('statusmarkers').split(",");
                
                if (debug) {
                    log('New Statuses:'+statusmarkers)
                    log('Old Statuses:'+prevstatusmarkers)
                }

                prevstatusmarkers.forEach((marker) => {
                    let condition = getConditionByMarker(marker);
                    if(!condition) return;
                    
                    if(marker !== '' && !statusmarkers.includes(marker)){
                        removeConditionFromToken(obj, condition.key);
                    }
                })
                
                statusmarkers.forEach(function(marker){
                    let condition = getConditionByMarker(marker)
                    
                    if(!condition) return;

                    if(marker !== "" && !prevstatusmarkers.includes(marker)){
                        addConditionToToken(obj,condition.key,condition.duration,condition.direction,condition.message);
                    }
                });

            }
        }
    },    
//*************************************************************************************************************
//TURNORDER
//*************************************************************************************************************	      
    clearTurnorder = function () {
        Campaign().set({ turnorder: '' });
        state[combatState].turnorder = {};
    },

    doTurnorderChange = function (prev=false, delay=false) {
        let turn   = getCurrentTurn(),
            marker = getOrCreateMarker(),
            token  = getObj('graphic', turn.id);

        if(debug) {
            log('Turn Order Change')
        }
        
        if (turn.id === '-1') { 
            doTurnorderCalls()
            nextTurn();
            return;
        }

        if (turn.id === marker.id) {
            if (prev) {
                prevRound();
            } else { 
                nextRound();
            }    
            return;
        }

		if (token) {
            toFront(token);

            if (state[combatState].config.timer.useTimer) {
                startTimer(token);
            }

            changeMarker(token);
            announcePlayer(token, (token.get('layer') === 'objects') ? '' : 'gm', prev, delay);
            centerToken(token);
            doRoundCalls(token)            
//            doFX(token);
        } else {
            resetMarker();
        }

        if (state[combatState].config.turnorder.nextMarkerType) {
            let nextTurn = getNextTurn();
            let nextToken = getObj('graphic', nextTurn.id);

            if (nextToken) {
                toFront(nextToken);
                changeMarker(nextToken || false, true);
            } else {
                resetMarker(true);
            }
        }
    },
    
    handleTurnorderChange = function (obj, prev) {
        if (debug) {
            log("Handle Turnorder Change")
        }
        
        if(obj.get('turnorder') === prev.turnorder) return;

        let turnorder = (obj.get('turnorder') === "") ? [] : JSON.parse(obj.get('turnorder'));
        let prevTurnorder = (prev.turnorder === "") ? [] : JSON.parse(prev.turnorder);

        if(obj.get('turnorder') === "[]"){
            resetMarker();
            stopTimer();
            return;
        }

        if(turnorder.length && prevTurnorder.length && turnorder[0].id !== prevTurnorder[0].id){
            doTurnorderChange();
        }
    },

    sortTurnorder = function (order='DESC') {
        let turnorder = getTurnorder();

        turnorder.sort((a,b) => { 
            return (order === 'ASC') ? a.pr - b.pr : b.pr - a.pr;
        });

        setTurnorder(turnorder);
    },

    getTurnorder = function () {
        return (Campaign().get('turnorder') === '') ? [] : Array.from(JSON.parse(Campaign().get('turnorder')));
    },

    addToTurnorder = function (turn) {
        let turnorder = getTurnorder(),
            justDoIt = true;

        if (debug) {
            log('Add to Turnorder')
        }
        
        turnorder.push(turn);
        setTurnorder(turnorder);
    },

    setTurnorder = (turnorder) => {
        Campaign().set('turnorder', JSON.stringify(turnorder));
    },

//*************************************************************************************************************
//TURNS
//*************************************************************************************************************	          
    delayTurn = function () {
        let turnorder, currentTurn, nextTurn, dummy

        turnorder   = getTurnorder()
        currentTurn = turnorder.shift();
        
        if (getVeryNextTurn().id === getOrCreateMarker().get('id')) { 
            setTurnorder(turnorder)
            nextRound()
            turnorder   = getTurnorder()
            nextTurn = currentTurn
            currentTurn = turnorder.shift();
            turnorder.unshift(nextTurn)  
            turnorder.unshift(currentTurn)
            setTurnorder(turnorder);
            
            return;
        }
        
        nextTurn    = turnorder.shift();
        
        if (debug) {
            log('Delay Turn')
            log('Current:' + currentTurn)
            log('Next:'+nextTurn)
        }
        
        turnorder.unshift(currentTurn)
        turnorder.unshift(nextTurn)
        
        setTurnorder(turnorder);
        doTurnorderChange(false,true);
    },
    
    nextTurn = function() {
        let turnorder, currentTurn
      
        if (debug) {
            log('Next Turn')
        }
        
        turnorder   = getTurnorder(),
        currentTurn = turnorder.shift()
        turnorder.push(currentTurn);
        setTurnorder(turnorder);
        doTurnorderChange();
    },

    previousTurn = function() {
        let turnorder = getTurnorder(),
            last_turn = turnorder.pop();        
        turnorder.unshift(last_turn);

        setTurnorder(turnorder);
        doTurnorderChange(true);
    },

    nextRound = function () {
        let marker = getOrCreateMarker();
        round++;
        marker.set({ name: 'Round ' + round});
        
        if (debug) {
            log('Next Round')
        }

        if(state[combatState].config.announcements.announceRound){
            let text = '<span style="font-size: 12pt; font-weight: bold;">'+marker.get('name')+'</span>';
            makeAndSendMenu(text, ' ');
        }

        if(state[combatState].config.turnorder.rollEachRound){
            let turnorder = getTurnorder();
            clearTurnorder();
            checkMarkerturn(marker)
            rollInitiative(turnorder.map(t => { return (t.id) ? { _type: 'graphic', _id: t.id } : false }));
//           sortTurnorder();
            doTurnorderChange()
        }else{
            nextTurn();
            if(state[combatState].config.turnorder.sortTurnOrder){
                sortTurnorder();
            }
        }
    },

    getCurrentTurn = function () {
        return getTurnorder().shift();
    },

    getNextTurn = function () {
        let returnturn;
        getTurnorder().every((turn, i) => {
            if(i > 0 && turn.id !== '-1' && turn.id !== getOrCreateMarker().get('id')){
                returnturn = turn;
                return false;
            }else return true
        });
        return returnturn;
    },
    
    getVeryNextTurn = function () {
        let turnorder, turn;
        turnorder = getTurnorder();
        turn = turnorder.shift()
        turn = turnorder.shift()
        return turn;
    },  
    
    prevRound = function () {
        let marker = getOrCreateMarker();
        round--;
        marker.set({ name: 'Round ' + round});

        if(state[combatState].config.announcements.announceRound){
            let text = '<span style="font-size: 16pt; font-weight: bold;">'+marker.get('name')+'</span>';
            makeAndSendMenu(text);
        }

        previousTurn();
    },
//*************************************************************************************************************
//TIMER 
//*************************************************************************************************************	
    startTimer = function (token) {
        let timer = state[combatState].config.timer,
            config_time = parseInt(timer.time),
            time = config_time;

        paused = false;
        
        clearInterval(intervalHandle);
        
        if(timerObj) timerObj.remove();


        if(token && timer.showTokenTimer){
            timerObj = createObj('text', {
                text: 'Timer: ' + time,
                font_size: timer.timerFontSize,
                font_family: timer.timerFont,
                color: timer.timerFontColor,
                pageid: token.get('pageid'),
                layer: 'gmlayer'
            });
        }

        intervalHandle = setInterval(() => {
            if(paused) return;

            if(timerObj) timerObj.set({
                top: token.get('top')+token.get('width')/2+40,
                left: token.get('left'),
                text: 'Timer: ' + time,
                layer: token.get('layer')
            });

            if(state[combatState].config.timer.sendTimerToChat && (time === config_time || config_time/2 === time || config_time/4 === time || time === 10 || time === 5)){
                makeAndSendMenu('', 'Time Remaining: ' + time);
            }

            if(time <= 0){
                if(timerObj) timerObj.remove();
                clearInterval(intervalHandle);
                if(timer.skipTurn) nextTurn();
                else if(token.get('layer') !== 'gmlayer') makeAndSendMenu(token.get('name') + "'s time ran out!", '');
            }

            time--;
        }, 1000);
    },

    stopTimer = function () {
        clearInterval(intervalHandle);
        if(timerObj) timerObj.remove();
    },

    pauseTimer = function () {
        paused = !paused;
    },
//*************************************************************************************************************
//ANNOUNCE 
//*************************************************************************************************************	  
    announcePlayer = function (token, target, prev, delay=false, show) {
        let name, imgurl, conditions, image, doneButton, delayButton, contents,characterObj,players=[],playerObj;

        if (debug) {
            log('Announce Player')
            log('Target:'+target)
        }
        
        target      = (state[combatState].config.announcements.whisperToGM) ? 'gm' : target;
        name        = token.get('name');
        imgurl      = token.get('imgsrc');
        conditions  = getAnnounceConditions(token, prev, delay, show);
        image       = (imgurl) ? '<img src="'+imgurl+'" width="50px" height="50px"  />' : ''
        name        = (state[combatState].config.announcements.handleLongName) ? handleLongString(name) : name
        
        if (!show) {
            doneButton  = makeImageButton('!cm --turn,next',doneImage,'Done with Round','transparent',18)
            delayButton = makeImageButton('!cm --turn,delay',delayImage,'Delay your Turn','transparent',18);
        }    

        contents    = '<div style="display:inline-block;vertical-aligh:middle">'+image+'</div>'
        if (!show) {
            contents   += '<div style="display:inline-block;vertical-aligh:middle">'+name+'\'s Turn</div>'
        } else {
            contents   += '<div style="display:inline-block;vertical-aligh:middle">'+name+'</div>'
        }
        
        if (!show) {
            contents   += '<div style="display:inline-block;float:right;vertical-aligh:middle">'+doneButton+'</div>'
            contents   += '<div style="display:inline-block;float:right;vertical-aligh:middle">'+delayButton+'</div>'
        }
        
        if (state[combatState].config.announcements.announceTurn) {
            contents   += conditions
        }
    
        //send announcement
        if (state[combatState].config.announcements.announceTurn) {
            makeAndSendMenu(contents, '', target);
            if (state[combatState].config.status.userChanges) {
                characterObj    = getObj('character', token.get('represents'))    
                players         = characterObj.get('controlledby').split(',')
                if (typeof characterObj != 'undefined') {
                    players.forEach((playerID) => {
                        playerObj = getObj('player', playerID)
                        sendMainMenu(playerObj.get('_displayname'))
                    })
                }
            }
        }    
    },

    getAnnounceConditions = function (token, prev, delay, show) {
        let output = ' ', removeButton
        
        if (debug) {
            log('Announce Condition') 
        }

        removeButton  = makeImageButton('!cm remove',deleteImage,'Remove Condition','transparent',18)
        
        if (state[combatState].conditions) {
            [... state[combatState].conditions].forEach(condition => {
                if (condition.id ==  token.get("_id")) {
                    output  +=  '<div>'
                    
                    if (debug) {
                        log('Condition:' +condition.key)
                        log('Duration:' +condition.duration)
                        log('Direction:' +condition.direction)
                    }            
                    
                    if (!delay && !show) {
                        if (!prev) {
                            condition.duration = condition.duration + condition.direction
                        } else {
                            condition.duration = condition.duration - condition.direction
                        }
                    }    
                    
                    if (condition.duration == 0 && condition.direction != 0) {
                        output += '<div><strong>'+condition.name+'</strong> removed.</div>';
                        if (!delay && !show) {
                            removeConditionFromToken(token, condition.key);  
                        }    
                    } else if (condition.duration > 0 && condition.direction != 0) {
                        if (show) {
                            output += '<div><strong>'+makeButton(condition.name, '!cm --remove,condition='+condition.key+',id='+token.get("_id"))+'</strong>:'+condition.duration+' Rounds Left</div>'
                        } else {
                            output += '<div><strong>'+condition.name+'</strong>: '+condition.duration+' Rounds Left</div>';
                        }
                        
                        if (!delay && !show) {
                            if (condition.duration >= 10) {      
                                addConditionToToken(token,condition.key,condition.duration,condition.direction,condition.message)
                            } else {
                                addConditionToToken(token,condition.key,condition.duration,condition.direction,condition.message)
                            }   
                        }   
                        if (condition.message != 'None') {
                            output += '<div><strong>Message: </strong>: '+condition.message + '</div>';
                        }    
                    } else if (condition.direction == 0) {
                        if (show) {
                            output += '<div><strong>'+makeButton(condition.name, '!cm --remove,condition='+condition.key+',id='+token.get("_id"))+'</strong>:'+condition.duration+' Permanent (until removed)</div>'
                        } else {
                            output += '<div><strong>'+condition.name+'</strong>: '+condition.duration+' Permanent</div>';
                        } 
                        if (condition.message != 'None') {
                            output += '</div><strong>Message: </strong>: '+condition.message+ '</div>';
                        }    
                    }
                    output += '</div>'
                }    
            })
        }    

      return output;
    },    
//*************************************************************************************************************
//MAKES 
//*************************************************************************************************************	
    makeAndSendMenu = function (contents, title, whisper) {
        whisper = (whisper && whisper !== '') ? '/w ' + whisper + ' ' : '';
		title = makeTitle(title)
        sendChat(script_name, whisper + '<div style="'+styles.menu+styles.overflow+'">'+title+contents+'</div>', null, {noarchive:true});
    },

	makeTitle = function (title) {
		return '<div style="'+styles.title+'"><span style='+styles.titleText+'>'+title+'</span></div>'
	},
	
    makeBigButton = function (title, href) {
        return '<div style="'+styles.bigButton+'"><a style="'+styles.bigButtonLink+'" href="'+href+'">'+title+'</a></div>';
    },

	makeButton = function (title, href) {
        return '<a style="'+styles.conditionButton+'" href="'+href+'">'+title+'</a>';
    },

	makeTextButton = function (label, value, href) {
        return '<span style="'+styles.textLabel+'">'+label+'</span><a style="'+styles.textButton+'" href="'+href+'">'+value+'</a>';
    },

    makeImageButton = function(command, image, toolTip, backgroundColor,size){
        return '<div style="display:inline-block;margin-right:3px;padding:1px;vertical-align:middle;"><a href="'+command+'" title= "'+toolTip+'" style="margin:0px;padding:0px;border:0px solid;background-color:'+backgroundColor+'"><span style="color:black;padding:0px;font-size:'+size+'px;font-family: \'Pictos\'">'+image+'</span></a></div>'
    },
	
    makeList = function (items, backButton, extraButton) {
        let list;
        
        list  = '<ul style="'+styles.reset + styles.list + styles.overflow+'">'
		items.forEach((item) => {
            list += '<li style="'+styles.overflow+'">'+item+'</li>';
        });
		list += '</ul>'
		
		if (extraButton) {
			list += extraButton
		}
		if(backButton) {
			list += '<hr>'+backButton;
		}
        return list;
    },    
//*************************************************************************************************************
//ICONS 
//*************************************************************************************************************	        
    getDefaultIcon = function (iconType, icon, style='', height, width) {
        if (iconType == 'None') {
            return 'None'
        }
        
        if (iconType == 'Token Marker') {
            if('undefined' !== typeof libTokenMarkers && libTokenMarkers.getOrderedList){
                return libTokenMarkers.getStatus(icon).getHTML(1.7);
    
            }
        } else if (iconType == 'Combat Master') {   
            let X = '';
            let iconStyle = ''
            let iconSize = ''
    
            if(typeof icon_image_positions[icon] === 'undefined') return false;
    
            if (width) {
                iconStyle += 'width: '+width+'px;height: '+height+'px;';
            } else {
                iconStyle += 'width: 24px; height: 24px;';
            }      
            
            if(Number.isInteger(icon_image_positions[icon])){
                iconStyle += 'background-image: url(https://roll20.net/images/statussheet.png);'
                iconStyle += 'background-repeat: no-repeat;'
                iconStyle += 'background-position: -'+icon_image_positions[icon]+'px 0;'
            }else if(icon_image_positions[icon] === 'X'){
                iconStyle += 'color: red; margin-right: 0px;';
                X = 'X';
            }else{
                iconStyle += 'background-color: ' + icon_image_positions[icon] + ';';
                iconStyle += 'border: 1px solid white; border-radius: 50%;'
            }
    
            iconStyle += style;
    
            return '<div style="vertical-align:middle;'+iconStyle+'">'+X+'</div>';
        } else if (iconType == 'Token Condition') {
            
        }    
    },
    
    getTokenMarkers = function () {
        if('undefined' !== typeof libTokenMarkers && libTokenMarkers.getOrderedList){
            return libTokenMarkers.getOrderedList();
        }
        
        return null
    },    
 
    findIcon = function (icon) {
        markers.forEach((marker) => {
            if (marker.name == icon) {
                return marker.url
            }
        })
    },
    
//*************************************************************************************************************
//EXTERNAL CALLS 
//*************************************************************************************************************
    doFX = function (token, turn) {
        let fx, pos
        switch(type) {
            case 'turn':
                fx = state[combatState].config.turnorder.turnMacro
            case 'round':
                fx = state[combatState].config.turnorder.roundMacro
            case 'add':    
                fx = state[combatState].config.conditions[condition].addMacro
            case 'remove':    
                fx = state[combatState].config.conditions[condition].remMacro
            default:
                break;  
        }        
        
        if (!['None',''].includes(macroName) && token.get('layer') != 'gmlayer') {
            pos = {x: token.get('left'), y: token.get('top')};
            spawnFxBetweenPoints(pos, pos, fx, token.get('pageid'));
        }    
    },

    doTurnorderCalls = function () {
        let turnorder = getTurnorder(), turnConfig = state[combatState].config.turnorder, 
            tokenObj, characterObj, macroObj, action, macro, api, roll20am, type

        if (debug) {
            log("doTurnorderCalls")
        }
        
        if (!['None',''].includes(turnConfig.allRoundMacro)) {
            macro = turnConfig.allRoundMacro
            type      = 'all'
        }
        if (!['None',''].includes(turnConfig.characterRoundMacro)) {
            macro = turnConfig.characterRoundMacro
            type      = 'character'
        }
        if (!['None',''].includes(turnConfig.roundAPI)) {
            api = turnConfig.roundAPI
        }
        if (!['None',''].includes(turnConfig.roundRoll20AM)) {
            roll20am = turnConfig.roundRoll20AM
        }  
        
        if (macro) {
            macroObj = findObjs({type: 'macro',name: macro}, {caseinsensitive: true})[0]    
            action = macroObj.get('action')
            if (!macroObj) {
                sendChat('','Macro Name Not Found!');
                return;
            }             
        }  

        if (debug) {
            log('Macro:'+macro)
            log('Type:'+type)
            log('API:'+api)
            log('Roll20AM:'+roll20am)
        }    
        
        turnorder.forEach((turn) => {
            if (turn.id !== getOrCreateMarker().get('id')) {
                tokenObj     = getObj('graphic',turn.id);
                characterObj = getObj('character',tokenObj.get('represents'));

                if (characterObj) {
                    if (type == 'all') {
                        sendCalltoChat(tokenObj,characterObj,action)
                    }
                    if (type == 'character' && characterObj.get('controlledby')) {
                        sendCalltoChat(tokenObj,characterObj,action)
                    }
                    if (api) {
                        sendCalltoChat(tokenObj,characterObj,api)
                    }
                    if (roll20am) {
                        sendCalltoChat(tokenObj,characterObj,roll20am)
                    }                    
                }
            }
        });
    },
 
    doRoundCalls = function (token) {
        let turnConfig = state[combatState].config.turnorder, 
            characterObj, macroObj, action, macro, api, roll20am, type, tokenObj

        if (debug) {
            log("doRoundCalls")
        }
        
        if (!['None',''].includes(turnConfig.turnMacro)) {
            macro = turnConfig.turnMacro
        }
        if (!['None',''].includes(turnConfig.turnAPI)) {
            api = turnConfig.turnAPI
        }
        if (!['None',''].includes(turnConfig.turnRoll20AM)) {
            roll20am = turnConfig.turnRoll20AM
        }  
        
        if (macro) {
            macroObj = findObjs({type: 'macro',name: macro}, {caseinsensitive: true})[0]    
            action = macroObj.get('action')
            if (!macroObj) {
                sendChat('','Macro Name Not Found!');
                return;
            }             
        }  

        if (debug) {
            log('Macro:'+macro)
            log('Type:'+type)
            log('API:'+api)
            log('Roll20AM:'+roll20am)
        }    
        
        //tokenObj     = getObj('graphic',token.get('_id');
        characterObj = getObj('character',token.get('represents'));

        if (characterObj) {
            if (action) {
                sendCalltoChat(tokenObj,characterObj,action)
            }
            if (api) {
                sendCalltoChat(tokenObj,characterObj,api)
            }
            if (roll20am) {
                sendCalltoChat(tokenObj,characterObj,roll20am)
            }                    
        }
    },
 
    doAddConditionCalls = function (token,key) {
        let condition = state[combatState].config.conditions[key], 
            characterObj, macroObj, action, macro, api, roll20am, type, tokenObj

        if (debug) {
            log("doConditionMacros")
        }
        log(tokenObj)
        if (!['None',''].includes(condition.addMacro)) {
            macro = condition.addMacro
        }
        if (!['None',''].includes(condition.addAPI)) {
            api = condition.addAPI
        }
        if (!['None',''].includes(condition.addRoll20AM)) {
            roll20am = condition.addRoll20AM
        }  

        if (macro) {
            macroObj = findObjs({type: 'macro',name: macro}, {caseinsensitive: true})[0]    
            action = macroObj.get('action')
            if (!macroObj) {
                sendChat('','Macro Name Not Found!');
                return;
            }             
        }  

        if (debug) {
            log('Macro:'+macro)
            log('Type:'+type)
            log('API:'+api)
            log('Roll20AM:'+roll20am)
        }    
        
        tokenObj     = getObj('graphic',token._id);
        characterObj = getObj('character',tokenObj.get('represents'));

        if (characterObj) {
            if (action) {
                sendCalltoChat(tokenObj,characterObj,action)
            }
            if (api) {
                sendCalltoChat(tokenObj,characterObj,api)
            }
            if (roll20am) {
                sendCalltoChat(tokenObj,characterObj,roll20am)
            }                    
        }
    },
  
    doRemoveConditionCalls = function (token,key) {
        let condition = state[combatState].config.conditions[key], 
            characterObj, macroObj, action, macro, api, roll20am, type, tokenObj

        if (debug) {
            log("doConditionMacros")
        }
        
        if (!['None',''].includes(condition.remMacro)) {
            macro = condition.remMacro
        }
        if (!['None',''].includes(condition.remAPI)) {
            api = condition.remAPI
        }
        if (!['None',''].includes(condition.remRoll20AM)) {
            roll20am = condition.remRoll20AM
        }  

        if (macro) {
            macroObj = findObjs({type: 'macro',name: macro}, {caseinsensitive: true})[0]    
            action = macroObj.get('action')
            if (!macroObj) {
                sendChat('','Macro Name Not Found!');
                return;
            }             
        }  

        if (debug) {
            log('Macro:'+macro)
            log('Type:'+type)
            log('API:'+api)
            log('Roll20AM:'+roll20am)
        }    
        
        tokenObj     = getObj('graphic',token._id);
        characterObj = getObj('character',tokenObj.get('represents'));

        if (characterObj) {
            if (action) {
                sendCalltoChat(tokenObj,characterObj,action)
            }
            if (api) {
                sendCalltoChat(tokenObj,characterObj,api)
            }
            if (roll20am) {
                sendCalltoChat(tokenObj,characterObj,roll20am)
            }                    
        }
    },    

    sendCalltoChat = function(tokenObj,characterObj,action) {
        let substitutions = state[combatState].config.macro.substitutions, content
    	
        if (debug) {
            log("sendCalltoChat")
            log('Token:'+tokenObj.get('_id'))
            log('Character:'+characterObj.get('name'))
            log('Macro:'+action)
        }

        substitutions.forEach((substitution) => {
            if (substitution.type == 'CharName') {
                content = action.replace(substitution.action,characterObj.get('name'))
            } else if (substitution.type == 'CharID') {
                content = action.replace(substitution.action,characterObj.get('_id'))
            } else if (substitution.type == 'TokenID') {
                content = action.replace(substitution.action,tokenObj.get('_id'))
            }     
        })

        log(content)
        // sendChat(character.get('name'),content);        
    },

    newSubstitution = function(cmdDetails) {
        let substitution
        if (debug) {
            log('Add Substitution')
        }
        
        substitution = {
            type: cmdDetails.details.type,
            action: cmdDetails.details.action
        }
        
        state[combatState].config.macro.substitutions.push(substitution)
        log(state[combatState].config.macro.substitutions)
		sendMacroMenu();		
    },    


    removeSubstitution = function(cmdDetails) {
        if (debug) {
            log('Remove Substitution')
        }
        state[combatState].config.macro.substitutions.forEach((substitution, i) => {
            if (substitution.action == cmdDetails.details.action) {
                state[combatState].config.macro.substitutions.splice(i,1)
            }
        })


		sendMacroMenu();
    },  
    
    doAPI = function (token, turn) {
        let fx, pos
        switch(type) {
            case 'turn':
                fx = state[combatState].config.turnorder.turnMacro
            case 'round':
                fx = state[combatState].config.turnorder.roundMacro
            case 'add':    
                fx = state[combatState].config.conditions[condition].addMacro
            case 'remove':    
                fx = state[combatState].config.conditions[condition].remMacro
            default:
                break;  
        }        
        
        if (!['None',''].includes(macroName) && token.get('layer') != 'gmlayer') {
            pos = {x: token.get('left'), y: token.get('top')};
            spawnFxBetweenPoints(pos, pos, fx, token.get('pageid'));
        }    
    },    
//*************************************************************************************************************
//MISC 
//*************************************************************************************************************	     
    inFight = function () {
        return (Campaign().get('initiativepage') !== false);
    },
    
    updatePR = function (turn, modifier) {
        let turnorder = getTurnorder();

        turnorder.forEach((t, i) => {
            if(turn.id === t.id && turn.custom === t.custom){
                turnorder[i].pr = parseInt(t.pr) + modifier;
            }
        });

        setTurnorder(turnorder);
    },

    
    handleLongString = function (str, max=8) {
        str = str.split(' ')[0];
        return (str.length > max) ? str.slice(0, max) + '...' : str;
    },


    stopRotate = function () {
        clearInterval(rotationInterval);
    },

    randomBetween = function (min, max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    },

    handeIniativePageChange = function (obj,prev) {
        if((obj.get('initiativepage') !== prev.initiativepage && !obj.get('initiativepage'))){
            stopCombat();
        }
    },

    observeTokenChange = function(handler){
        if(handler && _.isFunction(handler)){
            observers.tokenChange.push(handler);
        }
    },

    notifyObservers = function(event,obj,prev){
        _.each(observers[event],function(handler){
            handler(obj,prev);
        });
    },

    handleGraphicMovement = function (obj /*, prev */) {
        let turnID, objID
        if (debug) {
            log ('Handle Graphic Movement')
        } 
 
        if(!inFight()) return;

        if (obj.hasOwnProperty("id")) {
            if (getCurrentTurn().id && obj.get('id')) {
                if(getCurrentTurn().id === obj.get('id')){
                    changeMarker(obj);
                }
            }   
        }    
    },

    handleShapedSheet = function (characterid, condition, add) {
        if (debug) {
            log ('Handle Shaped Sheet Change')
        } 
        let character = getObj('character', characterid);
        if(character){
            let sheet = getAttrByName(character.get('id'), 'character_sheet', 'current');
            if(!sheet || !sheet.toLowerCase().includes('shaped')) return;
            if(!shaped_conditions.includes(condition)) return;

            let attributes = {};
            attributes[condition] = (add) ? '1': '0';
            setAttrs(character.get('id'), attributes);
        }
    },

    //return an array of objects according to key, value, or key and value matching
    getObjects = function (obj, key, val) {
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(getObjects(obj[i], key, val));    
            } else 
            //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
            if (i == key && obj[i] == val || i == key && val == '') { //
                objects.push(obj);
            } else if (obj[i] == val && key == ''){
                //only add if the object is not already in the array
                if (objects.lastIndexOf(obj) == -1){
                    objects.push(obj);
                }
            }
        }
        return objects;
    },

    
    esRE = function (s) {
        var escapeForRegexp = /(\\|\/|\[|\]|\(|\)|\{|\}|\?|\+|\*|\||\.|\^|\$)/g;
        return s.replace(escapeForRegexp,"\\$1");
    },

    HE = (function(){
        var entities={
                //' ' : '&'+'nbsp'+';',
                '<' : '&'+'lt'+';',
                '>' : '&'+'gt'+';',
                "'" : '&'+'#39'+';',
                '@' : '&'+'#64'+';',
                '{' : '&'+'#123'+';',
                '|' : '&'+'#124'+';',
                '}' : '&'+'#125'+';',
                '[' : '&'+'#91'+';',
                ']' : '&'+'#93'+';',
                '"' : '&'+'quot'+';'
            },
            re=new RegExp('('+_.map(_.keys(entities),esRE).join('|')+')','g');
        return function(s){
            return s.replace(re, function(c){ return entities[c] || c; });
        };
    }()),
    
    ucFirst = function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    
    buildParty = function(){
		var partyList = '|All,all';
        _.each(findObjs({type:'player'}),player=>{
            let who = getObj('player', player.id).get('displayname');
            if (playerIsGM(player.id)){
              who = 'gm'
            }            
            partyList += '|'+who+','+who
        });
        return partyList;
    },

    setDefaults = function (reset) {
        let key, condition   
        
        if (debug) {
            log ('Set Defaults')
        }
        
        const combatDefaults = {
            conditions: [],
			config: {
                command: 'cm',		
				duration: false,
				favorite: false,
				previousPage: null,				
				initiative: {
                    rollInitiative: 'CombatMaster',
                    initiativeDie: 20,
					initiativeAttributes: 'initiative_bonus',					
                    showInitiative: false,
                    rollEachRound: false,
                    apiTargetTokens: 'None'				
				},
                turnorder: {
					markerType: 'External URL',
					externalMarkerURL: 'https://s3.amazonaws.com/files.d20.io/images/52550079/U-3U950B3wk_KRtspSPyuw/thumb.png?1524507826',
					nextMarkerType: 'External URL',
					nextExternalMarkerURL: 'https://s3.amazonaws.com/files.d20.io/images/66352183/90UOrT-_Odg2WvvLbKOthw/thumb.png?1541422636',
					tokenMarkerName: 'None',
					tokenMarkerURL: null,
					nextTokenMarkerName: 'None',
					nextTokenMarkerURL: null,
	                sortTurnOrder: true,
					centerToken: true,	
					turnAPI: 'None',
					turnRoll20AM: 'None',
					turnFX: 'None',
                    turnMacro: 'None',
					roundAPI: 'None',
					roundRoll20AM: 'None',
					roundFX: 'None',
					roundMacro: 'None',	
					characterRoundMacro: 'None',
					allRoundMacro: 'None',					
                },
                timer: {
                    useTimer: true,
                    time: 120,
                    skipTurn: true,
                    sendTimerToChat: true,
                    showTokenTimer: true,
                    timerFont: 'Candal',
                    timerFontSize: 16,
                    timerFontColor: 'rgb(255, 0, 0)'
                },
                announcements: {
                    announceTurn: true,
                    whisperToGM: false,
                    announceRound: true,
                    handleLongName: true,
                },
                macro: {
                    substitutions: [],
                },				
				status: {
					command: 'condition',
					userAllowed: false,
					userChanges: false,
					sendOnlyToGM: false,
					sendConditions: true,
					clearConditions: false,
					showConditions: 'all',
					useMessage: false,
				},	
			    conditions: {
					blinded: {
						name: 'Blinded',
						key: 'blinded',
						description: encodeURIComponent('<p>A blinded creature cannot see and automatically fails any ability check that requires sight.</p> <p>Attack rolls against the creature have advantage, and the creature making Attack rolls have disadvantage.</p>'),
						icon: 'bleeding-eye',
						iconType: 'Combat Master',
						duration: 1,
						direction: -1,
						override: true,
						favorite: false,
						message: 'None',
						addAPI: 'None',
						addRoll20AM: 'None',
						addFX: 'None',
						addMacro: 'None',
						remAPI: 'None',
						remRoll20AM: 'None',
						remFX: 'None',
						remMacro: 'None',
					},
					charmed: {
						name: 'Charmed',
						key: 'charmed',
						description: '<p>A charmed creature canÃ¢â‚¬â„¢t Attack the charmer or target the charmer with harmful Abilities or magical effects.</p> <p>The charmer has advantage on any ability check to interact socially with the creature.</p>',
						icon: 'broken-heart',
						iconType: 'Combat Master',
						duration: 1,
						direction: -1,
						override: true,
						favorite: false,
						message: 'None',
						addAPI: 'None',
						addRoll20AM: 'None',
						addFX: 'None',
						addMacro: 'None',
						remAPI: 'None',
						remRoll20AM: 'None',
						remFX: 'None',
						remMacro: 'None',
					},
					deafened: {
						name: 'Deafened',
						key: 'deafened',
						description: '<p>A deafened creature canÃ¢â‚¬â„¢t hear and automatically fails any ability check that requires hearing.</p>',
						icon: 'edge-crack',
						iconType: 'Combat Master',
						duration: 1,
						direction: -1,
						override: true,
						favorite: false,
						message: 'None',
						addAPI: 'None',
						addRoll20AM: 'None',
						addFX: 'None',
						addMacro: 'None',
						remAPI: 'None',
						remRoll20AM: 'None',
						remFX: 'None',
						remMacro: 'None',
					},
					frightened: {
						name: 'Frightened',
						key: 'frightened',
						description: '<p>A frightened creature has disadvantage on Ability Checks and Attack rolls while the source of its fear is within line of sight.</p> <p>The creature canÃ¢â‚¬â„¢t willingly move closer to the source of its fear.</p>',
						icon: 'screaming',
						iconType: 'Combat Master',
						duration: 1,
						direction: -1,
						override: true,
						favorite: false,
						message: 'None',
						addAPI: 'None',
						addRoll20AM: 'None',
						addFX: 'None',
						addMacro: 'None',
						remAPI: 'None',
						remRoll20AM: 'None',
						remFX: 'None',
						remMacro: 'None',
					},
					grappled: {
						name: 'Grappled',
						key: 'grappled',
						description: '<p>A grappled creatureÃ¢â‚¬â„¢s speed becomes 0, and it canÃ¢â‚¬â„¢t benefit from any bonus to its speed.</p> <p>The condition ends if the Grappler is <i>incapacitated</i>.</p> <p>The condition also ends if an effect removes the grappled creature from the reach of the Grappler or Grappling effect, such as when a creature is hurled away by the Thunderwave spell.</p>',
						icon: 'grab',
						iconType: 'Combat Master',
						duration: 1,
						direction: -1,
						override: true,
						favorite: false,
						message: 'None',
						addAPI: 'None',
						addRoll20AM: 'None',
						addFX: 'None',
						addMacro: 'None',
						remAPI: 'None',
						remRoll20AM: 'None',
						remFX: 'None',
						remMacro: 'None',					
					},
					incapacitated: {
						name: 'Incapacitated',
						key: 'incapacitated',
						description: '<p>An incapacitated creature canÃ¢â‚¬â„¢t take actions or reactions.</p>',
						icon: 'interdiction',
						iconType: 'Combat Master',
						duration: 1,
						direction: -1,
						override: true,
						favorite: false,
						message: 'None',
						addAPI: 'None',
						addRoll20AM: 'None',
						addFX: 'None',
						addMacro: 'None',
						remAPI: 'None',
						remRoll20AM: 'None',
						remFX: 'None',
						remMacro: 'None',						
					},
					inspiration: {
						name: 'Inspiration',
						key: 'inspiration',
						description: '<p>If you have inspiration, you can expend it when you make an Attack roll, saving throw, or ability check. Spending your inspiration gives you advantage on that roll.</p> <p>Additionally, if you have inspiration, you can reward another player for good roleplaying, clever thinking, or simply doing something exciting in the game. When another player character does something that really contributes to the story in a fun and interesting way, you can give up your inspiration to give that character inspiration.</p>',
						icon: 'black-flag',
						iconType: 'Combat Master',
						duration: 1,
						direction: -1,
						override: true,
						favorite: false,
						message: 'None',
						addAPI: 'None',
						addRoll20AM: 'None',
						addFX: 'None',
						addMacro: 'None',
						remAPI: 'None',
						remRoll20AM: 'None',
						remFX: 'None',
						remMacro: 'None',	
					},
					invisibility: {
						name: 'Invisibility',
						key: 'invisibility',
						description: '<p>An invisible creature is impossible to see without the aid of magic or a Special sense. For the purpose of Hiding, the creature is heavily obscured. The creatureÃ¢â‚¬â„¢s location can be detected by any noise it makes or any tracks it leaves.</p> <p>Attack rolls against the creature have disadvantage, and the creatureÃ¢â‚¬â„¢s Attack rolls have advantage.</p>',
						icon: 'ninja-mask',
						iconType: 'Combat Master',
						duration: 1,
						direction: -1,
						override: true,
						favorite: false,
						message: 'None',
						addAPI: 'None',
						addRoll20AM: 'None',
						addFX: 'None',
						addMacro: 'None',
						remAPI: 'None',
						remRoll20AM: 'None',
						remFX: 'None',
						remMacro: 'None',	
					},
					paralyzed: {
						name: 'Paralyzed',
						key: 'paralyzed',
						description: '<p>A paralyzed creature is <i>incapacitated</i> and canÃ¢â‚¬â„¢t move or speak.</p> <p>The creature automatically fails Strength and Dexterity saving throws.</p> <p>Attack rolls against the creature have advantage.</p> <p>Any Attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.</p>',
						icon: 'pummeled',
						iconType: 'Combat Master',
						duration: 1,
						direction: -1,
						override: true,
						favorite: false,
						message: 'None',
						addAPI: 'None',
						addRoll20AM: 'None',
						addFX: 'None',
						addMacro: 'None',
						remAPI: 'None',
						remRoll20AM: 'None',
						remFX: 'None',
						remMacro: 'None',	
					},
					petrified: {
						name: 'Petrified',
						key: 'petrified',
						description: '<p>A petrified creature is transformed, along with any nonmagical object it is wearing or carrying, into a solid inanimate substance (usually stone). Its weight increases by a factor of ten, and it ceases aging.</p> <p>The creature is <i>incapacitated</i>, canÃ¢â‚¬â„¢t move or speak, and is unaware of its surroundings.</p> <p>Attack rolls against the creature have advantage.</p> <p>The creature automatically fails Strength and Dexterity saving throws.</p> <p>The creature has Resistance to all damage.</p> <p>The creature is immune to poison and disease, although a poison or disease already in its system is suspended, not neutralized.</p>',
						icon: 'frozen-orb',
						iconType: 'Combat Master',
						duration: 1,
						direction: -1,
						override: true,
						favorite: false,
						message: 'None',
						addAPI: 'None',
						addRoll20AM: 'None',
						addFX: 'None',
						addMacro: 'None',
						remAPI: 'None',
						remRoll20AM: 'None',
						remFX: 'None',
						remMacro: 'None',	
					},
					poisoned: {
						name: 'Poisoned',
						key: 'poisoned',
						description: '<p>A poisoned creature has disadvantage on Attack rolls and Ability Checks.</p>',
						icon: 'chemical-bolt',
						iconType: 'Combat Master',
						duration: 1,
						direction: -1,
						override: true,
						favorite: false,
						message: 'None',
						addAPI: 'None',
						addRoll20AM: 'None',
						addFX: 'None',
						addMacro: 'None',
						remAPI: 'None',
						remRoll20AM: 'None',
						remFX: 'None',
						remMacro: 'None',	
					},
					prone: {
						name: 'Prone',
						key: 'prone',
						description: '<p>A prone creatureÃ¢â‚¬â„¢s only Movement option is to crawl, unless it stands up and thereby ends the condition.</p> <p>The creature has disadvantage on Attack rolls.</p> <p>An Attack roll against the creature has advantage if the attacker is within 5 feet of the creature. Otherwise, the Attack roll has disadvantage.</p>',
						icon: 'back-pain',
						iconType: 'Combat Master',
						duration: 1,
						direction: -1,
						override: true,
						favorite: false,
						message: 'None',
						addAPI: 'None',
						addRoll20AM: 'None',
						addFX: 'None',
						addMacro: 'None',
						remAPI: 'None',
						remRoll20AM: 'None',
						remFX: 'None',
						remMacro: 'None',	
					},
					restrained: {
						name: 'Restrained',
						key: 'restrained',
						description: '<p>A restrained creatureÃ¢â‚¬â„¢s speed becomes 0, and it canÃ¢â‚¬â„¢t benefit from any bonus to its speed.</p> <p>Attack rolls against the creature have advantage, and the creatureÃ¢â‚¬â„¢s Attack rolls have disadvantage.</p> <p>The creature has disadvantage on Dexterity saving throws.</p>',
						icon: 'fishing-net',
						iconType: 'Combat Master',
						duration: 1,
						direction: -1,
						override: true,
						favorite: false,
						message: 'None',
						addAPI: 'None',
						addRoll20AM: 'None',
						addFX: 'None',
						addMacro: 'None',
						remAPI: 'None',
						remRoll20AM: 'None',
						remFX: 'None',
						remMacro: 'None',	
					},
					stunned: {
						name: 'Stunned',
						key: 'stunned',
						description: '<p>A stunned creature is <i>incapacitated</i>, canÃ¢â‚¬â„¢t move, and can speak only falteringly.</p> <p>The creature automatically fails Strength and Dexterity saving throws.</p> <p>Attack rolls against the creature have advantage.</p>',
						icon: 'fist',
						iconType: 'Combat Master',
						duration: 1,
						direction: -1,
						override: true,
						favorite: false,
						message: 'None',
						addAPI: 'None',
						addRoll20AM: 'None',
						addFX: 'None',
						addMacro: 'None',
						remAPI: 'None',
						remRoll20AM: 'None',
						remFX: 'None',
						remMacro: 'None',	
					},
					unconscious: {
						name: 'Unconscious',
						key: 'unconscious',
						description: '<p>An unconscious creature is <i>incapacitated</i>, canÃ¢â‚¬â„¢t move or speak, and is unaware of its surroundings.</p> <p>The creature drops whatever itÃ¢â‚¬â„¢s holding and falls prone.</p> <p>The creature automatically fails Strength and Dexterity saving throws.</p> <p>Attack rolls against the creature have advantage.</p> <p>Any Attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.</p>',
						icon: 'sleepy',
						iconType: 'Combat Master',
						duration: 1,
						direction: -1,
						override: true,
						favorite: false,
						message: 'None',
						addAPI: 'None',
						addRoll20AM: 'None',
						addFX: 'None',
						addMacro: 'None',
						remAPI: 'None',
						remRoll20AM: 'None',
						remFX: 'None',
						remMacro: 'None',	
					},				
				},	
            },
        };

        if(!state[combatState].config || typeof state[combatState].config == 'undefined' || reset) {
            state[combatState].config = combatDefaults.config;
        } else {
		
            if(!state[combatState].config.hasOwnProperty('command')){
                state[combatState].config.command = combatDefaults.config.command;
            }
			if(!state[combatState].config.hasOwnProperty('favorite')){
				state[combatState].config.favorite = combatDefaults.config.favorite;
			}  			
			if(!state[combatState].config.hasOwnProperty('previousPage')){
				state[combatState].config.previousPage = combatDefaults.config.previousPage;
			}  
				
            if(!state[combatState].config.hasOwnProperty('initiative')){
                state[combatState].config.initiative = combatDefaults.config.initiative;
            } else {		
				if(!state[combatState].config.initiative.hasOwnProperty('initiativeAttributes')){
					state[combatState].config.initiative.initiativeAttributes = combatDefaults.config.initiative.initiativeAttributes;
				}			
                if(!state[combatState].config.initiative.hasOwnProperty('rollInitiative')){
                    state[combatState].config.initiative.rollInitiative = combatDefaults.config.initiative.rollInitiative;
                }
                if(!state[combatState].config.initiative.hasOwnProperty('initiativeDie')){
                    state[combatState].config.initiative.initiativeDie = combatDefaults.config.initiative.initiativeDie;
                }

                if(!state[combatState].config.initiative.hasOwnProperty('rollEachRound')){
                    state[combatState].config.initiative.rollEachRound = combatDefaults.config.initiative.rollEachRound;
                }
                if(!state[combatState].config.initiative.hasOwnProperty('apiTargetTokens')){
                    state[combatState].config.initiative.apiTargetTokens = combatDefaults.config.initiative.apiTargetTokens;
                }  
			}			
						
            if(!state[combatState].config.hasOwnProperty('turnorder')){
                state[combatState].config.turnorder = combatDefaults.config.turnorder;
            } else {
				if(!state[combatState].config.turnorder.hasOwnProperty('markerType')){
					state[combatState].config.turnorder.markerType = combatDefaults.config.turnorder.markerType;
				}            
				if(!state[combatState].config.turnorder.hasOwnProperty('externalMarkerURL')){
					state[combatState].config.turnorder.externalMarkerURL = combatDefaults.config.turnorder.externalMarkerURL;
				}
				if(!state[combatState].config.turnorder.hasOwnProperty('nextMarkerType')){
					state[combatState].config.turnorder.nextMarkerType = combatDefaults.config.turnorder.nextMarkerType;
				}
				if(!state[combatState].config.turnorder.hasOwnProperty('nextExternalMarkerURL')){
					state[combatState].config.turnorder.nextExternalMarkerURL = combatDefaults.config.turnorder.nextExternalMarkerURL;
				}
				if(!state[combatState].config.turnorder.hasOwnProperty('tokenMarkerName')){
					state[combatState].config.turnorder.tokenMarkerName = combatDefaults.config.turnorder.tokenMarkerName;
				} 
				if(!state[combatState].config.turnorder.hasOwnProperty('tokenMarkerURL')){
					state[combatState].config.turnorder.tokenMarkerURL = combatDefaults.config.turnorder.tokenMarkerURL;
				} 				
				if(!state[combatState].config.turnorder.hasOwnProperty('nextTokenMarkerName')){
					state[combatState].config.turnorder.nextTokenMarkerName = combatDefaults.config.turnorder.nextTokenMarkerName;
				}	
				if(!state[combatState].config.turnorder.hasOwnProperty('nextTokenMarkerURL')){
					state[combatState].config.turnorder.nextTokenMarkerURL = combatDefaults.config.turnorder.nextTokenMarkerURL;
				}				
				if(!state[combatState].config.turnorder.hasOwnProperty('centerToken')){
					state[combatState].config.turnorder.centerToken = combatDefaults.config.turnorder.centerToken;
				}	
                if(!state[combatState].config.turnorder.hasOwnProperty('sortTurnOrder')){
                    state[combatState].config.turnorder.sortTurnOrder = combatDefaults.config.turnorder.sortTurnOrder;
                }	
                if(!state[combatState].config.turnorder.hasOwnProperty('turnAPI')){
                    state[combatState].config.turnorder.turnAPI = combatDefaults.config.turnorder.turnAPI;
                }		
                if(!state[combatState].config.turnorder.hasOwnProperty('turnRoll20AM')){
                    state[combatState].config.turnorder.turnRoll20AM = combatDefaults.config.turnorder.turnRoll20AM;
                }				
                if(!state[combatState].config.turnorder.hasOwnProperty('turnFX')){
                    state[combatState].config.turnorder.turnFX = combatDefaults.config.turnorder.turnFX;
                }
                if(!state[combatState].config.turnorder.hasOwnProperty('turnMacro')){
                    state[combatState].config.turnorder.turnMacro = combatDefaults.config.turnorder.turnMacro;
                }    
                 
                if(!state[combatState].config.turnorder.hasOwnProperty('roundAPI')){
                    state[combatState].config.turnorder.roundAPI = combatDefaults.config.turnorder.roundAPI;
                }		
                if(!state[combatState].config.turnorder.hasOwnProperty('roundRoll20AM')){
                    state[combatState].config.turnorder.roundRoll20AM = combatDefaults.config.turnorder.roundRoll20AM;
                }				
                if(!state[combatState].config.turnorder.hasOwnProperty('roundFX')){
                    state[combatState].config.turnorder.roundFX = combatDefaults.config.turnorder.roundFX;
                }
                if(!state[combatState].config.turnorder.hasOwnProperty('characterRoundMacro')){
                    state[combatState].config.turnorder.characterRoundMacro = combatDefaults.config.turnorder.characterRoundMacro;
                }     
                if(!state[combatState].config.turnorder.hasOwnProperty('allRoundMacro')){
                    state[combatState].config.turnorder.allRoundMacro = combatDefaults.config.turnorder.allRoundMacro;
                }          
            }
			
            if(!state[combatState].config.hasOwnProperty('timer')){
                state[combatState].config.timer = combatDefaults.config.timer;
            } else {
                if(!state[combatState].config.timer.hasOwnProperty('useTimer')){
                    state[combatState].config.timer.useTimer = combatDefaults.config.timer.useTimer;
                }
                if(!state[combatState].config.timer.hasOwnProperty('time')){
                    state[combatState].config.timer.time = combatDefaults.config.timer.time;
                }
                if(!state[combatState].config.timer.hasOwnProperty('skipTurn')){
                    state[combatState].config.timer.skipTurn = combatDefaults.config.timer.skipTurn;
                }
                if(!state[combatState].config.timer.hasOwnProperty('sendTimerToChat')){
                    state[combatState].config.timer.sendTimerToChat = combatDefaults.config.timer.sendTimerToChat;
                }
                if(!state[combatState].config.timer.hasOwnProperty('showTokenTimer')){
                    state[combatState].config.timer.showTokenTimer = combatDefaults.config.timer.showTokenTimer;
                }
                if(!state[combatState].config.timer.hasOwnProperty('timerFont')){
                    state[combatState].config.timer.timerFont = combatDefaults.config.timer.timerFont;
                }
                if(!state[combatState].config.timer.hasOwnProperty('timerFontSize')){
                    state[combatState].config.timer.timerFontSize = combatDefaults.config.timer.timerFontSize;
                }
                if(!state[combatState].config.timer.hasOwnProperty('timerFontColor')){
                    state[combatState].config.timer.timerFontColor = combatDefaults.config.timer.timerFontColor;
                }
            }
			
            if(!state[combatState].config.hasOwnProperty('announcements')){
                state[combatState].config.announcements = combatDefaults.config.announcements;
            } else {
                if(!state[combatState].config.announcements.hasOwnProperty('announceTurn')){
                    state[combatState].config.announcements.announceTurn = combatDefaults.config.announcements.announceTurn;
                }
                if(!state[combatState].config.announcements.hasOwnProperty('whisperToGM')){
                    state[combatState].config.announcements.whisperToGM = combatDefaults.config.announcements.whisperToGM;
                }
                if(!state[combatState].config.announcements.hasOwnProperty('announceRound')){
                    state[combatState].config.announcements.announceRound = combatDefaults.config.announcements.announceRound;
                }
                if(!state[combatState].config.announcements.hasOwnProperty('handleLongName')){
                    state[combatState].config.announcements.handleLongName = combatDefaults.config.announcements.handleLongName;
                }
			}

            if(!state[combatState].config.hasOwnProperty('macro')){
                state[combatState].config.macro = combatDefaults.config.macro;
            }
            
			if(!state[combatState].config.status.hasOwnProperty('status')) {
				state[combatState].config.status = combatDefaults.config.status;
			} else {
				if(!state[combatState].config.status.hasOwnProperty('userChanges')){
					state[combatState].config.status.userChanges = combatDefaults.config.status.userChanges;
				}
				if(!state[combatState].config.status.hasOwnProperty('sendOnlyToGM')){
					state[combatState].config.status.sendOnlyToGM = combatDefaults.config.status.sendOnlyToGM;
				}
				if(!state[combatState].config.status.hasOwnProperty('sendConditions')){
					state[combatState].config.status.sendConditions = combatDefaults.config.status.sendConditions;
				}           
				if(!state[combatState].config.status.hasOwnProperty('clearConditions')){
					state[combatState].config.status.clearConditions = combatDefaults.config.status.clearConditions;
				}      
				if(!state[combatState].config.status.hasOwnProperty('useMessage')){
					state[combatState].config.status.useMessage = combatDefaults.config.status.useMessage;
				}
				if(!state[combatState].config.status.hasOwnProperty('showConditions')){
					state[combatState].config.status.showConditions = combatDefaults.config.status.showConditions;
				}				
            }
        }
        
        if(!state[combatState].hasOwnProperty('conditions')){
            state[combatState].conditions = combatDefaults.conditions;
        } 

        if(state[combatState].config.hasOwnProperty('conditions') && !reset){        
            for (key in state[combatState].config.conditions) {
                condition = getConditionByKey(key)
                if (!condition.hasOwnProperty('key')) {
                    condition.key = key
                }                
                if (!condition.hasOwnProperty('duration')) {
                    condition.duration = 1
                }
                if (!condition.hasOwnProperty('direction')) {
                    condition.direction = 0
                }
                if (!condition.hasOwnProperty('override')) {
                    condition.override = true
                }
                if (!condition.hasOwnProperty('favorite')) {
                    condition.favorite = false
                }
                if (!condition.hasOwnProperty('message')) {
                    condition.message = 'None'
                }
                if (!condition.hasOwnProperty('iconType')) {
                    condition.iconType = 'Combat Master'
                }   
                if (!condition.hasOwnProperty('addAPI')) {
                    condition.addAPI = 'None'
                }                  
                if (!condition.hasOwnProperty('addRoll20AM')) {
                    condition.addRoll20AM = 'None'
                }  
                if (!condition.hasOwnProperty('addFX')) {
                    condition.addFX = 'None'
                }      
                if (!condition.hasOwnProperty('addMacro')) {
                    condition.addMacro = 'None'
                }  
                if (!condition.hasOwnProperty('remAPI')) {
                    condition.remAPI = 'None'
                }    
                if (!condition.hasOwnProperty('remRoll20AM')) {
                    condition.remRoll20AM = 'None'
                }  
                if (!condition.hasOwnProperty('remFX')) {
                    condition.remFX = 'None'
                }      
                if (!condition.hasOwnProperty('remMacro')) {
                    condition.remMacro = 'None'
                }  
            };
        } else if (!state[combatState].config.hasOwnProperty('conditions') || reset) {    
            state[combatState].config.conditions = combatDefaults.config.conditions;
        }
    },
    
    buildHelp = function () {
        let combatMaster            = findObjs({type:'handout',name:'Combat Master'}, {caseinsensitive: true})[0],
            combatMasterSetup       = findObjs({type:'handout',name:'Combat Master Setup'}, {caseinsensitive: true})[0],
            combatMasterInit        = findObjs({type:'handout',name:'Combat Master Initiative'}, {caseinsensitive: true})[0],
            combatMasterTurnorder   = findObjs({type:'handout',name:'Combat Master Turnorder'}, {caseinsensitive: true})[0],
            combatMasterTimer       = findObjs({type:'handout',name:'Combat Master Timer'}, {caseinsensitive: true})[0],
            combatMasterAnnounce    = findObjs({type:'handout',name:'Combat Master Announce'}, {caseinsensitive: true})[0],
            combatMasterStatus      = findObjs({type:'handout',name:'Combat Master Status'}, {caseinsensitive: true})[0],
            combatMasterConditions  = findObjs({type:'handout',name:'Combat Master Conditions'}, {caseinsensitive: true})[0],
            combatMasterCondition   = findObjs({type:'handout',name:'Combat Master Condition'}, {caseinsensitive: true})[0],
            notes

        if (!combatMaster) {
            if (debug) {
                log('Creating Combat Master Handout')
            }
            notes = '<h2>Welcome to Combat Master (Version 1.0)</h2><br>'  
            notes += 'Combat Master is an API that helps manage a combat.  It can automatically roll initiative, marks the player currently active in the turn using a circular icon around the players token, centers the map on the active player, provides a timer for timed turns and enables quickly adding status conditions to the token.  It tracks the duration in rounds of that condition and automatically removes the condition when the condition is over.<br>'  
            notes += '<br>'
            notes += 'Combat Master has come from my prior work to combine Combat Tracker and Status Info by Robin Kuiper into a single script.  The changes in Combat Master include:<br>'
            notes +=' -	A new command syntax<br>'
            notes +=' -	A new and combined session state<br>'
            notes +=' -	Addition of Messages that remain with the condition so GMs can add special information to the condition that’s displayed<br>' 
            notes +=' -	Addition of call outs to various APIs to integrate and enhance the game experience<br>'
            notes += '<br>'
            notes += 'The largest change is integration with Macros and other APIs to provide flexibility:<br>' 
            notes +=' -	Group Init (The Aaron)<br>'
            notes +=' -	Token Mod (The Aaron)<br>'
            notes +=' -	Token Marker (The Aaron)<br>'
            notes +=' -	Token Conditions (surprise, The Aaron)<br>'
            notes +=' -	Roll20 Audio Master (Not The Aaron…this one is mine)<br>'
            notes +=' -	OnMyTurn (Do I even need to say who?....The Aaron)<br>'
            notes += '<br>'
            notes +='To start configuring Combat Master, type !cm –tracker in chat and click the cog icon at the top.'
            combatMaster = createObj('handout', {
                                name:'Combat Master',
                                avatar:'https://s3.amazonaws.com/files.d20.io/images/102600024/E0Q97UwNNgvueN8g0rt3Nw/original.png?15798312595'
                            })
            combatMaster.set({notes:notes});
        } else {
            if (debug) {
                log('Combat Master Handout Found')
            }            
        }

       if (!combatMasterSetup) {
            if (debug) {
                log('Creating Combat Master Setup Handout')
            }
            notes = '<h2>Combat Master Setup</h2><br>'  
            notes += '<b><i>There are too many configuration commands to list individually.  For those who want to edit Combat Master via macro, use the menus to the issue the command you want.  Go to the chat window and use the up-arrow key.  This will show the command that Combat Master last executed and you can copy it into a macro.</i></b><br>'  
            notes += '<br>'
            notes += '<b>Initiative</b> – Configure how Combat Master will roll Initiative<br>'
            notes += '<b>Turnorder</b> – Cconfigure how the turnorder is managed<br>'
            notes += '<b>Timer</b> – Configure a timer, length of turn time, and the display of the timer <br>'
            notes += '<b>Announce</b> – Configure how the player turn is announced in chat or if players can assigned their own conditions<br>' 
            notes += '<b>Status</b> – Configure how conditions are managed and displayed<br>'
            notes += '<b>Conditions</b> – a list of conditions where you can add a new condition or edit an existing<br>'
            notes += '<b>Export</b> – Export your conditions from one game so you can import into another.<br><i>NOTE: If migrating from Combat Master to another Combat Master it will copy the entire Combat Master configuration.  If coming from Combat Tracker,  it will only copy the conditions and you’ll have to reconfigure everything else.</i><br>' 
            notes += '<b>Import</b> – Import from another game<br>'
            notes += '<b>Reset</b> – This resets the entire session state.  It defaults the conditions to D&D 5e.<br>'
            notes += '<b>Back</b> – Return to Tracker Menu<br>'
            combatMasterSetup = createObj('handout', {
                                name:'Combat Master Setup',
                                avatar:'https://s3.amazonaws.com/files.d20.io/images/102607201/KH6mWxHhG8DNzGgjJSXXGQ/original.png?15798368605'
                            })
            combatMasterSetup.set({notes:notes});
        } else {
            if (debug) {
                log('Combat Master Setup Handout Found')
            }            
        }    
        
        if (!combatMasterInit) {
            if (debug) {
                log('Creating Combat Master Initiative Handout')
            }
            notes =  '<h2>Combat Master Initiative</h2><br>'  
            notes += '<h3>No Initiative</h3><br>'  
            notes += 'Combat Master may be configured to not roll initiative.  Choose ‘None’ for Roll Initiative.  You can have each character roll initiative on his/her own.<br><br><i>NOTE: If you choose to not roll intiative from combat tracker, the turn order will need to be set before starting Combat Master.</i><br>'  
            notes += '<br>'
            notes += '<h3>Combat Master Initiative</h3><br>'  
            notes += 'Combat Master has its own initiative roller.  Choose ‘CombatMaster’, then configure the remaining information<br>'
            notes += '<br>'
            notes += '<b>Roll Each Round</b> will reroll initiative at the end of each round.  <br>'
            notes += '<b>Initiative Attribute</b> accepts a comma delimited list of attributes that make up initiative.  The attribute name must match the attribute names in the char sheet<br>'
            notes += '<b>Show Initiative in Chat</b> will display the initiative rolls in chat<br>' 
            notes += '<br>'
            notes += '<h3>Group Init Initiative</h3><br>'  
            notes += 'Choose Group-Init.  When choosing this, Group Initiative is called and builds the turnorder<br><i>NOTE: If you choose group-init, the API must be installed in your game and configured outside of Combat Master.</i>'
            notes += '<br>'
            notes += '<b>Roll Each Round</b> will reroll initiative at the end of each round. <br>'
            notes += '<b>Target Tokens</b> is a list of Token IDs that will be passed into Group Init. <br>' 
            notes += '<b>Back</b> – Return to Setup Menu<br>'
            combatMasterInit =  createObj('handout', {
                                name:'Combat Master Initiative',
                                avatar:'https://s3.amazonaws.com/files.d20.io/images/102628957/Q8hJ5W9htatgAvhx5n8THw/original.png?15798733525'
                            })
            combatMasterInit.set({notes:notes});
        } else {
            if (debug) {
                log('Combat Master Initiative Handout Found')
            }            
        } 
        
        if (!combatMasterTurnorder) {
            if (debug) {
                log('Creating Combat Master Turnorder Handout')
            }
            notes =  '<h2>Combat Master Turnorder</h2><br>'  
            notes += 'Once Initiative is rolled, the turnorder object is created.  You configure what happens when stepping through the turnorder <br>'
            notes += '<br>'
            notes += '<b>Sort Turnorder</b> will sort the turnorder in descending sequence (only) once created  <br>'
            notes += '<b>Center Map on Token</b> will center the map on the token currently active in the turnorder.<Kbr><i>Note: there was an issue where centering the map on a token on the GMLAYER was exposing tokens that the GM wanted to hide.  This has been fixed.</i><br>'
            notes += '<b>Marker Type</b> is set to External URL (default) or can be set to Token Marker.  If Token Marker is selected a suitable token must be uploaded to your game<br>' 
            notes += '<b>Marker</b> is a thumbnail of what will be used to highlight the current active player<br>' 
            notes += '<b>Use Next Marker</b> if set to true will display another marker around the player that is next in the turnorder.  If set to false, then the next player up is not highlighted<br>' 
            notes += '<b>Next Marker</b> is a thumbnail of what will be used to highlight the next active player<br>' 
            notes += '<br>'
            notes += '<h3>Beginning of Each Round</h3><br>'  
            notes += 'Token Mod, Roll20 AM a Macro or an FX can be invoked at the beginning of each Round<br>'
            notes += '<b>API</b> will get invoked.  It must be a full TokeMmod command.  If you have any inline rolls the normal [[1d6]] must be replaced with [#[1d6]#].<br>'
            notes += '<b>Roll20AM</b> will get invoked.  It must be a full Roll20AM command. <br>' 
            notes += '<b>FX</b> will get invoked. It must be a valid FX <br>' 
            notes += '<b>Characters Macro</b> will get invoked. This requires OnMyTurn and uses a global macro substituting in all players characters on the map<br>' 
            notes += '<b>All Tokens Macro</b> will get invoked. This requires OnMyTurn and uses a global macro substituting in tokens on the map<br>' 
            notes += '<br>'
            notes += '<h3>Beginning of Each Turn</h3><br>'  
            notes += 'Token Mod, Roll20 AM a Macro or an FX can be invoked at the beginning of each Turn<br>'
            notes += '<b>API</b> will get invoked.  It must be a full TokeMmod command.  If you have any inline rolls the normal [[1d6]] must be replaced with [#[1d6]#].<br>'
            notes += '<b>Roll20AM</b> will get invoked.  It must be a full Roll20AM command. <br>' 
            notes += '<b>FX</b> will get invoked. It must be a valid FX <br>' 
            notes += '<b>Macro</b> will get invoked. This requires OnMyTurn and uses a global macro substituting in the current character in the turnorder<br>' 
            notes += '<br>'
            notes += '<b>Back</b> – Return to Setup Menu<br>'
            combatMasterTurnorder =  createObj('handout', {
                                name:'Combat Master Turnorder',
                                avatar:'https://s3.amazonaws.com/files.d20.io/images/102632420/RCOVvREcSdm-AHM7mQM1wg/original.png?15798774105'
                            })
            combatMasterTurnorder.set({notes:notes});
        } else {
            if (debug) {
                log('Combat Master Turnorder Handout Found')
            }            
        }         

        if (!combatMasterTimer) {
            if (debug) {
                log('Creating Combat Master Timer Handout')
            }
            notes =  '<h2>Combat Master Timer</h2><br>'  
            notes += '<b>Turn Timer</b> setting to true turns on the timer.  The timer displays a second by second countdown under the current active token in turnorder <br>'
            notes += '<b>Time</b> determines the total time in seconds that the active token has to complete the turn<br>'
            notes += '<b>Skip Turn</b> will automatically advance to the next active token when the timer runs to 0<br>' 
            notes += '<b>Send To Chat</b> sends the timer coundown to chat<br>' 
            notes += '<b>Show On Token</b> displays the timer underneath the current active token<br>' 
            notes += '<b>Token Font</b> determines the font of the timer displayed underneath the current active token<br>' 
            notes += '<b>Token Font Size</b> determines the size of the font of the timer displayed underneath the current active token<br>' 
            notes += '<b>Back</b> – Return to Setup Menu<br>'
            combatMasterTimer =  createObj('handout', {
                                name:'Combat Master Timer',
                                avatar:'https://s3.amazonaws.com/files.d20.io/images/102632424/xyJ3PuKIJxHkaIvOhATDYw/original.png?15798774185'
                            })
            combatMasterTimer.set({notes:notes});
        } else {
            if (debug) {
                log('Combat Master Timer Handout Found')
            }            
        } 

        if (!combatMasterAnnounce) {
            if (debug) {
                log('Creating Combat Master Announce Handout')
            }
            notes =  '<h2>Combat Master Announce</h2><br>'  
            notes += '<b>Announce Rounds</b> sends a message to chat when a new round has started.<br>'
            notes += '<b>Announce Turns</b> sends the current active player in turnorder to chat, plus any conditions or messages assigned<br>'
            notes += '<b>Whisper To GM</b> sends Rounds and Turns only to GM<br>' 
            notes += '<b>Shorten Long Names</b> shortens the character name when sending the Turn to chat<br>' 
            notes += '<b>Back</b> – Return to Setup Menu<br>'
            combatMasterAnnounce =  createObj('handout', {
                                name:'Combat Master Announce',
                                avatar:'https://s3.amazonaws.com/files.d20.io/images/102632428/ag71PVqAznRIIPNorms5mw/original.png?15798774225'
                            })
            combatMasterAnnounce.set({notes:notes});
        } else {
            if (debug) {
                log('Combat Master Announce Handout Found')
            }            
        }      
        
        if (!combatMasterAnnounce) {
            if (debug) {
                log('Creating Combat Master Announce Handout')
            }
            notes =  '<h2>Combat Master Announce</h2><br>'  
            notes += '<b>Announce Rounds</b> sends a message to chat when a new round has started.<br>'
            notes += '<b>Announce Turns</b> sends the current active player in turnorder to chat, plus any conditions or messages assigned<br>'
            notes += '<b>Whisper To GM</b> sends Rounds and Turns only to GM<br>' 
            notes += '<b>Shorten Long Names</b> shortens the character name when sending the Turn to chat<br>' 
            notes += '<b>Back</b> – Return to Setup Menu<br>'
            combatMasterAnnounce =  createObj('handout', {
                                name:'Combat Master Announce',
                                avatar:'https://s3.amazonaws.com/files.d20.io/images/102632428/ag71PVqAznRIIPNorms5mw/original.png?15798774225'
                            })
            combatMasterAnnounce.set({notes:notes});
        } else {
            if (debug) {
                log('Combat Master Announce Handout Found')
            }            
        } 
        
        if (!combatMasterStatus) {
            if (debug) {
                log('Creating Combat Master Status Handout')
            }
            notes =  '<h2>Combat Master Status</h2><br>'  
            notes += '<b>Whisper To GM</b> sends Condition Descriptions only to GM<br>' 
            notes += '<b>Player Allowed Changes</b> allows each player to assign their own conditions.  When this is turned on, the player active in the turnorder receives the Tracker Menu where they can add or remove conditions (only)<br>'
            notes += '<b>Send Changes to Chat</b> sends the Condition Description to Chat when a Condition is added to a token<br>'
            notes += '<b>Clear Conditions on Close</b> removes all Condition Icons from the token when the combat is stopped.  If this is turned off, the icons must be manually removed from the tokens<br>' 
            notes += '<b>Use Messages</b> enables messages to be included with conditions assigned to the token<br>' 
            notes += '<b>Back</b> – Return to Setup Menu<br>'
            combatMasterStatus =  createObj('handout', {
                                name:'Combat Master Status',
                                avatar:'https://s3.amazonaws.com/files.d20.io/images/103291084/6xeFcIWcma6On8R3YnejHA/original.png?15804818525'
                            })
            combatMasterStatus.set({notes:notes});
        } else {
            if (debug) {
                log('Combat Master Status Handout Found')
            }            
        }        
        
        if (!combatMasterConditions) {
            if (debug) {
                log('Creating Combat Master Conditions Handout')
            }
            notes =  '<h2>Combat Master Conditions</h2><br>'  
            notes += '<b>Cog Icon</b> enables editing an existing condition<br>' 
            notes += '<b>Add Condition</b> creates a new condition<br>'
            notes += '<b>Back</b> – Return to Setup Menu<br>'
            combatMasterConditions =  createObj('handout', {
                                name:'Combat Master Conditions',
                                avatar:'https://s3.amazonaws.com/files.d20.io/images/102632440/okR7MOXC3-OctLj_Cgg0Pw/original.png?15798774295'
                            })
            combatMasterConditions.set({notes:notes});
        } else {
            if (debug) {
                log('Combat Master Conditions Handout Found')
            }            
        }         

        if (!combatMasterCondition) {
            if (debug) {
                log('Creating Combat Master Condition Handout')
            }
            notes =  '<h2>Combat Master Condition</h2><br>'  
            notes += '<b>Name</b> is the name of the Condition<br>' 
            notes += '<b>Icon Type</b> is set to Combat Master (default) or can be set to Token Marker.  If Token Marker is selected a suitable token must be uploaded to your game<br>' 
            notes += '<b>Icon</b> is a thumbnail of what will be used for the current condition<br>' 
            notes += '<b>Duration</b> defines the length of the Condition before being removed<br>' 
            notes += '<b>Direction</b> defines how quickly the duration is reduced each Round.  Set to a negative number to reduce the duration, positive number if it increases over time or 0.  If 0, it remains permanently on the token until removed<br>' 
            notes += '<b>Override</b> determines if the direction/durastion can be overriden when assigning the Condition to the token.  For spells that do not change, set override to false and the direction/duration roll queries do not display when assigning the Condition<br>' 
            notes += '<b>Favorites</b> determines if the Condition shows in the Favorites menu.  This can also be set on the Tracker Menu.  The Favorites menu shows a smaller number of Conditions<br>' 
            notes += '<br>'
            notes += '<b>Adding Condition External Calls</b> which are invoked when a Condition is assigned to a Token<br>'
            notes += '<b>- API</b> will get invoked.  It must be a full TokeMmod command.  If you have any inline rolls the normal [[1d6]] must be replaced with [#[1d6]#].<br>'
            notes += '<b>- Roll20AM</b> will get invoked.  It must be a full Roll20AM command. <br>' 
            notes += '<b>- FX</b> will get invoked. It must be a valid FX <br>' 
            notes += '<b>- Macro</b> will get invoked. This requires OnMyTurn and uses a global macro substituting in the current character in the turnorder<br>' 
            notes += '<br>'     
            notes += '<b>Removing Condition External Calls</b> which are invoked when a Condition is removed from a Token<br>'
            notes += '<b>- API</b> will get invoked.  It must be a full TokeMmod command.  If you have any inline rolls the normal [[1d6]] must be replaced with [#[1d6]#].<br>'
            notes += '<b>- Roll20AM</b> will get invoked.  It must be a full Roll20AM command. <br>' 
            notes += '<b>- FX</b> will get invoked. It must be a valid FX <br>' 
            notes += '<b>- Macro</b> will get invoked. This requires OnMyTurn and uses a global macro substituting in the current character in the turnorder<br>' 
            notes += '<br>'                
            notes += '<b>Back</b> – Return to Setup Menu<br>'
            combatMasterCondition =  createObj('handout', {
                                name:'Combat Master Condition',
                                avatar:'https://s3.amazonaws.com/files.d20.io/images/102632440/okR7MOXC3-OctLj_Cgg0Pw/original.png?15798774295'
                            })
            combatMasterCondition.set({notes:notes});
        } else {
            if (debug) {
                log('Combat Master Condition Handout Found')
            }            
        }  
        
//    --condition
    },
    
    checkInstall = function () {
        if(!_.has(state, combatState)){
            state[combatState] = state[combatState] || {};
        }
        setDefaults();
        buildHelp();
        log(script_name + ' Ready! Command: !'+state[combatState].config.command);
    },    
    
    registerEventHandlers = function() {
        on('chat:message', inputHandler);
        on('change:campaign:turnorder', handleTurnorderChange);
        on('change:graphic:statusmarkers', handleStatusMarkerChange);
        on('change:campaign:initiativepage', handeIniativePageChange);
        on('change:graphic:top', handleGraphicMovement);
        on('change:graphic:left', handleGraphicMovement);
        on('change:graphic:layer', handleGraphicMovement);
        
        // if('undefined' !== typeof API && API.ObserveTokenChange){
        //     API.ObserveTokenChange(function(obj,prev) {
        //         handleStatusMarkerChange(obj,prev);
        //     });
        // }

        // if('undefined' !== typeof DeathTracker && DeathTracker.ObserveTokenChange){
        //     DeathTracker.ObserveTokenChange(function(obj,prev) {
        //         handleStatusMarkerChange(obj,prev);
        //     });
        // }

        // if('undefined' !== typeof InspirationTracker && InspirationTracker.ObserveTokenChange){
        //     InspirationTracker.ObserveTokenChange(function(obj,prev)  {
        //         handleStatusMarkerChange(obj,prev);
        //     });
        // }
        
    // 	const handleTurnOrderChange = (/* obj */ /*, prev */ ) => {
    // 		sendChat('',`/w gm Turnorder Changed!`);
    // 	};
    // //     let giRoll = () => sendChat('',`/w gm <code>GroupInitiative.RollForTokenIDs()</code> is not supported.`);    	
        
    // 	if('undefined' !== typeof GroupInitiative && GroupInitiative.ObserveTurnOrderChange){
    // 	    GroupInitiative.ObserveTurnOrderChange(function(handleTurnOrderChange) {
    // 		    observeTurnOrderChange(handleTurnOrderChange);
    // 	    });    
    // 	}
    // 	if('undefined' !== typeof GroupInitiative && GroupInitiative.RollForTokenIDs){
    // 		giRoll = GroupInitiative.RollForTokenIDs;
    // 	}        
    };
    
    return {
        CheckInstall: checkInstall,
        RegisterEventHandlers: registerEventHandlers,
        ObserveTokenChange: observeTokenChange,
        getConditions,
        getConditionByKey,
        sendConditionToChat,
        getDefaultIcon	
    };
})();

on('ready',function() {
    'use strict';

    CombatMaster.CheckInstall();
    CombatMaster.RegisterEventHandlers();
 	        
});
