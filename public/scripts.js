$(function() {
	dpd.on('newMessage', function (pictureId) {
		fetchSinglePicture(pictureId);
		console.log("Looking up picture: " + pictureId);
	});
	$("button").click(function() {
		var img = new Image();
		img.src = $('input').val();
		img.onload = function() {
			dpd.posts.post({url: img.src}, function () {
				$('input').val(null);
				fetchPictures();
			});
		};		
	});
	function fetchPictures() {
		dpd.posts.get(function (messages) {
			$('#picture-wall').empty();
			if(!messages) return;
			messages.reverse();
			for(var i = (messages.length - 1); i >= 0; i--) {
			  addPicture(messages[i].url);
			}
		});
	}
	fetchPictures();
	function fetchSinglePicture(pictureId) {
		dpd.posts.get({id: pictureId}, function(result, error) {
			addPicture(result.url, 'new-picture');
			$(".new-picture").fadeIn(500);
		});
	}
	function addPicture(url, classes) {
		$('#picture-wall').prepend('<div class="'+classes+'"><img src="' + url + '"></div>');
	}
});