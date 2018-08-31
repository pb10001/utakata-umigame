var editComponent = {
  templateUrl: 'edit_mondai.html',
  bindings: {},
  controller: function(socket, userService) {
    this.$onInit = function() {
      this.room = userService.getRoom();
      this.subject = '問題文';
      this.content = userService.getCurrentContent();
      this.callback = '/mondai/' + this.room;
    };
    this.send = function send() {
      if (window.confirm('問題文が変更されます。続行しますか？')) {
        var data = {
          type: 'mondai',
          removePass: userService.getRemovePass(),
          content: this.content,
          created_month: new Date().getMonth() + 1,
          created_date: new Date().getDate()
        };
        socket.emit('mondaiMessage', data);
      } else {
        window.alert('キャンセルしました。');
      }
    };
  }
};
module.exports = editComponent;
