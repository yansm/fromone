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
	}
	/* fullScreen 翻转 */
	var trunShow = function () {
		$fullScreen.show();
		setTimeout(function() {$fullScreen.addClass('current');},100)
	}
	var trunHide = function () {
		$fullScreen.removeClass('current');
		setTimeout(function() {$fullScreen.hide();},1670)
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
		if(l_level < n_level) {
			var le = $.Event('show.' + n_state.type + '.' + n_state.model + '.level_' + (l_level+1),{state : n_state});
			$body.trigger(le);
		}else{
			if(l_level == n_level && l_level == 0) return;
			var le = $.Event('hide.' + l_state.type + '.' + l_state.model + '.level_' + l_level,{state : n_state});
			$body.trigger(le);
		}
	} 
	
	/* 各种动画效果 */ 
	$body
	//normal index 
	 
	//top essay    
	.on('show.top.essay.level_1',function (e) {
		var $this = $(this), delay = 0, state = e.state;
		if(state.model != 'essay' && state.level == 2) { errorManage(); return; }
		$body.stop();
		$this.removeClass().addClass('essay');
		if(!$fullScreen.hasClass('current')){
			trunShow();
			delay = 1670; 
		}
		setTimeout(function () {
			$('.top-screen').show().load('essay.html',function (response,status,xhr) {
				if(status == 'error') {errorManage(); return;} 
				var $this = $(this);
				setTimeout(function() {
					$this.find('.essay-area').addClass('current'); 
					$body.data(state); 
				},100);
				
			});  
		}, delay); 
	})
	.on('hide.top.essay.level_1',function(e) {
		var $this = $(this), delay = 0, state = e.state;			
		// 当要过渡到主页面时 
		if(state.level == 0){ 
			$('.top-screen .essay-area').removeClass('current'); 
			setTimeout(function () { 
				$('.top-screen').hide();  
				trunHide();
				$body.data(state); 
			},500);
		}
		//当要过渡到其他页面时
		else{
			
		}
	})
	
	/* 刷新时触发一次 */
	buildPage($.getUrlVars());
	
});


