$(function(){
	$('#postTweet').on('click', function(){
		var content = $('#content').val();
		if(!content){
			alert('tweet can\' be empty');
			return false;
		}
	});
});