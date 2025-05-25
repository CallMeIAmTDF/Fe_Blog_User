"use client"

import {useState, useEffect} from "react"
import Link from "next/link"
import {useRouter} from "next/navigation"
import {BarChart3, BookOpen, Calendar, Edit, Eye, Share2, User, Users} from "lucide-react"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {BlogCard} from "@/components/blog-card"
import {useAuth} from "@/contexts/auth-context"
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import type {PostSummaryResponse, UserResponse} from "@/types/api"
import {apiService} from "@/lib/api-service"
import {PageLoading, SectionLoading, BlogListSkeleton} from "@/components/loading-states"

interface FollowStats {
    follower: number
    following: number
}

interface UserProfileState {
    profile: UserResponse | null
    followStats: FollowStats | null
    blogs: PostSummaryResponse[]
    followers: any[]
    following: any[]
    isFollowing: boolean
    totalBlogs: number
    totalPages: number
    totalViews: number
}

export default function UserProfilePage({params}: { params: { id: string } }) {
    const router = useRouter()
    const {user, isAuthenticated} = useAuth()
    const [activeTab, setActiveTab] = useState("posts")
    const [currentPage, setCurrentPage] = useState(0)
    const [pageSize] = useState(10)

    // Trạng thái loading cho từng phần
    const [isLoadingProfile, setIsLoadingProfile] = useState(true)
    const [isLoadingFollowStats, setIsLoadingFollowStats] = useState(true)
    const [isLoadingBlogs, setIsLoadingBlogs] = useState(true)
    const [isLoadingFollowers, setIsLoadingFollowers] = useState(false)
    const [isLoadingFollowing, setIsLoadingFollowing] = useState(false)
    const [isTogglingFollow, setIsTogglingFollow] = useState(false)

    // Trạng thái lỗi
    const [error, setError] = useState<string | null>(null)

    // Dữ liệu người dùng
    const [userData, setUserData] = useState<UserProfileState>({
        profile: null,
        followStats: null,
        blogs: [],
        followers: [],
        following: [],
        totalViews: 0,
        isFollowing: false,
        totalBlogs: 0,
        totalPages: 0,
    })

    // Kiểm tra xem đây có phải là profile của người dùng hiện tại không
    const isCurrentUser = isAuthenticated && user?.id === params.id

    // Fetch thông tin profile người dùng
    useEffect(() => {
        async function fetchUserProfile() {
            try {
                setIsLoadingProfile(true)
                const response = await apiService.getUserById(params.id)

                if (response.code === 200) {
                    setUserData((prev) => ({
                        ...prev,
                        profile: response.data,
                    }))
                } else {
                    setError("Không thể tải thông tin người dùng")
                }
            } catch (error) {
                console.error("Error fetching user profile:", error)
                setError("Đã xảy ra lỗi khi tải thông tin người dùng")
            } finally {
                setIsLoadingProfile(false)
            }
        }

        fetchUserProfile()
    }, [params.id])

    // Fetch thông tin follow stats
    useEffect(() => {
        async function fetchFollowStats() {
            try {
                setIsLoadingFollowStats(true)
                const response = await apiService.getUserFollowStats(params.id)

                if (response.code === 200) {
                    setUserData((prev) => ({
                        ...prev,
                        followers: response.data.follower,
                        following: response.data.following,
                        followStats: {
                            follower: response.data.follower.length,
                            following: response.data.following.length,
                        },
                    }))
                }
            } catch (error) {
                console.error("Error fetching follow stats:", error)
            } finally {
                setIsLoadingFollowStats(false)
            }
        }

        fetchFollowStats()
    }, [params.id])

    // Fetch danh sách blog của người dùng
    useEffect(() => {
        async function fetchUserBlogs() {
            if (activeTab !== "posts") return
            try {
                setIsLoadingBlogs(true)
                const response = await apiService.getUserBlogs(params.id, currentPage, pageSize)

                if (response.code === 200) {
                    setUserData((prev) => ({
                        ...prev,
                        blogs: response.data.content,
                        totalBlogs: response.data.totalElements,
                        totalPages: response.data.totalPages,
                    }))
                }
            } catch (error) {
                console.error("Error fetching user blogs:", error)
            } finally {
                setIsLoadingBlogs(false)
            }
        }

        fetchUserBlogs()
    }, [params.id, activeTab, currentPage, pageSize])

    // Fetch trạng thái follow
    useEffect(() => {
        async function fetchFollowStatus() {
            if (!isAuthenticated || isCurrentUser) return

            try {
                const response = await apiService.checkFollowStatus(params.id, "")

                if (response.code === 200) {
                    setUserData((prev) => ({
                        ...prev,
                        isFollowing: response.data,
                    }))
                }
            } catch (error) {
                console.error("Error fetching follow status:", error)
            }
        }

        fetchFollowStatus()
    }, [params.id, isAuthenticated, isCurrentUser])

    // Xử lý khi chuyển tab
    const handleTabChange = (value: string) => {
        setActiveTab(value)

        if (value === "followers" && userData.followers.length === 0) {
            // Fetch followers khi cần
            // fetchFollowers()
        } else if (value === "following" && userData.following.length === 0) {
            // Fetch following khi cần
            // fetchFollowing()
        }
    }

    // Xử lý follow/unfollow
    const toggleFollow = async () => {
        if (!isAuthenticated) {
            router.push("/login")
            return
        }

        try {
            setIsTogglingFollow(true)

            // Cập nhật UI ngay lập tức (optimistic update)


            // Gọi API
            const response = await apiService.toggleFollow(params.id, userData.isFollowing)
            if (response.code === 200){
                setUserData((prev) => ({
                    ...prev,
                    isFollowing: !prev.isFollowing,
                    followStats: prev.followStats
                        ? {
                            ...prev.followStats,
                            follower: prev.isFollowing ? prev.followStats.follower - 1 : prev.followStats.follower + 1,
                        }
                        : null,
                    followers: prev.isFollowing
                        ? prev.followers.filter((f) => f.id !== response.data.followerId)
                        : [...prev.followers, user],
                }))
            }
            // if (response.code !== 200) {
            //     setUserData((prev) => ({
            //         ...prev,
            //         isFollowing: !prev.isFollowing,
            //         followStats: prev.followStats
            //             ? {
            //                 ...prev.followStats,
            //                 follower: !prev.isFollowing ? prev.followStats.follower - 1 : prev.followStats.follower + 1,
            //             }
            //             : null,
            //     }))
            // }
        } catch (error) {
            console.error("Error toggling follow:", error)

            // Hoàn tác cập nhật UI nếu có lỗi
            setUserData((prev) => ({
                ...prev,
                isFollowing: !prev.isFollowing,
                followStats: prev.followStats
                    ? {
                        ...prev.followStats,
                        follower: !prev.isFollowing ? prev.followStats.follower - 1 : prev.followStats.follower + 1,
                    }
                    : null,
            }))
        } finally {
            setIsTogglingFollow(false)
        }
    }

    // Hiển thị loading state khi đang tải thông tin cơ bản
    if (isLoadingProfile || isLoadingFollowStats) {
        return (
            <div className="container max-w-7xl mx-auto py-8 px-4 md:px-6">
                <PageLoading/>
            </div>
        )
    }

    // Hiển thị lỗi nếu có
    if (error || !userData.profile) {
        return (
            <div className="container max-w-7xl mx-auto py-8 px-4 md:px-6">
                <Alert variant="destructive">
                    <AlertTitle>Lỗi</AlertTitle>
                    <AlertDescription>
                        {error || "Không thể tìm thấy người dùng với ID này. Vui lòng kiểm tra lại URL hoặc quay lại trang chủ."}
                    </AlertDescription>
                </Alert>
                <div className="mt-4 flex justify-center">
                    <Button asChild>
                        <Link href="/">Quay lại trang chủ</Link>
                    </Button>
                </div>
            </div>
        )
    }

    const {profile, followStats, blogs, isFollowing} = userData

    return (
        <div className="container max-w-7xl mx-auto py-8 px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <Avatar className="h-24 w-24 mb-4">
                                <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name}/>
                                <AvatarFallback>{profile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex items-center gap-2 text-2xl font-bold">
                                {profile.name}
                                {profile?.gender === "MALE" ?
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                         fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                         stroke-linejoin="round" className="lucide lucide-mars-icon lucide-mars">
                                        <path d="M16 3h5v5"/>
                                        <path d="m21 3-6.75 6.75"/>
                                        <circle cx="10" cy="14" r="6"/>
                                    </svg> : profile.gender === "FEMALE" ?
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             viewBox="0 0 24 24" fill="none"
                                             stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                             stroke-linejoin="round"
                                             className="lucide lucide-venus-icon lucide-venus">
                                            <path d="M12 15v7"/>
                                            <path d="M9 19h6"/>
                                            <circle cx="12" cy="9" r="6"/>
                                        </svg> : ""}
                            </div>
                            <div className="text-sm text-muted-foreground mb-4">
                                <div className="flex items-center justify-center gap-1">
                                    <Calendar className="h-4 w-4"/>
                                    <span>{new Date(profile.dob).toLocaleDateString()}</span>
                                </div>
                            </div>
                            {isCurrentUser ? (
                                <div className="flex gap-2 w-full">
                                    <Link href="/users/edit-profile" className="w-full">
                                        <Button variant="outline" className="w-full gap-1">
                                            <Edit className="h-4 w-4"/>
                                            Chỉnh Sửa Hồ Sơ
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex gap-2 w-full">
                                    <Button
                                        variant={isFollowing ? "outline" : "default"}
                                        className="w-full gap-1"
                                        onClick={toggleFollow}
                                        disabled={isTogglingFollow}
                                    >
                                        <User className="h-4 w-4"/>
                                        {isFollowing ? "Đang Theo Dõi" : "Theo Dõi"}
                                    </Button>
                                    <Button variant="outline" size="icon">
                                        <Share2 className="h-4 w-4"/>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>Thống Kê</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <Eye className="h-4 w-4"/>
                                        <span className="text-sm">Lượt Xem</span>
                                    </div>
                                    <p className="text-2xl font-bold">{blogs.reduce((sum, blog) => sum + blog.viewsCount, 0)}</p>
                                </div>
                                <div className="space-y-1"  onClick={() => {setActiveTab('posts')}}>
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <BookOpen className="h-4 w-4"/>
                                        <span className="text-sm">Bài Viết</span>
                                    </div>
                                    <p className="text-2xl font-bold">{userData.totalBlogs}</p>
                                </div>
                                <div className="space-y-1" onClick={() => {setActiveTab('followers')}}>
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <Users className="h-4 w-4"/>
                                        <span className="text-sm">Follower</span>
                                    </div>
                                    <p className="text-2xl font-bold">{followStats?.follower || 0}</p>
                                </div>
                                <div className="space-y-1" onClick={() => {setActiveTab('following')}}>
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <User className="h-4 w-4"/>
                                        <span className="text-sm">Following</span>
                                    </div>
                                    <p className="text-2xl font-bold">{followStats?.following || 0}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>Phân Tích</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-center h-40 bg-muted rounded-md">
                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                    <BarChart3 className="h-8 w-8"/>
                                    <span className="text-sm">Xem phân tích chi tiết</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">
                    <Tabs defaultValue="posts" value={activeTab} onValueChange={handleTabChange} className="w-full">
                        <TabsList className="mb-4">
                            <TabsTrigger value="posts">Bài Viết</TabsTrigger>
                            <TabsTrigger value="followers">Người Theo Dõi</TabsTrigger>
                            <TabsTrigger value="following">Đang Theo Dõi</TabsTrigger>
                        </TabsList>

                        <TabsContent value="posts" className="mt-0 space-y-6">
                            {isCurrentUser && (
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-bold">Bài Viết Của Bạn</h3>
                                    <Link href="/blogs/new">
                                        <Button className="gap-1">
                                            <Edit className="h-4 w-4"/>
                                            Viết Bài Mới
                                        </Button>
                                    </Link>
                                </div>
                            )}

                            {isLoadingBlogs ? (
                                <BlogListSkeleton count={6}/>
                            ) : blogs.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {blogs.map((blog) => (
                                        blog.id !== "" && <BlogCard key={blog.id} post={blog} hideAuthor isAuthor={isCurrentUser} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 border rounded-lg">
                                    <h3 className="text-xl font-medium mb-2">Chưa có bài viết nào</h3>
                                    <p className="text-muted-foreground mb-4">
                                        {isCurrentUser
                                            ? "Hãy bắt đầu chia sẻ suy nghĩ của bạn với thế giới."
                                            : "Người dùng này chưa đăng bài viết nào."}
                                    </p>
                                    {isCurrentUser && (
                                        <Link href="/blogs/new">
                                            <Button>Viết Bài Đầu Tiên</Button>
                                        </Link>
                                    )}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="followers" className="mt-0">
                            <h3 className="text-xl font-bold mb-4">
                                Người Theo Dõi ({followStats?.follower || 0})
                            </h3>

                            {isLoadingFollowers ? (
                                <SectionLoading text="Đang tải danh sách người theo dõi..." />
                            ) : userData.followers.length === 0 ? (
                                <div className="text-center py-12 border rounded-lg">
                                    <p className="text-muted-foreground">Chưa có người theo dõi nào</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {userData.followers.map((follower) => (
                                        <div
                                            key={follower.id}
                                            className="flex items-center gap-4 p-4 border rounded-xl shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <Avatar className="h-16 w-16">
                                                <AvatarImage src={follower.avatar || "/placeholder.svg"} alt={follower.name} />
                                                <AvatarFallback>
                                                    {follower.name?.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <Link href={`/users/${follower.id}`} className="font-medium hover:underline">
                                                    {follower.name}
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="following" className="mt-0">
                            <h3 className="text-xl font-bold mb-4">
                                Đang Theo Dõi ({followStats?.following || 0})
                            </h3>

                            {isLoadingFollowing ? (
                                <SectionLoading text="Đang tải danh sách đang theo dõi..." />
                            ) : userData.following.length === 0 ? (
                                <div className="text-center py-12 border rounded-lg">
                                    <p className="text-muted-foreground">Chưa theo dõi ai</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {userData.following.map((u) => (
                                        <div
                                            key={u.id}
                                            className="flex items-center gap-4 p-4 border rounded-xl shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <Avatar className="h-16 w-16">
                                                <AvatarImage src={u.avatar || "/placeholder.svg"} alt={u.name} />
                                                <AvatarFallback>
                                                    {u.name?.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">
                                                    <Link href={`/users/${u.id}`} className="font-medium hover:underline">
                                                        {u.name}
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
