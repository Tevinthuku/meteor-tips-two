Todos = new Mongo.Collection('todos');

// the list page
Lists = new Meteor.Collection('lists');


if(Meteor.isClient){
    // client code goes here
    
    // todos helper
Template.todos.helpers({
    'todo': function(){
        var currentList = this._id;
        return Todos.find({ listId: currentList, createdBy: currentUser }, {sort: {createdAt: -1}});
    }
});
// template addtodo events
Template.addTodo.events({
    
'submit form': function(event){
    event.preventDefault();
        var todoName = $('[name = "todoName"]').val();
        var currentList = this._id;
        var currentUser = Meteor.userId();
        Todos.insert({
            name: todoName,
            completed: false,
            createdAt: new Date(),
            createdBy: currentUser,
            listId: currentList
        });
        
        $('[name = "todoName"]').val('');
  }
});

// the todoitem event

Template.todoItem.events({
    // the delete of the todoitem
    'click .delete-todo': function(event){
        event.preventDefault();
        var documentId = this._id;
        if(confirm) {
            Todos.remove({ _id: documentId});
        }
        
    },
    // the keyup event
    
  'keyup [name=todoItem]': function(event){
      if(event.which == 13 || event.which == 27){
          $(event.target).blur();
      } 
      else {
                    var documentId = this._id;
                    var todoItem = $(event.target).val();
                    Todos.update({ _id: documentId}, {$set: { name: todoItem}});
    
      }

    },
    
    // the checkbox
    'change [type=checkbox]': function(){
        var documentId = this._id;
        var isCompleted = this.completed;
        if(isCompleted){
            Todos.update({ _id: documentId }, {$set: { completed: false}});
            console.log("Task marked as incomplete");
        } else {
            Todos.update({ _id: documentId}, {$set: { completed: true}});
            console.log("Task marked as completed");
        }
    }
});

// the template todo helper
Template.todoItem.helpers({
   'checked': function(){
       var isCompleted = this.completed;
       if(isCompleted){
           return "checked";
       } else {
           return "";
       }
   } 
});

// template for counting the todo tasks
Template.todosCount.helpers({
    'totalTodos': function(){
        var currentList = this._id;
        return Todos.find().count();
    },
    'completedTodos': function(){
        var currentList = this._id;
        return Todos.find({ completed: true }).count();
    }
});

// the addlist event
Template.addList.events({
    'submit form': function(event){
        event.preventDefault();
        var listName = $('[name = listName]').val();
        var currentUser = Meteor.userId();
        Lists.insert({
            name: listName,
            createdBy: currentUser
            
        }, 
        function(error, result){
            Router.go('listPage', { _id: result });
        });
        
        $('[name=listName]').val('');
    }
});
// the lists template
Template.lists.helpers({
    'list': function(){
        return Lists.find({}, {sort: {name: 1}});
    }
});

// the register events
Template.register.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Accounts.createUser({
            email: email,
            password: password
        }, function(error){
            if(error){
                console.log(error.reason);
            } else {
                Router.go("home");
            }
        });
       
    }
});

// the navigation events
Template.navigation.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('login');
    }
});

// the login events
Template.login.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Meteor.loginWithPassword(email, password, function(error){
            if(error){
                console.log(error.reason);
            } else {
                Router.go("home");
            }
        });
    }
});

}

if(Meteor.isServer){
    // server code goes here
}



Router.route('/register');

Router.route('/login');

// the home route

Router.route('/', {
    name: 'home',
    template: 'home'
});

// the layout template
Router.configure({
    layoutTemplate: 'main'
});

Router.route('/list/:_id', {
    name: 'listPage',
    template: 'listPage',
    data: function(){
       var currentList = this.params._id;
       var currentUser = Meteor.userId();
       return Lists.findOne({ _id: currentList, createdBy: currentUser });
    }
});
