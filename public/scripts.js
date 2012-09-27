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
		$('#picture-wall').prepend('<div class="'+classes+'"><img class="thumbs-up" src="thumbs-up.png"><img class="thumbnail" id="'+id+'" src="' + url + '"></div>');
		bindVoting();
	}
	function bindVoting() {
		$("img").unbind('click');
		$(".thumbs-up").click(function() {
			var pictureId = $(this).next().attr('id');
			if (localStorage['voted-'+pictureId]) return; //check for previous votes from this browser
				dpd.posts.put({id: pictureId}, function () {
					localStorage['voted-'+pictureId] = true; //record vote in the browsers local storage
				});
		});
	}
});