import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Globe, ArrowRight, ArrowLeft, User, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const BookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { city, date, time, isEnglish: initialLang } = location.state || {};
  
  const [isEnglish, setIsEnglish] = useState(initialLang || false);
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    referralCode: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cityData = {
    riyadh: { nameAr: 'الرياض', nameEn: 'Riyadh' },
    jeddah: { nameAr: 'جدة', nameEn: 'Jeddah' },
    dammam: { nameAr: 'الدمام', nameEn: 'Dammam' }
  };

  const timeSlots = {
    '16:00': { displayAr: '4:00 م', displayEn: '4:00 PM' },
    '17:00': { displayAr: '5:00 م', displayEn: '5:00 PM' },
    '18:00': { displayAr: '6:00 م', displayEn: '6:00 PM' }
  };

  const content = {
    ar: {
      backToDate: 'العودة لاختيار التاريخ',
      bookingDetails: 'تفاصيل الحجز',
      city: 'المدينة',
      date: 'التاريخ',
      time: 'الوقت',
      driverInfo: 'بيانات السائق',
      fullName: 'الاسم الكامل',
      fullNamePlaceholder: 'أدخل الاسم الكامل',
      mobile: 'رقم الجوال',
      mobilePlaceholder: '05XXXXXXXX',
      referralCode: 'كود الإحالة (اختياري)',
      referralPlaceholder: 'أدخل كود الإحالة',
      confirmBooking: 'تأكيد الحجز',
      lang: 'English',
      nameError: 'يرجى إدخال الاسم الكامل (كلمتين على الأقل)',
      mobileError: 'رقم الجوال غير صحيح. يجب أن يبدأ بـ 05 ويكون 10 أرقام'
    },
    en: {
      backToDate: 'Back to Date Selection',
      bookingDetails: 'Booking Details',
      city: 'City',
      date: 'Date',
      time: 'Time',
      driverInfo: 'Driver Information',
      fullName: 'Full Name',
      fullNamePlaceholder: 'Enter full name',
      mobile: 'Mobile Number',
      mobilePlaceholder: '05XXXXXXXX',
      referralCode: 'Referral Code (Optional)',
      referralPlaceholder: 'Enter referral code',
      confirmBooking: 'Confirm Booking',
      lang: 'العربية',
      nameError: 'Please enter full name (at least 2 words)',
      mobileError: 'Invalid mobile number. Must start with 05 and be 10 digits'
    }
  };

  const t = content[isEnglish ? 'en' : 'ar'];

  // Redirect if no booking data
  if (!city || !date || !time) {
    navigate('/');
    return null;
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name validation (at least 2 words)
    if (!formData.fullName.trim()) {
      newErrors.fullName = t.nameError;
    } else {
      const words = formData.fullName.trim().split(' ').filter(word => word.length > 0);
      if (words.length < 2) {
        newErrors.fullName = t.nameError;
      }
    }

    // Mobile validation (KSA format)
    const mobileRegex = /^05\d{8}$/;
    if (!formData.mobile.trim()) {
      newErrors.mobile = t.mobileError;
    } else if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = t.mobileError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      navigate('/booking-confirmation', {
        state: {
          city,
          date,
          time,
          driverInfo: formData,
          isEnglish
        }
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-pieship-yellow/10 to-background p-4 ${isEnglish ? 'ltr' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 max-w-md mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          {isEnglish ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          {t.backToDate}
        </Button>
        
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

      <div className="max-w-md mx-auto space-y-6">
        {/* Booking Summary */}
        <Card className="pieship-card p-6">
          <h2 className="font-semibold text-pieship-black mb-4">{t.bookingDetails}</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-pieship-gray">{t.city}:</span>
              <span className="font-medium text-pieship-black">
                {cityData[city as keyof typeof cityData][isEnglish ? 'nameEn' : 'nameAr']}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-pieship-gray">{t.date}:</span>
              <span className="font-medium text-pieship-black">
                {format(new Date(date), 'PPP', { locale: isEnglish ? undefined : ar })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-pieship-gray">{t.time}:</span>
              <span className="font-medium text-pieship-black">
                {timeSlots[time as keyof typeof timeSlots][isEnglish ? 'displayEn' : 'displayAr']}
              </span>
            </div>
          </div>
        </Card>

        {/* Driver Form */}
        <Card className="pieship-card p-6">
          <h2 className="font-semibold text-pieship-black mb-4">{t.driverInfo}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-pieship-black">
                {t.fullName}
              </Label>
              <div className="relative">
                <User className="absolute right-3 top-3 w-4 h-4 text-pieship-gray" />
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder={t.fullNamePlaceholder}
                  className={`pr-10 ${errors.fullName ? 'border-red-500' : ''}`}
                  dir={isEnglish ? 'ltr' : 'rtl'}
                />
              </div>
              {errors.fullName && (
                <p className="text-red-500 text-sm">{errors.fullName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile" className="text-pieship-black">
                {t.mobile}
              </Label>
              <div className="relative">
                <Phone className="absolute right-3 top-3 w-4 h-4 text-pieship-gray" />
                <Input
                  id="mobile"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  placeholder={t.mobilePlaceholder}
                  type="tel"
                  className={`pr-10 ${errors.mobile ? 'border-red-500' : ''}`}
                  dir="ltr"
                />
              </div>
              {errors.mobile && (
                <p className="text-red-500 text-sm">{errors.mobile}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="referralCode" className="text-pieship-gray">
                {t.referralCode}
              </Label>
              <Input
                id="referralCode"
                value={formData.referralCode}
                onChange={(e) => handleInputChange('referralCode', e.target.value)}
                placeholder={t.referralPlaceholder}
                dir="ltr"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-14 pieship-gradient text-pieship-black font-semibold text-lg mt-6"
              size="lg"
            >
              {t.confirmBooking}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default BookingForm;