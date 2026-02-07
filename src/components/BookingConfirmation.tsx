import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Globe, 
  Calendar as CalendarIcon, 
  MapPin, 
  Phone, 
  Home, 
  CheckCircle,
  Download,
  MessageCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { city, date, time, driverInfo, isEnglish: initialLang } = location.state || {};
  
  const [isEnglish, setIsEnglish] = useState(initialLang || false);

  const cityData = {
    riyadh: {
      nameAr: 'الرياض',
      nameEn: 'Riyadh',
      officeName: 'مكتب PIESHIP - الرياض',
      address: 'الرياض - حي السلي',
      mapsUrl: 'https://maps.app.goo.gl/TVFqRWki8nfnmuaw8',
      supervisorName: 'عبدالرحمن',
      supervisorMobile: '966558551076'
    },
    jeddah: {
      nameAr: 'جدة',
      nameEn: 'Jeddah',
      officeName: 'مكتب PIESHIP - جدة',
      address: 'جدة - حي الروابي',
      mapsUrl: 'https://maps.app.goo.gl/4XnMD3Dkhh1UE3o2A?g_st=iw',
      supervisorName: 'محمد محسن',
      supervisorMobile: '966573551003'
    },
    dammam: {
      nameAr: 'الدمام',
      nameEn: 'Dammam',
      officeName: 'مكتب PIESHIP - الدمام',
      address: 'الدمام - حي المنار',
      mapsUrl: 'https://maps.app.goo.gl/6mKFg6fVpLcxJgkP9',
      supervisorName: 'عبدالرحيم ابو الحسن',
      supervisorMobile: '966510029651'
    },
    makkah: {
      nameAr: 'مكة المكرمة',
      nameEn: 'Makkah',
      officeName: 'مكتب PIESHIP - مكة المكرمة',
      address: 'مكة المكرمة - حي البحيرات',
      mapsUrl: 'https://maps.app.goo.gl/GtV4TMEqfRGyhQfi8?g_st=com.google.maps.preview.copy',
      supervisorName: 'ايمن ادم',
      supervisorMobile: '966573542070'
    }
  };

  const timeSlots = {
    '12:00': { displayAr: '12:00 م', displayEn: '12:00 PM' },
    '14:00': { displayAr: '2:00 م', displayEn: '2:00 PM' },
    '17:00': { displayAr: '5:00 م', displayEn: '5:00 PM' }
  };

  const content = {
    ar: {
      title: 'تم تأكيد الحجز 🎉',
      confirmed: 'تم تأكيد حجزك بنجاح',
      details: 'تفاصيل الحجز',
      driverName: 'اسم السائق',
      city: 'المدينة',
      date: 'التاريخ',
      time: 'الوقت',
      office: 'المكتب',
      supervisor: 'المشرف',
      whatsapp: 'واتساب',
      actions: 'الإجراءات',
      addToCalendar: 'إضافة إلى التقويم',
      getDirections: 'عرض الاتجاهات',
      callSupervisor: 'اتصال بالمشرف',
      newBooking: 'حجز جديد',
      confirmationSent: 'تم إرسال رسالة تأكيد إلى رقمك',
      lang: 'English'
    },
    en: {
      title: 'Booking Confirmed 🎉',
      confirmed: 'Your booking has been confirmed successfully',
      details: 'Booking Details',
      driverName: 'Driver Name',
      city: 'City',
      date: 'Date',
      time: 'Time',
      office: 'Office',
      supervisor: 'Supervisor',
      whatsapp: 'WhatsApp',
      actions: 'Actions',
      addToCalendar: 'Add to Calendar',
      getDirections: 'Get Directions',
      callSupervisor: 'Call Supervisor',
      newBooking: 'New Booking',
      confirmationSent: 'Confirmation message sent to your number',
      lang: 'العربية'
    }
  };

  const t = content[isEnglish ? 'en' : 'ar'];

  // Redirect if no booking data
  if (!city || !date || !time || !driverInfo) {
    navigate('/');
    return null;
  }

  const cityInfo = cityData[city as keyof typeof cityData];
  const timeInfo = timeSlots[time as keyof typeof timeSlots];

  // Generate ICS file content
  const generateICS = () => {
    const startDate = new Date(date);
    const [hours, minutes] = time.split(':');
    startDate.setHours(parseInt(hours), parseInt(minutes));
    
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1); // 1 hour duration

    const formatICSDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//PIESHIP//Driver Training//EN
BEGIN:VEVENT
UID:${Date.now()}@pieship.com
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:PIESHIP Driver Training - ${cityInfo[isEnglish ? 'nameEn' : 'nameAr']}
DESCRIPTION:Driver training session with ${cityInfo.supervisorName}\\nContact: ${cityInfo.supervisorMobile}
LOCATION:${cityInfo.address}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pieship-training.ics';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-success-light to-background p-4 ${isEnglish ? 'ltr' : ''}`}>
      {/* Header */}
      <div className="flex justify-end mb-6 max-w-md mx-auto">
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
        {/* Success Header */}
        <div className="text-center">
          <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-pieship-black mb-2">
            {t.title}
          </h1>
          <p className="text-pieship-gray">
            {t.confirmed}
          </p>
        </div>

        {/* Booking Details */}
        <Card className="pieship-card p-6">
          <h2 className="font-semibold text-pieship-black mb-4">{t.details}</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-pieship-gray">{t.driverName}:</span>
              <span className="font-medium text-pieship-black">{driverInfo.fullName}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-pieship-gray">{t.city}:</span>
              <span className="font-medium text-pieship-black">
                {cityInfo[isEnglish ? 'nameEn' : 'nameAr']}
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
                {timeInfo[isEnglish ? 'displayEn' : 'displayAr']}
              </span>
            </div>
            
            <hr className="border-pieship-gray-light" />
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-pieship-gray">{t.office}:</span>
                <span className="font-medium text-pieship-black text-right">
                  {cityInfo.address}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-pieship-gray">{t.supervisor}:</span>
                <div className="text-right flex flex-col">
                  <div className="font-medium text-pieship-black">{cityInfo.supervisorName}</div>
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-sm text-pieship-gray">{cityInfo.supervisorMobile}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs bg-green-500 hover:bg-green-600 text-white border-green-500"
                      onClick={() => window.open(`https://wa.me/${cityInfo.supervisorMobile}`, '_blank')}
                    >
                      <MessageCircle className="w-3 h-3 mr-1" />
                      {t.whatsapp}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <Card className="pieship-card p-6">
          <h3 className="font-semibold text-pieship-black mb-4">{t.actions}</h3>
          <div className="space-y-3">
            <Button
              onClick={generateICS}
              className="w-full h-12 pieship-gradient text-pieship-black font-medium"
              size="lg"
            >
              <Download className="w-5 h-5 mr-3" />
              {t.addToCalendar}
            </Button>
            
            <Button
              onClick={() => window.open(cityInfo.mapsUrl, '_blank')}
              variant="outline"
              className="w-full h-12"
              size="lg"
            >
              <MapPin className="w-5 h-5 mr-3" />
              {t.getDirections}
            </Button>
            
            <Button
              onClick={() => window.open(`tel:${cityInfo.supervisorMobile}`)}
              variant="outline"
              className="w-full h-12"
              size="lg"
            >
              <Phone className="w-5 h-5 mr-3" />
              {t.callSupervisor}
            </Button>
          </div>
        </Card>

        {/* New Booking Button */}
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          className="w-full h-12"
          size="lg"
        >
          <Home className="w-5 h-5 mr-3" />
          {t.newBooking}
        </Button>

        {/* Footer */}
        <div className="text-center mt-8 text-pieship-gray text-sm">
          PIESHIP © 2025 - نشكركم لاختياركم خدماتنا
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
