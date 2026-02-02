import { notFound } from 'next/navigation'
import Link from 'next/link'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import data from '../../../data.json'

interface Problem {
  id: string
  title: string
  description: string
  category: string
  path: string
}

async function getProblem(id: string): Promise<Problem | null> {
  const problem = data.find((p: Problem) => p.id === id)
  return problem || null
}

function getProblemCode(path: string): string {
  try {
    const filePath = join(process.cwd(), path)
    
    // Check if file exists
    if (!existsSync(filePath)) {
      return `// Code file not found at: ${path}\n// The file may need to be checked out from git.\n// Please run: git checkout ${path}`
    }
    
    const code = readFileSync(filePath, 'utf-8')
    return code
  } catch (error: any) {
    console.error(`Error reading file ${path}:`, error.message)
    return `// Error reading file at path: ${path}\n// Error: ${error.message}\n\n// Please ensure the file exists in the project directory.`
  }
}

function extractProblemStatement(code: string): string {
  // Try to extract problem statement from comments
  const lines = code.split('\n')
  const statementLines: string[] = []
  let inComment = false
  
  for (const line of lines) {
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) {
      const comment = line.replace(/^\/\/\s*|\/\*\s*|\s*\*\/|\s*\*/g, '').trim()
      if (comment && !comment.includes('@') && !comment.includes('TODO')) {
        statementLines.push(comment)
      }
    } else if (line.trim().startsWith('/**')) {
      inComment = true
    } else if (line.trim().startsWith('*/')) {
      inComment = false
    } else if (inComment && line.trim()) {
      const comment = line.replace(/^\s*\*\s?/, '').trim()
      if (comment && !comment.includes('@') && !comment.includes('TODO')) {
        statementLines.push(comment)
      }
    }
    
    // Stop if we hit actual code (not comments)
    if (!inComment && !line.trim().startsWith('//') && line.trim() && !line.trim().startsWith('*')) {
      break
    }
  }
  
  return statementLines.join('\n') || 'Problem statement not available in code file.'
}

function extractTestCases(code: string): Array<{ title: string; code: string }> {
  const testCases: Array<{ title: string; code: string }> = []
  const lines = code.split('\n')
  
  // Look for commented test cases or console.log statements
  let currentTest: { title: string; code: string } | null = null
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Check for commented test case markers
    if (line.includes('// Test') || line.includes('// Example') || line.includes('// expected')) {
      const testTitle = line.replace(/\/\/\s*(Test|Example|expected)\s*:?\s*/i, '').trim() || 'Test Case'
      currentTest = { title: testTitle, code: '' }
    }
    
    // Check for console.log statements (likely test cases)
    if (line.trim().startsWith('console.log')) {
      if (!currentTest) {
        currentTest = { title: 'Test Case', code: '' }
      }
      // Get the console.log and any following commented expected output
      let testCode = line.trim()
      if (i + 1 < lines.length && lines[i + 1].trim().startsWith('//')) {
        testCode += '\n' + lines[i + 1].trim()
        i++
      }
      currentTest.code += testCode + '\n'
    }
    
    // If we have a test case and hit a non-comment, non-console.log line, save it
    if (currentTest && currentTest.code && 
        !line.trim().startsWith('//') && 
        !line.trim().startsWith('console.log') &&
        line.trim() &&
        !line.trim().startsWith('*')) {
      testCases.push(currentTest)
      currentTest = null
    }
  }
  
  // Add last test case if exists
  if (currentTest && currentTest.code) {
    testCases.push(currentTest)
  }
  
  // If no test cases found, create a default one
  if (testCases.length === 0) {
    testCases.push({
      title: 'Example Usage',
      code: '// Check the code implementation for usage examples'
    })
  }
  
  return testCases
}

export default async function ProblemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const problem = await getProblem(id)
  
  if (!problem) {
    notFound()
  }
  
  const code = getProblemCode(problem.path)
  const problemStatement = extractProblemStatement(code)
  const testCases = extractTestCases(code)
  
  return (
    <div className="problem-detail">
      <div className="container">
        <Link href="/" className="back-link">
          ← Back to Problems
        </Link>
        
        <div className="problem-header">
          <h1>{problem.title}</h1>
          <div className="problem-meta">
            <span className="problem-category">{problem.category}</span>
          </div>
        </div>
        
        <div className="section">
          <h2>Problem Statement</h2>
          <div className="code-block" style={{ whiteSpace: 'pre-wrap', background: '#fff', padding: '20px', color: '#333' }}>
            {problem.description}
            {problemStatement && problemStatement !== problem.description && (
              <>
                {'\n\n'}
                {problemStatement}
              </>
            )}
          </div>
        </div>
        
        <div className="section">
          <h2>Solution Code</h2>
          <div className="code-block">
            {code}
          </div>
        </div>
        
        <div className="section">
          <h2>Test Cases</h2>
          {testCases.map((testCase, index) => (
            <div key={index} className="test-case">
              <h3>{testCase.title} {index + 1}</h3>
              <pre>{testCase.code}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

