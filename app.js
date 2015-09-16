var app = angular.module('surveyApp', []);

app.directive('survey', function(surveyFactory) {
	return {
		restrict: 'AE',
		scope: {},
		templateUrl: 'template.html',
		link: function(scope, elem, attrs) {
			scope.create = function(){
				scope.surveyCreating = true;
			};

			scope.addQuestion = function(question, options, type){
				surveyFactory.addQuestion(question, options ? options.split(',') : [''], type);
				scope.questions = surveyFactory.getQuestion(-1);
				$("#questionInput").val('');
				$("#optionInput").val('');
			};

			scope.endCreating = function(){
				scope.surveyCreating = false;
				scope.surveyCreated = true;
			}

			scope.start = function() {
				scope.id = 0;
				scope.surveyOver = false;
				scope.inProgress = true;
				scope.getQuestion();
			};

			scope.reset = function() {
				scope.inProgress = false;
				scope.score = 0;
			}

			scope.textClick = function(){
				scope.formOptions = undefined;
				$("#optionInput").val('NA')
				$("#optionInput").prop('disabled', true);
			}

			scope.textUnclick = function(){
				$("#optionInput").val('')
				$("#optionInput").prop('disabled', false);
			}

			scope.getQuestion = function() {
				var q = surveyFactory.getQuestion(scope.id);
				if(q) {
					scope.question = q.question;
					scope.options = q.options;
					scope.type = q.type;
					// scope.typeList = surveyFactory.getTypeList(q.type);
					// scope.optionsHtml = $sce.trustAsHtml("<" + typeList[0] + "><" + typeList[1] + " type=" + type + " name=answer value=" + 'option' + ">" + 'option' + "</" + typeList[1] + "></" + typeList[0] + ">");
					scope.answer = q.answer;
					scope.answerMode = true;
				} else {
					scope.questions = surveyFactory.getQuestion(-1);
					scope.surveyOver = true;
				}
			};

			scope.checkAnswer = function() {
				if ((!$('input[name=answer]').val().length) && $('input[name=answer]').attr('type') == 'text') return;
				if(!$('input[name=answer]:checked').length && $('input[name=answer]').attr('type') != 'text') return;
				if (!!$('input[name=answer]:checked').length){
					var ans = $.map($('input[name=answer]:checked'), function(obj){
						return obj.value;
					}).join(',');
				}else{
					var ans = $('input[name=answer]').val();
				}

				surveyFactory.addAnswerToQuestion(scope.id, ans);

				scope.id++;
				scope.getQuestion();
			};

			scope.reset();
		}
	}
});

app.factory('surveyFactory', function() {
	var questions = [];
	// var typeList = {
	// 	checkbox: ['label', 'input'],
	// 	radio: ['label', 'input'],
	// 	dropdown: ['select', 'option'],
	// 	text: ['label', 'input']
	// }

	getTypeList = function(type){
		return typeList[type];
	}

	getQuestion = function(id){
		if (id == -1){
			return questions;
		}
		if(id < questions.length) {
			return questions[id];
		} else {
			return false;
		}
	};

	addAnswerToQuestion = function (id, ans) {
    var q = getQuestion(id);
    q.myAns = ans;
  };

  addQuestion = function(question, options, type){
  	questions.push({
  		"question": question,
  		"options": options,
  		"type": type
  	})
  };

	return {
		getQuestion: getQuestion,
		addAnswerToQuestion: addAnswerToQuestion,
		addQuestion: addQuestion,
		getTypeList: getTypeList
	};
});