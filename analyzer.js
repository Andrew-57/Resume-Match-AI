import {
  COMPILED_SKILLS,
  COMPILED_EDUCATION,
  EXPERIENCE_PATTERNS,
  COMPILED_SENIORITY,
  COMPILED_ACTION_VERBS,
  ATS_KEYWORDS,
  ROLE_CLASSIFIERS,
  SYNONYM_MAP,
  KEYWORD_EXPANSIONS
} from './data.js';

const Analyzer = (function() {


  const analysisCache = new Map();

  function hashString(str) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
      let chr = str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }
    return hash;
  }

  function extractSkills(text) {
    const hash = hashString(text);
    if (analysisCache.has(hash)) return analysisCache.get(hash);

    const lower = text.toLowerCase();
    const found = new Set();
    const categories = {};

    for (const comp of COMPILED_SKILLS) {
      categories[comp.category] = [];
      for (const pattern of comp.patterns) {
        if (pattern.regex.test(lower)) {
          const displayName = pattern.name.charAt(0).toUpperCase() + pattern.name.slice(1);
          if (!found.has(pattern.name)) {
            found.add(pattern.name);
            categories[comp.category].push(displayName);
          }
        }
      }
    }

    const result = { all: [...found], categories };
    analysisCache.set(hash, result);
    return result;
  }

function extractEducation(text) {
  const lower = text.toLowerCase();
  const found = [];
  for (const comp of COMPILED_EDUCATION) {
    if (comp.regex.test(lower)) {
      found.push(comp.kw);
    }
  }
  return [...new Set(found)];
}

function extractExperienceYears(text) {
  let maxYears = 0;
  for (const pattern of EXPERIENCE_PATTERNS) {
    const matches = [...text.matchAll(pattern)];
    for (const match of matches) {
      const years = parseInt(match[1], 10);
      if (!isNaN(years) && years > maxYears) maxYears = years;
    }
  }
  return maxYears;
}

function extractSeniorityLevel(text) {
  const lower = text.toLowerCase();
  for (const comp of COMPILED_SENIORITY) {
    for (const regex of comp.patterns) {
      if (regex.test(lower)) return comp.level;
    }
  }
  return 'unknown';
}

function extractActionVerbs(text) {
  const lower = text.toLowerCase();
  return COMPILED_ACTION_VERBS.filter(comp => comp.regex.test(lower)).map(comp => comp.verb);
}

function extractMetrics(text) {
  const metricPatterns = [
    /\d+%/g,
    /\$[\d,]+/g,
    /\d+x/gi,
    /\d+\s*(users|customers|clients|employees|engineers|developers)/gi,
    /\d+\s*(million|billion|thousand|k\b)/gi,
  ];

  const metrics = [];
  for (const pattern of metricPatterns) {
    const matches = text.match(pattern);
    if (matches) metrics.push(...matches);
  }
  return metrics;
}

// --- NEW ATS SCORING LOGIC ---

function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s\.\/]/g, ' ')      // Remove punctuation (keep dots and slashes for ci/cd, node.js)
    .replace(/\s+/g, ' ')              // Collapse whitespace
    .replace(/\b(a|an|the|and|or|but|in|on|at|to|for|of|with|by)\b/g, ' ') // Remove stopwords
    .trim();
}

function applySynonyms(text) {
  let result = text;
  Object.entries(SYNONYM_MAP).forEach(([canonical, variants]) => {
    variants.forEach(variant => {
      const regex = new RegExp(`\\b${variant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      result = result.replace(regex, canonical);
    });
  });
  return result;
}

function expandKeywords(text, keywordMap) {
  let expanded = text;
  Object.entries(keywordMap).forEach(([abbr, fullForms]) => {
    const regex = new RegExp(`\\b${abbr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    if (regex.test(text)) {
      fullForms.forEach(form => {
        expanded = expanded + ' ' + form;
      });
    }
  });
  return expanded;
}

function detectRoleFromJD(text) {
  const scores = {};
  Object.entries(ROLE_CLASSIFIERS).forEach(([role, patterns]) => {
    scores[role] = patterns.reduce((count, regex) =>
      count + (text.match(regex) || []).length, 0);
  });
  const roles = Object.keys(scores);
  if (roles.length === 0) return 'generic';
  return roles.reduce((a, b) => scores[a] > scores[b] ? a : b);
}

function parseResumeSections(text) {
  const sections = {
    skills: '',
    experience: '',
    education: '',
    summary: ''
  };

  const skillMatch = text.match(/^(skills|technical\s+skills|competencies):/im);
  if (skillMatch) {
    const start = skillMatch.index;
    const nextSection = text.slice(start + skillMatch[0].length).match(/^(experience|education|projects|summary):/im);
    sections.skills = text.slice(start, nextSection ? start + skillMatch[0].length + nextSection.index : text.length);
  }
  return sections;
}

function calculateBaseATSScore(normalizedResume, role) {
  const keywords = ATS_KEYWORDS[role] || ATS_KEYWORDS['generic'];
  let score = 0;
  let totalWeight = 0;
  const matched = [];
  const missing = [];

  keywords.must_have.forEach(kw => {
    const escapedKw = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Fuzzy match: allow optional s, es, ing, ed
    const regex = new RegExp(`\\b${escapedKw}(?:s|es|ing|ed)?\\b`, 'g');
    const count = (normalizedResume.match(regex) || []).length;
    if (count > 0) {
      matched.push(kw);
      score += keywords.weights.must_have; // 1 mention gives full base points
    } else {
      missing.push(kw);
    }
    totalWeight += keywords.weights.must_have;
  });

  keywords.nice_to_have.forEach(kw => {
    const escapedKw = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedKw}(?:s|es|ing|ed)?\\b`, 'g');
    const count = (normalizedResume.match(regex) || []).length;
    if (count > 0) {
      matched.push(kw);
      score += keywords.weights.nice_to_have; // 1 mention gives full base points
    } else {
      missing.push(kw);
    }
    totalWeight += keywords.weights.nice_to_have;
  });

  const finalScore = totalWeight > 0 ? (score / totalWeight) * 100 : 0;
  return { score: finalScore, matched, missing };
}

function calculateFinalATSScore(resumeText, jdText) {
  // Parse sections BEFORE normalization so we can match colons and newlines
  const resumeSections = parseResumeSections(resumeText);
  let skillsSectionRaw = resumeSections.skills;

  // Normalization
  let normResume = normalizeText(resumeText);
  let normJD = normalizeText(jdText);
  let normSkillsSection = normalizeText(skillsSectionRaw);

  // Synonyms and Expansions
  normResume = expandKeywords(applySynonyms(normResume), KEYWORD_EXPANSIONS);
  normJD = expandKeywords(applySynonyms(normJD), KEYWORD_EXPANSIONS);
  normSkillsSection = expandKeywords(applySynonyms(normSkillsSection), KEYWORD_EXPANSIONS);

  // Role detection
  const role = detectRoleFromJD(normJD);

  // Calculate scores with section weighting
  const baseResult = calculateBaseATSScore(normResume, role);
  let skillsSectionResult = { score: 0, matched: [], missing: [] };
  
  if (normSkillsSection.length > 0) {
    skillsSectionResult = calculateBaseATSScore(normSkillsSection, role);
    skillsSectionResult.score = Math.min(100, skillsSectionResult.score * 1.2); // Cap at 100
  } else {
    skillsSectionResult = baseResult;
  }

  const overallATSScore = Math.round((skillsSectionResult.score + baseResult.score) / 2);
  
  // Combine matched/missing from both
  const matchedSet = new Set([...baseResult.matched, ...skillsSectionResult.matched]);
  const missingSet = new Set([...baseResult.missing, ...skillsSectionResult.missing].filter(k => !matchedSet.has(k)));

  return {
    score: overallATSScore,
    matchedKeywords: Array.from(matchedSet),
    missingKeywords: Array.from(missingSet)
  };
}


  function redactPII(text) {
    if (!text) return '';
    // Redact emails
    text = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]');
    // Redact phone numbers (simple pattern for US/International)
    text = text.replace(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, '[REDACTED_PHONE]');
    // Redact URLs
    text = text.replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g, '[REDACTED_URL]');
    return text;
  }

  // Main analysis function
  function performAnalysis(resumeContentRaw, jobContent) {
    const resumeContent = redactPII(resumeContentRaw);
    
    const resumeSkills = extractSkills(resumeContent);
  const jobSkills = extractSkills(jobContent);

  const resumeEdu = extractEducation(resumeContent);
  const jobEdu = extractEducation(jobContent);

  const resumeYears = extractExperienceYears(resumeContent);
  const jobYears = extractExperienceYears(jobContent);

  const resumeLevel = extractSeniorityLevel(resumeContent);
  const jobLevel = extractSeniorityLevel(jobContent);

  const actionVerbs = extractActionVerbs(resumeContent);
  const metrics = extractMetrics(resumeContent);

  // Calculate matched and missing skills
  const matchedSkills = jobSkills.all.filter(s => resumeSkills.all.includes(s));
  const missingSkills = jobSkills.all.filter(s => !resumeSkills.all.includes(s));
  const extraSkills = resumeSkills.all.filter(s => !jobSkills.all.includes(s));

  // Skill match score
  const skillScore = jobSkills.all.length > 0
    ? Math.round((matchedSkills.length / jobSkills.all.length) * 100)
    : 50;

  // Experience score
  let expScore = 50;
  if (jobYears > 0) {
    if (resumeYears >= jobYears) expScore = 100;
    else if (resumeYears >= jobYears * 0.75) expScore = 85;
    else if (resumeYears >= jobYears * 0.5) expScore = 65;
    else expScore = Math.round((resumeYears / jobYears) * 80);
  } else if (resumeYears > 0) {
    expScore = Math.min(90, 50 + resumeYears * 5);
  }

  // Education score
  let eduScore = 50;
  if (jobEdu.length > 0 && resumeEdu.length > 0) {
    const eduMatched = jobEdu.filter(e => resumeEdu.includes(e));
    eduScore = Math.round((eduMatched.length / jobEdu.length) * 100);
    if (eduScore < 30) eduScore = 30; // minimum
  } else if (resumeEdu.length > 0) {
    eduScore = 70;
  }

  // ATS Score
  const atsResult = calculateFinalATSScore(resumeContent, jobContent);
  const atsScore = atsResult.score;
  
  // Backwards compatibility naming for the UI renderer if it expects keywordScore
  const keywordScore = atsScore;

  // Overall score (weighted based on new spec)
  const overallScore = Math.round(
    skillScore * 0.40 +
    atsScore * 0.20 +
    expScore * 0.25 +
    eduScore * 0.15
  );

  // Generate recommendations
  const recommendations = [];

  if (missingSkills.length > 0) {
    const topMissing = missingSkills.slice(0, 5).map(s => s.charAt(0).toUpperCase() + s.slice(1));
    recommendations.push({
      priority: 'high',
      title: 'Add Missing Technical Skills',
      description: `Your resume is missing ${missingSkills.length} skills mentioned in the job description. Key gaps: ${topMissing.join(', ')}. Consider adding relevant experience or projects that demonstrate these skills.`,
    });
  }

  if (actionVerbs.length < 5) {
    recommendations.push({
      priority: 'medium',
      title: 'Use More Action Verbs',
      description: 'Strong resumes use powerful action verbs. Consider starting bullet points with words like "Developed", "Architected", "Optimized", "Spearheaded", or "Delivered" to make your achievements more impactful.',
    });
  }

  if (metrics.length < 3) {
    recommendations.push({
      priority: 'high',
      title: 'Quantify Your Achievements',
      description: 'Adding measurable results (e.g., "Reduced load time by 40%", "Managed team of 8 engineers", "Increased revenue by $2M") significantly strengthens your resume and makes your impact tangible.',
    });
  }

  if (jobYears > 0 && resumeYears < jobYears) {
    recommendations.push({
      priority: 'medium',
      title: 'Address Experience Gap',
      description: `The job requires ${jobYears}+ years of experience, but your resume indicates ~${resumeYears} years. Highlight relevant projects, freelance work, or contributions that demonstrate equivalent expertise.`,
    });
  }

  if (extraSkills.length > 10) {
    recommendations.push({
      priority: 'low',
      title: 'Tailor Your Resume',
      description: 'Your resume lists many skills not mentioned in the job description. Consider tailoring your resume to emphasize the most relevant skills for this specific role to pass ATS filters more effectively.',
    });
  }

  if (overallScore < 60) {
    recommendations.push({
      priority: 'high',
      title: 'Consider a Resume Rewrite',
      description: 'Your compatibility score suggests significant gaps. Consider restructuring your resume to mirror the job description\'s language, prioritize matching skills at the top, and include a targeted summary statement.',
    });
  }

  if (overallScore >= 80) {
    recommendations.push({
      priority: 'low',
      title: 'Strong Match — Prepare for Interviews',
      description: 'Your resume is well-aligned with this role. Focus on preparing STAR-format stories for behavioral questions and deep-dive technical scenarios related to your matched skills.',
    });
  }

  if (atsScore < 60) {
    recommendations.push({
      priority: 'medium',
      title: 'Optimize for ATS Keywords',
      description: 'Many applicant tracking systems scan for specific keywords. Your ATS alignment is low. Mirror the exact terminology used in the job description to improve frequency and visibility.',
    });
  }

  return {
    overallScore,
    skillScore,
    expScore,
    eduScore,
    keywordScore, // Map it here so app.js doesn't break
    atsScore,
    matchedSkills: matchedSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
    missingSkills: missingSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
    extraSkills: extraSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
    matchedATSKeywords: atsResult.matchedKeywords.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
    missingATSKeywords: atsResult.missingKeywords.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
    resumeSkillCategories: resumeSkills.categories,
    jobSkillCategories: jobSkills.categories,
    resumeYears,
    jobYears,
    resumeLevel,
    jobLevel,
    actionVerbs,
    metrics,
    recommendations,
  };
}

  function getScoreTitle(score) {
  if (score >= 85) return 'Excellent Match! 🎯';
  if (score >= 70) return 'Strong Match 💪';
  if (score >= 55) return 'Good Potential 📈';
  if (score >= 40) return 'Needs Improvement 🔧';
  return 'Significant Gaps ⚠️';
}

  function getScoreDescription(data) {
  if (data.overallScore >= 85) {
    return `Your resume is an excellent match for this position. You possess ${data.matchedSkills.length} of the required skills, and your experience level aligns well with the role requirements. Apply with confidence!`;
  }
  if (data.overallScore >= 70) {
    return `Strong alignment with this role. You match ${data.matchedSkills.length} required skills with ${data.missingSkills.length} gaps to address. With minor adjustments, you'll be a competitive candidate.`;
  }
  if (data.overallScore >= 55) {
    return `Good foundation for this role. You have ${data.matchedSkills.length} matching skills but ${data.missingSkills.length} skill gaps. Focus on addressing the key missing skills and tailoring your resume.`;
  }
  return `There are notable gaps between your resume and this job's requirements. ${data.missingSkills.length} skills are missing. Review the recommendations below to strengthen your application.`;
}

  function getScoreBadges(data) {
  const badges = [];

  if (data.overallScore >= 85) badges.push({ text: 'Top Candidate', class: 'badge-excellent' });
  else if (data.overallScore >= 70) badges.push({ text: 'Strong Match', class: 'badge-good' });
  else if (data.overallScore >= 55) badges.push({ text: 'Potential Fit', class: 'badge-fair' });
  else badges.push({ text: 'Needs Work', class: 'badge-poor' });

  if (data.skillScore >= 80) badges.push({ text: 'Skills Aligned', class: 'badge-excellent' });
  if (data.expScore >= 80) badges.push({ text: 'Experience Match', class: 'badge-excellent' });
  if (data.metrics.length >= 3) badges.push({ text: 'Data-Driven', class: 'badge-good' });
  if (data.actionVerbs.length >= 8) badges.push({ text: 'Strong Language', class: 'badge-good' });
  if (data.missingSkills.length > 5) badges.push({ text: 'Skill Gaps', class: 'badge-poor' });

    return badges;
  }

  // Public API
  return {
    performAnalysis,
    getScoreTitle,
    getScoreDescription,
    getScoreBadges,
    // Exported for testing only
    _test: {
      normalizeText,
      expandKeywords,
      calculateFinalATSScore,
      detectRoleFromJD,
      parseResumeSections
    }
  };
})();

export { Analyzer as default };
