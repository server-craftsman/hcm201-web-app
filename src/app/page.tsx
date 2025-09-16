import { Metadata } from 'next'
import {
  ChartBarIcon,
  TrophyIcon,
  FireIcon,
  UsersIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Dashboard - Trang chủ',
  description: 'Dashboard quản lý học tập và thảo luận về tư tưởng Hồ Chí Minh.',
  openGraph: {
    title: 'HCM201 Dashboard - Trang chủ',
    description: 'Dashboard quản lý học tập và thảo luận về tư tưởng Hồ Chí Minh',
  },
}

export default function HomePage() {
  const stats = [
    {
      title: 'Cuộc tranh luận',
      value: '12',
      change: '+2 tuần này',
      icon: ChatBubbleLeftRightIcon,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Bài học hoàn thành',
      value: '24',
      change: '+8 tuần này',
      icon: BookOpenIcon,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Điểm số',
      value: '1,450',
      change: '+120 tuần này',
      icon: TrophyIcon,
      color: 'from-amber-500 to-amber-600'
    },
    {
      title: 'Xếp hạng',
      value: '#15',
      change: '+3 vị trí',
      icon: ArrowTrendingUpIcon,
      color: 'from-purple-500 to-purple-600'
    }
  ]

  const recentActivities = [
    {
      type: 'debate',
      title: 'Tham gia tranh luận "Tư tưởng đạo đức HCM"',
      time: '2 giờ trước',
      icon: ChatBubbleLeftRightIcon
    },
    {
      type: 'study',
      title: 'Hoàn thành bài học "Chủ nghĩa yêu nước"',
      time: '1 ngày trước',
      icon: BookOpenIcon
    },
    {
      type: 'achievement',
      title: 'Đạt huy hiệu "Người thảo luận tích cực"',
      time: '3 ngày trước',
      icon: TrophyIcon
    }
  ]

  const quickActions = [
    {
      title: 'Tạo tranh luận mới',
      description: 'Khởi tạo chủ đề thảo luận',
      href: '/debates/create',
      icon: PlusIcon,
      color: 'bg-gradient-to-r from-red-500 to-amber-500'
    },
    {
      title: 'Tiếp tục học tập',
      description: 'Học bài tiếp theo',
      href: '/study',
      icon: AcademicCapIcon,
      color: 'bg-gradient-to-r from-blue-500 to-purple-500'
    },
    {
      title: 'Khám phá cộng đồng',
      description: 'Kết nối với bạn bè',
      href: '/community',
      icon: UsersIcon,
      color: 'bg-gradient-to-r from-green-500 to-teal-500'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-red-500 via-red-600 to-amber-500 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2 font-geist">
            Chào mừng trở lại! 👋
          </h1>
          <p className="text-red-100 text-lg mb-6">
            Tiếp tục hành trình khám phá tư tưởng Hồ Chí Minh cùng chúng tôi
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors px-4 py-2 rounded-lg text-sm font-medium">
              Xem tiến độ học tập
            </button>
            <button className="bg-white text-red-600 hover:bg-red-50 transition-colors px-4 py-2 rounded-lg text-sm font-medium">
              Tranh luận nổi bật
            </button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 opacity-20">
          <SparklesIcon className="h-20 w-20" />
        </div>
        <div className="absolute bottom-4 right-20 opacity-10">
          <FireIcon className="h-16 w-16" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                {stat.change}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-neutral-900 dark:text-white font-geist">
                {stat.value}
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {stat.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Featured Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Highlight */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white font-geist">
                Nổi bật hôm nay
              </h2>
              <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                Xem tất cả →
              </span>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FireIcon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-neutral-900 dark:text-white mb-2">
                    "Tư tưởng đạo đức của Hồ Chí Minh trong xã hội hiện đại"
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3">
                    Cuộc tranh luận sôi nổi với 156 lượt tham gia và 89 bình luận. Khám phá những quan điểm đa dạng về ứng dụng tư tưởng đạo đức...
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center space-x-1">
                      <UsersIcon className="h-4 w-4" />
                      <span>156 người tham gia</span>
                    </span>
                    <span>•</span>
                    <span>2 giờ trước</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6 font-geist">
              Hành động nhanh
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="group p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all duration-300 hover:shadow-md"
                >
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {action.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-4 font-geist">
              Hoạt động gần đây
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-neutral-100 to-neutral-200 dark:from-neutral-700 dark:to-neutral-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <activity.icon className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
              Xem tất cả hoạt động
            </button>
          </div>

          {/* Progress Summary */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-4 font-geist">
              Tiến độ tuần này
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-neutral-600 dark:text-neutral-400">Bài học</span>
                  <span className="font-medium text-neutral-900 dark:text-white">8/10</span>
                </div>
                <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-neutral-600 dark:text-neutral-400">Tranh luận</span>
                  <span className="font-medium text-neutral-900 dark:text-white">3/5</span>
                </div>
                <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-neutral-600 dark:text-neutral-400">Bài tập</span>
                  <span className="font-medium text-neutral-900 dark:text-white">12/15</span>
                </div>
                <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}