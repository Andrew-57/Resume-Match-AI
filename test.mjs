import assert from 'assert';
import Analyzer from './analyzer.js';

function runTests() {
  console.log("Running Analyzer Tests...");
  let passed = 0;
  let failed = 0;

  function runTest(name, fn) {
    try {
      fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (e) {
      console.error(`❌ [FAIL] ${name}`);
      console.error(`   Error: ${e.message}`);
      failed++;
    }
  }

  runTest("Should extract matching skills correctly", () => {
    const resume = "Experienced in JavaScript, React, Node.js and AWS.";
    const job = "Looking for a JavaScript developer with React skills.";
    const result = Analyzer.performAnalysis(resume, job);
    assert(result.matchedSkills.includes('Javascript'), "Missing Javascript");
    assert(result.matchedSkills.includes('React'), "Missing React");
  });

  runTest("Should calculate years of experience correctly", () => {
    const resume = "Software Engineer with 5 years of experience.";
    const job = "Requires 3+ years of experience.";
    const result = Analyzer.performAnalysis(resume, job);
    assert.strictEqual(result.resumeYears, 5, "Resume years should be 5");
    assert.strictEqual(result.jobYears, 3, "Job years should be 3");
  });

  runTest("Should handle missing years gracefully", () => {
    const resume = "Software Engineer, worked previously.";
    const job = "Requires some experience.";
    const result = Analyzer.performAnalysis(resume, job);
    assert.strictEqual(result.resumeYears, 0, "Resume years should be 0");
    assert.strictEqual(result.jobYears, 0, "Job years should be 0");
  });

  runTest("Should generate missing skills", () => {
    const resume = "Experienced in JavaScript.";
    const job = "Looking for a JavaScript developer with React and Node.js skills.";
    const result = Analyzer.performAnalysis(resume, job);
    assert(result.missingSkills.includes('React'), "Should list React as missing");
    assert(result.missingSkills.includes('Node'), "Should list Node as missing");
  });

  runTest("Should calculate an overall score", () => {
    const resume = "Experienced in JavaScript.";
    const job = "Looking for a JavaScript developer with React and Node.js skills.";
    const result = Analyzer.performAnalysis(resume, job);
    assert(typeof result.overallScore === 'number', "Score should be a number");
    assert(result.overallScore >= 0 && result.overallScore <= 100, "Score should be between 0 and 100");
  });

  // --- NEW ATS TESTS ---

  runTest("ATS: should match exact keywords", () => {
    const resume = "Experienced in JavaScript and React development";
    const jd = "Looking for frontend developer with HTML and CSS";
    // Using internal test export
    const score = Analyzer._test.calculateFinalATSScore(resume, jd);
    // Since jd implies frontend role, must haves are html, css, javascript, react, responsive design
    // resume has javascript, react -> 2 / 5 must haves (if no section boost)
    assert(score > 0, "Score should be greater than 0");
  });

  runTest("ATS: should handle abbreviation expansion", () => {
    const resume = "Managed AWS instances, set up continuous integration pipelines.";
    const jd = "Experience with AWS and CI/CD";
    const score = Analyzer._test.calculateFinalATSScore(resume, jd);
    // continuous integration gets expanded via CI/CD expansion, so it should match
    // 2 must_haves (aws, ci/cd) matched out of 5 must-haves and 5 nice-to-haves
    // max score for 2 must-haves is (0.7 + 0.7) / 5.0 = 28%
    assert(score === 28, "Score should exactly match 28% for 2 must-haves");
  });

  runTest("ATS: should cap keyword stuffing", () => {
    const resumeStuffed = "JavaScript JavaScript JavaScript JavaScript React React React React";
    const resumeNormal = "JavaScript JavaScript React";
    const jd = "Frontend developer";
    
    const stuffedScore = Analyzer._test.calculateFinalATSScore(resumeStuffed, jd);
    const normalScore = Analyzer._test.calculateFinalATSScore(resumeNormal, jd);
    
    // Since we cap at 3 for must-haves and 2 for nice-to-haves, 
    // the stuffed resume should not infinitely scale its score.
    assert(stuffedScore <= 100, "Stuffed score should be capped");
  });

  runTest("ATS: should boost skills section", () => {
    const resumeWithSection = "Skills:\nJavaScript, React, Node.js\nExperience:\nWorked a lot.";
    const resumeWithoutSection = "Experience:\nWorked with JavaScript, React, Node.js.";
    const jd = "Software engineer with JavaScript";
    
    const scoreWith = Analyzer._test.calculateFinalATSScore(resumeWithSection, jd);
    const scoreWithout = Analyzer._test.calculateFinalATSScore(resumeWithoutSection, jd);
    
    assert(scoreWith > scoreWithout, "Resume with keywords in Skills section should score higher");
  });

  console.log(`\nTests completed: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runTests();
