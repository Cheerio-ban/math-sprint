//An algorithm used to shuffle an array. 
// The comma operator in the variable?
// you can read on it: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comma_Operator

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }