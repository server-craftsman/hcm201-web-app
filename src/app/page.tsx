'use client'

import { Metadata } from 'next'
import React, { useState, useEffect } from 'react'
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
  PlusIcon,
  PlayIcon,
  StarIcon,
  HeartIcon,
  LightBulbIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MusicalNoteIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'
import Banner from '@/shared/assets/images/banner.jpg'
// import static imgs
import staticImg1 from '@/shared/assets/images/overview/1.jpg'
import staticImg2 from '@/shared/assets/images/overview/2.jpg'
import staticImg3 from '@/shared/assets/images/overview/3.jpg'
import staticImg4 from '@/shared/assets/images/overview/4.jpg'
import staticImg5 from '@/shared/assets/images/overview/5.jpg'


const metadata: Metadata = {
  title: 'Trang chủ - Tư tưởng Hồ Chí Minh',
  description: 'Nền tảng học tập và thảo luận chuyên nghiệp về tư tưởng Hồ Chí Minh. Khám phá, học hỏi và chia sẻ kiến thức cùng cộng đồng.',
  openGraph: {
    title: 'Tư tưởng Hồ Chí Minh - Nền tảng học tập chuyên nghiệp',
    description: 'Nền tảng học tập và thảo luận chuyên nghiệp về tư tưởng Hồ Chí Minh',
  },
}

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const sliderContent = [
    {
      title: "Tư tưởng",
      subtitle: "Hồ Chí Minh",
      description: "Nền tảng học tập và thảo luận chuyên nghiệp về tư tưởng vĩ đại của Chủ tịch Hồ Chí Minh",
      cta: "Bắt đầu học tập",
      ctaSecondary: "Tham gia tranh luận",
      icon: PlayIcon,
      iconSecondary: ChatBubbleLeftRightIcon
    },
    {
      title: "Khám phá",
      subtitle: "Tri thức",
      description: "Học hỏi và hiểu sâu về những giá trị tư tưởng, đạo đức và nhân văn của Bác Hồ",
      cta: "Khám phá ngay",
      ctaSecondary: "Xem bài học",
      icon: LightBulbIcon,
      iconSecondary: BookOpenIcon
    },
    {
      title: "Kết nối",
      subtitle: "Cộng đồng",
      description: "Tham gia thảo luận sôi nổi với hàng nghìn thành viên cùng chí hướng",
      cta: "Tham gia ngay",
      ctaSecondary: "Xem cộng đồng",
      icon: UsersIcon,
      iconSecondary: HeartIcon
    },
    {
      title: "Phát triển",
      subtitle: "Bản thân",
      description: "Nâng cao hiểu biết và phát triển kỹ năng tư duy phản biện qua các hoạt động học tập",
      cta: "Bắt đầu phát triển",
      ctaSecondary: "Xem tiến độ",
      icon: ArrowTrendingUpIcon,
      iconSecondary: ChartBarIcon
    }
  ]

  const lifeTimeline = [
    {
      year: '1890',
      title: 'Sinh ra tại Nghệ An',
      description: 'Chào đời tại làng Kim Liên, Nam Đàn, Nghệ An, mở đầu hành trình lịch sử.',
      image: staticImg1,
    },
    {
      year: '1911',
      title: 'Rời Tổ quốc ra đi tìm đường cứu nước',
      description: 'Lên tàu rời bến Nhà Rồng, bắt đầu hành trình khắp năm châu bốn biển.',
      image: staticImg2,
    },
    {
      year: '1930',
      title: 'Sáng lập Đảng Cộng sản Việt Nam',
      description: 'Đặt nền móng cho con đường giải phóng dân tộc, thống nhất đất nước.',
      image: staticImg3,
    },
    {
      year: '1945',
      title: 'Tuyên ngôn độc lập',
      description: 'Khai sinh nước Việt Nam Dân chủ Cộng hoà tại Quảng trường Ba Đình.',
      image: staticImg4,
    },
    {
      year: '1969',
      title: 'Di sản tư tưởng, đạo đức',
      description: 'Để lại di sản tư tưởng, đạo đức, phong cách vô giá cho các thế hệ sau.',
      image: staticImg5,
    },
  ]

  const podcasts = [
    {
      title: 'Bài Ca Hồ Chí Minh',
      subtitle: 'Bài ca tự hào của dân tộc Việt Nam',
      cover: '/audios/cover/1.jpg',
      src: '/audios/bai-ca-ho-chi-minh.mp3',
      duration: '03:31',
    },
    {
      title: 'Ca ngợi Hồ Chủ tịch',
      subtitle: 'Giai điệu trang trọng dành cho lãnh tụ kính yêu',
      cover: '/audios/cover/2.jpg',
      src: '/audios/ca-ngoi-ho-chu-tich.mp3',
      duration: '03:36',
    },
    {
      title: 'Như có Bác Hồ trong ngày vui đại thắng',
      subtitle: 'Âm hưởng rộn ràng của ngày thống nhất',
      cover: '/audios/cover/3.jpg',
      src: '/audios/nhu-co-bac-ho-trong-ngay-vui-dai-thang.mp3',
      duration: '03:11',
    },
    {
      title: 'Tiếng hát giữa rừng Pác Bó',
      subtitle: 'Âm vang chiến khu và niềm tin cách mạng',
      cover: '/audios/cover/4.jpg',
      src: '/audios/tieng-hat-giua-rung-pac-bo.mp3',
      duration: '05:42',
    },
    {
      title: 'Bác đang cùng chúng cháu hành quân',
      subtitle: 'Tình cảm của thế hệ trẻ dành cho Bác',
      cover: '/audios/cover/5.jpg',
      src: '/audios/bac-dang-cung-chung-chau-hanh-quan.mp3',
      duration: '03:56',
    },

    {
      title: 'Bác Hồ một tình yêu bao la',
      subtitle: 'Thiêng liêng và sâu lắng',
      cover: '/audios/cover/6.jpg',
      src: '/audios/bac-ho-mot-tinh-yeu-bao-la.mp3',
      duration: '04:28',
    },
    {
      title: 'Hồ Chí Minh đẹp nhất tên Người',
      subtitle: 'Khúc ca ngợi Bác sâu nặng nghĩa tình',
      cover: '/audios/cover/7.jpg',
      src: '/audios/ho-chi-minh-dep-nhat-ten-nguoi.mp3',
      duration: '04:27',
    },
  ]

  const features = [
    {
      title: 'Học tập tương tác',
      description: 'Khám phá tư tưởng Hồ Chí Minh qua các bài học đa phương tiện và tương tác',
      icon: BookOpenIcon,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Tranh luận sôi nổi',
      description: 'Tham gia thảo luận với cộng đồng về các chủ đề tư tưởng quan trọng',
      icon: ChatBubbleLeftRightIcon,
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Cộng đồng học tập',
      description: 'Kết nối với những người cùng chí hướng và chia sẻ kiến thức',
      icon: UsersIcon,
      color: 'from-purple-500 to-violet-600'
    },
    {
      title: 'Tiến độ theo dõi',
      description: 'Theo dõi quá trình học tập và đạt được các mục tiêu cá nhân',
      icon: ChartBarIcon,
      color: 'from-orange-500 to-amber-600'
    }
  ]

  const stats = [
    { value: '2,500+', label: 'Thành viên', icon: UsersIcon },
    { value: '150+', label: 'Bài học', icon: BookOpenIcon },
    { value: '500+', label: 'Tranh luận', icon: ChatBubbleLeftRightIcon },
    { value: '98%', label: 'Hài lòng', icon: StarIcon }
  ]

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)

  const quotes = [
    {
      text: "Học tập là một việc suốt đời",
      author: "Chủ tịch Hồ Chí Minh"
    },
    {
      text: "Đoàn kết, đoàn kết, đại đoàn kết. Thành công, thành công, đại thành công",
      author: "Chủ tịch Hồ Chí Minh"
    },
    {
      text: "Không có gì quý hơn độc lập, tự do",
      author: "Chủ tịch Hồ Chí Minh"
    },
    {
      text: "Cần, kiệm, liêm, chính, chí công vô tư",
      author: "Chủ tịch Hồ Chí Minh"
    }
  ]

  // Auto-play slider
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderContent.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, sliderContent.length])

  // Auto-play quotes slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length)
    }, 4000) // Change quote every 4 seconds

    return () => clearInterval(interval)
  }, [quotes.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderContent.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderContent.length) % sliderContent.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  const nextQuote = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length)
  }

  const prevQuote = () => {
    setCurrentQuoteIndex((prev) => (prev - 1 + quotes.length) % quotes.length)
  }

  const goToQuote = (index: number) => {
    setCurrentQuoteIndex(index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with Banner image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={Banner}
            alt="Ho Chi Minh Banner"
            fill
            className="object-cover"
            priority
          />
          {/* Animated overlay effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse z-20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 z-20"></div>
        </div>

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            {/* Main Title with Hyper Speed Effects */}
            <div className="space-y-8">
              <div className="relative">
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  <span className="block animate-pulse hover:animate-none transition-all duration-300">
                    <span className="inline-block hover:scale-110 hover:rotate-1 transition-transform duration-500 ease-out text-white drop-shadow-lg">
                      {sliderContent[currentSlide].title}
                    </span>
                  </span>
                  <span className="block relative">
                    <span className="text-yellow-300 animate-pulse hover:animate-none transition-all duration-300 drop-shadow-lg">
                      {sliderContent[currentSlide].subtitle}
                    </span>
                  </span>
                </h1>
                {/* Speed lines effect */}
                <div className="absolute -top-4 -left-4 w-full h-2 bg-gradient-to-r from-transparent via-yellow-400/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                <div className="absolute -bottom-4 -right-4 w-full h-2 bg-gradient-to-r from-transparent via-yellow-400/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 animate-pulse delay-150"></div>
              </div>

              <div className="relative">
                <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
                  <span className="inline-block hover:scale-105 transition-transform duration-300 font-semibold">
                    {sliderContent[currentSlide].description}
                  </span>
                </p>
                {/* Hyper speed underline effect */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-yellow-300 to-yellow-100 opacity-0 hover:w-full hover:opacity-100 transition-all duration-500 ease-out shadow-lg"></div>
              </div>
            </div>

            {/* CTA Buttons with Hyper Speed Effects */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/study" className="group relative">
                <button className="relative px-8 py-4 bg-white text-red-600 font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-red-50">
                  <span className="relative flex items-center space-x-2">
                    {React.createElement(sliderContent[currentSlide].icon, { className: "h-6 w-6 group-hover:scale-110 transition-transform duration-300" })}
                    <span className="group-hover:font-bold transition-all duration-300">{sliderContent[currentSlide].cta}</span>
                  </span>
                </button>
              </Link>
              <Link href="/debates" className="group relative">
                <button className="relative px-8 py-4 bg-transparent border-2 border-white text-white font-semibold text-lg rounded-xl hover:bg-white hover:text-red-600 transition-all duration-300 hover:scale-105">
                  <span className="relative flex items-center space-x-2">
                    {React.createElement(sliderContent[currentSlide].iconSecondary, { className: "h-6 w-6 group-hover:scale-110 transition-transform duration-300" })}
                    <span className="group-hover:font-bold transition-all duration-300">{sliderContent[currentSlide].ctaSecondary}</span>
                  </span>
                </button>
              </Link>
            </div>

            {/* Stats with Hyper Speed Effects */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group relative">
                  <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                    <div className="relative">
                      <stat.icon className="h-8 w-8 text-yellow-300 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                      <div className="text-3xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">
                        {stat.value}
                      </div>
                      <div className="text-white text-sm group-hover:text-yellow-200 transition-colors duration-300 font-semibold">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10">
          <HeartIcon className="h-6 w-6 text-yellow-300 opacity-60 animate-bounce" />
        </div>
        <div className="absolute top-40 right-20">
          <LightBulbIcon className="h-5 w-5 text-white opacity-50 animate-pulse" />
        </div>
        <div className="absolute bottom-40 left-20">
          <StarIcon className="h-6 w-6 text-yellow-300 opacity-60 animate-bounce delay-1000" />
        </div>
        <div className="absolute bottom-20 right-10">
          <GlobeAltIcon className="h-4 w-4 text-white opacity-50 animate-pulse delay-500" />
        </div>

        {/* Slider Navigation */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40">
          <div className="flex items-center space-x-4">
            {/* Previous Button */}
            <button
              onClick={prevSlide}
              className="p-2 bg-white/20 rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 group"
            >
              <ChevronLeftIcon className="h-5 w-5 text-white" />
            </button>

            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {sliderContent.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide
                    ? 'bg-yellow-300'
                    : 'bg-white/50 hover:bg-white/70'
                    }`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              className="p-2 bg-white/20 rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 group"
            >
              <ChevronRightIcon className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </section>



      {/* Life Overview Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Tổng quan cuộc đời Bác Hồ</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Những cột mốc quan trọng trong hành trình vì độc lập tự do của dân tộc</p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-red-200 via-red-300 to-red-200 -translate-x-1/2" />
            <div className="space-y-10">
              {lifeTimeline.map((item, idx) => (
                <div key={idx} className="relative flex flex-col md:flex-row items-center md:items-stretch">
                  <div className="hidden md:block w-1/2" />
                  <div className="z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white border border-red-200 shadow-md mx-6">
                    <CalendarDaysIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="hidden md:block w-1/2" />

                  <div className={`w-full md:w-[46%] ${idx % 2 === 0 ? 'md:ml-auto md:pr-10' : 'md:mr-auto md:pl-10'}`}>
                    <div className="group relative rounded-2xl border border-gray-100 bg-white/70 backdrop-blur p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-50 to-yellow-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative">
                        <div className="mb-4 relative w-full h-40 overflow-hidden rounded-xl">
                          <Image src={item.image} alt={item.title} fill className="object-cover" />
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-semibold rounded-full bg-red-600 text-white shadow-sm">{item.year}</span>
                          <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Audio Podcast Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Audio Podcast</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Lắng nghe những bản nhạc, câu chuyện gắn với thời đại Hồ Chí Minh</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {podcasts.map((pod, i) => (
              <div key={i} className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-44 w-full overflow-hidden">
                  <Image src={pod.cover} alt={pod.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-3 left-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 text-red-600 text-sm font-semibold shadow">
                    <MusicalNoteIcon className="w-4 h-4" />
                    {pod.duration}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-red-600 transition-colors">{pod.title}</h3>
                  <p className="text-gray-600 mb-4">{pod.subtitle}</p>
                  <div className="flex items-center gap-3">
                    <audio className="w-full" controls preload="none">
                      <source src={pod.src} type="audio/mpeg" />
                    </audio>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Slider Section */}
      <section className="py-20 relative overflow-hidden min-h-[500px] flex items-center">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 z-0"></div>

        {/* Content */}
        <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <ShieldCheckIcon className="h-16 w-16 text-yellow-300 mx-auto" />
            <blockquote className="text-3xl md:text-4xl font-bold text-white leading-relaxed drop-shadow-lg">
              "{quotes[currentQuoteIndex].text}"
            </blockquote>
            <cite className="text-xl text-red-100 font-medium drop-shadow-lg">
              — {quotes[currentQuoteIndex].author}
            </cite>
          </div>
        </div>

        {/* Quote Navigation */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <div className="flex items-center space-x-4">
            {/* Previous Button */}
            <button
              onClick={prevQuote}
              className="p-2 bg-white/20 rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 group"
            >
              <ChevronLeftIcon className="h-5 w-5 text-white" />
            </button>

            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {quotes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToQuote(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentQuoteIndex
                    ? 'bg-yellow-300'
                    : 'bg-white/50 hover:bg-white/70'
                    }`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={nextQuote}
              className="p-2 bg-white/20 rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 group"
            >
              <ChevronRightIcon className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 opacity-20 z-20">
          <SparklesIcon className="h-12 w-12 text-yellow-300" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-20 z-20">
          <FireIcon className="h-16 w-16 text-yellow-300" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Tại sao chọn chúng tôi?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Khám phá những tính năng độc đáo giúp bạn học tập và hiểu sâu hơn về tư tưởng Hồ Chí Minh
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group text-center">
                <div className="relative">
                  <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <feature.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-yellow-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Sẵn sàng bắt đầu hành trình?
            </h2>
            <p className="text-xl text-gray-600">
              Tham gia cộng đồng học tập và khám phá tư tưởng Hồ Chí Minh ngay hôm nay
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <button className="px-8 py-4 bg-red-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-red-700">
                  Đăng ký miễn phí
                </button>
              </Link>
              <Link href="/study">
                <button className="px-8 py-4 bg-white border-2 border-red-600 text-red-600 font-semibold text-lg rounded-xl hover:bg-red-600 hover:text-white transition-all duration-300 hover:scale-105">
                  Khám phá ngay
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}