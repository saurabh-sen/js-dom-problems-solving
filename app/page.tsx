'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import data from '../data.json'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = [
    'DOM Manipulation',
    'Promise & Async Operations',
    'Rate Limiting & Performance',
    'Data Structures & Algorithms',
    'Object-Oriented Programming',
    'Timers & Utilities',
    'Closure',
    'Problem Solving',
    'Machine Coding',
    'Pollyfills'
  ]

  const filteredProblems = useMemo(() => {
    return data.filter(problem => {
      const matchesSearch = 
        problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === null || 
        problem.category.toLowerCase() === selectedCategory.toLowerCase()
      
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  return (
    <div className="container">
      <h1>Frontend Questions - Examples</h1>

      <div className="stats-bar">
        <div>
          <span>Total Problems: </span>
          <span className="stats-number">{filteredProblems.length}</span>
        </div>
      </div>

      <div className="search-filter-container">
        <input
          type="text"
          className="search-box"
          placeholder="Search problems..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="filter-buttons">
          <button
            className={`filter-btn ${selectedCategory === null ? 'active' : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="problems-grid">
        {filteredProblems.map(problem => (
          <Link
            key={problem.id}
            href={`/problem/${problem.id}`}
            className="problem-card"
          >
            <div className="problem-title">{problem.title}</div>
            <div className="problem-description">{problem.description}</div>
            <span className="problem-category">{problem.category}</span>
          </Link>
        ))}
      </div>

      {filteredProblems.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No problems found. Try adjusting your search or filter.
        </div>
      )}
    </div>
  )
}

