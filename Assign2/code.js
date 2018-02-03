//
// this is just a stub for a function you need to implement
//
function getStats(txt) {

    print = console.log.bind(console);
//    print = function() {};

    function clean(arr){
      let newarr = [];
      for (i=0; i<arr.length; i++){
         //removing any empty elements from the array
         if(arr[i] && arr[i] != ""){
           newarr.push(arr[i]);
         }
       }
       return newarr;
    }

    function nChars_func(txt){
      return txt.length;
    }

    function nWords_func(txt){
      //finds all characters that are non-alphabets
    //  let temp = txt.replace(/[^A-Za-z0-9]/, " ")
  //    print("adgadg" + temp);
      let temp2 = txt.replace(/\W+/g, " ").trim().split(" ");
  //    print("here" + temp2);
      let array1 = clean(temp2);
  /*    let array1 = [];
      for (i=0; i<temp2.length; i++){
        //removing any empty elements from the array
        if(temp2[i] && temp2[i] != ""){
          array1.push(temp2[i]);
        }
      }
*/
      return array1.length;
    }

    function nLines_func(txt){
       return txt.split(/\r\n|\r|\n/).length;
    }

    function nNonEmptyLines_func(txt){
      let temp1 = txt.split(/\r\n|\r|\n/);
      print(temp1);
      print(temp1.length);
      let count = 0;

      for (i=0; i<temp1.length; i++){
        let testvalue = temp1[i].replace(/\W+/g, " ").trim()
        if(nChars_func(testvalue)>0){
          count++;
        }
      }
      return count;
    }

    function averageWordLength_func(txt){
      let temp = txt.replace(/\W+/g, "").trim();
      let numchar = nChars_func(temp);
      let numword = nWords_func(txt);
      return numchar/parseFloat(numword);
    }


    function maxLineLength_func(txt){
      let temp1 = txt.split(/\r\n|\r|\n/);
      let maxcount = 0;
      for (i=0; i<temp1.length; i++){
        let amount = nChars_func(temp1[i]);
        if(amount > maxcount){
          maxcount = amount;
        }
      }
      return maxcount;
    }

    function check_if_palindrom(word){
      let lower = word.toLowerCase();
      let revword = lower.split("").reverse().join("");
      print("lower: " + lower + " revword: " + revword);
      if(revword === lower){
        return true;
      }
      else{
        return false;
      }
    }

    function palindromes_func(txt){
      let listofwords = [];
      let wordarray = txt.replace(/\W+/g, " ").trim().split(" ");
      for (i = 0; i<wordarray.length; i++){
        if (check_if_palindrom(wordarray[i]) && wordarray[i].length>1){
          listofwords.push(wordarray[i].toLowerCase());
        }
      }
      return listofwords;
    }

    function longestWords_func(txt){
      let wordarray = txt.replace(/\W+/g, " ").trim().split(" ");
      let longestwords = [];
      let maxwordcount = 0 ;
      for (i = 0; i<wordarray.length; i++){
        if (wordarray[i].length === maxwordcount){
          longestWords.push(wordarray[i]);
        }

        else if (wordarray[i].length > maxwordcount){
          longestWords = [];
          longestwords.push(wordarray[i]);
          maxwordcount = wordarray[i].length;
        }
      }

      return longestwords;

    }

    return {
        nChars: nChars_func(txt),
        nWords: nWords_func(txt),
        nLines: nLines_func(txt),
        nNonEmptyLines: nNonEmptyLines_func(txt),
        maxLineLength: maxLineLength_func(txt),
        averageWordLength: averageWordLength_func(txt),
        palindromes: palindromes_func(txt),
        longestWords: longestWords_func(txt),
        mostFrequentWords: ["hello(7)", "world(1)"]
    };
}
