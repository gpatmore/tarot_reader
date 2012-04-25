var jlyf=false;
/* Native Array type extension to add the ability to find a value in the array */
Array.prototype.xfind=function(v,x){var i=0,l=this.length;if(Boolean(x)){for(i=0;i<l;i++)if(this[i]===v)return i;}else{for(i=0;i<l;i++){if(this[i].valueOf().toLowerCase()==v.valueOf().toLowerCase())return i;}}return false;};
var jlyf = jlyf || {
		PLUGINPATH:'/js/plugins/',
		transitPlugin:false,
		transitLoadComplete:true,
		pluginLoadQueue:[],
		CHECKLOAD_CYCLES:60,
		CHECKLOAD_INTERVAL_TIME:'.5',
		currentLoadCycle:0,
		lastError:false,
		EWARN:1,
		EALERT:2,
		ETRIGGER:3,
		currentStatus:null,

		setCurrentStatus		:function(status, msg){status=status.toUpperCase();this.currentStatus=status;return true;},
		triggerError			:function(msg,lvl,noLog){lvl=typeof lvl=='undefined'||!parseInt(lvl)?1:parseInt(lvl);this.lastError=String(msg);if(typeof console=="object"){if(lvl >=3)console.error(msg);if(lvl==2)console.warn(msg);else console.log(msg);}else{if(lvl >=3)throw new Error(msg);if(lvl==2)alert(msg);}if(!noLog)jlyf.setCurrentStatus(msg, 'ERROR');return false;},
		loadPlugin				:function(pluginName){if(jlyf.isPluginLoaded(pluginName)||jlyf.isQueuedPlugin(pluginName))return true;jlyf.setCurrentStatus('WORKING', 'jlyf.loadPlugin:request to load plugin:' + pluginName);if(!jlyf.transitLoadComplete && jlyf.transitPlugin !=String(pluginName)){if(!jlyf.isQueuedPlugin(String(pluginName)))jlyf.pluginLoadQueue.push(String(pluginName));}else{if(pluginName in jlyf)return jlyf.triggerError('jlyf.loadPlugin:Call to loadPlugin, yet plugin  '+pluginName+' has been loaded already',jlyf.ETRIGGER);else{jlyf.transitPlugin=String(pluginName);jlyf.transitLoadComplete=false;jlyf.loadJSFile(jlyf.PLUGINPATH + 'plugin.' + pluginName.toLowerCase()+ '.js');jlyf.checkForLoad();}}},
		loadJSFile				:function(src){var scr=document.createElement('script');scr.type='text/javascript';scr.src=src;document.getElementsByTagName('head')[0].appendChild(scr);},
		checkForLoad			:function(){if(this.transitLoadComplete){if(jlyf.transitPlugin in jlyf){jlyf.setCurrentStatus('OK');jlyf.currentLoadCycle=0;jlyf.transitPlugin=false;if(jlyf.pluginLoadQueue.length > 0)jlyf.loadPlugin(jlyf.pluginLoadQueue.shift());}/*else jlyf.triggerError('jlyf.checkForLoad:An uncaught error has resulted.  Load seems to have succeeded, but the plugin does not exist in the namespace',jlyf.ETRIGGER);*/}else{if(jlyf.currentLoadCycle <=jlyf.CHECKLOAD_CYCLES){jlyf.currentLoadCycle++;setTimeout("jlyf.checkForLoad()", jlyf.CHECKLOAD_INTERVAL_TIME * 1000);}else return jlyf.triggerError('Load Timeout Error occurred while trying to load ' + jlyf.transitPlugin + ":" + jlyf.currentLoadCycle, jlyf.ETRIGGER);}},
		getPluginInstance		:function(pluginName, constructorArgs, loadIfNotFound, getBaseObject){if(String(pluginName)in jlyf){if(Boolean(jlyf[pluginName].constructor)&& !Boolean(getBaseObject)){tmp=(constructorArgs)? function(){	jlyf[pluginName].apply(this, constructorArgs);}:function(){	jlyf[pluginName].apply(this);};tmp.prototype=new jlyf[pluginName]();tmp.prototype.constructor=jlyf[pluginName];return new tmp();}else {return jlyf[pluginName];}}else{if(loadIfNotFound)jlyf.loadPlugin(pluginName);return jlyf.triggerError('jlyf.getPluginInstance:Attempt to load plugin failed as the object was not yet available');}},
		isPluginLoaded			:function(pluginName){return pluginName in jlyf;},
		isQueuedPlugin			:function(pluginName){return(!jlyf.pluginLoadQueue.length)? false:jlyf.inArray(pluginName,jlyf.pluginLoadQueue);},
		isLoading				:function(){return !jlyf.transitLoadComplete || Boolean(jlyf.pluginLoadQueue.length);},
		addLoadEvent			:function(func){var old=window.onload;if(typeof window.onload !='function')window.onload=func;else	window.onload=function(){old();func();}},
		getElementsByClass		:function(searchClassName, node, tag){var res=[];tag=tag || false;jlyf.walkTheDOM(typeof node !='undefined' ? jlyf.$(node):document.body,function(node){if(node && node.className && tag !=false && node.nodeName.toUpperCase()!=tag.toUpperCase())return;var a=node.className;if(a && jlyf.inArray(searchClassName, a.split(' ')))res.push(node);});return res.length ? res:false;},
		hasClassName 			:function(obj, strClass){if (obj.className){var arrList=obj.className.split(' ');var strClassUpper=strClass.toUpperCase();for (var i=0; i < arrList.length; i++)if (arrList[i].toUpperCase()==strClassUpper)return true;}	return false;},
		addClassName 			:function(obj, strClass, blnMayAlreadyExist){if(obj.className){var arrList=obj.className.split(' ');if ( blnMayAlreadyExist ){var strClassUpper=strClass.toUpperCase();for ( var i=0; i < arrList.length; i++ ){if ( arrList[i].toUpperCase() ==strClassUpper ){arrList.splice(i, 1);i--;}}}arrList[arrList.length]=strClass;obj.className=arrList.join(' ');}else obj.className=strClass;},
		removeClassName 		:function(obj, strClass){if(obj.className){var arrList=obj.className.split(' ');var strClassUpper=strClass.toUpperCase();for ( var i=0; i < arrList.length; i++ ){if ( arrList[i].toUpperCase() ==strClassUpper ){arrList.splice(i, 1);i--;}}obj.className=arrList.join(' ');}},
		walkTheDOM				:function(node, func){func(node);node=node.firstChild;while(node){jlyf.walkTheDOM(node, func);node=node.nextSibling;}},
		$						:function(obj){return(typeof obj=='string')? document.getElementById(obj):(obj.nodeType)? obj:false;},
		getElementStyle			:function(elem, jsProp, cssProp){var e=jlyf.$(elem);if(!e)	return jlyf.triggerError('jlyf.getElementStyle reports invalid element reference passed to function', jlyf.EWARN);if(e.currentStyle)return e.currentStyle[jsProp];else if(window.getComputedStyle){var compStyle=window.getComputedStyle(e, null);return compStyle.getPropertyValue(cssProp);}else return "";},
		getParsedQueryString	:function(){if(location.search){var loc=location.search.substr(1).split('&');var qstr={};while(loc.length){var t=loc.pop().split('=');qstr[t[0]]=t[1];}return qstr;}else return false;},
		objectToVarString		:function(obj){if(typeof obj=='object'){var res=[];for(var i in obj)res.push(i + '=' + obj[i]);return res.join('&');}else return false;},
		inArray					:function(needle,haystack){if(!(haystack instanceof Array))return jlyf.triggerError('jlyf.inArray:invalid array object passed as argument', jlyf.ETRIGGER);for(var i=0; i < haystack.length; ++i)if(haystack[i]===needle)return true;return false;},
		isArray					:function(ary){return typeof(ary)=='object'&&(ary instanceof Array);},
		emptyNode				:function(obj){obj=jlyf.$(obj);if(!obj)return jlyf.triggerError('jlyf.emptyNode:invalid node passed as argument', jlyf.ETRIGGER);while(obj.hasChildNodes())obj.removeChild(obj.firstChild);return true;},
		createUniqueElementId	:function(obj){obj=jlyf.$(obj);if(!obj)return jlyf.triggerError('jlyf.createUniqueElementId:invalid node passed as argument.', jlyf.ETRIGGER);var baseId=(String(obj.id).length)? String(obj.id):(obj.nodeName)? obj.nodeName:'ELEMENT';var d=new Date;var nuId=baseId + '_' + d.getTime();var i=0;while(++i < 20 && document.getElementById(nuId))nuId=baseId + '_' + d.getTime();return(document.getElementById(nuId)!=null)? false:nuId;},
		getCookie				:function(name){if(document.cookie.length>0){var st=document.cookie.indexOf(name + "=");if(st!=-1){st=st + name.length+1;var e=document.cookie.indexOf(";",st);if(e==-1)e=document.cookie.length;var re=new RegExp('/\+/g');return unescape(document.cookie.substring(st,e)).replace(re," ");}}return "";},
		setCookie				:function(cookieName,cookieValue,nDays){var today=new Date();var expire=new Date();if(nDays==null || nDays==0)nDays=1;expire.setTime(today.getTime()+ 3600000*24*nDays);document.cookie=cookieName+"="+escape(cookieValue)+ ";expires="+expire.toGMTString()+ ';path=/';},
		trim					:function(str){return str.replace(/^\s+|\s+$/,'');	},
		fmtNumber				:function(s){s+='';x=s.split('.');x1 = x[0];x2 = x.length > 1 ? '.' + x[1] : '';var rgx = /(\d+)(\d{3})/;while (rgx.test(x1)) {x1 = x1.replace(rgx, '$1' + ',' + '$2');}return x1 + x2;},
		DataRegistry			:function(){this._reg={};},

		/* GP - adapted John Resig's JS class extender (http://ejohn.org/blog/simple-javascript-inheritance/)
			 to work in our framework */
		Class					:function(){},/* holder for the object defined later */
		classInitializing		:false,
		classFnTest 			:/xyz/.test(function(){xyz;})?/\b_super\b/:/.*/,
		/* GP quick object cloner */
		cloneObject 			:function(o){n=(o instanceof Array)?[]:{};for(i in o){if(o[i]) n[i]=(typeof o[i]=='object') ? jlyf.cloneObject(o[i]):o[i];}return n;},
		/* Function to bind a function to an object (late binding) */
		bind					:function(scope, fn, args){
									if(typeof args != 'undefined'){
										var argsToPass = args && args.length ? args : arguments;
										return function(){
											fn.apply(scope, argsToPass);
										};

									}else{
										return function(){
											fn.apply(scope, arguments);
										};
									}

								},
		/* GP - wrapper for bind function to support legacy calls to this function */
		bindWithArgs			:function(scope, fn, args){
									this.triggerError("Call to deprecated function jlyf.bindWithArgs. Please change calls to this method to use jlyf.bind as that method supports both uses now. Deprecated 12/11 by GP.", jlyf.EWARN);
									return this.bind(scope, fn, args);
								}
	};
else if(typeof jlyf !='object')throw new Error('Cannot define namespace. Collision may have occurred');
var JLYFGLOBAL={
	loaded:false,checkNum:0,reqPlugins:[],loadFunc:null,
	init				:function(num){if(jlyf.isLoading()){if(typeof num=="undefined")num=0;++num;if(num > 60){throw new Error("Unable to complete load.  Load mechanism timed out");return;}else{setTimeout("JLYFGLOBAL.init(" + num + ")", 1000);return;}}else	if(JLYFGLOBAL.loadFunc !=null)JLYFGLOBAL.loadFunc();return;},
	addLoadFunc	:function(func){if(!(typeof func=='function'))return jlyf.triggerError('jlyf.addLoadFunc:Invalid function passed asa argument',jlyf.ETRIGGER);if(this.loadFunc !=null){var o=this.loadFunc;this.loadFunc=function(){ o(); func();};}else this.loadFunc=func;return true;}
};
jlyf.DataRegistry.prototype={
	setItem				:function(key, val){if(typeof this._reg[key]=='undefined')jlyf.triggerError('Illegal use of DataRegistry.setItem for a registry value that does not yet exist. If you are trying to create a new Registry item, use DataRegistry.addItem.', jlyf.ETRIGGER);this._reg[key]=val;return Boolean(this._reg[String(key)]);},
	addItem				:function(key,val){this._reg[key]=val;return this.isKey(key);},
	removeItem			:function(key){return !(delete this._reg[String(key)]=="undefined");},
	/* 12/11 GP added nullIfNotExists to differentiate between false value and not found */
	getItemValue		:function(key, nullIfNotExists){
		if(Boolean(nullIfNotExists)){
			return(typeof(this._reg[String(key)])!='undefined')? this._reg[String(key)]:null;
		}else{
			return(typeof(this._reg[String(key)])!='undefined')? this._reg[String(key)]:false;
		}
	},
	isKey				:function(key){return typeof(this._reg[key])!='undefined';},
	regWalk				:function(func){if(typeof(func)!='function')return false;for(key in this._reg)func(key,this._reg[key]);return true;},
	getAllKeys			:function(){var keys=[];for(name in this._reg)keys.push(name);return keys;},
	getAllValues		:function(){var vals=[];for(var name in this._reg)vals.push(this._reg[name]);return vals;},
	getTotalRegistry	:function(){return this._reg;},
	getNumItems			:function(){var cnt=0;for(var i in this._reg)++cnt;return cnt;}
};
/* EZ Class extender, thanks Resig! _gp */
jlyf.Class.extend = function(prop){
	var _super = this.prototype;
	jlyf.classInitializing	 = true;
	var prototype = new this();
	jlyf.classInitializing = false;
	for (var name in prop) {
		prototype[name] = (
				 typeof prop[name] == "function"
			&& typeof _super[name] == "function"
			&& jlyf.classFnTest.test(prop[name])
		)
			? (function(name, fn){
					return function() {
						var tmp = this._super;
						this._super = _super[name];
						var ret = fn.apply(this, arguments);
						this._super = tmp;
						return ret;
					};
				})(name, prop[name])

			: prop[name];
	}
	function Class() {
		if ( !jlyf.classInitializing && this.init )
		this.init.apply(this, arguments);
	}
	Class.prototype = prototype;
	Class.constructor = Class;
	Class.extend = arguments.callee;
	return Class;
};

jlyf.DHTML={
	browserClass:{},
	init								:function(){jlyf.DHTML.browserClass.isCSS=(document.body&&document.body.style)?true:false;jlyf.DHTML.browserClass.isW3C=(jlyf.DHTML.browserClass.isCSS&&document.getElementById)?true:false;jlyf.DHTML.browserClass.isIE4=(jlyf.DHTML.browserClass.isCSS&&document.all)?true:false;jlyf.DHTML.browserClass.isNN4=(document.layers)?true:false;jlyf.DHTML.browserClass.isIECSSCompat=(document.compatMode&&document.compatMode.indexOf("CSS1")>=0)?true:false;jlyf.DHTML.browserClass.isIE=(document.all)?true:false;},
	getStyleObject			:function(obj){obj=jlyf.$(obj);if(!obj)return jlyf.triggerError('DHTML.getStyleObject:invalid node passed as argument:' ,jlyf.ETRIGGER);return(document.body && document.body.style)? obj.style:obj;},
	getElementPosition	:function(obj){obj=jlyf.$(obj);if(obj){var osl=0;var ost=0;while(obj){osl+=obj.offsetLeft;ost+=obj.offsetTop;obj=obj.offsetParent;}return {left:osl, top:ost};}else return false;},
	getObjectHeight			:function(obj){var elem=jlyf.$(obj);if(obj){var result=0;if(elem.offsetHeight)result=elem.offsetHeight;else if(elem.clip && elem.clip.height)result=elem.clip.height;else if(elem.style&&elem.style.pixelHeight)result=elem.style.pixelHeight;else return jlyf.triggerError('jlyf.getObjectHeight:unable to retrieve object height');return parseInt(result);}else return jlyf.triggerError('jlyf.getObjectHeight:Invalid node reference sent as argument');},
	getObjectWidth			:function(obj){var elem=jlyf.$(obj);if(obj){var result=0;if(elem.offsetWidth)	result=elem.offsetWidth;else if(elem.clip&&elem.clip.width)result=elem.clip.width;else if(elem.style&&elem.style.pixelWidth)	result=elem.style.pixelWidth;else return jlyf.triggerError('jlyf.getObjectWidth:unable to retrieve object width');return parseInt(result);}else return jlyf.triggerError('jlyf.getObjectWidth:Invalid node reference sent as argument');},
	setZIndex						:function(obj,val){obj=jlyf.DHTML.getStyleObject(obj);if(!obj)return jlyf.triggerError('jlyf.DHTML.setZIndex:Invalid node reference sent as argument');obj.zIndex=parseInt(val);return true;},
	getObjectLeft				:function(obj){obj=jlyf.$(obj);if(!obj)return	jlyf.triggerError('DHTML.getObjectLeft:invalid node passed as argument' ,jlyf.ETRIGGER);else return('left' in obj)?obj.left:parseInt(jlyf.getElementStyle(obj, 'left', 'left'));},
	getObjectRight			:function(obj){obj=jlyf.$(obj);if(!obj)return jlyf.triggerError('DHTML.getObjectRight:invalid node passed as argument' ,jlyf.ETRIGGER);else return('left' in obj)?obj.left:parseInt(jlyf.getElementStyle(obj, 'right', 'right'));},
	getObjectTop				:function(obj){obj=jlyf.$(obj);if(!obj)return jlyf.triggerError('DHTML.getObjectTop:invalid node passed as argument' ,jlyf.ETRIGGER);else return('left' in obj)?obj.left:parseInt(jlyf.getElementStyle(obj, 'top', 'top'));},
	getObjectBottom			:function(obj){obj=jlyf.$(obj);if(!obj)return jlyf.triggerError('DHTML.getObjectTop:invalid node passed as argument' ,jlyf.ETRIGGER);else return('left' in obj)? obj.left:parseInt(jlyf.getElementStyle(obj, 'bottom', 'bottom'));},
	moveTo							:function(obj,x,y){obj=jlyf.$(obj);obj=jlyf.DHTML.getStyleObject(obj);if(!obj)return jlyf.triggerError('DHTML.moveTo:invalid node passed as argument' ,jlyf.ETRIGGER);if(jlyf.DHTML.browserClass.isCSS){var units=(typeof obj.left=="string")? "px":'';try{obj.left=x + units;obj.top=y + units;}catch(err){}}else if(jlyf.DHTML.browserClass.isNN4)obj.moveTo(x,y);return true;},
	moveBy							:function(obj,deltaX,deltaY){obj=jlyf.$(obj);if(!obj)return jlyf.triggerError('DHTML.moveTo:invalid node passed as argument' ,jlyf.ETRIGGER);if(jlyf.DHTML.browserClass.isCSS){var units=(typeof obj.left=="string")? "px":0;if(!isNaN(jlyf.DHTML.getObjectLeft(obj))){obj.left=jlyf.DHTML.getObjectLeft(obj)+deltaX+units;obj.top=jlyf.DHTML.getObjectTop(obj)+deltaY+units;}}else if(jlyf.DHTML.browserClass.isNN4)obj.moveBy(deltaX,deltaY);return true;},
	setOpacity					:function(obj,val){obj=jlyf.$(obj);if(!obj)return jlyf.triggerError('DHTML.setOpacity:invalid node passed as argument' ,jlyf.ETRIGGER);obj.style.opacity=(val/100);obj.style.MozOpacity=(val/100);obj.style.KhtmlOpacity=(val/100);obj.style.filter="alpha(opacity=" +val+ ")";},
	getBrowserSize			:function(){if(window.innerHeight && window.innerWidth)return {height:window.innerHeight,width:window.innerWidth};else if(document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth)return {height:document.documentElement.clientHeight,width:document.documentElement.clientWidth};else if(document.body && document.body.clientHeight && document.body.clientWidth)return {height:document.body.clientHeight,width:document.body.clientWidth};else return false;},
	getMouseX						:function(e){
		if (e.pageX) return e.pageX;
		else if (e.clientX)
   		return e.clientX + (
   			document.documentElement.scrollLeft
   			? document.documentElement.scrollLeft
   			: document.body.scrollLeft
   		);
		else return null;
	},
	getMouseY						:function(e){
		if (e.pageY) return e.pageY;
		else if (e.clientY)
   		return e.clientY + (
   			document.documentElement.scrollTop
   			? document.documentElement.scrollTop
   			: document.body.scrollTop
   		);
		else return null;
	},
	getMouseCoords 		:function(e){
		return {
			left : jlyf.DHTML.getMouseX(e),
			top : jlyf.DHTML.getMouseY(e)
		}
	}

};
jlyf.Effect={
	FXStates									:['MIN','MAX','TO_MIN','TO_MAX','RESET'],
	addEffect									:function(obj,effect,effectRefName){if(!jlyf.Effect._initializeEffectElement(obj))return jlyf.triggerError('Effect.addEffect:failed to initialize the element as an effect element' ,jlyf.ETRIGGER);if(arguments.length > 3){var args=[];for(var i=3; i < arguments.length; ++i)args.push(arguments[i]);}else var args=null;return jlyf.Effect._createFXObject(obj,effect,effectRefName,args);},
	genUniqueRefName					:function(obj,base){obj=jlyf.$(obj);if(!obj || typeof obj.jlyfFX !='object')return jlyf.triggerError('Effect.genUniqueRefName:node passed as argument is not a valid Effect node' ,jlyf.ETRIGGER);if(typeof base=='undefined')base='EFFECT';if(!obj.jlyfFX.fxReg.isKey(base))return base;var d=new Date();var i=0;while(++i < 50)if(!obj.jlyfFX.fxReg.isKey(base + '_' + d.getTime()))return base + '_' + d.getTime();return false;},
	genUniqueActionName				:function(obj,base){obj=jlyf.$(obj);if(!obj || typeof obj.jlyfFX !='object')return jlyf.triggerError('Effect.genUniqueActionName:node passed as argument is not a valid Effect node' ,jlyf.ETRIGGER);if(typeof base=='undefined')base='ACTION';if(!obj.jlyfFX.actionReg.isKey(base))return base;var d=new Date;var i=0;while(++i<50)if(!obj.jlyfFX.fxReg.isKey(base + '_' + d.getTime()))return base + '_' + d.getTime();return false;},
	createAction							:function(obj,actionName,actionObjects){obj=jlyf.$(obj);if(!obj || typeof obj.jlyfFX !='object')return jlyf.triggerError('Effect.createAction:node passed as argument is not a valid Effect node' ,jlyf.ETRIGGER);actionName=String(actionName).toUpperCase();if(!actionName || obj.jlyfFX.actionReg.isKey(actionName))return jlyf.triggerError('Effect.createAction:action already exists for Effect Object:' +actionName,jlyf.ETRIGGER);if(typeof actionObjects !='object')return jlyf.triggerError('Effect.createAction:invalid actionObject(s)passed as argument' ,jlyf.ETRIGGER);if(!(actionObjects instanceof Array))actionObjects=[actionObjects];return obj.jlyfFX.actionReg.addItem(actionName,actionObjects);},
	createActionObject				:function(obj,effectRef,stateTo,delay){obj=jlyf.$(obj);stateTo=String(stateTo.toUpperCase());if(!obj || typeof obj.jlyfFX !='object')return jlyf.triggerError('Effect.createActionObject:node passed as argument is not a valid Effect node' ,jlyf.ETRIGGER);else if(!obj.jlyfFX.fxReg.isKey(effectRef))return jlyf.triggerError('Effect.createActionObject:invalid effect reference passed as argument.' ,jlyf.ETRIGGER);else if(!stateTo||!jlyf.inArray(stateTo,jlyf.Effect.FXStates))return jlyf.triggerError('Effect.createActionObject:invalid FXState passed as argument.' ,jlyf.ETRIGGER);var o={};o.obj=obj;o.effectRef=effectRef;o.state=stateTo;o.delay=parseInt(delay)|false;return o;},
	runAction									:function(obj,action){obj=jlyf.$(obj);action=String(action).toUpperCase();if(!obj || typeof obj.jlyfFX !='object')return jlyf.triggerError('Effect.runAction:node passed as argument is not a valid Effect node' ,jlyf.ETRIGGER);else if(!obj.jlyfFX.actionReg.isKey(action))return jlyf.triggerError('Effect.runAction:invalid Effect Action passed as argument' ,jlyf.ETRIGGER);var a=obj.jlyfFX.actionReg.getItemValue(action);if(!a || !(a instanceof Array))return jlyf.triggerError('Effect.runAction:invalid actionObjects array returned for this action' ,jlyf.ETRIGGER);try{for(var i=0; i < a.length; ++i){if(typeof a[i] !='object')continue;if(!('obj' in a[i])|| !('jlyfFX' in a[i].obj)|| !('effectRef' in a[i])|| !a[i].obj.jlyfFX.fxReg.isKey(a[i].effectRef))throw new Error('Invalid Action Object configuration detected');}for(var i=0; i < a.length; ++i){if(typeof a[i] !='object')continue;if('delay' in a[i] && parseInt(a[i].delay))setTimeout('jlyf.$("' +a[i].obj.id+ '").jlyfFX.fxReg.getItemValue(a[i].effectRef).setState("' +a[i].state+ '")' ,a[i].delay);else if(!a[i].obj.jlyfFX.fxReg.getItemValue(a[i].effectRef).setState(a[i].state))throw new Error('setState:' +a[i].state+ ' failed for object:' +a[i].obj.id);}return true;}catch(e){return jlyf.triggerError('Effect.runAction:error while running action:' +e.message,jlyf.EWARN);}},
	getEffectObj							:function(obj,refName){obj=jlyf.$(obj);if(!obj||!('jlyfFX' in obj))return jlyf.triggerError('jlyf.Effect.getEffectObj:invalid Effect node passed as argument.' ,jlyf.ETRIGGER);else if(!obj.jlyfFX.fxReg.isKey(refName))return jlyf.triggerError('jlyf.Effect.getEffectObj:invalid effect reference passed as argument.' ,jlyf.ETRIGGER);else return obj.jlyfFX.fxReg.getItemValue(refName);},
	_initializeEffectElement	:function(obj){obj=jlyf.$(obj);if(!obj)return jlyf.triggerError('Effect._initializeEffectElement:invalid node passed as argument' ,jlyf.ETRIGGER);if(typeof obj.jlyfFX=='undefined')obj.jlyfFX={fxReg:new jlyf.DataRegistry,actionReg:new jlyf.DataRegistry};return true;},
	_createFXObject						:function(obj,effect,refName,args){obj=jlyf.$(obj);if(!obj||typeof obj.jlyfFX !='object')return jlyf.triggerError('Effect._createFXObject:node passed as argument is not a valid Effect node' ,jlyf.ETRIGGER);if(typeof effect=='undefined')return jlyf.triggerError('Effect._createFXObject:no effect specified' ,jlyf.ETRIGGER);else effect=String(effect).toUpperCase();try{var FXObj=jlyf.Effect.FX[effect.toUpperCase()];if(!FXObj)throw new Error('Unable to retreive the FX object, perhaps it is an unsupported effect');if(typeof refName=='undefined'){refName=effect.toUpperCase();refName=jlyf.Effect.genUniqueRefName(obj,refName);if(!refName)throw new Error('Unable to create a unique reference name for effect object');}else{refName=String(refName);if(obj.jlyfFX.fxReg.isKey(refName))throw new Error('refName passed as argument already exists for this Effect Node');}var o={node:obj,fxName:effect.toUpperCase(),currState:null,fxRefName:refName,tOut:null};for(var i in FXObj)o[i]=FXObj[i];if(!('init' in o))throw new Error('FX object does not conform to required configurations');if(!obj.jlyfFX.fxReg.addItem(refName,o))throw new Error('Unable to add the Effect Object to the fxReg');return(args instanceof Array)? o.init.apply(o,args):o.init();}catch(e){return jlyf.triggerError('Effect._createFXObject:error reported:' +e.message,jlyf.ETRIGGER);}return true;},
	FX:{
		ALPHA:{
			min:0,max:100,fps:100,duration:200,initState:'MAX',frames:null,interval:null,delay:null,currFrame:0,tmOut:false,
			init				:function(minVal,maxVal,fps,duration,initState){if(typeof this.node=='undefined')return jlyf.triggerError('Effect.FX.ALPHA.init:invalid Effect node passed as argument' ,jlyf.ETRIGGER);if(parseInt(minVal))this.min=parseInt(minVal);if(parseInt(maxVal))this.max=parseInt(maxVal);if(!jlyf.Effect.FXUTIL.initFrameCycle.apply(this,[fps,duration]))return jlyf.triggerError('Effect.FX.ALPHA.init:unable to initialize the frame cycle variables.' ,jlyf.ETRIGGER);return this.setState(this.initState);},
			setPropVal	:function(val){try{val=parseInt(val);this.node.style.opacity=(val/100);this.node.style.MozOpacity=(val/100);this.node.style.KhtmlOpacity=(val/100);this.node.style.filter="alpha(opacity=" +val+ ")";return true;}catch(e){return jlyf.triggerError('Effect.FX.ALPHA.setPropVal:error reported:' +e.message,jlyf.ETRIGGER);	}},
			getPropVal	:function(){if(!this.node)return jlyf.triggerError('Effect.FX.ALPHA.getPropVal:object doesnt have a valid node reference.' ,jlyf.ETRIGGER);return(this.node.style.opacity)? parseFloat(this.node.style.opacity):(this.node.style.MozOpacity)? parseFloat(this.node.style.MozOpacity):(this.node.style.KhtmlOpacity)? parseFloat(this.node.style.KhtmlOpacity):(this.node.filters&&this.node.filters.alpha)? parseFloat(this.node.filters.alpha.opacity):null;},
			setState		:function(state){if(!('currState' in this))return jlyf.triggerError('Effect.FX.ALPHA.setState:called in invalid context' ,jlyf.ETRIGGER);state=String(state).toUpperCase();if(this.currState==state)return true;if(!jlyf.inArray(state,jlyf.Effect.FXStates))return jlyf.triggerError('Effect.FX.ALPHA.setState:invalid FXState set as argument:' +state,jlyf.ETRIGGER);switch(state){case 'RESET':return this.setState(this.initialState);case 'MAX':case 'MIN':if(this.setPropVal(this[state.toLowerCase()])){ this.currFrame=0;try{ window.clearTimeout(this.tmOut);}catch(e){}this.tmOut=false;this.currState=state;return true;}else return jlyf.triggerError('Effect.FX.ALPHA.setState:failed to set the state of the ALPHA fileter object' ,jlyf.ETRIGGER);case 'TO_MIN':case 'TO_MAX':this.currState=state;if(this.currFrame !=0)this.currFrame=this.frames-this.currFrame;this.cycle();return true;default:return jlyf.triggerError('Effect.FX.ALPHA.setState:invalid FXState passed through switch:' +state,jlyf.ETRIGGER);}},
			cycle				:function(obj,effectRefName){if(typeof obj !='undefined'){obj=jlyf.$(obj);if(!obj||!('jlyfFX' in obj))return jlyf.triggerError('Effect.FX.ALPHA.cycle:invalid Effect node passed as argument' ,jlyf.ETRIGGER);else if(!obj.jlyfFX.fxReg.isKey(effectRefName))return jlyf.triggerError('Effect.FX.ALPHA.cycle:invalid Effect reference name passed as argument' ,jlyf.ETRIGGER);else return obj.jlyfFX.fxReg.getItemValue(effectRefName).cycle();}if(!('currState' in this))return jlyf.triggerError('Effect.FX.ALPHA.cycle:called in invalid context' ,jlyf.ETRIGGER);if(this.currFrame<this.frames){try{window.clearTimeout(this.tmOut);}catch(e){}var currOp=this.getPropVal()* 100;var destVal=(this.currState=='TO_MIN')? this.min:this.max;if(currOp==destVal)return this.setState(this.currState=='TO_MIN' ? 'MIN':'MAX');var nuVal=Math.floor(currOp *((this.frames-this.currFrame)/this.frames)+ destVal *(this.currFrame/this.frames));if(!this.setPropVal(nuVal))return jlyf.triggerError('jlyf.Effect.FX.ALPHA.cycle:failed to update object property during cycle' ,jlyf.ETRIGGER);++this.currFrame;this.delay=this.interval * this.currFrame;this.tmOut=window.setTimeout("jlyf.Effect.FX.ALPHA.cycle('" +this.node.id+ "', '" +this.fxRefName+ "')" ,this.delay);}else{var toState=(this.currState.toUpperCase()=='TO_MAX')? 'MAX':(this.currState.toUpperCase()=='TO_MIN')? 'MIN':false;if(!toState)return jlyf.triggerError('Effect.FX.ALPHA.cycle:unable to determine end state, currState seems invalid ' ,jlyf.ETRIGGER);else return this.setState(toState);}return true;}
		},

		COLORTRANS:{
			min:null,max:null,jsProp:null,cssProp:null,fps:100,duration:200,initialState:'MIN',frames:null,currFrame:0,interval:null,delay:null,tmOut:false,
			init						:function(minVal,maxVal,fps,duration,jsProp,cssProp,initState){this.min=this.getRGBVals(minVal);this.max=this.getRGBVals(maxVal);if(!jlyf.Effect.FXUTIL.initFrameCycle.apply(this,[fps,duration]))return jlyf.triggerError('Effect.FX.COLORTRANS.init:unable to initialize the frame cycle variables.' ,jlyf.ETRIGGER);this.initialState=(typeof initState !='undefined' && jlyf.inArray(String(initState).toUpperCase(),jlyf.Effect.FXStates)) ? String(initState).toUpperCase():this.initialState;this.jsProp=jsProp;this.cssProp=cssProp;return this.setState('RESET');},
			setPropVal			:function(val){try{this.node.style[this.jsProp]=val;return true;}catch(e){return jlyf.triggerError('Effect.FX.COLORTRANS.setPropVal:error reported:' +e.message,jlyf.ETRIGGGER);}},
			getPropVal			:function(){return jlyf.getElementStyle(this.node,this.jsProp,this.cssProp);},
			setState				:function(state){if(!('currState' in this))return jlyf.triggerError('Effect.FX.COLORTRANS.setState:called in invalid context' ,jlyf.ETRIGGER);state=String(state).toUpperCase();if(this.currState==state)return true;if(!jlyf.inArray(state,jlyf.Effect.FXStates))return jlyf.triggerError('Effect.FX.COLORTRANS.setState:invalid FXState set as argument:' +state,jlyf.ETRIGGER);switch(state){case 'RESET':return this.setState(this.initialState);case 'MAX':case 'MIN':var rgbAry=this[state.toLowerCase()];if(this.setPropVal('rgb(' + rgbAry[0] + ',' + rgbAry[1] + ',' + rgbAry[2] + ')')){this.currFrame=0;try{window.clearTimeout(this.tmOut);}catch(e){}this.tmOut=false;this.currState=state;return true;}else return jlyf.triggerError('Effect.FX.COLORTRANS.setState:failed to set the state of the COLORTRANS filter object' ,jlyf.ETRIGGER);case 'TO_MIN':case 'TO_MAX':this.currState=state;this.currFrame=0;this.cycle();return true;default:return jlyf.triggerError('Effect.FX.COLORTRANS.setState:invalid FXState passed through switch:' + state, jlyf.ETRIGGER);}},
			cycle						:function(obj,effectRefName){if(typeof obj !='undefined'){obj=jlyf.$(obj);if(!obj||!('jlyfFX' in obj))return jlyf.triggerError('Effect.FX.COLORTRANS.cycle:invalid Effect node passed as argument' ,jlyf.ETRIGGER);else if(!obj.jlyfFX.fxReg.isKey(effectRefName))return jlyf.triggerError('Effect.FX.COLORTRANS.cycle:invalid Effect reference name passed as argument' ,jlyf.ETRIGGER);else return obj.jlyfFX.fxReg.getItemValue(effectRefName).cycle();}if(this.currFrame < this.frames){try{clearTimeout(this.tmOut);}catch(e){}var fromAry=this.getRGBVals(this.getPropVal());var toAry=this.currState.indexOf('MIN')!=-1 ? this.min:this.max;var r=Math.floor(fromAry[0] *((this.frames-this.currFrame)/this.frames)+ toAry[0] *(this.currFrame/this.frames));var g=Math.floor(fromAry[1] *((this.frames-this.currFrame)/this.frames)+ toAry[1] *(this.currFrame/this.frames));var b=Math.floor(fromAry[2] *((this.frames-this.currFrame)/this.frames)+ toAry[2] *(this.currFrame/this.frames));this.setPropVal('rgb(' +r+ ',' +g+ ',' +b+ ')');++this.currFrame;this.tmOut=setTimeout('jlyf.Effect.FX.COLORTRANS.cycle("' +this.node.id+ '", "' +this.fxRefName+ '")' ,this.delay);}else{try{clearTimeout(this.tmOut);}catch(e){}var fin=this.currState=='TO_MIN' || this.currState=='MIN'? 'MIN':this.currState=='TO_MAX' || this.currState=='MAX'? 'MAX':false;this.currFrame=0;if(fin)	this.setState(fin);else return jlyf.triggerError('jlyf.Effect.FX.COLORTRANS.cycle: unable to determine current state of object, failed to end cycle corrrectly' ,jlyf.ETRIGGER);return true;}return true;},
			getRGBVals			:function(str){if(typeof str !='string')return jlyf.triggerError('jlyf.Effect.FX.COLORTRANS.getRGBVals:invalid type passed as argument, must be of type string' ,jlyf.ETRIGGER);if(str.indexOf('rgb')!=-1){var v=str.toLowerCase().match(/rgb[\W](\s?\d{1,3})\s?,\s?(\d{1,3})\s?,\s?(\d{1,3})\s?[\W]/);if(v)return [parseInt(v[1]),parseInt(v[2]),parseInt(v[3])];else return jlyf.triggerError('jlyf.Effect.FX.COLORTRANS.getRGBVals:error:unable to parse out rgb values.' + str, jlyf.ETRIGGER);}else if(jlyf.Effect.FX.COLORTRANS.isHexVal(str)){str=jlyf.Effect.FX.COLORTRANS.normalizeHexVal(str);return(str)? [parseInt(str.substr(1,2),16), parseInt(str.substr(3,2),16), parseInt(str.substr(5,2),16)]:jlyf.triggerError('jlyf.Effect.FX.COLORTRANS.getRGBVals:error:unable to normalize hex value.',jlyf.ETRIGGER);}else return jlyf.triggerError('jlyf.Effect.FX.COLORTRANS.getRGBVals:illegal usage:invalid format passed as argument:'+ str ,jlyf.ETRIGGER);},
			normalizeHexVal	:function(hex){if(typeof hex !='string')hex=hex.toString();if(hex.toLowerCase().match(/^#[0-9a-f]{6}$/))return hex;var r=hex.toLowerCase().match(/^#[0-9a-f]{3}$/);if(r)return '#' + hex.substr(1,1)+ hex.substr(1,1)+ hex.substr(2,1)+ hex.substr(2,1)+ hex.substr(3,1)+ hex.substr(3,1);var r=hex.toLowerCase().match(/^[0-9a-f]{6}$/);if(r)return '#' + hex;var r=hex.toLowerCase().match(/^[0-9a-f]{3}$/);if(r)return '#' + hex.substr(0,1)+ hex.substr(0,1)+ hex.substr(1,1)+ hex.substr(1,1)+ hex.substr(2,1)+ hex.substr(2,1);return jlyf.triggerError('jlyf.Effect.FX.COLORTRANS.normalizeHexVal:illegal usage:in valid length for hex string.', jlyf.ETRIGGER);},
			isHexVal				:function(hex){if(typeof hex !='string')hex=hex.toString();if(hex)return Boolean(hex.toLowerCase().match(/(^#?[0-9a-f]{3}$)|(^#?[0-9a-f]{6}$)/));else return jlyf.triggerError('jlyf.Effect.FX.COLORTRANS.isHexVal:cannot convert the argument value to a string.', jlyf.ETRIGGER);}
		},

		ACCORDION_POSY:{
			min:0,max:0,initialState:'MAX',currState:null,parent:null,suckMargin:4,parentEffect:false,interval:50,tmOut:false,
			init					:function(minVal,maxVal,initState,parentNode,parentEffectRef){this.min=parseInt(minVal)|| this.min;this.node.style.overflow='hidden';if(typeof maxVal=='number')this.max=parseInt(maxVal);else{var mx=jlyf.getElementStyle(this.node,'height','height');if(mx=='auto')mx=jlyf.DHTML.getObjectHeight(this.node);this.max=parseInt(mx);}this.initialState=(typeof initState !='undefined' && jlyf.inArray(String(initState).toUpperCase(),jlyf.Effect.FXStates)) ? String(initState).toUpperCase():this.initialState;if(typeof parentNode !='undefined' && !this.setParent(parentNode,parentEffectRef))return jlyf.triggerError('Effect.FX.ACCORDION_POSY.init:failed to initialize parent element.' ,jlyf.ETRIGGER);return this.setState(this.initialState);},
			setPropVal		:function(val){try{if(this.parentEffect !==false && !this.updateParent(val-this.getPropVal())){throw new Error('failed to update the parent Size');return false;}this.node.style.height=parseInt(val)+ 'px';}catch(e){return jlyf.triggerError('jlyf.Effect.FX.ACCORDION_POSY.setPropVal:error reported:'+e.message,jlyf.ETRIGGER);}return true;},
			getPropVal		:function(){return parseInt(jlyf.DHTML.getObjectHeight(this.node));},
			cycle					:function(obj,effectRef){if(typeof obj !='undefined'){obj=jlyf.$(obj);if(!obj || !('jlyfFX' in obj))return jlyf.triggerError('Effect.FX.ACCORDION_POSY.cycle:invalid Effect node passed as argument' ,jlyf.ETRIGGER);else if(!obj.jlyfFX.fxReg.isKey(effectRef))return jlyf.triggerError('Effect.FX.ACCORDION_POSY.cycle:invalid Effect reference name passed as argument' ,jlyf.ETRIGGER);else return obj.jlyfFX.fxReg.getItemValue(effectRef).cycle();}if(!('currState' in this))return jlyf.triggerError('Effect.FX.ACCORDION_POSY.cycle:called in invalid context' ,jlyf.ETRIGGER);var currHeight=this.getPropVal();if(this.currState=='TO_MIN'){var adj=currHeight-Math.floor(((currHeight-this.min))/2);if((adj-this.suckMargin)<=this.min)return this.setState('MIN');}else{var adj=currHeight+Math.floor((this.max-currHeight)/2);if(adj >=this.max-this.suckMargin)return this.setState('MAX');}try{clearTimeout(this.tmOut)}catch(e){}this.setPropVal(adj);this.tmOut=setTimeout('jlyf.Effect.FX.ACCORDION_POSY.cycle("' +this.node.id+ '","' +this.fxRefName+ '")' ,this.interval);return true;},
			setState			:function(state){if(!('currState' in this))return jlyf.triggerError('Effect.FX.ACCORDION_POSY.setState:called in invalid context' ,jlyf.ETRIGGER);state=String(state).toUpperCase();if(this.currState==state)return true;if(!jlyf.inArray(state,jlyf.Effect.FXStates))return jlyf.triggerError('Effect.FX.ACCORDION_POSY.setState:invalid FXState set as argument:' +state,jlyf.ETRIGGER);switch(state){case 'RESET':return this.setState(this.initialState);case 'MAX':case 'MIN':if(this.setPropVal(this[state.toLowerCase()])){try{window.clearTimeout(this.tmOut);}catch(e){}this.tmOut=false;this.currState=state;return true;}else return jlyf.triggerError('Effect.FX.ACCORDION_POSY.setState:failed to set the state of the ACCORDION_POSY filter object' ,jlyf.ETRIGGER);case 'TO_MIN':case 'TO_MAX':this.currState=state;this.cycle();return true;default:return jlyf.triggerError('Effect.FX.ACCORDION_POSY.setState:invalid FXState passed through switch:' +state,jlyf.ETRIGGER);}},
			setParent			:function(obj,effectRef){try{this.parentEffect=jlyf.Effect.getEffectObj(obj,effectRef);this.parent=jlyf.$(obj);}catch(e){return jlyf.triggerError('Effect.FX.ACCORDION_POSY.setParent:error reported:' +e.message,jlyf.ETRIGGER);}return true;},
			updateParent	:function(newSize){if(this.parentEffect==false)return false;var pCurr=this.getParentSize();var nuMax=this.getParentMax()+ newSize;var nuPCurr=pCurr + newSize;this.parentEffect.max=nuMax;return this.parentEffect.setPropVal(nuPCurr);},
			getParentMax	:function(size){return(this.parentEffect==false)? jlyf.triggerError('Effect.FX.ACCORDION_POSY.getSizeDiff:no parent effect object found for this node' ,jlyf.ETRIGGER):this.parentEffect.max;},
			getParentSize	:function(){return(this.parentEffect==false)? jlyf.triggerError('Effect.FX.ACCORDION_POSY.getSizeDiff:no parent effect object found for this node' ,jlyf.ETRIGGER):this.parentEffect.getPropVal();}
		},

		ACCORDION_POSX: {
		    min: 0,
		    max: 0,
		    initialState: 'MAX',
		    currState: null,
		    parent: null,
		    suckMargin: 4,
		    parentEffect: false,
		    interval: 50,
		    tmOut: false,
		    init: function (minVal, maxVal, initState, parentNode, parentEffectRef) {
		        this.min = parseInt(minVal) || this.min;
		        this.node.style.overflow = 'hidden';
		        if (typeof maxVal == 'number') this.max = parseInt(maxVal);
		        else {
		            var mx = jlyf.getElementStyle(this.node, 'width', 'width');
		            if (mx == 'auto') mx = jlyf.DHTML.getObjectWidth(this.node);
		            this.max = parseInt(mx);
		        }
		        this.initialState = (typeof initState != 'undefined' && jlyf.inArray(String(initState).toUpperCase(), jlyf.Effect.FXStates)) ? String(initState).toUpperCase() : this.initialState;
		        if (typeof parentNode != 'undefined' && !this.setParent(parentNode, parentEffectRef)) return jlyf.triggerError('Effect.FX.ACCORDION_POSX.init:failed to initialize parent element.', jlyf.ETRIGGER);
		        return this.setState(this.initialState);
		    },
		    setPropVal: function (val) {
		        try {
		            if (this.parentEffect !== false && !this.updateParent(val - this.getPropVal())) {
		                throw new Error('failed to update the parent Size');
		                return false;
		            }
		            this.node.style.width = parseInt(val) + 'px';
		        } catch (e) {
		            return jlyf.triggerError('jlyf.Effect.FX.ACCORDION_POSX.setPropVal:error reported:' + e.message, jlyf.ETRIGGER);
		        }
		        return true;
		    },
		    getPropVal: function () {
		        return parseInt(jlyf.DHTML.getObjectWidth(this.node));
		    },
		    cycle: function (obj, effectRef) {
		        if (typeof obj != 'undefined') {
		            obj = jlyf.$(obj);
		            if (!obj || !('jlyfFX' in obj)) return jlyf.triggerError('Effect.FX.ACCORDION_POSX.cycle:invalid Effect node passed as argument', jlyf.ETRIGGER);
		            else if (!obj.jlyfFX.fxReg.isKey(effectRef)) return jlyf.triggerError('Effect.FX.ACCORDION_POSX.cycle:invalid Effect reference name passed as argument', jlyf.ETRIGGER);
		            else return obj.jlyfFX.fxReg.getItemValue(effectRef).cycle();
		        }
		        if (!('currState' in this)) return jlyf.triggerError('Effect.FX.ACCORDION_POSX.cycle:called in invalid context', jlyf.ETRIGGER);
		        var currWidth = this.getPropVal();
		        if (this.currState == 'TO_MIN') {
		            var adj = currWidth - Math.floor(((currWidth - this.min)) / 2);
		            var currW = parseInt(this.node.style.width.replace('px', ''));
		            if (currW) {
		                var diff = currWidth - currW;
		                if (diff && (diff > 0)) adj = adj - diff;
		            }
		            if ((adj - this.suckMargin) <= this.min) return this.setState('MIN');
		        } else {
		            var adj = currWidth + Math.floor((this.max - currWidth) / 2);
		            if (adj >= this.max - this.suckMargin) return this.setState('MAX');
		        }
		        try {
		            clearTimeout(this.tmOut)
		        } catch (e) {}
		        this.setPropVal(adj);
		        this.tmOut = setTimeout('jlyf.Effect.FX.ACCORDION_POSX.cycle("' + this.node.id + '","' + this.fxRefName + '")', this.interval);
		        return true;
		    },

		    setState: function (state) {
		        if (!('currState' in this)) return jlyf.triggerError('Effect.FX.ACCORDION_POSX.setState:called in invalid context', jlyf.ETRIGGER);
		        state = String(state).toUpperCase();
		        if (this.currState == state) return true;
		        if (!jlyf.inArray(state, jlyf.Effect.FXStates)) return jlyf.triggerError('Effect.FX.ACCORDION_POSX.setState:invalid FXState set as argument:' + state, jlyf.ETRIGGER);
		        switch (state) {
		        case 'RESET':
		            return this.setState(this.initialState);
		        case 'MAX':
		        case 'MIN':
		            if (this.setPropVal(this[state.toLowerCase()])) {
		                try {
		                    window.clearTimeout(this.tmOut);
		                } catch (e) {}
		                this.tmOut = false;
		                this.currState = state;
		                return true;
		            } else return jlyf.triggerError('Effect.FX.ACCORDION_POSX.setState:failed to set the state of the ACCORDION_POSX filter object', jlyf.ETRIGGER);
		        case 'TO_MIN':
		        case 'TO_MAX':
		            this.currState = state;
		            this.cycle();
		            return true;
		        default:
		            return jlyf.triggerError('Effect.FX.ACCORDION_POSX.setState:invalid FXState passed through switch:' + state, jlyf.ETRIGGER);
		        }
		    },
		    setParent: function (obj, effectRef) {
		        try {
		            this.parentEffect = jlyf.Effect.getEffectObj(obj, effectRef);
		            this.parent = jlyf.$(obj);
		        } catch (e) {
		            return jlyf.triggerError('Effect.FX.ACCORDION_POSX.setParent:error reported:' + e.message, jlyf.ETRIGGER);
		        }
		        return true;
		    },
		    updateParent: function (newSize) {
		        if (this.parentEffect == false) return false;
		        var pCurr = this.getParentSize();
		        var nuMax = this.getParentMax() + newSize;
		        var nuPCurr = pCurr + newSize;
		        this.parentEffect.max = nuMax;
		        return this.parentEffect.setPropVal(nuPCurr);
		    },
		    getParentMax: function (size) {
		        return (this.parentEffect == false) ? jlyf.triggerError('Effect.FX.ACCORDION_POSX.getSizeDiff:no parent effect object found for this node', jlyf.ETRIGGER) : this.parentEffect.max;
		    },
		    getParentSize: function () {
		        return (this.parentEffect == false) ? jlyf.triggerError('Effect.FX.ACCORDION_POSX.getSizeDiff:no parent effect object found for this node', jlyf.ETRIGGER) : this.parentEffect.getPropVal();
		    }
		}
	},
	FXUTIL:{
		initFrameCycle	:function(fps,duration){this.fps=(fps !==false && typeof fps !='undefined')? parseInt(fps):this.fps;this.duration=(duration !==false && typeof duration !='undefined')? parseInt(duration):this.duration;if(!this.fps || !this.duration)return jlyf.triggerError('Effect.FXUTIL.initFrameCycle:invalid number passed as argument.' ,jlyf.ETRIGGER);this.frames=Math.round(this.fps *(this.duration / 1000));this.interval=this.duration / this.frames;this.delay=this.interval;return true;},
		initQuickFX			:function(node,xVal,yVal,fps,duration,callback){this.node=jlyf.$(node);if(!this.node)return jlyf.triggerError('Effect.QUICKFX.FLY_TO:invalid node passed as argument.' ,jlyf.ETRIGGER);this.toX=parseInt(xVal);this.toY=parseInt(yVal);if(!this.toX || !this.toY)return jlyf.triggerError('Effect.QUICKFX.FLY_TO:invalid coordinates passed as argument.' ,jlyf.ETRIGGER);jlyf.Effect.FXUTIL.initFrameCycle.apply(this,[fps.duration]);return true;}
	}
};
jlyf.Effect.constructor=null;
jlyf.Event={
	addEvent						:function(obj,evt,func,args,evtArg){obj=jlyf.$(obj);if(!obj)return jlyf.triggerError('jlyf.Event.addEvent:invalid node passed as argument for <obj>', jlyf.ETRIGGER);if(typeof func !='function')return jlyf.triggerError('jlyf.Event.addEvent:' + evt + ':invalid function passed as argument for <func> ' + typeof func, jlyf.ETRIGGER);if(!(args instanceof Array))args=new Array(args);if(evtArg===true){var f_ref=(args)? function(event){if(typeof args[0] !='object' &&(!args[0].type || !args[0].clientX))args.unshift(event);else args[0]=event;func.apply(event,args);}:function(event){ func(event);};}else	var f_ref=(args)? function(event){ func.apply(event,args);}:function(event){ func();};if(obj.addEventListener){evt=evt.toLowerCase();if(evt.indexOf("on")==0)evt=evt.substring(2,evt.length);obj.addEventListener(evt,f_ref,false);}else if(obj.attachEvent)bSucc=obj.attachEvent(evt,f_ref);else return jlyf.triggerError('jlyf.Event.addEvent:failed to add event to the object', jlyf.ETRIGGER);return true;},
	getEvent						:function(evt){return(evt)? evt:((window.event)? event:null);},
	getEventTarget			:function(evt){return(evt.target)? evt.target:((evt.srcElement)? evt.srcElement:null);},
	cancelEventBubble		:function(evt){evt=jlyf.Event.getEvent(evt);if(evt){if(window.event && window.event.cancelBubble){evt.cancleBubble=true;return true;}else if(evt.stopPropagation){evt.stopPropagation();return true;}else return jlyf.triggerError('jlyf.cancelEventBubble: unable to retrieve event');}else return jlyf.triggerError('jlyf.cancelEventBubble:unable to retrieve event');},
	getPageEventCoords	:function(evt){if(!evt)return false;if('pageX' in evt)return { x:evt.pageX, y:evt.pageY	};else if('clientX' in evt){var c={x:evt.clientX + document.body.scrollLeft - document.body.clientLeft,y:evt.clientY + document.body.scrollTop - document.body.clientTop};if(document.body.parentElement && document.body.parentElement.clientLeft){var bodParent=document.body.parentElement;c.x +=bodParent.scrollLeft - bodParent.clientLeft;c.y +=bodParent.scrollTop - bodParent.clientTop;}return c;}else	return jlyf.triggerError('Event.getPageEventCoords:invalid event model. unable to determine the page event coords', jlyf.ETRIGGER);},
	getOffsetCoords			:function(obj,evt){obj=jlyf.$(obj);if(!obj)return jlyf.triggerError('DHTML.getOffsetCoords:invalid node passed as argument', jlyf.ETRIGGER);evt=jlyf.Event.getEvent(evt);if(!evt)return jlyf.triggerError('DHTML.getOffsetCoords:invalid event passed as argument', jlyf.ETRIGGER);var evtCoords=jlyf.Event.getPageEventCoords(evt);if(typeof evt.pageX !='undefined')return {x:evtCoords.x -((typeof obj.offsetLeft !='undefined')? obj.offsetLeft:obj.left),y:evtCoords.y -((typeof obj.offsetTop !='undefined')? obj.offsetTop:obj.top)};else if(typeof evt.offsetX !="undefined"){var c={x:evt.offsetX -((evt.offsetX < -2)? 0:document.body.scrollLeft),y:evt.offsetY -((evt.offsetY < -2)? 0:document.body.scrollTop)};c.x -=(document.body.parentElement && document.body.parentElement.scrollLeft)? document.body.parentElement.scrollLeft:0;c.y -=(document.body.parentElement && document.body.parentElement.scrollTop)? document.body.parentElement.scrollTop:0;return c;}else if(typeof evt.clientX !="undefined")return {x:evt.clientX -((typeof obj.offsetLeft !='undefined')? obj.offsetLeft:0),y:evt.clientY -((typeof obj.offsetTop !='undefined')? obj.offsetTop:0)};else return false;}
};
jlyf.XHR={
	READY:false,
	HTTP_CREATORS:[function(){return new XMLHttpRequest();},function(){return new ActiveXObject("Msxml2.XMLHTTP");},function(){return new ActiveXObject("Microsoft.XMLHTTP");}],
	REQUEST_STATES:{"QUEUED":"_reqQ","ACTIVE":"_reqActv","COMPLETE":"_reqFin"},
	_reqQ:new jlyf.DataRegistry(),
	_reqActv:new jlyf.DataRegistry(),
	_reqFin:new jlyf.DataRegistry(),
	MAX_WAIT_CYCLES:10,
	WAIT_CYCLE_TIME:1,
	getHTTPObj:null,
	xhrCookie:'slxhr',
	xhrTestCount:0,
	xhrTestReqRef:'isXHR',
	isEnabled 				:function(){return jlyf.XHR.READY && jlyf.getCookie(jlyf.XHR.xhrCookie);},
	sendTestRequest			:function(){if(!this.createRequest(jlyf.XHR.xhrTestReqRef, '/ajax/gen/xhr_ready/')) return jlyf.triggerError('Failed to create the XHR request', jlyf.ETRIGGER);this.activateRequest(jlyf.XHR.xhrTestReqRef,function(){jlyf.XHR.setTestReqResult('true');});jlyf.XHR.checkTestRequest();},
	checkTestRequest 		:function(){if(jlyf.XHR.xhrTestCount < 5){++jlyf.XHR.xhrTestCount;setTimeout('jlyf.XHR.checkTestRequest()', 1000);}else if(!jlyf.getCookie(jlyf.XHR.xhrCookie) && (jlyf.XHR.xhrTestCount >= 5))jlyf.XHR.setTestReqResult('false');},
	setTestReqResult		:function(res){if(res != 'true' && res != 'false')res = false;jlyf.setCookie(jlyf.XHR.xhrCookie, res);},

	createRequest			:function(refName, url, requestMethod, returnType, async, variables, headers){
		if(this.isRequest(refName))
			return jlyf.triggerError("jlyf.XHR.createRequest request name passed as argument already in use: ("+refName+")", jlyf.EWARN);
		if(typeof refName !='string' || this._reqQ.isKey(refName))
			return jlyf.triggerError("jlyf.XHR.createRequest reports illegal reference name, request not created", jlyf.EWARN);
			var r=new this.Request(url, requestMethod, returnType, async, variables, headers);
			if(r instanceof this.Request)
				return this._reqQ.addItem(refName, r);
			else return jlyf.triggerError("jlyf.XHR.createRequest reports failure to create a Request Object", jlyf.ETRIGGER);
	},
	createAndSendRequest	:function(refName, notify, url, requestMethod, returnType, async, variables, headers){return (!this.createRequest(refName, url, requestMethod, returnType, async, variables, headers))? jlyf.triggerError('createAndSendRequest: failed to create the request for refname :' + refName): this.activateRequest(refName, notify);},

	isRequest				:function(refName){return this._reqQ.isKey(refName)||this._reqActv.isKey(refName)||this._reqFin.isKey(refName);},
	isActiveRequest			:function(refName){return this._reqActv.isKey(refName);},
	isFinishedRequest		:function(refName){return this._reqFin.isKey(refName);},
	isQueuedRequest			:function(refName){return this._reqQ.isKey(refName);},
	getQueuedRequest		:function(refName){return this._getRequest(refName, "_reqQ");},
	getActiveRequest		:function(refName){return this._getRequest(refName, "_reqActv");},
	getFinishedRequest		:function(refName){return this._getRequest(refName, "_reqFin");},
	activateRequest			:function(refName, notify){if(typeof refName !="string" || !this._reqQ.isKey(refName))return jlyf.triggerError("jlyf.XHR.activateRequest Invalid Request Reference", jlyf.ETRIGGER);var r=this.getQueuedRequest(refName);return r.send(refName, this.getHTTPObj(), notify);},
	checkActiveRequest		:function(refName){
  		if(typeof refName=="string"){
  			var r=this.getActiveRequest(refName);
  			if(!r){
  				if(!this.isRequest(refName)){
  					return jlyf.triggerError("jlyf.XHR.checkActiveRequest Unknown Request Reference: "+refName, jlyf.ETRIGGER);
  				}else{
  					if(this.isActiveRequest(refName)){
  						return jlyf.triggerError("jlyf.XHR.checkActiveRequest request status is active, but unable to retrieve: "+refName, jlyf.ETRIGGER);
  					}else if(this.isFinishedRequest(refName)){
  						return jlyf.triggerError("jlyf.XHR.checkActiveRequest request status is currently in finished state: "+refName, jlyf.ETRIGGER);
  					}else if(this.isQueuedRequest(refName)){
							return jlyf.triggerError("jlyf.XHR.checkActiveRequest request status is curently in queued state: "+refName, jlyf.ETRIGGER);
  					}
  				}
  			}else{

  			}
  			return(!r) ? jlyf.triggerError("jlyf.XHR.checkActiveRequest Invalid Request Reference: "+refName, jlyf.ETRIGGER): r.updateRequestStatus(refName);
  		}
  },
	deleteAnyQRequest		:function(refName){if(typeof refName=="string"){var r=this.getActiveRequest(refName);if(r){this._deleteRequest(refName, "_reqQ");this._deleteRequest(refName, "_reqActv");this._deleteRequest(refName, "_reqFin");return true;}}else return jlyf.triggerError("jlyf.XHR.deleteAnyQRequest Invalid Request Reference", jlyf.ETRIGGER);},
	deleteQueuedRequest		:function(refName){return this._deleteRequest(refName, "_reqQ");},
	deleteActiveRequest		:function(refName){return this._deleteRequest(refName, "_reqActv");},
	deleteFinishedRequest	:function(refName){return this._deleteRequest(refName, "_reqFin");},
	switchRequestState		:function(refName, from, to){
		/*jlyf.triggerError('jlyf.XHR.switchRequestState : switching request: ('+ refName+') from status: ('+from+') to status: ('+to+')', jlyf.EWARN);*/
		var r;
		switch(from){
			case "QUEUED":r=this.getQueuedRequest(refName); break;
			case "ACTIVE":r=this.getActiveRequest(refName); break;
			case "COMPLETE":r=this.getFinishedRequest(refName); break;
			default:r=false;
		}
		if(typeof r !="object" || !("_type" in r))
			return jlyf.triggerError("jlyf.XHR.switchRequestState to retrieve the request  from " + from + " registry", jlyf.ETRIGGER);
		else if(typeof this[this.REQUEST_STATES[to]] !="object")
			return jlyf.triggerError("jlyf.XHR.switchRequestState invalid target registry " + to, jlyf.ETRIGGER);
		else if(!this[this.REQUEST_STATES[to]].addItem(refName, r))
			return jlyf.triggerError("jlyf.XHR.switchRequestState failed to add item to target registry");
		else switch(from){
			case "QUEUED":
				this.deleteQueuedRequest(refName);
				break;
			case "ACTIVE":this.deleteActiveRequest(refName); break;
			case "COMPLETE":this.deleteFinishedRequest(refName); break;
		}
	},
	_getRequest				:function(refName, reg){if(typeof refName !='string')return jlyf.triggerError("jlyf.XHR.getRequest reports illegal request name");else return this[reg].getItemValue(refName);},
	_deleteRequest			:function(refName, regName){
		/*jlyf.triggerError('jlyf.XHR._deleteRequest : deleting request: ('+ refName+') from request registry: ('+regName+')', jlyf.EWARN);*/
		if(regName in this){
			r = this[regName].getItemValue(refName);
			if(r){
				clearInterval(r._intv);
				return this[regName].removeItem(refName);
			}else return jlyf.triggerError('jlyf.XHR._deleteRequest : unknown request: ('+ refName+') in request registry: ('+regName+')', jlyf.EWARN);
		}return jlyf.triggerError('jlyf.XHR._deleteRequest : unknown request registry: ('+regName+')', jlyf.EWARN);
	},
	Request					:function(url, requestMethod, returnType, async, variables, headers){
		this._meth='GET';
		this._type='TEXT';
		this._async=true;
		this._url;
		this._postStr;
		this._postReg=false;
		this._getReg=false;
		this._headReg=false;
		this._http;
		this._notify;
		this._response;
		this._intv;
		this._curCycle;
		this.user=false;
		this.pass=false;
		this.status='IDLE';
		this._persist=false;
		if(typeof url !='undefined')this.setURL(String(url));
		if(typeof requestMethod !='undefined')this.setRequestMethod(String(requestMethod));
		if(typeof returnType !='undefined')this.setReturnType(String(returnType));
		if(typeof async !='undefined')this.setAsync(Boolean(async));
		if(typeof variables !='undefined')this.updateVariables(variables);
		if(typeof headers !='undefined')this.updateHeaders(headers);
	}
};
jlyf.XHR.Request.prototype={
	VALID_REQUEST_METHODS :{"GET":true,"POST":true,"HEAD":true},
	VALID_RETURN_TYPES:{"XML":true,"TEXT":true,"JSON":true},
	MAX_WAIT_CYCLES : jlyf.XHR.MAX_WAIT_CYCLES,
	WAIT_CYCLE_TIME : jlyf.XHR.WAIT_CYCLE_TIME,
	aborted : false,
	setURL								:function(url){this._url=String(url);return(this._url)? true:jlyf.triggerError('XHR.Request.setURL:invalid url', jlyf.ETRIGGER);},
	setRequestMethod			:function(requestMethod){if(typeof requestMethod=='string' && requestMethod.toUpperCase()in this.VALID_REQUEST_METHODS){this._meth=String(requestMethod).toUpperCase();return true;}else return jlyf.triggerError('XHR.Request.setRequestMethod:invalid requestMethod', jlyf.ETRIGGER);},
	setReturnType					:function(returnType){if(typeof returnType=='string' && returnType.toUpperCase()in this.VALID_RETURN_TYPES){this._type=returnType.toUpperCase();return true;}else return jlyf.triggerError('XHR.Request.setReturnType:invalid returnType', jlyf.ETRIGGER);},
	setAsync							:function(async){this._async=Boolean(async);return true;},
	setPersist						:function(persist){if(typeof persist !='undefined'){this._persist=Boolean(persist);return true;}else return jlyf.triggerError('XHR.Request.setPersist:invalid persist value', jlyf.ETRIGGER);},
	setCallback						:function(callback){if(typeof callback=='function' || typeof callback=='string'){this._notify=callback;return true;}else return jlyf.triggerError("jlyf.XHR.Request.prototype.setCallback invalid callback type");},
	send									:function(refName, httpObj, callback){
		if(typeof httpObj !="object" || !("readyState" in httpObj))
			return jlyf.triggerError("jlyf.XHR.Request.prototype.send:invalid XMLHttpRequest Object sent for " + refName, jlyf.ETRIGGER);
		else this._http=httpObj;
		if(typeof callback !='undefined')
			this.setCallback(callback);
		this._formatQueryString();
		this._formatPostString();
		this._http.open((this._meth !="HEAD")?this._meth:"GET",this._url);
		this._setAllRequestHeaders();
		this._http.send(this._postStr);
		this.currCycle=0;
		this._status="ACTIVE";
		jlyf.XHR.switchRequestState(refName, "QUEUED", "ACTIVE");
		if(typeof this._intv != 'undefined')clearInterval(this._intv);
		this._intv=setInterval("jlyf.XHR.checkActiveRequest('"+ refName +"')",jlyf.XHR.WAIT_CYCLE_TIME * 1000);
		return true;
	},
  updateRequestStatus		:function(refName){if(this._http.readyState==4 && this._http.status==200){clearInterval(this._intv);this._http.onreadystatechange=new Function;this._status="COMPLETE";this._triggerNotify(refName);}else{if(!this.aborted){++this._currCycle;if(this._currCycle > jlyf.XHR.MAX_WAIT_CYCLES){clearInterval(this._intv);this.status="TIMED OUT";this._triggerNotify(refName,"Request Timed out reference:"+refName);}}else{clearInterval(this._intv);this.status="ABORTED";this._triggerNotify(refName,"Request Aborted reference:"+refName);}}},
  updateVariables				:function(v){if(typeof v !='object')return jlyf.triggerError('jlyf.XHR.Request.updateVariables:Invalid object passed as argument',jlyf.ETRIGGER);var f=(this._meth.toUpperCase()=='GET') ? 'updateGetVariables' :(this._meth.toUpperCase()=='POST') ? 'updatePostVariables':jlyf.triggerError('jlyf.XHR.updateVariables:invalid method set for this request',jlyf.ETRIGGER);for(var i in v)if(!this[f](v[i], i))return jlyf.triggerError('jlyf.XHR.updateVariables:failed to update a variable',jlyf.ETRIGGER);return true;},
	updateGetVariables		:function(variables, keyName){if(!this._getReg)this._getReg=new jlyf.DataRegistry;return this._updateVarReg("_getReg", variables, keyName);},
	updatePostVariables		:function(variables, keyName){if(!this._postReg)this._postReg=new jlyf.DataRegistry;return this._updateVarReg("_postReg", variables, keyName);},
	updateRequestHeaders	:function(variables, keyName){if(!this._headReg)this._headReg=new jlyf.DataRegistry;return this._updateVarReg("_headReg", variables, keyName);},
	abort									:function(refName, reason){if(this.status=="ACTIVE"){if(this._http.readyState < 4){this._http.abort();this.aborted=true;clearInterval(this._intv);var msg="Request Aborted"+typeof reason !="undefined"? ' ' + String(reason):'';return this.triggerNotify(refName, msg);}else return false;}else return false;},
  reset									:function(refName){if(this.status=="COMPLETE")alert('jlyf.XHR.Request.reset not used yet');},
	_triggerNotify				:function(refName, emsg){
		if(typeof emsg=="string"){
			this._response={
				status:this._http.status,
				statusText:this._http.statusText,
				readyState:this._http.readyState,
				error:emsg
			};
		}else{
			if(this._meth=="HEAD")this._response=this._http.getAllResponseHeaders();
			else if(this._type=="JSON"){
				try{
					this._response=eval('('+this._http.responseText+')');
				}catch(e){
					this._response={
						status:this._http.status,
						statusText:this._http.statusText,
						readyState:this._http.readyState,
						error:e.message
					};
				}
			}else this._response=(this._type=="XML")? this._http.responseXML:this._http.responseText;
		}
		if(typeof this._notify !='undefined'){
			if(typeof this._notify=='function')
				this._notify(this._response);
			else if(String(this._notify))
				window[this._notify]=this._response;
			else jlyf.triggerError('jlyf.XHR.Request.prototype._triggerNotify illegal type for response notification');

			if(!this._persist)return jlyf.XHR.deleteActiveRequest(refName);
		}else if(this._type=="JSON" && !this._persist && this._response===true)
			return jlyf.XHR.deleteActiveRequest(refName);

		jlyf.XHR.switchRequestState(refName, "ACTIVE", "COMPLETE");
		this.status="COMPLETE";
		return true;
	},
	_updateVarReg					:function(reg, variables, keyName){if(typeof this[reg] !='object')return jlyf.triggerError("jlyf.XHR.Request.prototype._updateVarReg illegal registry Name", jlyf.ETRIGGER);if(typeof variables=="object"){try{for(var i in variables)/* cycle through and add them one at a time */this[reg].isKey(i)? this[reg].setItem(i, variables[i]):this[reg].addItem(i, variables[i]);return true;}catch(e){return jlyf.triggerError("jlyf.XHR.Request.prototype._updateVarReg illegal variable array", jlyf.ETRIGGER);}}else if(typeof keyName=='string'){this[reg].isKey(keyName)? this[reg].setItem(keyName, variables):this[reg].addItem(keyName, variables);return true;}else return jlyf.triggerError('XHR.Request._updateVarReg:invalid arguments', jlyf.ETRIGGER);},
	_setAllRequestHeaders	:function(){if(typeof this._headReg !="object")return;if(typeof this._http !="object" || !("readyState" in this._http)|| this._http.readyState !=1)return jlyf.triggerError("jlyf.XHR.Request.prototype.setAllRequestHeaders invalid http object", jlyf.ETRIGGER);var http=this._http;this._headReg.regWalk(function(key, val){if(typeof http=="undefined" || !("readyState" in http))	jlyf.triggerError("jlyf.XHR.Request.prototype.setAllRequestHeaders cannot retrieve http object during registry walk", jlyf.ETRIGGER);else http.setRequestHeader(key, val);});},
	_formatQueryString		:function(){if(typeof this._getReg=="object")this._url +=(this._url.indexOf("?")!=-1)? '&' + this._regToVarString(this._getReg):'?' + this._regToVarString(this._getReg);},
	_formatPostString			:function(){if(typeof this._postReg=="object"){this._postStr= this._regToVarString(this._postReg);if(this._meth=="GET")this._meth="POST";this.updateRequestHeaders({'Content-type':'application/x-www-form-urlencoded','Content-length':this._postStr.length,'Connection':'close'});}else this._postStr=null;},
	_regToVarString				:function(reg){if(typeof reg !='object'){return jlyf.triggerError("jlyf.XHR.Request.prototype._regToVarString invalid DataRegistry argument");}else{var a=[];reg.regWalk(function(key, val){ a.push(key + "=" + encodeURIComponent(val));});return(a.length)? a.join("&"):'';}}
};
jlyf.XHR.constructor=null;
for(var i=0; i < jlyf.XHR.HTTP_CREATORS.length; ++i){try{var a=jlyf.XHR.HTTP_CREATORS[i]();if(a !=null){jlyf.XHR.getHTTPObj=jlyf.XHR.HTTP_CREATORS[i];break;}}catch(e){ continue;}}if(typeof jlyf.XHR.getHTTPObj != 'function'){jlyf.XHR.READY=false;jlyf.triggerError("Browser does not support Ajax requests. To fully benefit from the jlyf Experience, we recommend upgrading to the most recent version of your browser.",jlyf.EWARN);}else jlyf.XHR.READY=true;
jlyf.NavBLDR={
	openLinkExp:null,closedHeaders:[],cookieName:'slnav',isInit:false,
	init							:function(){if(this.isInit)return true; var nlinks=jlyf.getElementsByClass('navBucketLink');if(!nlinks.length)return;nlinks=nlinks.concat(jlyf.getElementsByClass('navBucketLinkExpander'), jlyf.getElementsByClass('secondaryNavLink'));for(var i=0;i < nlinks.length;++i)if(nlinks[i])jlyf.NavBLDR.addRolloverEffect(nlinks[i]);var subLinks=jlyf.getElementsByClass('secondaryNavLink');for(var i=0; i < subLinks.length; ++i)subLinks[i].style.display='block';var hbtns=jlyf.getElementsByClass('navBucketHeaderExpander');var nlinks=jlyf.getElementsByClass('navBucketContent');for(var i=0; i < nlinks.length; ++i){if(!jlyf.Effect.addEffect(nlinks[i],'ACCORDION_POSY',nlinks[i].id+'_acc',1,jlyf.DHTML.getObjectHeight(nlinks[i]),'MAX') || !jlyf.Effect.addEffect(nlinks[i],'ALPHA',nlinks[i].id+'_alpha',0,100,50,250))return jlyf.triggerError('JLYFGLOBAL.loadFunc:failed to add the effect to the link',jlyf.ETRIGGER);if(!jlyf.Effect.createAction(nlinks[i],nlinks[i].id+'_close',[jlyf.Effect.createActionObject(nlinks[i],nlinks[i].id+'_acc','MIN'),jlyf.Effect.createActionObject(nlinks[i],nlinks[i].id+'_alpha','MIN')]))return jlyf.triggerError('JLYFGLOBAL.loadFunc:failed to create an effect Action',jlyf.ETRIGGER);if(!jlyf.Effect.createAction(nlinks[i],nlinks[i].id+'_open',[jlyf.Effect.createActionObject(nlinks[i],nlinks[i].id+'_acc','MAX'),jlyf.Effect.createActionObject(nlinks[i],nlinks[i].id+'_alpha','MAX')]))return jlyf.triggerError('JLYFGLOBAL.loadFunc:failed to create an effect Action',jlyf.ETRIGGER);jlyf.Event.addEvent(hbtns[i],'onclick',jlyf.NavBLDR.toggleNav,[nlinks[i].id],true);}var subExp=jlyf.getElementsByClass('navLinkSubExpansion','mbLeftCol','div');for(var i=0; i < subExp.length;++i){var sexp=subExp[i];var pfx=subExp[i].id.match(/[^_]+/);var idNum=subExp[i].id.match(/[0-9]+$/);if(!jlyf.Effect.addEffect(sexp.id,'ACCORDION_POSY',sexp.id+'_acc',17,jlyf.DHTML.getObjectHeight(sexp),'min',jlyf.$(pfx+'_navContent'),pfx+'_navContent_acc'))return jlyf.triggerError('jlyf.NAVBLDR.init:failed to add an effect for:'+sexp.id,jlyf.ETRIGGER);if(!jlyf.Effect.createAction(sexp.id,sexp.id+'_close',[jlyf.Effect.createActionObject(sexp.id,sexp.id+'_acc','MIN')]))return jlyf.triggerError('jlyf.NAVBLDR.init:failed to create an effect Action',jlyf.ETRIGGER);if(!jlyf.Effect.createAction(sexp.id,sexp.id+'_open',[jlyf.Effect.createActionObject(sexp.id,sexp.id+'_acc','MAX')]))return jlyf.triggerError('jlyf.NAVBLDR.init:failed to create an effect Action',jlyf.ETRIGGER);if(!jlyf.Effect.createAction(sexp.id,sexp.id+'_shut',[jlyf.Effect.createActionObject(sexp.id,sexp.id+'_acc','MIN')]))return jlyf.triggerError('jlyf.NAVBLDR.init:failed to create an effect Action',jlyf.ETRIGGER);if(!jlyf.Effect.createAction(sexp.id,sexp.id+'_reopen',[jlyf.Effect.createActionObject(sexp.id,sexp.id+'_acc','MAX')]))return jlyf.triggerError('jlyf.NAVBLDR.init:failed to create an effect Action',jlyf.ETRIGGER);jlyf.Event.addEvent(pfx+'_linke'+idNum,'onclick',jlyf.NavBLDR.toggleNav,sexp.id,true);} /*jlyf.NavBLDR.handlePrevState();*/
										/*var cookie = jlyf.getCookie('slhmpgtst');
										if(cookie == 'closednav2'){
											jlyf.NavBLDR.toggleNav({target : jlyf.$('comm_hexp')}, 'comm_navContent');
											jlyf.NavBLDR.toggleNav({target : jlyf.$('win_hexp')}, 'win_navContent');
											jlyf.NavBLDR.toggleNav({target : jlyf.$('fun_hexp')}, 'fun_navContent');
										}*/
										this.isInit = true; return true;
									},
	addRolloverEffect	:function(obj){var bk=jlyf.getElementStyle(obj,'backgroundColor','background-color');var fnt=jlyf.getElementStyle(obj,'color','color');var pref=obj.id.match(/^([a-z]+)_/);pref=pref[1];if(!pref)return jlyf.triggerError('jlyf.loadFunc:No id prefix found for navlink',jlyf.ETRIGGER);var bkTo=jlyf.NavBLDR.getBGColor(pref);if(!jlyf.Effect.addEffect(obj, 'COLORTRANS', obj.id + '_ctbk', bk, bkTo, 200, 250, 'backgroundColor', 'background-color','min') || !jlyf.Effect.addEffect(obj, 'COLORTRANS', obj.id + '_ctfnt',fnt,'#ffffff',200,250,'color','color','min'))return jlyf.triggerError('JLYFGLOBAL.loadFunc:failed to add the effect to the link',jlyf.ETRIGGER);if(!jlyf.Effect.createAction(obj,obj.id+'_fade_light',[jlyf.Effect.createActionObject(obj,obj.id+'_ctbk','MAX'),jlyf.Effect.createActionObject(obj,obj.id+'_ctfnt','MAX')]))return jlyf.triggerError('JLYFGLOBAL.loadFunc:failed to create an effect Action',jlyf.ETRIGGER);if(!jlyf.Effect.createAction(obj,obj.id+'_fade_dark',[jlyf.Effect.createActionObject(obj,obj.id+'_ctbk','MIN'), jlyf.Effect.createActionObject(obj,obj.id+'_ctfnt','MIN')]))return jlyf.triggerError('JLYFGLOBAL.loadFunc:failed to create an effect Action',jlyf.ETRIGGER);jlyf.Event.addEvent(obj,'onmouseover', jlyf.Effect.runAction, [obj.id, obj.id + '_fade_light']);jlyf.Event.addEvent(obj,'onmouseout', jlyf.Effect.runAction, [obj.id, obj.id + '_fade_dark']);return true;},
	getBGColor				:function(pref){switch(pref.toLowerCase()){case 'games':return '#336699';case 'fun':return '#ff6666';case 'win':return '#669900';case 'comm':return '#9966cc';default:return jlyf.triggerError('JLYFGLOBAL.loadFunc:invalid id prefix for navlink',jlyf.ETRIGGER);}return false;},
	toggleNav					:function(evt, objId){var targ=jlyf.Event.getEventTarget(evt);var cstr=targ.innerHTML;if(cstr=='+'){targ.innerHTML='&ndash;';jlyf.Effect.runAction(objId, objId + '_open');var open=jlyf.NavBLDR.openLinkExp;if(open && open.targ && open.objId && !objId.match('navContent')){open.targ.innerHTML='+';jlyf.Effect.runAction(open.objId, open.objId + '_shut');}if(!objId.match('navContent'))jlyf.NavBLDR.openLinkExp={objId:objId,targ:targ};else delete jlyf.NavBLDR.closedHeaders[objId];}else{targ.innerHTML='+';jlyf.Effect.runAction(objId, objId + '_close');if(!objId.match('navContent'))jlyf.NavBLDR.openLinkExp=null;else jlyf.NavBLDR.closedHeaders[objId]=targ;}/*jlyf.NavBLDR.setNavCookie();*/},
	setNavCookie			:function(){var val = '';if(jlyf.NavBLDR.openLinkExp && jlyf.NavBLDR.openLinkExp.objId && jlyf.NavBLDR.openLinkExp.targ && jlyf.NavBLDR.openLinkExp.targ.id)val+='objId='+jlyf.NavBLDR.openLinkExp.objId+'&targId='+jlyf.NavBLDR.openLinkExp.targ.id;var ch = jlyf.NavBLDR.closedHeaders;if(ch && (ch.length > 0)){var closed = '';for(c in ch){if(closed.length > 0) closed += ',';closed += c+':'+ch[c].id;}if(val.length > 0) val+='&';val+='closed='+closed;}jlyf.setCookie(jlyf.NavBLDR.cookieName, val);},
	handlePrevState		:function(){var cval=jlyf.getCookie(jlyf.NavBLDR.cookieName);if(cval){var vals=cval.split('&');if(vals.length){var item=[];for(v in vals){var i=vals[v].split('=');if(i.length){if(i[0] == 'closed'){var cn = item.closed.split(',');if(cn && cn.length > 0){for(c in cn){var inf = cn[c].split(':');if(inf[0] && inf[1]){jlyf.$(inf[0]).innerHTML='+';jlyf.Effect.runAction(inf[1], inf[1] + '_close');jlyf.NavBLDR.closedHeaders[inf[0]] = inf[1];}}}} else item[i[0]]=i[1];}}if(item.objId && item.targId){jlyf.$(item.targId).innerHTML='&ndash;';jlyf.Effect.runAction(item.objId, item.objId + '_reopen');jlyf.NavBLDR.openLinkExp={objId	:item.objId,targ:item.targId};}}}}
};
jlyf.ToolTip={
	TIPCLASS:'toolTipAnchor',TIPTXT_ATTR:'tipText',
	currOpen:null,
	init					:function(){var parentTipNodes=jlyf.getElementsByClass(jlyf.ToolTip.TIPCLASS);if(parentTipNodes.length > 0)for(var i=0; i < parentTipNodes.length; i++)jlyf.ToolTip.checkForTip(parentTipNodes[i]);},
	checkForTip		:function(node){var parentObj=jlyf.$(node);if(!parentObj)return false;var tipText=parentObj.getAttribute(jlyf.ToolTip.TIPTXT_ATTR);if(tipText=='')return false;else jlyf.ToolTip.createTipNode(parentObj, tipText);return true;},
	createTipNode	:function(parentNode, tipText){if(!jlyf.$(parentNode))return false;var tipNode=document.createElement('div');tipNode.className='toolTip';tipNode.name=tipNode.id=jlyf.ToolTip.getRandId();tipNode.style.display='none';tipNode.style.position='absolute';tipNode.style.top=0;tipNode.style.left=0;tipNode.innerHTML=tipText;jlyf.$(document.getElementsByTagName('body')[0]).appendChild(tipNode);jlyf.ToolTip.initToolTip(jlyf.$(parentNode), tipNode);return true;},
	initToolTip		:function(parentNode, tipNode){if(!jlyf.$(parentNode))return jlyf.triggerError('ToolTip::constructor:invalid node passed as argument', jlyf.ETRIGGER);if(!jlyf.$(tipNode))return jlyf.triggerError('ToolTip::constructor:invalid node passed as argument', jlyf.ETRIGGER);try{if(!jlyf.Effect.addEffect(jlyf.$(tipNode), 'ALPHA', jlyf.$(tipNode).id + '_alphaFade', 0, 90, 100, 150))return jlyf.triggerError('JLYFGLOBAL.loadFunc:failed to add the accordion and alpha properties to the bucket', jlyf.ETRIGGER);var minAction=jlyf.Effect.genUniqueActionName(jlyf.$(tipNode), 'minimize');var maxAction=jlyf.Effect.genUniqueActionName(jlyf.$(tipNode), 'maximize');if(!jlyf.Effect.createAction(tipNode, minAction, jlyf.Effect.createActionObject(jlyf.$(tipNode), jlyf.$(tipNode).id + '_alphaFade', 'TO_MIN')) || !jlyf.Effect.createAction(tipNode, maxAction, jlyf.Effect.createActionObject(jlyf.$(tipNode), jlyf.$(tipNode).id + '_alphaFade', 'TO_MAX')))return jlyf.triggerError('window.initNavBucket:unable to create the Effect Action for the new Bucket', jlyf.ETRIGGER);}catch(e){return jlyf.triggerError('window.initNavBucket:error reported:' + e.message, jlyf.ETRIGGER);}jlyf.Effect.runAction(jlyf.$(tipNode), 'minimize');if(!jlyf.Event.addEvent(jlyf.$(parentNode),'onmouseover',jlyf.ToolTip.displayTip,jlyf.$(tipNode).id,true))return jlyf.triggerError('ToolTip::displayTip:Cannot add move tip event.', jlyf.ETRIGGER);if(!jlyf.Event.addEvent(jlyf.$(parentNode),'onmouseout',jlyf.ToolTip.hideTip,jlyf.$(tipNode).id,true))return jlyf.triggerError('ToolTip::displayTip:Cannot add move tip event.', jlyf.ETRIGGER);},
	displayTip		:function(evt, tipNode){tipObj=jlyf.$(tipNode);if(!tipObj)return false;if(jlyf.ToolTip.currOpen && jlyf.$(jlyf.ToolTip.currOpen))jlyf.$(jlyf.ToolTip.currOpen).style.display='none';jlyf.ToolTip.currOpen=tipNode;parentNode=jlyf.Event.getEventTarget(evt);parentObj=jlyf.$(parentNode);if(!jlyf.Event.addEvent(parentObj,'onmousemove',jlyf.ToolTip.moveTip,tipObj.id,true))return jlyf.triggerError('ToolTip::displayTip:Cannot add move tip event.', jlyf.ETRIGGER);},
	moveTip				:function(evt, tipNode){var tipObj=jlyf.$(tipNode);if(!tipObj)return false;var coords=jlyf.Event.getPageEventCoords(evt);var xPos=coords.x + 20;var yPos=coords.y - 20;jlyf.DHTML.moveTo(tipObj, xPos, yPos);tipObj.style.display='block';jlyf.Effect.runAction(tipObj, 'maximize');var tw=jlyf.DHTML.getObjectWidth(tipNode);if(tw){var bsize=jlyf.DHTML.getBrowserSize();var sl=document.documentElement.scrollLeft;var dx=xPos - sl;if(bsize.width && bsize.width <(dx + tw)){dx-=tw - sl + 40;jlyf.DHTML.moveTo(tipObj, dx, yPos);}}return true;},
	hideTip 			:function(evt, tipNode){var tipObj = jlyf.$(tipNode);if(!tipObj)return false;jlyf.Effect.runAction(tipObj, 'minimize');var parentObj = jlyf.Event.getEventTarget(evt);parentObj.onmousemove = null;tipObj.style.display = 'none';return true;},
	getRandId			:function(){return 'tip_' + Math.ceil(10000*Math.random());}
};
jlyf.RIDChecker={
	ridCookie:'slrid',numDays:30,init : function(){var args = jlyf.getParsedQueryString();if(args && args.rid) jlyf.RIDChecker.setCookie(args.rid);},setCookie : function(rid){jlyf.setCookie(jlyf.RIDChecker.ridCookie, rid, jlyf.RIDChecker.numDays);}
};
JLYFGLOBAL.addLoadFunc(function(){jlyf.NavBLDR.init();jlyf.DHTML.init();jlyf.ToolTip.init();jlyf.RIDChecker.init();});
jlyf.stopLoad=function(){jlyf.triggerError('Stopped Page Load', jlyf.EWARN);if(document.all)document.execCommand('Stop');	else window.stop();};