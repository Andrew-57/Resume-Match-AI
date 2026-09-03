import Analyzer from '../analyzer.js';

const resume = "Managed AWS instances, set up continuous integration pipelines.";
const jd = "Experience with AWS and CI/CD";
const score = Analyzer._test.calculateFinalATSScore(resume, jd);
console.log("Score:", score);
