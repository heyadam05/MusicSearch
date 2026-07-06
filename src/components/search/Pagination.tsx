import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import styles from './Pagination.module.css'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function getVisiblePages(currentPage: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1)

  const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1])
  const sorted = [...pages].filter((page) => page > 0 && page <= totalPages).sort((a, b) => a - b)
  const result: Array<number | 'ellipsis'> = []

  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) result.push('ellipsis')
    result.push(page)
  })

  return result
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav className={styles.pagination} aria-label="Search result pages">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <FiChevronLeft />
      </button>
      {getVisiblePages(currentPage, totalPages).map((page, index) =>
        page === 'ellipsis' ? (
          <span key={`ellipsis-${index}`}>…</span>
        ) : (
          <button
            className={page === currentPage ? styles.active : ''}
            type="button"
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ),
      )}
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <FiChevronRight />
      </button>
    </nav>
  )
}
