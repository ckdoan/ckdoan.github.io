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
    //  print("lower: " + lower + " revword: " + revword);
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


    //https://stackoverflow.com/questions/1960473/get-all-unique-values-in-an-array-remove-duplicates

    //ASK TA
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }



    function longestWords_func(txt){
      let wordarray = txt.replace(/\W+/g, " ").trim().toLowerCase().split(" ");
      let uniquearray = wordarray.filter(onlyUnique);
      let sorted = uniquearray.sort(function(a, b){
               return b.length - a.length;
      });

      let topten = [];
      let temparr = [];
//      print ("sorted " + sorted  );
      for (i = 0; i<sorted.length  ;i++ ){
//        print ("sorted[i]" + sorted[i]);
        if(i ===sorted.length-1 ){
          topten.push(sorted[i])
        }
        else if(sorted[i].length === sorted[i+1].length){
          temparr.push(sorted[i])
//          print("in here");
        }
        //ie. only 1 element with that length
        else if(sorted[i].length !== sorted[i+1].length ){
    //      print("in here2 2");
          temparr.push(sorted[i]);
          let temp2 = temparr.sort();
      //    Array.prototype.push.apply(topten, temp2); // ask TA
          topten = topten.concat(temp2);
//          topten.push(temp2);
          temparr = [];
          temp2 = [];
        }
      }
  //    print("loop end");
      let topten2 = [];
      for ( i = 0 ; i<topten.length; i++){
        topten2.push(topten[i]);
      //  print("heaf " + topten[i])
        if(i===9){
          break;
        }
      }
      return topten2;

    }

    function mostFrequentWords_func(txt){
      let wordarray = txt.replace(/\W+/g, " ").trim().toLowerCase().split(" ");
      let wordcounts = {};
      for(i = 0; i < wordarray.length; i++){
          if (  wordcounts[wordarray[i]] ===undefined){
            wordcounts[wordarray[i]] = 1;
          }
          else{
            wordcounts[wordarray[i]] = wordcounts[wordarray[i]] + 1;
          }
      }
      /* https://stackoverflow.com/questions/25500316/sort-a-dictionary-by-value-in-javascript*/
      var items = Object.keys(wordcounts).map(function(key) {
          return [key, wordcounts[key]];
      });

      // Sort the array based on the second element
      items.sort(function(first, second) {
          return second[1] - first[1];
      });

      print('items', items);
      let count = 0 ;
      let newarr = [];
      let final = [];
      let freqcount = 0 ;
      let index = 0 ;
      print('done');
      for (i = 0; i<items.length; i++ ) {
        print('current item is ', items[i][0]);



        if (count ===0 ){
          freqcount = items[i][1];
  //        print('here' , freqcount);

          newarr.push(items[i][0] + "(" + freqcount + ")");
        }
        else if (count !==0){
          print('in here');
          if(items[i][1] === freqcount){
            newarr.push(items[i][0]+ "(" + freqcount + ")");
            print('same');

            if(i ===items.length-1 ){

              newarr.sort();
              final = final.concat(newarr);

            }

          }
          else if (items[i][1] !== freqcount){
            print('doff');
            newarr.sort();
            final = final.concat(newarr);
            print('newarr ', newarr, 'final'+ final);
            freqcount= items[i][1]
            newarr = [];
            newarr.push(items[i][0] + "(" + freqcount + ")");
          }

        }
        count++;
        print('out');
      }
      print('fina', final);

      let topten = [];
      for ( i = 0 ; i<final.length; i++){
        topten.push(final[i]);
      //  print("heaf " + topten[i])
        if(i===9){
          break;
        }
      }
      return topten;







//      print(temp);
//      print("wordcount ");
  //    print(wordcounts);


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
        mostFrequentWords: mostFrequentWords_func(txt)
    };
}
