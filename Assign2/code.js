//
// Carolyn Doan 10122518 Lab B03
//
function getStats(txt) {

    /* Purpose: This function is used to remove empty elements from an array
       Inputs: an array
    */
    function clean(arr){
      let newarray = [];
      for (i=0; i<arr.length; i++){
         if(arr[i] && arr[i] != ""){
           newarray.push(arr[i]);
         }
       }
       return newarray;
    }

    /* Purpose: This function returns the total number of words in the text
       Inputs: text
    */
    function nChars_func(txt){
      return txt.length;
    }

    /* Purpose: This function returns the total number of characters in the text
       Inputs: text
    */
    function nWords_func(txt){
      //removes underscores from the text
      txt = txt.replace(/_+/g, " ");
      //finds all characters that are non-alphabets or numbers
      let temp_array = txt.replace(/\W+/g, " ").trim().split(" ");
      let words_array = clean(temp_array);
      return words_array.length;
    }

    /* Purpose: This function returns the total number of lines in the text
       Inputs: text
    */
    function nLines_func(txt){
      if(txt.length === 0 ){
        return 0;
      }
      return txt.split(/\r\n|\r|\n/).length;
    }

    /* Purpose: This function returns the total number of lines in the text that contain at least one visible character
       Inputs: text
    */
    function nNonEmptyLines_func(txt){
      let line_array = txt.split(/\r\n|\r|\n/);
      let count = 0;

      for (i=0; i<line_array.length; i++){
        let temp_array = line_array[i].replace(/\r\n|\r|\n\S+/g, " ").trim()
        if(nChars_func(temp_array)>0){
          count++;
        }
      }
      return count;
    }

    /* Purpose: This function returns the average word length in the text
       Inputs: text
    */
    function averageWordLength_func(txt){
      txt = txt.replace(/_+/g, " ");
      let temp_array = txt.replace(/\W+/g, "").trim();
      let numchar = nChars_func(temp_array);
      let numword = nWords_func(txt);
      if(isNaN(numchar/parseFloat(numword))){ //check if division is possible
        return 0;
      }
      else {
        return numchar/parseFloat(numword);
      }
    }

    /* Purpose: This function returns the length of the longest line in the text
       Inputs: text
    */
    function maxLineLength_func(txt){
      let temp_array = txt.split(/\r\n|\r|\n/);
      let max_count = 0;
      for (i=0; i<temp_array.length; i++){
        let amount = nChars_func(temp_array[i]);
        if(amount > max_count){
          max_count = amount;
        }
      }
      return max_count;
    }

    /* Purpose: This function checks if a word is a palindrome or not
       Inputs: string
    */
    function check_if_palindrom(word){
      let lower = word.toLowerCase();

      if (lower.length <3){
        return false;
      }
      let revword = lower.split("").reverse().join("");

      if(revword === lower){
        return true;
      }
      else{
        return false;
      }
    }

    /* Purpose: This function returns a list of unique palindromes in the text
       Inputs: text
    */
    function palindromes_func(txt){
      txt = txt.replace(/_+/g, " ");
      let listofwords = [];
      let temp_array = txt.replace(/\W+/g, " ").trim().split(" ");
      let uniquearray = temp_array.filter(onlyUnique);
      for (i = 0; i<uniquearray.length; i++){
        if (check_if_palindrom(uniquearray[i]) && uniquearray[i].length>1){
          listofwords.push(uniquearray[i].toLowerCase());
        }
      }
      return listofwords;
    }

    /* Purpose: This function returns an array with only unique elements
       The code for this function was taken from https://stackoverflow.com/questions/1960473/get-all-unique-values-in-an-array-remove-duplicates
    */
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    /* Purpose: This function returns the 10 longest words in the text
       Inputs: text
    */
    function longestWords_func(txt){
      txt = txt.replace(/_+/g, " ");
      let temp_array = txt.replace(/\W+/g, " ").trim().toLowerCase().split(" ");
      let uniquearray = temp_array.filter(onlyUnique);
      let sorted = uniquearray.sort(function(a, b){
        return b.length - a.length;
      });

      let topten = [];
      let temparr = [];

      for (i = 0; i<sorted.length  ;i++ ){
        if(sorted.length === 1){
          if (sorted[0] !== ""){
            let temp = [];
            temp.push(sorted[0]);
            return temp;
          }
          let temp = [];
          return temp;
        }
        if(i === sorted.length-1 ){
          temparr.push(sorted[i]);
          let temp2 = temparr.sort();
          topten = topten.concat(temp2);
        }
        else if(sorted[i].length === sorted[i+1].length){
          temparr.push(sorted[i])
        }
        else if(sorted[i].length !== sorted[i+1].length ){
          temparr.push(sorted[i]);
          let temp2 = temparr.sort();
          topten = topten.concat(temp2);
          temparr = [];
          temp2 = [];
        }
      }

      let finaltopten = [];
      for ( i = 0 ; i<topten.length; i++){
        finaltopten.push(topten[i]);
        if(i===9){
          break;
        }
      }
      return finaltopten;
    }

    /* Purpose: This function returns the 10 most frequent words in the text
       Inputs: text
    */
    function mostFrequentWords_func(txt){
      txt = txt.replace(/_+/g, " ");
      let wordarray = txt.replace(/\W+/g, " ").trim().toLowerCase().split(" ");
      let wordcounts = {};
      for(i = 0; i < wordarray.length; i++){
          if (  wordcounts[wordarray[i]] === undefined){
            wordcounts[wordarray[i]] = 1;
          }
          else{
            wordcounts[wordarray[i]] = wordcounts[wordarray[i]] + 1;
          }
      }
      /* The function below was taken from https://stackoverflow.com/questions/25500316/sort-a-dictionary-by-value-in-javascript*/
      var items = Object.keys(wordcounts).map(function(key) {
          return [key, wordcounts[key]];
      });

      items.sort(function(word, freq) {
          return freq[1] - word[1];
      });

      let count = 0 ;
      let newarr = [];
      let result = [];
      let freqcount = 0 ;
      let index = 0 ;

      for (i = 0; i<items.length; i++ ) {
        if(items.length === 1){
          if (items[i][0] !== ""){
            let temp = [items[i][0] + "(" + items[i][1] + ")"];
            temp.push();
            return temp;
          }
          let temp = [];
          return temp;
        }

        if(i ===items.length-1 ){
          if(items[i][1] !== freqcount){
            newarr.push(items[i][0] + "(" + items[i][1] + ")");
          }
          else{
            newarr.push(items[i][0] + "(" + items[i][1] + ")");
            newarr.sort();
          }
          result = result.concat(newarr);
          break;
        }

        if (count ===0 ){
          freqcount = items[i][1];
          newarr.push(items[i][0] + "(" + items[i][1] + ")");
        }
        else if (count !==0){
          if(items[i][1] === freqcount){
            newarr.push(items[i][0]+ "(" + items[i][1] + ")");
			      newarr.sort();
          }
          else if (items[i][1] !== freqcount){
            newarr.sort();
            result = result.concat(newarr);
            freqcount= items[i][1]
            newarr = [];
            newarr.push(items[i][0] + "(" + items[i][1] + ")");
          }
        }
        count++;
      }

      let topten = [];
      for ( i = 0 ; i<result.length; i++){
        topten.push(result[i]);
        if(i===9){
          break;
        }
      }
      return topten;
    }

    return {
        nChars: nChars_func(txt),
        nWords: nWords_func(txt),
        nLines: nLines_func(txt),
        nonEmptyLines: nNonEmptyLines_func(txt),
        maxLineLength: maxLineLength_func(txt),
        averageWordLength: averageWordLength_func(txt),
        palindromes: palindromes_func(txt),
        longestWords: longestWords_func(txt),
        mostFrequentWords: mostFrequentWords_func(txt)
    };
}
