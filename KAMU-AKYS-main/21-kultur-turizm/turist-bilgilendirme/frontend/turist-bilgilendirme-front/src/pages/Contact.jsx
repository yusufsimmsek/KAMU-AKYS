import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { ButtonLoader } from '../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
      reset();
    } catch (error) {
      toast.error('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900 text-white border-b border-white border-opacity-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              İletişim
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Sorularınız, önerileriniz veya destek talepleriniz için bizimle iletişime geçin
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                İletişim Bilgileri
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4 bg-white bg-opacity-5 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300">
                  <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-3">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Adres</h3>
                    <p className="text-gray-300">
                      T.C. Kültür ve Turizm Bakanlığı<br />
                      İsmet İnönü Bulvarı No: 32<br />
                      06100 Emek / ANKARA
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 bg-white bg-opacity-5 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300">
                  <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-3">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Telefon</h3>
                    <p className="text-gray-300">
                      +90 (312) 470 80 00<br />
                      Faks: +90 (312) 470 80 99
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 bg-white bg-opacity-5 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300">
                  <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-3">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">E-posta</h3>
                    <p className="text-gray-300">
                      info@turistrehberi.gov.tr<br />
                      destek@turistrehberi.gov.tr
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 bg-white bg-opacity-5 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300">
                  <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-3">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Çalışma Saatleri</h3>
                    <p className="text-gray-300">
                      Pazartesi - Cuma: 08:30 - 17:30<br />
                      Hafta Sonu: Kapalı
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Help */}
            <div className="bg-blue-500 bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-blue-500 border-opacity-20">
              <h3 className="font-semibold text-blue-400 mb-3">
                Hızlı Yardım
              </h3>
              <div className="space-y-2 text-sm text-blue-300">
                <p>• Teknik destek için: destek@turistrehberi.gov.tr</p>
                <p>• İçerik önerisi için: icerik@turistrehberi.gov.tr</p>
                <p>• İş birliği teklifleri için: ortaklik@turistrehberi.gov.tr</p>
                <p>• Basın ve medya için: basin@turistrehberi.gov.tr</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white bg-opacity-5 backdrop-blur-lg rounded-xl shadow-2xl border border-white border-opacity-10 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Bize Yazın
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Ad *
                  </label>
                  <input
                    {...register('firstName', { required: 'Ad gerekli' })}
                    type="text"
                    className="block w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-300"
                    placeholder="Adınız"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-400">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Soyad *
                  </label>
                  <input
                    {...register('lastName', { required: 'Soyad gerekli' })}
                    type="text"
                    className="block w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-300"
                    placeholder="Soyadınız"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-400">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  E-posta *
                </label>
                <input
                  {...register('email', { 
                    required: 'E-posta gerekli',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Geçerli bir e-posta adresi girin'
                    }
                  })}
                  type="email"
                  className="block w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-300"
                  placeholder="ornek@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Telefon
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="block w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-300"
                  placeholder="+90 5XX XXX XX XX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Konu *
                </label>
                <select
                  {...register('subject', { required: 'Konu seçimi gerekli' })}
                  className="block w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white transition-all duration-300"
                >
                  <option value="" className="bg-gray-800 text-white">Konu seçin</option>
                  <option value="general" className="bg-gray-800 text-white">Genel Sorular</option>
                  <option value="technical" className="bg-gray-800 text-white">Teknik Destek</option>
                  <option value="content" className="bg-gray-800 text-white">İçerik Önerisi</option>
                  <option value="partnership" className="bg-gray-800 text-white">İş Birliği</option>
                  <option value="other" className="bg-gray-800 text-white">Diğer</option>
                </select>
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-400">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Mesaj *
                </label>
                <textarea
                  {...register('message', { required: 'Mesaj gerekli' })}
                  rows={6}
                  className="block w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-300 resize-none"
                  placeholder="Mesajınızı buraya yazın..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-6 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <ButtonLoader className="mr-2" />
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Mesajı Gönder
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 