var GLOB_JLYF_CHKCNTR = 0;
var GLOB_JLYF_CHKMAX = 240;
var GLOB_JLYF_CHKOK = false;

function JLYF_chk4NS(){
	if(GLOB_JLYF_CHKOK) return true;

	if(typeof jlyf == 'undefined' || typeof JLYFGLOBAL == 'undefined'){
		jlyf.triggerError("pageinit : JLYF OR JLYFGLOBAL object not defined", jlyf.ETRIGGER);
		++GLOB_JLYF_CHKCNTR;
		return false;
	}

	GLOB_JLYF_CHKOK = true;

	jlyf.setCurrentStatus('WORKING', 'pageinit : Begin Processing plugins');

	if(typeof JLYFGLOBAL.reqPlugins != 'undefined'){
		if(!(JLYFGLOBAL.reqPlugins instanceof Array))
			jlyf.triggerError('pageinit : REQPLUGINS is not an array, please correct before trying to load plugins', jlyf.ETRIGGER);

		for(var i =0;i<JLYFGLOBAL.reqPlugins.length; ++i)
			jlyf.loadPlugin(JLYFGLOBAL.reqPlugins[i]);
	}

	jlyf.setCurrentStatus('OK', 'pageinit : All plugins have been loaded');

	jlyf.addLoadEvent(JLYFGLOBAL.init);
}

function JLYF_runNSchk(){
	if(!JLYF_chk4NS()){
		if(GLOB_JLYF_CHKCNTR <= GLOB_JLYF_CHKMAX){
			setTimeout('JLYF_runNSchk();', 500);
		}else{
			window.alert('ERROR: PAGE TIMED OUT WHILE TRYING TO LOAD THE JLYF NAMESPACE FILE.\nPLEASE REPORT THIS ERROR AND THE SURROUNDING CIRCUMSTANCES TO THE SUPPORT STAFF.');
		}
	}
}

JLYF_runNSchk();