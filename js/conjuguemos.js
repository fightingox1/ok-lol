/**
 * Conjugates an infinitive
 * @param {string} v Verb
 * @param {int} p Person (1, 2, 3)
 * @param {string} t Tense
 * @param {int} n Number (1 for singular, 2 for plural) 
 */
function c(v,p,t,n) {
    window.return = '';
    // The endpint below is a patch for http://api.ultralingua.com/conjugations/spa/{verb} designed to bypass HTTPS restrictions
    $.get('https://n7pmb2qz12.execute-api.us-east-2.amazonaws.com/v1/' + v.toLowerCase(), function(data) {
        for(c in data) {
            if((c['partofspeech']['number'] == ((n==1)?'singular':'plural')) && (c['partofspeech']['person'] == (['','first','second','third'])[p]) && (c['partofspeech']['tense'] == t)) {
                window.return = c['surfaceform'];
                break;
            }
        }
    });
    return window.return;
}
/**
 * Checks whether or not an answer was just accepted
 * Returns false if no correct answer was detected, even if it isn't necessarily incorrect
 * That is, if no message is present, it returns false by default
 */
function check() {
    return !!$("#answer-field .bubble.correct").length;
}
/**
 * Answers the current question
 * @returns {boolean} The result of check()
 * @see {@link check}
 */
function answer(value){
    $("#answer-input").val(value);
    $("#check-button").click();
    return check();
}
/**
 * Gets the pronoun
 * @returns {int[]} [person, number]
 */
function getPronoun() {
    p = $('#pronoun-input').text();
    if(p.indexOf(' y ') != -1) {
        if(p.indexOf(' yo') != -1) {
            return [1, 2];
        }
        else if(p.indexOf('tú')) {
            return [2, 2];
        }
        else if(p.indexOf('usted')) {
            return [3, 2];
        }
        else {
            return [3, 2]
        }
    }
    else {
        s = {
            'yo': [1, 1],
            'tú': [2, 1],
            'él': [3, 1],
            'ella': [3, 1],
            'usted': [3, 1],
            'nosotros': [1, 2],
            'vosotros': [2, 2],
            'ellos': [3, 2],
            'ellas': [3, 2],
            'ustedes': [3, 2]
        };
        o = FuzzySet();
        for (pro in s) {
            o.add(pro);
        }
        return s[o.get(p)[0][1]];
    }
}
