/** @jsx React.DOM */
 
var LeaveWordNode = React.createClass({displayName: "LeaveWordNode", 
	render: function () {  
		var node = this.props.node, index = (Number(node.create_time) )/1000%4 + 1,
			className = 'leave-word-label leave-word-label-' + index;
		var date = (new Date(node.create_time)).format('yyyy-MM-dd hh:mm');
		return ( 
			React.createElement("div", {className: className}, 
				React.createElement("div", {className: "leave-word-box"}, 
					React.createElement("div", {className: "leave-word-needle"}), 
					React.createElement("h4", null, node.passport.nickname), 
					React.createElement("div", {className: "leave-word-content"}, 
						node.content
					), React.createElement("div", {className: "leave-word-time"}, date)
				), 
				React.createElement("div", {className: "leave-word-before"}), 
				React.createElement("div", {className: "leave-word-after"})
			)
		);
	}
});      

var LeaveWordList = React.createClass({displayName: "LeaveWordList",
	render: function () {
		  
		var leaveWordNodes = this.props.data.map(function (node,i)  { 
			return (     
				React.createElement(LeaveWordNode, {node: node})
			);
		}); 
		return (
			React.createElement("div", {className: "container fix"}, 
				leaveWordNodes
			)
		); 
	}
});

 var LeaveWordTool = React.createClass({displayName: "LeaveWordTool",
	getInitialState: function () {
		return {cont: 90};
	},
	handleSubmit: function () {
		if(this.props.userstatus){
			var content = this.refs.content.getDOMNode().value.trim();
			if(content.length == 0) return;
			this.props.onSubmitEvent(content);
			this.refs.content.getDOMNode().value = '';
		}
	},
	
	changeEvent: function () {
		var text = this.refs.content.getDOMNode().value.trim(), 
			cont = 90 - text.length;
		if(cont < 0) {  
			cont = 0;
			this.refs.content.getDOMNode().value = text.substr(0,90);
		}
		this.setState({cont: cont});
	},
	clickHandle: function (e) {
		$.openModal('<iframe src="'+ COMMENT_URL_LOGIN +'&platform_id='+ e +'"> ');
	}, 
	render: function () {
		var className = this.props.userstatus ? 'login-box islogin' : 'login-box',
			loginarea = this.props.userstatus? '': (
				React.createElement("div", {className: "login-box-area"}, 
					React.createElement("div", {className: "comment-login-icon comment-login-sohu", onClick: this.clickHandle.bind(this, '11')}), 
					React.createElement("div", {className: "comment-login-icon comment-login-QQ", onClick: this.clickHandle.bind(this, '3')}), 
					React.createElement("div", {className: "comment-login-icon comment-login-weibo", onClick: this.clickHandle.bind(this, '2')})
				)
			);
		return (
			React.createElement("div", {className: className}, 
				React.createElement("textarea", {placeholder: "留下你的印记", ref: "content", onChange: this.changeEvent}), 
				React.createElement("p", {className: "login-box-cont"}, "您还可以输入", React.createElement("span", {className: "login-box-num"}, this.state.cont), "个字"), 
				loginarea, 
				React.createElement("div", {className: "login-box-btn", onClick: this.handleSubmit})
			)
		);
	}
 });
  


var LeaveWordComment = React.createClass({displayName: "LeaveWordComment",
	getInitialState: function () {
		return {data: [], isLogin: false}; 
	}, 
	componentDidMount: function () {
		$.setUser();
		this.getList(); 
	},
	getList: function () {
		$.ajax({
			type: 'post',
			data: {	
				client_id: APP_ID,
				topic_url: location.href,
				page_size: 40,
				source_id: 'post/index/lebel'
			},
			url: COMMENT_URL_LIST,
			dataType: 'JSONP',
			success: function (data) {
				this.setState({data: data.comments,topic_id: data.topic_id});
			}.bind(this),
			error: function (data) {
				console.debug(data);
			}.bind(this)
		});
	},
	takeUser: function (token,data) {
		this.setState({isLogin: token? true: false});
	},
	onSubmitEvent: function (content) {
		var data = {
				client_id: APP_ID,
				topic_id: this.state.topic_id,
				access_token: $.cookie('fromone_token'),
				content: content
			}
		$.ajax({
			type: 'post',
			data: data,
			url: COMMENT_URL_ADD,
			dataType: 'JSONP',
			success: function (data) {
				this.getList();
			}.bind(this),
			error: function (data) {
				console.debug(data);
			}.bind(this)
		})
	},
	render: function () {
		return (
			React.createElement("div", {className: "leave-word-area fix"}, 
				React.createElement(LeaveWordTool, {userstatus: this.state.isLogin, onSubmitEvent: this.onSubmitEvent}), 
				React.createElement("div", {className: "scroll-pane"}, 
					React.createElement("div", {className: "leave-word-wall fix"}, 
						React.createElement(LeaveWordList, {data: this.state.data})
					)
				)
			)
		);
	}
});

/* 评论 */

var CommentTool = React.createClass({displayName: "CommentTool",
	onSubmitEvent: function () {
		var text = this.refs.content.getDOMNode().value.trim();
		if(text){
			this.props.onSubmitEvent(text,this.props.reId);
			this.refs.content.getDOMNode().value = '';
			if(this.props.onClickEvent ) this.props.onClickEvent();
		}
		
	},
	render: function () {
		return (
			React.createElement("div", {className: "comment-input-area"}, 
				React.createElement("div", {className: "comment-input-box"}, 
					React.createElement("textarea", {placeholder: "留下你的印记", ref: "content"}), 
					React.createElement("div", {className: "comment-input-tool fix"}, 
						React.createElement("div", {className: "comment-btn", onClick: this.onSubmitEvent}, "发布")
					)
				)
			)
		);
	}
});

var CommentLogin = React.createClass({displayName: "CommentLogin",
	clickHandle: function (e) {
		$.openModal('<iframe src="'+ COMMENT_URL_LOGIN +'&platform_id='+ e +'"> ');
	}, 
	render: function () {
		return (
			React.createElement("div", {className: "comment-login-area fix"}, 
				React.createElement("div", {className: "comment-login-item", onClick: this.clickHandle.bind(this,'11')}, 
					React.createElement("div", {className: "comment-login-icon comment-login-sohu"}), "搜狐登录"
				), 
				React.createElement("div", {className: "comment-login-item", onClick: this.clickHandle.bind(this,'3')}, 
					React.createElement("div", {className: "comment-login-icon comment-login-QQ"}), "QQ登录"
				), 
				React.createElement("div", {className: "comment-login-item", onClick: this.clickHandle.bind(this,'2')}, 
					React.createElement("div", {className: "comment-login-icon comment-login-weibo"}), "微博登录"
				)
			)
		);
	}
});

var CommentUser =React.createClass({displayName: "CommentUser",
	render: function () {
		var user = this.props.user;
		return (
			React.createElement("div", {className: "comment-head-area"}, 
				React.createElement("img", {src: user.img_url}), 
				React.createElement("div", {className: "comment-head-name ell"}, user.nickname)
			)
		);
	}
});

var CommentAdd = React.createClass({displayName: "CommentAdd",
	render: function () {
		var headItem,loginItem;
		if (this.props.isLogin) {
			var user = this.props.user;
			headItem = React.createElement(CommentUser, {user: user})
			loginItem = '';
		}else{
			headItem = (
				React.createElement("div", {className: "comment-head-area"}, 
					React.createElement("div", {className: "comment-default-head"})
				)
			);
			loginItem = React.createElement(CommentLogin, null);
		}
		return (
			React.createElement("div", {className: "comment-add fix"}, 
				headItem, 
				React.createElement(CommentTool, {onSubmitEvent: this.props.onSubmitEvent}), 
				loginItem
			)
		);
	}
});

var CommentNode = React.createClass({displayName: "CommentNode",
	getInitialState: function () {
		return {reFlag: false};
	},
	componentDidMount: function () {
		return {reFlag: false};
	},
	onClickEvent: function () {
		this.setState({ reFlag: !this.state.reFlag} );
	},
	render: function () {
		var node = this.props.node, reNode = '',reContent = '',
			time = (new Date(node.create_time)).format('yyyy-MM-dd hh:mm');
		if(this.state.reFlag) reNode= React.createElement(CommentTool, {reId: node.comment_id, onSubmitEvent: this.props.onSubmitEvent, onClickEvent: this.onClickEvent});
		if(node.comments.length > 0){
			var reCom = node.comments[0];
			reContent = React.createElement("div", {className: "comment-item-recomt"}, "回复", React.createElement("em", null, reCom.passport.nickname), ":")
		}
		return (
			React.createElement("div", {className: "comment-list-item"}, 
				React.createElement(CommentUser, {user: node.passport}), 
				React.createElement("div", {className: "comment-item-box"}, 
					React.createElement("div", {className: "comment-item-content"}, 
						React.createElement("div", {className: "comment-item-main"}, 
							reContent, 
							node.content
						), 
						React.createElement("div", {className: "comment-input-tool fix"}, 
							React.createElement("span", {className: "comment-input-info"}, time), 
							React.createElement("div", {className: "comment-btn", onClick: this.onClickEvent}, "回复")
						), 
						reNode
					)
				)
			)
		);
	} 
});

var CommentList = React.createClass({displayName: "CommentList",
	upPage: function () {
		this.props.getList(this.props.start - 1);
	},
	downPage: function () {
		this.props.getList(this.props.start + 1);
	},
	render: function () {
		var info = list = up = dp = '',data = this.props.data, onSubmitEvent = this.props.onSubmitEvent, comment = this.props.comment,start=this.props.start;
		if(data&&comment&& start){
			 var pageCount = comment.cmt_sum / 20;
			 if(start  > 1 ) up = React.createElement("div", {className: "comment-btn", onClick: this.upPage}, "上一页");
			 if(start  < pageCount ) dp = React.createElement("div", {className: "comment-btn", onClick: this.downPage}, "下一页");
			 info = React.createElement("span", {className: "comment-list-info"}, " ", React.createElement("em", null, data.participation_sum), "人参与", React.createElement("em", null, comment.cmt_sum), "条评论");
			 list =  comment.comments.map(function (node,i)  { 
				return (     
					React.createElement(CommentNode, {node: node, onSubmitEvent: onSubmitEvent})
				);
			}); 
		}
		return (
			React.createElement("div", {className: "comment-list"}, 
				React.createElement("div", {className: "comment-list-header"}, 
					"评论列表 ", info
				), 
				React.createElement("div", {className: "comment-list-main"}, 
					list
				), 
				React.createElement("div", {className: "comment-list-tool"}, 
					dp, up
				)
			)
		);
	}
});

var Comment = React.createClass({displayName: "Comment",
	getInitialState: function () {
		return {
			isLogin: false,
			user: {}
		};
	},
	getInfo: function () {
		$.ajax({
			type: 'post',
			data: {
				client_id: APP_ID,
				topic_url: location.href,
				source_id: this.props.source_id
			},
			url: COMMENT_URL_LIST,
			dataType: 'JSONP',
			success: function (data) {
				this.setState({data: data,topic_id: data.topic_id});
				this.getList();
			}.bind(this),
			error: function (data) {
				console.debug(data);
			}.bind(this)
		});
	},
	getList: function (start, length) {
		if(!start) start = 1;
		if(!length) length = 20;
		$.ajax({
			type: 'post',
			data: {
				client_id: APP_ID,
				topic_id: this.state.topic_id,
				page_size: length,
				page_no: start
			},
			url: COMMENT_URL_COMMENTS,
			dataType: 'JSONP',
			success: function (data) {
				this.setState({comment: data, start: start});
			}.bind(this),
			error: function (data) {
				console.debug(data);
			}.bind(this)
		});
	},
	takeUser: function (token,user) {
		//console.log(user);
		if(token) 
			this.setState({isLogin:true,user:user})
		else
			this.setState({isLogin:false,user:{}})
	},
	componentDidMount: function () {
		$.setUser();
		this.getInfo(); 
	},
	onSubmitEvent: function (content,reId) {
		var data = {
			client_id: APP_ID,
			topic_id: this.state.topic_id,
			access_token: $.cookie('fromone_token'),
			content: content
		}
		if(reId) data['reply_id'] = reId;
		$.ajax({
			type: 'post',
			data: data,
			url: COMMENT_URL_ADD,
			dataType: 'JSONP',
			success: function (data) {
				this.getInfo();
			}.bind(this),
			error: function (data) {
				console.debug(data);
			}.bind(this)
		})
	},
	render: function () {
		return (
			React.createElement("div", {className: "comment-area"}, 
				React.createElement(CommentAdd, {isLogin: this.state.isLogin, user: this.state.user, onSubmitEvent: this.onSubmitEvent}), 
				React.createElement(CommentList, {isLogin: this.state.isLogin, getList: this.getList, onSubmitEvent: this.onSubmitEvent, data: this.state.data, comment: this.state.comment, start: this.state.start})
			)
		);
	}
});

