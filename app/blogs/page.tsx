"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { BlogCard } from "@/components/blog-card"
import { SearchBar, type SearchParams } from "@/components/search-bar"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import type { PostSummaryResponse, PageResponse, CategoryResponse } from "@/types/api"
import { apiService } from "@/lib/api-service"

export default function BlogsPage() {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: "",
    topics: [],
  })
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(12)
  const [blogPage, setBlogPage] = useState<PageResponse<PostSummaryResponse> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [topics, setTopics] = useState<CategoryResponse[]>([])
  const [isLoadingTopics, setIsLoadingTopics] = useState(true)

  // Fetch topics
  useEffect(() => {
    async function fetchTopics() {
      try {
        setIsLoadingTopics(true)
        const response = await apiService.getTopics()
        if (response.code === 200) {
          setTopics(response.data)
        }
      } catch (error) {
        console.error("Error fetching topics:", error)
      } finally {
        setIsLoadingTopics(false)
      }
    }

    fetchTopics()
  }, [])

  // Fetch blogs with pagination
  useEffect(() => {
    async function fetchBlogs() {
      try {
        setIsLoading(true)

        // Prepare filters
        const filters = {
          query: searchParams.query,
          minRating: searchParams.minRating,
          topics: searchParams.topics,
        }

        const response = await apiService.getBlogList(currentPage, pageSize, filters)

        if (response.code === 200) {
          setBlogPage(response.data)
        }
      } catch (error) {
        console.error("Error fetching blogs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogs()
  }, [currentPage, pageSize, searchParams])

  // Reset to first page when search params change
  useEffect(() => {
    setCurrentPage(0)
  }, [searchParams])

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Create array of page numbers to display
  const getPageNumbers = () => {
    if (!blogPage) return []

    const totalPages = blogPage.totalPages
    const current = blogPage.number

    // Show max 5 pages
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i)
    }

    // Always show current page and pages around it
    let startPage = Math.max(0, current - Math.floor(maxPagesToShow / 2))
    let endPage = startPage + maxPagesToShow - 1

    if (endPage >= totalPages) {
      endPage = totalPages - 1
      startPage = Math.max(0, endPage - maxPagesToShow + 1)
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
  }

  return (
      <div className="container max-w-7xl mx-auto py-8 px-4 md:px-6">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-4">Khám Phá Bài Viết</h1>
            {isLoadingTopics ? (
                <div className="h-20 flex items-center">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
            ) : (
                <SearchBar onSearch={handleSearch} topics={topics} />
            )}
          </div>

          <div>
            {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : blogPage && blogPage.content.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogPage.content.map((blog) => (
                        blog.id !== "" && <BlogCard key={blog.id} post={blog} hideAuthor={false} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {blogPage.totalPages > 1 && (
                      <Pagination className="mt-8">
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                                onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                                className={currentPage === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>

                          {getPageNumbers().map((pageNumber) => (
                              <PaginationItem key={pageNumber}>
                                <PaginationLink
                                    onClick={() => handlePageChange(pageNumber)}
                                    isActive={pageNumber === currentPage}
                                >
                                  {pageNumber + 1}
                                </PaginationLink>
                              </PaginationItem>
                          ))}

                          <PaginationItem>
                            <PaginationNext
                                onClick={() => handlePageChange(Math.min(blogPage.totalPages - 1, currentPage + 1))}
                                className={
                                  currentPage === blogPage.totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                                }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                  )}
                </>
            ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">Không tìm thấy bài viết nào</h3>
                  <p className="text-muted-foreground">
                    Hãy thử điều chỉnh tìm kiếm hoặc bộ lọc để tìm thấy nội dung bạn đang tìm kiếm.
                  </p>
                </div>
            )}
          </div>
        </div>
      </div>
  )
}
