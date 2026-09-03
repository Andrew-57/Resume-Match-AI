export const SKILL_CATEGORIES = {
  programming: [
    'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'golang', 'rust', 'swift',
    'kotlin', 'typescript', 'php', 'scala', 'perl', 'r', 'matlab', 'dart', 'lua',
    'objective-c', 'haskell', 'elixir', 'clojure', 'f#', 'vb.net', 'assembly',
    'coffeescript', 'groovy', 'shell', 'bash', 'powershell', 'sql', 'nosql', 'plsql'
  ],
  frontend: [
    'react', 'reactjs', 'react.js', 'angular', 'angularjs', 'vue', 'vuejs', 'vue.js',
    'svelte', 'nextjs', 'next.js', 'nuxt', 'nuxtjs', 'gatsby', 'html', 'html5',
    'css', 'css3', 'sass', 'scss', 'less', 'tailwind', 'tailwindcss', 'bootstrap',
    'material ui', 'chakra ui', 'styled-components', 'webpack', 'vite', 'rollup',
    'babel', 'jquery', 'redux', 'mobx', 'zustand', 'recoil', 'pinia', 'storybook',
    'responsive design', 'pwa', 'web components', 'shadow dom', 'graphql client'
  ],
  backend: [
    'node', 'nodejs', 'node.js', 'express', 'expressjs', 'fastify', 'nestjs', 'koa',
    'django', 'flask', 'fastapi', 'spring', 'spring boot', 'springboot', '.net', 'asp.net',
    'laravel', 'rails', 'ruby on rails', 'gin', 'fiber', 'actix', 'rocket',
    'microservices', 'rest', 'restful', 'api', 'graphql', 'grpc', 'websocket',
    'socket.io', 'rabbitmq', 'kafka', 'redis', 'celery', 'sidekiq', 'oauth', 'jwt'
  ],
  database: [
    'mysql', 'postgresql', 'postgres', 'mongodb', 'sqlite', 'oracle', 'sql server',
    'dynamodb', 'cassandra', 'couchdb', 'firebase', 'firestore', 'supabase',
    'neo4j', 'influxdb', 'elasticsearch', 'redis', 'memcached', 'prisma', 'sequelize',
    'typeorm', 'mongoose', 'sqlalchemy', 'knex', 'drizzle', 'database design',
    'data modeling', 'etl', 'data warehousing', 'bigquery', 'snowflake', 'redshift'
  ],
  cloud: [
    'aws', 'amazon web services', 'azure', 'gcp', 'google cloud', 'google cloud platform',
    'heroku', 'vercel', 'netlify', 'digitalocean', 'linode', 'cloudflare',
    'ec2', 's3', 'lambda', 'ecs', 'eks', 'fargate', 'cloudformation',
    'terraform', 'pulumi', 'ansible', 'chef', 'puppet', 'serverless',
    'cloud functions', 'cloud run', 'app engine', 'azure functions',
    'arm templates', 'bicep'
  ],
  devops: [
    'docker', 'kubernetes', 'k8s', 'helm', 'istio', 'jenkins', 'github actions',
    'gitlab ci', 'circle ci', 'travis ci', 'argo cd', 'spinnaker',
    'ci/cd', 'cicd', 'continuous integration', 'continuous deployment',
    'prometheus', 'grafana', 'datadog', 'new relic', 'splunk', 'elk',
    'nginx', 'apache', 'load balancing', 'service mesh', 'vault',
    'linux', 'unix', 'shell scripting', 'infrastructure as code', 'iac',
    'monitoring', 'logging', 'observability', 'site reliability', 'sre'
  ],
  data: [
    'machine learning', 'deep learning', 'ai', 'artificial intelligence',
    'neural networks', 'nlp', 'natural language processing', 'computer vision',
    'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'sklearn', 'pandas', 'numpy',
    'scipy', 'matplotlib', 'seaborn', 'plotly', 'jupyter', 'spark', 'hadoop',
    'data science', 'data analysis', 'data engineering', 'data pipeline',
    'feature engineering', 'model deployment', 'mlops', 'hugging face',
    'transformers', 'bert', 'gpt', 'llm', 'large language model',
    'reinforcement learning', 'generative ai', 'rag', 'langchain',
    'openai', 'stable diffusion', 'diffusion models'
  ],
  testing: [
    'jest', 'mocha', 'chai', 'cypress', 'playwright', 'selenium', 'puppeteer',
    'junit', 'pytest', 'rspec', 'testng', 'karma', 'jasmine', 'vitest',
    'testing library', 'rtl', 'enzyme', 'unit testing', 'integration testing',
    'e2e testing', 'tdd', 'bdd', 'test automation', 'qa', 'quality assurance',
    'load testing', 'performance testing', 'stress testing', 'a/b testing'
  ],
  design: [
    'figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator', 'invision',
    'zeplin', 'ui design', 'ux design', 'ui/ux', 'user experience',
    'user interface', 'wireframing', 'prototyping', 'design systems',
    'accessibility', 'wcag', 'a11y', 'information architecture',
    'user research', 'usability testing', 'interaction design'
  ],
  mobile: [
    'react native', 'flutter', 'ionic', 'xamarin', 'swiftui', 'uikit',
    'android', 'ios', 'mobile development', 'expo', 'capacitor',
    'cordova', 'android studio', 'xcode', 'app store', 'play store',
    'mobile testing', 'responsive', 'adaptive design'
  ],
  soft: [
    'leadership', 'communication', 'teamwork', 'problem solving', 'problem-solving',
    'critical thinking', 'project management', 'agile', 'scrum', 'kanban',
    'jira', 'confluence', 'trello', 'asana', 'notion', 'slack',
    'mentoring', 'coaching', 'presentation', 'public speaking',
    'stakeholder management', 'cross-functional', 'collaboration',
    'time management', 'adaptability', 'strategic thinking',
    'decision making', 'conflict resolution', 'negotiation',
    'analytical skills', 'attention to detail', 'self-motivated'
  ],
  security: [
    'cybersecurity', 'security', 'owasp', 'penetration testing', 'pen testing',
    'vulnerability assessment', 'encryption', 'ssl', 'tls', 'https',
    'authentication', 'authorization', 'sso', 'saml', 'ldap',
    'security audit', 'compliance', 'gdpr', 'hipaa', 'soc2', 'pci-dss',
    'firewall', 'ids', 'ips', 'siem', 'zero trust'
  ],
  blockchain: [
    'blockchain', 'ethereum', 'solidity', 'web3', 'smart contracts',
    'defi', 'nft', 'cryptocurrency', 'bitcoin', 'hyperledger',
    'truffle', 'hardhat', 'metamask', 'ipfs', 'dao'
  ]
};

// Pre-compiled regex patterns for speed
export const COMPILED_SKILLS = Object.entries(SKILL_CATEGORIES).map(([category, skills]) => ({
  category,
  patterns: skills.map(skill => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return {
      name: skill,
      regex: new RegExp(`(?:^|[^a-zA-Z0-9_#\\+])${escaped}(?:[^a-zA-Z0-9_#\\+]|$)`, 'i')
    };
  })
}));

export const EDUCATION_KEYWORDS = [
  'bachelor', 'master', 'phd', 'doctorate', 'mba', 'bsc', 'msc', 'ba', 'ma', 'bs', 'ms',
  'associate', 'diploma', 'certificate', 'certification', 'certified',
  'computer science', 'software engineering', 'information technology', 'it',
  'electrical engineering', 'mechanical engineering', 'data science',
  'mathematics', 'statistics', 'physics', 'business administration',
  'information systems', 'cybersecurity', 'artificial intelligence',
  'university', 'college', 'institute', 'school', 'bootcamp', 'academy',
  'degree', 'graduate', 'undergraduate', 'postgraduate',
  'aws certified', 'google certified', 'azure certified', 'cisco certified',
  'pmp', 'scrum master', 'csm', 'comptia', 'cissp', 'ceh'
];

export const COMPILED_EDUCATION = EDUCATION_KEYWORDS.map(kw => {
  const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return {
    kw,
    regex: new RegExp(`(?:^|[^a-zA-Z0-9_#\\+])${escaped}(?:[^a-zA-Z0-9_#\\+]|$)`, 'i')
  };
});

export const EXPERIENCE_PATTERNS = [
  /(\d+)\+?\s*years?\s*(of)?\s*(experience|exp)/gi,
  /(\d+)\+?\s*years?\s*(in|with|of)/gi,
  /(senior|lead|principal|staff|junior|mid|entry[\s-]level|intern)/gi,
  /(manager|director|vp|vice president|cto|ceo|architect|head of)/gi,
];

export const SENIORITY_LEVELS = [
  { level: 'executive', keywords: ['cto', 'ceo', 'cfo', 'coo', 'vp', 'vice president', 'director'] },
  { level: 'principal', keywords: ['principal', 'staff', 'distinguished', 'fellow'] },
  { level: 'senior', keywords: ['senior', 'sr.', 'sr ', 'lead', 'team lead', 'tech lead'] },
  { level: 'mid', keywords: ['mid-level', 'mid level', 'intermediate'] },
  { level: 'junior', keywords: ['junior', 'jr.', 'jr ', 'entry level', 'entry-level', 'associate'] },
  { level: 'intern', keywords: ['intern', 'internship', 'trainee', 'apprentice'] },
];

export const COMPILED_SENIORITY = SENIORITY_LEVELS.map(levelObj => ({
  level: levelObj.level,
  patterns: levelObj.keywords.map(kw => {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(?:^|[^a-zA-Z0-9_#\\+])${escaped}(?:[^a-zA-Z0-9_#\\+]|$)`, 'i');
  })
}));

export const ACTION_VERBS = [
  'developed', 'built', 'designed', 'implemented', 'created', 'managed', 'led',
  'optimized', 'improved', 'reduced', 'increased', 'automated', 'deployed',
  'maintained', 'architected', 'scaled', 'mentored', 'collaborated',
  'integrated', 'migrated', 'refactored', 'launched', 'delivered',
  'analyzed', 'researched', 'solved', 'streamlined', 'coordinated',
  'established', 'initiated', 'spearheaded', 'transformed', 'revolutionized'
];

export const COMPILED_ACTION_VERBS = ACTION_VERBS.map(verb => {
  const escaped = verb.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return {
    verb,
    regex: new RegExp(`(?:^|[^a-zA-Z0-9_#\\+])${escaped}(?:[^a-zA-Z0-9_#\\+]|$)`, 'i')
  };
});

// ATS Scoring Data

export const ATS_KEYWORDS = {
  software_engineer: {
    must_have: ['javascript', 'react', 'node.js', 'rest api', 'git', 'oop'],
    nice_to_have: ['typescript', 'webpack', 'jest', 'docker', 'sql'],
    weights: { must_have: 0.7, nice_to_have: 0.3 }
  },
  frontend: {
    must_have: ['html', 'css', 'javascript', 'react', 'responsive design'],
    nice_to_have: ['webpack', 'sass', 'figma', 'jest', 'vue'],
    weights: { must_have: 0.7, nice_to_have: 0.3 }
  },
  devops: {
    must_have: ['docker', 'kubernetes', 'ci/cd', 'aws', 'linux'],
    nice_to_have: ['terraform', 'ansible', 'prometheus', 'jenkins', 'scripting'],
    weights: { must_have: 0.7, nice_to_have: 0.3 }
  },
  data_scientist: {
    must_have: ['python', 'machine learning', 'sql', 'pandas', 'statistics'],
    nice_to_have: ['tensorflow', 'pytorch', 'aws', 'docker', 'nlp'],
    weights: { must_have: 0.7, nice_to_have: 0.3 }
  },
  generic: {
    must_have: ['communication', 'problem solving', 'teamwork'],
    nice_to_have: ['agile', 'project management', 'leadership'],
    weights: { must_have: 0.6, nice_to_have: 0.4 }
  }
};

export const ROLE_CLASSIFIERS = {
  software_engineer: [
    /\b(software engineer|full stack|backend|api|node\.js|java|python|c\+\+|oop)\b/i
  ],
  frontend: [
    /\b(frontend|front end|react|vue|angular|html|css|ui\/ux|responsive design)\b/i
  ],
  devops: [
    /\b(devops|sre|docker|kubernetes|jenkins|ci\/cd|terraform|aws|linux)\b/i
  ],
  data_scientist: [
    /\b(data scientist|machine learning|deep learning|nlp|tensorflow|pandas)\b/i
  ]
};

export const SYNONYM_MAP = {
  'api development': ['backend services', 'web services', 'restful apis'],
  'machine learning': ['ml', 'predictive modeling', 'data mining'],
  'unit testing': ['tdd', 'jest', 'mocha', 'chai'],
  'ui/ux': ['user interface', 'user experience', 'interaction design'],
  'ci/cd': ['continuous integration', 'continuous delivery', 'continuous deployment']
};

export const KEYWORD_EXPANSIONS = {
  'ci/cd': ['continuous integration', 'continuous delivery'],
  'oop': ['object oriented programming'],
  'aws': ['amazon web services', 'ec2', 's3', 'lambda'],
  'k8s': ['kubernetes'],
  'api': ['application programming interface'],
  'ml': ['machine learning'],
  'ui': ['user interface'],
  'ux': ['user experience']
};

