import { MapPin, Users, Calendar, Target, Award, Globe } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: MapPin,
      title: 'Kapsamlı Destinasyon Rehberi',
      description: 'Türkiye\'nin en güzel destinasyonları hakkında detaylı bilgiler, fotoğraflar ve kullanıcı yorumları.'
    },
    {
      icon: Calendar,
      title: 'Güncel Etkinlik Takvimi',
      description: 'Kültürel, sanatsal ve sosyal etkinlikleri takip edin, bilet satın alın ve unutulmaz deneyimler yaşayın.'
    },
    {
      icon: Users,
      title: 'Kullanıcı Deneyimleri',
      description: 'Gerçek kullanıcı yorumları ve puanlamaları ile en doğru bilgilere ulaşın.'
    },
    {
      icon: Globe,
      title: 'Çoklu Dil Desteği',
      description: 'Platform Türkçe, İngilizce, Almanca, Fransızca ve Arapça dillerinde hizmet vermektedir.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Destinasyon' },
    { number: '1000+', label: 'Konaklama Seçeneği' },
    { number: '800+', label: 'Restoran' },
    { number: '50+', label: 'Şehir' }
  ];

  const team = [
    {
      name: 'Ahmet Yılmaz',
      role: 'Proje Müdürü',
      description: 'Turizm sektöründe 15 yıllık deneyime sahip.'
    },
    {
      name: 'Elif Kaya',
      role: 'İçerik Uzmanı',
      description: 'Kültür ve turizm alanında uzman, içerik editörü.'
    },
    {
      name: 'Mehmet Demir',
      role: 'Teknik Ekip Lideri',
      description: 'Yazılım geliştirme ve sistem mimarisi uzmanı.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Hakkımızda
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
              Türkiye'nin turizm potansiyelini dijital platformda buluşturan, 
              kullanıcı dostu ve kapsamlı turist bilgilendirme sistemi
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Misyonumuz
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Türkiye Cumhuriyeti Kültür ve Turizm Bakanlığı bünyesinde geliştirilen 
                  bu platform, ülkemizin zengin kültürel mirasını ve doğal güzelliklerini 
                  dijital ortamda en iyi şekilde tanıtmayı hedeflemektedir.
                </p>
                <p>
                  Yerli ve yabancı turistlere güvenilir, güncel ve kapsamlı bilgiler 
                  sunarak turizm deneyimlerini zenginleştirmeyi, aynı zamanda yerel 
                  işletmelere dijital platformda yer alabilme imkanı sağlamayı amaçlıyoruz.
                </p>
                <p>
                  Sürdürülebilir turizm anlayışı çerçevesinde, kültürel değerlerin 
                  korunması ve gelecek nesillere aktarılması konusunda sorumluluk 
                  bilinciyle hareket ediyoruz.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/images/about-mission.jpg" 
                alt="Misyonumuz"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Platform Özellikleri
            </h2>
            <p className="text-lg text-gray-600">
              Kullanıcılarımıza sunduğumuz kapsamlı hizmetler
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary-100 rounded-lg p-3">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Platformumuzda
            </h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-primary-100">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ekibimiz
            </h2>
            <p className="text-lg text-gray-600">
              Proje arkasındaki deneyimli ekip
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-12 h-12 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-2">
                  {member.role}
                </p>
                <p className="text-gray-600">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Değerlerimiz
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Güvenilirlik
              </h3>
              <p className="text-gray-600">
                Doğru ve güncel bilgiler sunarak kullanıcılarımızın güvenini kazanıyoruz.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Kalite
              </h3>
              <p className="text-gray-600">
                Yüksek kalite standartlarında hizmet sunarak mükemmel kullanıcı deneyimi sağlıyoruz.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Kullanıcı Odaklılık
              </h3>
              <p className="text-gray-600">
                Kullanıcılarımızın ihtiyaçlarını ön planda tutarak sürekli gelişim gösteriyoruz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 