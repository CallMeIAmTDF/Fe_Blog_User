"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import type { CategoryResponse } from "@/types/api"

interface SearchBarProps {
  onSearch: (params: SearchParams) => void
  topics: CategoryResponse[]
}

export interface SearchParams {
  query: string
  minRating?: number
  topics?: string[]
}

export function SearchBar({ onSearch, topics }: SearchBarProps) {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: "",
    minRating: 0,
    topics: [],
  })
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)

  // Debounce search function
  const debouncedSearch = useCallback(
      debounce((params: SearchParams) => {
        onSearch(params)
      }, 50),
      [onSearch],
  )

  // Call search when query changes
  useEffect(() => {
    debouncedSearch(searchParams)
  }, [searchParams, debouncedSearch])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ ...searchParams, query: e.target.value })
  }

  const handleTopicToggle = (topicId: number) => {
    setSearchParams((prev) => {
      const currentTopics = prev.topics || []
      const topicIdStr = String(topicId)
      const newTopics = currentTopics.includes(topicIdStr)
          ? currentTopics.filter((id) => id !== topicIdStr)
          : [...currentTopics, topicIdStr]

      return {
        ...prev,
        topics: newTopics,
      }
    })
  }


  const clearFilters = () => {
    const resetParams = {
      query: searchParams.query,
      minRating: 0,
      topics: [],
    }
    setSearchParams(resetParams)
    onSearch(resetParams) // Call API immediately when clearing filters
  }

  const applyFilters = () => {
    onSearch(searchParams)
    setIsAdvancedOpen(false)
  }

  const hasActiveFilters = (searchParams.minRating || 0) > 0 || (searchParams.topics || []).length > 0

  return (
      <div className="w-full space-y-2">
        <div className="flex w-full items-center space-x-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Tìm blogs..."
                className="w-full pl-8"
                value={searchParams.query}
                onChange={handleInputChange}
            />
          </div>
          <Popover open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <PopoverTrigger asChild>
              <Button variant={hasActiveFilters ? "default" : "outline"} size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Advanced Search</h4>
                  {hasActiveFilters && (
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2">
                        <X className="h-4 w-4 mr-1" /> Clear filters
                      </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Topics</h5>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((topic) => {
                      const isSelected = (searchParams.topics || []).includes(String(topic.id))
                      return (
                          <Badge
                              key={topic.id}
                              variant={isSelected ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => handleTopicToggle(topic.id)}
                          >
                            {topic.cdesc}
                          </Badge>
                      )
                    })}
                  </div>
                </div>
                <Button className="w-full" onClick={applyFilters}>
                  Apply Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {(searchParams.topics || []).map((topicId) => {
                const topic = topics.find((t) => String(t.id) === topicId)
                if (!topic) return null
                return (
                    <Badge key={topicId} variant="secondary" className="flex items-center gap-1">
                      {topic.cdesc}
                      <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleTopicToggle(topic.id)} />
                    </Badge>
                )
              })}
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 px-2">
                Clear all
              </Button>
            </div>
        )}
      </div>
  )
}

// Debounce helper function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
