
const mungeTriviaFunc = (rowData) => {
  const data = rowData.results;
  // here's a shorthand for callbacks that return an object
  const mungedData = data.map((d, _id) => ({
    id: _id, 
    // if all the properties have the same name, you can spread the data out like so
    ...d,
    incorrect_answer: d.incorrect_answers[0], 

  })); 
  return  mungedData; 
}; 

module.exports = { mungeTriviaFunc };

