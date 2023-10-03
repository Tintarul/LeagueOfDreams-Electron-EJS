let PLAYER_NAME;

function loadPlayerName(name) {
	PLAYER_NAME = "Dummy player";
}

$(window).load(function () {
    $('.preloader').addClass('loaded');
});

jQuery( document ).ready( function ( $ ) {
	'use strict';

	// In miliseconds how long to wait before showing the screen.
	var LOAD_DELAY_TIME = 1000;

	// This batch of constants will fire after LOAD_DELAY_TIME, so
	// 0ms == 1000ms from .ready()
	var LOAD_DELAY_TIME_CHAMPIONS_PANEL_BLUE = 500;
	var LOAD_DELAY_TIME_CHAMPIONS_PANEL_RED = 500;
	var LOAD_DELAY_TIME_CHAMPIONS_GRID = 1000;

	/*
	|--------------------------------------------------------------------------
	| Developer mode
	|--------------------------------------------------------------------------
	|
	| Set to true - it will allow printing in the console. Alsways check for this
	| variables when running tests so you dont forget about certain console.logs.
	| Id needed for development testing this variable should be used.
	|
	*/
	var devMode = function() {
		return true;
	};

	/**
	 * Run alert only if devMode is on. This is only for testing purposes, if the
	 * alert is needed use the normal alert().
	 */
	var devAlert = function( string ) {
		if ( devMode() ) {
			alert( devMode() );
		}
	}

	// Disable console.log for production site.
	if ( ! devMode() ) {
		console.log = function() {}
	}


	/**
	 * Those will be events like clicking, dragging, scrolling or whatever
	 * that will change afer certain user interaction with the site. Default
	 * changes that are happening whitout the controll of the user should be
	 * in another object. Keep the WordPress coding guidelines for javascript.
	 */
	var siteScripts = (function () {

		/**
		 * Settings. Its ok to use jquery selectors in the functions and not
		 * set them here, but if they are used in more then one function and
		 * can be used as setting (like fixed element height) better to  set
		 * it here.
		 */
		var _s = {
			currentSeconds : parseInt( $('.team-red .seconds').text() ),
			endPlayerPick: false,
			lastSelectedChampion: ''
		};

		/**
		 * Fire all functions that will be used in the page. Having them all here
		 * will ease up finding what fires certain events.
		 */
		var events = function () {
			$('.champions-grid .champ-icon:not(.inactive)').click(selectChampion);
			// $('.tag').click(toggleTags);
			$('.select-field').click(selectFieldOpen);
			$('.select-field li').click(selectFieldUpdate);
			$('.chat-submit').click(chatSubmit);
			$('#client-window').draggable();
		};

		/**
		 * Start building visually the interface. The thing with this is
		 * that the viewer has to see how the client view comes to life.
		 */
		var init = function () {
			// load_delay_time
			setTimeout(function() {
				loadIcons('.champions-grid .champ-icon', 1000);
			}, LOAD_DELAY_TIME_CHAMPIONS_GRID);

			setTimeout(function() {
				loadIcons('.team-blue .champion-panel', 2000);
			}, LOAD_DELAY_TIME_CHAMPIONS_PANEL_BLUE);

			setTimeout(function() {
				loadIcons('.team-red .champion-panel', 2000);
			}, LOAD_DELAY_TIME_CHAMPIONS_PANEL_RED);

			var messages = [
				"Testing Message ------",
			];

			loadPick1();
			writeComments(messages);
			commentsForm();
		}

		//I am not proud, but it's working. This should be refactored.

		var loadPick1 = function(){
			loadTimer(15);
			botSelectChampion('hecarim', 1, 'red');
			setTimeout(loadPick2, 17000);
		}

		var loadPick2 = function(){
			loadTimer(15);
			$('.champion-panel.current-player').removeClass('current-player');
			botSelectChampion('jinx', 1, 'blue');
			setTimeout(loadPick3, 17000);
		}	

		var loadPick3 = function(){
			loadTimer(15);
			$('.champion-panel.current-player').removeClass('current-player');
			$('.team-red .team-champions .champion-panel:nth-child(2)').addClass('current-player');
			botSelectChampion('graves', 3, 'red');
			setTimeout(loadPick4, 17000);
		}	

		var loadPick4 = function(){
			if ( ! $('.team-red .team-champions .champion-panel:nth-child(2) .champ-icon').html() ){
				errorMessage("You have not picked a champion!");
				return;
			}
			loadTimer(15);
			$('.champion-panel.current-player').removeClass('current-player');
			botSelectChampion('jayce', 2, 'blue');
			botSelectChampion('diana', 3, 'blue');
			setTimeout(loadPick5, 17000);
		}

		var loadPick5 = function(){
			loadTimer(15);
			$('.champion-panel.current-player').removeClass('current-player');
			botSelectChampion('tryndamere', 4, 'red');
			setTimeout(loadPick6, 17000);
		}

		var loadPick6 = function(){
			loadTimer(15);
			$('.champion-panel.current-player').removeClass('current-player');
			botSelectChampion('morgana', 4, 'blue');
			setTimeout(loadPick7, 17000);
		}

		var loadPick7 = function(){
			loadTimer(15);
			$('.champion-panel.current-player').removeClass('current-player');
			botSelectChampion('malphite', 5, 'red');
			setTimeout(loadPick8, 17000);
		}

		var loadPick8 = function(){
			loadTimer(15);
			$('.champion-panel.current-player').removeClass('current-player');
			botSelectChampion('nidalee', 5, 'blue');
			$('.champion-panel.current-player').removeClass('current-player');
		}


		/**	
		 * Clicking on the available champions must select them
		 * for the user playing the game.
		 * 
		 * @param  {obj} event The event (click in this case)
		 */
		var selectChampion = function (event) {
			var clickedImgUrl = $(event.toElement).attr('src');
			if( $(this).hasClass('inactive') ) {
				return;``
			}
			var currentImgUrl =$('.team-red .team-champions .champion-panel:nth-child(2) .champ-icon img').attr('src');

			if( $('.team-red .team-champions .champion-panel:nth-child(2).current-player .champ-icon img').length == 0 || currentImgUrl != clickedImgUrl ) {
				$('.team-red .team-champions .champion-panel:nth-child(2).current-player .champ-icon img').remove();
				$('.team-red .team-champions .champion-panel:nth-child(2).current-player .champ-icon').append('<img src="' + clickedImgUrl + '">');
			}
			if( _s.lastSelectedChampion ) {
				$(_s.lastSelectedChampion).removeClass('inactive');
			}
			_s.lastSelectedChampion = this;
			$(this).addClass('inactive');
		}

		/**
		 * Write some comments in the comment field to show interactivity.
		 */
		var writeComments = function( messages, counter ) {
			if (undefined == counter) {
				counter = 0;
			}

			for(var i = 0; i <= counter; i++ ) {
				if (undefined == messages[i]) 
					return;	

				var delay = Math.floor((Math.random() * 500) + 4000);
				var index = messages[i].indexOf(' ');
				
				if (index == -1) {
					index = messages[i].length;
				}

				var firstWord = messages[i].substring(0, index);
				var message = messages[i].substring(index, messages[i].length);
			}

			var timeout = setTimeout(function() {
				// Get that message out
				$('.chat-messages').append('<span class="chat-msg"><strong class="user">' + firstWord + ':</strong> ' + message + '</span>');
				writeComments(messages, ++counter);
			}, delay);

			if (counter == messages.length) {
				clearTimeout(timeout);
				return;
			}

			$(".chat-messages").scrollTop($(".chat-messages")[0].scrollHeight);;
		}

		/**
		 * Toggle between "selected" class when picking a champion.
		 * This will allow to style it from CSS.
		 */
		var toggleTags = function(e) {
			$(this).siblings().removeClass('selected');
			$(this).addClass('selected');

			var tag = $(e.toElement).text();
			
			$('.champions-grid-overflow .champ-icon').each(function() {
				if($(this).data('tag') !== tag) {
					$(this).addClass('hidden')
				} else {
					$(this).removeClass('hidden');
				}

				if(tag === 'All champions') {
					$(this).removeClass('hidden');
				}
			});
		}

		/**
		 * Iterate through the champions and add .loaded class each 100 seconds.
		 * This will create smooth animation of showing them one by one.
		 * 
		 * @param  {string} The class for the icons.
		 */
		var loadIcons = function ( element, totalLoadTime ) {
			var time = 0;
			var delay = 100;

			if (undefined !== totalLoadTime) {
				delay = totalLoadTime / $(element).length;
			}

			$(element).each(function( el ) {
				var currElement = $(this);

				setTimeout( function(  ) {
					currElement.addClass('loaded');
				}, time);

				time += delay;
			});
		}



		var loadTimer = function (seconds, destroy) {
			_s.currentSeconds = seconds;
			
			var timer = setInterval( function() {
				if( _s.currentSeconds <= 0) {
					clearInterval(timer);
				}
				$('.seconds').text(_s.currentSeconds--);
			}, LOAD_DELAY_TIME);

			if (destroy) {
				clearInterval(timer);
			}
		}

		var botSelectChampion = function(championName, id, team) {
			$('.team-' + team + ' .team-champions .champion-panel:nth-child(' + id + ')').addClass('current-player');
			var imgURL = $("img[src$='champ-" + championName + ".png']").attr('src');
			var champIcon = $("img[src$='champ-" + championName + ".png']").parent();
			var delay = Math.floor((Math.random() * 10000) + 4000);

			setTimeout(function() {
				$('.team-' + team + ' .team-champions .champion-panel:nth-child(' + id + ') .champ-icon').append('<img src="' + imgURL + '">');
				champIcon.addClass('inactive');
			}, delay);
		}

		var selectFieldOpen = function(element) {
			var hasClass = $(this).hasClass('opened');

			$('.select-field.opened').removeClass('opened');

			if( ! hasClass ) {
				$(this).addClass('opened');
			}
		}

		var selectFieldUpdate = function () {
			var listText = $(this).text();
			var parentText = $(this).parent().parent().find('.text');

			parentText.text(listText);
		}

		var commentsForm = function () {
			$('.input-area').submit(function() {
				event.preventDefault();

				var inputContent = $('.chatbox-input').val();

				if( inputContent.trim().length > 0 ) {
					$('.chat-messages').append('<span class="chat-msg"><strong class="user author">Player:</strong> ' + inputContent + '</span>');
					$('.chatbox-input').val('');
				}

				$(".chat-messages").scrollTop($(".chat-messages")[0].scrollHeight);;
			});
		}

		/**
		 * Add message in the chat by appending <span> on enter.
		 */
		var chatSubmit = function() {
			var inputContent = $('.chatbox-input').val();

			if( inputContent.trim().length > 0 ) {
				$('.chat-messages').append('<span class="chat-msg"><strong class="user">Player:</strong> ' + inputContent + '</span>');
				$('.chatbox-input').val('');
			}
		}

		var errorMessage = function(message) {
			$('.client-error p').text(message);
			$('.client-error').addClass('is-visible');
		}

		/**
		 * Call the events.
		 * -> siteScripts.watch();
		 */
		return {
			watchEvents: events,
			init: init
		};

	})();

	/**
	 * How long to wait before adding the visible class
	 */
	setTimeout(function() {
		siteScripts.watchEvents(); // Begin watching for events.
		siteScripts.init();

		$('.client-window').addClass('visible');
	}, LOAD_DELAY_TIME);
	

});
