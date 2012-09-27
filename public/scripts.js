$(function() {
	dpd.on('newMessage', function (pictureId) {
		fetchSinglePicture(pictureId);
		console.log("Looking up picture: " + pictureId);
	});
	$("button#post").click(function() {
		var img = new Image();
		img.src = $('#pictureUrl').val();
		img.onload = function() {
			dpd.posts.post({url: img.src}, function () {
				$('#pictureUrl').val(null);
				fetchPictures();
			});
		};
	});
	$('#show-register').click(function() {
		$('#login-panel').fadeOut();
		$('#register-panel').fadeIn();
	});
	function fetchPictures() {
		dpd.posts.get({$sort: {upVotes: 1}},function (messages) {
			$('#picture-wall').empty();
			if(!messages) return;
			messages.reverse();
			for(var i = (messages.length - 1); i >= 0; i--) {
			  addPicture(messages[i].id, messages[i].url);
			}
		});
	}
	fetchPictures();
	function fetchSinglePicture(pictureId) {
		dpd.posts.get({id: pictureId}, function(result, error) {
			addPicture(pictureId, result.url, 'new-picture');
			$(".new-picture").fadeIn(500);
		});
	}
	function addPicture(id, url, classes) {
		$('#picture-wall').prepend('<div id="'+id+'" class="picture-container '+classes+'"><img class="thumbs-up" src="thumbs-up.png"><img class="thumbnail" src="' + url + '"></div>');
		if (localStorage['voted-'+id])
			$("#" + id + " .thumbs-up").addClass("rotate");
		bindVoting();
	}
	function bindVoting() {
		$("img").unbind('click');
		$(".thumbs-up").click(function() {
			var pictureId = $(this).parent().attr('id');
			if (localStorage['voted-'+pictureId]) return; //check for previous votes from this browser 
			$(this).addClass("rotate");
			dpd.posts.put({id: pictureId}, function () {
				localStorage['voted-'+pictureId] = true; //record vote in the browsers local storage
			});
		});
	}
});