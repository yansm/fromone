/** @jsx React.DOM */

var LeaveWordNode = React.createClass({displayName: "LeaveWordNode",
	render: function () {
		var node = this.props.node, index = (Number(node.create_time) )/1000%4 + 1,
			className = 'leave-word-label leave-word-label-' + index;
		var date = (new Date(node.create_time)).format('yyyy-MM-dd hh:mm');
		return (
			React.createElement("div", {className: className}, 
				React.createElement("div", {className: "leave-word-needle"}), 
				React.createElement("h4", null, node.passport.nickname), 
				React.createElement("div", {className: "leave-word-content"}, 
					node.content
				), React.createElement("div", {className: "leave-word-time"}, date)
			)
		);
	}
});

var LeaveWordList = React.createClass({displayName: "LeaveWordList",
	render: function () {
		
		var leaveWordNodes = this.props.data.map(function (node,i) {
			return (
				React.createElement(LeaveWordNode, {node: node})
			);
		});
		return (
			React.createElement("div", null, 
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
		if(this.props.userstatus.islogin){
			var content = this.refs.content.getDOMNode().value.trim();
			if(content.length == 0) return;
			this.props.onSubmitEvent(content);
			this.refs.content.getDOMNode().value = '';
		}else{
			$.openModal('<iframe src="https://changyan.sohu.com/api/oauth2/authorize?client_id=cyrCA2YHb&redirect_uri=http://yansm.github.io/fromone/checkOAUTH.html&response_type=code&platform_id=3"> ','theLWComment');
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
	render: function () {
		
		var className = this.props.userstatus.islogin ? 'login-box islogin' : 'login-box';
		return (
			React.createElement("div", {className: className}, 
				React.createElement("textarea", {placeholder: "留下你的印记", ref: "content", onChange: this.changeEvent}), 
				React.createElement("p", {className: "login-box-cont"}, "您还可以输入", React.createElement("span", {className: "login-box-num"}, this.state.cont), "个字"), 
				React.createElement("div", {className: "login-box-btn", onClick: this.handleSubmit})
			)
		);
	}
 });



var LeaveWordComment = React.createClass({displayName: "LeaveWordComment",
	getInitialState: function () {
		return {data: [], userstatus: {islogin:false}}; 
	}, 
	componentDidMount: function () {
		this.takeUser();
		this.getList();
	},
	getList: function () {
		$.ajax({
			type: 'post',
			data: {
				client_id: APP_ID,
				topic_url: location.href,
				page_size: 40
			},
			url: 'http://changyan.sohu.com/api/2/topic/load',
			dataType: 'JSONP',
			success: function (data) {
				this.setState({data: data.comments,topic_id: data.topic_id});
			}.bind(this),
			error: function (data) {
				console.debug(data);
			}.bind(this)
		});
	},
	takeUser: function () {
		this.setState({userstatus: USERSTATUS});
	},
	onSubmitEvent: function (content) {
		var data = {
				client_id: APP_ID,
				topic_id: this.state.topic_id,
				access_token: TOKEN,
				content: content
			}
			console.debug(data);
		$.ajax({
			type: 'post',
			data: data,
			url: 'http://changyan.sohu.com/api/2/comment/submit',
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
				React.createElement(LeaveWordTool, {userstatus: this.state.userstatus, onSubmitEvent: this.onSubmitEvent}), 
				React.createElement("div", {className: "container fix"}, 
					React.createElement(LeaveWordList, {data: this.state.data})
				)
			)
		);
	}
});

