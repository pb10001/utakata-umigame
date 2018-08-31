var editComponent = {
  templateUrl: 'edit_mondai.html',
  bindings: {},
  controller: function(socket, userService) {
    this.$onInit = function() {
      this.room = userService.getRoom();
      this.subject = '解説';
      this.content = userService.getCurrentContent();
    };
    this.send = function send() {
      if (window.confirm('正解が公開されます。続行しますか？')) {
        var data = {
          type: 'trueAns',
          content: this.content
        };
        socket.emit('trueAnsMessage', data);
      } else {
        window.alert('キャンセルしました。');
      }
    };
  }
};
module.exports = editComponent;
