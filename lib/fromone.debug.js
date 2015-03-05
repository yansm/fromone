/* 用户信息 */
var USERSTATUS = {
	name: '依旧沉睡',
	islogin: true
}
var APP_ID = 'cyrCA2YHb';
var APP_KEY = '5c81636378414a40b658c06b10d10f34';
var REDIRECT_URL = 'http://yansm.github.io/fromone/checkOAUTH.html';
var TOKEN = '';
$.extend({
  /* 获取url参数 */
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
  //获取url单个参数
  getUrlVar: function(name){
    return $.getUrlVars()[name];
  },
  //获取跟路径
  getRootPath: function(){
		var curWwwPath=window.document.location.href;
		var pathName=window.document.location.pathname;
		var pos=curWwwPath.indexOf(pathName);
		var localhostPaht=curWwwPath.substring(0,pos);
		var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
		return(localhostPaht+projectName);
		//return 'file:///C:/Users/yansanmu/Desktop/fromone_template/dist';
  },
  //获取url路径
  setUrlWidthVars: function (vars,path) {
	var url = path + '/' + vars.url + '.html';
	return url;
  },
  //图片预加载
  loadImg: function (arr,funLoading,funOnLoad,funOnError){
	var numLoaded=0,
	numError=0,
	isObject=Object.prototype.toString.call(arr)==="[object Object]" ? true : false;
 
	var arr=isObject ? arr.get() : arr;
	for(a in arr){
		var src=isObject ? $(arr[a]).attr("data-src") : arr[a];
		preload(src,arr[a]);
	}
 
	function preload(src,obj){
		var img=new Image();
		img.onload=function(){
			numLoaded++;
			funLoading && funLoading(numLoaded,arr.length,src,obj);
			funOnLoad && numLoaded==arr.length && funOnLoad(numError);
		};
		img.onerror=function(){
			numLoaded++;
			numError++;
			funOnError && funOnError(numLoaded,arr.length,src,obj);
		}
		img.src=src;
	}
  },
  /* 生成随机数组 */
  getRndNum : function (n) {
	var rnd = [];
	for(var i=0;i<n;i++)
		rnd.push(Math.floor(Math.random()*4 + 1));
	return rnd;
 },
 /* 获取token */
 getToken : function () {
	var code = $.getUrlVar('code');
	$.ajax({
		data: {
			code: code,
			client_id: APP_ID,
			client_secret: APP_KEY,
			grant_type: 'authorization_code',
			redirect_uri: REDIRECT_URL
		},
		url: 'https://changyan.sohu.com/api/oauth2/token',
		type: 'post',
		success: function (data) {
			var token  = data.access_token;
			$.getUser(token);
		},
		erroe: function (data) {
			console.debug(data);
		}
	});
 },
 /* 获取用户信息 */
 getUser : function (token) {
	$.ajax({
		data: {
			access_token: token,
			client_id: APP_ID
		},
		url: 'http://changyan.sohu.com/api/2/user/info',
		type: 'get',
		success: function (data) {
			console.debug(data);
		},
		error: function (data) {
			console.debug(data);
		}
	});
 }
});
/* 初始化的一些项 */
$(function () {
	var $body = $('body'),
			$fullScreen = $('.full-screen'),
			$loadArea = $('.loading-area');
	/* 默认state */
	var DEFAULT_STATE = {
		level: 1,
		type: 'bottom',
		model: 'index',
		url: 'index'
	};
	/* 存在的models */
	var MODELS = ['essay','css','index','phrase','about'];
	/* 跟路径 */
	var PATH = $.getRootPath();
	/* 预加载图片 */
	var URLPATHS = [
		PATH + '/' + 'images/index-background.jpg',
		PATH + '/' + 'images/phrase-background.jpg',
		PATH + '/' + 'images/about-background.jpg',
		PATH + '/' + 'images/css-background.jpg'
	]

	/* fullScreen 翻转 */
	var trunShow = function (model) {
		$body.removeClass().addClass(model);
		$fullScreen.show();
		setTimeout(function() {$fullScreen.addClass('current');},100)
	}
	var trunHide = function () {
		$fullScreen.removeClass('current');
		setTimeout(function() {$fullScreen.hide();},1370)
	}
	
	/* 按钮点击 */
	$(document)
	.on('click','[click-target="change-btn"]',function () {
		var $this = $(this),data = $this.data();  
		setPageState(data);
	})
	.on('click','[click-target="page-btn"]',function () {
		var data = $.extend({},{level:'2',type:'page'},$(this).data());
		setPageState(data);
	});
	/* 设置页面 */ 
	var setPageState = function (data,flag) {
		if(!(data && data.level && data.type && data.model)) data = DEFAULT_STATE;
		var url = $.setUrlWidthVars(data,PATH);
		
		if(flag) {history.replaceState(data,'',url); return;}
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
		var flag = 'hide';
		if(l_level > n_level) flag = 'down';
		else if(l_level < n_level) flag = 'up'
		var le = $.Event(flag+'.' + l_state.type + '.' + l_state.model + '.level_' + l_level,{l_state: l_state, n_state : n_state});
		console.debug(flag+'.' + l_state.type + '.' + l_state.model + '.level_' + l_level);
		$body.trigger(le);
	} 
	
	/* 各种动画效果 */ 
	var showLevel_1 = function (l_state,n_state,delay) {
		var type = n_state.type,model = n_state.model,delay = delay + 100;
		if($('#'+type).length == 0) $body.append('<div id='+ type +'></div>');
		$('#'+ type).show().load(model + '.html .'+ model +'-area',function (response,status,xhr) {
			if(status == 'error') {errorManage(); return;} 
			var $this = $(this);
			if(type=='bottom') {
				delay += 1500;
				trunHide(); 
			}
			setTimeout(function() {
				$this.find('.'+ model +'-area').addClass('current'); 
				if(buildModel[model]) buildModel[model]();
				$body.data(n_state); 
			},delay);
		});  
	}
	
	var hideLevel_1 = function (l_state,n_state,delay) {
		var type = l_state.type,model = l_state.model, delay = delay;
		if(!$fullScreen.hasClass('current')){
			trunShow(n_state.model);
			delay += 1500;  
		};
		$body.find('.'+ model +'-area').removeClass('current');
		setTimeout(function () {
			var le = $.Event('show.' + n_state.type + '.' + n_state.model + '.level_' + n_state.level,{l_state: l_state,n_state : n_state});
			console.debug('show.' + n_state.type + '.' + n_state.model + '.level_' + n_state.level)
			$('#'+ type).hide();
			$body.trigger(le);
		},delay);
	}
	
	var upLevel_1 = function (l_state, n_state, delay) {
		var model = l_state.model,delay = delay, n_model = n_state.model,n_type = n_state.type,n_url = n_state.url;
		$('.' + model + '-area').addClass('page-current');
		if($('#'+n_type).length == 0) $body.append('<div id='+ n_type +' style="display:block;"></div>');
		
		setTimeout(function () {
			console.debug(n_model);
			$('#' + n_type).addClass('page-' + n_model).load($.setUrlWidthVars(n_state, PATH) + ' .'+ n_model +'-area', function (response,status,xhr) {
				if(status == 'error') {errorManage(); return;} 
				var $this = $(this);
				setTimeout(function () {
					$this.find('.' + n_model + '-area').addClass('current');
					$body.data(n_state); 
				}, 100);
				var le = $.Event('upn.'+ n_model);
				$body.trigger(le);
			});
		},delay);
	}
	
	$body
	//index
	 .on('show.bottom.index.level_1',function (e) {
		var delay = 0;
		showLevel_1(e.l_state,e.n_state,delay);
	 })
	 .on('hide.bottom.index.level_1',function (e) {
		var delay = 0;
		hideLevel_1(e.l_state,e.n_state,delay);
	 })
	 .on('up.bottom.index.level_1',function (e) {
		var delay = 0;
		upLevel_1(e.l_state,e.n_state,delay);
	 })
	 .on('upn.index-page',function (e) {
		var theLWComment =React.render(
			React.createElement(LeaveWordComment, {rnd:$.getRndNum(16)}),
			$('.index-page-area')[0]
		);
	 })
	// essay    
	.on('show.top.essay.level_1',function (e) {
		var delay = 0;
		showLevel_1(e.l_state,e.n_state,delay);
	})
	.on('hide.top.essay.level_1',function (e) {
		var delay = 500;
		hideLevel_1(e.l_state,e.n_state,delay);
	})
	// css
	.on('show.bottom.css.level_1',function (e) {
		var delay = 0;
		showLevel_1(e.l_state,e.n_state,delay);
	})
	.on('hide.bottom.css.level_1',function (e) {
		var delay = 0;
		hideLevel_1(e.l_state,e.n_state,delay);
	})
	//phrase
	.on('show.bottom.phrase.level_1',function (e) {
		var delay = 0;
		showLevel_1(e.l_state,e.n_state,delay);
	})
	.on('hide.bottom.phrase.level_1',function (e) {
		var delay = 0;
		hideLevel_1(e.l_state,e.n_state,delay);
	})
	//about
	.on('show.bottom.about.level_1',function (e) {
		var delay = 0;
		showLevel_1(e.l_state,e.n_state,delay);
	})
	.on('hide.bottom.about.level_1',function (e) {
		var delay = 0;
		hideLevel_1(e.l_state,e.n_state,delay);
	})
	/* model建立事件 */
	var buildModel = {
		'essay' : function () {
			$('.essay-area').jScrollPane();
		}
	};
	/* 刷新时触发一次 */ 
	//buildPage($.getUrlVars());
	//调整模块
	var bodyData = $body.data();
	$('.' + bodyData.model + '-area').addClass('current');
	if(buildModel[bodyData.model]) buildModel[bodyData.model]();
	if(bodyData.type == 'top') trunShow(bodyData.model);
	//setPageState(bodyData,true);    //先屏蔽一下
	
	//背景图片预加载 
	$.loadImg(URLPATHS,$.noop,function (count) {
	},$.noop);
	window.onload = function () {
		$loadArea.addClass('current');
		setTimeout(function() {
			$loadArea.hide();
		}, 1000)
	}
});


