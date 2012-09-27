$(function() {
	var currentUser;
	dpd.users.me(function(me) {
		if (!me) {
			$('#login-panel').fadeIn();
		} else {
			currentUser = me;
			showUserMenu();
			console.log('logged in');
		}
	});
	$('#register').click(function() {
		dpd.users.post({"username": $('#register-panel .username').val(), "password": $('#register-panel .password').val()}, function(user, err) {
			if(err) return console.log(err);
			currentUser = user;
			dpd.users.login({"username": $('#register-panel .username').val(), "password": $('#register-panel .password').val()}, function(user, err) {
				if(err) return console.log(err);
				console.log(user);
				$('#register-panel .username,#register-panel .password').val(null);
				$('#register-panel').fadeOut();
				showUserMenu();
			});
		});
	});
	$('#login').click(function() {
		dpd.users.login({"username": $('#login-panel .username').val(), "password": $('#login-panel .password').val()}, function(user, err) {
		  if(err) return console.log(err);
		  console.log(user);
		  $('#login-panel').fadeOut();
		});	
	});
	
	$('#user-menu #logout').click(function() {
		dpd.users.logout(function(err) {
			if(err) console.log(err);
			$('#login-panel').fadeIn();
			$('#user-menu').fadeOut();
		});	
	});

	function showUserMenu() {
		$('#user-menu #greeting').html("Welcome " + currentUser.username);
		$('#user-menu').fadeIn();
	}
});