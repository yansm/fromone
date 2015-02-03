/* 获取url参数 */
$.extend({
  getUrlVars: function(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },
  getUrlVar: function(name){
    return $.getUrlVars()[name];
  },
  setUrlWidthVars: function (vars) {
	var parms = [];
	for( key in vars){
		parms.push(key + '='  + vars[key] + '&');
	}
	parms = location.href.split("?")[0] + '?' + parms.join('');
	parms = parms.substring(0,  parms.length-1);
	return parms
  }
});
/* 初始化的一些项 */
$(function () {
	var $body = $('body'),
			$fullScreen = $('.full-screen');
	var DEFAULT_STATE = {
		level: 0,
		type: 'normal',
		model: 'index'
	};
	var MODELS = ['essay','css','index'];
	/* fullScreen 翻转 */
	var trunShow = function (model) {
		$fullScreen.removeClass(MODELS.join(' ')).addClass(model).show();
		setTimeout(function() {$fullScreen.addClass('current');},100)
	}
	var trunHide = function () {
		$fullScreen.removeClass('current');
		setTimeout(function() {$fullScreen.hide();},1370)
	}
	
	/* 按钮点击 */
	$(document).on('click','[click-target="change-btn"]',function () {
		var $this = $(this),data = $this.data(); 
		setPageState(data);
	});
	/* 设置页面 */ 
	var setPageState = function (data) {
		var url = $.setUrlWidthVars(data);
		history.pushState(data,'',url);
		buildPage(data);
	}
	/* 绑定popstate 事件 */
	window.addEventListener("popstate", function(e) {
        buildPage(e.state);
    }); 
	
	/* 路径错误引导机制 */  
	var errorManage = function () {
	 
	}
	
	/* 来一发略复杂的建立页面的大事件！！！！ */
	var buildPage = function (data) {
		var l_state = $body.data(), n_state = data;
		if(!(l_state && l_state.level && l_state.type && l_state.model)) l_state = DEFAULT_STATE;
		if(!(n_state && n_state.level && n_state.type && n_state.model)) n_state = DEFAULT_STATE;
		var l_level = l_state.level,n_level = n_state.level;
		//show animate 
		if(l_level == n_level && l_state.model == n_state.model) return;
		var le = $.Event('hide.' + l_state.type + '.' + l_state.model + '.level_' + l_level,{l_state: l_state, n_state : n_state});
		console.debug('hide.' + l_state.type + '.' + l_state.model + '.level_' + l_level);
		$body.trigger(le);
	} 
	
	/* 各种动画效果 */ 
	var showLevel_1 = function (l_state,n_state,delay) {
		var type = n_state.type,model = n_state.model,delay = delay + 100;
		$('.'+ type +'-screen').show().load(model + '.html',function (response,status,xhr) {
			if(status == 'error') {errorManage(); return;} 
			var $this = $(this);
			if(type=='bottom') {
				delay += 1370;
				trunHide();
			}
			setTimeout(function() {
				$this.find('.'+ model +'-area').addClass('current'); 
				$body.data(n_state); 
			},delay);
		});  
	}
	
	var hideLevel_1 = function (l_state,n_state,delay) {
		var type = l_state.type,model = l_state.model, delay = delay;
		$body.find('.'+ model +'-area').removeClass('current');
		if(!$fullScreen.hasClass('current')){
			trunShow(n_state.model);
			delay += 1370;  
		};
		setTimeout(function () {
			var le = $.Event('show.' + n_state.type + '.' + n_state.model + '.level_' + n_state.level,{l_state: l_state,n_state : n_state});
			$('.'+ type +'-screen').hide();
			$body.trigger(le);
		},delay);
	}
	
	$body
	 .on('hide.normal.index.level_0',function (e) {
		var $this = $(this), delay = 0, state = e.n_state;
		if(!$fullScreen.hasClass('current')){
			trunShow(state.model);
			delay = 1370; 
		}; 
		setTimeout(function () {
			var le = $.Event('show.' + state.type + '.' + state.model + '.level_' + state.level,{l_state: e.l_state,n_state : e.n_state});
			$body.trigger(le);
		},delay);
	 })
	 .on('show.normal.index.level_0',function (e) {
		var $this = $(this), delay = 0, state = e.n_state;
		trunHide();
		$body.data(state); 
	 })
	//top essay    
	.on('show.top.essay.level_1',function (e) {
		var delay = 0;
		showLevel_1(e.l_state,e.n_state,delay);
	})
	.on('hide.top.essay.level_1',function (e) {
		var delay = 500;
		hideLevel_1(e.l_state,e.n_state,delay);
		
	})
	//top css
	.on('show.bottom.css.level_1',function (e) {
		var delay = 0;
		showLevel_1(e.l_state,e.n_state,delay);
	})
	.on('hide.bottom.css.level_1',function (e) {
		var delay = 0;
		hideLevel_1(e.l_state,e.n_state,delay);
	})
	/* 刷新时触发一次 */
	buildPage($.getUrlVars());
	
});


