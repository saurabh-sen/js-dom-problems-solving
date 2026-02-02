import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container">
      <h1>Problem Not Found</h1>
      <p>The problem you're looking for doesn't exist.</p>
      <Link href="/" className="back-link">
        ← Back to Problems
      </Link>
    </div>
  )
}

