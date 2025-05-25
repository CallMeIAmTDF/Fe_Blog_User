// Định nghĩa các kiểu dữ liệu
import type { PostSummaryResponse } from "@/types/api"

// Hàm giả lập API để lấy thông báo
export async function fetchNotifications() {
  // Giả lập độ trễ mạng
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Trả về dữ liệu giả lập
  return {
    code: 200,
    message: "Success",
    data: [
      {
        id: 2,
        uid: "123-123-123",
        message: "Người bạn theo dõi vừa đăng một bài viết mới!",
        postId: "hello-iamtdf-hehehe-58ee3f9a7da04a7193",
        postTitle: "Hello IAmTDF hehehe",
        read: false,
      },
      {
        id: 1,
        uid: "123-123-123",
        message: "Người bạn theo dõi vừa đăng một bài viết mới!",
        postId: "hello-iamtdf-1d3e5240c4634917a3",
        postTitle: "Hello IAmTDF",
        read: false,
      },
    ],
  }
}

// Hàm giả lập API để lấy chi tiết bài viết
export async function fetchBlogPost(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 800))
  return {
    code: 200,
    message: "Success",
    data: {
      id: id,
      userResponse: null,
      title: "Hello World!!!",
      content:
        "<h1>Trí Tuệ Nhân Tạo (AI)</h1>\n<h2>Khái niệm cơ bản</h2>\n<p>Trí tuệ nhân tạo là lĩnh vực của khoa học máy tính nhằm tạo ra các hệ thống có khả năng suy nghĩ và học hỏi như con người.</p>\n<h3>Ứng dụng của AI</h3>\n<p>AI được sử dụng trong nhiều lĩnh vực như y tế, tài chính, giáo dục và giao thông.</p>\n\n<h1>Phần Mềm</h1>\n<h2>Định nghĩa</h2>\n<p>34 hợp các chương trình và dữ liệu được thiết kế để thực hiện một nhiệm vụ cụ thể trên máy tính.</p>\n<h3>Các loại phần mềm</h3>\n<p>F**k mềm có thể được chia thành phần mềm hệ thống, phần mềm ứng dụng và phần mềm tiện ích.</p>\n\n<h1>AI trong Lập Trình Phần Mềm</h1>\n<h2>Tự động hóa quá trình phát triển</h2>\n<p>AI giúp tự động sinh mã, phát hiện lỗi và đề xuất cải tiến trong mã nguồn.</p>\n<h3>Ví dụ thực tế</h3>\n<p>Các công cụ như GitHub Copilot sử dụng AI để hỗ trợ lập trình viên viết mã hiệu quả hơn.</p>",
      viewsCount: 5,
      commentsCount: 7,
      summaryAi: null,
      hasSensitiveContent: true,
      rawContent:
        "<h1>Trí Tuệ Nhân Tạo (AI)</h1>\n<h2>Khái niệm cơ bản</h2>\n<p>Trí tuệ nhân tạo là lĩnh vực của khoa học máy tính nhằm tạo ra các hệ thống có khả năng suy nghĩ và học hỏi như con người.</p>\n<h3>Ứng dụng của AI</h3>\n<p>AI được sử dụng trong nhiều lĩnh vực như y tế, tài chính, giáo dục và giao thông.</p>\n\n<h1>Phần Mềm</h1>\n<h2>Định nghĩa</h2>\n<p>34 hợp các chương trình và dữ liệu được thiết kế để thực hiện một nhiệm vụ cụ thể trên máy tính.</p>\n<h3>Các loại phần mềm</h3>\n<p>Fuck mềm có thể được chia thành phần mềm hệ thống, phần mềm ứng dụng và phần mềm tiện ích.</p>\n\n<h1>AI trong Lập Trình Phần Mềm</h1>\n<h2>Tự động hóa quá trình phát triển</h2>\n<p>AI giúp tự động sinh mã, phát hiện lỗi và đề xuất cải tiến trong mã nguồn.</p>\n<h3>Ví dụ thực tế</h3>\n<p>Các công cụ như GitHub Copilot sử dụng AI để hỗ trợ lập trình viên viết mã hiệu quả hơn.</p>",
      comments: [
        {
          id: 5,
          content: "123132",
          userResponse: null,
          leftValue: 1,
          rightValue: 2,
          replies: [],
        },
        {
          id: 6,
          content: "comment",
          userResponse: null,
          leftValue: 3,
          rightValue: 4,
          replies: [],
        },
        {
          id: 7,
          content: "comment 3",
          userResponse: null,
          leftValue: 5,
          rightValue: 14,
          replies: [
            {
              id: 8,
              content: "comment 3",
              userResponse: null,
              leftValue: 6,
              rightValue: 7,
              replies: [],
            },
            {
              id: 9,
              content: "comment 3",
              userResponse: null,
              leftValue: 8,
              rightValue: 9,
              replies: [],
            },
            {
              id: 10,
              content: "comment 3",
              userResponse: null,
              leftValue: 10,
              rightValue: 11,
              replies: [],
            },
            {
              id: 11,
              content: "comment 5",
              userResponse: null,
              leftValue: 12,
              rightValue: 13,
              replies: [],
            },
          ],
        },
      ],
      category: ["Technology", "Entertainment", "Science"],
      hashtags: ["test", "thaidang"],
      relatedPosts: [
        {
          id: "hello-world-9e26e73dc5ee4b65a1",
          title: "Hello World!!!",
          excerpt:
            "<h1>Trí Tuệ Nhân Tạo (AI)</h1>\n<h2>Khái niệm cơ bản</h2>\n<p>Trí tuệ nhân tạo là lĩnh vực của khoa họ",
          userResponse: null,
          viewsCount: 0,
          commentsCount: 0,
          hasSensitiveContent: true,
          category: ["Technology", "Entertainment", "Science"],
          createdAt: "2025-04-08T11:50:33",
        },
        {
          id: "hello-world-32aba9aea21f4f38bc",
          title: "Hello World!!!",
          excerpt:
            "<h1>Trí Tuệ Nhân Tạo (AI)</h1>\n<h2>Khái niệm cơ bản</h2>\n<p>Trí tuệ nhân tạo là lĩnh vực của khoa họ",
          userResponse: null,
          viewsCount: 17,
          commentsCount: 1,
          hasSensitiveContent: true,
          category: ["Technology", "Entertainment", "Science"],
          createdAt: "2025-04-08T11:39:44",
        },
      ],
      createdAt: "2025-04-08T11:41:38",
    },
  }
}

// Hàm giả lập API để lấy thông tin người dùng và số lượng follower/following
export async function fetchUserProfile(userId: string) {
  // Giả lập độ trễ mạng
  await new Promise((resolve) => setTimeout(resolve, 600))

  // Trả về dữ liệu giả lập
  return {
    code: 200,
    message: "Success",
    data: {
      id: userId,
      name: "Nguyễn Văn A",
      avatar: "/placeholder.svg?height=100&width=100&text=NVA",
      bio: "Người đam mê công nghệ và viết lách với hơn 10 năm kinh nghiệm trong ngành. Tôi viết về AI, lập trình và tương lai của công nghệ.",
      joinedDate: "2020-06-15",
      stats: {
        totalViews: 45280,
        totalPosts: 32,
      },
      blogs: [
        {
          id: "blog-1",
          title: "Hiểu Về Tương Lai Của Công Nghệ: Phần 1",
          excerpt:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          viewsCount: 150,
          commentsCount: 5,
          hasSensitiveContent: false,
          category: ["Công Nghệ", "AI", "Tương Lai"],
          createdAt: "2023-12-30T00:00:00Z",
        },
        {
          id: "blog-2",
          title: "Hiểu Về Tương Lai Của Công Nghệ: Phần 2",
          excerpt:
            "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          viewsCount: 250,
          commentsCount: 8,
          hasSensitiveContent: false,
          category: ["Công Nghệ", "AI", "Tương Lai"],
          createdAt: "2023-12-25T00:00:00Z",
        },
      ],
    },
  }
}

// Hàm giả lập API để lấy thông tin follower/following
export async function fetchFollowStats(userId: string) {
  // Giả lập độ trễ mạng
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Trả về dữ liệu giả lập
  return {
    code: 200,
    message: "Success",
    data: {
      follower: 1,
      following: 0,
    },
  }
}

// Hàm giả lập API để kiểm tra trạng thái follow
export async function checkFollowStatus(userId: string) {
  // Giả lập độ trễ mạng
  await new Promise((resolve) => setTimeout(resolve, 200))

  // Trả về dữ liệu giả lập
  return {
    code: 200,
    message: "Success",
    data: false,
  }
}

// Hàm giả lập API để lấy danh sách bài viết
export async function fetchBlogList(page = 0, size = 10, filters?: any) {
  // Giả lập độ trễ mạng
  await new Promise((resolve) => setTimeout(resolve, 700))

  // Tạo danh sách bài viết giả lập
  const totalItems = 100
  const items: PostSummaryResponse[] = Array.from({ length: size }, (_, i) => {
    const index = page * size + i
    if (index >= totalItems) return null

    return {
      id: `blog-${index}`,
      title: `Bài viết ${index}: Hiểu Về Tương Lai Của Công Nghệ`,
      excerpt:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      userResponse:
        index % 3 === 0
          ? null
          : {
              id: `user-${index % 5}`,
              name: `Tác giả ${index % 5}`,
              avatar: `/placeholder.svg?height=40&width=40&text=A${index % 5}`,
            },
      viewsCount: 100 + index * 10,
      commentsCount: 5 + (index % 10),
      hasSensitiveContent: index % 7 === 0,
      category: ["Technology", "AI", index % 2 === 0 ? "Future" : "Science"],
      createdAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
    }
  }).filter(Boolean) as PostSummaryResponse[]

  // Trả về dữ liệu giả lập với định dạng phân trang
  return {
    code: 200,
    message: "Success",
    data: {
      content: items,
      pageable: {
        pageNumber: page,
        pageSize: size,
        sort: {
          empty: false,
          sorted: true,
          unsorted: false,
        },
        offset: page * size,
        unpaged: false,
        paged: true,
      },
      last: (page + 1) * size >= totalItems,
      totalElements: totalItems,
      totalPages: Math.ceil(totalItems / size),
      size: size,
      number: page,
      sort: {
        empty: false,
        sorted: true,
        unsorted: false,
      },
      first: page === 0,
      numberOfElements: items.length,
      empty: items.length === 0,
    },
  }
}
