'use client';

import { useRouter } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export function BlogPaginationControls({
  currentPage,
  totalPages,
  search,
}: {
  currentPage: number;
  totalPages: number;
  search?: string; // รับ search มาจาก parent แทนการอ่าน useSearchParams เอง
}) {
  const router = useRouter();

  if (totalPages <= 1) return null;

  function buildUrl(page: number) {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    params.set('page', String(page));
    return `/blogs?${params.toString()}`;
  }

  function handlePageChange(page: number) {
    router.push(buildUrl(page));
  }

  return (
    <Pagination className="mt-10">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => handlePageChange(page)}
              isActive={page === currentPage}
              className="cursor-pointer"
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}