/**
 *	The MIT License (MIT)
 *
 *	Copyright (c) 2015 Toni Sučić
 *
 *	Permission is hereby granted, free of charge, to any person obtaining a copy
 *	of this software and associated documentation files (the "Software"), to deal
 *	in the Software without restriction, including without limitation the rights
 *	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *	copies of the Software, and to permit persons to whom the Software is
 *	furnished to do so, subject to the following conditions:
 *
 *	The above copyright notice and this permission notice shall be included in
 *	all copies or substantial portions of the Software.
 *
 *	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *	THE SOFTWARE.
 */

var _ = require('underscore');

/**
 * A checker is an object with the following form:
 *  { pattern: /something/, points: 1 }
 * or if the pattern only matches code near the top of a given file:
 *  { pattern: /something/, points: 2, nearTop: true }
 * 
 * Key: Language name.
 * Value: Array of checkers.
 * 
 * N.B. An array of checkers shouldn't contain more regexes than
 * necessary as it would inhibit performance.
 *
 * Points scale:
 *  2 = Bonus points:   Almost unique to a given language.
 *  1 = Regular point:  Not unique to a given language.
 * -1 = Penalty point:  Does not match a given language.
 * Rare:
 * -50 = Bonus penalty points: Only used when two languages are mixed together,
 *  and one has a higher precedence over the other one.
 */
var languages = {
  'JavaScript': [
    // undefined keyword
    { pattern: /undefined/g, points: 2 },
    // console.log('ayy lmao')
    { pattern: /console\.log( )*\(/, points: 2 },
    // Variable declaration
    { pattern: /(var|const|let)( )+\w+( )*=?/, points: 2 },
    // Array/Object declaration
    { pattern: /(('|").+('|")( )*|\w+):( )*[{\[]/, points: 2 },
    // === operator
    { pattern: /===/g, points: 1 },
    // !== operator
    { pattern: /!==/g, points: 1 },
    // Function definition
    { pattern: /function\*?(( )+[\$\w]+( )*\(.*\)|( )*\(.*\))/g, points: 1 },
    // null keyword
    { pattern: /null/g, points: 1 },
    // lambda expression
    { pattern: /\(.*\)( )*=>( )*.+/, points: 1 },
    // (else )if statement
    { pattern: /(else )?if( )+\(.+\)/, points: 1 },
    // while loop
    { pattern: /while( )+\(.+\)/, points: 1 },
    // C style variable declaration.
    { pattern: /(^|\s)(char|long|int|float|double)( )+\w+( )*=?/, points: -1 },
    // pointer
    { pattern: /(\w+)( )*\*( )*\w+/, points: -1 },
    // HTML <script> tag
    { pattern: /<(\/)?script( type=('|")text\/javascript('|"))?>/, points: -50 },
  ],

  'C': [
    // Primitive variable declaration.
    { pattern: /(char|long|int|float|double)( )+\w+( )*=?/, points: 2 },
    // malloc function call
    { pattern: /malloc\(.+\)/, points: 2 },
    // #include <whatever.h>
    { pattern: /#include (<|")\w+\.h(>|")/, points: 2, nearTop: true },
    // pointer
    { pattern: /(\w+)( )*\*( )*\w+/, points: 2 },
    // Variable declaration and/or initialisation.
    { pattern: /(\w+)( )+\w+(;|( )*=)/, points: 1 },
    // Array declaration.
    { pattern: /(\w+)( )+\w+\[.+\]/, points: 1 },
    // #define macro
    { pattern: /#define( )+.+/, points: 1 },
    // NULL constant
    { pattern: /NULL/, points: 1 },
    // void keyword
    { pattern: /void/g, points: 1 },
    // (else )if statement
    { pattern: /(else )?if( )*\(.+\)/, points: 1 },
    // while loop
    { pattern: /while( )+\(.+\)/, points: 1 },
    // printf function
    { pattern: /(printf|puts)( )*\(.+\)/, points: 1 },
    // new Keyword from C++
    { pattern: /new \w+/, points: -1 },
    // new Keyword from Java
    { pattern: /new [A-Z]\w*( )*\(.+\)/, points: 2 },
    // Single quote multicharacter string
    { pattern: /'.{2,}'/, points: -1 },
    // JS variable declaration
    { pattern: /var( )+\w+( )*=?/, points: -1 },
  ],

  'C++': [
    // Primitive variable declaration.
    { pattern: /(char|long|int|float|double)( )+\w+( )*=?/, points: 2 },
    // #include <whatever.h>
    { pattern: /#include( )*(<|")\w+(\.h)?(>|")/, points: 2, nearTop: true },
    // using namespace something
    { pattern: /using( )+namespace( )+.+( )*;/, points: 2 },
    // template declaration
    { pattern: /template( )*<.*>/, points: 2 },
    // std
    { pattern: /std::\w+/g, points: 2 },
    // cout/cin/endl
    { pattern: /(cout|cin|endl)/g, points: 2 },
    // Visibility specifiers
    { pattern: /(public|protected|private):/, points: 2 },
    // nullptr
    { pattern: /nullptr/, points: 2 },
    // new Keyword
    { pattern: /new \w+(\(.*\))?/, points: 1 },
    // #define macro
    { pattern: /#define( )+.+/, points: 1 },
    // template usage
    { pattern: /\w+<\w+>/, points: 1 },
    // class keyword
    { pattern: /class( )+\w+/, points: 1 },
    // void keyword
    { pattern: /void/g, points: 1 },
    // (else )if statement
    { pattern: /(else )?if( )*\(.+\)/, points: 1 },
    // while loop
    { pattern: /while( )+\(.+\)/, points: 1 },
    // Scope operator
    { pattern: /\w*::\w+/, points: 1 },
    // Single quote multicharacter string
    { pattern: /'.{2,}'/, points: -1 },
    // Java List/ArrayList
    { pattern: /(List<\w+>|ArrayList<\w*>( )*\(.*\))(( )+[\w]+|;)/, points: -1 },
  ],

  'Python': [
    // Function definition
    { pattern: /def( )+\w+\(.*\)( )*:/, points: 2 },
    // while loop
    { pattern: /while (.+):/, points: 2 },
    // from library import something
    { pattern: /from [\w\.]+ import (\w+|\*)/, points: 2 },
    // class keyword
    { pattern: /class( )*\w+(\(( )*\w+( )*\))?( )*:/, points: 2 },
    // if keyword
    { pattern: /if( )+(.+)( )*:/, points: 2 },
    // elif keyword
    { pattern: /elif( )+(.+)( )*:/, points: 2 },
    // else keyword
    { pattern: /else:/, points: 2 },
    // for loop
    { pattern: /for (\w+|\(?\w+,( )*\w+\)?) in (.+):/, points: 2 },
    // Python variable declaration.
    { pattern: /\w+( )*=( )*\w+(?!;)(\n|$)/, points: 1 },
    // import something
    { pattern: /import ([[^\.]\w])+/, points: 1, nearTop: true },
    // print statement/function
    { pattern: /print((( )*\(.+\))|( )+.+)/, points: 1 },
    // &&/|| operators
    { pattern: /(&{2}|\|{2})/, points: -1 },
  ],

  'Java': [
    // System.out.println() etc.
    { pattern: /System\.(in|out)\.\w+/, points: 2 },
    // Class variable declarations
    { pattern: /(private|protected|public)( )*\w+( )*\w+(( )*=( )*[\w])?/, points: 2 },
    // Method
    { pattern: /(private|protected|public)( )*\w+( )*[\w]+\(.+\)/, points: 2 },
    // String class
    { pattern: /(^|\s)(String)( )+[\w]+( )*=?/, points: 2 },
    // List/ArrayList
    { pattern: /(List<\w+>|ArrayList<\w*>( )*\(.*\))(( )+[\w]+|;)/, points: 2 },
    // class keyword
    { pattern: /(public( )*)?class( )*\w+/, points: 2 },
    // Array declaration.
    { pattern: /(\w+)(\[( )*\])+( )+\w+/, points: 2 },
    // final keyword
    { pattern: /final( )*\w+/, points: 2 },
    // getter & setter
    { pattern: /\w+\.(get|set)\(.+\)/, points: 2 },
    // new Keyword (Java)
    { pattern: /new [A-Z]\w*( )*\(.+\)/, points: 2 },
    // C style variable declaration.
    { pattern: /(^|\s)(char|long|int|float|double)( )+[\w]+( )*=?/, points: 1 },
    // extends/implements keywords
    { pattern: /(extends|implements)/, points: 2, nearTop: true },
    // null keyword
    { pattern: /null/g, points: 1 },
    // (else )if statement
    { pattern: /(else )?if( )*\(.+\)/, points: 1 },
    // while loop
    { pattern: /while( )+\(.+\)/, points: 1 },
    // void keyword
    { pattern: /void/g, points: 1 },
    // const
    { pattern: /const( )*\w+/, points: -1 },
    // pointer
    { pattern: /(\w+)( )*\*( )*\w+/, points: -1 },
    // Single quote multicharacter string
    { pattern: /'.{2,}'/, points: -1 },
    // C style include
    { pattern: /#include( )*(<|")\w+(\.h)?(>|")/, points: -1, nearTop: true },
  ],

  'HTML': [
    { pattern: /<!DOCTYPE (html|HTML PUBLIC .+)>/, points: 2, nearTop: true },
    // Tags
    { pattern: /<[a-z0-9]+(( )*[\w]+=('|").+('|")( )*)?>.*<\/[a-z0-9]+>/g, points: 2 },
    // Properties
    { pattern: /[a-z\-]+=("|').+("|')/g, points: 2 },
    // PHP tag
    { pattern: /<\?php/, points: -50 },
  ],

  'CSS': [
    // Properties
    { pattern: /[a-z\-]+:(?!:).+;/, points: 2 },
    // <style> tag from HTML
    { pattern: /<(\/)?style>/, points: -50 },
  ],

//  'Ruby': [
//    // require/include
//    { pattern: /(require|include)( )+'\w+(\.rb)?'/, points: 2, nearTop: true },
//    // Function definition
//    { pattern: /def( )+\w+( )*(\(.+\))?( )*\n/, points: 2 },
//    // Instance variables
//    { pattern: /@\w+/, points: 2 },
//    // Boolean property
//    { pattern: /\.\w+\?/, points: 2 },
//    // puts (Ruby print)
//    { pattern: /puts( )+("|').+("|')/, points: 2 },
//    // Inheriting class
//    { pattern: /class [A-Z]\w*( )*<( )*([A-Z]\w*(::)?)+/, points: 2 },
//    // attr_accessor
//    { pattern: /attr_accessor( )+(:\w+(,( )*)?)+/, points: 2 },
//    // new
//    { pattern: /\w+\.new( )+/, points: 2 },
//    // elsif keyword
//    { pattern: /elsif/, points: 2 },
//    // do
//    { pattern: /do( )*\|(\w+(,( )*\w+)?)+\|/, points: 2 },
//    // for loop
//    { pattern: /for (\w+|\(?\w+,( )*\w+\)?) in (.+)/, points: 1 },
//    // nil keyword
//    { pattern: /nil/, points: 1 },
//    // Scope operator
//    { pattern: /[A-Z]\w*::[A-Z]\w*/, points: 1 },
//  ],

  'Go': [
    // package something
    { pattern: /package( )+[a-z]+\n/, points: 2, nearTop: true },
    // import
    { pattern: /(import( )*\(( )*\n)|(import( )+"[a-z0-9\/\.]+")/, points: 2, nearTop: true },
    // error check
    { pattern: /if.+err( )*!=( )*nil.+{/, points: 2 },
    // Go print
    { pattern: /fmt\.Print(f|ln)?\(.*\)/, points: 2 },
    // function
    { pattern: /func(( )+\w+( )*)?\(.*\).*{/, points: 2 },
    // variable initialisation
    { pattern: /\w+( )*:=( )*.+[^;\n]/, points: 2 },
    // if/else if
    { pattern: /(}( )*else( )*)?if[^\(\)]+{/, points: 2 },
    // var/const declaration
    { pattern: /(var|const)( )+\w+( )+[\w\*]+(\n|( )*=|$)/, points: 2 },
    // public access on package
    { pattern: /[a-z]+\.[A-Z]\w*/, points: 1 },
    // nil keyword
    { pattern: /nil/, points: 1 },
    // Single quote multicharacter string
    { pattern: /'.{2,}'/, points: -1 },
  ],

  'PHP': [
    // PHP tag
    { pattern: /<\?php/, points: 2 },
    // PHP style variables.
    { pattern: /\$\w+/, points: 2 },
    // use Something\Something;
    { pattern: /use( )+\w+(\\\w+)+( )*;/, points: 2, nearTop: true },
    // arrow
    { pattern: /\$\w+\->\w+/, points: 2 },
    // require/include
    { pattern: /(require|include)(_once)?( )*\(?( )*('|").+\.php('|")( )*\)?( )*;/, points: 2 },
    // echo 'something';
    { pattern: /echo( )+('|").+('|")( )*;/, points: 1 },
    // NULL constant
    { pattern: /NULL/, points: 1 },
    // new keyword
    { pattern: /new( )+((\\\w+)+|\w+)(\(.*\))?/, points: 1 },
    // Function definition
    { pattern: /function(( )+[\$\w]+\(.*\)|( )*\(.*\))/g, points: 1 },
    // (else)if statement
    { pattern: /(else)?if( )+\(.+\)/, points: 1 },
    // scope operator
    { pattern: /\w+::\w+/, points: 1 },
    // === operator
    { pattern: /===/g, points: 1 },
    // !== operator
    { pattern: /!==/g, points: 1 },
    // C/JS style variable declaration.
    { pattern: /(^|\s)(var|char|long|int|float|double)( )+\w+( )*=?/, points: -1 },
  ],

  'Unknown': [],
};

function getPoints(language, lineOfCode, checkers) {
  return _.reduce(_.map(checkers, function(checker) {
    if (checker.pattern.test(lineOfCode)) {
      return checker.points;
    }
    return 0;
  }), function(memo, num) {
    return memo + num;
  }, 0);
}

function detectLang(snippet, options) {
  var opts = _.defaults(options || {}, {
    heuristic: true,
    statistics: false,
  });

  var linesOfCode = snippet
    .replace(/\r\n?/g, '\n')
    .replace(/\n{2,}/g, '\n')
    .split('\n');

  function nearTop(index) {
    if (linesOfCode.length <= 10) {
      return true;
    }
    return index < linesOfCode.length / 10;
  }

  if (opts.heuristic && linesOfCode.length > 500) {
    linesOfCode = linesOfCode.filter(function(lineOfCode, index) {
      if (nearTop(index)) {
        return true;
      }
      return index % Math.ceil(linesOfCode.length / 500) === 0;
    });
  }

  var pairs = _.keys(languages).map(function(key) {
    return { language: key, checkers: languages[key] };
  });

  var results = _.map(pairs, function(pairs) {
    var language = pairs.language;
    var checkers = pairs.checkers;

    if (language === 'Unknown') {
      return { language: 'Unknown', points: 1 };
    }

    var pointsList = linesOfCode.map(function(lineOfCode, index) {
      if (!nearTop(index)) {
        return getPoints(language, lineOfCode, _.reject(checkers, function(checker) {
          return checker.nearTop;
        }));
      } else {
        return getPoints(language, lineOfCode, checkers);
      }
    });

    var points = _.reduce(pointsList, function(memo, num) {
      return memo + num;
    });

    return { language: language, points: points };
  });

  var bestResult = _.max(results, function(result) {
    return result.points;
  });

  return bestResult;
//
//  if (opts.statistics) {
//    var statistics = {};
//    for (var result in results) {
//      statistics.push([ results[result].language , results[result].points]);
//    }
//
//    statistics.sort(function (a, b) {
//      return b[1] - a[1];
//    });
//    return { detected: bestResult.language, statistics: statistics };
//  }
//
//  return bestResult.language;
}

module.exports = detectLang;