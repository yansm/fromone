/** @jsx React.DOM */

var LeaveWordNode = React.createClass({displayName: "LeaveWordNode",
	render: function () {
		var index = this.props.index,node = this.props.node,
			className = 'leave-word-label leave-word-label-' + index;
		return (
			React.createElement("div", {className: className}, 
				React.createElement("div", {className: "leave-word-needle"}), 
				React.createElement("h4", null, node.author), 
				React.createElement("div", {className: "leave-word-content"}, 
					node.content
				), React.createElement("div", {className: "leave-word-time"}, node.time)
			)
		);
	}
});

var LeaveWordList = React.createClass({displayName: "LeaveWordList",
	render: function () {
		var rnd = this.props.rnd;
		var leaveWordNodes = this.props.data.map(function (node,i) {
			return (
				React.createElement(LeaveWordNode, {node: node, index: rnd[i % rnd.length]})
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

var data = [
		{ author : '依旧沉睡', content : '测试议一下哈~', time : '2014-08-23' },
		{ author : '依旧沉睡2', content : '测试议一下哈~', time : '2014-08-23' },
		{ author : '依旧沉睡2', content : '测试议一下哈~', time : '2014-08-23' },	
		{ author : '依旧沉睡', content : '测试议一下哈~', time : '2014-08-23' },
		{ author : '依旧沉睡', content : '测试议一下哈~', time : '2014-08-23' }
	];

var LeaveWordComment = React.createClass({displayName: "LeaveWordComment",
	getInitialState: function () {
		return {data: [], userstatus: {islogin:false}}; 
	}, 
	componentDidMount: function () {
		this.setState({data: data, userstatus: USERSTATUS});
	},
	onSubmitEvent: function (content) {
		var comments = this.state.data;
		var newComments = comments.concat([{ author : '依旧沉睡', content : content, time : '2014-08-23' }]);
		this.setState({data: newComments});
	},
	render: function () {
		return (
			React.createElement("div", {className: "leave-word-area fix"}, 
				React.createElement(LeaveWordTool, {userstatus: this.state.userstatus, onSubmitEvent: this.onSubmitEvent}), 
				React.createElement("div", {className: "container fix"}, 
					React.createElement(LeaveWordList, {data: this.state.data, rnd: this.props.rnd})
				)
			)
		);
	}
});

