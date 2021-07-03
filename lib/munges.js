
const mungeTriviaFunc = (rowData) => {
  const data = rowData.results;
  const mungedData = data.map(d => {
    return {
      difficulty: d.difficulty, 
      question: d.question,
      correct_answer: d.correct_answer, 
      incorrect_answer: d.incorrect_answers[0], 
    }; 
  }); 
  return mungedData; 
}; 


module.exports = { mungeTriviaFunc };