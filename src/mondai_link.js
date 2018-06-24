module.exports = {
  template: '<a class="item" ng-href="/mondai/{{$ctrl.room()}}">問題を解く</a>',
  controller: function(userService) {
    this.room = function() {
      return userService.getRoom();
    };
  }
};
