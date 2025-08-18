import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Globe } from 'lucide-react';

const cities = [
  { key: 'riyadh', nameAr: 'الرياض', nameEn: 'Riyadh' },
  { key: 'jeddah', nameAr: 'جدة', nameEn: 'Jeddah' },
  { key: 'dammam', nameAr: 'الدمام', nameEn: 'Dammam' }
];

const BookingWelcome = () => {
  const [isEnglish, setIsEnglish] = useState(false);
  const navigate = useNavigate();

  const handleCitySelect = (cityKey: string) => {
    navigate(`/book/${cityKey}`);
  };

  const content = {
    ar: {
      title: 'أهلاً بك في PIESHIP',
      subtitle: 'حان الوقت لحجز جلسة التدريب الخاصة بك. اختر مدينتك للمتابعة.',
      selectCity: 'اختر مدينتك',
      lang: 'English'
    },
    en: {
      title: 'Welcome to PIESHIP',
      subtitle: 'It\'s time to book your training session. Choose your city to continue.',
      selectCity: 'Select Your City',
      lang: 'العربية'
    }
  };

  const t = content[isEnglish ? 'en' : 'ar'];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-pieship-yellow/10 to-background p-4 ${isEnglish ? 'ltr' : ''}`}>
      {/* Language Toggle */}
      <div className="flex justify-end mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEnglish(!isEnglish)}
          className="gap-2"
        >
          <Globe className="w-4 h-4" />
          {t.lang}
        </Button>
      </div>

      <div className="max-w-md mx-auto">
        {/* PIESHIP Logo/Brand */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-pieship-yellow rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-pieship-black">P</span>
          </div>
          <h1 className="text-3xl font-bold text-pieship-black mb-2">
            {t.title}
          </h1>
          <p className="text-pieship-gray text-lg leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* City Selection */}
        <Card className="pieship-card p-6">
          <h2 className="text-xl font-semibold text-pieship-black mb-4">
            {t.selectCity}
          </h2>
          <div className="space-y-3">
            {cities.map((city) => (
              <Button
                key={city.key}
                onClick={() => handleCitySelect(city.key)}
                className="w-full h-16 pieship-gradient hover:opacity-90 text-pieship-black font-semibold text-lg"
                size="lg"
              >
                <MapPin className="w-5 h-5 mr-3" />
                {isEnglish ? city.nameEn : city.nameAr}
              </Button>
            ))}
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-pieship-gray text-sm">
          PIESHIP © 2025 - تدريب السائقين الجدد
        </div>
      </div>
    </div>
  );
};

export default BookingWelcome;