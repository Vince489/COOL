// Function to create a vocabulary from a list of tokens
function createVocabulary(tokens) {
  const vocabulary = new Map();
  const inverseVocabulary = new Map();

  tokens.forEach(token => {
      if (!vocabulary.has(token)) {
          const index = vocabulary.size;
          vocabulary.set(token, index);
          inverseVocabulary.set(index, token);
      }
  });

  return { vocabulary, inverseVocabulary };
}

// Function to tokenize sentences into words
function tokenizeSentences(corpus) {
  // Split the corpus into individual sentences
  const sentences = corpus.split(/[.!?]+/);

  // Tokenize each sentence into words
  const tokenizedSentences = sentences.map(sentence => {
      // Remove leading and trailing whitespaces and convert to lowercase
      sentence = sentence.trim().toLowerCase();
      // Tokenize the sentence into words
      return sentence.split(/\s+/).filter(word => word.length > 0); // Filter out empty strings
  });

  return tokenizedSentences;
}

// Function to vectorize tokenized sentences based on vocabulary
function vectorizeSentences(tokenizedSentences, vocabulary) {
  const vectorizedSentences = [];

  tokenizedSentences.forEach(tokens => {
      const vectorizedSequence = tokens.map(token => vocabulary.get(token));
      vectorizedSentences.push(vectorizedSequence);
  });

  return vectorizedSentences;
}

// Function to generate positive skip-grams from a sequence of indices
function generateSkipGrams(sequence, windowSize) {
  const skipGrams = [];

  // Iterate over each word in the sequence
  for (let i = 0; i < sequence.length; i++) {
      const targetWord = sequence[i];

      // Iterate over the context window around the target word
      for (let j = Math.max(0, i - windowSize); j < Math.min(sequence.length, i + windowSize + 1); j++) {
          // Skip the target word itself
          if (i !== j) {
              const contextWord = sequence[j];
              skipGrams.push([targetWord, contextWord]);
          }
      }
  }

  return skipGrams;
}

// Function to construct a Skip-gram Sampling Table based on word frequencies
function constructSamplingTable(corpus, vocabularySize) {
  const samplingTable = [];
  const wordFrequency = {};

  // Calculate word frequencies
  corpus.forEach(word => {
      if (wordFrequency[word]) {
          wordFrequency[word]++;
      } else {
          wordFrequency[word] = 1;
      }
  });

  // Calculate total word count
  const totalWordCount = corpus.length;

  // Calculate probabilities for each word
  for (let word in wordFrequency) {
      const frequency = wordFrequency[word];
      const probability = frequency / totalWordCount;
      samplingTable.push({ word: parseInt(word), probability });
  }

  // Sort sampling table based on probabilities
  samplingTable.sort((a, b) => b.probability - a.probability);

  // Truncate sampling table to specified vocabulary size
  samplingTable.splice(vocabularySize);

  return samplingTable;
}

// Function to construct training examples by combining positive context words with negatively sampled words
function constructTrainingExamples(sequence, windowSize, numNegativeSamples, vocabularySize) {
  const trainingExamples = [];

  // Function to sample negative context words
  function sampleNegativeContextWords(numSamples) {
      const negativeContextWords = [];
      for (let i = 0; i < numSamples; i++) {
          // Sample a negative context word randomly from the vocabulary
          negativeContextWords.push(Math.floor(Math.random() * vocabularySize));
      }
      return negativeContextWords;
  }

  // Iterate over each word in the sequence
  for (let i = 0; i < sequence.length; i++) {
      const targetWord = sequence[i];

      // Iterate over the context window around the target word
      for (let j = Math.max(0, i - windowSize); j < Math.min(sequence.length, i + windowSize + 1); j++) {
          // Skip the target word itself
          if (i !== j) {
              const contextWord = sequence[j];
              // Construct positive training example
              trainingExamples.push({ input: [targetWord, contextWord], label: 1 });

              // Sample negative context words
              const negativeContextWords = sampleNegativeContextWords(numNegativeSamples);
              // Construct negative training examples
              negativeContextWords.forEach(negativeWord => {
                  trainingExamples.push({ input: [targetWord, negativeWord], label: 0 });
              });
          }
      }
  }

  return trainingExamples;
}

// Function to process the corpus and generate training examples
function processCorpus(corpus, windowSize, numNegativeSamples) {
  // Tokenization
  const tokens = corpus.toLowerCase().split(/\s+/);

  // Vocabulary creation
  const { vocabulary, inverseVocabulary } = createVocabulary(tokens);

  // Vectorization
  const tokenizedSentences = tokenizeSentences(corpus.toLowerCase());
  const vectorizedSentences = vectorizeSentences(tokenizedSentences, vocabulary);

  // Generating positive skip-grams
  const positiveSkipGrams = generateSkipGrams(vectorizedSentences, windowSize);

  // Skip-gram Sampling Table
  const samplingTable = constructSamplingTable(tokens, vocabulary);

  // Constructing Training Examples
  const trainingExamples = constructTrainingExamples(positiveSkipGrams, numNegativeSamples, samplingTable);

  return {
      vocabulary,
      inverseVocabulary,
      vectorizedSentences,
      positiveSkipGrams,
      samplingTable,
      trainingExamples
  };
}

// Example corpus
const corpus = "I love basketball. Basketball is a very fun game to play. My friend James and I play it everyday. James wants to be a professional player.";

// Parameters
const windowSize = 2;
const numNegativeSamples = 5;

// Process the corpus
const processedData = processCorpus(corpus, windowSize, numNegativeSamples);

// Print processed data for inspection
console.log("Vocabulary:");
console.log(processedData.vocabulary);
console.log("\nInverse Vocabulary:");
console.log(processedData.inverseVocabulary);
console.log("\nVectorized Sentences:");
console.log(processedData.vectorizedSentences);
console.log("\nPositive Skip-grams:");
console.log(processedData.positiveSkipGrams);
console.log("\nSkip-gram Sampling Table:");
console.log(processedData.samplingTable);
console.log("\nTraining Examples:");
console.log(processedData.trainingExamples);
