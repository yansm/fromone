/* 用户信息 */
var USERSTATUS = {
	islogin: false
}
var APP_ID = 'cyrCA2YHb';
var APP_KEY = '5c81636378414a40b658c06b10d10f34';
var REDIRECT_URL = 'http://yansm.github.io/fromone/checkOAUTH.html';
var TOKEN = '';
var REACT_COMMENT = {};

/* 日期格式化 */
Date.prototype.format = function(format){ 
	var o = { 
		"M+" : this.getMonth()+1, //month 
		"d+" : this.getDate(), //day 
		"h+" : this.getHours(), //hour 
		"m+" : this.getMinutes(), //minute 
		"s+" : this.getSeconds(), //second 
		"q+" : Math.floor((this.getMonth()+3)/3), //quarter 
		"S" : this.getMilliseconds() //millisecond 
	} 

	if(/(y+)/.test(format)) { 
		format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
	} 

	for(var k in o) { 
		if(new RegExp("("+ k +")").test(format)) { 
			format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
		} 
	} 
	return format; 
} 

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
  //cookie操作
  cookie: function (prop, expires) {
	if(typeof(prop) === 'object' ){
		for(key in prop){
			var expireDate = new Date(); 
			expireDate.setTime(expireDate.getTime() + expires);
			document.cookie = escape(key) + '=' + escape(prop[key]) +';expires=' + expireDate.toGMTString();
		}
	}else{
		var str=document.cookie.split(";"), value = ''; 
		for(var i=0;i<str.length;i++){ 
			var str2=str[i].split("="); 
			if(str2[0]==prop) value = unescape(str2[1]); break;
		}
		return value;
	}
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
			
			parent.$.setToken(data);
		},
		erroe: function (data) {
			console.debug(data);
		}
	});
 },
 /*添加token  */
 setToken: function (data) {
	$.cookie({fromone_token: data.access_token}, data.expires_in);
	$.setUser();
	$.closeModal();
	var flag = 'theComment';
	if(REACT_COMMENT[flag] && REACT_COMMENT[flag].takeUser)
			REACT_COMMENT[flag].takeUser();
 },
 /* 获取用户信息 */
 setUser : function () {
	token = $.cookie('fromone_token');
	if(!token ) USERSTATUS = {islogin:false, data: {}};
	$.ajax({
		data: {
			access_token: token,
			client_id: APP_ID
		},
		sync:false,
		url: 'http://changyan.sohu.com/api/2/user/info',
		type: 'get',
		dataType: 'JSONP',
		success: function (data) {
			USERSTATUS = {
				islogin: true,
				data: data
			}
			console.debug('#')
			console.debug(USERSTATUS);
			return USERSTATUS;
		},
		error: function (data) {
			console.debug(data);
		}
	});
 },
 /* 打开modal框 */
 openModal : function (html) {
	$('.modal-area').eq(0).find('.modal-box').html(html).end().show(function(){
		$(this).addClass('current');
	});
 },
 /* 关闭modal框 */ 
 closeModal: function () {
	$('.modal-area').eq(0).find('.modal-box').html('').end().removeClass('current');
	setTimeout(function () {
		$('.modal-area').eq(0).hide();
	},500);
 },
  
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
		var data = $.extend({},{level:'1'},$(this).data());
		setPageState(data);
	})
	.on('click','[click-target="page-btn"]',function () {
		var data = $.extend({},{level:'2'},$(this).data());
		setPageState(data);
	})
	.on('click','.modal-area',function (e) {
		$.closeModal();
	})
	.on('click','.modal-box',function(e){
		e.stopPropagation();
	});
	
	/* 设置页面 */ 
	var setPageState = function (data,flag) {
		if(!(data && data.level && data.model)) data = DEFAULT_STATE;
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
		if(!(l_state && l_state.level  && l_state.model)) l_state = DEFAULT_STATE;
		if(!(n_state && n_state.level  && n_state.model)) n_state = DEFAULT_STATE;
		var l_level = l_state.level,n_level = n_state.level;
		//show animate 
		if(l_level == n_level && l_state.model == n_state.model) return;
		var flag = 'hide';
		l_state['type'] = n_state['type'] = 'bottom';
		if(l_level > n_level) { 
			flag = 'down';
			l_state['type'] = 'page';
		}else if(l_level < n_level) {
			flag = 'up';
			n_state['type'] = 'page';
		}
		var le = $.Event(flag+'.'  + l_state.model ,{l_state: l_state, n_state : n_state});
		console.debug(flag+'.'  + l_state.model );
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
				var le = $.Event('done.'+ model);
				$body.data(n_state).trigger(le);
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
			var le = $.Event('show.' + n_state.model ,{l_state: l_state,n_state : n_state});
			console.debug('show.' + n_state.model);
			$('#'+ type).hide();
			$body.trigger(le);  
		},delay);   
	}
	
	var upLevel_1 = function (l_state, n_state, delay) {
		var model = l_state.model,delay = delay, n_model = n_state.model,n_type = n_state.type,n_url = n_state.url;
		$('.' + model + '-area').addClass('page-current');
		if($('#'+n_type).length == 0) $body.append('<div id='+ n_type +' style="display:block;"></div>');
		
		setTimeout(function () {
		
			$('#' + n_type).show().addClass('page-' + n_model).load($.setUrlWidthVars(n_state, PATH) + ' .'+ n_model +'-area', function (response,status,xhr) {
				console.debug(status);  
				if(status == 'error') {errorManage(); return;} 
				var $this = $(this);
				setTimeout(function () {
					$this.find('.' + n_model + '-area').addClass('current');
					$body.data(n_state); 
				}, 100);
				var le = $.Event('done.'+ n_model);
				$body.trigger(le);
			});
		},delay);
	}
	
	var downLevel_2 = function (l_state, n_state, delay) {
		var model = l_state.model,type = l_state.type,delay = delay, n_model = n_state.model,n_type = n_state.type,n_url = n_state.url;
		
		$('#'+ type).find('.'+ model + '-area').removeClass('current').end().delay(1000).hide(0);
		
		if($('#'+n_type).length == 0) $body.append('<div id='+ n_type +' style="display:block;"></div>');
		
		setTimeout(function () {
			if($('#' + n_type).find(' .'+ n_model +'-area').length > 0) { 
				$('#' + n_type).find(' .'+ n_model +'-area').removeClass('page-current');
			}else{
				$('#' + n_type).addClass(n_model).load($.setUrlWidthVars(n_state, PATH) + ' .'+ n_model +'-area', function (response,status,xhr) {
					if(status == 'error') {errorManage(); return;} 
					
					var $this = $(this);
					$this.find('.'+ n_model +'-area').addClass('current'); 
					var le = $.Event('done.'+ n_model);
					$body.data(n_state).trigger(le);
				});
			}
			$body.data(n_state); 
		},delay);
		
	}
	
	/* list构建 */
	var getList = function (model) {
		var list = _.filter(post_map,function (n) {
			if(n.catgory){
				return n.catgory.match('essay');
			}
			return false;
		});
		return list;
	}
	var buildList = {};
	buildList['essay'] = function () {
		var list = getList('essay'),html = [];
		for(var length = list.length,i = length -1; i >= 0; i --) {
			var node = list[i],date = node.time.split('-');
			html.push('<div class="article-box"><hgroup><h3 class="article-title">');
			html.push(node.title);
			html.push('</h3><aside><span class="article-time"><i class="year">');
			html.push(date[0]);
			html.push('</i><i class="month">');
			html.push(date[1]);
			html.push('</i><i class="day">');
			html.push(date[2]);
			html.push('</i></span><span class="article-author">');
			html.push(node.author);
			html.push('</span></aside></hgroup><div class="article-intro">');
			html.push(node.intro);
			html.push('</div><div class="article-more" click-target="page-btn" data-model="essay-page"  data-url="'+ node.dest +'">read more</div></div>');
		}
		$('.essay-list').append(html.join(''));
	}
	
	$body
	//index
	 .on('show.index',function (e) {
		var delay = 0;
		showLevel_1(e.l_state,e.n_state,delay);
	 })
	 .on('hide.index',function (e) {
		var delay = 0;
		hideLevel_1(e.l_state,e.n_state,delay);
	 })
	 .on('up.index',function (e) {
		var delay = 0;
		upLevel_1(e.l_state,e.n_state,delay);
	 })
	 .on('down.index-page', function (e) {
		var delay = 0;
		downLevel_2(e.l_state,e.n_state,delay);
	 })
	 .on('done.index-page',function (e) {
		REACT_COMMENT['theComment'] =React.render(
			React.createElement(LeaveWordComment, {}),
			$('.index-page-container')[0]
		);
	 })
	// essay    
	.on('show.essay',function (e) {
		var delay = 0, n_state = e.n_state;
		n_state['type'] = 'top';
		showLevel_1(e.l_state,n_state,delay);
	})
	.on('hide.essay',function (e) {
		var delay = 500, l_state = e.l_state;
		l_state['type'] = 'top';
		hideLevel_1(l_state,e.n_state,delay);
	})
	.on('up.essay', function (e) {
		var delay = 0;
		upLevel_1(e.l_state,e.n_state,delay);
	})
	 .on('down.essay-page', function (e) {
		var delay = 0,n_state = e.n_state;
		n_state['type'] = 'top';
		downLevel_2(e.l_state,n_state,delay);
	 })
	.on('done.essay', function (e) {
		buildList['essay']();
		$('.essay-area').jScrollPane();
	})
	.on('done.essay-page',function (e) {
		trunShow('essay');
	})
	// css
	.on('show.css',function (e) {
		var delay = 0;
		showLevel_1(e.l_state,e.n_state,delay);
	})
	.on('hide.css',function (e) {
		var delay = 0; 
		hideLevel_1(e.l_state,e.n_state,delay);
	})
	//phrase
	.on('show.phrase',function (e) {
		var delay = 0;
		showLevel_1(e.l_state,e.n_state,delay);
	})
	.on('hide.phrase',function (e) {
		var delay = 0;
		hideLevel_1(e.l_state,e.n_state,delay);
	})
	//about
	.on('show.about',function (e) {
		var delay = 0;
		showLevel_1(e.l_state,e.n_state,delay);
	})
	.on('hide.about',function (e) {
		var delay = 0;
		hideLevel_1(e.l_state,e.n_state,delay); 
	})
	
	/* 刷新时触发一次 */ 
	//buildPage($.getUrlVars());
	//调整模块
	var bodyData = $body.data();
	$('.' + bodyData.model + '-area').addClass('current');
	var le = $.Event('done.'+ bodyData.model);
	$body.trigger(le);
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


