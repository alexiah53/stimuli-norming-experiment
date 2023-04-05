// set up experiment logic for each slide
function make_slides(f) {
	var slides = {};

  // set up initial slide
	slides.i0 = slide({
		name: "i0",
		start: function() {
			exp.startT = Date.now();
		},
		button: function() {
        exp.go(); //use exp.go() if and only if there is no "present" data.
      },
    });

// SOUND CHECK

	slides.sound_test = slide({
		name: "sound_test",
		start: function(){
			$('.err').hide();
		},
		soundtest_OK : function(e){
			exp.trial_no = 0;

			var sound_test = $(".sound_test").val();
			sound_test = sound_test.toLowerCase();

			if (sound_test == "ready") {
				exp.go();
			} else {
				$('.err').show();
			}
		}
	});

   // MAIN EXPERIMENT INSTRUCTIONS

	slides.startExp = slide({
		name: "startExp",
		start: function() {
		},
		button: function() {
       exp.go(); //use exp.go() if and only if there is no "present" data.
     },
   });

// MAIN EXPERIMENT

	slides.follow_up = slide({
		name: "follow_up",
		present: exp.stimuli,

		make_dot_visible_certainty : function() {
			if ($("#certainty_slider").val() != 50); {
				$('#certainty_slider').addClass('visibleslider')
			};
		},

		make_dot_visible_accentedness: function() {
			if ($("#accentedness").val() != 50); {
				$('#accentedness').addClass('visibleslider')
			};
		},

		present_handle: function(stim){

			document.getElementById("reaction_1").value = "";
			document.getElementById("certainty_slider").value = 50;
			document.getElementById("accentedness").value = 50;
			document.getElementById("attention_check").value = "";


// moved this up--problem?
this.stim = stim;

var random_word = _.shuffle(exp.non_stimuli);
random_non_stim1 = random_word[0];
random_non_stim2 = random_word[1];
random_non_stim3 = random_word[2];
var last_word_options = [this.stim.last_word, random_non_stim1.last_word, random_non_stim2.last_word, random_non_stim3.last_word];
last_word_options = _.shuffle(last_word_options);

			radiobuttonhtml = '<input type="radio" id="option-1" name="attention_check" value="' + last_word_options[0] + '">' + last_word_options[0] + '</input>' + ' &emsp;&emsp; <input type="radio" id="option-2" name="attention_check" value="' + last_word_options[1]+ '">' + last_word_options[1] + '</input>' + ' &emsp;&emsp; <input type="radio" id="option-3" name="attention_check" value="' + last_word_options[2]+ '">' + last_word_options[2] + '</input>' + ' &emsp;&emsp; <input type="radio" id="option-4" name="attention_check" value="' + last_word_options[3]+ '">' + last_word_options[3] + '</input>'
			document.getElementById("attention_check").innerHTML = radiobuttonhtml

			checks_to_clear = document.getElementsByName("race_impressions");
			for (var i = 0; i < checks_to_clear.length; i++) {
				checks_to_clear[[i]].checked = false;
			}

			$('#certainty_slider').removeClass('visibleslider');
			$('#accentedness').removeClass('visibleslider');

			$(".err").hide();  

		        // store stimulus data
			// this.stim = stim;

// this gets element from html file
			var impression_aud = document.getElementById("stimuli_audio");

// this indexes the prime file name
			var audio_source = stim.participant + "_" + stim.phrase
			console.log(audio_source);
			impression_aud.src = "audio/" + audio_source + ".wav";

$("#attention_check").hide();
			$("#race_impression").hide();
			$("#certainty_slider_container").hide();
			$("#accentedness_slider_container").hide();
			$("#reaction_1").hide();

	// var race_impression_aud = document.getElementById("stimuli_audio");  	
			impression_aud.onended = function() {

$("#attention_check").show();
				$("#race_impression").show();
				$("#certainty_slider_container").show();
				$("#accentedness_slider_container").show();
				$("#reaction_1").show();

			}
		},	   

      // handle click on "Continue" button
		button_follow_up: function() {

			var check_race_impression = document.querySelectorAll('[name="race_impressions"]:checked');

			var attention_check_response = document.querySelectorAll('[name="attention_check"]:checked');
			// exp.attention_check = attention_check_response;

			if  (!$("#reaction_1").val() |
				// !$("#attention_check").val() |
				// !attention_check_response | 
				// attention_check_response.checked == false |
				!$('input[name="attention_check"]:checked').val() |
				$("#accentedness").val() == 50 |
				$("#certainty_slider").val() == 50 |
				check_race_impression.length < 1 ) {

				$(".err").show();
		}

		else {
			

			// var attention_check_response = document.querySelectorAll('[name="attention_check"]:checked');

			var race_impression = document.querySelectorAll('[name="race_impressions"]:checked');
			exp.race_impression_list = [];
			for (var i = 0; i < race_impression.length; i++) {
				if (race_impression[i].type=="checkbox" && race_impression[i].checked == true){
					exp.race_impression_list += race_impression[i].value+", \n";
				}
			}

			this.log_responses();
			_stream.apply(this)
		}
	},

      // save response
	log_responses: function() {
		exp.data_trials.push({

			"slide_number_in_experiment": exp.phase - 3,
   		stim_num: this.stim.stim_num,
   		participant: this.stim.participant,
   		phrase: this.stim.phrase,
   		last_word: this.stim.last_word,
   		gender: this.stim.gender,
   		start_time: this.stim.start_time,
   		end_time: this.stim.end_time,
   		duration: this.stim.duration,

   		attention_check: $('input[name="attention_check"]:checked').val(),
			accentedness: $("#accentedness").val(),
			reaction_1:$("#reaction_1").val(),
			certainty:$("#certainty_slider").val(),
			race_impressions: exp.race_impression_list

		});
	}
});

  // slide to collect subject information
	slides.subj_info = slide({
		name: "subj_info",
		submit: function(e) {

			if  (
		  // !$("#heritage_country").val() |
				!$("#current_region").val() |
		  // !$("#first_language").val() |
		  // !$("#parent_languages").val() |
				!$("#exposure").val() )
	  	//   |
		  // !$("#english_acquisition_age").val()) 
			{

				$(".err").show();
			}
			else {

				var races = document.querySelectorAll('[name="race"]:checked');
				console.log("race:", races.length);

				var race_list = [];

				for (var i = 0; i < races.length; i++) {

					if (races[i].type=="checkbox" && races[i].checked == true){
						race_list += races[i].value+", \n";
					}
				}

				console.log("list:", race_list);

				exp.subj_data = {
        // asses: $('input[name="assess"]:checked').val(),
					gender: $("#gender").val(),
					age: $("#age").val(),
					education: $("#education").val(),
					race: race_list,
					heritage_country: $("#heritage_country").val(),
					current_region: $("#current_region").val(),
					other_regions: $("#other_regions").val(),
					exposure: $("#exposure").val(),
					comments: $("#comments").val(),
		// first_language: $("#first_language").val(),
		// other_languages: $("#other_languages").val(),
		// english_acquisition_age: $("#english_acquisition_age").val(),
		// parent_languages: $("#parent_languages").val(),
		// email: $("#email").val()
				};

				exp.go();

			}
		}
	});

  //
	slides.thanks = slide({
		name: "thanks",
		start: function() {
			exp.data = {
				"trials": exp.data_trials,
				// "catch_trials": exp.catch_trials,
				"system": exp.system,
				// "condition": exp.condition,
				"subject_information": exp.subj_data,
				"time_in_minutes": (Date.now() - exp.startT) / 60000
			};

			setTimeout(function (){
				turk.submit(exp.data);
			}, 1000);
		}
	});

	return slides;
}

/// initialize experiment
function init() {

	var stimuli = all_stims;

  exp.stimuli = _.shuffle(stimuli); //call _.shuffle(stimuli) to randomize the order;

// for attention check words
  exp.non_stimuli = exp.stimuli.slice(76, 298);
   // console.log(exp.non_stimuli)

  exp.stimuli = exp.stimuli.slice(0, 75);

  console.log(exp.stimuli)
  exp.n_trials = exp.stimuli.length;

  // exp.condition = _.sample(["context", "no-context"]); //can randomize between subjects conditions here

  exp.system = {
  	Browser: BrowserDetect.browser,
  	OS: BrowserDetect.OS,
  	screenH: screen.height,
  	screenUH: exp.height,
  	screenW: screen.width,
  	screenUW: exp.width
  };

  exp.structure = [
  	"i0",
  	"sound_test",
  	"startExp",
  	"follow_up",
  	"subj_info",
  	"thanks"];

  exp.data_trials = [];

  //make corresponding slides:
  exp.slides = make_slides(exp);

  exp.nQs = utils.get_exp_length();
  //this does not work if there are stacks of stims (but does work for an experiment with this structure)
  //relies on structure and slides being defined

  $('.slide').hide(); //hide everything

// this is for prolific
  // $("#start_button").click(function() {
  //   exp.go();
  // });

  // this is for mturk
  $("#start_button").click(function() {
  	if (turk.previewMode) {
  		$("#mustaccept").show();
  	} else {
  		$("#start_button").click(function() {$("#mustaccept").show();});
  		exp.go();
  	}
  });

  exp.go(); //show first slide
}

function make_dot_visible() {
	if ($("#certainty_slider").val() != 50); {
		$('#certainty_slider').addClass('visibleslider')
	}};
