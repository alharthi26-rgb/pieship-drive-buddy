
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Globe, ArrowRight, ArrowLeft, Clock } from 'lucide-react';
import { format, addDays, isToday, isBefore } from 'date-fns';
import { ar } from 'date-fns/locale';

const cityData = {
  riyadh: {
    nameAr: 'الرياض',
    nameEn: 'Riyadh',
    officeName: 'مكتب PIESHIP - الرياض',
    address: 'الرياض - حي السلي',
    mapsUrl: 'https://maps.app.goo.gl/wA4jNCwVCMhuSqyYA?g_st=iwb',
    supervisorName: 'سيف جابر',
    supervisorMobile: '0571345377'
  },
  jeddah: {
    nameAr: 'جدة',
    nameEn: 'Jeddah',
    officeName: 'مكتب PIESHIP - جدة',
    address: 'جدة - حي الروابي',
    mapsUrl: 'https://maps.app.goo.gl/4XnMD3Dkhh1UE3o2A?g_st=iw',
    supervisorName: 'محمد محسن',
    supervisorMobile: '0573542070'
  },
  dammam: {
    nameAr: 'الدمام',
    nameEn: 'Dammam',
    officeName: 'مكتب PIESHIP - الدمام',
    address: 'الدمام - حي المنار',
    mapsUrl: 'https://maps.app.goo.gl/6mKFg6fVpLcxJgkP9',
    supervisorName: 'عبدالرحيم ابو الحسن',
    supervisorMobile: '0510029651'
  },
  makkah: {
    nameAr: 'مكة المكرمة',
    nameEn: 'Makkah',
    officeName: 'مكتب PIESHIP - مكة المكرمة',
    address: 'مكة المكرمة',
    mapsUrl: 'https://maps.app.goo.gl/GtV4TMEqfRGyhQfi8?g_st=com.google.maps.preview.copy',
    supervisorName: 'محمد ادم',
    supervisorMobile: '0573542070'
  }
};

const timeSlots = {
  riyadh: [
    { time: '16:00', displayAr: '4:00 م', displayEn: '4:00 PM' },
    { time: '19:00', displayAr: '7:00 م', displayEn: '7:00 PM' }
  ],
  jeddah: [
    { time: '16:00', displayAr: '4:00 م', displayEn: '4:00 PM' },
    { time: '17:00', displayAr: '5:00 م', displayEn: '5:00 PM' },
    { time: '18:00', displayAr: '6:00 م', displayEn: '6:00 PM' }
  ],
  dammam: [
    { time: '16:00', displayAr: '4:00 م', displayEn: '4:00 PM' },
    { time: '17:00', displayAr: '5:00 م', displayEn: '5:00 PM' },
    { time: '18:00', displayAr: '6:00 م', displayEn: '6:00 PM' }
  ],
  makkah: [
    { time: '16:00', displayAr: '4:00 م', displayEn: '4:00 PM' },
    { time: '17:00', displayAr: '5:00 م', displayEn: '5:00 PM' },
    { time: '18:00', displayAr: '6:00 م', displayEn: '6:00 PM' }
  ]
};

const BookingCity = () => {
  const { cityKey } = useParams();
  const navigate = useNavigate();
  const [isEnglish, setIsEnglish] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedSlot, setSelectedSlot] = useState<string>();
  
  const city = cityData[cityKey as keyof typeof cityData];

  useEffect(() => {
    if (!city) {
      navigate('/');
    }
  }, [city, navigate]);

  if (!city) return null;

  const content = {
    ar: {
      backToHome: 'العودة للرئيسية',
      selectDate: 'اختر التاريخ',
      availableTimes: 'الأوقات المتاحة',
      confirmBooking: 'تأكيد الحجز',
      noDate: 'يرجى اختيار التاريخ أولاً',
      lang: 'English'
    },
    en: {
      backToHome: 'Back to Home',
      selectDate: 'Select Date',
      availableTimes: 'Available Times',
      confirmBooking: 'Confirm Booking',
      noDate: 'Please select a date first',
      lang: 'العربية'
    }
  };

  const t = content[isEnglish ? 'en' : 'ar'];

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSlot(undefined);
  };

  const handleSlotSelect = (time: string) => {
    setSelectedSlot(time);
  };

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedSlot) return;
    
    navigate('/booking-form', {
      state: {
        city: cityKey,
        date: selectedDate,
        time: selectedSlot,
        isEnglish
      }
    });
  };

  const isDateDisabled = (date: Date) => {
    // Disable past dates, today, and Fridays (day 5 in JS, day 0 is Sunday)
    return isBefore(date, new Date()) || isToday(date) || date.getDay() === 5;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-pieship-yellow/10 to-background p-4 ${isEnglish ? 'ltr' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 max-w-2xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="gap-2"
        >
          {isEnglish ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          {t.backToHome}
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

      <div className="max-w-2xl mx-auto space-y-6">
        {/* City Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-pieship-black">
            {isEnglish ? city.nameEn : city.nameAr}
          </h1>
        </div>

        {/* Date Selection */}
        <Card className="pieship-card p-6">
          <h3 className="font-semibold text-pieship-black mb-4">{t.selectDate}</h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            locale={isEnglish ? undefined : ar}
            fromDate={addDays(new Date(), 1)}
            toDate={new Date(2025, 11, 31)} // December 31st, 2025
            className="w-full"
          />
        </Card>

        {/* Time Slots */}
        {selectedDate && (
          <Card className="pieship-card p-6">
            <h3 className="font-semibold text-pieship-black mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-pieship-yellow" />
              {t.availableTimes}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {timeSlots[cityKey as keyof typeof timeSlots]?.map((slot) => (
                <Button
                  key={slot.time}
                  variant={selectedSlot === slot.time ? "default" : "outline"}
                  className={`h-12 text-lg ${
                    selectedSlot === slot.time 
                      ? 'pieship-gradient text-pieship-black border-pieship-yellow' 
                      : 'hover:border-pieship-yellow'
                  }`}
                  onClick={() => handleSlotSelect(slot.time)}
                >
                  {isEnglish ? slot.displayEn : slot.displayAr}
                </Button>
              ))}
            </div>
          </Card>
        )}

        {/* Confirm Button */}
        {selectedDate && selectedSlot && (
          <div className="sticky bottom-4">
            <Button
              onClick={handleConfirmBooking}
              className="w-full h-14 pieship-gradient text-pieship-black font-semibold text-lg"
              size="lg"
            >
              {t.confirmBooking}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCity;
