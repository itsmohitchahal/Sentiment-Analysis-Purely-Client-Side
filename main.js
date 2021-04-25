function b_search(word, list) {
    var a = 0, b = list.length - 1;
    while(true) {
        if (Math.abs(a-b) == 1) {
            if (word == list[a] || word == list[b]) {
                return true;
            } else {
                return false;
            }
        } else if (a == b) {
            if (word == list[a]) {
                return true;
            } else {
                return false;
            }
        } else {
            var point = parseInt((a+b)/2);
            if (word == list[point]) {
                return true;
            } else if (word < list[point]) {
                b = point - 1;
            } else if (word > list[point]) {
                a = point + 1;
            }
        }
    }
    return false;
}

function analyse_text(text) {
    // console.log(text); // so we're getting the text
    $.getJSON("https://raw.githubusercontent.com/itsmohitchahal/Sentiment-Analysis-Purely-Client-Side-/main/analysis_paramters.json", function(json) {
        var temp_words = text.split(/\W+/).filter(function(token) {
            token = token.toUpperCase();
            return token.length >= 2 && json['stopwords'].indexOf(token) == -1;
        });
        words = []
        for (var i = 0; i < temp_words.length; i++) {
            if (/^[a-zA-Z]{3,}$/.test(temp_words[i])) {
                words.push(temp_words[i]);
            }  
        }
        // calculating scores
        var result = {
            'positive': 0,
            'negative': 0,
            'litigous': 0,
            'constraining': 0,
            'uncertainty': 0,
            'weak_modal': 0,
            'strong_modal': 0,
        }
        for (var i = 0; i < words.length; i++) {
            if (b_search(words[i].toUpperCase(), json['positive'])) {
                result['positive']++;
            } else if (b_search(words[i].toUpperCase(), json['negative'])) {
                result['negative']++;
            } else if (b_search(words[i].toUpperCase(), json['litigous'])) {
                result['litigous']++;
            } else if (b_search(words[i].toUpperCase(), json['constraining'])) {
                result['constraining']++;
            } else if (b_search(words[i].toUpperCase(), json['uncertainty'])) {
                result['uncertainty']++;
            } else if (b_search(words[i].toUpperCase(), json['weak_modal'])) {
                result['weak_modal']++;
            } else if (b_search(words[i].toUpperCase(), json['strong_modal'])) {
                result['strong_modal']++;
            }
        }
        $("#result").removeClass("disappear");
        console.log(result);
        // Positive score
        $("#result > div:nth-child(2) > div > div:nth-child(1) > div.card-body > span:nth-child(1) > strong").text("Absolute score: " + result['positive']);
        $("#result > div:nth-child(2) > div > div:nth-child(1) > div.card-body > span:nth-child(3) > strong").text("Proportion: " + Number.parseFloat(100*result['positive']/words.length).toPrecision(4) + "%");
        // +ve vs -ve score
        $("#result > div:nth-child(2) > div > div:nth-child(2) > div.card-body > span > strong").text("Proportion: " + Number.parseFloat(result['positive']/result['negative']).toPrecision(4) + "%");

        // Negative score
        $("#result > div:nth-child(2) > div > div:nth-child(3) > div.card-body > span:nth-child(1) > strong").text("Absolute score: " + result['negative']);
        $("#result > div:nth-child(2) > div > div:nth-child(3) > div.card-body > span:nth-child(3) > strong").text("Proportion: " + Number.parseFloat(100*result['negative']/words.length).toPrecision(4) + "%");

        if (result['uncertainty'] > 0 || result['litigous'] > 0 || result['constraining'] > 0) {
            $("#other-variables").removeClass("disappear")
            // Uncertainty score
            $("#result > div:nth-child(3) > div > div:nth-child(1) > div.card-body > span:nth-child(1) > strong").text("Absolute score: " + result['uncertainty']);
            $("#result > div:nth-child(3) > div > div:nth-child(1) > div.card-body > span:nth-child(3) > strong").text("Proportion: " + Number.parseFloat(100*result['uncertainty']/words.length).toPrecision(4) + "%");

            // litigous score
            $("#result > div:nth-child(3) > div > div:nth-child(2) > div.card-body > span:nth-child(1) > strong").text("Absolute score: " + result['litigous']);
            $("#result > div:nth-child(3) > div > div:nth-child(2) > div.card-body > span:nth-child(3) > strong").text("Proportion: " + Number.parseFloat(100*result['litigous']/words.length).toPrecision(4) + "%");

            // constraining score
            $("#result > div:nth-child(3) > div > div:nth-child(3) > div.card-body > span:nth-child(1) > strong").text("Absolute score: " + result['constraining']);
            $("#result > div:nth-child(3) > div > div:nth-child(3) > div.card-body > span:nth-child(3) > strong").text("Proportion: " + Number.parseFloat(100*result['constraining']/words.length).toPrecision(4) + "%");
        } else {
            $("#other-variables").addClass("disappear");
        }
        
        if (result['weak_modal'] > 0 || result['strong_modal'] > 0) {
            $("#grammar").removeClass("disappear");
            // weak modal score
            $("#result > div:nth-child(4) > div > div:nth-child(1) > div.card-body > span:nth-child(1) > strong").text("Absolute score: " + result['weak_modal']);
            $("#result > div:nth-child(4) > div > div:nth-child(1) > div.card-body > span:nth-child(3) > strong").text("Proportion: " + Number.parseFloat(100*result['weak_modal']/words.length).toPrecision(4) + "%");

            // strong modal score
            $("#result > div:nth-child(4) > div > div:nth-child(2) > div.card-body > span:nth-child(1) > strong").text("Absolute score: " + result['strong_modal']);
            $("#result > div:nth-child(4) > div > div:nth-child(2) > div.card-body > span:nth-child(3) > strong").text("Proportion: " + Number.parseFloat(100*result['strong_modal']/words.length).toPrecision(4) + "%");
        } else {
            $("#grammar").addClass("disappear");
        }

    });
}

// it all starts here
$(document).ready(function(){
    $('#hit-click').click(function(){
        analyse_text($('#pre-text').val())
    });
  });
